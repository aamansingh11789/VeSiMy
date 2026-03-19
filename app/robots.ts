import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard/', '/settings/', '/onboarding/', '/project/'],
      },
    ],
    sitemap: 'https://www.vesimy.com/sitemap.xml',
    host: 'https://www.vesimy.com',
  }
}
