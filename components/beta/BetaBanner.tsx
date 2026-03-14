// @ts-nocheck
'use client'
// ── components/beta/BetaBanner.tsx ───────────────────────────────────────────
// Shows different states:
//   A. Non-beta user — invite to join during launch week
//   B. Active beta   — countdown + lifetime upgrade CTA
//   C. Beta expired  — upgrade to lifetime or go free

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import Link                    from 'next/link'

interface Props {
  userId:         string
  isBeta?:        boolean
  isLifetime?:    boolean
  betaExpiresAt?: string | null
  onClaimed?:     () => void
}

function daysLeft(expiresAt: string | null | undefined): number {
  if (!expiresAt) return 0
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function BetaBanner({ userId, isBeta, isLifetime, betaExpiresAt, onClaimed }: Props) {
  const router = useRouter()
  const [windowOpen, setWindowOpen] = useState<boolean | null>(null)
  const [dismissed,  setDismissed]  = useState(false)
  const days = daysLeft(betaExpiresAt)

  useEffect(() => {
    if (isBeta || isLifetime) return
    fetch('/api/beta/window')
      .then(r => r.json())
      .then(d => setWindowOpen(d.is_open ?? false))
      .catch(() => setWindowOpen(false))
  }, [isBeta, isLifetime])

  // ── C. Beta expired, no lifetime ────────────────────────────────────────────
  if (isBeta && !isLifetime && betaExpiresAt && days === 0) {
    return (
      <div style={{ position:'relative', padding:'16px 20px', marginBottom:24,
        background:'rgba(255,107,107,0.06)', border:'1px solid rgba(255,107,107,0.25)', borderRadius:12,
        display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
        <div style={{ fontSize:28 }}>⏰</div>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#FF6B6B', marginBottom:3 }}>
            Your Gold Standard beta trial has ended
          </div>
          <p style={{ fontSize:12, color:'var(--text3)', margin:0 }}>
            Upgrade to <strong style={{ color:'#D4A208' }}>Lifetime access</strong> for a one-time $99 —
            99 projects, no monthly fees. Your Gold Standard badge stays permanently.
          </p>
        </div>
        <button onClick={() => router.push('/pricing#lifetime')} style={{ padding:'9px 18px', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer',
          background:'linear-gradient(135deg,#C49510,#D4A208)', color:'var(--bg)', border:'none', whiteSpace:'nowrap' }}>
          Upgrade — $99 Lifetime
        </button>
      </div>
    )
  }

  // ── B. Active beta tester ────────────────────────────────────────────────────
  if (isBeta && !isLifetime) {
    const urgency       = days <= 5  ? 'rgba(255,107,107,0.08)' : days <= 10 ? 'rgba(244,166,35,0.06)' : 'rgba(212,162,8,0.05)'
    const urgencyBorder = days <= 5  ? 'rgba(255,107,107,0.3)'  : days <= 10 ? 'rgba(244,166,35,0.25)' : 'rgba(212,162,8,0.22)'
    const urgencyColor  = days <= 5  ? '#FF6B6B'                : days <= 10 ? '#F4A623'               : '#D4A208'
    return (
      <div style={{ padding:'14px 18px', marginBottom:24,
        background:urgency, border:`1px solid ${urgencyBorder}`, borderRadius:12,
        display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
        <GoldCrown size={36} />
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>Gold Standard Beta</span>
            <span style={{ fontSize:10, fontWeight:700, background:'linear-gradient(135deg,#C49510,#D4A208)', color:'var(--bg)', padding:'2px 8px', borderRadius:100 }}>
              GOLD STANDARD
            </span>
          </div>
          <p style={{ fontSize:12, color:'var(--text3)', margin:0 }}>
            <strong style={{ color:urgencyColor }}>{days} day{days!==1?'s':''} remaining</strong> in your trial.
            {' '}Upgrade to Lifetime for $99 — keeps your badge + 99 projects forever.
          </p>
        </div>
        <button onClick={() => router.push('/pricing#lifetime')} style={{ padding:'8px 16px', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer', whiteSpace:'nowrap',
          background:'linear-gradient(135deg,#C49510,#D4A208)', color:'var(--bg)', border:'none' }}>
          Upgrade — $99 Lifetime ⚡
        </button>
      </div>
    )
  }

  // ── Lifetime confirmed — silent ───────────────────────────────────────────────
  if (isLifetime) return null

  // ── A. Non-beta — show launch week CTA if window is open ────────────────────
  if (dismissed || windowOpen === null) return null
  if (!windowOpen) return null

  return (
    <div style={{ position:'relative', padding:'14px 18px', marginBottom:24,
      background:'rgba(212,162,8,0.05)', border:'1px solid rgba(212,162,8,0.22)', borderRadius:12,
      display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
      <button onClick={() => setDismissed(true)} style={{ position:'absolute', top:8, right:10,
        background:'none', border:'none', cursor:'pointer', color:'var(--border2)', fontSize:14 }}>✕</button>
      <GoldCrown size={36} />
      <div style={{ flex:1, minWidth:200 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:2 }}>
          👑 Gold Standard Beta — Launch Week Open
        </div>
        <p style={{ fontSize:12, color:'var(--text3)', margin:0 }}>
          Join during launch week and get your permanent Gold Standard badge. 30-day Pro trial,
          then $99 Lifetime. Your company gets a <strong style={{ color:'#D4A208' }}>33% enterprise discount</strong> forever.
        </p>
      </div>
      <Link href="/beta" style={{ textDecoration:'none', padding:'8px 16px', borderRadius:8, fontWeight:700, fontSize:12,
        background:'linear-gradient(135deg,#C49510,#D4A208)', color:'var(--bg)', whiteSpace:'nowrap' }}>
        Join Launch Week →
      </Link>
    </div>
  )
}

// ── Gold Crown SVG ────────────────────────────────────────────────────────────
export function GoldCrown({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ flexShrink:0 }}>
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5D060" />
          <stop offset="50%"  stopColor="#D4A208" />
          <stop offset="100%" stopColor="#9A7200" />
        </linearGradient>
      </defs>
      <path d="M4 26 L8 12 L14 20 L18 8 L22 20 L28 12 L32 26 Z"
        fill="url(#goldGrad)" stroke="#C49510" strokeWidth="0.5" strokeLinejoin="round" />
      <rect x="4" y="26" width="28" height="4" rx="2" fill="url(#goldGrad)" stroke="#C49510" strokeWidth="0.5" />
      <circle cx="18" cy="8"  r="2.5" fill="#F5D060" />
      <circle cx="8"  cy="12" r="2"   fill="#F5D060" />
      <circle cx="28" cy="12" r="2"   fill="#F5D060" />
    </svg>
  )
}
