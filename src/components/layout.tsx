import * as React from "react";
import SEO from "./seo";

const Layout: React.FC<
  React.PropsWithChildren<{ pageTitle: string; isArticle?: boolean }>
> = ({ pageTitle, isArticle, children }) => {
  return (
    <article className="container prose prose-sm md:prose dark:prose-dark">
      <SEO isArticle={isArticle ?? false} title={pageTitle} />
      <h1>{pageTitle}</h1>
      {children}
    </article>
  );
};

export default Layout;
