---
title: Android Application 이 실행 되기 까지 - apk 가 실행되는 과정
date: 2022-06-26
tag: android
author: 상민
---

#### 앱 설치
위와 같은 과정으로 만들어진 `.apk` 파일은 플레이 스토어 등을 통해서 배포되어 실제 사용자의 기기에 설치된다.
이제 이렇게 번들링 된 파일이 어떻게 실행되는지 그 과정을 알아보자.

#### Runtime
java application 의 경우 컴파일 완료된 bytecode (`.class`) 는 JVM 을 통해서 각 실행 환경에 맞는 기계어로 번역되고 실행된다.
안드로이드의 경우에는 apk 에 포함된 bytecode(`.dex`) 파일을 번역하고 실행하는 JVM 과 동일한 역할을 **Android runtime (ART)** 가 담당하고 있다.

> 리눅스 기반의 android 에서 JVM 을 사용하지 않고, Google 이 아닌 DVM & ART 등을 사용하는 이유는 크게
> - Oracle 과 엮인 JVM 의 라이선스 문제
> - Desktop 대비 배터리, 메모리 등의 제약이 있는 edge device 에서도 최적화된 성능
> 등을 꼽는 것으로 보인다. [참고](https://www.youtube.com/watch?v=ptjedOZEXPM)

#### DVM vs ART
ART 이전에도 **Dalvic Virtual Machine (DVM)** 이라는 안드로이드용 런타임이 존재했다. 하지만 DVM 의 Just-in-time 컴파일은 실제 런타임에 bytecode 의 기계어 번역이 발생하기 때문에 성능상의 한계가 있었고, ART 는 이 문제를 Ahead-of-time 컴파일로 해결하여 성능상의 이점을 주기 때문에 DVM 대신 ART 가 안드로이드의 주 런타임으로 자리잡게 되었다.

#### 앱 최초에 발생하는 일
안드로이드 플랫폼이 돌아가기 위해서는 가장 최초의 리눅스 커널이 부트될 때 boot loader 에서 [init process](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/cmds/app_process/app_main.cpp;l=173;drc=7acbc840668959d7d8a0ab05b33bdc3d2fcb433b) 가 실행된다.

이 init process 가 하는 일은 크게 시스템이 필요로 하는 다양한 daemon process 들을 만들고, Zygote 라는 Android Runtime 이 돌아가는 프로세스를 만드는 역할을 수행한다.
(daemon 프로세스의 경우 logging, low memory killer 등 다른 프로세스에서 발생하는 요청을 들어주거나 모니터링 하는 프로세스 들을 말한다.)


```cpp
// main.cpp 에서 실행되는 함수
// https://cs.android.com/android/platform/superproject/+/master:system/core/init/service.cpp;l=675;drc=7acbc840668959d7d8a0ab05b33bdc3d2fcb433b
Result<void> Service::Start() {
  // ...
  if (oom_score_adjust_ != DEFAULT_OOM_SCORE_ADJUST) {
    LmkdRegister(name_, proc_attr_.uid, pid_, oom_score_adjust_);
  }
  // ...
}
```

init process 는 또 다른 중요한 역할을 하는데, Android Runtime 구동을 위한 뿌리가 되는 [Zygote process](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/com/android/internal/os/Zygote.java) 를 만드는 역할을 수행한다.

```cpp
// ART 에서 이 프로세스가 zygote 를 위한 프로세스라면 ZygoteInit 클래스를 실행한다.
// https://cs.android.com/android/platform/superproject/+/master:frameworks/base/cmds/app_process/app_main.cpp;l=336;drc=7acbc840668959d7d8a0ab05b33bdc3d2fcb433b
if (zygote) {
        runtime.start("com.android.internal.os.ZygoteInit", args, zygote);
    }
```

Zygote process 의 경우 ART 위에서 돌아가는 소스 코드로, 안드로이드 앱을 위해 필요한 다양한 리소스를 미리 할당받아 놓는 linux process 이다. 이 process 는 이제 슬슬 우리에게 익숙한 android system server 프로세스들을 시작하는 등의 역할을 하며 우리가 새로운 App Process 에 대한 요청을 보낼 때 마다 스스로를 Fork 하여 복제된 프로세스를 만들고 그 위에서 App 이 직접 구동되도록 도와주는 진짜 태아와 같은 프로세스라고 볼 수 있다.

생성된 App Process 는 생성하며 요청된 activity 를 생성하며 앱이 실제로 구동되어 돌아가게 된다 (여기서 부터 힘이 떨어져서 설명의 퀄리티가 떨어진다... 다음 글을 통해서 보충해 보도록 하겠다)

#### 참고한 글
- https://medium.com/android-news/android-application-launch-explained-from-zygote-to-your-activity-oncreate-8a8f036864b
- https://www.charlezz.com/?p=42686
- https://source.android.com/devices/tech/dalvik
- https://stackoverflow.com/questions/34651015/what-is-systemserver-for-android






