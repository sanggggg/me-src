import { Link } from "gatsby";
import * as React from "react";

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
          <Link key={it.path} className="nav-link" to={it.path}>
            {it.name}
          </Link>
        )
      )}
    </div>
  );
};

export const PAGES = [
  { path: "/", name: "소개" },
  { path: "/blog", name: "블로그" },
  { path: "/tracker", name: "트래커" },
];

export default Navigation;
