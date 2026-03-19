import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,               priority: 1.0,  changeFrequency: 'daily'   as const },
    { url: `${BASE}/feed`,     priority: 0.9,  changeFrequency: 'hourly'  as const },
    { url: `${BASE}/explore`,  priority: 0.85, changeFrequency: 'hourly'  as const },
    { url: `${BASE}/reels`,    priority: 0.8,  changeFrequency: 'hourly'  as const },
    { url: `${BASE}/roadmap`,  priority: 0.75, changeFrequency: 'weekly'  as const },
    { url: `${BASE}/invite`,   priority: 0.75, changeFrequency: 'weekly'  as const },
    { url: `${BASE}/glyphs`,   priority: 0.7,  changeFrequency: 'daily'   as const },
    { url: `${BASE}/subscribe`,priority: 0.7,  changeFrequency: 'monthly' as const },
    { url: `${BASE}/register`, priority: 0.65, changeFrequency: 'monthly' as const },
    { url: `${BASE}/terms`,    priority: 0.3,  changeFrequency: 'yearly'  as const },
    { url: `${BASE}/privacy`,  priority: 0.3,  changeFrequency: 'yearly'  as const },
  ]

  return staticPages.map(page => ({
    ...page,
    lastModified: new Date(),
  }))
}
