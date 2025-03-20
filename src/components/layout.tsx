import * as React from "react";
import SEO from "./seo";

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
  return (
    <LocaleContext.Provider value={{ locale: lang }}>
      <article className="container prose prose-sm md:prose dark:prose-dark">
        <SEO isArticle={isArticle ?? false} title={pageTitle} />
        <h1 style={{ fontWeight: 700 }}>{pageTitle}</h1>
        {children}
      </article>
    </LocaleContext.Provider>
  );
};

export default Layout;
