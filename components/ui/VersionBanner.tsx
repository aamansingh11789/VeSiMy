// TypeScript enabled
'use client'
// ── components/ui/VersionBanner.tsx ──────────────────────────────────────────
// Non-intrusive banner for existing users when v4.0 is ready.
// Spec: Section 1.2 — Version toggle


import { useState, useEffect } from 'react'

const STORAGE_KEY = 'vesimy_v4_banner_dismissed'

export function VersionBanner() {
  const [show,    setShow]    = useState(false)
  const [detail,  setDetail]  = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (!dismissed) setShow(true)
  }, [])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'linear-gradient(135deg, #032D60, #0a3d78)',
      borderBottom: '1px solid rgba(108,185,252,0.25)',
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
        <span style={{ fontSize: 16 }}>✨</span>
        <span style={{ fontSize: 13, color: '#D8EDFF', fontWeight: 600 }}>
          VeSiMy v4.0 is ready.
        </span>
        <button onClick={() => setDetail(d => !d)} style={{
          background: 'none', border: 'none', color: '#6CB9FC', fontSize: 13,
          cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: 'inherit',
        }}>
          See what's new
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <a href="?v=4" style={{
          padding: '6px 14px', borderRadius: 7, background: '#0176D3',
          color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700,
        }}>
          Switch to new version
        </a>
        <button onClick={dismiss} style={{
          background: 'none', border: 'none', color: 'rgba(216,237,255,0.5)',
          fontSize: 12, cursor: 'pointer', padding: '6px 10px', fontFamily: 'inherit',
        }}>
          Stay on current version
        </button>
        <button onClick={dismiss} style={{
          background: 'none', border: 'none', color: 'rgba(216,237,255,0.4)',
          fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px',
        }}>×</button>
      </div>

      {detail && (
        <div style={{
          width: '100%', marginTop: 10, padding: '12px 16px',
          background: 'rgba(0,0,0,0.25)', borderRadius: 8,
          fontSize: 13, color: '#D8EDFF', lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>What changed in v4.0</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 6 }}>
            {[
              '🗺  New canvas — sticky note design, inline editing',
              '🧭  VeSiMy Guided — 8-step onboarding for new users',
              '⚡  OODA loop, 8D report, DMAIC tools added',
              '🤖  Improved AI report with full 8 sections',
              '📊  Skill matrix — track your improvement maturity',
              '📸  New design system with depth and dimension',
              '🆓  Free no-account tier at vesimy.com/start',
              '📈  Version history and snapshot comparison',
            ].map(item => <div key={item} style={{ fontSize: 12 }}>{item}</div>)}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(216,237,255,0.6)' }}>
            Your projects, steps, and all tool data are completely preserved. The switch is reversible for 90 days.
          </div>
        </div>
      )}
    </div>
  )
}

export default VersionBanner
