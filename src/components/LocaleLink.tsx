import React from "react";
import { Link } from "gatsby";
import { LocaleContext } from "./layout";

interface LocalizedLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
  activeClassName?: string;
  activeStyle?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Use the globally available context to choose the right path
const LocalizedLink: React.FC<LocalizedLinkProps> = ({ to, ...props }) => {
  const { locale } = React.useContext(LocaleContext);

  const isIndex = to === `/`;

  // If it's the default language, don't do anything
  // If it's another language, add the "path"
  // However, if the homepage/index page is linked don't add the "to"
  // Because otherwise this would add a trailing slash
  const path = `/${locale}${isIndex ? `` : `${to}`}`;

  return <Link to={path} {...props} />;
};

export default LocalizedLink;
