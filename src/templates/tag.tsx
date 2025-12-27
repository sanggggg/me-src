import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import Layout from "../components/layout";
import Navigation from "../components/navigation";
import LocalizedLink from "../components/LocaleLink";
import { SEO } from "../components/seo";

export interface TagPageContext {
  tag: string;
  lang: string;
}

const BlogPage: React.FC<
  PageProps<Queries.BlogListWithTagQuery, TagPageContext>
> = ({ data, pageContext }) => {
  const tag = pageContext.tag;
  const lang = pageContext.lang;

  return (
    <Layout pageTitle={`Posts with tag "${tag}"`} lang={lang}>
      <Navigation activePagePath="/tag" lang={lang} />
      <ul>
        {data.allMarkdownRemark.nodes.map((node) => (
          <div className="post-item" key={node.id}>
            <h3>
              <LocalizedLink
                to={`${node?.fields?.slug}`}
                className="post-item-title"
              >
                {node?.frontmatter?.title}
              </LocalizedLink>
            </h3>
            <time className="post-item-date">{node?.frontmatter?.date}</time>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export const Head: React.FC<
  HeadProps<Queries.BlogListWithTagQuery, TagPageContext>
> = ({ pageContext, location }) => (
  <SEO title={`Tag: ${pageContext.tag}`} pathname={location.pathname} />
);

export const query = graphql`
  query BlogListWithTag($tag: String!, $lang: String!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: { tags: { eq: $tag }, lang: { eq: $lang } }
        fileAbsolutePath: { regex: "/blog/" }
      }
    ) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
        }
        fields {
          slug
        }
        id
      }
    }
  }
`;

export default BlogPage;
