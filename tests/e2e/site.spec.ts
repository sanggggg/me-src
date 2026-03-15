import { expect, test } from "@playwright/test";
import {
  buildBlogIndexPath,
  buildHomePath,
  buildTagPath,
  getAllPostMeta,
  getAllTags,
  getPostsForTag,
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

test("switches locales on the translated post", async ({ page }) => {
  await page.goto("/ko/blog/retrospect-organization/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/blog/retrospect-organization/");
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
