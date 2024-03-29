---
title: Gradle 너무 헷갈려 - 2 
date: 2021-12-30
tag: bad-writing, gradle
author: 상민
---

> Java / Kotlin 으로 이루어진 프로젝트를 사용할 때 자주  `build.gradle` 파일을 마주하게 된다. 새 프로젝트를 구성할 때 보통 IDE 의 힘을 빌려 구성하는 나약한(..)  내 모습을 벗어나고자 Gradle 에 대해 공부한 내용들을 간단하게 정리해보려고 한다. 혼자 생각을 정리해보는 맥락에서 쓴 글이라 문법에 대한 설명이 충분하지 않을 수 있다.

이번 글에서는 내가 삽질하며 이해한 부분을 바탕으로 gradle 에서 언급되는 task 의 대략적인 느낌을 간단한 코드와 함께 설명하려 한다.

## How gradle works
- gradle 과 같은 빌드 구성 프레임 워크는 `일` 을 어떻게 진행할 수 있는지 구체적으로 적어줄 수 있도록 도와준다.
  - e.g. 난 실행가능한 안드로이드 apk 파일을 얻고 싶어. 그럼 우선 내 코드들의 어노테이션을 전처리하고, 코드를 컴파일 하여 바이트 코드로 만든 후, 필요한 리소스 파일을 복사해서, 하나로 합치고 압축하여 실행가능한 apk 를 만들어야 해.
  - 위 예시처럼 내가 하고자 하는 `일` 은 다른 `일` 들에 의존적이므로 어떻게 원하는 `일` 을 완료할 수 있는지 수행 방법을 기록해야 한다. gradle 이 바로 이 역할을 하게 된다.


### Tasks
- Task 는 gradle 에서 `일` 을 의미한다. java 코드를 컴파일 하거나, 앱 배포를 위한 apk 파일을 뽑아내거나, 코드 퀄리티를 확인하는 린트를 돌리거나 등등..
- 각 Task 들은 서로간의 의존성이 존재하게 된다. java 코드를 컴파일 해야, apk 파일을 뽑을 수 있는 경우 처럼 말이다.
- 이런 Task 의 의존성을 명시하는 방법은 절차적으로 명시하는 방법과, 선언적으로 명시하는 방법이 있다.
  - 절차적: A를 하고나서 B를하고 C를 해
  - 선언적: B는 A 가 완료되어있어야 한다. C는 B 가 완료되어있어야 한다.
- gradle 은 선언적으로 task 간의 의존성을 명시하는 방법을 제공한다.
- gradle 은 선언적인 Task 간의 의존성을 Graph 를 만들고 (Configuration) 사용자가 완료하고자 하는 Task 를 이야기 하면 관련된 Task 를 순차적으로 실행시켜주는 역할을 한다.


#### task 를 정의하는 방법
gradle 에서 새로운 태스크를 만드는 방법은 아래와 같다.

```kotlin
tasks.register("task0") {
    doFirst {
        println("task0 start") // p0
    }

    println("task0 evaluated while gradle configuration") // p1

    doLast {
        println("task0 start") // p2
    }
}

tasks.register("task1") {
    dependsOn += "task0"

    doFirst {
        println("task1 start")
    }

    doLast {
        println("task1 end")
    }
}
```

task0, task1 이라는 새로운 태스크를 만들었다. task0 이 평가되는 순간 이 태스크는 시작 전 / 후에 어떤 일을 해야하는지 콜백을 등록하며, 평가하는 단계에서 p1 이 출력된다 (p1 은 태스크를 실행할 때 출력되는 것이 아니라, gradle 에서 task 를 configure 할 때 출력된다는 것을 잊지 말아야 한다.)

task1 의 경우 task0 에 의존성을 가지고 있으므로 꼭 task0 을 실행하고 나서 실행되게 된다.
따라서 gradle 에 task1을 실행한다면 아래와 같은 결과를 볼 수 있다.

```shell
$ ./gradlew task1
task1 evaluated while gradle configuration

> Task :task0
task0 start
task0 start

> Task :task1
task1 start
task1 end

BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
```

#### custom task type 을 정의하기
앞서 정의한 task 는 빈 껍데기와 다름 없다. task 의 **알맹이** 에 해당하는 부분은 없고, 의존성이나 한낱 실행 전 후 의 콜백 정도만 등록하는 수준이다. 이런 껍데기가 아닌 절차적으로 실제 산출물을 만들어 내는 **알맹이** 를 추가하고 싶다면 custom task type 추가해야 한다.

```kotlin
tasks.register<Copy>("copy") {
    from("src/from")
    into("src/to")
}
```

copy 라는 절차가 정의되어있는 task type 은 from 으로 넘겨진 dir 의 내부를 into dir로 복사한다.
이런 식으로 미리 정의된 task type 들이 존재하지만, 내가 원하는 새로운 태스크에 대해서도 custom task type 을 만들 수 있다.

```kotlin
// build.gradle.kts
abstract class CustomTask : DefaultTask() {
    @TaskAction
    fun test() {
        println("이건 내가 짠 custom task type 으로 만든 태스크이다.")
        println("여기서 내가 원하는 절차적인 행동을 적어줄 수 있다.")
    }
}

tasks.register<CustomTask>("test")
```

실행 시 아래와 같다.

```shell
./gradlew test

> Task :test
이건 내가 짠 custom task type 으로 만든 태스크이다.
여기서 내가 원하는 절차적인 행동을 적어줄 수 있다.

BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
```

## 마무리
Gradle 에서 어떻게 `일` 을 만들고 관리하는지 확인해 보았다. 선언적인 dependencies 를 정의하는 방법과 실제 내부의 절차적인 순서를 추상화하는 Task Type 을 통해 gradle 은 새로운 일을 확장성 있게 추가할 수 있는 것으로 보인다.
다음 글에서는 이런 task 들을 모듈화하고 재사용 가능하게 도와주는 등 프로젝트에 필요한 재사용가능한 툴링을 적용하는 plugin 을 확인해 볼 것이다.

#### 쓰면서 본 글
- https://docs.gradle.org/current/userguide/build_lifecycle.html
- https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:configuring_tasks
- https://docs.gradle.org/current/userguide/custom_tasks.html
