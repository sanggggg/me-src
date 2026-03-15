---
title: Gradle 너무 헷갈려 - Test Parallel Execution
date: 2023-02-25
tag: gradle, test, parallelism
author: 상민
---

회사에서도, 개인적으로 jvm 기반의 프로젝트를 만들 때도 Junit 과 Gradle 을 통한 Test 환경을 정말 많이 사용하고 있다.
그런데 Test 간의 고립이 깔끔하게 지켜지지 않아 재현되는 flaky test 들을 뜯다 보니 내가 돌리는 Test 들이 어떤 방식으로 자원 (Computing Power & Memory) 을 공유하고 있는 것인지 궁금해 졌다.

1. 각 Test Method 들이 병렬적으로 도는지, Class 들이 병렬적으로 도는지...?
2. 각 Test Method 들의 실행은 같은 JVM Memory 를 공유하는지...?

실험적으로, 또 코드를 통해 뜯어보고 넘어가면 좋을 것 같아서 간단하게 정리해 보았다.

> TL;DR
> Gradle 은 각 Test Class 단위의 Parallel Execution 을 지원한다.
> Test Method 들은 동일 class 내에서 memory 와 자신의 class instance 를 공유하지만, 각 Test Class 들은 같은 JVM Memory 를 공유할 수도 / 하지 않을 수 있다.


## 0. 실험 코드
간단한 Test 들을 돌리는 Gradle Project 를 만들어 보았다.
Test Class A, B, C 는 각각 2개의 5초가 걸리는 Test Method 를 가지고 있다.
이 Test 들을 별도의 설정 없이 실행할 경우 약 30초의 시간이 걸리는 것을 확인할 수 있다. (build time 이나 gradle 을 올리는데 조금 시간이 걸리겠지만 우선 큰 숫자만 봐도 비교에는 충분하다.)

```kotlin
class A {
    @Test
    fun a1() {
        Thread.sleep(5000)
    }

    @Test
    fun a2() {
        Thread.sleep(5000)
    }
}

class B {
    @Test
    fun b1() {
        Thread.sleep(5000)
    }

    @Test
    fun b2() {
        Thread.sleep(5000)
    }
}

class C {
    @Test
    fun c1() {
        Thread.sleep(5000)
    }

    @Test
    fun c2() {
        Thread.sleep(5000)
    }
}
```

```bash
$ ./gradlew test

BUILD SUCCESSFUL in 33s
5 actionable tasks: 1 executed, 4 up-to-date
```

## 1. Gradle 의 Test Parallel Execution

공식 문서를 기준으로 Gradle Test 의 Parallelism 은 Test Task 의 `maxParallelForks` 를 통해 설정할 수 있다.

```kotlin
tasks.withType<Test> {
    maxParallelForks = 3
}
```

실제로 이렇게 설정하고, `./gradlew test` 를 실행하면, 테스트가 병렬적으로 실행되는 것을 확인할 수 있다.

```bash
$ ./gradlew test

BUILD SUCCESSFUL in 14s
5 actionable tasks: 1 executed, 4 up-to-date
```

또한 약간의 코드 수정 후 실험해 본다면 이렇게 돌아가는 병렬성은 Test Method Level 이 아닌 Test Class Level 이라는 것을 알 수 있다.

```kotlin
class A {
    @Test
    fun a1() {
        Thread.sleep(5000)
    }

    @Test
    fun a2() {
        Thread.sleep(5000)
    }

    @Test
    fun a3() {
        Thread.sleep(5000)
    }
}
```

```bash
$ ./gradlew test

BUILD SUCCESSFUL in 19s 
5 actionable tasks: 1 executed, 4 up-to-date
```
이렇게 하나의 Test Class 내부에 여러 Method 를 집어 넣는다고 해서 각 Method 가 병렬적으로 돌아가는 것이 아니라, Test Class 별로 병렬적으로 돌아가는 것을 확인할 수 있다.

## 2. Test Class 별 JVM Memory 공유

