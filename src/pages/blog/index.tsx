import * as React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../../components/layout";
import Navigation from "../../components/navigation";
import LocalizedLink from "../../components/LocaleLink";

const BlogList: React.FC<
  PageProps<Queries.BlogListQuery, { lang: string }>
> = ({ data, pageContext }) => {
  const lang = pageContext.lang;
  return (
    <Layout pageTitle="개발" lang={lang}>
      <Navigation activePagePath="/blog" />
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
    </Layout>
  );
};

export const query = graphql`
  query BlogList($lang: String!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: { lang: { eq: $lang } }
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

export default BlogList;
