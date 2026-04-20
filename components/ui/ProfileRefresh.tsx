// TypeScript enabled
'use client'
// ── components/ui/ProfileRefresh.tsx ──────────────────────────────────────
// Listens for changes to the current user's profile row in Supabase.
// When the Stripe webhook fires and updates plan_tier/subscription_status,
// this triggers router.refresh() so isPaid and plan limits update in-place
// without requiring the user to manually reload the page.

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function ProfileRefresh() {
  const router = useRouter()

  // FIX: do NOT put router in the dependency array.
  // router is a new object reference on every render in Next.js 14 App Router,
  // which caused the effect to re-run continuously:
  //   re-render → new router ref → useEffect re-runs → router.refresh() → re-render → loop
  // The router.refresh() call inside the callback is stable — use a ref instead.
  const routerRef = useRef(router)
  useEffect(() => { routerRef.current = router }, [router])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      const channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const changed = payload.new
            const planFields = ['plan_tier', 'subscription_status', 'lifetime_access',
                               'projects_limit', 'is_beta']
            const planChanged = planFields.some(f => payload.old[f] !== changed[f])
            if (planChanged) {
              routerRef.current.refresh()
            }
          }
        )
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    })
  }, [])  // FIX: empty deps — subscribe once, use routerRef.current for refresh calls

  return null
}
