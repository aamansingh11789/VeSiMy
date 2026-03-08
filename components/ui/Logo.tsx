// @ts-nocheck
'use client'
// ── components/ui/Logo.tsx ─────────────────────────────────────────────────

interface LogoProps {
  size?:      number
  showText?:  boolean
  className?: string
}

export function VesimyLogo({ size = 40, showText = false, className = '' }: LogoProps) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap: Math.round(size * 0.22), userSelect:'none' }}
      className={className}>
      <VLogoMark size={size} />
      {showText && (
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <span style={{
            fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif',
            fontWeight: 800,
            fontSize: Math.round(size * 0.48),
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FFD060 0%, #D4A208 55%, #C49008 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: 1,
          }}>VeSiMy</span>
          <span style={{
            fontSize: Math.max(7, Math.round(size * 0.15)),
            letterSpacing: 1.5,
            color: 'rgba(160,160,200,0.85)',
            fontFamily: 'monospace',
            textTransform: 'uppercase' as const,
            marginTop: 2,
          }}>Continuous Improvement</span>
        </div>
      )}
    </div>
  )
}

// Rainbow V — orange left, red/pink center, purple right — matches original screenshot
export function VLogoMark({ size = 40 }: { size?: number }) {
  const u = `v${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 108"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink:0, display:'block' }}>
      <defs>
        {/* Orange → red → pink → purple, left to right */}
        <linearGradient id={`${u}g`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FF6A00" />
          <stop offset="28%"  stopColor="#FF3000" />
          <stop offset="50%"  stopColor="#DD0060" />
          <stop offset="72%"  stopColor="#9010C8" />
          <stop offset="100%" stopColor="#5010B8" />
        </linearGradient>
        {/* Highlight shimmer */}
        <linearGradient id={`${u}h`} x1="20" y1="4" x2="55" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={`${u}f`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Left arm */}
      <path d="M 6 4 L 37 4 L 51 86 L 47 94 L 43 86 L 27 4 Z"
        fill={`url(#${u}g)`} filter={`url(#${u}f)`} />
      {/* Right arm */}
      <path d="M 94 4 L 73 4 L 57 86 L 53 94 L 49 86 L 63 4 Z"
        fill={`url(#${u}g)`} filter={`url(#${u}f)`} />
      {/* Inner highlight on left arm */}
      <path d="M 11 4 L 27 4 L 41 74 L 36 74 Z"
        fill={`url(#${u}h)`} />
    </svg>
  )
}

export default VesimyLogo
