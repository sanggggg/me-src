---
title: Android View 톺아보기 - onDraw
date: 2022-04-10
tag: android
author: 상민
---

이전에는 어떻게 view 의 영역이 결정되는지 확인해 보았다. 이번 포스트는 어떻게 view 의 내용물 (그래픽) 이 그려지는지 슈도 코드와 함께 내 마음대로 정리하려고 한다.

Android 의 View 는 Canvas 라는 비트맵에 그래픽을 그릴 수 있게 도와주는 인터페이스를 사용해 화면에 그래픽을 그려 준다. 이때의 전제는, 각 View 의 drawable 영역이 layout 단계에서 확정 되어 내려왔으므로, 이 영역에만 내가 원하는 그래픽을 그릴 수 있게 허용된다.


View 가 그래픽을 그리는 과정은
- 우선 스스로 그려야 하는 부분들을 그리고 (백그라운드 색과 같은)
- ViewGroup 의 경우 자식들이 스스로를 적절한 위치에 그리도록 전파하는
두 과정으로 쪼개어 아래 수도 코드 처럼 볼 수 있다. [참고 원본 코드](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/view/View.java;l=22681-22690;drc=b0859756205cf9ee4c8ec1031614f5b446487ef6?hl=ko_)

```kotlin

fun draw(canvas: Canvas) {
    onDraw(canvas) // 스스로가 어떻게 그려질 지 이 함수를 통해 결정한다.
    dispatchDraw(canvas) // 내가 ViewGroup 이라면, 자식들에게 각자 스스로가 그릴 수 있도록 draw 명령을 전파한다.
}
```

첫번째, 원하는 그래픽이 그려지는 과정을 간단한 Icon 이 글자 좌측에 위치하는 TextView 의 수도코드를 통해 확인해보자. [참고 원본 코드](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/widget/TextView.java;l=7966;drc=e33dd38c11af0b04777422269a3f6128a84b726a?hl=ko)

```kotlin
fun onDraw() {
    // draw left icon
    canvas.save()
    canvas.translate(paddingLeft, paddingTop)
    canvas.drawDrawable(iconDrawable)
    canvas.restore()
    
    // draw text
    canvas.save()
    canvas.translate(paddingLeft + iconDrawableWidth, paddingTop)
    canvas.drawText(text)
    canvas.restore()
}
```

안드로이드 뷰의 그래픽 그리기는 Canvas 인터페이스를 통해서 이뤄진다. Canvas 인터페이스를 통해서 유저는 그래픽을 그릴 수도 있지만, 실제 그래픽이 그려지는 Canvas 자체를 이리저리 변형시킬 수 있다.

위 수도 코드에서 처럼 Canvas 를 패딩 영역만큼 횡이동 시켜서 아이콘을 그리거나, Canvas 를 회전 시키거나 하는 등등의 수정이 가능한데 이런 수정에 대한 스냅샷을 기록하고, 이전 스냅샷으로 돌려주는 함수가 각각 `save` & `restore` 이다. (착각하기 쉬운 부분은, 실제로 그래픽이 그려진 순간을 저장하는 것이 아닌, 단순 캔버스의 횡이동 정도 회전 정도 클리핑 정도 등의 격자에 관련된 스냅샷 만을 저장한다)

대략적인 느낌을 파악했으니 코드를 다시 설명하자면 좌측에 있는 아이콘을 그리기 위해서 우선 현재 Canvas 의 스냅샷을 저장해 놓고, 패딩 영역을 고려해서 Canvas 를 횡이동 시킨다. 횡이동 시킨 Canvas 에 그래픽 (`iconDrawable`) 을 그리고 다시 원상 복구 시킨다.

이제 텍스트를 그리기 위해 Canvas 의 상태를 저장하고 패딩과 좌측 아이콘 너비 만큼 횡이동 하여 텍스트를 그리고 다시 원상복구를 시켜준다.

이런 Canvas 좌표계 스냅샷 저장은 Canvas 의 수정 이후 따라오는 draw 요청은 무조건 그 좌표계 안에서 놀기 때문에 ViewGroup 에서 각 자식 View 가 스스로를 그리는 책임을 분리하고, 외부에서 자식이 그려지는 공간을 컨트롤 할 수 있는 좋은 구조이다.

아래 단순한 ViewGroup 의  `dispatchDraw` 수도 코드를 통해 살펴보자. [참고 원본 코드](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/view/ViewGroup.java;l=4218;drc=9e22972568f11a7741d2afc6952703d736e6d218?hl=ko)

```kotlin
fun dispatchDraw(canvas) {
    canvas.save()
    if (clipToPadding) {
        canvas.clipRect(paddingTop, paddingLeft, paddingTop + height - paddingBottom, paddingLeft + width - paddingRight)
    }
    for (child in children) {
        child.draw(canvas)
    }
    canvas.restore()
}
```

위 코드에서 보이는 것 처럼, 자식들이나 내가 내 패딩 영역을 침범하지 않도록 하는 `clipToPadding`옵션이 켜져있다면, 나 스스로를 그릴때도 클리핑을 하겠지만, 자식들이 그려지는 순간에도 클리핑이 적용되도록 하고, 모든 자식이 그려지고 나면 다시 클리핑되기 전의 스냅샷으로 돌리는 형태로 자식이 그려지는 Canvas 를 통제하면서, 내 부모에게는 영향이 가지 않도록 변경을 고립시킬 수 있는 것이다.

## 마무리
View Draw 는 Measuring 과 Layouting 보다는 조금 더 가볍게 다루어 보았다. 재밌게 느껴진 포인트는 Canvas API 가 어떤 방법으로 View Tree 를 그릴 때 특정 변경 사항을 subtree 에서만 고립시키는 지 알게된 부분이었다. 좌표계 변경 사항을 스냅샷 (Stack) 으로 관리하여, 내 subtree 에는 영향을 미치고 부모에게 영향을 미치지 않게 다시 pop 하는 구조가 재밌는 편이었다. 가볍게 다룬만큼 코드를 놓친 부분들도 많았는데 이번에 다룬 것 외에도 draw 과정에서 하드웨어 가속이 어떻게 이뤄지는지 궁금해져서 언젠가 한번 다시 뜯어보려고 한다.


## 참고한 글
- [View  |  Android Developers](https://developer.android.com/reference/android/view/View)