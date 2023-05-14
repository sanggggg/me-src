import type { GatsbyNode } from "gatsby";
import { fetchDocuments } from "./utils/google-docs";
import type { FileWithPath } from "./utils/google-drive";
import { DAILY_TRACKER_FILE_ID } from "./utils/constants";

function parseDailyTracker(file: FileWithPath) {
  const parsedDate = file.name?.split("-").slice(0, -1).join("-");
  const timestamp = new Date(parsedDate!);
  const contentLines = file.content.split("\n");

  let started = false;
  const tags: Array<{ name: string; description: string }> = [];
  for (const line of contentLines) {
    if (started) {
      const match = line.match(/^- \[.\] (.+) #(\w+)/);
      if (match !== null) {
        const match = line.match(/^- \[.\] (.+) #(\w+)/);
        const description = match?.[1];
        const tag = match?.[2];
        if (description && tag) {
          tags.push({ name: tag, description });
        }
      } else {
        break;
      }
    }
    if (line.startsWith("### TODO")) {
      started = true;
    }
  }
  return { timestamp, tags };
}

export const sourceNodes: GatsbyNode[`sourceNodes`] = async (gatsbyApi) => {
  const { reporter } = gatsbyApi;
  try {
    const result = await fetchDocuments(
      { debug: true, fileId: DAILY_TRACKER_FILE_ID },
      reporter
    );
    result
      .map((doc) => parseDailyTracker(doc))
      .forEach((dailyTracker) => {
        gatsbyApi.actions.createNode({
          ...dailyTracker,
          id: dailyTracker.timestamp.toISOString(),
          parent: null,
          children: [],
          internal: {
            type: "DailyTracker",
            contentDigest: gatsbyApi.createContentDigest(dailyTracker),
          },
        });
      });
  } catch (e) {
    reporter.error(
      `Parsing daily tracker failed...`,
      e as Error,
      "plugin-google-docs-daily-tracker"
    );
  }
};