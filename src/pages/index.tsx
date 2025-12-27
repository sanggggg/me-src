import { graphql, type HeadProps, type PageProps } from "gatsby";
import * as React from "react";
import Layout from "../components/layout";
import Navigation from "../components/navigation";
import { SEO } from "../components/seo";

const IndexPage: React.FC<PageProps<Queries.IntroQuery, { lang: string }>> = ({
  data,
  pageContext,
}) => {
  const html = data?.markdownRemark?.html;

  return (
    <Layout pageTitleKey="home.title" lang={pageContext.lang}>
      <Navigation activePagePath="/" lang={pageContext.lang} />
      <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />
    </Layout>
  );
};

export const Head: React.FC<HeadProps<Queries.IntroQuery>> = ({ location }) => (
  <SEO pathname={location.pathname} />
);

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
