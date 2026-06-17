'use client'
// VeSiMy branded loading spinner - matches the V-mark
import * as React from 'react'

interface VsLoadingSpinnerProps {
  size?: number
  fullScreen?: boolean
  message?: string
}

export function VsLoadingSpinner({ size = 40, fullScreen = false, message }: VsLoadingSpinnerProps) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', animation: 'vs-spin 1.4s linear infinite' }}>
        <defs>
          <linearGradient id="vs-spin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0B1D33" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#C9A66B" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--vs-slate-200, #DDE3EA)" strokeWidth="6"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#vs-spin-grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="100 200" transform="rotate(-90 50 50)"/>
      </svg>
      {message && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: 'var(--vs-slate-700, #4F6174)',
          letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
        }}>{message}</span>
      )}
      <style>{`@keyframes vs-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!fullScreen) return spinner

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(247,248,250,0.92)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {spinner}
    </div>
  )
}

export default VsLoadingSpinner
