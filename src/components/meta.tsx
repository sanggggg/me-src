import { Link } from "gatsby";
import * as React from "react";

interface Props {
  tags?: string[];
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
          <Link className="tag" to={`/tag/${it}`}>
            {it}
          </Link>
        ))}
      </div>
      <Link className="meta-back" to="/blog">
        뒤로가기
      </Link>
    </div>
  );
};

export default Meta;
