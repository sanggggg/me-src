import * as React from "react";
import { useTranslation } from "react-i18next";
import I18nWrapper from "./i18nWrapper";

export const LocaleContext = React.createContext<{
  locale: string;
}>({
  locale: "ko",
});

const PageTitle: React.FC<{
  titleKey?: string;
  titleParams?: Record<string, string>;
  title?: string;
}> = ({ titleKey, titleParams, title }) => {
  const { t } = useTranslation();
  return (
    <h1 style={{ fontWeight: 700 }}>
      {titleKey ? t(titleKey, titleParams) : title}
    </h1>
  );
};

const Layout: React.FC<
  React.PropsWithChildren<{
    pageTitleKey?: string;
    pageTitleParams?: Record<string, string>;
    pageTitle?: string;
    lang: string;
  }>
> = ({ pageTitleKey, pageTitleParams, pageTitle, children, lang }) => {
  return (
    <I18nWrapper lang={lang}>
      <LocaleContext.Provider value={{ locale: lang }}>
        <div className="relative">
          <article className="container prose prose-sm md:prose dark:prose-dark">
            <PageTitle
              titleKey={pageTitleKey}
              titleParams={pageTitleParams}
              title={pageTitle}
            />
            {children}
          </article>
        </div>
      </LocaleContext.Provider>
    </I18nWrapper>
  );
};

export default Layout;
