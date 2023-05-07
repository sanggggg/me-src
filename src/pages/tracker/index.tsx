import React from "react";
import Layout from "../../components/layout";
import Navigation from "../../components/navigation";
import TrackerContent from "../../components/tracker/tracker";

const rawData = [
  {
    day: new Date("2021-01-01"),
    tags: [{ name: "A" }, { name: "A" }, { name: "A" }],
  },
  {
    day: new Date("2021-01-02"),
    tags: [
      { name: "A" },
      { name: "B" },
      { name: "A" },
      { name: "D" },
      { name: "A" },
      { name: "C" },
      { name: "A" },
      { name: "A" },
      { name: "A" },
    ],
  },
  {
    day: new Date("2021-01-03"),
    tags: [{ name: "D" }],
  },
  { day: new Date("2021-01-04"), tags: [] },
  { day: new Date("2021-01-05"), tags: [{ name: "A" }] },
  { day: new Date("2021-01-06"), tags: [] },
  { day: new Date("2021-01-07"), tags: [] },
  {
    day: new Date("2021-01-08"),
    tags: [{ name: "C" }, { name: "A" }],
  },
  {
    day: new Date("2021-01-09"),
    tags: [
      { name: "A" },
      { name: "A" },
      { name: "B" },
      { name: "A" },
      { name: "A" },
      { name: "B" },
    ],
  },
  { day: new Date("2021-01-10"), tags: [{ name: "A" }, { name: "A" }] },
  {
    day: new Date("2021-01-11"),
    tags: [{ name: "A" }, { name: "B" }, { name: "A" }, { name: "A" }],
  },
  {
    day: new Date("2021-01-12"),
    tags: [{ name: "A" }, { name: "A" }, { name: "A" }, { name: "C" }],
  },
];

const Tracker: React.FC<{}> = () => {
  return (
    <Layout pageTitle="하루 기록">
      <Navigation activePagePath="/tracker" />
      <TrackerContent rawData={rawData} />
    </Layout>
  );
};

export default Tracker;
