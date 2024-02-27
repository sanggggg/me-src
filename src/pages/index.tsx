import * as React from "react";
import Layout from "../components/layout";
import Navigation from "../components/navigation";

const IndexPage = () => {
  return (
    <Layout pageTitle="김상민 (@sanggggg)">
      <Navigation activePagePath="/" />
      <p>
        <strong>넓고 얕은 지식</strong>을 선호하는 소프트웨어 개발자 입니다.
        <br />
        다양한 산업 도메인과 프레임워크를 경험해 보며{" "}
        <strong>좋은 코드를 짜기위한 일반해</strong>를 찾으려고 노력합니다.
      </p>
      <p>
        최근 <strong>스타트업</strong> 과 <strong>AI 를 통한 문제해결</strong>{" "}
        에 대해 흥미를 가지고 있습니다. 웹/모바일 앱 프로덕트 개발과 그
        생태계에도 여전히 많은 관심을 가지고 있습니다. 또한 철학, 데이터 시각화,
        딥러닝, 컴퓨터 비전, 멀티코어 프로그래밍, 함수형 프로그래밍, 알고리즘
        문제해결에 대한 가벼운 지식과 흥미를 가지고 있습니다.
      </p>
      <p>
        등산, 캠핑 등 <strong>아웃도어 활동</strong>을 좋아하며, 다양한 분야의{" "}
        <strong>마술</strong>에 관심이 많고, 수 많은 장르의{" "}
        <strong>음악</strong>과 <strong>영화</strong>를 편식없이 감상하는 것을
        좋아합니다.
      </p>
      <hr />
      <h3>경험</h3>
      <p>
        <a href="https://cse.snu.ac.kr">서울대학교 컴퓨터공학부</a> 재학 중으로
        대학 진학 후 알고리즘 문제해결, 웹/앱 프로그래밍에 관심을 가지고
        공부하기 시작했습니다. 안드로이드 앱 개발에 흥미를 가지고 학부 내 웹/앱
        프로그래밍 동아리{" "}
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
        의 딥러닝 엔지니어로 재직 후, 병역 해결을 위해 라이드 헤일링 모빌리티
        회사{" "}
        <a href="https://tadatada.com/">
          <strong>vcnc</strong>
        </a>{" "}
        에서 모바일 앱(android, iOS), 웹 프론트, 웹 백엔드, DevOps 포지션으로
        3년 간 재직하였습니다.
        <br />
        <blockquote>
          <i>
            이 페이지의 소개는 2024. 2. 27 에 마지막으로 업데이트 되었습니다.
          </i>
        </blockquote>
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
