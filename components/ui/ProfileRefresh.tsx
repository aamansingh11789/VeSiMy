// @ts-nocheck
'use client'
// ── components/ui/ProfileRefresh.tsx ──────────────────────────────────────
// Listens for changes to the current user's profile row in Supabase.
// When the Stripe webhook fires and updates plan_tier/subscription_status,
// this triggers router.refresh() so isPaid and plan limits update in-place
// without requiring the user to manually reload the page.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function ProfileRefresh() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Get current user ID
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      // Subscribe to changes on this user's profile row only
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
            // Plan-relevant fields changed — refresh server components
            const changed = payload.new
            const planFields = ['plan_tier', 'subscription_status', 'lifetime_access', 
                               'projects_limit', 'is_beta']
            const planChanged = planFields.some(
              f => payload.old[f] !== changed[f]
            )
            if (planChanged) {
              router.refresh()
            }
          }
        )
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    })
  }, [router])

  return null
}