이제 Test Class 별로 병렬적으로 돌아가는 것을 확인했으니, Test Class 별로 JVM Memory 를 공유하는지 확인해 보자.
우선 별도의 병렬 실행에 독립적인 결과를 확인하기 위해 `maxParallelForks` 를 다시 1로 설정하고, JVM Memory 의 공유를 확인할 수 있는 코드를 추가해 보자.

```kotlin
class A {

    val sharingResource = AtomicBoolean(true)
    @Test
    fun a1() {
        assert(sharingResource.getAndSet(false))
    }

    @Test
    fun a2() {
        assert(sharingResource.getAndSet(false))
    }
}
```

위 테스트를 실행할 경우, `maxParallelForks` 와 관계 없이 항상 실패하는 것을 확인할 수 있다.
즉 한 class 내의 method 들은 같은 class instance 를 공유하며 실행되는 것을 확인할 수 있다.

더 나아가 Test Class 별로 JVM Memory 를 공유하는지 확인해 보자.

```kotlin
val sharingResource = AtomicBoolean(true)

class A {
    @Test
    fun a1() {
        assert(sharingResource.getAndSet(false))
    }
}

class B {
    @Test
    fun b1() {
        assert(sharingResource.getAndSet(false))
    }
}
```

이 실험의 결과는 꽤 재밌다... 위 코드를 실행하면, `maxParallelForks` 가 1일 때는 항상 실패하고, 2 이상일 때는 항상 성공한다.
즉 `maxParallelForks` 의 수 만큼의 별도의 jvm runtime 이 돌아가는 것을 유추해볼 수 있다. 이걸 좀 더 정확하게 파악하고 싶다면 `maxParallelForks` 를 2로 해서 3개의 Task 를 병렬로 실행해 보면 된다.

```kotlin
val sharingResource = AtomicBoolean(true)

class A {
    @Test
    fun a1() {
        Thread.sleep(5000)
        assert(sharingResource.getAndSet(false))
    }
}

class B {
    @Test
    fun b1() {
        Thread.sleep(5000)
        assert(sharingResource.getAndSet(false))
    }
}

class C {
    @Test
    fun c1() {
        Thread.sleep(5000)
        assert(sharingResource.getAndSet(false))
    }
}
```

위 코드는 `maxParallelForks` 가 2일 때 2개의 test class 는 성공하고 (각각의 jvm runtime 에서 최초로 배정받아 실행되는 2개), 남은 1개의 test class 가 실패하는 것을 확인할 수 있었다.
테스트를 작성하는 시점에서는 꽤 확인하기 힘든 side effect 가 될 수 있는 셈이다...

## 3. 코드를 통해 확인해보자

우선 확실하게 하고 넘어가야 할 부분은, 우리가 gradle/junit test 환경에서 지원하는 병렬성은 junit 이 제공하는 기능이 아닌 gradle 이 제공하는 기능이라는 점이다.
따라서 gradle 의 test runner 코드들을 훑어보다 보면 어떤 코드 때문에 이런 상황이 벌어지는지 확인할 수 있다.

우선 Gradle 의 Test Runner 들의 실행 단위는 Test Class 단위로 jvm class loader 를 통해 jvm 에 올리고 실행하는 것을 코드를 통해 확인할 수 있다. 즉 Test Method level 의 parallelism 을 제공하지 않고, class instance 를 각 method 가 공유하는 것을 아래 코드들로 확인해볼 수 있었다.

