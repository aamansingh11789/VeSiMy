// @ts-nocheck
'use client'
// ── components/analytics/PostHogProvider.tsx ─────────────────────────────────
// Safe PostHog provider — gracefully no-ops if posthog-js is not installed.

import { useEffect } from 'react'

// Try to load posthog dynamically — won't crash if not installed
let posthog: any = null
let PHProvider: any = ({ children }: any) => children  // default: passthrough

try {
  posthog = require('posthog-js').default
  PHProvider = require('posthog-js/react').PostHogProvider
} catch {}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key || !posthog) return

    try {
      posthog.init(key, {
        api_host:         process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles:  'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        session_recording: {
          maskAllInputs:    true,
          maskInputOptions: { password: true },
        },
        loaded: (ph: any) => {
          if (process.env.NODE_ENV === 'development') ph.opt_out_capturing()
        },
      })
    } catch {}
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
