import React from "react";
import Layout from "../../components/layout";
import Navigation from "../../components/navigation";
import TrackerContent from "../../components/tracker/tracker";
import { PageProps, graphql } from "gatsby";

const Tracker: React.FC<PageProps<Queries.AllDailyTrackersQuery>> = ({
  data,
}) => {
  const values: Array<{
    day: Date;
    tags: Array<{ content: string; name: string }>;
  }> = data.allDailyTracker.nodes
    .filter((node) => node !== null)
    .map((node) => ({
      day: new Date(node?.timestamp ?? ""),
      tags: (node.tags ?? []).map((tag) => ({
        name: tag?.name ?? "",
        content: tag?.description ?? "",
      })),
    }));

  return (
    <Layout pageTitle="하루 기록">
      <Navigation activePagePath="/tracker" />
      <TrackerContent
        rawData={values}
        start={new Date("2023-04-03")}
        end={new Date("2023-11-30")}
      />
    </Layout>
  );
};

export const query = graphql`
  query AllDailyTrackers {
    allDailyTracker {
      nodes {
        id
        timestamp
        tags {
          name
          description
        }
      }
    }
  }
`;

export default Tracker;
