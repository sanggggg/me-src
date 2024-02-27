import * as React from "react";
import { createRef, useEffect } from "react";

const Comment = () => {
  const commentRef = createRef<HTMLDivElement>();
  useEffect(() => {
    const utterances = document.createElement("script");
    utterances.setAttribute("src", "https://utteranc.es/client.js");
    utterances.setAttribute("repo", "sanggggg/me-comment");
    utterances.setAttribute("theme", "github-light");
    utterances.setAttribute("issue-term", "pathname");
    utterances.setAttribute("async", "true");
    utterances.setAttribute("crossorigin", "anonymous");
    if (!commentRef.current?.hasChildNodes()) {
      commentRef.current?.appendChild(utterances);
    }
  });

  return <div className="comments" ref={commentRef}></div>;
};

export default Comment;
