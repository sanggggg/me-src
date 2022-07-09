---
title: Matrix Mutiplication speed up (1) - Memory Locality을 통한 최적화
date: 2020-05-27
tag: matrix_multiplication
author: 상민
---

## Memory Locality을 통한 최적화
이번 포스팅에서는 가장 기본적인 Matrix multiplication 코드를 작성해보고, memory locality를 활용한 speed up을 진행해 볼 예정입니다. 포스팅에서 사용한 코드는 [Github Repository](https://github.com/sanggggg/MatMulSpeedUp)에서 보실 수 있습니다. Performance 측정을 위해 다양한 option을 실행시에 줄 수 있도록 하였으니 참고하셔도 좋을 것 같습니다.

## Naive approach
행렬곱에 대해 가장 naive한 코드를 짠다면 아래와 같습니다.
```c
// A[M, K] * B[K, N] = C[M, N] matmul
void mat_mul_naive(float *A, float *B, float *C, int M, int N, int K) {
  for (int i = 0; i < M; i++) {
    for (int j = 0; j < N; j++) {
      for (int k = 0; k < K; k++) {
        // C[i][j] += A[i][k] * B[k][j];
        C[i * N + j] += A[i * K + k] * B[k * N + j];
      }
    }
  }
}
```
일반적으로 우리가 머릿속으로 생각하는 행과 열을 곱해 저장하는 행렬곱을 그대로 표현하면 위와 같은 코드가 나옵니다. 그럼 위 코드의 실행 성능을 확인해봅시다. 1024*1024 Matrix의 행렬곱을 실행해 봅시다.
```shell
❯ ./main 1024 1024 1024
Options:
  Problem size: M = 1024, N = 1024, K = 1024
  Number of threads: 1
  Number of iterations: 1
  Print matrix: off
  Validation: off

Initializing... done!
Calculating...(iter=0) 13.484877 sec
Avg. time: 13.484877 sec
Avg. throughput: 0.159251 GFLOPS
```
대략 0.16 GFLOPS 가 나왔습니다. 어떻게 하면 더 좋은 효율을 낼 수 있을까요?

## Page Swap
1024*1024 크기의 행렬곱에서 사용되는 행렬의 크기는 대략 3 * 1024 * 1024 * 4Byte 입니다(3개의 행렬, Float의 사이즈 4Byte). 즉 12 MB의 거대한 크기의 용량을 잡아먹고 있습니다. 그럼 이 행렬들이 모두, 또 항상 physical memory위에 위치한다고 말할 수 있을까요?
> "Virtual memory와 page swap을 통해 거대한 메모리를 가지고 있습니다."

각 프로세스는 가상화된 virtual memory 공간을 가지고 있고, 특정 virtual memory에 대한 접근이 필요하다면 physical memory에 매핑된 정보를 읽어옵니다. 이때 physical memory가 부족한 경우, disk 와 같은 외부 IO 장치에 지금 사용하지 메모리를 백업해 놓고, 지금 필요한 메모리를 읽어옵니다(메모리를 읽어오고 다시 쓰는 단위를 Page 또는 Block이라고 하며 일반적으로 4KB의 크기를 가지고 있습니다). 이를 Page swap이라고 하며 이 과정에서 disk IO에는 CPU의 계산에 비해 정말 긴 시간이 소요되게 됩니다.

### `mat_mul_naive` 의 page swap
- `mat_mul_naive`의 가장 안쪽 loop에서는 접근하는 A와 B 행렬의 원소가 계속 변하고 있습니다(C의 원소는 동일합니다).
- A의 경우 A[i][k] -> A[i][k + 1] -> ... 으로 매번 변하는 원소가 물리적으로 메모리에서 떨어져 있는 거리 값은 1 * 4 Byte 입니다.
- B의 경우 B[k][j] -> B[k + 1][j] -> ... 와 같은 형태인데 이때 위에서 B에서 변하는 원소가 메모리에서 물리적으로 떨어져 있는 거리는 값은 1 * N * 4 Byte (1개의 M index 변화 * 행렬의 가로 길이 N * float의 크기) 입니다. 따라서 1024*1024 matrix의 경우에는 4KB 만큼의 주소 변화가 일어나고 이는 block size와 동일합니다.
- 즉 매번 가장 안쪽의 loop 에서는 B의 원소를 읽기 위해 항상 다른 block에 접근을 하게되고 이는 많은 page swap을 요구하기에 disk IO 에서 큰 병목이 생기게 됩니다.

## Locality approach
아래의 코드는 위의 코드에서 발생 가능한 page swap의 크기를 크게 줄인 코드입니다.
```c
// A[M, K] * B[K, N] = C[M, N] matmul
void mat_mul_locality(float *A, float *B, float *C, int M, int N, int K) {
  for (int i = 0; i < M; i++) {
    for (int k = 0; k < K; k++) {
      for (int j = 0; j < N; j++) {
        // C[i][j] += A[i][k] * B[k][j];
        C[i * N + j] += A[i * K + k] * B[k * N + j];
      }
    }
  }
}
```
위 naive한 접근과는 k 와 j의 loop 순서가 바뀌어 있습니다. 하지만 loop 내부적으로 수행되는 연산은 실행순서에 독립적이므로 correctness에는 문제가 없습니다. 그럼 어떻게 naive와 다르게 page swap이 줄어들었는지 확인해 봅시다.
### `mat_mul_locality` 의 page swap
- `mat_mul_locality`또한 가장 안쪽 loop에서는 접근하는 C와 B 행렬의 원소가 계속 변하고 있습니다(A의 원소는 동일합니다).
- C의 경우 C[i][j] -> C[i][j + 1] -> ... 으로 매번 변하는 원소가 물리적으로 메모리에서 떨어져 있는 거리 값은 1 * 4 Byte 입니다.
- B의 경우 B[k][j] -> B[k][j + 1] -> ... 으로 매번 변하는 원소가 물리적으로 메모리에서 떨어져 있는 거리 값은 1 * 4 Byte 입니다.
- 이번에는 가장 안쪽의 loop 가 실행될 때 마다 접근하는 메모리의 page 가 바뀌지 않습니다! 인접한 자료에 계속 접근하니 하나의 page에서 계속 정보를 읽어오게 됩니다. 즉 page swap의 가능성이 많이 줄어들었습니다.

그럼 실제 실행결과를 살펴봅시다. 실행 조건은 위와 같습니다.
```
❯ ./main 1024 1024 1024
Options:
  Problem size: M = 1024, N = 1024, K = 1024
  Number of threads: 1
  Number of iterations: 1
  Print matrix: off
  Validation: off

Initializing... done!
Calculating...(iter=0) 2.966364 sec
Avg. time: 2.966364 sec
Avg. throughput: 0.723945 GFLOPS
```
이번에는 0.72 GFLOPS로 이전에 비해 4~5배는 좋아진 퍼포먼스를 보여줍니다. disk IO 를 조금 해결해 주었을 뿐인데 큰 speed up이 발생했습니다.

## Block size approach
이번엔 더욱 page swap의 가능성이 적은 코드를 살펴봅시다. 이제 가장 안쪽 loop가 아닌 그 바깥쪽 루프에서도 페이지 폴트가 일어나지 않도록 코드를 작성해 봅시다. 코드는 아래와 같습니다.
```c
// 4KB / 4 Byte
// 4 Byte -> size of float
#define BS 1024

void mat_mul_blocking(float *A, float *B, float *C, int M, int N, int K) {
  for (int ii = 0; ii < M; ii += BS) {
    for (int kk = 0; kk < K; kk += BS) {
      for (int jj = 0; jj < N; jj += BS) {

        for (int i = ii; i < min(ii + BS, M); i++) {
          for (int k = kk; k < min(kk + BS, K); k++) {
            for (int j = jj; j < min(jj + BS, N); j++) {
              C[i * N + j] += A[i * K + k] * B[k * N + j];
            }
          }
        }

      }
    }
  }
}
```
이번에는 각 i, j, k 접근을 block size 로 진행하였습니다. 이는 M, N, K 의 값이 block size / 4 Byte 보다 배로 큰 경우에는 좋은 효율을 보여줄 수 있습니다. 하지만 노트북 CPU의 성능상 그정도의 큰 matrix를 연산해 보지는 못하였습니다. block size와 같거나 큰 차이가 없는 M, N, K에 대해서는 오히려 for loop 의 overhead로 성능이 감소할 수도 있습니다.

## Vectorized instruction
여기에 추가적으로 적용할 수 있는 최적화가 있습니다. [vector processor](https://ko.wikipedia.org/wiki/%EB%B2%A1%ED%84%B0_%ED%94%84%EB%A1%9C%EC%84%B8%EC%84%9C)에서 사용할 수 있는 방법입니다. 결국  코드를 assembly로 변환시 하나의 데이터 계산 당(C[i][j] 와 같이) 하나의 multiply instruction으로 실행 될 것입니다. vectorized instruction은 cpu에서 제공하는 기능으로 여러개의 데이터를 묶어 한 instruction으로 동일한 연산을 수행하게 만들 수 있습니다. 즉 하나의 multiply instruction으로 여러개의 데이터(C[i][j], C[i][j+1], ...)를 계산해 낼 수 있는 것이죠. 이를 SIMD (single instruction multiple data) 연산이라고 하며 이를 사용하면 또한 빠른 실행속도를 얻을 수 있습니다. [Intel CPU intrinsics guide](https://software.intel.com/sites/landingpage/IntrinsicsGuide/)에 vectorized instruction의 사용법이 적혀있습니다. 하지만 실제로 적용해 봤자 앞선 결과와 동일한 결과가 나오게 됩니다. 이는 이미 gcc또는 clang에서 compile 시 자동으로 SIMD를 확인하고 사용하여 최적해 주었기 때문입니다.

```assembly
# mat_mul.s
# 실제 mat_mul_locality를 변환한 assembly 파일입니다.
vmulss	(%rax,%rdx,4), %xmm0, %xmm0
# ...
vaddss	(%rax,%rdx,4), %xmm0, %xmm0
```