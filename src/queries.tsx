import { graphql } from "gatsby";

const AllPostsQuery = graphql`
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
`;

type AllPostQuery = Queries.AllPostsQuery;

// export for gatsby-node.ts
// TODO: gatsby-types.d.ts is not accessible in gatsby-node.ts
export type { AllPostQuery };
