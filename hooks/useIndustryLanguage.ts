// TypeScript enabled
'use client'
// ── hooks/useIndustryLanguage.ts ──────────────────────────────────────────────
// Reads the current user's industry from their profile and returns translated terms.
// Usage: const { t } = useIndustryLanguage()
//        then use t.product, t.cycleTime, t.kaizen etc. everywhere in the UI.

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { getIndustryTerms, type IndustryTerms, MFG_DEFAULT } from '@/lib/industry-language'

// Re-export so consumers don't need two imports
export type { IndustryTerms }

let _cachedIndustry: string | null = null
let _cacheReady = false

export function useIndustryLanguage() {
  const [industry, setIndustry] = useState<string | null>(_cachedIndustry)
  const [ready, setReady]       = useState(_cacheReady)

  useEffect(() => {
    function load() {
      const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setReady(true); _cacheReady = true; return }
      supabase
        .from('profiles')
        .select('industry')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          const ind = data?.industry || null
          _cachedIndustry = ind
          _cacheReady = true
          setIndustry(ind)
          setReady(true)
        })
    })
    }
    if (!_cacheReady) load()
    const handler = () => { _cacheReady = false; _cachedIndustry = null; load() }
    window.addEventListener('vesimy-industry-changed', handler)
    return () => window.removeEventListener('vesimy-industry-changed', handler)
  }, [])

  const t = getIndustryTerms(industry)

  return { t, industry, ready }
}

// Synchronous version for server-side or when you already have the industry key
export function getTerms(industryKey?: string | null): IndustryTerms {
  return getIndustryTerms(industryKey)
}
