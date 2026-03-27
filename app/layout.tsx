// @ts-nocheck
// ── app/layout.tsx ─────────────────────────────────────────────────────────
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { InstallPrompt } from '@/components/ui/InstallPrompt'
import { PostHogPageView } from '@/components/analytics/PostHogPageView'
import { ServiceWorkerRegistration } from '@/components/ui/ServiceWorkerRegistration'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title:       { default: 'VeSiMy — AI Operations Intelligence Platform', template: '%s — VeSiMy' },
  description: 'VeSiMy is the AI platform that monitors your manufacturing processes, detects inefficiencies automatically, and tells your team exactly what to fix. Free VSM, Kaizen, 5 Why, Fishbone, SMED and Gemba Walk tools — all in one platform.',
  keywords:    ['continuous improvement', 'VSM', 'value stream mapping', 'lean manufacturing software', 'kaizen tracking', 'AI process optimization', '5 why analysis', 'fishbone diagram', 'free VSM tool', 'manufacturing AI', 'process improvement software'],
  authors:     [{ name: 'VeSiMy' }],
  creator:     'VeSiMy',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.vesimy.com'),

  // ── PWA manifest ───────────────────────────────────────────────────────────
  manifest: '/manifest.json',

  // ── Apple / iOS meta tags ──────────────────────────────────────────────────
  appleWebApp: {
    capable:           true,
    statusBarStyle:    'black-translucent',
    title:             'VeSiMy',
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type:        'website',
    siteName:    'VeSiMy',
    title:       'VeSiMy — AI Operations Intelligence Platform for Manufacturing',
    description: 'Monitor, record, analyze and suggest process improvements automatically. Free VSM, Kaizen, 5 Why, Fishbone tools — with AI that never clocks out.',
    url:         'https://www.vesimy.com',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'VeSiMy — AI Operations Intelligence Platform' }],
  },

  // ── Twitter Card ───────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'VeSiMy — AI Operations Intelligence Platform',
    description: 'VeSiMy connects your time studies, root cause analyses, Kaizen logs, and value stream maps in one place. Unlimited projects, free forever. Built for lean and CI practitioners.',
    images:      ['/api/og'],
  },

  // ── Icons ──────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico',              sizes: 'any' },
      { url: '/favicon.png',              sizes: '32x32',  type: 'image/png' },
      { url: '/icons/icon-96x96.png',     sizes: '96x96',  type: 'image/png' },
      { url: '/icons/icon-192x192.png',   sizes: '192x192',type: 'image/png' },
      { url: '/icons/icon-512x512.png',   sizes: '512x512',type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png',   sizes: '152x152',type: 'image/png' },
      { url: '/icons/icon-192x192.png',   sizes: '192x192',type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor:    'var(--bg)',
  width:         'device-width',
  initialScale:  1,
  minimumScale:  1,
  viewportFit:   'cover',   // handles iPhone notch / dynamic island
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* iOS splash screens — tells Safari this is a full-screen app */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VeSiMy" />
        {/* Structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "VeSiMy",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "AI-powered continuous improvement platform for lean and manufacturing teams. VSM, Kaizen, 5 Why, SMED, Fishbone, PDCA — all connected.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free plan with unlimited projects"
            },
            "url": "https://www.vesimy.com",
            "author": {
              "@type": "Organization",
              "name": "VeSiMy",
              "url": "https://www.vesimy.com"
            }
          })}}
        />
        {/* MS Tile for Windows pinned sites */}
        <meta name="msapplication-TileColor" content="var(--bg)" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body>
        <PostHogProvider>
        <ThemeProvider>
        <Suspense><PostHogPageView /></Suspense>
        {children}

        {/* PWA components — invisible, run in background */}
        <ServiceWorkerRegistration />
        <InstallPrompt />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background:   'var(--bg3)',
              color:        'var(--text)',
              border:       '1px solid rgba(1,118,211,0.25)',
              borderRadius: '10px',
              fontFamily:   'Inter, sans-serif',
              fontSize:     '14px',
            },
            success: { iconTheme: { primary: '#0176D3', secondary: 'var(--bg)' } },
            error:   { iconTheme: { primary: '#FF6B6B', secondary: 'var(--bg)' } },
          }}
        />
        </ThemeProvider>
        </PostHogProvider>
        {/* Vercel Analytics — traffic + Web Vitals */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
