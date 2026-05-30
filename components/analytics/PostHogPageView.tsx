// TypeScript enabled
'use client'
// ── components/analytics/PostHogPageView.tsx ─────────────────────────────────
// Fires $pageview on every navigation. Uses window.posthog, no hook imports.

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function PostHogPageView() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || typeof window === 'undefined') return
    const ph = (window as any).posthog
    if (!ph) return
    try {
      let url = window.origin + pathname
      if (searchParams?.toString()) url += `?${searchParams.toString()}`
      ph.capture('$pageview', { $current_url: url })
    } catch {}
  }, [pathname, searchParams])

  return null
}
