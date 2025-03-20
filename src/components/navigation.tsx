import * as React from "react";
import LocalizedLink from "./LocaleLink";

interface Props {
  activePagePath: string;
}

const Navigation: React.FC<Props> = ({ activePagePath }) => {
  const pages = PAGES;
  return (
    <div className="nav-line">
      {pages.map((it) =>
        it.path === activePagePath ? (
          <span key={it.path} className="nav-link">
            {it.name}
          </span>
        ) : (
          <LocalizedLink key={it.path} className="nav-link" to={it.path}>
            {it.name}
          </LocalizedLink>
        )
      )}
    </div>
  );
};

export const PAGES = [
  { path: "/", name: "소개" },
  { path: "/blog", name: "블로그" },
];

export default Navigation;
