'use client'
// ── components/ui/VersionBanner.tsx ──────────────────────────────────────────
// v4.0 announcement banner. Spec §1.2, Version toggle.
// Fixed: was inside flex-row so sticky didn't work; button linked to ?v=4 which nothing read.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DISMISSED_KEY = 'vesimy_v4_banner_dismissed'
const VERSION_KEY   = 'vesimy_version_pref'

export function VersionBanner() {
  const [show,   setShow]   = useState(false)
  const [detail, setDetail] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (!dismissed) setShow(true)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
  }

  function switchToV4() {
    localStorage.setItem(VERSION_KEY, 'v4')
    localStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
    // Reload so any version-gated components re-read the pref
    router.refresh()
  }

  function stayOnCurrent() {
    localStorage.setItem(VERSION_KEY, 'v3')
    dismiss()
  }

  if (!show) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg,#2A1800,#0a3d78)',
      borderBottom: '1px solid rgba(108,185,252,0.25)',
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      width: '100%', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
        <span style={{ fontSize: 16 }}>✨</span>
        <span style={{ fontSize: 13, color: '#F0F4F9', fontWeight: 600 }}>
          VeSiMy v4.0 is ready.
        </span>
        <button
          onClick={() => setDetail(d => !d)}
          style={{ background: 'none', border: 'none', color: '#6CB9FC', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: 'inherit' }}
        >
          {detail ? 'Hide details' : "See what's new"}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={switchToV4}
          style={{ padding: '6px 14px', borderRadius: 7, background: '#C9A66B', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Switch to v4.0
        </button>
        <button
          onClick={stayOnCurrent}
          style={{ background: 'none', border: 'none', color: 'rgba(216,237,255,0.6)', fontSize: 12, cursor: 'pointer', padding: '6px 10px', fontFamily: 'inherit' }}
        >
          Stay on current version
        </button>
        <button
          onClick={dismiss}
          style={{ background: 'none', border: 'none', color: 'rgba(216,237,255,0.4)', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
        >
          ×
        </button>
      </div>

      {detail && (
        <div style={{ width: '100%', marginTop: 10, padding: '12px 16px', background: 'rgba(0,0,0,0.25)', borderRadius: 8, fontSize: 13, color: '#F0F4F9', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>What changed in v4.0</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 6 }}>
            {[
              'New canvas: physical sticky notes, inline editing',
              'VeSiMy Guided: 8-step onboarding for new users',
              'OODA loop, 8D report, DMAIC tools added',
              'Improved AI report with all 8 sections',
              'Skill matrix: track improvement maturity',
              'New homepage design system',
              'Free no-account tier at vesimy.com/start',
              'Version history and snapshot comparison',
            ].map(item => <div key={item} style={{ fontSize: 12 }}>· {item}</div>)}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(216,237,255,0.6)' }}>
            Your projects, steps, and all tool data are fully preserved.
          </div>
        </div>
      )}
    </div>
  )
}

export default VersionBanner