```java
/**
 * A processor for executing tests. Implementations are not required to be thread-safe.
 */
public interface TestClassProcessor extends Stoppable {
    // ...

    /**
     * Accepts the given test class for processing. May execute synchronously, asynchronously, or defer execution for
     * later.
     *
     * @param testClass The test class.
     */
    void processTestClass(TestClassRunInfo testClass);
    
    // ...
}
```
> from [gradle/subprojects/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/TestClassProcessor.java](https://github.com/gradle/gradle/blob/4297ffbc05d979a536e6877e81be65174a56b840/subprojects/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/TestClassProcessor.java)

```java
public class JUnitPlatformTestClassProcessor extends AbstractJUnitTestClassProcessor {

    @Override
    protected Action<String> createTestExecutor(Actor resultProcessorActor) {
        TestResultProcessor threadSafeResultProcessor = resultProcessorActor.getProxy(TestResultProcessor.class);
        launcherSession = BackwardsCompatibleLauncherSession.open();
        junitClassLoader = Thread.currentThread().getContextClassLoader();
        testClassExecutor = new CollectAllTestClassesExecutor(threadSafeResultProcessor);
        return testClassExecutor;
    }

```
> from [gradle/subprojects/testing-junit-platform/src/main/java/org/gradle/api/internal/tasks/testing/junitplatform/JUnitPlatformTestClassProcessor.java](https://github.com/gradle/gradle/blob/e1c5bbb6cc27dd99989c2e9876a83c5ab83fcc29/subprojects/testing-junit-platform/src/main/java/org/gradle/api/internal/tasks/testing/junitplatform/JUnitPlatformTestClassProcessor.java)

또한 이렇게 load 하고 실행하는 병렬성을 제공하는 `MaxNParallelTestClassProcessor` 의 코드를 보면 `maxParallelForks` 값 만큼 TestClassProcessor 를 fork 해서 각각에 test 들을 라운드 로빈 방식으로 배정한다는 점도 확인할 수 있었다.
(모든 코드를 가져오기 힘들어서 아래만 보고는 fork 가 jvm level 의 fork 처럼 보이지 않을 수도 있다. 하지만 `ForkingTestClassProcessor::forkProcess` [코드](https://github.com/gradle/gradle/blob/7cc5636fe63bb3548318fee143d62912296b9e83/subprojects/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/worker/ForkingTestClassProcessor.java)를 보면 실제로 java runtime process 를 하나 더 만들고 있는 것을 확인할 수 있다)

```java

public class MaxNParallelTestClassProcessor implements TestClassProcessor {
    // ...
    @Override
    public void processTestClass(TestClassRunInfo testClass) {
        if (stoppedNow) {
            return;
        }

        TestClassProcessor processor;
        if (processors.size() < maxProcessors) {
            processor = factory.create();
            rawProcessors.add(processor);
            Actor actor = actorFactory.createActor(processor);
            processor = actor.getProxy(TestClassProcessor.class);
            actors.add(actor);
            processors.add(processor);
            processor.startProcessing(resultProcessor);
        } else {
            processor = processors.get(pos);
            pos = (pos + 1) % processors.size();
        }
        processor.processTestClass(testClass);
    }
}
```
> from [gradle/subprojects/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/processors/MaxNParallelTestClassProcessor.java](https://github.com/gradle/gradle/blob/e1c5bbb6cc27dd99989c2e9876a83c5ab83fcc29/subprojects/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/processors/MaxNParallelTestClassProcessor.java)

## 결론
정리하자면
1. gradle 의 test runner 들은 test class 단위로 jvm class loader 를 통해 jvm 에 올리고 실행한다.
    - 따라서 Test class 레벨의 동시성을 제공하고 있다.
2. 이때 test class 가 실행되는 jvm 들은 `maxParallelForks` 개의 독립된 jvm runtime 중 라운드 로빈으로 배정되는 만큼 실행 환경에 따라 다른 test class 들이 jvm heap 을 공유할 수도, 안 할 수도 있다.

를 실험적으로 / 코드를 통해서 확인했다.

### 사설
- 특히 2는 이 부분이 flaky test 를 만들지 않도록 조심해야한다는 점을 기억하자.
- 또한 라운드 로빈으로 배정되는 테스트들은 각 테스트에 소요되는 시각을 고려하지 않고, 오로지 테스트 클래스의 개수를 분배하는 만큼 실제로 최적화된 parallel execution 이 아닐 수도 있다는 점도 기억해두자. (관련된 대화가 진행되는 issue 는 [여기](https://github.com/gradle/gradle/issues/2669) 에서 확인할 수 있다.)
- 1과 같이 test class 단위의 동시성이 아닌, test method 단위의 동시성을 원하는 상황이라면 gradle 이 아닌 jvm 이 제공하는 [tests parallel execution](https://junit.org/junit5/docs/current/user-guide/#writing-tests-parallel-execution) 를 활용하는 것도 고려해 볼 수 있다.
