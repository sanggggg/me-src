import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const DEFAULT_LANG = "ko";
export const SUPPORTED_LANGS = ["ko", "en"] as const;

export type Locale = (typeof SUPPORTED_LANGS)[number];

interface Frontmatter {
  author: string;
  date: Date;
  tag?: string;
  title: string;
}

export interface IntroMeta {
  collectionFilePath: string;
  id: string;
  lang: Locale;
  path: string;
  sourcePath: string;
}

export interface PostMeta {
  author: string;
  collectionFilePath: string;
  date: Date;
  hasCodeFence: boolean;
  hasMermaid: boolean;
  id: string;
  lang: Locale;
  normalizedId: string;
  path: string;
  series: string;
  slug: string;
  slugSegments: string[];
  sourcePath: string;
  tags: string[];
  title: string;
  translatedPath: string | null;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const INTRO_DIR = path.join(process.cwd(), "src/content/intro");

function isContentFile(filePath: string) {
  return /\.(md|mdx)$/.test(filePath);
}

function walkContentFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const nextPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkContentFiles(nextPath);
    }

    return isContentFile(nextPath) ? [nextPath] : [];
  });
}

function toCollectionId(baseDir: string, filePath: string) {
  return path
    .relative(baseDir, filePath)
    .replace(/\\/g, "/")
    .replace(/\.(md|mdx)$/, "");
}

function toRepoRelativePath(filePath: string) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, "/");
}

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LANGS.includes(value as Locale);
}

export function getOtherLocale(lang: Locale): Locale {
  return lang === "ko" ? "en" : "ko";
}

export function getLangFromId(id: string): Locale {
  const match = id.match(/\.([a-z]{2,})$/);
  const candidate = match?.[1];
  return candidate && isLocale(candidate) ? candidate : DEFAULT_LANG;
}

export function stripLangSuffix(id: string) {
  return id.replace(/\.([a-z]{2,})$/, "");
}

export function slugSegmentsFromId(id: string) {
  const normalized = stripLangSuffix(id);
  const segments = normalized.split("/").filter(Boolean);

  if (segments.at(-1) === "index") {
    return segments.slice(0, -1);
  }

  return segments;
}

export function buildHomePath(lang: Locale) {
  return `/${lang}/`;
}

export function buildBlogIndexPath(lang: Locale) {
  return `/${lang}/blog/`;
}

export function buildThoughtIndexPath(lang: Locale) {
  return `/${lang}/thought/`;
}

export function buildWorkIndexPath(lang: Locale) {
  return `/${lang}/work/`;
}

export function buildBlogPath(lang: Locale, slugSegments: string[]) {
  return `/${lang}/blog/${slugSegments.join("/")}/`;
}

export function buildTagPath(lang: Locale, tag: string) {
  return `/${lang}/tag/${encodeURIComponent(tag)}/`;
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function parseFrontmatter(filePath: string) {
  const parsed = matter(readFileSync(filePath, "utf8"));
  const data = parsed.data as Partial<Frontmatter>;

  return {
    body: parsed.content,
    frontmatter: {
      author: data.author ?? "",
      date: data.date instanceof Date ? data.date : new Date(String(data.date)),
      tag: data.tag,
      title: data.title ?? "",
    },
  };
}

const blogPosts = (() => {
  const posts = walkContentFiles(BLOG_DIR).map((filePath) => {
    const id = toCollectionId(BLOG_DIR, filePath);
    const { body, frontmatter } = parseFrontmatter(filePath);
    const lang = getLangFromId(id);
    const normalizedId = stripLangSuffix(id);
    const slugSegments = slugSegmentsFromId(id);
    const series =
      slugSegments.slice(0, -1).join("/") || slugSegments.join("/") || "blog";

    return {
      author: frontmatter.author,
      collectionFilePath: toRepoRelativePath(filePath),
      date: frontmatter.date,
      hasCodeFence: body.includes("```"),
      hasMermaid: body.includes("```mermaid"),
      id,
      lang,
      normalizedId,
      path: buildBlogPath(lang, slugSegments),
      series,
      slug: `/blog/${slugSegments.join("/")}/`,
      slugSegments,
      sourcePath: filePath,
      tags: frontmatter.tag
        ? frontmatter.tag
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      title: frontmatter.title,
      translatedPath: null,
    } satisfies PostMeta;
  });

  const translatedById = new Map<string, Map<Locale, string>>();

  for (const post of posts) {
    const current = translatedById.get(post.normalizedId) ?? new Map();
    current.set(post.lang, post.path);
    translatedById.set(post.normalizedId, current);
  }

  return posts
    .map((post) => ({
      ...post,
      translatedPath:
        translatedById.get(post.normalizedId)?.get(getOtherLocale(post.lang)) ??
        null,
    }))
    .sort((left, right) => right.date.getTime() - left.date.getTime());
})();

const introPages = walkContentFiles(INTRO_DIR)
  .map((filePath) => {
    const id = toCollectionId(INTRO_DIR, filePath);
    const lang = getLangFromId(id);

    return {
      id,
      lang,
      path: buildHomePath(lang),
      collectionFilePath: toRepoRelativePath(filePath),
      sourcePath: filePath,
    } satisfies IntroMeta;
  })
  .sort((left, right) => left.lang.localeCompare(right.lang));

export function getAllPostMeta() {
  return blogPosts;
}

export function getPostsForLang(lang: Locale) {
  return blogPosts.filter((post) => post.lang === lang);
}

export function getThoughtPostsForLang(lang: Locale) {
  return getPostsForLang(lang === "en" ? "ko" : lang);
}

export function getSeriesPosts(post: PostMeta) {
  return blogPosts.filter(
    (candidate) =>
      candidate.lang === post.lang && candidate.series === post.series,
  );
}

export function getAllTags() {
  return [...new Set(blogPosts.flatMap((post) => post.tags))].sort(
    (left, right) => left.localeCompare(right),
  );
}

export function getPostsForTag(lang: Locale, tag: string) {
  return blogPosts.filter(
    (post) => post.lang === lang && post.tags.includes(tag),
  );
}

export function getAllIntroMeta() {
  return introPages;
}

export function getIntroMetaByLang(lang: Locale) {
  return introPages.find((entry) => entry.lang === lang);
}
