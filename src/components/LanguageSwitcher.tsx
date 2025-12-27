import { Link } from "gatsby";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  lang: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang }) => {
  const { t } = useTranslation();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const otherLang = lang === "ko" ? "en" : "ko";
  const otherLangPath = currentPath.replace(`/${lang}/`, `/${otherLang}/`);

  return <Link to={otherLangPath}>{t("common.language")}</Link>;
};

export default LanguageSwitcher;
