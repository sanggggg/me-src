---
title: Spring MVC 에서 코루틴 쓰기 너무 힘들어
date: 2023-06-04
tag: spring, coroutine
author: 상민
---

모종의 이유로 Spring MVC 와 Kotlin Coroutine 을 함께 사용하고 있는데, 이때 겪고 있는 문제점들과 일부 해결한 방향들을 간단하게 공유해 보려고 한다.

> Webflux 가 아닌 MVC 와 Coroutine 을 같이 사용하는 상황이 의아할 수 있다.
> 가볍게 이유를 설명하자면, transaction 을 하드하게 사용해야하는 환경 특성상 JPA(jdbc) 를 포기할 수 없었고 (-> Webflux 를 사용할 수 없었고) 그럼에도 불구하고 network IO 에 대한 자원 소모 부담을 줄이고 싶었기에 이를 위해 reactive WebClient 를 쉽게 사용할 수 있는 syntactic sugar 가 필요했다.

### ThreadLocal 과 Coroutine
Coroutine 은 실행 흐름과 Thread 가 1:1 으로 묶이지 않는 특징을 가지고 있다.
```kotlin
// Dispatcher 나 다른 코루틴의 실행 등 다양한 환경에서 실행될 때
// 항상 1, 2, 3 이 동등함을 보장할 수 없다.
suspend fun coroutineFn() {
	println(Thread.currentThread().getId()) // 1
	delay(100)
	println(Thread.currentThread().getId()) // 2
	delay(100)
	println(Thread.currentThread().getId()) // 3
}
```

따라서 하나의 쓰레드에 종속되어 있는 ThreadLocal 한 변수를 가져다가 사용하다가, 코루틴으로 넘겨버리는 경우 함수 흐름 안에 값을 읽거나 쓰는 것은 큰 혼란을 초래할 수 있다.

Spring MVC 의 경우 Thread : Request 의 요청이 매핑되기 때문에, Request 에 대한 정보를 ThreadLocal 값으로 저장하고 쓰레드에서 전역적으로 접근하는 코드들을 자주 볼 수 있다. (코드베이스 내부에서 편의를 위해 작성한 코드던, Spring 자체가 가지고 있는 코드던)

따라서 이런 부분들을 무시하고 개발을 하게 된다면 끔찍한 버그들이 초래될 수도 있다. 크게는
1. 일반적인 Request Scoped ThreadLocal 처리
2. JPA Transaction 에서 사용하는 ThreadLocal 처리 
두 문제로 쪼개어서 해결법을 고민해 봤다.

#### 일반적인 Request Scoped ThreadLocal
userAgent 라던가, cookie 와 같은 request 에 엮이는 정보들은 과다한 함수 인자 drilling 을 막기 위해서 ThreadLocal 로 저장하는 코드들이 존재했다. 이런 정보들은 Coroutine 에서 제공하는 `ThreadLocal::asContextElement` 익스텐션으로 비교적 쉽게 처리할 수 있었다.
해당 함수의 기능은 ThreadLocal 값이 CoroutineScope 안에서 이용될 수 있도록 도와주는 역할을 한다.
```kotlin
val myThreadLocal = ThreadLocal<String?>()
myThreadLocal.set("Asdf")
println(myThreadLocal.get()) // Asdf
launch(Dispatchers.Default + myThreadLocal.asContextElement()) {
	println(myThreadLocal.get()) // Asdf
	delay(1000)
	println(myThreadLocal.get()) // delay 의 yield 전후로 쓰레드 스위칭이 있을 수 있지만 여전히 Asdf 임을 보장한다.
}
```

주의해야 하는 점은 Coroutine 내부에서 ThreadLocal 을 한번 넘겨주고 나서 Coroutine 내부에서 Set 을 해 봤자, 코루틴을 launch 시킨 쓰레드의 ThreadLocal 은 변하지 않는다는 점 정도이다.

하지만 일반적으로 Spring 에서 Request 가 들어왔을 때 Controller Method 실행 전 읽기 전용 정도로 Request Scoped 변수를 적어줬기 떄문에 위 주의점을 신경쓸 필요 없이 자유롭게 설정할 수 있었다.

#### JPA Transaction 에서 사용하는 ThreadLocal 처리
진짜 문제는 JPA 에 박혀있는 ThreadLocal 값이었다. Transaction 을 관리하기 위해 ThreadLocal 을 사용하고 있으며, 따라서 코루틴 내에서 Entity 에 대한 lazy fetch 등의 접근을 할 경우 트랜잭션이 없어서 `LazyInitializationException` 이 쉽게 발생할 수도 있다.
그런데 사실...
1. 비동기적인 코드로 작성되는 (network I/O 로 예상보다 긴 waiting time 이 존재할 수 있는) Coroutine 그 자체가 Transaction 을 잡고 있다면 치명적인 성능 문제가 발생할 수 있고
2. 그 역으로 Coroutine 내부에서 처리시간이 좀 오래 걸리는 DB Query 가 발생하는 경우 Thread 가 그대로 블로킹 되어 성능 문제가 발생할 수 있는
상성이 매우 상극인 상황이었다...

우선 당장의 처리는 Transaction 내부에서 suspend function 을 사용할 수 없도록 Transaction 을 열고 닫는 진입점을 suspend fun 이 아닌 일반 lambda 를 넘겨받는 `transactionTemplate` 을 사용하도록 변경하는 방식으로 처리하였다. 하지만 `@Transactional` 어노테이션을 통해 열린 트랜잭션 도 존재하는 만큼 말끔한 해결책은 아닌 것 같고, 인프라적인 문제를 위해 코드의 변경이 강제되는 상황이라 아직 고민이 많다.... 어떻게 처리해야할지 더 고민해 볼 예정이다.