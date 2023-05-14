import { graphql } from "gatsby";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AllPostsQuery = graphql`
  query AllPosts {
    allMdx(sort: { frontmatter: { date: DESC } }) {
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
