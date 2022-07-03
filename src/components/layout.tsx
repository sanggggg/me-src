import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import "../css/typography.css";

const GlobalStyle = createGlobalStyle`
* {
  font-family: "Pretendard Variable";
}
`;

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
    <>
      <GlobalStyle />
      <Container>
        <title>
          {pageTitle} | {data.site.siteMetadata.title}
        </title>
        <SiteTitle>{pageTitle}</SiteTitle>
        <nav>
          <NavLinks>
            <NavLinkItem>
              <NavLinkText to="/">소개</NavLinkText>
            </NavLinkItem>
            <NavLinkItem>
              <NavLinkText to="/blog">글</NavLinkText>
            </NavLinkItem>
          </NavLinks>
        </nav>
        <main>{children}</main>
      </Container>
    </>
  );
};

const Container = styled.div`
  margin: auto;
  max-width: 65ch;
  display: block;
  padding-top: 5rem;
  padding-bottom: 8rem;
`;

const NavLinks = styled.ul`
  display: flex;
  justify-content: end;
  list-style: none;
  padding-left: 0;
`;

const NavLinkItem = styled.li`
  margin-left: 12px;
`;

const NavLinkText = styled(Link)`
  color: rgba(75, 85, 99, var(--tw-text-opacity));
  font-weight: 500;
  text-decoration: underline;
`;

const SiteTitle = styled.h1`
  margin-top: 0px;
  margin-bottom: 0.9em;
  font-size: 2.25rem;
  color: #111827;
  font-weight: 800;
`;

export default Layout;
