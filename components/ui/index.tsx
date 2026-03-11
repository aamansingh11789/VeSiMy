// @ts-nocheck
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '@/lib/store'

interface ModalProps {
  title: string
  onClose: () => void
  onSave?: () => void
  saveLabel?: string
  width?: number
  children: React.ReactNode
  noPad?: boolean
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

export function Modal({
  title,
  onClose,
  onSave,
  saveLabel = 'Save',
  width = 560,
  children,
  noPad,
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging || isMobile) return
      setPos({
        x: dragRef.current.originX + (e.clientX - dragRef.current.startX),
        y: dragRef.current.originY + (e.clientY - dragRef.current.startY),
      })
    }

    const onUp = () => {
      dragRef.current.dragging = false
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isMobile])

  const startDrag = (e) => {
    if (isMobile) return
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    }
    document.body.style.userSelect = 'none'
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.68)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 24,
      }}
    >
      <div
        className="modal"
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : width,
          maxHeight: isMobile ? '92vh' : '88vh',
          background: 'var(--bg2)',
          border: '1px solid var(--border2)',
          borderRadius: isMobile ? '18px 18px 0 0' : 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          transform: isMobile ? 'none' : `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <div
          className="modal-header"
          onMouseDown={startDrag}
          style={{
            padding: isMobile ? '14px 16px' : '16px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isMobile ? 'default' : 'grab',
            flexShrink: 0,
            background: 'var(--bg3)',
          }}
        >
          <div
            style={{
              fontFamily: 'Palatino Linotype,serif',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            {title}
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text2)',
              fontSize: 20,
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            ×
          </button>
        </div>

        <div
          className="modal-body"
          style={{
            padding: noPad ? 0 : isMobile ? 16 : 22,
            overflowY: 'auto',
            flex: 1,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>

        {onSave && (
          <div
            className="modal-footer"
            style={{
              padding: isMobile ? '12px 16px calc(12px + env(safe-area-inset-bottom))' : '12px 22px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              background: 'var(--bg3)',
              flexShrink: 0,
              position: 'sticky',
              bottom: 0,
              zIndex: 2,
            }}
          >
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              {saveLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

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
                    background: 'rgba(212,162,8,0.12)',
                    color: '#D4A208',
                    border: '1px solid rgba(212,162,8,0.25)',
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
    gold: { background: 'rgba(212,162,8,0.12)', color: '#D4A208', border: '1px solid rgba(212,162,8,0.22)' },
    steel: { background: 'rgba(108,185,252,0.10)', color: '#6CB9FC', border: '1px solid rgba(108,185,252,0.22)' },
    violet: { background: 'rgba(100,38,160,0.12)', color: '#8C44CC', border: '1px solid rgba(100,38,160,0.22)' },
    green: { background: 'rgba(29,209,161,0.10)', color: '#1DD1A1', border: '1px solid rgba(29,209,161,0.22)' },
    red: { background: 'rgba(255,107,107,0.10)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.22)' },
    muted: { background: 'rgba(112,112,160,0.10)', color: '#7070A0', border: '1px solid rgba(112,112,160,0.15)' },
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
        border: `2px solid rgba(212,162,8,0.15)`,
        borderTop: `2px solid #D4A208`,
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