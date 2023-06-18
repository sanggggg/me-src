---
title: Gradle 너무 헷갈려 - 3
date: 2022-02-28
tag: bad-writing, gradle
author: 상민
---

이번 글에서는 task 들을 모듈화 하여 재사용 가능한 (배포 가능한) 형태로 배포할 수 있게 도와주는 gradle plugin 기능에 대해 알아보려 한다.

> 아래에 나오는 글의 예제는 groovy 가 아닌 gradle kotlin dsl 을 기준으로 작성되있음을 참고 부탁드립니다.

## Gradle Plugin

gradle plugin 은 `build.gradle.kts` 에 `plugins` block 을 통해서 추가할 수 있다.

```kotlin
plugins {
    // 추가하고 싶은 플러그인 기입
}
```

이때 plugins 블록에 프로젝트의 자바 라이브러리 개발을 도와주는 task 및 설정을 추가해주는 `java-library` 플러그인을 추가해보자.

```kotlin
plugins {
    `java-library`
}
```

추가한 후 `gradle tasks` 를 입력해 보면 입력 전과 달리 자바 라이브러리 컴파일 및 테스트 실행 등을 위한 태스크가 추가되었음을 알 수 있다.

```shell
> ./gradlew tasks

> Task :tasks

------------------------------------------------------------
Tasks runnable from root project 'gradle-study'
------------------------------------------------------------

Build tasks
-----------
assemble - Assembles the outputs of this project.
build - Assembles and tests this project.
buildDependents - Assembles and tests this project and all projects that depend on it.
buildKotlinToolingMetadata - Build metadata json file containing information about the used Kotlin tooling
buildNeeded - Assembles and tests this project and all projects it depends on.
classes - Assembles main classes.
clean - Deletes the build directory.
jar - Assembles a jar archive containing the main classes.
testClasses - Assembles test classes.
# ...이후 생략
```

위에서 본 것 처럼 gradle plugin 은 내 프로젝트를 위해 필요한 task 들을 쉽게 임포트해서 내 프로젝트에서 사용할 수 있게 도와주는 역할은 한다.

예를 들자면, 위 예시처럼 java library 를 개발하고 싶다면 java compile, 자동화 테스트 실행, jar 파일로 프로젝트 산출물을 만드는 등의 task 들을 직접 설정할 필요 없이, `java-library` plugin 을 추가하는 것 만으로도 가능해지는 것이다.
안드로이드 개발이라면 android gradle plugin 을 추가하면 apk 로 빌드하거나 앱 파일을 서명하거나 등등의 태스크가 추가될 것이고..


## Custom Gradle plugin

앞서 plugin 의 역할을 확인해 보았으니, 이제 직접 gradle plugin 을 만들어보자.

```kotlin
// build.gradle.kts
class HelloPlugin: Plugin<Project> {
    override fun apply(project: Project) {
        project.task("hello") {
            doLast {
                println("hello")
            }
        }
    }
}

apply<HelloPlugin>()
```

plugin 은 apply 메서드를 오버라이드 하는 형태로 구현된다. 이 함수에 넘어오는 project 에 대해서 task 를 추가하는 등의 일을 할 수 있는 것이다.
정의된 task 를 `apply()` (`plugins {}` 블록과 유사하지만, 해당 스크립트 내에서 선언된 plugin 적용을 위해서는 `apply` 를 써야 하는 것으로 보인다. 확실치는 않다) 를 통해 적용 시킨다. 이제 프로젝트의 task 를 보면 hello 가 추가됨을 확인할 수 있다.

```shell
> ./gradlew hello

> Task :hello
hello

BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
```

## 마무리 

gradle plugin 은 프로젝트 설정 자체를 자유자재로 할 수 있게 도와주므로, 단순 task 의 추가 뿐 아닌 task 의 dependsOn 을 자유자재로 건드리면서
- build task 가 끝난 뒤 자동으로 라이선스 파일을 만들어주는 plugin 이라던지
- java compile 전에 protobuf 같은 직렬화 규칙 파일을 자바 코드로 변환해주는 task 를 자동으로 추가하는 plugin 이라던지

등등 사용자 입장에서는 플러그인 추가만으로도 부가 작업 없이 원하는 task 가 원하는 장소에 자연스럽게 추가되는 이점을 제공할 수도 있다.
이런 부분들에서 gradle 이 task 의존성 모델링 으로 프로젝트를 구성하면서 얻는 큰 이점으로 보였다.

이 글에서 설명된 기능들 외에도 extension 추가를 통한 사용자가 직접 plugin 의 작동 방식을 바꿀 수 있게 도와주는 등 다양하고 강력한 기능을 제공해준다.
이런 내용들은 아래 레퍼런스에서 좀 더 찾아볼 수 있을 것이다.

#### 쓰면서 본 글들
- https://docs.gradle.org/current/userguide/custom_plugins.html
- https://docs.gradle.org/current/samples/sample_building_kotlin_libraries.html
