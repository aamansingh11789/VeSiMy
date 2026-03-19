// @ts-nocheck
'use client'
// ── components/analytics/PostHogPageView.tsx ─────────────────────────────────
// Tracks page views on every client-side navigation.
// Next.js App Router doesn't fire traditional pageview events on navigation,
// so this component subscribes to the pathname and fires manually.

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogPageView() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const posthog      = usePostHog()

  useEffect(() => {
    if (!pathname || !posthog) return
    let url = window.origin + pathname
    if (searchParams?.toString()) url += `?${searchParams.toString()}`
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams, posthog])

  return null
}
