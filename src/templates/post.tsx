import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../components/layout";

const BlogPost: React.FC<PageProps<Queries.PostDetailQuery>> = ({ data }) => {
  const heroImage =
    data.mdx?.frontmatter?.hero_image?.childImageSharp?.gatsbyImageData;
  const tags = data.mdx?.frontmatter?.tag?.split(",").map((it) => it.trim());
  const series = data.allMdx.nodes;
  console.log(data);

  return (
    <Layout pageTitle={data.mdx?.frontmatter?.title ?? "-"}>
      <p>글 쓴 날짜:{data.mdx?.frontmatter?.date}</p>
      <strong>태그</strong>{" "}
      {tags?.map((it) => (
        <div>
          <Link to={`/tag/${it}`}>{it}</Link> •{" "}
        </div>
      ))}
      <h4>시리즈 게시글</h4>
      <ul>
        {series.map((it) => (
          <li key={it.fields?.slug}>
            <Link to={it.fields?.slug ?? "/"}>{it?.frontmatter?.title}</Link>
          </li>
        ))}
      </ul>
      {heroImage && (
        <GatsbyImage
          image={heroImage}
          alt={data.mdx.frontmatter?.hero_image_alt ?? "-"}
        />
      )}
      <br />
      <MDXRenderer>{data.mdx?.body ?? ""}</MDXRenderer>
    </Layout>
  );
};

export const query = graphql`
  query PostDetail($slug: String!, $series: String) {
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
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
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
        author
        tag
        hero_image_alt
      }
      body
    }
  }
`;

export default BlogPost;
