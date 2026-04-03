// @ts-nocheck
'use client'

// The real Modal lives in Modal.tsx — re-export it so both import paths work
export { Modal } from '@/components/ui/Modal'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'

export function ToastContainer() {
  const { toasts, dismissToast } = useStore()
  if (!toasts.length) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismissToast(t.id)}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: 360,
            ...(t.type === 'success'
              ? {
                  background: 'rgba(29,209,161,0.12)',
                  color: '#1DD1A1',
                  border: '1px solid rgba(29,209,161,0.25)',
                }
              : t.type === 'error'
                ? {
                    background: 'rgba(255,107,107,0.12)',
                    color: '#FF6B6B',
                    border: '1px solid rgba(255,107,107,0.25)',
                  }
                : {
                    background: 'rgba(1,118,211,0.12)',
                    color: '#0176D3',
                    border: '1px solid rgba(1,118,211,0.25)',
                  }),
          }}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '◈'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}

type BadgeVariant = 'gold' | 'steel' | 'violet' | 'green' | 'red' | 'muted'

export function Badge({
  children,
  variant = 'muted',
}: {
  children: React.ReactNode
  variant?: BadgeVariant
}) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    gold: { background: 'rgba(1,118,211,0.12)', color: '#0176D3', border: '1px solid rgba(1,118,211,0.22)' },
    steel: { background: 'rgba(108,185,252,0.10)', color: '#6CB9FC', border: '1px solid rgba(108,185,252,0.22)' },
    violet: { background: 'rgba(100,38,160,0.12)', color: '#8C44CC', border: '1px solid rgba(100,38,160,0.22)' },
    green: { background: 'rgba(29,209,161,0.10)', color: '#1DD1A1', border: '1px solid rgba(29,209,161,0.22)' },
    red: { background: 'rgba(255,107,107,0.10)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.22)' },
    muted: { background: 'rgba(112,112,160,0.10)', color: 'var(--text3)', border: '1px solid rgba(112,112,160,0.15)' },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        ...styles[variant],
      }}
    >
      {children}
    </span>
  )
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid rgba(1,118,211,0.15)`,
        borderTop: `2px solid #0176D3`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}

export function FormRow({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: 'var(--text2)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

if (typeof document !== 'undefined' && !document.getElementById('oc-keyframes')) {
  const style = document.createElement('style')
  style.id = 'oc-keyframes'
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
  `
  document.head.appendChild(style)
}