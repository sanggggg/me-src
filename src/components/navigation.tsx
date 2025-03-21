import * as React from "react";
import LocalizedLink from "./LocaleLink";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

interface Props {
  activePagePath: string;
  lang: string;
}

const Navigation: React.FC<Props> = ({ activePagePath, lang }) => {
  const { t } = useTranslation();
  const pages = [
    { path: "/", name: t("nav.intro") },
    { path: "/blog", name: t("nav.blog") },
  ];

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
      <div className="mx-4 text-gray-400">|</div>
      <LanguageSwitcher lang={lang} />
    </div>
  );
};

export default Navigation;
