import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    {
      url: "https://immodelo.fr/",
      lastModified: now,
    },
  ];
}
