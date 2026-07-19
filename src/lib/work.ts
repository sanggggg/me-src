import type { Locale } from "./content-meta";

interface LocalizedText {
  en: string;
  ko: string;
}

export interface WorkItem {
  description: LocalizedText;
  href: string;
  image: string;
  organization: LocalizedText;
  period: LocalizedText;
  role: LocalizedText;
}

export const experienceItems = [
  {
    organization: {
      en: "Pensive",
      ko: "Pensive",
    },
    role: {
      en: "Founding Engineer",
      ko: "파운딩 엔지니어",
    },
    period: {
      en: "Mar 2026 - Present",
      ko: "2026.03 - 현재",
    },
    description: {
      en: "Building AI-powered software as a founding engineer.",
      ko: "파운딩 엔지니어로서 AI 기반 소프트웨어 제품을 만들고 있습니다.",
    },
    href: "https://www.pensive.com/",
    image: "https://www.pensive.com/favicon.png",
  },
  {
    organization: {
      en: "Stair Crusher Club",
      ko: "계단뿌셔클럽",
    },
    role: {
      en: "Software Engineer",
      ko: "소프트웨어 엔지니어",
    },
    period: {
      en: "Mar 2024 - Jan 2026",
      ko: "2024.03 - 2026.01",
    },
    description: {
      en: "Contributed to a nonprofit team improving accessibility in everyday places.",
      ko: "일상 공간의 접근성을 개선하는 비영리 팀에서 소프트웨어를 개발했습니다.",
    },
    href: "https://www.staircrusher.club",
    image:
      "https://framerusercontent.com/images/IOOQ7w6wVHbt4kpMG6lobaJ2wM.webp",
  },
  {
    organization: {
      en: "VCNC",
      ko: "VCNC",
    },
    role: {
      en: "Software Engineer",
      ko: "소프트웨어 엔지니어",
    },
    period: {
      en: "Nov 2020 - Oct 2023",
      ko: "2020.11 - 2023.10",
    },
    description: {
      en: "Worked across Android, iOS, frontend, backend, and DevOps for TADA.",
      ko: "타다 서비스에서 Android, iOS, 프론트엔드, 백엔드, DevOps를 두루 경험했습니다.",
    },
    href: "https://www.tadatada.com",
    image:
      "https://framerusercontent.com/images/mvX62yJu1mFp0UZp6nyzoG6kDOg.png",
  },
  {
    organization: {
      en: "Nearthlab",
      ko: "니어스랩",
    },
    role: {
      en: "Machine Learning Engineer",
      ko: "머신러닝 엔지니어",
    },
    period: {
      en: "Jun 2020 - Oct 2020",
      ko: "2020.06 - 2020.10",
    },
    description: {
      en: "Worked on autonomous drone inspection technology for industrial sites.",
      ko: "산업 현장을 위한 자율 비행 드론 점검 기술을 다뤘습니다.",
    },
    href: "https://www.nearthlab.com/kr/",
    image: "https://www.nearthlab.com/favicon.ico",
  },
  {
    organization: {
      en: "NAVER",
      ko: "네이버",
    },
    role: {
      en: "Software Developer Intern",
      ko: "소프트웨어 개발 인턴",
    },
    period: {
      en: "Jul 2019 - Aug 2019",
      ko: "2019.07 - 2019.08",
    },
    description: {
      en: "Worked on the NAVER Maps mobile application.",
      ko: "네이버 지도 모바일 애플리케이션 개발에 참여했습니다.",
    },
    href: "https://www.navercorp.com/",
    image: "https://www.navercorp.com/img/favicon.ico",
  },
] satisfies WorkItem[];

export const educationItems = [
  {
    organization: {
      en: "Seoul National University",
      ko: "서울대학교",
    },
    role: {
      en: "Computer Science and Engineering",
      ko: "컴퓨터공학부",
    },
    period: {
      en: "Feb 2018 - Feb 2026",
      ko: "2018.02 - 2026.02",
    },
    description: {
      en: "Studied computer science with a focus on algorithms, product engineering, and practical software systems.",
      ko: "알고리즘, 제품 엔지니어링, 실용적인 소프트웨어 시스템을 중심으로 컴퓨터공학을 공부했습니다.",
    },
    href: "https://cse.snu.ac.kr/",
    image: "https://www.snu.ac.kr/_skin/kor/layout/ico/favicon.ico",
  },
  {
    organization: {
      en: "Waffle Studio",
      ko: "와플스튜디오",
    },
    role: {
      en: "President, SNU Web/App Programming Club",
      ko: "회장, 서울대학교 웹/앱 프로그래밍 동아리",
    },
    period: {
      en: "2019",
      ko: "2019",
    },
    description: {
      en: "Served as president of the student engineering community in 2019.",
      ko: "2019년 학생 엔지니어링 커뮤니티의 회장을 맡았습니다.",
    },
    href: "https://wafflestudio.com/",
    image: "https://wafflestudio.com/waffle_logo_favicon.png",
  },
] satisfies WorkItem[];

export function localizeWorkItem(item: WorkItem, lang: Locale) {
  return {
    description: item.description[lang],
    href: item.href,
    image: item.image,
    organization: item.organization[lang],
    period: item.period[lang],
    role: item.role[lang],
  };
}
