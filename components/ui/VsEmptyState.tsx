'use client'
import * as React from 'react'
import { VsButton } from './VsButton'

interface VsEmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick?: () => void; href?: string }
}

export function VsEmptyState({ title, description, action }: VsEmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Faint watermark */}
      <svg width="120" height="120" viewBox="0 0 100 100" className="absolute opacity-[0.04] pointer-events-none" aria-hidden="true">
        <path d="M 20 28 Q 20 24 24 24 L 38 24 Q 42 24 44 28 L 50 40 L 50 86 Q 50 92 44 91 L 28 89 Q 22 88 21 82 L 20 28 Z" fill="#0B1D33"/>
        <path d="M 56 28 Q 58 24 62 24 L 76 24 Q 80 24 80 28 L 79 82 Q 78 88 72 89 L 56 91 Q 50 92 50 86 L 50 40 L 56 28 Z" fill="#0B1D33"/>
        <circle cx="50" cy="20" r="12" fill="#C9A66B"/>
      </svg>
      <div className="relative">
        <h3 className="font-display text-2xl font-semibold text-vs-navy-900 mb-2" style={{ letterSpacing: '-0.01em' }}>{title}</h3>
        {description && <p className="text-sm text-vs-slate-600 max-w-md mx-auto mb-6 leading-relaxed">{description}</p>}
        {action && (
          action.href
            ? <a href={action.href}><VsButton variant="primary">{action.label}</VsButton></a>
            : <VsButton variant="primary" onClick={action.onClick}>{action.label}</VsButton>
        )}
      </div>
    </div>
  )
}
