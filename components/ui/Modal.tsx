// TypeScript enabled
'use client'
import { XIcon } from '@/components/ui/Icons'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  title: string
  children: React.ReactNode
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
        // Inside the scroll body — let iOS scroll it naturally, don't prevent
        return
      }
      // Outside modal body — block background scroll
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
        // NEVER scrollable — iOS would scroll this instead of the modal body
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
          // Explicit height — not max-height — so iOS knows the exact boundary
          height:    isMobile ? '92svh' : undefined,
          maxHeight: isMobile ? '92svh' : 'calc(100dvh - 60px)',
          width: '100%',
          maxWidth: isMobile ? '100%' : 640,
          background: 'linear-gradient(180deg,transparent,rgba(255,255,255,0.008)),var(--sl-50)',
          border: '1px solid rgba(44,44,92,0.86)',
          borderRadius: isMobile ? '20px 20px 0 0' : 20,
          boxShadow: '0 32px 100px rgba(0,0,0,0.62)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* drag handle */}
        {isMobile && (
          <div style={{ width: 42, height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 999, margin: '10px auto 0', flexShrink: 0 }} />
        )}

        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: isMobile ? '12px 16px 10px' : '18px 22px 14px',
          borderBottom: '1px solid rgba(42,42,90,0.72)',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 15 : 17, fontWeight: 700, color: 'var(--text)' }}>
            {title}
          </div>
          {/* VeSiMy brand — visible in every tool screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto', marginRight: 10, padding: '3px 9px', borderRadius: 6, background: 'rgba(1,118,211,0.07)', border: '1px solid rgba(1,118,211,0.18)', flexShrink: 0 }}>
            <svg width="11" height="12" viewBox="0 0 100 108" fill="none">
              <defs>
                <linearGradient id="vm-hdr" x1="8" y1="0" x2="92" y2="108" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFD56C"/>
                  <stop offset="50%" stopColor="#0176D3"/>
                  <stop offset="100%" stopColor="#6426A0"/>
                </linearGradient>
              </defs>
              <path d="M8 8L38 88L50 64L62 88L92 8H72L50 60L28 8Z" fill="url(#vm-hdr)"/>
            </svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#7070A0', letterSpacing: 0.5, fontFamily: 'Palatino Linotype,serif' }}>VeSiMy</span>
          </div>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 18, cursor: 'pointer', padding: '4px 6px', flexShrink: 0 }}
            onClick={() => onCloseRef.current()}
            type="button"
          ><XIcon size={14}/></button>
        </div>

        {/* ── scrollable body ── */}
        {/* 
          svh = Small Viewport Height (excludes Safari toolbar) — more reliable than dvh for position calculations.
          Heights:  handle 25px + header ~52px + footer ~68px = 145px
          Body = 92svh - 145px
          overflow-y:scroll (not auto) — iOS Safari sometimes ignores auto on non-body elements
        */}
        <div
          ref={bodyRef}
          style={{
            // Explicit calculated height — no flex:1, no min-height tricks
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
          borderTop: '1px solid rgba(42,42,90,0.72)',
          background: 'rgba(248,247,245,0.97)',
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
