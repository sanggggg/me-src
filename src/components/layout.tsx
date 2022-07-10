import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import SEO from "./seo";

const Layout: React.FC<
  React.PropsWithChildren<{ pageTitle: string; isArticle?: boolean }>
> = ({ pageTitle, isArticle, children }) => {
  return (
    <article className="container prose prose-sm md:prose dark:prose-dark">
      <SEO isArticle={isArticle ?? false} title={pageTitle} />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <style
        dangerouslySetInnerHTML={{
          __html: `html{font-family:Inter,sans-serif}@supports(font-variation-settings:normal){html{font-family:'Inter var',sans-serif}}`,
        }}
      />
      <h1>{pageTitle}</h1>
      {children}
    </article>
  );
};

export default Layout;
