import React from "react";
import Layout from "../../components/layout";
import Navigation from "../../components/navigation";
import Main from "../../components/tracker/tracker";

const Tracker: React.FC<{}> = () => {
  return (
    <Layout pageTitle="기록">
      <Navigation activePagePath="/tracker" />
      <Main />
    </Layout>
  );
};

export default Tracker;
