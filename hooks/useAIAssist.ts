// TypeScript enabled
'use client'
// ── hooks/useAIAssist.ts ─────────────────────────────────────────────────────
// Universal hook for all AI assist features. Handles loading, errors,
// timeout (10s), and result display. Never crashes the tool if AI fails.

import { useState, useCallback } from 'react'

interface AssistResult {
  result: string | Record<string, any> | null
  source: 'ai' | 'rule' | null
  loading: boolean
  error: string | null
}

export function useAIAssist() {
  const [state, setState] = useState<AssistResult>({
    result: null, source: null, loading: false, error: null,
  })

  const assist = useCallback(async (type: string, data: Record<string, any>) => {
    setState({ result: null, source: null, loading: true, error: null })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) throw new Error('Assist request failed')
      const d = await res.json()
      setState({ result: d.result, source: d.source, loading: false, error: null })
      return d
    } catch (e: any) {
      clearTimeout(timeout)
      const msg = e.name === 'AbortError' ? 'Request timed out. Try again.' : 'AI assist unavailable. Using rule-based analysis.'
      setState({ result: null, source: null, loading: false, error: msg })
      return null
    }
  }, [])

  const clear = useCallback(() => {
    setState({ result: null, source: null, loading: false, error: null })
  }, [])

  return { ...state, assist, clear }
}
