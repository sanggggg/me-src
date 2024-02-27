import type { GatsbyConfig } from "gatsby";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const config: GatsbyConfig = {
  siteMetadata: {
    title: "@sanggggg",
    titleTemplate: "%s · @sanggggg",
    description: "Personal Website · @sanggggg",
    url: "https://sanggggg.me", // No trailing slash allowed!
    image: "/feathers_mcgraw.jpeg", // Path to the image placed in the 'static' folder, in the project's root directory.
    twitterUsername: "@san_5g",
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: process.env.BLOG_MOUNTED_PATH,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sangmin Kim @sanggggg`,
        short_name: `sanggggg.me`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#111827`,
        display: `standalone`,
        icon: `static/icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-images`, `gatsby-remark-prismjs`],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          typeof process.env.GTAG_ID === "string"
            ? process.env.GTAG_ID
            : "dummy",
        ],
        pluginConfig: {
          head: true,
          origin: "https://sanggggg.me",
        },
      },
    },
  ],
};

export default config;
