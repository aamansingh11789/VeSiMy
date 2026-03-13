// @ts-nocheck
'use client'

import { useEffect, useRef } from 'react'
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
  // Stable ref so the effect never re-runs due to onClose identity changes
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handler)

    // iOS Safari requires position:fixed on body to truly stop background scroll.
    // overflow:hidden alone is ignored by iOS. We store scrollY to restore position on close.
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')

    // Hide bottom nav + sidebar instantly (no CSS timing gap)
    const nav     = document.querySelector('.bottom-nav') as HTMLElement | null
    const sidebar = document.querySelector('aside')       as HTMLElement | null
    if (nav)     nav.style.setProperty('display', 'none', 'important')
    if (sidebar) sidebar.style.setProperty('zIndex', '-1', 'important')

    return () => {
      document.removeEventListener('keydown', handler)
      document.body.classList.remove('modal-open')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      // Restore scroll position that was locked
      window.scrollTo(0, scrollY)

      if (nav)     nav.style.removeProperty('display')
      if (sidebar) sidebar.style.removeProperty('zIndex')
    }
  }, []) // runs once on mount, cleans up on unmount

  const content = (
    <div className="vesimy-modal-overlay" onClick={() => onCloseRef.current()}>
      <div
        className="vesimy-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vesimy-modal-handle" />

        <div className="vesimy-modal-header">
          <div className="vesimy-modal-title">{title}</div>
          <button
            className="vesimy-modal-close"
            onClick={() => onCloseRef.current()}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="vesimy-modal-body">
          {children}
        </div>

        <div className="vesimy-modal-footer">
          <button
            className="btn btn-ghost"
            onClick={() => onCloseRef.current()}
            type="button"
          >
            Cancel
          </button>

          {onSave && (
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={disableSave}
              type="button"
            >
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  // Portal renders directly into document.body — completely above BottomNav,
  // Sidebar, and every other fixed element regardless of z-index stacking contexts.
  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}

export default Modal
