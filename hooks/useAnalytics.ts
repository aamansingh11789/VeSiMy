// TypeScript enabled
'use client'
// ── hooks/useAnalytics.ts ─────────────────────────────────────────────────────
// Safe analytics hook, uses window.posthog when available, no-ops otherwise.
// Does NOT import posthog-js directly to avoid crashes if it's not installed.

import { useCallback } from 'react'

export type VeSiMyEvent =
  | 'page_viewed' | 'cta_clicked' | 'signup_started' | 'signup_completed'
  | 'first_project_created' | 'onboarding_completed' | 'project_created'
  | 'project_opened' | 'tool_opened' | 'tool_saved' | 'ai_assist_used'
  | 'supe_opened' | 'iso_report_exported' | 'vsm_viewed' | 'report_viewed'
  | 'journal_note_added' | 'upgrade_clicked' | 'pricing_viewed'
  | 'checkout_started' | 'subscription_created' | 'demo_viewed'

function safePostHog() {
  if (typeof window === 'undefined') return null
  return (window as any).posthog || null
}

export function useAnalytics() {
  const track = useCallback((event: VeSiMyEvent, properties?: Record<string, any>) => {
    try { safePostHog()?.capture(event, properties) } catch {}
  }, [])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    try { safePostHog()?.identify(userId, traits) } catch {}
  }, [])

  const reset = useCallback(() => {
    try { safePostHog()?.reset() } catch {}
  }, [])

  return { track, identify, reset }
}
