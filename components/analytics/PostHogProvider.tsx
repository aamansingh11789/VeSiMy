// @ts-nocheck
'use client'
// ── components/analytics/PostHogProvider.tsx ─────────────────────────────────
// Initialises PostHog after mount. Safe passthrough if posthog-js not installed.

import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return
    // Dynamically import so a missing package never crashes the app
    import('posthog-js').then(({ default: posthog }) => {
      if (posthog.__loaded) return // already initialised
      posthog.init(key, {
        api_host:          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles:   'identified_only',
        capture_pageview:  false,
        capture_pageleave: true,
        session_recording: { maskAllInputs: true },
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.opt_out_capturing()
          // Make available globally for useAnalytics hook
          ;(window as any).posthog = ph
        },
      })
    }).catch(() => {}) // posthog-js not installed — silent no-op
  }, [])

  return <>{children}</>
}
