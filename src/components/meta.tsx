import * as React from "react";
import LocalizedLink from "./LocaleLink";

interface Props {
  tags?: Array<string>;
  date?: string | null;
}

const Meta: React.FC<Props> = ({ tags, date }) => {
  return (
    <div className="meta-line">
      <div className="meta">
        {"상민, "}
        <time>{date}</time>
        {tags ? " • " : ""}
        {tags?.map((it) => (
          <LocalizedLink className="tag" to={`/tag/${it}`}>
            {it}
          </LocalizedLink>
        ))}
      </div>
      <LocalizedLink className="meta-back" to="/blog">
        뒤로가기
      </LocalizedLink>
    </div>
  );
};

export default Meta;
