---
title: Android View 톺아보기 - onMeasure, onLayout
date: 2022-03-27
tag: android
author: 상민
---

최근에 Android 플랫폼에서 이런 복잡한 GUI 를 구현할 일이 자주 있었다.
복잡한 GUI 요구사항을 실제 구현하려고 한다면, 매번 쓰던 GUI 구현 인터페이스 보다 실제로 깊은 단에서 어떻게 GUI 가 그려지고 있는지 알고 커스텀 하는 과정이 필요하다.  이를 위해 AOSP 소스를 뜯어보며 Android 에서 GUI 를 어떻게 그리고 있는지 이해 하였는데, 이를 정리하여 슈도 코드와 함께 설명해 보려고 한다.

안드로이드의 GUI 는 트리 구조를 가지고 구성된다. Android 의 `View` 는 이런 트리 구조 내에서 각 GUI를 나타내는 노드를 의미하며, 영역을 직사각형의 형태로 표현되며. (-> 화면상의 left, top, right, bottom 을 통해 View 의 위치가 표현된다.)
`View` 는 본인이 위치하는 영역을 정의해야 하고, 해당 영역 내에서 어떤 그래픽을 그릴지 두 책임을 가지고 있다.

각 책임을 구현하는 메서드는 `onMeasure` (뷰의 영역 크기) `onLayout` (뷰의 위치)  `onDraw`  (뷰 내부 그래픽) 등이 있다. 이번 포스트에서는 본인의 크기와 위치를 정의하기 위한 `onMeasure`, `onLayout` 메서드가 어떻게 작동하는지 설명해 보려고 한다.

### Measuring
Android 의 View 크기는 항상 고정값이 아닐 수 있다. 뷰 트리에서 _부모와 동일하게 한다_, _자신 내부의 컨텐츠를 감싼다_ 와 같이 유동적인 값을 가져가게 될 수 있다. 이를 1차적으로 측정하는 역할을 `measure`(`onMeasure`) 함수가 가지고 있다.

Size measure 은 내 부모가 나에게 정해준 `MeasureSpec` 을 받아, 이 값을 가공(margin 이나 padding 을 먹이는 등) 한 `MeasureSpec`으로 자식의 size measure 를 진행시켜 이 값들을 토대로,  내 size measure 를 진행하는 함수라고 볼 수 있다. 

여기서 `MeasureSpec` 은 부모가 나에게 **내가 차지할 수 있는 크기를 그 크기를 정확히 지켜야 하는지 (EXACTLY), 아니면 그 크기보다 작기만 하면 되는지 (AT_MOST), 아예 무시해도 되는지 (UNSPECIFIED)** 등의 정보를 담고 있는 자료형이라고 볼 수 있다.

쉽게 확인하기 위해 단순한 vertical LinearLayout 의 슈도 코드 예시를 들어보겠다.

```kotlin
fun measure(measureSpec: MeasureSpec) {
    var totalChildHeight: Int = 0
    var maxChildWidth: Int = 0

    for (child: this.children) {
        val measureSpecForChild = processMeasureSpecWithPaddingAndMargin(this.paddings, children.margins)
        child.measure(measureSpecForChild)
        maxChildWidth = Math.max(child.getMeasuredWidth(), maxChildWidth)
        totalChildHeight += child.getMeasuredHeight()
    }
    
    val measuredHeight = when(measureSpec.heightMode) {
        is UNSPECIFIED -> totalChildHeight
        is EXACTLY -> measureSpec.height
        is AT_MOST -> Math.min(measureSpec.height, totalChildHeight)
    }

    val measuredWidth = when(measureSpec.widthMode) {
        is UNSPECIFIED -> maxChildWidth
        is EXACTLY -> measureSpec.width
        is AT_MOST -> Math.min(measureSpec.width, maxChildWidth)
    }    
    
    setMeasuredSize(totalChildHeight, maxChildWidth)
}
```

내가 가진 measureSpec 을 각 자식에게 padding 과 margin 을 반영해 넘겨주고,  자식들은 이 measureSpec 을 가지고 직접 얼마 만큼의 공간을 차지하고 싶은지 확인한다. 확인한 정보를 바탕으로 나는 내 자식들이 원하는 크기를 확인할 수 있고, 해당 크기를 내가 가진 measureSpec 의 mode 와 값들을 조합하여 실제로 차지할 크기를 결정하게 된다. [실제 코드](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/widget/LinearLayout.java;l=772;drc=5d123b67756dffcfdebdb936ab2de2b29c799321?hl=ko)

### Layouting
한 차례 트리 순회를 통해 각 자식들이 자신의 `MeasuredSize` 확인하였다면, 이제 실제 화면상에서 어디에 위치할 지를 정해주는 과정이 남아있다. 이 위치 지정의 책임은 `onLayout` (`layout`) 함수에서 가지고 있다.

Layout 을 정하는 함수는 부모가 나에게 레이아웃 할 수 있는 위치를 인자로 넘겨주면, 내 레이아웃을 그 값으로 설정한 후, 그 값을 가공하여 내 자식들에게 레이아웃 할 수 있는 위치를 인자로 넘겨주는 트리 순회를 진행한다. 

이 과정 또한 간단한 vertical LinearLayout 의 슈도 코드로 표현하자면 아래와 같다.

```kotlin
fun layout(left: Int, top: Int, right: Int, bottom: Int) {
    var currentTop: Int = top
    for (child: this.children) {
        val childHeight = child.getMeasuredHeight()
        val childWidth = child.getMeasuredWidth()
        child.layout(left, currentTop, left + childWidth, currentTop + childHeight)
        currentTop += childHeight
    }
}
```

간단한 코드이므로 설명은 생략하겠다. [실제 코드](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/widget/LinearLayout.java;l=1600;drc=5d123b67756dffcfdebdb936ab2de2b29c799321?hl=ko)

이런 과정을 거쳐 정의된 layout 영역은 다음 스텝인 Draw 과정에서 트리 구조상의 View 각각에 그릴 수 있는 영역을 제한하는 방식이나 터치 영역으로 작동 한다던지 등의 역할을 하게 된다.

### 마무리
Html & css 보다 실제 내가 뷰 배치를 위한 로직을 직접 커스텀 할 수 있는 지점에서 안드로이드의 레이아우팅 로직을 좋아하는 편이다. 또한 css, iOS AutoLayout 에 비해서도 비교적 라이브러리 단에서 제공하는 LinearLayout, ConstraintLayout 등이 내가 원하는 디자인 스펙을 반영하기 좋은 점들이 많아서 안드로이드의 View Layouting 을 선호한다 (이건 내가 프론트엔드 개발의 첫 시작을 안드로이드로 해서 그럴 느낌이 강하긴 하지만…)

아무튼 실제 레이아우팅이 어떻게 진행되는지 속 시원하게 까볼 수 있는 점은 확실히 오픈소스인 안드로이드의 강점처럼 느껴졌고, responsive 한 뷰그룹을 어떻게 구성할 지에 대한 노하우 들이 많이 녹아있는 코드를 볼 수 있어서 (Measure 단계와 Layout 단계의 분리라던지, MeasureSpec 을 통한 레이아웃 크기 측정의 n 스텝으로 존재한다던지 등) 재미있게 뜯어보았던 것 같다.

### 참고한 글
- [View  |  Android Developers](https://developer.android.com/reference/android/view/View)


