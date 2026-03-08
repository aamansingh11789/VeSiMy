// @ts-nocheck
'use client'
// ── components/ui/index.tsx ──────────────────────────────────────────────────
// Shared UI primitives: Modal, ToastContainer, Badge, Spinner

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  title:     string
  onClose:   () => void
  onSave?:   () => void
  saveLabel?: string
  width?:    number
  children:  React.ReactNode
  noPad?:    boolean
}

export function Modal({ title, onClose, onSave, saveLabel = 'Save', width = 560, children, noPad }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div onClick={handleBackdrop} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div ref={ref} style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
        width: '100%', maxWidth: width, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        animation: 'modalIn 0.20s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg3)', borderRadius: '14px 14px 0 0',
          flexShrink: 0,
        }}>
          <h2 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: '2px 6px',
            borderRadius: 6, transition: 'color 0.15s',
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: noPad ? 0 : '20px 22px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {onSave && (
          <div style={{
            padding: '12px 22px', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            background: 'var(--bg3)', borderRadius: '0 0 14px 14px', flexShrink: 0,
          }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={onSave}>{saveLabel}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Toast Container ────────────────────────────────────────────────────────────
export function ToastContainer() {
  const { toasts, dismissToast } = useStore()
  if (!toasts.length) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => dismissToast(t.id)} style={{
          padding: '10px 16px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: 8, maxWidth: 360,
          animation: 'toastIn 0.22s ease',
          ...(t.type === 'success' ? {
            background: 'rgba(29,209,161,0.12)', color: '#1DD1A1', border: '1px solid rgba(29,209,161,0.25)',
          } : t.type === 'error' ? {
            background: 'rgba(255,107,107,0.12)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.25)',
          } : {
            background: 'rgba(212,162,8,0.12)', color: '#D4A208', border: '1px solid rgba(212,162,8,0.25)',
          }),
        }}>
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '◈'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
type BadgeVariant = 'gold' | 'steel' | 'violet' | 'green' | 'red' | 'muted'
export function Badge({ children, variant = 'muted' }: { children: React.ReactNode, variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    gold:   { background: 'rgba(212,162,8,0.12)',   color: '#D4A208', border: '1px solid rgba(212,162,8,0.22)'   },
    steel:  { background: 'rgba(108,185,252,0.10)', color: '#6CB9FC', border: '1px solid rgba(108,185,252,0.22)' },
    violet: { background: 'rgba(100,38,160,0.12)',  color: '#8C44CC', border: '1px solid rgba(100,38,160,0.22)'  },
    green:  { background: 'rgba(29,209,161,0.10)',  color: '#1DD1A1', border: '1px solid rgba(29,209,161,0.22)'  },
    red:    { background: 'rgba(255,107,107,0.10)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.22)' },
    muted:  { background: 'rgba(112,112,160,0.10)', color: '#7070A0', border: '1px solid rgba(112,112,160,0.15)' },
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 100,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      ...styles[variant],
    }}>
      {children}
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(212,162,8,0.15)`,
      borderTop: `2px solid #D4A208`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

// ── FormRow ───────────────────────────────────────────────────────────────────
export function FormRow({ label, children, hint }: { label: string, children: React.ReactNode, hint?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

// ── Global keyframes injected once ───────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('oc-keyframes')) {
  const style = document.createElement('style')
  style.id = 'oc-keyframes'
  style.textContent = `
    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin    { to{transform:rotate(360deg)} }
  `
  document.head.appendChild(style)
}
