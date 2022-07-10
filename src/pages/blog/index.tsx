import * as React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "../../components/layout";
import styled from "styled-components";
import Navigation from "../../components/navigation";

const BlogList: React.FC<PageProps<Queries.BlogListQuery>> = ({ data }) => {
  return (
    <Layout pageTitle="개발">
      <Navigation activePagePath="/blog" />
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
  query BlogList {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
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
