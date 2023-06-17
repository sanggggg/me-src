import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { AllPostQuery } from "./src/queries";

interface FileWithPath {
  name: string;
  path: string | undefined;
  content: string;
}

export const onCreateNode: GatsbyNode<{
  frontmatter: { tag: string };
}>["onCreateNode"] = async ({
  actions: { createNodeField, createNode },
  ...context
}) => {
  if (
    context.node.internal.type === "File" &&
    context.node.sourceInstanceName === "tracker"
  ) {
    const content = await context.loadNodeContent(context.node);
    const fileWithPath: FileWithPath = {
      name: context.node.name as string,
      content,
      path: context.node.relativePath as string,
    };
    const dailyTracker = parseDailyTracker(fileWithPath);
    createNode({
      ...dailyTracker,
      id: dailyTracker.timestamp.toISOString(),
      parent: null,
      children: [],
      internal: {
        type: "DailyTracker",
        contentDigest: context.createContentDigest(dailyTracker),
      },
    });
  }
  if (context.node.internal.type === "Mdx") {
    const prefix = "/blog";
    const { node, getNode } = context;
    const slug = createFilePath({
      node,
      getNode,
      basePath: "posts",
      trailingSlash: false,
    });
    const series = (() => {
      const candidate = slug.split("/").slice(0, -1).join("/");
      if (candidate) return candidate;
      else return slug;
    })();
    const tags = node.frontmatter?.tag?.split(",").map((it) => it.trim());

    createNodeField({
      node: context.node,
      name: "series",
      value: series,
    });
    createNodeField({
      node: context.node,
      name: "slug",
      value: prefix + slug,
    });
    createNodeField({
      node: context.node,
      name: "tags",
      value: tags,
    });
  }
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions: { createPage },
}) => {
  const { data, errors } = await graphql<AllPostQuery>(`
    query AllPosts {
      allMdx(sort: { frontmatter: { date: DESC } }) {
        nodes {
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            title
          }
          fields {
            slug
            series
            tags
          }
          internal {
            contentFilePath
          }
          id
        }
      }
    }
  `);

  if (errors) {
    throw new Error(errors);
  }

  const allPosts = data?.allMdx.nodes ?? [];
  const allTags = new Set(
    data?.allMdx.nodes.flatMap((it) => it.fields?.tags).filter((it) => it)
  );

  allPosts.forEach((node) => {
    if (!(node.fields?.slug && node.fields?.series)) return;
    createPage({
      path: node.fields.slug,
      component: `${__dirname}/src/templates/post.tsx?__contentFilePath=${node.internal.contentFilePath}`,
      context: { slug: node.fields.slug, series: node.fields.series },
    });
  });
  allTags.forEach((tag) => {
    createPage({
      path: `/tag/${tag}`,
      component: `${__dirname}/src/templates/tag.tsx`,
      context: { tag: tag },
    });
  });
};

function parseDailyTracker(file: FileWithPath) {
  const parsedDate = file.name?.split("-").slice(0, -1).join("-");
  const timestamp = new Date(parsedDate);
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