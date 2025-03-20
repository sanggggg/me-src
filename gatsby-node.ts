import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { AllPostQuery } from "./src/queries";

const DefaultLang = "ko";
const AllLangs = ["ko", "en"];

export const onCreateNode: GatsbyNode<{
  frontmatter: { tag: string };
}>["onCreateNode"] = async ({
  actions: { createNodeField, createRedirect },
  ...context
}) => {
  if (context.node.internal.type === "MarkdownRemark") {
    const { node, getNode } = context;
    const slugCandidate = createFilePath({
      node,
      getNode,
      basePath: "posts",
      trailingSlash: false,
    });
    const langMatch = slugCandidate.match(/\.([a-z]{2,})$/);
    const lang = langMatch ? langMatch[1] : DefaultLang;
    const slug = langMatch
      ? slugCandidate.slice(0, -lang.length - 1)
      : slugCandidate;
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
      value: "/blog" + slug,
    });
    createNodeField({
      node: context.node,
      name: "tags",
      value: tags,
    });
    createNodeField({
      node: context.node,
      name: "lang",
      value: lang,
    });
  }
};

export const onCreatePage: GatsbyNode<{
  page: {
    context: {
      lang: string;
    };
  };
}>["onCreatePage"] = async ({
  actions: { createPage, deletePage, createRedirect },
  page,
}) => {
  console.log(page.path);
  deletePage(page);
  AllLangs.forEach((lang) => {
    createPage({
      ...page,
      path: `/${lang}${page.path}`,
      context: {
        ...page.context,
        lang,
      },
    });
  });
  createRedirect({
    fromPath: `/${page.path}`,
    toPath: `/${DefaultLang}${page.path}`,
    isPermanent: true,
  });
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions: { createPage, createRedirect },
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
            lang
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
      path: `/${node.fields.lang}${node.fields.slug}`,
      component: `${__dirname}/src/templates/post.tsx`,
      context: {
        slug: node.fields.slug,
        series: node.fields.series,
        lang: node.fields.lang,
      },
    });
  });
  createRedirect({
    fromPath: `/blog/*`,
    toPath: `/${DefaultLang}/blog/*`,
    isPermanent: true,
  });

  allTags.forEach((tag) => {
    AllLangs.forEach((lang) => {
      createPage({
        path: `/${lang}/tag/${tag}`,
        component: `${__dirname}/src/templates/tag.tsx`,
        context: { tag: tag, lang },
      });
    });
  });
  createRedirect({
    fromPath: `/tag/*`,
    toPath: `/${DefaultLang}/tag/*`,
    isPermanent: true,
  });
};
