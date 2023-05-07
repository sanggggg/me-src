import React from "react";
import Layout from "../../components/layout";
import Navigation from "../../components/navigation";
import TrackerContent from "../../components/tracker/tracker";

const rawData = [
  {
    day: new Date("2023-04-07"),
    tags: [{ name: "fitness", content: "낙성대공원 러닝 6.05km" }],
  },
  {
    day: new Date("2023-04-08"),
    tags: [{ name: "study", content: "k8s 간단하게 훑어보기" }],
  },
  {
    day: new Date("2023-04-10"),
    tags: [
      { name: "book", content: "제 2 파운데이션" },
      { name: "study", content: "Real MySQL 1편 공부 w 다빈" },
    ],
  },
  {
    day: new Date("2023-04-13"),
    tags: [{ name: "fitness", content: "낙성대공원 러닝 6.36km" }],
  },
  {
    day: new Date("2023-04-14"),
    tags: [{ name: "book", content: "제 2 파운데이션" }],
  },
  {
    day: new Date("2023-04-15"),
    tags: [
      { name: "fitness", content: "구로 피커스 클라이밍 3.5h" },
      { name: "book", content: "파운데이션의 끝" },
      { name: "study", content: "Real MySQL 1편 공부" },
    ],
  },
  {
    day: new Date("2023-04-20"),
    tags: [
      { name: "book", content: "파운데이션의 끝" },
      { name: "study", content: "Real MySQL 1편 공부 w 다빈" },
    ],
  },
  {
    day: new Date("2023-04-21"),
    tags: [{ name: "book", content: "파운데이션의 끝" }],
  },
  {
    day: new Date("2023-04-22"),
    tags: [
      { name: "fitness", content: "낙성대공원 러닝 6.05km" },
      { name: "develop", content: "하루 기록 개발" },
      { name: "study", content: "mysql online ddl" },
    ],
  },
  {
    day: new Date("2023-04-23"),
    tags: [
      { name: "fitness", content: "양재 더클라임 클라이밍 3h" },
      { name: "book", content: "파운데이션의 끝" },
      { name: "writing", content: "MySQL 너무 화나 - Online DDL 의 함정" },
      { name: "develop", content: "하루 기록 개발" },
    ],
  },
  {
    day: new Date("2023-04-24"),
    tags: [{ name: "book", content: "파운데이션의 끝" }],
  },
  {
    day: new Date("2023-04-25"),
    tags: [{ name: "book", content: "소피의 세계" }],
  },
  {
    day: new Date("2023-04-26"),
    tags: [{ name: "book", content: "소피의 세계" }],
  },
  {
    day: new Date("2023-04-29"),
    tags: [
      { name: "fitness", content: "연남 더클라임 클라이밍 4h" },
      { name: "book", content: "소피의 세계" },
    ],
  },
  {
    day: new Date("2023-05-01"),
    tags: [{ name: "book", content: "소피의 세계" }],
  },
  {
    day: new Date("2023-05-02"),
    tags: [
      { name: "book", content: "소피의 세계" },
      { name: "book", content: "파운데이션의 끝" },
    ],
  },
  {
    day: new Date("2023-05-04"),
    tags: [{ name: "book", content: "파운데이션과 지구" }],
  },
  {
    day: new Date("2023-05-06"),
    tags: [
      { name: "book", content: "파운데이션과 지구" },
      { name: "develop", content: "하루 기록 개발" },
    ],
  },
  {
    day: new Date("2023-05-07"),
    tags: [
      { name: "fitness", content: "팔공산 하늘정원 하이킹 2h" },
      { name: "develop", content: "하루 기록 개발" },
      { name: "writing", content: "하루 기록" },
    ],
  },
];

const Tracker: React.FC<{}> = () => {
  return (
    <Layout pageTitle="하루 기록">
      <Navigation activePagePath="/tracker" />
      <TrackerContent
        rawData={rawData}
        start={new Date("2023-04-03")}
        end={new Date("2023-11-30")}
      />
    </Layout>
  );
};

export default Tracker;
