// ── hooks/useProfile.ts ────────────────────────────────────────────────────
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/store'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => { setProfile(data); setLoading(false) })
    })
  }, [])

  return { profile, loading }
}
