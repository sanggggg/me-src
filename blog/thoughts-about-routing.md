---
title: Logic Routing 과 UI Routing
date: 2022-09-04
tag: ribs, android, ios, bad-writing
author: 상민
---

최근 [RIBs](https://github.com/uber/RIBs), [Jetpack Navigation](https://developer.android.com/guide/navigation?gclid=Cj0KCQjwmdGYBhDRARIsABmSEePbIHuVd2hgF1c6RZVZslJE2AaofaPO7blK4Fegspw-Qi5YAbw43aYaAmrmEALw_wcB&gclsrc=aw.ds) 등의 Routing Library 를 쓰다가 든 생각을 가볍게 정리해봅니다.

> 밑에서 부터는 의식의 흐름이라 반말로 적는 점 양해 부탁드립니다

## UI Routing 과 Logic Routing

Routing 은 유저 플로우에서 발생할 수 있는 여정이라고 볼 수 있다.
택시 앱의 경우 `로그인 -> 출도착지 지정 -> 호출 -> 탑승 -> 리뷰` 와 같은 각 플로우의 일부를 대변하는 기능을 분리하고 기능 간의 이동을 하는 방식이 Routing 이라고 볼 수 있다.

기존 UI 프레임워크 생태계는 UI 를 통한 Routing 을 권장한다. Jetpack Navigation 에서 보다시피, Fragment 라는 UI 컴포넌트의 라우팅을 통해 Logic 의 Routing 을 만들어 낸다.

하지만 RIBs 는 RIB 이라는 UI 와는 별개의 Logical 한 노드를 통한 Logic 의 Routing 을 권장한다.

이 글에서는 RIBs, Jetpack Navigation (with MVVM Fragment) 을 둘 다 써 보면서 느낀 Logical 한 노드를 통한 Routing 의 트레이드 오프를 소개하려고 한다.

## UI Routing

```kotlin
class RootUI: UI {
    private val navigator = PageStackNavigator(this)

    fun onActive() {
        navigator.routeTo(HomeUI.Identifier)
    }
}

class HomeUI(
    private val navigator: PageStackNavigator
): UI {
    fun onClickDetail() {
        navigator.routeTo(DetailUI.Identifier)
    }
}

class DetailUI(
    private val navigator: PageStackNavigator
): UI

class PageStackNavigator(rootUI: UI) {
    fun routeTo(identifier: UIIdentifier) {
        val ui = generateUIByIdentifier(identifier)
        rootUI.removeAllUI()
        rootUI.addUI(ui)
    }
}
```

일반적인 UI Routing 코드 스타일이다. Jetpack Fragment Navigation 도 이런 비슷한 형태이다.

이렇게 작성하면서 커다란 프로젝트가 완성되면 아래와 같은 문제가 발생한다.

> **한줄요약**: Routing 에 대한 책임을 UI 에서 가지는게 별로다.

일반적으로 애플리케이션의 복잡도가 높아진다면 viewModel (MVVM), Interactor (RIBs) 등등 UI 레이어 바로 밑에서 Application Logic 을 책임지는 레이어를 분리하게 된다. (LogicProvider)

좀전에 만든 HomeUI 에서 복잡한 로직이 생겨서 이를 LogicProvider 로 책임을 넘겨서 처리한다고 생각하자.

```kotlin
class HomeUI(
    private val homeLogicProvider: HomeLogicProvider
): UI {

    fun onClickDetail(detailItem: DetailItem) {
        // 실제 그 결과를 통해서 라우팅을 할 지 말지 등을 결정할 수도 있을테고...
        if (homeLogicProvider.isRouteToDetailAllowed(detailItem)) {
            navigator.routeTo(DetailUI.Identifier)
        }
    }
}

class HomeLogicProvider(
    private val restApi: RestApi,

) {
    fun isRouteToDetailAllowed(detailItem: DetailItem): Boolean {
        val result = restApi.checkValidItem(detailItem)
        return result.isValid
    }
}
```

HomeLogicProvider 으로 복잡한 Application 로직을 넘기고 나면, 위와 같은 코드가 된다.

그런데 여기서 마음에 안드는 점은 접근 가능 여부 (로직) 를 보고 네비게이팅을 하는 주체가 HomeUI 라는 점이다.

Navigating 은 UI 만의 책임이라기 보단 비즈니스 로직과의 거리가 훨씬 가깝다고 생각한다.

UI 코드의 책임은 주어진 Model 에 대응하는 적절한 그래픽을 보여주는가 정도에서 그쳐야 한다고 생각한다. (이정도 일 때 그 테스트의 용이성이 확실히 높아진다. 가능한 상태에 대한 모든 경우의 수와 실제 UI 를 대조하는 것은 단순 조합으로 자동화도 가능하기 때문이다.)

하지만 UI 코드의 책임에 Routing 이 들어가면 머리가 아파진다. 일단 위와 같이 단순하고 강력한 UI 에 대한 테스팅을 할 수 없고, 로직에 대한 변화들을 계속 감지해야 하기 때문이다.

그런데도 불구하고 Routing 이 왜 UI 를 통해 이뤄지고 있는가? 라고 한다면 Logic Routing 의 변경이 일어나는 가장 일반적인 케이스가 UI 의 변경이기 때문이었다고 생각한다.

하지만 UI 의 변경 보다 Logic 이 새로 붙는 형태로 라우팅을 했을 때 훨씬 일반화 하기 쉬워진다. (예를 들자면, 실제 대응하는 UI 는 없지만 다수의 child logic 에서 사용되는 공통 logic 을 UI 가 없어도 추출하는게 쉬워진다.)

그렇다면 Routing 에 대한 책임을 Logical 한 노드가 가져가면 어떻게 되는가?

```kotlin
class HomeUI(
    private val homeLogicProvider: HomeLogicProvider
): UI {

    fun onClickDetail(detailItem: DetailItem) {
        homeLogicProvider.routeToDetailIfAllowed(detailItem)
    }
}

class HomeLogicProvider(
    private val restApi: RestApi,
    private val nodeNavigator: NodeNavigator,
) {
    fun routeToDetailIfAllowed(detailItem: DetailItem): Boolean {
        val result = restApi.checkValidItem(detailItem)
        if (result.isValid) {
            nodeNavigator.routeTo(DetailLogicProvider.Identifier)
        }
    }
}

class NodeNavigator {
    fun routeTo(identifier: Identifier) {
        val (nodeUI, nodeLogic) = buildNode(identifier)
        if (nodeUI != null) {
            rootUI.addUI(nodeUI)
        }
        rootLogic.addLogic(nodeLogic)
    }
}
```

이제 Routing 에 대한 책임이 UI 에서 Logic 으로 전가되었다.
앞으로는 복잡한 테스트는 HomeLogicProvider 에서 전담하고, HomeUI 는 단순히 presentation 만을 책임지게 되었다. (그만큼 스냅샷 테스트 등으로 쉽게 테스트 할 수 있게 되었다).

하지만 아직 UI 에 대한 책임을 NodeNavigator 라는 클래스에서 가지고 있고, 이게 attach detach 되는 방식을 NodeNavigator 나 route 하는 주체(LogicProvider) 가 알고 있어야 한다. attach detach 되는 방식은 attach 되는 지점, animation 등을 알고 있어야 한다는 말이다...

이를 해결하기 위해서는 선언적으로 UI 를 구성하면 된다.

```kotlin
class HomeUI: UI {

    @Inject
    private val homeLogicProvider: HomeLogicProvider

    fun onClickDetail(detailItem: DetailItem) {
        homeLogicProvider.routeToDetailIfAllowed(detailItem)
    }
}

class HomeLogicProvider(
    private val restApi: RestApi,
    private val nodeNavigator: NodeNavigator,
) {
    fun routeToDetailIfAllowed(detailItem: DetailItem): Boolean {
        val result = restApi.checkValidItem(detailItem)
        if (result.isValid) {
            nodeNavigator.routeTo(DetailLogicProvider.Identifier)
        }
    }
}

class NodeNavigator {
    val logicState: Observable<LogicTree>

    fun routeTo(identifier: Identifier) {
        val nodeLogic = buildNode(identifier)
        rootLogic.addLogic(nodeLogic)
    }
}

class RootUI(
    private val nodeNavigator: NodeNavigator
) {
    fun onActive() {
        nodeNavigator.logicState.subscribe {
            when (it) {
                State.Home -> addUI(HomeUI())
                State.Detail -> addUI(DetailUI())
            }
        }
    }
}
```

이제 LogicProvider 는 UI 를 전혀 몰라도 그 로직을 만들 수 있으며, UI 는 단순 UI 의 시각화만을 책임지게 되었다. :smile:

하지만 앞서 설명한 Logical Routing 은 UI 에 대한 Routing 대비 도메인 맥락과 실제 UI 의 결합도를 낮출 수 있지만, 그만큼 부차적인 boilerplate code 들도 많이 발생할 수 있다.
따라서 대부분의 UI Routing 이 Logical Routing 과 1:1 되는 앱에 대해서는 이점을 크게 누리기 힘든 개념일 수도 있다는 점을 트레이드 오프로 고민했으면 한다.
