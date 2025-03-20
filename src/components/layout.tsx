import * as React from "react";
import SEO from "./seo";
import { Link } from "gatsby";

export const LocaleContext = React.createContext<{
  locale: string;
}>({
  locale: "ko",
});

const Layout: React.FC<
  React.PropsWithChildren<{
    pageTitle: string;
    isArticle?: boolean;
    lang: string;
  }>
> = ({ pageTitle, isArticle, children, lang }) => {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const otherLang = lang === "ko" ? "en" : "ko";
  const otherLangPath = currentPath.replace(`/${lang}/`, `/${otherLang}/`);

  return (
    <LocaleContext.Provider value={{ locale: lang }}>
      <div className="relative">
        <article className="container prose prose-sm md:prose dark:prose-dark">
          <Link to={otherLangPath}>{lang === "ko" ? "English" : "한국어"}</Link>
          <SEO isArticle={isArticle ?? false} title={pageTitle} />
          <h1 style={{ fontWeight: 700 }}>{pageTitle}</h1>
          {children}
        </article>
      </div>
    </LocaleContext.Provider>
  );
};

export default Layout;
