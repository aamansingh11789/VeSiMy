// @ts-nocheck
'use client'
// ── components/analytics/PostHogPageView.tsx ─────────────────────────────────
// Safe page view tracker — no-ops if PostHog is not loaded.

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function PostHogPageView() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    try {
      const ph = (window as any)?.posthog
      if (!ph) return
      let url = window.origin + pathname
      if (searchParams?.toString()) url += `?${searchParams.toString()}`
      ph.capture('$pageview', { $current_url: url })
    } catch {}
  }, [pathname, searchParams])

  return null
}
