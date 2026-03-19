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
    { url: `${base}/blog/takt-time-calculator`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/pdca-in-manufacturing`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/yamazumi-chart-guide`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/standard-work-manufacturing`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/industries`,                                lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/automotive-process-improvement`,       lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/aerospace-process-improvement`,        lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/food-beverage-process-improvement`,    lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/medical-devices-process-improvement`,  lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/logistics-process-improvement`,        lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/electronics-process-improvement`,      lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/pharmaceuticals-process-improvement`,  lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/industrial-process-improvement`,       lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `\${base}/blog/smed-calculator`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `\${base}/blog/vesimy-vs-excel`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `\${base}/blog/fishbone-diagram-guide`,                lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `\${base}/blog/process-cycle-efficiency`,             lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `\${base}/blog/8-wastes-of-lean`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/privacy`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/terms`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]
}
