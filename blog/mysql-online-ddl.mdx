---
title: MySQL 너무 화나 - Online DDL 의 함정
date: 2023-04-23
tag: mysql, innodb, online_ddl
author: 상민
---

최근 MySQL(w InnoDB 이하 생략) 을 사용하면서 겪은 장애 상황을 기록 차원에서 공유해 봅니다.

> 아래 사고 흐름은 글의 자연스러운 흐름을 위해 실제와 조금 다르게 각색을 하였으니 참고 부탁드립니다.

### 문제 상황

아래와 같은 일련의 DDL 을 MySQL 에 적용해야 하는 일이 있었다.

1. 새로운 **테이블 X** 를 추가하고
2. 기 존재하던 **테이블 Y** 에 컬럼 `x_id` 을 추가하고
3. `x_id` 에 **테이블 X** 로 향하는 외래키 제약을 건다.

이 DDL 들을 봤을 때 컬럼 추가는 큰 리소스를 들지 않을거라고 경험적으로(?) 판단했고 과정 3에서 **테이블 X** 는 레코드가 없으니 외래키 제약을 확인하는데 거의 시간이 들지 않을거라 큰 문제 없지 않을까... 하고 안일한 판단을 했던 것 같다 (지금 보니 전제부터 사고의 흐름까지 검증되지 못한 너무 안일한 생각이었다)

또한 MySQL 의 Online DDL 을 통해 DML 과 DDL 이 병렬적으로 잘 돌 테니 뭐 큰 문제야 있겠어~ 하고 별 생각없이 DDL 을 돌려놓았는데 (긴 락의 영향으로) DB 세션 수가 갑자기 치솟는 것을 확인할 수 있었다....! 황급하게 DDL 을 죽이고 현상을 분석해 보았다.

과정 3의 DDL이 오랜 시간 **테이블 Y** 의 락을 잡고 있었고 이 때문에 **테이블 Y** 에 대한 DML 요청들이 전부 블로킹 되어 세션이 치솟는 것이었다.

### Online DDL - COPY 와 INPLACE

위 상황을 분석하기 위해 알아야 하는 MySQL 이 online DDL 을 처리하는 방식에 대해서 알아보자.
Online DDL 을 실행하기 위한 전략인 INPLACE 와 COPY 는 아래와 같다.

#### ALGORITHM=INPLACE

INPLACE 는 DDL 의 영향을 받는 레코드 하나하나를 "그 자리(데이터 레이아웃)에서" 바로 업데이트 시킨다. 따라서 다른 DML 들이 들어온다해도 큰 문제 없이 처리할 수 있는 장점을 가지고 있다. (물론 레코드 업데이트를 위해 잠깐씩 락을 잡겠지만 큰 영향을 준다고 말할 정도는 아니다.)

#### ALGORITHM=COPY

COPY 는

1. 테이블 전체를 임시테이블로 복사해 두고
2. 임시테이블에 대해 스키마 변경을 실행한다.
3. 이 스키마 변경 과정에 날아온 DML 들은 별도의 로그로 관리하며
4. 임시테이블의 스키마 변경이 완료되면 한번에 반영한다.
   이때 복사된 사본의 무결성을 위해 **과정 1이 진행되는 동안 테이블에 대한 Metadata lock 을 잡고 있다는 점** 을 알고 기억해야 한다.

MySQL 은 외래키를 걸 때 참조당하는 테이블에 실제로 해당 값이 존재하는지 확인하는 정합성 검사를 매 컬럼값 마다 해 주어야 한다. 따라서 이 정합성이 DML 의 실행동안 깨지지 않는 것을 보장해야만 하고, 이를 위해 Online DDL 을 위한 전략으로 INPLACE 가 아닌 COPY 를 선택한다.

다시 돌아와서 위 장애상황의 외래키 추가 DDL 이 문제가 된 이유는 **테이블 Y** 이 수십억개의 레코드가 쌓인 매우 거대한 테이블이었기 때문이다. 이는 COPY 알고리즘의 임시테이블 복사가 오랜 시간이 걸리게 만들었고 이 때문에 긴 시간동안 Metadata lock 을 잡아 Y 테이블에 접근하는 write DML 들을 블로킹 시키고 장애로 이어지게 만들었다.

