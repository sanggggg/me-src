---
layout: post
title: Matrix Mutiplication speed up (0) - 시작하기 앞서
date: 2020-05-26
categories: matrix_multiplication
---

## 어떤 포스팅인가요?

병렬 프로그래밍을 활용하여 행렬곱 연산(mat_mul)의 최적화, Speed up 향상 과정을 기록해 보려고 합니다. 사용할 기술 들은 다음과 같습니다.

- Memory locality를 통한 최적화
- pthread 를 사용한 multithread 환경 speed up
- OpenCL 를 사용한 GPU 활용 speed up
- MPI 를 사용한 다중 노드 환경 speed up

앞으로의 포스팅에서 위의 speed up을 하나씩 적용하며 행렬곱의 효율을 계속 상승시켜볼 예정입니다. 코드는 이 [Github Repository](https://github.com/sanggggg/MatMulSpeedUp)에서 보실 수 있습니다.

## 왜 행렬곱인가요?
행렬곱은 선형대수학의 기본적인 연산으로 실제로 머신러닝, 이미지 프로세싱, 렌더링 등 다양한 분야에 쓰이는 연산입니다. 하지만 일반적으로 N*N 행렬곱에 대해 O(N^3)의 시간 복잡도를 보여주는 꽤 무거운 연산이라고 볼 수 있습니다. 무거운 연산인 만큼 Speed Up이 제대로 되고 있음을 보여주는데 효율적일 것으로 생각했으며, 분할 정복의 형태로 연산할 수 있기에 멀티쓰레딩을 통해 효율을 많이 증가시킬 수 있는 연산이기에 선택하였습니다.

![mat mul](https://wikimedia.org/api/rest_v1/media/math/render/svg/2a26fa102c83119e1914b4e6bdf82e33a53b20b2)

## performance를 어떻게 측정하나요?
퍼포먼스의 측정은 일반적으로 (연산의 크기 / 걸린 시간) 으로 볼 수 있습니다. 앞으로의 포스팅에서는 이론상 수행되어야 하는 Floating point operation 의 수(`FLOP`) / 걸린 시간 (`Second`)를 나타내는 `FLOPS` 가 얼마 정도 나왔는지를 통해 퍼포먼스를 측정하려고 합니다.