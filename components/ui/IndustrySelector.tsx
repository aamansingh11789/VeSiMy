// @ts-nocheck
// ── components/ui/IndustrySelector.tsx ───────────────────────────────────────
// Per-account industry picker. Saves to profiles.industry.
// Used in Settings and optionally in Onboarding.
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { INDUSTRY_OPTIONS, INDUSTRY_SECTORS, getIndustriesBySector } from '@/lib/industry-language'

interface Props {
  profileId:       string
  currentIndustry: string | null
  onSaved?:        (id: string) => void
}

export function IndustrySelector({ profileId, currentIndustry, onSaved }: Props) {
  const [selected, setSelected] = useState(currentIndustry || '')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const supabase = createClient()

  async function save(id: string) {
    setSelected(id)
    setSaving(true)
    await supabase.from('profiles').update({ industry: id }).eq('id', profileId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSaved?.(id)
    // Invalidate the cached industry in the hook
    if (typeof window !== 'undefined') {
      // Force hook to re-read on next render
      window.dispatchEvent(new Event('vesimy-industry-changed'))
    }
  }

  return (
    <div>
      <select
        className="input"
        value={selected}
        onChange={e => save(e.target.value)}
        disabled={saving}
      >
        <option value="">Select your industry…</option>
        {INDUSTRY_SECTORS.map(sector => (
          <optgroup key={sector} label={sector}>
            {getIndustriesBySector(sector).map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {saving && (
        <p style={{ fontSize: 11, color: 'var(--brand)', marginTop: 4 }}>Saving…</p>
      )}
      {saved && !saving && (
        <p style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>
          Language updated. Reload the app to see your industry terminology throughout.
        </p>
      )}
    </div>
  )
}
