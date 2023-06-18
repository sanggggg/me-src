---
title: AWS VPC 너무 어려워
date: 2023-06-18
tag: AWS, VPC
author: 상민
---

AWS VPC 는 AWS 클라우드 내에서 (논리적으로) 격리된 클라우드 환경을 제공한다.
AWS 를 통해 생성된 컴퓨팅, 네트워킹 장치들은 VPC 내부에 위치하게 되며 따라서 VPC 를 통해서 이런 인스턴스들의 네트워킹을 컨트롤 할 수 있게 된다.

AWS VPC 의 개념을 적당히 내가 이해한 대로/간략하게 정리해 보며 어떻게 AWS VPC 가 구성되는지 정리해 보려고 한다.

### 1. Subnet
네트워크는 디바이스들의 물리적/논리적인 연결이 망의 최상단에 직접적으로 연결된 구조가 아닌, 트리 형태를 띄며 구성되어 있다. VPC 또한 VPC 내부에서 일정한 IP 대역을 할당한 **Subnet** 을 만들어서 물리적/논리적인 분리를 가능하게 해 준다. Subnet 을 분리함에 따라
- 각 서브넷에 할당될 인스턴스의 특성에 따라 보안정책을 별도로 설정한다던지
- 각 서브넷에 할당되는 물리적 가용 영역을 분산 시켜 특정 물리적 가용 영역의 장애에 따른 전체 서비스 장애를 막고, 장애 부담을 분산시키거나
- 당연히 VPC 에 종속적이지 않은 서브네팅 자체의 장점들 (네트워크 트래픽의 효율적인 전달이나 확장성) 을 챙길 수 있다.

### 2. Gateway
기본적으로 VPC 는 사설망으로, 내부 인스턴스 간의 연결만을 허용한다. 하지만 외부 네트워크와의 연결이 필요한 경우, `Gateway` 를 통해 외부와의 연결을 만들어 낼 수 있다. Public IP 를 부여받은 인스턴스가 외부로 요청을 송/수신 할 수 있도록 도와주는 Internet Gateway 나 Public IP 를 부여받지 않아서 외부로 부터의 요청을 수신할 수는 없지만, NAT 장비를 통해 외부로 요청을 송신할 수 있게 도와주는 NAT Gateway, 외부 On-premises 네트워크나 다른 VPC 와의 연결을 도와주는 Virtual Private Gateway 등을 그 예시로 들 수 있다.

### 3. Route Table
Gateway 등의 다양한 Network Device 를 생성하였다면 이런 디바이스를 어떻게 사용할지 알려주어야 한다. 즉 **특정 IP 대역의 요청은 어떤 Device 에게 보내야 할지** 를 결정해야 한다. 이런 정보를 가지고 있는 테이블이 Route Table 이다.
Route Table 은 Gateway Route Table, Subnet Route Table 등등 각각의 네트워크 인스턴스에서 요청을 처리하는 방식을 정하게 된다. 예를 들어 172.1.0.0/16 대역의 요청은 VPC 내부에 요청을 하도록 하고, 그 외의 요청은 무조건 Internet Gateway 를 통해 처리하도록 한다 등의 구성을 만들 수 있는 셈이다.

## 예시

> 인터넷을 통해 외부에서 VPC 내부의 인스턴스에 요청을 보내는 경우

외부에서 VPC 내부의 인스턴스에 요청을 보내려면, VPC 내부의 인스턴스는 외부에서 인지할 수 있는 Public IP Address 를 가지고 있어야 한다.
또한 해당 Public IP Address 를 할당받은 인스턴스가 인터넷과 연결될 수 있도록 하는 Internet Gateway 가 필요하다.

1. 외부에서 Internet Gateway 를 통해 Public IP 로 요청이 들어온다.
2. Internet Gateway 는 Route Table 을 보고 해당 요청을 Local (VPC Subnet) 으로 보내도록 한다.
3. Subnet 속의 인스턴스는 해당 요청을 전달받는다.

---
> VPC 내부의 private 인스턴스가 외부 인터넷에 요청을 보내는 경우

요청을 보내기만 하고 싶다면, 꼭 인스턴스가 Public IP Address 를 가지고 있을 필요는 없다. 대신 NAT Gateway 를 통해서 Private IP -> Public IP 변환을 하고, 그 매핑 정보를 가지고만 있으면 된다.

1. Subnet 의 인스턴스가 외부 Public IP 로 요청을 보낸다
2. Subnet 의 Route Table 이 어떤 네트워크 장치로 보내야 할지 결정한다. (이떄는 NAT Gateway 일 것이다.)
3. NAT Gateway 는 해당 요청을 보낸 인스턴스의 사설 IP 를 저장하고, 자신의 대표 Public IP 로 외부에 요청을 보낸 후, 외부에서 응답이 왔을 때 다시 사설 IP 로 번역 하여 발신한 인스턴스에게 돌려준다.

### 참고한 글
- [AWS VPC Official Docs](https://docs.aws.amazon.com/vpc/index.html)
