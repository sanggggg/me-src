import * as React from "react";
import Layout from "../components/layout";
import Navigation from "../components/navigation";
import { graphql, PageProps } from "gatsby";

const IndexPage: React.FC<PageProps<Queries.IntroQuery, { lang: string }>> = ({
  data,
  pageContext,
}) => {
  const html = data?.markdownRemark?.html;
  const name = pageContext.lang === "ko" ? "김상민" : "Sangmin Kim";
  return (
    <Layout pageTitle={`${name} (@sanggggg)`} lang={pageContext.lang}>
      <Navigation activePagePath="/" />
      <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />
    </Layout>
  );
};

export const query = graphql`
  query Intro($lang: String!) {
    markdownRemark(
      fields: { lang: { eq: $lang } }
      fileAbsolutePath: { regex: "/intro/" }
    ) {
      html
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        tag
      }
    }
  }
`;

export default IndexPage;
