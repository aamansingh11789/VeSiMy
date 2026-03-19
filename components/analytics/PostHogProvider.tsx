// @ts-nocheck
'use client'
// ── components/analytics/PostHogProvider.tsx ─────────────────────────────────
// Initialises PostHog on the client. Wraps the app in PHProvider.
// PostHog key lives in NEXT_PUBLIC_POSTHOG_KEY env var.
// If the key is absent (local dev), PostHog is a no-op.

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return  // silent no-op in local dev

    posthog.init(key, {
      api_host:              process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles:       'identified_only',  // GDPR friendly — only store profiles for identified users
      capture_pageview:      false,              // we capture manually for SPA accuracy
      capture_pageleave:     true,
      session_recording: {
        maskAllInputs:       true,               // never record passwords / form data
        maskInputOptions:    { password: true },
      },
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.opt_out_capturing()
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
