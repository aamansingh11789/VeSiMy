'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold'

export function VsBadge({ children, variant = 'neutral', className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  const styles: Record<Variant, string> = {
    neutral: 'bg-vs-slate-100 text-vs-navy-800 border-vs-slate-200',
    success: 'bg-vs-success/10 text-vs-success border-vs-success/30',
    warning: 'bg-vs-warning/10 text-vs-warning border-vs-warning/30',
    danger:  'bg-vs-danger/10 text-vs-danger border-vs-danger/30',
    info:    'bg-vs-info/10 text-vs-info border-vs-info/30',
    gold:    'bg-vs-gold-600/10 text-vs-gold-600 border-vs-gold-600/30',
  }
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      styles[variant], className
    )}>{children}</span>
  )
}
