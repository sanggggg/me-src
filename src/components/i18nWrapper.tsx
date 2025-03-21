import React from "react";
import i18n from "../i18n/i18n";

interface I18nWrapperProps {
  lang: string;
  children: React.ReactNode;
}

const I18nWrapper: React.FC<I18nWrapperProps> = ({ lang, children }) => {
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
  return <>{children}</>;
};

export default I18nWrapper;
