---
title: Gradle 너무 헷갈려 - 1 
date: 2021-12-09
tag: bad-writing, gradle
author: 상민
---

Java / Kotlin 으로 이루어진 프로젝트를 사용할 때 자주  `build.gradle` 파일을 마주하게 된다. 새 프로젝트를 구성할 때 보통 IDE 의 힘을 빌려 구성하는 나약한(..)  내 모습을 벗어나고자 Gradle 에 대해 공부한 내용들을 간단하게 정리해보려고 한다. 혼자 생각을 정리해보는 맥락에서 쓴 글이라 문법에 대한 설명이 충분하지 않을 수 있다.

## Gradle 등장 맥락
간단한 프로젝트는 하나의 파일과, 하나의 환경 안에서만 잘 작동하여도 되어 그 결과물을 컴파일 하고 바이너리를 추출하는 과정들이 크게 번거롭지 않다.
```shell
> javac Test.java && java Test` 
> g++ test.cpp && ./a.out`
```

### 복잡한 프로젝트를 어떻게 컴파일 하는가?
복잡한 프로젝트는 수많은 코드 파일들이 존재한다. 일부는 내가 작성한 코드일 수도 있고 일부는 외부에서 작성된 라이브러리일 수도 있다. 복잡한 프로젝트를 컴파일하고 바이너리를 추출하기 위해서는 어떤 외부 라이브러리들이 사용되며, 이 코드들을 어떻게 연결할지 그 빌드 과정을 구성하고 손쉽게 빌드할 수 있어야 한다.

또한 복잡한 프로젝트는 결과물을 뽑아내는 환경을 다양하게 하였을 때 그 환경에 따른 결과물을 손쉽게 뽑아내고 싶은 상황들(테스팅 환경 / 프로덕션 환경의 분리 등) 이나 반복적인 작업을 빌드 전에 처리하고 싶은 상황들(자동화 테스트, 린트 등)이 등장하게 된다.

위 요구사항들을 효율적으로 해결하기 위해서 Build Automation 을 제공하는 소프트웨어를 사용하게된다.

---
## Gradle 
Gradle 은 앞서 말한 Build Automation 을 제공하는 툴이다. Gradle 은 프로젝트 빌드를 위해 필요한 과정들을 쪼개어 Task 라는 단위로 쪼개고, 이 Task 들의 의존성을 기술하는 방식으로 빌드 과정을 모델링할 수 있게 도와준다.

### Task 
각 Task 는 Actions, Inputs, Outputs 로 나타낼 수 있다. 이 Task 는 어떤 Inputs 를 받아 Actions 를 취하고 Outputs 를 뱉어낸다 와 같은 느낌으로. 모든 태스크 들이 이 요소들을 전부 가지고 있어야 하는 것은 아니며 이 요소들은 태스크가 어떤 일을 하길 원하는 가에 따라 사용하면 된다. 위 방식을 통해 빌드 과정 모델링은 절차적이지 않고, Task Graph 의 선언에 따라 선언적인 빌드 모델이 되고, 이것이 gradle 의 굉장한 장점이라고 한다. ([참고](https://docs.gradle.org/current/userguide/authoring_maintainable_build_scripts.html#sec:avoid_imperative_logic_in_scripts))

Gradle 의 빌드는
1. 빌드에 필요한 환경을 세팅
2. 기술된 Task 들의 선언들을 훑으며 Task Graph 를 구성
3. 구성된 순서에 따라 Task 를 실행하는 과정을 통해 이루어지게 된다.

### Extensible & Reusable
Gradle 은 빌드를 위해 필요한 Task 들을 쉽게 확장 / 재사용할 수 있도록 도와준다.
Custom Task 를 Gradle 밖에서 직접 작성할 수도 있으며, Project 나 Task 의 property 를 추가하여 스크립트의 재사용성을 높일 수 있으며, Plugin 등을 통해 외부에서 정의된 Task 들을 쉽게 프로젝트 빌드에서 사용할 수 있게 도와주기도 한다.

---

## 마무리

앞으로 위에서 간단하게 정리한 내용들과 Gradle Plugin, Custom Task, MultiModule Project 등에 대해 간간히 정리하며 Gradle, 나아가 Build Automation Tool 을 직접 구성하는 방법을 익혀보려한다. 무인도에 던져두어도 복잡한 프로젝트의 Build Automation 을 구성할 수 있는 야생의 개발자가 되기 위해...!

#### 쓰면서 본 글들
- https://docs.gradle.org/current/userguide/what_is_gradle.html
- https://docs.gradle.org/current/userguide/getting_started.html#authoring_gradle_builds