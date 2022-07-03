import * as React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "../components/layout";
import styled from "styled-components";

const BlogPage: React.FC<PageProps<Queries.BlogListQuery>> = ({
  data,
  pageContext,
}) => {
  const tag = pageContext.tag;

  return (
    <Layout pageTitle={`Posts with tag \"${tag}\"`}>
      <PostList>
        {data.allMdx.nodes.map((node) => (
          <article key={node.id}>
            <h3>
              <PostTitle to={`${node?.fields?.slug}`}>
                {node?.frontmatter?.title}
              </PostTitle>
            </h3>
            <PostDate>{node?.frontmatter?.date}</PostDate>
          </article>
        ))}
      </PostList>
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
