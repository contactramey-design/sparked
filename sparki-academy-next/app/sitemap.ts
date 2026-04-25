import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.sparkiedu.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.sparkiedu.com/tutor', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.sparkiedu.com/homework', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.sparkiedu.com/ai-literacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.sparkiedu.com/safety', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.sparkiedu.com/dashboard', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]
}
