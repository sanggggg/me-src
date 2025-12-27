import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import Layout from "../components/layout";
import Comment from "../components/comment";
import Meta from "../components/meta";
import LocalizedLink from "../components/LocaleLink";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/seo";

const BlogPost: React.FC<
  PageProps<Queries.PostDetailQuery, { lang: string }>
> = ({ data, pageContext }) => {
  const html = data.markdownRemark?.html;
  const tags = data.markdownRemark?.frontmatter?.tag
    ?.split(",")
    .map((it) => it.trim());
  const series = data.allMarkdownRemark.nodes;
  const { t } = useTranslation();

  return (
    <Layout
      pageTitle={data.markdownRemark?.frontmatter?.title ?? "-"}
      lang={pageContext.lang}
    >
      <Meta
        tags={tags}
        date={data.markdownRemark?.frontmatter?.date}
        lang={pageContext.lang}
      />
      {series.length > 1 ? (
        <>
          <blockquote>
            <h4>{t("blog.series")}</h4>
            <ul>
              {series.map((it) => (
                <li key={it.fields?.slug}>
                  <LocalizedLink to={it.fields?.slug ?? "/"}>
                    {it?.frontmatter?.title}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </blockquote>
          <br />
        </>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />
      <div className="h-16" />
      <Comment />
    </Layout>
  );
};

export const Head: React.FC<HeadProps<Queries.PostDetailQuery>> = ({
  data,
  location,
}) => (
  <SEO
    title={data.markdownRemark?.frontmatter?.title ?? undefined}
    pathname={location.pathname}
    isArticle
  />
);

export const query = graphql`
  query PostDetail($slug: String!, $series: String, $lang: String!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: { series: { eq: $series }, lang: { eq: $lang } }
        fileAbsolutePath: { regex: "/blog/" }
      }
    ) {
      nodes {
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
    markdownRemark(
      fields: { slug: { eq: $slug }, lang: { eq: $lang } }
      fileAbsolutePath: { regex: "/blog/" }
    ) {
      html
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        tag
      }
    }
  }
`;

export default BlogPost;
