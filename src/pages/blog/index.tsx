import * as React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "../../components/layout";
import styled from "styled-components";

const BlogPage: React.FC<PageProps<Queries.BlogListQuery>> = ({ data }) => {
  return (
    <Layout pageTitle="My Blog Posts">
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

const PostTitle = styled(Link)`
  color: #111817;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.25em;
  color: unset;
`;

const PostDate = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  --tw-text-opacity: 1;
  color: rgba(209, 213, 219, var(--tw-text-opacity));
`;

const PostList = styled.ul`
  padding: 0px;
`;

export default BlogPage;
