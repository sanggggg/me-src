import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import Layout from "../components/layout";
import Comment from "../components/comment";
import Meta from "../components/meta";

const BlogPost: React.FC<PageProps<Queries.PostDetailQuery>> = ({ data }) => {
  const html = data.markdownRemark?.html;
  const tags = data.markdownRemark?.frontmatter?.tag
    ?.split(",")
    .map((it) => it.trim());
  const series = data.allMarkdownRemark.nodes;

  return (
    <Layout
      pageTitle={data.markdownRemark?.frontmatter?.title ?? "-"}
      isArticle
    >
      <Meta tags={tags} date={data.markdownRemark?.frontmatter?.date} />
      {series.length > 1 ? (
        <>
          <blockquote>
            <h4>시리즈 게시글</h4>
            <ul>
              {series.map((it) => (
                <li key={it.fields?.slug}>
                  <Link to={it.fields?.slug ?? "/"}>
                    {it?.frontmatter?.title}
                  </Link>
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

export const query = graphql`
  query PostDetail($slug: String!, $series: String) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { series: { eq: $series } } }
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        hero_image
        author
        tag
        hero_image_alt
      }
    }
  }
`;

export default BlogPost;
