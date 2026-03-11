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

/* ───────────────────────────────────────────────────────────── */

export function Modal({
title,
children,
onClose,
onSave,
saveLabel = 'Save',
disableSave = false,
}: ModalProps) {

/* ESC key closes modal */

useEffect(() => {

const handler = (e: KeyboardEvent) => {
if (e.key === 'Escape') onClose()
}

document.addEventListener('keydown', handler)

return () => document.removeEventListener('keydown', handler)

}, [])

/* prevent body scroll */

useEffect(() => {

document.body.style.overflow = 'hidden'

return () => {
document.body.style.overflow = ''
}

}, [])

return (

<div className="vesimy-modal-overlay" onClick={onClose}>

<div
className="vesimy-modal"
onClick={(e) => e.stopPropagation()}
>

{/* Mobile drag handle */}

<div className="vesimy-modal-handle" />

{/* Header */}

<div className="vesimy-modal-header">

<div className="vesimy-modal-title">
{title}
</div>

<button
className="vesimy-modal-close"
onClick={onClose}
>
✕
</button>

</div>

{/* Body */}

<div className="vesimy-modal-body">

{children}

</div>

{/* Footer */}

<div className="vesimy-modal-footer">

<button
className="btn btn-ghost"
onClick={onClose}
>
Cancel
</button>

{onSave && (

<button
className="btn btn-primary"
onClick={onSave}
disabled={disableSave}
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