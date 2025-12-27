import * as React from "react";
import I18nWrapper from "./i18nWrapper";

export const LocaleContext = React.createContext<{
  locale: string;
}>({
  locale: "ko",
});

const Layout: React.FC<
  React.PropsWithChildren<{
    pageTitle: string;
    lang: string;
  }>
> = ({ pageTitle, children, lang }) => {
  return (
    <I18nWrapper lang={lang}>
      <LocaleContext.Provider value={{ locale: lang }}>
        <div className="relative">
          <article className="container prose prose-sm md:prose dark:prose-dark">
            <h1 style={{ fontWeight: 700 }}>{pageTitle}</h1>
            {children}
          </article>
        </div>
      </LocaleContext.Provider>
    </I18nWrapper>
  );
};

export default Layout;
