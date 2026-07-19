import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  site: "https://sanggggg.me",
  publicDir: "./static",
  trailingSlash: "always",
  integrations: [mdx(), tailwind()],
  markdown: {
    syntaxHighlight: {
      type: "prism",
      excludeLangs: ["mermaid"],
    },
    rehypePlugins: [[rehypeMermaid, { strategy: "inline-svg" }]],
  },
});
