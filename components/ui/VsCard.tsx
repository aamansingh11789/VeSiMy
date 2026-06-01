'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type VsCardProps = React.HTMLAttributes<HTMLDivElement> & {
  dark?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function VsCard({ className, dark = false, padding = 'md', children, ...props }: VsCardProps) {
  const pad = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }[padding]
  return (
    <div
      className={cn(
        'rounded-vsLg border shadow-vsCard transition-colors',
        dark ? 'border-white/10 bg-vs-navy-950 text-white' : 'border-vs-slate-200 bg-white text-vs-navy-900',
        pad, className
      )}
      {...props}
    >{children}</div>
  )
}

export function VsDarkPanel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-vsXl border border-white/10 bg-vs-navy-950 p-6 text-white shadow-vsDark',
        className
      )}
      {...props}
    >{children}</div>
  )
}
