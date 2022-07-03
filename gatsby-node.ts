import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
  actions: { createNodeField },
  ...context
}) => {
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

    console.log(`\n- Connect Series: ${series}`);
    createNodeField({
      node: context.node,
      name: "series",
      value: series,
    });
    console.log(`\n- Gen Slug: ${prefix}${slug}`);
    createNodeField({
      node: context.node,
      name: "slug",
      value: prefix + slug,
    });
    console.log(`\n- Connect Tags: ${tags}`);
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
  const { data, errors } = await graphql(`
    query AllPosts {
      allMdx(sort: { fields: frontmatter___date, order: DESC }) {
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
          id
        }
      }
    }
  `);

  if (errors) {
    throw new Error(errors);
  }

  const allPosts = data?.allMdx.nodes;
  const allTags = new Set(data?.allMdx.nodes.flatMap((it) => it.fields.tags));

  allPosts.forEach((node) => {
    console.log(`Create Page ${node.fields.slug}`);
    createPage({
      path: node.fields.slug,
      component: `${__dirname}/src/templates/post.tsx`,
      context: { slug: node.fields.slug, series: node.fields.series },
    });
  });
  allTags.forEach((tag) => {
    console.log(`Create Page /tag/${tag}`);
    createPage({
      path: `/tag/${tag}`,
      component: `${__dirname}/src/templates/tag.tsx`,
      context: { tag: tag },
    });
  });
};
