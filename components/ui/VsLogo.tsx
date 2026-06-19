'use client'
import * as React from 'react'

interface VsLogoProps {
  size?: number
  showWordmark?: boolean
  onDark?: boolean
  className?: string
}

export function VsLogoMark({ size = 32, onDark = false }: { size?: number; onDark?: boolean }) {
  // Use the REAL logo asset (not an SVG approximation) so the in-app mark
  // matches the marketing site exactly. onDark adds a light tile for contrast
  // on dark surfaces (the real mark is dark navy + gold).
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/vesimy-logo-mark.webp"
      width={size}
      height={size}
      alt="VeSiMy"
      style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
    />
  )
  if (!onDark) return img
  const pad = Math.round(size * 0.18)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size + pad * 2, height: size + pad * 2,
      borderRadius: Math.round(size * 0.28),
      background: 'linear-gradient(150deg,#FFFFFF,#EEF2F6)',
      boxShadow: '0 2px 8px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.85)',
      flexShrink: 0,
    }}>{img}</span>
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
