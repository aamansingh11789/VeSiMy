'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type VsButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger' | 'dark'
type VsButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: VsButtonVariant
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function VsButton({ className, variant = 'primary', size = 'md', fullWidth, ...props }: VsButtonProps) {
  const variants: Record<VsButtonVariant, string> = {
    primary:   'bg-vs-navy-800 text-white hover:bg-vs-navy-900 border border-vs-navy-800',
    secondary: 'bg-white text-vs-navy-900 hover:bg-vs-slate-100 border border-vs-slate-200',
    gold:      'bg-vs-gold-600 text-vs-navy-900 hover:bg-vs-gold-500 border border-vs-gold-600',
    ghost:     'bg-transparent text-vs-navy-800 hover:bg-vs-slate-100 border border-transparent',
    danger:    'bg-vs-danger text-white hover:opacity-90 border border-vs-danger',
    dark:      'bg-vs-navy-950 text-white hover:bg-vs-navy-900 border border-white/10',
  }
  const sizes = { sm: 'h-9 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-vsMd font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vs-gold-600',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant], sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  )
}
