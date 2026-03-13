// @ts-nocheck
// ── app/layout.tsx ─────────────────────────────────────────────────────────
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import { InstallPrompt } from '@/components/ui/InstallPrompt'
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
    description: 'The AI platform that monitors your manufacturing processes and tells you what to fix. Free forever.',
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
  themeColor:    '#03030D',
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
        {/* MS Tile for Windows pinned sites */}
        <meta name="msapplication-TileColor" content="#03030D" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body>
        <ThemeProvider>
        {children}

        {/* PWA components — invisible, run in background */}
        <ServiceWorkerRegistration />
        <InstallPrompt />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background:   '#0D0D22',
              color:        '#EAE8F4',
              border:       '1px solid rgba(212,162,8,0.25)',
              borderRadius: '10px',
              fontFamily:   'Inter, sans-serif',
              fontSize:     '14px',
            },
            success: { iconTheme: { primary: '#D4A208', secondary: '#03030D' } },
            error:   { iconTheme: { primary: '#FF6B6B', secondary: '#03030D' } },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  )
}
