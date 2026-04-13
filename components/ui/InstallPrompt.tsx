// @ts-nocheck
'use client'
import { XIcon, CheckIcon } from '@/components/ui/Icons'
// ── components/ui/InstallPrompt.tsx ──────────────────────────────────────────
// Shows an install banner when the browser fires the beforeinstallprompt event
// Works on Chrome/Edge (desktop + Android). iOS shows separate instructions.

import { useState, useEffect } from 'react'

export function InstallPrompt() {
  const [prompt,      setPrompt]      = useState<any>(null)
  const [showBanner,  setShowBanner]  = useState(false)
  const [showIOS,     setShowIOS]     = useState(false)
  const [dismissed,   setDismissed]   = useState(false)
  const [installed,   setInstalled]   = useState(false)

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // Don't show if user dismissed within last 7 days
    const dismissedAt = localStorage.getItem('pwa-dismissed')
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000) return

    // Chrome/Edge/Android: capture the install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari: show manual instructions
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isInStandalone = ('standalone' in navigator) && (navigator as any).standalone
    if (isIOS && !isInStandalone) {
      setTimeout(() => setShowIOS(true), 3000) // delay 3s so it doesn't feel jarring
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
      setInstalled(true)
    }
    setPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setShowIOS(false)
    setDismissed(true)
    localStorage.setItem('pwa-dismissed', String(Date.now()))
  }

  if (installed || dismissed) return null

  // ── Chrome / Edge / Android banner ───────────────────────────────────────
  if (showBanner) {
    return (
      <div style={{
        position:   'fixed',
        bottom:     24,
        left:       '50%',
        transform:  'translateX(-50%)',
        zIndex:     9999,
        background: 'var(--bg3)',
        border:     '1px solid rgba(1,118,211,0.35)',
        borderRadius: 14,
        padding:    '14px 20px',
        display:    'flex',
        alignItems: 'center',
        gap:        16,
        boxShadow:  '0 8px 40px rgba(0,0,0,0.6)',
        maxWidth:   420,
        width:      'calc(100vw - 48px)',
        animation:  'slideUp 0.3s ease',
      }}>
        {/* Logo mark */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--border), var(--border2))',
          border: '1px solid rgba(1,118,211,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          ◯
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>
            Install Vesimy
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.4 }}>
            Add to your home screen for quick access — works offline too
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleInstall}
            style={{
              background: 'linear-gradient(135deg, #0a5eaa, #0176D3)',
              color:      'var(--bg)',
              border:     'none',
              borderRadius: 7,
              padding:    '7px 14px',
              fontSize:   13,
              fontWeight: 700,
              cursor:     'pointer',
              whiteSpace: 'nowrap',
            }}>
            Install
          </button>
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              color:      'var(--sl-400)',
              border:     'none',
              fontSize:   12,
              cursor:     'pointer',
              padding:    '4px 0',
            }}>
            Not now
          </button>
        </div>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  // ── iOS Safari instructions ───────────────────────────────────────────────
  if (showIOS) {
    return (
      <div style={{
        position:   'fixed',
        bottom:     0,
        left:       0,
        right:      0,
        zIndex:     9999,
        background: 'var(--bg3)',
        borderTop:  '1px solid rgba(1,118,211,0.3)',
        padding:    '20px 24px 32px',
        animation:  'slideUpFull 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>
              Install Vesimy
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
              Add to your iPhone home screen
            </div>
          </div>
          <button onClick={handleDismiss} style={{
            background: 'none', border: 'none', color: 'var(--text3)',
            fontSize: 20, cursor: 'pointer', padding: '0 4px',
          }}><XIcon size={13}/></button>
        </div>

        {/* Steps */}
        {[
          { icon: '⬆', text: 'Tap the Share button at the bottom of Safari' },
          { icon: '＋', text: 'Scroll down and tap "Add to Home Screen"' },
          { icon: text: 'Tap "Add" — Vesimy appears on your home screen' },
        ].map((step, i) => (
          <div key={i} style={{
            display:    'flex',
            alignItems: 'flex-start',
            gap:        12,
            marginBottom: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'rgba(1,118,211,0.12)',
              border:     '1px solid rgba(1,118,211,0.25)',
              display:    'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#0176D3', fontWeight: 700,
            }}>{step.icon}</div>
            <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5, paddingTop: 4 }}>
              {step.text}
            </div>
          </div>
        ))}

        <style>{`
          @keyframes slideUpFull {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return null
}
