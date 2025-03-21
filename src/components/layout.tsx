import * as React from "react";
import SEO from "./seo";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import I18nWrapper from "./i18nWrapper";

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
    <I18nWrapper lang={lang}>
      <LocaleContext.Provider value={{ locale: lang }}>
        <div className="relative">
          <article className="container prose prose-sm md:prose dark:prose-dark">
            <SEO isArticle={isArticle ?? false} title={pageTitle} />
            <h1 style={{ fontWeight: 700 }}>{pageTitle}</h1>
            {children}
          </article>
        </div>
      </LocaleContext.Provider>
    </I18nWrapper>
  );
};

export default Layout;