### 해결 방안

여기서 잘못된 생각이긴 했지만 앞의 DDL 을 실행하던 절차에서 힌트를 얻을 수 있었다.

> `Y.x_id` column 이 **테이블 X** 에 대한 제약을 거는 중에 **테이블 X** 는 가 레코드가 없으니 제약을 확인하는데 큰 시간이 들지 않을거라 큰 문제 없지 않을까

**테이블 X** 은 방금 막 추가된 테이블이며, 따라서 이에 대해서 제약을 확인하는 절차를 거칠 필요가 없다. MySQL 이 COPY 알고리즘을 택한 이유는 정합성 검사가 필요하기 때문이었고, 그렇다면 정합성 검사를 skip 한다면 COPY 가 아닌 INPLACE 알고리즘을 쓸 수 있지 않을까? 공식 문서에서 아래 문장을 확인할 수 있었다.

> The `INPLACE` algorithm is supported when [`foreign_key_checks`](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_foreign_key_checks) is disabled. Otherwise, only the `COPY` algorithm is supported.

이 부분을 확인하고 나서

1. 해당 변수를 DDL 이 날아가는 DB 세션에 대해서 비활성화 하고 
2. 정합성 추가 DDL 을 명시적인 알고리즘을 지정하여 실행하고
3. DB 세션을 닫는 방식으로

```sql
set session foreign_key_checks=0;
alter table Y add constraint FK_X foreign key (x_id) references X(id) algorithm=INPLACE;
set session foreign_key_checks=1;
```

장애 없이 DDL 을 실행할 수 있었다.

### 교훈

- DDL 은 너~무 무서운 쿼리이다. 공식 문서를 통해 DDL 의 실행 매커니즘이나 실행 중 발생할 수 있는 영향을 꼭 확인하도록 하자.
- 또한 실행 매커니즘에 대한 모호성을 줄이기 위해 DDL 을 실행할 때 명시적인 알고리즘을 지정해 주는 것도 좋은 방법이다.
- 크기가 큰 테이블에 대한 Online DDL 은 ALGORITHM=COPY 를 사용한다면 큰 다운타임을 만들어 낼 수 있으니 이를 지양할 수 있는 DDL 실행 계획을 고민하도록 하자.

### 고민할 점들

- 외래키 제약으로 인한 장애들은 예전 부터 자주 목격해 왔다. 과연 DBMS 레벨의 외래키 제약 무결성이 서비스에 꼭 필요한 제약일까? Application 레벨(ORM)에서 지켜지는 느슨한 제약 정도라도 서비스를 운영하기 충분하지는 않을 지 트레이드 오프를 한번 쯤 다시 고민해 보자.
- ALGORITHM=COPY 를 통한 Online DDL 도 테이블의 크기가 그리 크지 않다면 락을 길게 잡지 않아서 나쁘지 않을 수도 있다. 그렇다면 쿼리 이전에 레코드와 테이블 스키마로 부터 임시테이블 복사에 드는 시간이 미리 가늠할 수 있다면 다운타임을 사전에 미리 잘 알아낼 수 있지 않을까? (-> 적절한 DDL 실행 전략을 만드는 것에 도움이 될 수 있지 않을까?) 어떻게 알 수 있을지 고민해 보자.
- MySQL 과 같은 DBMS 레벨의 Online DDL 실행 알고리즘이 아닌 서드파티의 더 느슨한 제약을 제공해 주는 Online DDL 처리 방법을 고민해보자. [pt-online-schema-change](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html) 라던지 [gh-ost](https://github.com/github/gh-ost) 와 같은?
- 그 외에도 Online DDL 을 처리하는 과정에서는 여러 고민해야하는 문제들이 많다. [참고글](https://medium.com/daangn/mysql-online-ddl-faf47439084c)

### 참고한 글

- https://dev.mysql.com/doc/refman/5.7/en/innodb-online-ddl-operations.html#online-ddl-foreign-key-operations
