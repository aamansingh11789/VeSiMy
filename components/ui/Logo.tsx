// TypeScript enabled
'use client'
// ── components/ui/Logo.tsx ─────────────────────────────────────────────────

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

// ── 3D extruded V mark ────────────────────────────────────────────────────────
export function VLogoMark({ size = 40 }: { size?: number }) {
  // Static ID prefix, avoids SSR/hydration mismatch on dynamic IDs
  const u = 'v3d'
  return (
    <svg
      width={size}
      height={Math.round(size * 1.08)}
      viewBox="0 0 100 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {/* Front face, gold → purple gradient */}
        <linearGradient id={`${u}-front`} x1="8" y1="0" x2="92" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFD56C" />
          <stop offset="22%"  stopColor="#F4A623" />
          <stop offset="50%"  stopColor="#D77A1C" />
          <stop offset="76%"  stopColor="#8C44CC" />
          <stop offset="100%" stopColor="#4B1B88" />
        </linearGradient>
        {/* Depth/extrusion, darker */}
        <linearGradient id={`${u}-depth`} x1="0" y1="0" x2="0" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#B8700A" />
          <stop offset="50%"  stopColor="#9B3D10" />
          <stop offset="100%" stopColor="#3A1560" />
        </linearGradient>
        {/* Top bevel, lightest */}
        <linearGradient id={`${u}-top`} x1="10" y1="6" x2="90" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFE896" />
          <stop offset="50%"  stopColor="#FFD56C" />
          <stop offset="100%" stopColor="#F4A623" />
        </linearGradient>
        {/* Sheen highlight */}
        <linearGradient id={`${u}-sheen`} x1="14" y1="6" x2="50" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="0.44" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={`${u}-shadow`} x="-25%" y="-15%" width="155%" height="145%">
          <feDropShadow dx="2"  dy="7"  stdDeviation="7"   floodColor="#000000" floodOpacity="0.24" />
          <feDropShadow dx="0"  dy="2"  stdDeviation="2"   floodColor="#0176D3" floodOpacity="0.16" />
        </filter>
      </defs>

      <g filter={`url(#${u}-shadow)`}>
        {/* ── Depth layer (extruded offset down-right) ── */}
        <path d="M14 10 H38 L53 87 Q53.8 91.5 50.8 96 L48.5 100 L24.5 10 Z"
              fill={`url(#${u}-depth)`} opacity="0.82" />
        <path d="M86 10 H62 L47 87 Q46.2 91.5 49.2 96 L51.5 100 L75.5 10 Z"
              fill={`url(#${u}-depth)`} opacity="0.82" />

        {/* ── Front face ── */}
        <path d="M10 6 H34.5 L49.6 83.5 Q50.4 88 47.4 92.5 L45 96.5 L20.5 6 Z"
              fill={`url(#${u}-front)`} />
        <path d="M90 6 H65.5 L50.4 83.5 Q49.6 88 52.6 92.5 L55 96.5 L79.5 6 Z"
              fill={`url(#${u}-front)`} />

        {/* ── Top bevel edge ── */}
        <path d="M10 6 H20.5 L14 10 H10 Z"      fill={`url(#${u}-top)`} opacity="0.92" />
        <path d="M20.5 6 H34.5 L38 10 H24.5 Z"  fill={`url(#${u}-top)`} opacity="0.92" />
        <path d="M90 6 H79.5 L86 10 H90 Z"      fill={`url(#${u}-top)`} opacity="0.92" />
        <path d="M79.5 6 H65.5 L62 10 H75.5 Z"  fill={`url(#${u}-top)`} opacity="0.92" />

        {/* ── Right-face sides ── */}
        <path d="M34.5 6 L38 10 L53 87 L49.6 83.5 Z"
              fill="rgba(0,0,0,0.08)" />
        <path d="M65.5 6 L62 10 L47 87 L50.4 83.5 Z"
              fill="rgba(0,0,0,0.08)" />

        {/* ── Sheen / highlight ── */}
        <path d="M14 8 H26.5 L39.8 70.5 H34.8 Z"
              fill={`url(#${u}-sheen)`} />

        {/* ── Inner notch ── */}
        <path d="M43 82 L50 94 L57 82"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* ── Top edge highlight ── */}
        <path d="M11 6 H89"
              stroke="rgba(255,255,255,0.24)" strokeWidth="1.4"
              strokeLinecap="round" />

        {/* ── Bevel crease lines ── */}
        <line x1="34.5" y1="6" x2="38"  y2="10" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
        <line x1="65.5" y1="6" x2="62"  y2="10" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

// ── VeSiMy wordmark, V, S, M large caps; e, i, y small ──────────────────────
export function VeSiMyWordmark({ size = 40, onDark = false }: { size?: number; onDark?: boolean }) {
  const capSize   = Math.round(size * 0.95)
  const lowerSize = Math.round(size * 0.50)
  const mutedColor = onDark ? 'rgba(248,247,245,0.55)' : '#8E8A82'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: serif,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: 0,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: capSize,   color: '#0176D3' }}>V</span>
      <span style={{ fontSize: lowerSize, color: mutedColor }}>e</span>
      <span style={{ fontSize: capSize,   color: '#8C44CC' }}>S</span>
      <span style={{ fontSize: lowerSize, color: mutedColor }}>i</span>
      <span style={{ fontSize: capSize,   color: '#3070B8' }}>M</span>
      <span style={{ fontSize: lowerSize, color: mutedColor }}>y</span>
    </span>
  )
}

// ── Full logo (mark + wordmark) ───────────────────────────────────────────────
export function VesimyLogo({ size = 40, showText = false, className = '' }: LogoProps) {
  const gap = Math.max(8, Math.round(size * 0.22))

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap, userSelect: 'none' }}
      className={className}
    >
      <VLogoMark size={size} />

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <VeSiMyWordmark size={size * 0.48} />
          <span
            style={{
              fontSize: Math.max(7, Math.round(size * 0.145)),
              letterSpacing: 1.8,
              color: '#8E8A82',
              fontFamily: 'JetBrains Mono, monospace',
              textTransform: 'uppercase',
              marginTop: 3,
              whiteSpace: 'nowrap',
            }}
          >
            Continuous Improvement
          </span>
        </div>
      )}
    </div>
  )
}

export default VesimyLogo
