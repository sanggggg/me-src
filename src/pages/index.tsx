import * as React from "react";
import Layout from "../components/layout";
import Navigation from "../components/navigation";
import { graphql, PageProps } from "gatsby";
import { useTranslation } from "react-i18next";

const IndexPage: React.FC<PageProps<Queries.IntroQuery, { lang: string }>> = ({
  data,
  pageContext,
}) => {
  const html = data?.markdownRemark?.html;
  const { t } = useTranslation();
  const name = t("meta.author");

  return (
    <Layout pageTitle={`${name} (@sanggggg)`} lang={pageContext.lang}>
      <Navigation activePagePath="/" lang={pageContext.lang} />
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
