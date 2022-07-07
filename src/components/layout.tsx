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
      <h1>{pageTitle}</h1>
      <div className="nav-line">
        <Link className="nav-link" to="/">
          소개
        </Link>
        <Link className="nav-link" to="/blog">
          글
        </Link>
      </div>
      {children}
    </article>
  );
};

export default Layout;
