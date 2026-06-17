'use client'
// Legacy Logo.tsx - re-exports VsLogo for backward compatibility
import { VsLogo, VsLogoMark } from './VsLogo'

export { VsLogoMark as VLogoMark }

export function VeSiMyWordmark({ size = 40, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <span style={{
      fontFamily: "'Instrument Serif', Georgia, serif",
      fontSize: size,
      fontWeight: 400,
      color: onDark ? '#F7F8FA' : '#0B1D33',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>VeSiMy</span>
  )
}

export interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export function VesimyLogo({ size = 40, showText = true, className = '' }: LogoProps) {
  return <VsLogo size={size} showWordmark={showText} className={className} />
}

export default VesimyLogo
