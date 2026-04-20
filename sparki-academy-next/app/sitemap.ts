import type { MetadataRoute } from "next";

const host = "https://sparkiedu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: host, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${host}/tutor`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${host}/dashboard`, changeFrequency: "weekly", priority: 0.6 },
  ];
}
