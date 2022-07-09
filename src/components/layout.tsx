import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";

const Layout: React.FC<React.PropsWithChildren<{ pageTitle: string }>> = ({
  pageTitle,
  children,
}) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <article className="container prose prose-sm md:prose dark:prose-dark">
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <style
        dangerouslySetInnerHTML={{
          __html: `html{font-family:Inter,sans-serif}@supports(font-variation-settings:normal){html{font-family:'Inter var',sans-serif}}`,
        }}
      />
      <h1>{pageTitle}</h1>
      <div className="nav-line">
        <Link className="nav-link" to="/">
          소개
        </Link>
        <Link className="nav-link" to="/blog">
          블로그
        </Link>
      </div>
      {children}
    </article>
  );
};

export default Layout;
