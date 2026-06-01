'use client'
import * as React from 'react'

interface VsLogoProps {
  size?: number
  showWordmark?: boolean
  onDark?: boolean
  className?: string
}

export function VsLogoMark({ size = 32, onDark = false }: { size?: number; onDark?: boolean }) {
  const lId = onDark ? 'vmL-dark' : 'vmL'
  const rId = onDark ? 'vmR-dark' : 'vmR'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: 'block', flexShrink: 0 }} aria-label="VeSiMy">
      <defs>
        <linearGradient id={lId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={onDark ? '#4A6890' : '#2F4670'}/>
          <stop offset="100%" stopColor={onDark ? '#3A5A7D' : '#1E2E4A'}/>
        </linearGradient>
        <linearGradient id={rId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={onDark ? '#3A5A7D' : '#1E2E4A'}/>
          <stop offset="100%" stopColor={onDark ? '#2F4670' : '#0B1D33'}/>
        </linearGradient>
        <radialGradient id={`vmG-${onDark ? 'd' : 'l'}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E5D4B0"/><stop offset="55%" stopColor="#C9A66B"/><stop offset="100%" stopColor="#A8854F"/>
        </radialGradient>
      </defs>
      <path d="M 20 28 Q 20 24 24 24 L 38 24 Q 42 24 44 28 L 50 40 L 50 86 Q 50 92 44 91 L 28 89 Q 22 88 21 82 L 20 28 Z" fill={`url(#${lId})`}/>
      <path d="M 56 28 Q 58 24 62 24 L 76 24 Q 80 24 80 28 L 79 82 Q 78 88 72 89 L 56 91 Q 50 92 50 86 L 50 40 L 56 28 Z" fill={`url(#${rId})`}/>
      <circle cx="50" cy="20" r="12" fill={`url(#vmG-${onDark ? 'd' : 'l'})`}/>
    </svg>
  )
}

export function VsLogo({ size = 32, showWordmark = true, onDark = false, className = '' }: VsLogoProps) {
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.30) }}>
      <VsLogoMark size={size} onDark={onDark} />
      {showWordmark && (
        <span style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: Math.round(size * 0.72),
          fontWeight: 400,
          color: onDark ? '#F7F8FA' : '#0B1D33',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>VeSiMy</span>
      )}
    </div>
  )
}
