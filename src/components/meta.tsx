import * as React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import LocalizedLink from "./LocaleLink";

interface Props {
  tags?: Array<string>;
  date?: string | null;
  lang: string;
}

const Meta: React.FC<Props> = ({ tags, date, lang }) => {
  const { t } = useTranslation();
  return (
    <div className="meta-line">
      <div className="meta">
        {`${t("meta.author")}, `}
        <time>{date}</time>
        {tags ? " • " : ""}
        {tags?.map((it) => (
          <LocalizedLink key={it} className="tag" to={`/tag/${it}`}>
            {it}
          </LocalizedLink>
        ))}
      </div>
      <LocalizedLink className="meta-back" to="/blog">
        {t("common.back")}
      </LocalizedLink>
      <div className="meta-back-separator">|</div>
      <LanguageSwitcher lang={lang} />
    </div>
  );
};

export default Meta;
