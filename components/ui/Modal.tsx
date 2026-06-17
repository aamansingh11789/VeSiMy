// TypeScript enabled
'use client'
import { XIcon } from '@/components/ui/Icons'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  title: string
  children?: React.ReactNode
  onClose: () => void
  onSave?: () => void
  saveLabel?: string
  disableSave?: boolean
}

export function Modal({
  title,
  children,
  onClose,
  onSave,
  saveLabel = 'Save',
  disableSave = false,
}: ModalProps) {
  const onCloseRef = useRef(onClose)
  const bodyRef    = useRef<HTMLDivElement>(null)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    // ── Keyboard ──────────────────────────────────────────────────────────
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKey)

    // ── iOS scroll lock ───────────────────────────────────────────────────
    // overflow:hidden on body does NOTHING on iOS Safari.
    // position:fixed is the only thing that works.
    const scrollY = window.scrollY
    document.body.style.position   = 'fixed'
    document.body.style.top        = `-${scrollY}px`
    document.body.style.left       = '0'
    document.body.style.right      = '0'
    document.body.style.overflow   = 'hidden'
    document.body.classList.add('modal-open')

    // ── Block touchmove on overlay, allow it only in the scrollable body ──
    // Non-passive so preventDefault() actually works.
    const blockBgScroll = (e: TouchEvent) => {
      if (bodyRef.current && bodyRef.current.contains(e.target as Node)) {
        // Inside the scroll body, let iOS scroll it naturally, don't prevent
        return
      }
      // Outside modal body, block background scroll
      e.preventDefault()
    }
    document.addEventListener('touchmove', blockBgScroll, { passive: false })

    // ── Hide bottom nav + sidebar ─────────────────────────────────────────
    const nav     = document.querySelector('.bottom-nav') as HTMLElement | null
    const sidebar = document.querySelector('aside')       as HTMLElement | null
    if (nav)     nav.style.setProperty('display', 'none', 'important')
    if (sidebar) sidebar.style.setProperty('display', 'none', 'important')

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('touchmove', blockBgScroll)
      document.body.classList.remove('modal-open')
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.left     = ''
      document.body.style.right    = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
      if (nav)     nav.style.removeProperty('display')
      if (sidebar) sidebar.style.removeProperty('display')
    }
  }, [])

  // ── SSR-safe mobile detection ────────────────────────────────────────────
  // Start with false (matches server). Flip to true on mount if mobile.
  // This avoids hydration mismatch while still giving mobile layout on first paint.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const content = (
    <div
      onClick={() => onCloseRef.current()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: 'rgba(1,1,6,0.76)',
        backdropFilter: 'blur(10px)',
        // NEVER scrollable, iOS would scroll this instead of the modal body
        overflow: 'hidden',
        // Prevent any touch scroll on the overlay itself
        touchAction: 'none',
        // Bottom-sheet layout on mobile, centred on desktop
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : '24px 16px',
      }}
    >
      {/* ── Modal shell ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          // On mobile: position:fixed so iOS never treats it as a flex child
          // that needs flex layout before it can scroll
          position: isMobile ? 'fixed' : 'relative',
          bottom: isMobile ? 0 : undefined,
          left:   isMobile ? 0 : undefined,
          right:  isMobile ? 0 : undefined,
          // Explicit height, not max-height, so iOS knows the exact boundary
          height:    isMobile ? '92svh' : undefined,
          maxHeight: isMobile ? '92svh' : 'calc(100dvh - 60px)',
          width: '100%',
          maxWidth: isMobile ? '100%' : 640,
          background: 'var(--vs-white)',
          border: '1px solid var(--vs-slate-200)',
          borderRadius: isMobile ? '20px 20px 0 0' : 20,
          boxShadow: 'var(--vs-shadow-panel)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* drag handle */}
        {isMobile && (
          <div style={{ width: 42, height: 5, background: 'var(--vs-slate-200)', borderRadius: 999, margin: '10px auto 0', flexShrink: 0 }} />
        )}

        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: isMobile ? '12px 16px 10px' : '18px 22px 14px',
          borderBottom: '1px solid var(--vs-slate-200)',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: "'Sora','Inter',sans-serif", fontSize: isMobile ? 15 : 17, fontWeight: 650, color: 'var(--vs-navy-900)', letterSpacing: '-0.01em' }}>
            {title}
          </div>
          {/* VeSiMy brand watermark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', marginRight: 12, flexShrink: 0, opacity: 0.6 }}>
            <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="vm-mh-l" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2F4670"/><stop offset="100%" stopColor="#1E2E4A"/>
                </linearGradient>
                <linearGradient id="vm-mh-r" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E2E4A"/><stop offset="100%" stopColor="#0B1D33"/>
                </linearGradient>
                <radialGradient id="vm-mh-c" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#E5D4B0"/><stop offset="55%" stopColor="#C9A66B"/><stop offset="100%" stopColor="#A8854F"/>
                </radialGradient>
              </defs>
              <path d="M 20 28 Q 20 24 24 24 L 38 24 Q 42 24 44 28 L 50 40 L 50 86 Q 50 92 44 91 L 28 89 Q 22 88 21 82 L 20 28 Z" fill="url(#vm-mh-l)"/>
              <path d="M 56 28 Q 58 24 62 24 L 76 24 Q 80 24 80 28 L 79 82 Q 78 88 72 89 L 56 91 Q 50 92 50 86 L 50 40 L 56 28 Z" fill="url(#vm-mh-r)"/>
              <circle cx="50" cy="20" r="12" fill="url(#vm-mh-c)"/>
            </svg>
            <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 12, color: 'var(--vs-slate-700)', letterSpacing: '-0.01em' }}>VeSiMy</span>
          </div>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 18, cursor: 'pointer', padding: '4px 6px', flexShrink: 0 }}
            onClick={() => onCloseRef.current()}
            type="button"
          ><XIcon size={14}/></button>
        </div>

        {/* ── scrollable body ── */}
        {/* 
          svh = Small Viewport Height (excludes Safari toolbar), more reliable than dvh for position calculations.
          Heights:  handle 25px + header ~52px + footer ~68px = 145px
          Body = 92svh - 145px
          overflow-y:scroll (not auto), iOS Safari sometimes ignores auto on non-body elements
        */}
        <div
          ref={bodyRef}
          style={{
            // Explicit calculated height, no flex:1, no min-height tricks
            // iOS Safari only reliably scrolls elements with an explicit height
            flex: 1,
            minHeight: 0,
            height: isMobile ? 'calc(92svh - 145px)' : undefined,
            overflowY: 'scroll',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: isMobile ? '16px 16px 40px' : '22px 22px 20px',
          }}
        >
          {children}
        </div>

        {/* footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
          justifyContent: isMobile ? undefined : 'flex-end',
          gap: 10,
          padding: isMobile ? `12px 16px max(16px, env(safe-area-inset-bottom, 0px))` : '15px 22px 18px',
          borderTop: '1px solid var(--vs-slate-200)',
          background: 'var(--vs-paper)',
          flexShrink: 0,
        }}>
          <button className="btn btn-ghost" onClick={() => onCloseRef.current()} type="button">
            Cancel
          </button>
          {onSave && (
            <button className="btn btn-primary" onClick={onSave} disabled={disableSave} type="button">
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}

export default Modal
