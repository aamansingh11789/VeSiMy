// @ts-nocheck
'use client'
// ── hooks/useAnalytics.ts ─────────────────────────────────────────────────────
// Safe analytics hook — no-ops gracefully if PostHog is not available.

import { useCallback } from 'react'

// Try to use posthog-js/react hook — fall back to window.posthog
let usePostHog: any = () => null
try { usePostHog = require('posthog-js/react').usePostHog } catch {}

export type VeSiMyEvent =
  | 'page_viewed' | 'cta_clicked' | 'signup_started' | 'signup_completed'
  | 'first_project_created' | 'onboarding_completed' | 'project_created'
  | 'project_opened' | 'tool_opened' | 'tool_saved' | 'ai_assist_used'
  | 'supe_opened' | 'iso_report_exported' | 'vsm_viewed' | 'report_viewed'
  | 'journal_note_added' | 'upgrade_clicked' | 'pricing_viewed'
  | 'checkout_started' | 'subscription_created' | 'demo_viewed'

function getPostHog() {
  try { return usePostHog() } catch { return null }
}

export function useAnalytics() {
  let ph: any = null
  try { ph = usePostHog() } catch {}

  const track = useCallback((event: VeSiMyEvent, properties?: Record<string, any>) => {
    try {
      const client = ph || (typeof window !== 'undefined' && (window as any).posthog)
      if (client) client.capture(event, properties)
    } catch {}
  }, [ph])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    try {
      const client = ph || (typeof window !== 'undefined' && (window as any).posthog)
      if (client) client.identify(userId, traits)
    } catch {}
  }, [ph])

  const reset = useCallback(() => {
    try {
      const client = ph || (typeof window !== 'undefined' && (window as any).posthog)
      if (client) client.reset()
    } catch {}
  }, [ph])

  return { track, identify, reset }
}
