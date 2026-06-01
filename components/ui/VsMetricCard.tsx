'use client'
import * as React from 'react'
import { VsCard } from './VsCard'
import { cn } from '@/lib/utils'

interface VsMetricCardProps {
  label: string
  value: string | number
  unit?: string
  delta?: { value: string; positive?: boolean }
  sparkline?: number[]
  sparkColor?: string
  className?: string
}

export function VsMetricCard({ label, value, unit, delta, sparkline, sparkColor = '#2F5D8A', className }: VsMetricCardProps) {
  return (
    <VsCard className={cn('relative', className)}>
      <p className="text-sm font-medium text-vs-slate-700" style={{ fontFamily: 'var(--vs-font-sans)' }}>
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-4xl font-semibold text-vs-navy-900" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {value}
          </span>
          {unit && <span className="text-xl text-vs-slate-600 font-display font-medium">{unit}</span>}
        </div>
        {sparkline && (
          <svg width="80" height="24" viewBox="0 0 80 24" className="flex-shrink-0">
            <polyline
              points={sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * 80},${24 - (v / Math.max(...sparkline)) * 20}`).join(' ')}
              fill="none" stroke={sparkColor} strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      {delta && (
        <p className={cn('mt-3 text-xs font-medium', delta.positive ? 'text-vs-success' : 'text-vs-danger')}>
          {delta.positive ? '↑' : '↓'} {delta.value}
        </p>
      )}
    </VsCard>
  )
}
