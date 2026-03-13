// @ts-nocheck
'use client'

import { useEffect } from 'react'

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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handler)
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handler)
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="vesimy-modal-overlay" onClick={onClose}>
      <div
        className="vesimy-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vesimy-modal-handle" />

        <div className="vesimy-modal-header">
          <div className="vesimy-modal-title">{title}</div>

          <button
            className="vesimy-modal-close"
            onClick={onClose}
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
            onClick={onClose}
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
}

export default Modal