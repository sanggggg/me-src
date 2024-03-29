---
title: 코드 복잡도를 모델링 하는 방법 - Cognitive Complexity
date: 2023-02-05
tag: code-complexity, modeling
author: 상민
---

[이전 글](./cyclomatic-complexity)에서는 코드의 복잡도를 수치화하려고 사용하는 `Cyclomatic Complexity` 를 살펴보고, 동작 방식과 단점 등을 확인해 보았다. 이번 글에서는 `Cyclomatic Complexity` 에서 대응하지 못하는 영역을 커버하기 위해 만들어진 sonarqube의 [Cognitive Complexity](https://www.sonarsource.com/resources/cognitive-complexity/) 를 소개해 보려고 한다.

### Cognitive Complexity

Cyclomatic Complexity 는 분기의 발생으로 인한 유지보수의 어려움 및 테스트 난이도 증가를 확인하기 위한 모델링이었다. 후자에 대해서는 명확하게 좋은 지표로 보여지지만(분기의 개수라는 깔끔하고 명확한 지표), 유지보수의 어려움 (인간이 인지할 때 겪는 어려움) 을 잘 나타내는 지표로 보기는 힘들었다. (이전 글을 참고하자)

Cognitive Complexity 는 인지의 어려움을 좀 더 정확하게 나타내는 것에 집중하며 만들어진 모델링이다.

### 복잡도를 측정하는 방법
Cognitive Complexity 의 접근은 Cyclomatic Complexitiy 보다 좀 더 사례 중심적인 경향이 있다.

(아래는 [원문](https://www.sonarsource.com/resources/cognitive-complexity/)의 **Basic criteria and methodology** 단락의 내용을 인용하였다.)
> 1. Ignore structures that allow multiple statements to be readably shorthanded into one
> 2. Increment (add one) for each break in the linear flow of the code
> 3. Increment when flow-breaking structures are nested

Cyclomatic Complexity 와 유사하게 if, while, break 등의 사람의 선형적인 사고 흐름을 방해하는 분기문에 복잡도를 부여하고,
```kotlin
// 분기문이나 jump 문 들은 자연스러운(선형적인) 인지 흐름에 영향을 주므로 복잡도를 증가시킨다
if (someCondition0) {
    // do something
}
while (someCondition1) {
    // do something
    if (someCondition2) {
        break
    }
}
```

분기문이 발생할 때 해당 "분기문이 발생한 곳이 다른 분기의 안이라면 사람들은 더욱 인지하기 힘들어 한다", 라는 사례로 부터 아래와 같이 깊은 분기문 속의 분기는 더 높은 복잡도를 만든다고 판단하거나

```kotlin
// 복잡도를 크게 증가시키지 않는다
if (cond1) { 
	// do something
}
if (cond2) { 
	// do something
}
if (cond3) { 
	// do something
}

// 각 분기문들이 어느 조건하에서 판단되는지, 그 맥락을 기억하면서 코드를 확인하는 것은 인지 복잡도를 증가시킨다
if (cond1) {
	if (cond2) {
		// do something
	} else {
		if (cond3) {
			// do something
		}
	}
}

```

인지에 무리를 주지 않는 생략 형태의 분기들을 복잡도로 고려하지 않는 방식으로 복잡도를 결정하는 것을 볼 수 있다. (아래와 같은 null collescing 연산자가 대표적인 예시이다.)

```kotlin
// w/o shorthanded
var b: B? = null
if (a == null) {
	b = null
} else {
	b = a.b
}
// with shorthanded
var b = a?.b
```

> 특히 shorthhanded form 에 대한 고려는 특정 언어의 문법에 영향을 받는 복잡도인 만큼, 좀 더 각 언어의 사례를 중심으로 복잡도를 계산하는 방식을 선택했다고 볼 수 있다.

### 예시
위의 3가지 원칙을 바탕으로 복잡도를 계산하는 공식이 만들어 진다. 계산 공식의 디테일은 원문에서 확인을 부탁드리며 ([Appendix B: Specification](https://www.sonarsource.com/docs/CognitiveComplexity.pdf) 을 통해서 확인할 수 있다) 이 글에서는 원칙에 대한 이해를 바탕으로 복잡도 계산의 느낌적인 느낌만 아래 예시로 확인해 보자.

```kotlin
fun sumOfPrimes(max: Int) {
  var total = 0 
  var i = 1
  out@ while (i <= max) { // 인지 흐름을 방해하는 분기문으로 +1 complexity
	var j = 2
    while (j < i) { // 인지 흐름을 방해하는 분기문 인데다가 (+1), 다른 분기문의 내부에 있으므로 추가 복잡도 (+1) 를 부여한다.
      if (i % j === 0) { // 인지 흐름을 방해하는 분기문 인데다가 (+1), 다른 분기문들의 내부에 있으므로 추가 복잡도 (+2) 를 부여한다.
        continue@out // 인지 흐름을 방해하는 조건문이므로 +1
      }
	  j++
    }
	i++
    total += i;
  }
  return total;
}
// total 7 Cognitive Complexity
// (Cyclomatic Complexity was 4)
```


```kotlin
fun getWords(number: Int) {
  when(nubmer) { // 인지 흐름을 방해하는 분기문으로 +1 complexity
    1 -> return "one"
    2 -> return "two"
    3 -> return "three"
    else -> return "lots"
  }
}
// total 1 Cognitive Complexity
// (Cyclomatic Complelxity was 4)
```

이전 글과 동일한 예시의 함수이다. 복잡도의 계산 방식은 대략 주석을 통해 언급하였고, 이 방식으로 계산한 Cognitive Complexity 는 7 과 1 로, Cyclomatic Complexity 를 기준으로 4로 동일했던 것 보다 좀 더 사람이 인지하기에 수월했는가? 를 잘 나타내는 지표라는 것을 확인할 수 있다.

### 마무리
Cognitive Complexity 는 Cyclomatic Complexity 보다 좀 더 사람의 "인지" 에 중심을 둔 지표인 만큼
- 명확하게 판단 가능한 복잡도 보다는 사례 중심의 복잡도 접근이 존재하고
- 특정 언어의 문법에 대해서 엮여있을 수도 있는
아쉬운 점들이 존재하지만 그만큼 사례들을 기반으로 실제 사람이 유지보수에서 느껴지는 복잡도를 더 잘 나타내는 지표라고 볼 수 있다.

코드의 복잡도를 모델링하기 위한 두 지표를 살펴 보았다. 이런 지표들의 필요성에 공감하고, 실제로 적용을 하고 싶은 경우 아래와 같은 툴들을 통해서 활용이 가능하니 참고하셔도 좋을 것 같다 :)

- [Detekt - CognitiveComplexMethod](https://detekt.dev/docs/rules/complexity/#cognitivecomplexmethod)
- [Detekt - CyclomaticComplexMethod](https://detekt.dev/docs/rules/complexity/#cyclomaticcomplexmethod)
- [SonarQube](https://docs.sonarqube.org/latest/)


### 참고한 글
- https://www.sonarsource.com/resources/cognitive-complexity/
- https://www.sonarsource.com/blog/cognitive-complexity-because-testability-understandability/
