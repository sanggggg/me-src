import { expect, test } from "@playwright/test";
import {
  buildBlogIndexPath,
  buildHomePath,
  buildTagPath,
  getAllPostMeta,
  getAllTags,
  getPostsForTag,
  getThoughtPostsForLang,
} from "../../src/lib/content-meta";

function isIgnoredError(text: string) {
  return (
    text.includes("googletagmanager.com") ||
    text.includes("www.google-analytics.com") ||
    text.includes("utteranc.es")
  );
}

function attachErrorCapture(page: import("@playwright/test").Page) {
  const failures: string[] = [];

  page.on("pageerror", (error) => {
    failures.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error" && !isIgnoredError(message.text())) {
      failures.push(`console: ${message.text()}`);
    }
  });

  return failures;
}

async function assertLocalImagesLoaded(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const scrollStep = 800;
    const wait = (time: number) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, time);
      });

    for (
      let offset = 0;
      offset <= document.body.scrollHeight;
      offset += scrollStep
    ) {
      window.scrollTo(0, offset);
      await wait(50);
    }

    window.scrollTo(0, 0);
    await wait(100);
  });

  const brokenImages = await page
    .locator("article img[src^='/']")
    .evaluateAll((images) =>
      images
        .filter(
          (image) =>
            !(image instanceof HTMLImageElement) ||
            !image.complete ||
            image.naturalWidth === 0,
        )
        .map((image) => image.getAttribute("src") ?? ""),
    );

  expect(brokenImages).toEqual([]);
}

const contentRoutes = [
  ...["ko", "en"].map((lang) => buildHomePath(lang as "ko" | "en")),
  ...["ko", "en"].map((lang) => buildBlogIndexPath(lang as "ko" | "en")),
  "/ko/work/",
  "/en/work/",
  "/ko/thought/",
  "/en/thought/",
  ...getAllPostMeta().map((post) => post.path),
  ...["ko", "en"].flatMap((lang) =>
    getAllTags().map((tag) => buildTagPath(lang as "ko" | "en", tag)),
  ),
];

test.describe("route smoke", () => {
  for (const route of contentRoutes) {
    test(`renders ${route}`, async ({ page }) => {
      const failures = attachErrorCapture(page);
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByRole("heading").first()).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(failures).toEqual([]);
      await assertLocalImagesLoaded(page);
    });
  }
});

test("redirects / to the default locale", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveURL("/ko/");
});

test("redirects unprefixed blog and tag routes to the default locale", async ({
  page,
}) => {
  await page.goto("/blog/aws-vpc/");
  await expect(page).toHaveURL("/ko/blog/aws-vpc/");
  await page.goto("/tag/android/");
  await expect(page).toHaveURL("/ko/tag/android/");
});

test("switches locales on the intro page", async ({ page }) => {
  await page.goto("/ko/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/");
});

test("homepage presents experience, education, and recent thoughts", async ({
  page,
}) => {
  const recentEnglishPosts = getThoughtPostsForLang("en").slice(0, 5);
  const expectedEnglishThoughtCount = Math.min(5, recentEnglishPosts.length);

  expect(recentEnglishPosts.every((post) => post.lang === "ko")).toBe(true);

  await page.goto("/en/");

  await expect(
    page.getByRole("heading", { name: "Sangmin Kim @sanggggg" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "I’m a software developer who enjoys working as a generalist.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "I like exploring different product domains and frameworks, and finding patterns that help turn ideas into useful products.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "I’m especially interested in startups, AI-assisted problem-solving, and small teams using technology to solve real-world problems.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Thought" })).toBeVisible();
  await expect(page.locator("[data-work-item]")).toHaveCount(5);
  await expect(page.locator("[data-work-item] .row-title")).toHaveText([
    "Pensive",
    "Stair Crusher Club",
    "VCNC",
    "Nearthlab",
    "NAVER",
  ]);
  await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
  await expect(page.locator("[data-education-item]")).toHaveCount(2);
  await expect(page.locator("[data-education-item] .row-title")).toHaveText([
    "Seoul National University",
    "Waffle Studio",
  ]);
  await expect(
    page.getByText("President, SNU Web/App Programming Club"),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "View all" })).toHaveCount(1);
  await expect(page.locator("[data-contact-item]")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:ksme6776@gmail.com",
  );
  await expect(page.locator("main section h2")).toHaveText([
    "Experience",
    "Education",
    "Thought",
  ]);
  await expect(page.locator("[data-thought-item]")).toHaveCount(
    expectedEnglishThoughtCount,
  );

  for (const post of recentEnglishPosts) {
    await expect(page.getByRole("link", { name: post.title })).toBeVisible();
  }
});

