import type { GatsbyConfig } from "gatsby";

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
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/blog`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [`gatsby-remark-images`, `gatsby-remark-prismjs`],
      },
    },
    `gatsby-transformer-sharp`,
  ],
};

export default config;
