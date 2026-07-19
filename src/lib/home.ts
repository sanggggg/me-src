import type { Locale } from "./content-meta";

export const homeCopy: Record<
  Locale,
  {
    contact: Array<{ href: string; label: string }>;
    intro: string[];
  }
> = {
  en: {
    intro: [
      "I’m a software developer who enjoys working as a generalist.",
      "I like exploring different product domains and frameworks, and finding patterns that help turn ideas into useful products.",
      "I’m especially interested in startups, AI-assisted problem-solving, and small teams using technology to solve real-world problems.",
    ],
    contact: [
      { href: "https://github.com/sanggggg", label: "GitHub" },
      {
        href: "https://www.linkedin.com/in/sangmin-kim-6696a4197/",
        label: "LinkedIn",
      },
    ],
  },
  ko: {
    intro: [
      "제너럴리스트로 일하는 것을 좋아하는 소프트웨어 개발자입니다.",
      "제품 도메인과 프레임워크를 넓게 배우며, 아이디어를 유용한 제품으로 바꾸는 패턴에 끌립니다.",
      "스타트업, AI를 활용한 문제 해결, 그리고 작은 팀이 기술로 실제 문제를 푸는 방식에 관심이 많습니다.",
    ],
    contact: [
      { href: "https://github.com/sanggggg", label: "GitHub" },
      {
        href: "https://www.linkedin.com/in/sangmin-kim-6696a4197/",
        label: "LinkedIn",
      },
    ],
  },
};