test("renders localized experience and thought pages", async ({ page }) => {
  await page.goto("/ko/work/");
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.locator("[data-work-item]")).toHaveCount(5);
  await expect(page.locator("[data-work-item] .row-title")).toHaveText([
    "Pensive",
    "계단뿌셔클럽",
    "VCNC",
    "니어스랩",
    "네이버",
  ]);
  await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
  await expect(page.locator("[data-education-item]")).toHaveCount(2);
  await expect(page.locator("[data-education-item] .row-title")).toHaveText([
    "서울대학교",
    "와플스튜디오",
  ]);
  await expect(
    page.getByText("회장, 서울대학교 웹/앱 프로그래밍 동아리"),
  ).toBeVisible();
  await expect(
    page
      .locator("[data-work-item]")
      .first()
      .locator(".row-description")
      .first(),
  ).toHaveText("파운딩 엔지니어");
  await expect(page.locator("[data-work-item] .row-meta").first()).toHaveText(
    "2026.03 - 현재",
  );
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/work/");

  await page.goto("/en/thought/");
  await expect(page.getByRole("heading", { name: "Thought" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back" })).toHaveAttribute(
    "href",
    "/en/",
  );
  await expect(page.locator("[data-thought-item]")).toHaveCount(
    getThoughtPostsForLang("en").length,
  );
  await page.getByRole("link", { name: "한국어" }).click();
  await expect(page).toHaveURL("/ko/thought/");
});

test("uses calm reference-inspired navigation and motion", async ({ page }) => {
  await page.goto("/en/");

  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  await expect(primaryNav.getByText("Sangmin", { exact: true })).toHaveCount(0);
  await expect(primaryNav.getByText("Work", { exact: true })).toHaveCount(0);
  await expect(primaryNav.getByText("Thought", { exact: true })).toHaveCount(0);
  await expect(primaryNav.getByRole("link", { name: "한국어" })).toBeVisible();

  const motion = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const navLink = document.querySelector(".nav-link");
    const pageShell = document.querySelector(".page-shell");
    const listRow = document.querySelector(".list-row");

    if (!navLink || !listRow || !pageShell) {
      return null;
    }

    const navLinkStyles = getComputedStyle(navLink);
    const listRowStyles = getComputedStyle(listRow);
    const pageShellStyles = getComputedStyle(pageShell);

    return {
      durationQuick: rootStyles.getPropertyValue("--duration-quick").trim(),
      durationRegular: rootStyles.getPropertyValue("--duration-regular").trim(),
      easeOut: rootStyles.getPropertyValue("--ease-out-expo").trim(),
      listRowTransitionProperty: listRowStyles.transitionProperty,
      pageAnimation: pageShellStyles.animationName,
      transitionDuration: navLinkStyles.transitionDuration,
      transitionProperty: navLinkStyles.transitionProperty,
    };
  });

  expect(Number.parseFloat(motion?.durationQuick ?? "")).toBeCloseTo(0.1);
  expect(Number.parseFloat(motion?.durationRegular ?? "")).toBeCloseTo(0.18);
  expect(motion?.easeOut.replaceAll("0.", ".")).toBe(
    "cubic-bezier(.19, 1, .22, 1)",
  );
  expect(motion?.pageAnimation).toBe("page-enter");
  expect(motion?.transitionDuration).toBe("0.18s");
  expect(motion?.transitionProperty).toBe("color, opacity");
  expect(motion?.listRowTransitionProperty).toBe("color, opacity");

  const languageLink = primaryNav.getByRole("link", { name: "한국어" });
  const languageColorBefore = await languageLink.evaluate(
    (node) => getComputedStyle(node).color,
  );

  await languageLink.hover();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".nav-line a")!).transform,
      ),
    )
    .toBe("none");
  await expect
    .poll(() => languageLink.evaluate((node) => getComputedStyle(node).color))
    .not.toBe(languageColorBefore);

  const thoughtItem = page.locator("[data-thought-item]").first();
  const titleColorBefore = await thoughtItem
    .locator(".row-title")
    .evaluate((node) => getComputedStyle(node).color);

  await thoughtItem.hover();
  await expect
    .poll(() =>
      page.evaluate(
        () => getComputedStyle(document.querySelector(".list-row")!).transform,
      ),
    )
    .toBe("none");
  await expect
    .poll(() =>
      thoughtItem
        .locator(".row-title")
        .evaluate((node) => getComputedStyle(node).color),
    )
    .not.toBe(titleColorBefore);
});

test("falls back to the English blog index without a translation", async ({
  page,
}) => {
  await page.goto("/ko/blog/retrospect-organization/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/blog/");
});

test("falls back to the other locale blog index for untranslated posts", async ({
  page,
}) => {
  await page.goto("/ko/blog/jvm-non-blocking/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/blog/");
});

test("renders mermaid diagrams as SVG", async ({ page }) => {
  const mermaidPosts = getAllPostMeta().filter((post) => post.hasMermaid);

  for (const post of mermaidPosts) {
    await page.goto(post.path);
    await expect(page.locator("article svg").first()).toBeVisible();
  }
});

test("renders syntax-highlighted code blocks", async ({ page }) => {
  const codePost = getAllPostMeta().find((post) => post.hasCodeFence);

  if (!codePost) {
    throw new Error("Expected at least one post with fenced code blocks.");
  }

  await page.goto(codePost.path);
  await expect(page.locator("pre[class*='language-']").first()).toBeVisible();
});

test("renders the comments embed container", async ({ page }) => {
  await page.goto("/ko/blog/aws-vpc/");
  await expect
    .poll(async () =>
      page
        .locator(".comments")
        .evaluate((element) => element.childElementCount),
    )
    .toBeGreaterThan(0);
});

test("preserves representative SEO tags", async ({ page }) => {
  await page.goto("/ko/blog/aws-vpc/");
  await expect(page).toHaveTitle("AWS VPC 너무 어려워 · @sanggggg");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "AWS VPC 너무 어려워",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "AWS VPC 너무 어려워",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
});

test("keeps empty English tag pages available", async ({ page }) => {
  const tag = getAllTags().find(
    (candidate) => getPostsForTag("en", candidate).length === 0,
  );

  if (!tag) {
    throw new Error("Expected at least one empty English tag page.");
  }

  await page.goto(buildTagPath("en", tag));
  await expect(
    page.getByRole("heading", { name: `Posts with tag "${tag}"` }),
  ).toBeVisible();
  await expect(page.locator(".post-item")).toHaveCount(0);
  await page.getByRole("link", { name: "한국어" }).click();
  await expect(page).toHaveURL(buildTagPath("ko", tag));
});

test("returns the 404 page for unknown routes", async ({ page }) => {
  const response = await page.goto("/definitely-missing/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
