import * as React from "react";
import Layout from "../components/layout";
import Navigation from "../components/navigation";

const IndexPage = () => {
  return (
    <Layout pageTitle="김상민 (@sanggggg)">
      <Navigation activePagePath="/" />
      <p>
        여러 분야에 대한 <strong>경험을 넓히는 것</strong>을 좋아하는 소프트웨어
        개발자입니다. 다양한 프레임워크와 도메인을 경험해 보며{" "}
        <strong>좋은 코드를 짜기위한 일반해</strong>를 찾으려고 노력합니다.
      </p>
      <p>
        최근에는 <strong>안드로이드</strong>, <strong>웹 프론트엔드</strong>{" "}
        개발과 <strong>UI UX 디자인</strong>에 대해 흥미를 가지고 있습니다.
        데이터 시각화, 딥러닝, 컴퓨터 비전, 멀티코어 프로그래밍, 함수형
        프로그래밍, 알고리즘 문제해결에 대한 가벼운 지식과 흥미를 가지고
        있습니다.
      </p>
      <p>
        다양한 분야의 <strong>마술</strong>, 특히{" "}
        <a href="https://en.wikipedia.org/wiki/Cardistry">카디스트리</a> 에
        관심이 많으며 수 많은 장르의 <strong>음악</strong>과{" "}
        <strong>영화</strong>를 편식없이 감상하는 것을 좋아합니다.
      </p>
      <hr />
      <h3>경험</h3>
      <p>
        서울대학교 컴퓨터공학부 재학 중으로 대학 진학 후 알고리즘 문제해결,
        웹/앱 프로그래밍에 관심을 가지고 공부하기 시작했습니다. 안드로이드 앱
        개발에 흥미를 가지고 학부 내 웹/앱 프로그래밍 동아리{" "}
        <a href="https://wafflestudio.com/">
          <strong>와플스튜디오</strong>
        </a>{" "}
        의 구성원으로 활동하였고, 현재까지 활동 중입니다.
      </p>
      <p>
        자율 비행 드론 점검 솔루션 회사{" "}
        <a href="https://nearthlab.oopy.io/">
          <strong>니어스랩</strong>
        </a>{" "}
        의 딥러닝 엔지니어로 재직 후, 병역 해결을 위해 현재 라이드 헤일링
        모빌리티 회사{" "}
        <a href="https://tadatada.com/">
          <strong>vcnc</strong>
        </a>{" "}
        에서 클라이언트 앱 개발자 포지션으로 산업기능요원 재직 중입니다.
      </p>
      <hr />
      <h3>연락처 / SNS</h3>
      <ul>
        <li>
          <a href="https://github.com/sanggggg">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/sangmin-kim-6696a4197/">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://twitter.com/san_5g">Twitter</a>
        </li>
      </ul>
    </Layout>
  );
};

export default IndexPage;
