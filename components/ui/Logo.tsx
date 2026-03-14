// @ts-nocheck
'use client'
// ── components/ui/Logo.tsx ─────────────────────────────────────────────────

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export function VesimyLogo({ size = 40, showText = false, className = '' }: LogoProps) {
  const gap = Math.max(8, Math.round(size * 0.22))

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        userSelect: 'none',
      }}
      className={className}
    >
      <VLogoMark size={size} />

      {showText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif',
              fontWeight: 800,
              fontSize: Math.round(size * 0.48),
              lineHeight: 0.98,
              background:
                'linear-gradient(135deg, #F7DF8A 0%, #D4A208 48%, #B8870A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: 0.8,
              textShadow: '0 0 18px rgba(212,162,8,0.08)',
              whiteSpace: 'nowrap',
            }}
          >
            VeSiMy
          </span>

          <span
            style={{
              fontSize: Math.max(7, Math.round(size * 0.145)),
              letterSpacing: 1.8,
              color: 'rgba(142,138,130,0.9)',
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

export function VLogoMark({ size = 40 }: { size?: number }) {
  const u = `vesimy-logo-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        flexShrink: 0,
        display: 'block',
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Main premium gradient */}
        <linearGradient id={`${u}-main`} x1="8" y1="0" x2="92" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD56C" />
          <stop offset="22%" stopColor="#F4A623" />
          <stop offset="52%" stopColor="#D77A1C" />
          <stop offset="78%" stopColor="#8C44CC" />
          <stop offset="100%" stopColor="#4B1B88" />
        </linearGradient>

        {/* Secondary sheen */}
        <linearGradient id={`${u}-sheen`} x1="18" y1="6" x2="52" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.42" />
          <stop offset="35%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Rim light */}
        <linearGradient id={`${u}-rim`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="48%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>

        {/* Glow */}
        <filter id={`${u}-glow`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.22" />
          <feDropShadow dx="0" dy="2" stdDeviation="1.2" floodColor="#D4A208" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Main V body */}
      <g filter={`url(#${u}-glow)`}>
        {/* Left arm */}
        <path
          d="M10 6 H34.5 L49.6 83.5 Q50.4 88 47.4 92.5 L45 96.5 L20.5 6 Z"
          fill={`url(#${u}-main)`}
        />

        {/* Right arm */}
        <path
          d="M90 6 H65.5 L50.4 83.5 Q49.6 88 52.6 92.5 L55 96.5 L79.5 6 Z"
          fill={`url(#${u}-main)`}
        />

        {/* Inner notch to sharpen the V */}
        <path
          d="M43 82 L50 94 L57 82"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left highlight */}
        <path
          d="M14 8 H26.5 L39.8 70.5 H34.8 Z"
          fill={`url(#${u}-sheen)`}
        />

        {/* Right subtle highlight */}
        <path
          d="M73.5 8 H82 L65.2 68.5 H61.8 Z"
          fill="transparent"
        />
      </g>

      {/* Top edge polish */}
      <path
        d="M11 6 H89"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default VesimyLogo