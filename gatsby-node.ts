import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { AllPostQuery } from "./src/queries";

export const onCreateNode: GatsbyNode<{
  frontmatter: { tag: string };
}>["onCreateNode"] = async ({ actions: { createNodeField }, ...context }) => {
  if (context.node.internal.type === "MarkdownRemark") {
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
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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

  const allPosts = data?.allMarkdownRemark.nodes ?? [];
  const allTags = new Set(
    data?.allMarkdownRemark.nodes
      .flatMap((it) => it.fields?.tags)
      .filter((it) => it)
  );

  allPosts.forEach((node) => {
    if (!(node.fields?.slug && node.fields?.series)) return;
    createPage({
      path: node.fields.slug,
      component: `${__dirname}/src/templates/post.tsx`,
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
