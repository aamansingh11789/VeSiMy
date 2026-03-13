import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.vesimy.com'
  const now = new Date()

  return [
    { url: base,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/beta`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/enterprise`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/demo`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/changelog`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/blog`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/blog/what-is-value-stream-mapping`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/free-vsm-tool`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/kaizen-event-template`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/5-why-analysis-examples`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/terms`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]
}
