'use client'
// VeSiMy skeleton loader for graceful content loading
import * as React from 'react'

type VsSkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties
} & { key?: React.Key }

export function VsSkeleton({ width = '100%', height = 16, className = '', style = {} }: VsSkeletonProps) {
  return (
    <div
      className={`vs-skeleton ${className}`}
      style={{
        width, height,
        borderRadius: 6,
        display: 'inline-block',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

export function VsSkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{
      padding: 20, background: 'var(--vs-white, #FFFFFF)',
      border: '1px solid var(--vs-slate-200, #DDE3EA)',
      borderRadius: 16,
      boxShadow: 'var(--vs-shadow-card, 0 10px 30px rgba(7,26,47,0.06))',
    }}>
      <VsSkeleton width="40%" height={18} style={{ marginBottom: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <VsSkeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={12} style={{ marginBottom: 8 }} />
      ))}
    </div>
  )
}
