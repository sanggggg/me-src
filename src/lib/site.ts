export const site = {
  title: "@sanggggg",
  titleTemplate: "%s · @sanggggg",
  description: "Personal Website · @sanggggg",
  url: "https://sanggggg.me",
  image: "/feathers_mcgraw.jpeg",
  twitterUsername: "@san_5g",
  manifest: {
    name: "Sangmin Kim @sanggggg",
    shortName: "sanggggg.me",
    themeColor: "#111827",
  },
} as const;

export function formatDocumentTitle(title?: string) {
  return title ? `${title} · @sanggggg` : site.title;
}

export function resolveSiteImage(image = site.image) {
  return new URL(image, site.url).toString();
}
