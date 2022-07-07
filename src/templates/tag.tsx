import * as React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "../components/layout";

export interface TagPageContext {
  tag: string;
}

const BlogPage: React.FC<
  PageProps<Queries.BlogListWithTagQuery, { tag: string }>
> = ({ data, pageContext }) => {
  const tag = pageContext.tag;

  return (
    <Layout pageTitle={`Posts with tag \"${tag}\"`}>
      <ul>
        {data.allMdx.nodes.map((node) => (
          <div className="post-item" key={node.id}>
            <h3>
              <Link to={`${node?.fields?.slug}`} className="post-item-title">
                {node?.frontmatter?.title}
              </Link>
            </h3>
            <time className="post-item-date">{node?.frontmatter?.date}</time>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query BlogListWithTag($tag: String!) {
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { fields: { tags: { eq: $tag } } }
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
