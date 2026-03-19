// @ts-nocheck
'use client'
// ── hooks/useAnalytics.ts ─────────────────────────────────────────────────────
// Thin wrapper around PostHog for tracking key VeSiMy product events.
// Import and call from any component. No-ops if PostHog is not loaded.
//
// Usage:
//   const { track, identify } = useAnalytics()
//   identify(user.id, { email: user.email, plan: profile.plan_tier })
//   track('tool_opened', { tool: 'stopwatch', projectId })

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

// ── Key events tracked in VeSiMy ─────────────────────────────────────────────
export type VeSiMyEvent =
  // Acquisition
  | 'page_viewed'
  | 'cta_clicked'
  | 'demo_viewed'
  // Activation
  | 'signup_started'
  | 'signup_completed'
  | 'first_project_created'
  | 'onboarding_completed'
  // Engagement
  | 'project_created'
  | 'project_opened'
  | 'tool_opened'
  | 'tool_saved'
  | 'ai_assist_used'
  | 'supe_opened'
  | 'iso_report_exported'
  | 'vsm_viewed'
  | 'report_viewed'
  | 'journal_note_added'
  // Conversion
  | 'upgrade_clicked'
  | 'pricing_viewed'
  | 'checkout_started'
  | 'subscription_created'

export function useAnalytics() {
  const posthog = usePostHog()

  const track = useCallback((event: VeSiMyEvent, properties?: Record<string, any>) => {
    if (!posthog) return
    posthog.capture(event, properties)
  }, [posthog])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    if (!posthog) return
    posthog.identify(userId, traits)
  }, [posthog])

  const reset = useCallback(() => {
    if (!posthog) return
    posthog.reset()
  }, [posthog])

  return { track, identify, reset }
}
