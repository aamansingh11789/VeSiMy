// TypeScript enabled
// ── app/layout.tsx ─────────────────────────────────────────────────────────
import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { InstallPrompt } from '@/components/ui/InstallPrompt'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { PostHogPageView } from '@/components/analytics/PostHogPageView'
import { ServiceWorkerRegistration } from '@/components/ui/ServiceWorkerRegistration'
import { ProfileRefresh } from '@/components/ui/ProfileRefresh'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import './globals.css'

export const metadata: Metadata = {
  title:       { default: 'VeSiMy — AI Operations Intelligence Platform', template: '%s — VeSiMy' },
  description: 'VeSiMy helps teams map processes, identify waste and bottlenecks, and turn continuous improvement work into clear actions, reports, and measurable targets.',
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
    title:       'VeSiMy — AI-Powered Process Improvement for Every Industry',
    description: 'Map your process, identify waste and bottlenecks, and start structured improvement work. Free to start — no account needed.',
    url:         'https://www.vesimy.com',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'VeSiMy — AI Process Improvement for Every Industry' }],
  },

  // ── Twitter Card ───────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'VeSiMy — AI Process Improvement',
    description: 'Map your process, identify waste, and take structured action with lean tools and AI guidance.',
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
            "description": "Continuous improvement platform for teams that need to map processes, identify waste, and track improvement actions. VSM, Kaizen, 5 Why, SMED, Fishbone, PDCA — all connected.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "14-day free trial · 3 projects · No credit card required"
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
        {/* Google Fonts — DM Serif Display + IBM Plex Mono for homepage/reports */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Satoshi — display font for v4.0 public pages */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PostHogProvider>
        <ThemeProvider>
        <Suspense><PostHogPageView /></Suspense>
        <ErrorBoundary name="root">{children}</ErrorBoundary>

        {/* PWA components — invisible, run in background */}
        <ServiceWorkerRegistration />
        <ProfileRefresh />
        <InstallPrompt />
        <CommandPalette />

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
