// @ts-nocheck
'use client'
// ── components/ui/Icons.tsx ───────────────────────────────────────────────────
// VeSiMy Premium Icon Library — Volumetric 3D Greyscale
// Every icon is a physical object under directional top-left lighting.
// Palette: #F4F2EE highlight → #C8C4BC mid → #8A8680 shadow → #3A3835 deep

interface IconProps {
  size?: number; color?: string; stroke?: number
  style?: React.CSSProperties; className?: string
}

// Adaptive line wrapper — works on any background colour
function I({ size=18, color='currentColor', stroke=1.75, style, className, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, ...style }} className={className}>{children}</svg>
  )
}

// Volumetric 3D wrapper — self-contained SVG with per-icon gradients
function V({ size=20, style, className, id='v', children }) {
  const u = id
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, ...style }} className={className}>
      <defs>
        <linearGradient id={`${u}T`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EDEBE6"/><stop offset="100%" stopColor="#B8B4AC"/></linearGradient>
        <linearGradient id={`${u}F`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#D4D0C8"/><stop offset="100%" stopColor="#8A8680"/></linearGradient>
        <linearGradient id={`${u}S`} x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7A7670"/><stop offset="100%" stopColor="#484542"/></linearGradient>
        <linearGradient id={`${u}H`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F4F2EE" stopOpacity="0.9"/><stop offset="60%" stopColor="#F4F2EE" stopOpacity="0"/></linearGradient>
        <linearGradient id={`${u}G`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#D4A208"/><stop offset="100%" stopColor="#92700A"/></linearGradient>
        <filter id={`${u}D`}><feDropShadow dx="0.4" dy="0.9" stdDeviation="0.7" floodColor="#1C1B19" floodOpacity="0.26"/></filter>
      </defs>
      {children}
    </svg>
  )
}

// ── Pure line icons (simple, adaptive) ───────────────────────────────────────
export const ChevronRightIcon = (p) => (<I {...p}><polyline points="9 18 15 12 9 6"/></I>)
export const ChevronDownIcon  = (p) => (<I {...p}><polyline points="6 9 12 15 18 9"/></I>)
export const ArrowRightIcon   = (p) => (<I {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></I>)
export const ArrowLeftIcon    = (p) => (<I {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 18 5 12 11 6"/></I>)
export const XIcon            = (p) => (<I {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>)
export const CheckIcon        = (p) => (<I {...p}><polyline points="20 6 9 17 4 12"/></I>)
export const SearchIcon       = (p) => (<I {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>)
export const RefreshIcon      = (p) => (<I {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></I>)
export const ExternalLinkIcon = (p) => (<I {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></I>)
export const SunIcon          = (p) => (<I {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></I>)
export const MoonIcon         = (p) => (<I {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></I>)
export const InfinityIcon     = (p) => (<I {...p}><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4Zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4Z"/></I>)
export const GridIcon         = (p) => (<I {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></I>)
export const LayersIcon       = (p) => (<I {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></I>)
export const BarChartIcon     = (p) => (<I {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></I>)
export const ClockIcon        = (p) => (<I {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></I>)
export const StepIcon         = (p) => (<I {...p}><rect x="2" y="7" width="14" height="10" rx="2"/><path d="M16 10l5 2-5 2"/><line x1="6" y1="11" x2="10" y2="11"/><line x1="6" y1="14" x2="9" y2="14"/></I>)
export const TaktIcon         = (p) => (<I {...p}><line x1="12" y1="20" x2="12" y2="4"/><path d="M7 9l5-5 5 5"/><path d="M9 20h6"/><circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="12" x2="14.5" y2="10.5"/></I>)
export const WIPIcon          = (p) => (<I {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></I>)
export const OperatorIcon     = (p) => (<I {...p}><circle cx="12" cy="6" r="3"/><path d="M9 20v-5l-3-3 1.5-6h9L18 12l-3 3v5"/></I>)
export const DefectIcon       = (p) => (<I {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/><line x1="10" y1="10" x2="14" y2="14"/><line x1="14" y1="10" x2="10" y2="14"/></I>)
export const PCEIcon          = (p) => (<I {...p}><path d="M3 12a9 9 0 1 0 9-9"/><path d="M12 7v5l3 3"/><circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none"/></I>)
export const SupermarketIcon  = (p) => (<I {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="10" x2="9" y2="20"/><line x1="15" y1="10" x2="15" y2="20"/></I>)
export const DragHandleIcon   = (p) => (<I {...p}><circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/></I>)

// ── Volumetric 3D Nav Icons ───────────────────────────────────────────────────

export const DashboardIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="da">
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="#2A2825" opacity="0.22"/>
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="#2A2825" opacity="0.22"/>
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="#2A2825" opacity="0.22"/>
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="#2A2825" opacity="0.22"/>
    <rect x="3" y="3" width="7" height="7" rx="2" fill="url(#daF)" filter="url(#daD)"/>
    <rect x="13" y="3" width="7" height="7" rx="2" fill="url(#daT)"/>
    <rect x="3" y="13" width="7" height="7" rx="2" fill="url(#daT)"/>
    <rect x="13" y="17" width="7" height="3" rx="1" fill="url(#daF)"/>
    <rect x="13" y="13" width="7" height="3.5" rx="1" fill="url(#daG)" opacity="0.85"/>
    <rect x="3" y="3" width="7" height="1.6" rx="2" fill="url(#daH)" opacity="0.65"/>
    <rect x="13" y="3" width="7" height="1.6" rx="2" fill="url(#daH)" opacity="0.55"/>
    <rect x="3" y="13" width="7" height="1.6" rx="2" fill="url(#daH)" opacity="0.5"/>
  </V>
)

export const FolderIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="fo">
    <path d="M3.5 8a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59L11.33 8H20a2 2 0 0 1 2 2v1H3.5V8Z" fill="url(#foS)"/>
    <path d="M3 9.5h18v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5Z" fill="#2A2825" opacity="0.2" transform="translate(0.5 0.5)"/>
    <path d="M3 9h18v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" fill="url(#foF)" filter="url(#foD)"/>
    <path d="M3 9h18v1.8H3Z" fill="url(#foH)" opacity="0.42"/>
    <path d="M3 7h7.83l.5.5H3V7Z" fill="url(#foH)" opacity="0.35"/>
  </V>
)

export const SettingsIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="se">
    <circle cx="12.4" cy="12.4" r="9.6" fill="#2A2825" opacity="0.16"/>
    {[0,45,90,135,180,225,270,315].map((a,i) => {
      const r=a*Math.PI/180, x=12+9.2*Math.cos(r), y=12+9.2*Math.sin(r)
      return <ellipse key={i} cx={x} cy={y} rx="2.1" ry="1.45" transform={`rotate(${a} ${x} ${y})`} fill="url(#seF)"/>
    })}
    <circle cx="12" cy="12" r="7.2" fill="url(#seF)" filter="url(#seD)"/>
    <circle cx="12" cy="12" r="4.4" fill="url(#seS)"/>
    <circle cx="12" cy="12" r="2.8" fill="#1A1714"/>
    <path d="M8.5 8.5a7 7 0 0 1 7 0" stroke="url(#seH)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55"/>
  </V>
)

export const LogOutIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="lo">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="url(#loF)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <rect x="3" y="3" width="6" height="18" rx="2" fill="url(#loT)" opacity="0.45"/>
    <rect x="3" y="3" width="6" height="2" rx="1" fill="url(#loH)" opacity="0.45"/>
    <line x1="9" y1="12" x2="21" y2="12" stroke="url(#loF)" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="16 7 21 12 16 17" stroke="url(#loG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </V>
)

export const CrownIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="cr">
    <rect x="3.5" y="17.5" width="18" height="2.5" rx="1" fill="#2A2825" opacity="0.22"/>
    <rect x="3" y="17" width="18" height="2.5" rx="1" fill="url(#crF)"/>
    <rect x="3" y="17" width="18" height="1" rx="0.5" fill="url(#crH)" opacity="0.45"/>
    <path d="M3.5 7.5l4.5 8L12.5 5.5l4.5 10 4.5-8V17H3.5V7.5Z" fill="#2A2825" opacity="0.2"/>
    <path d="M3 7l4.5 8L12 5l4.5 10L21 7v10H3V7Z" fill="url(#crF)" filter="url(#crD)"/>
    <path d="M3 7l2 3.5" stroke="url(#crH)" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
    <path d="M12 5l1 3" stroke="url(#crH)" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
    <path d="M3 7l4.5 8" stroke="url(#crG)" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.75"/>
    <path d="M12 5l4.5 10" stroke="url(#crG)" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </V>
)

export const ZapIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="za">
    <polygon points="13.5 2.5 3.5 14.5 12.5 14.5 11.5 22.5 21.5 10.5 12.5 10.5 13.5 2.5" fill="#2A2825" opacity="0.2"/>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="url(#zaF)" filter="url(#zaD)"/>
    <polygon points="13 2 3 14 12 14 13 2" fill="url(#zaT)" opacity="0.55"/>
    <polyline points="13 2 3 14" stroke="url(#zaG)" strokeWidth="0.7" fill="none" opacity="0.65"/>
    <polygon points="13 2 10.5 7.5 14.5 7.5 13 2" fill="url(#zaH)" opacity="0.45"/>
  </V>
)

export const BookIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="bo">
    <path d="M12.5 21.5a3 3 0 0 0-3-3H2.5V3.5h7a3 3 0 0 1 3 3Z" fill="#2A2825" opacity="0.2"/>
    <path d="M12 21a3 3 0 0 0-3-3H2V3h7a3 3 0 0 1 3 3V21Z" fill="url(#boF)" filter="url(#boD)"/>
    <path d="M12 21a3 3 0 0 1 3-3h7V3h-7a3 3 0 0 0-3 3V21Z" fill="url(#boT)"/>
    <line x1="12" y1="6" x2="12" y2="21" stroke="url(#boH)" strokeWidth="0.8" opacity="0.45"/>
    <line x1="4.5" y1="9" x2="10" y2="9" stroke="#8A8680" strokeWidth="0.8" opacity="0.6"/>
    <line x1="4.5" y1="12" x2="10" y2="12" stroke="#8A8680" strokeWidth="0.8" opacity="0.5"/>
    <line x1="4.5" y1="15" x2="10" y2="15" stroke="#8A8680" strokeWidth="0.8" opacity="0.4"/>
    <line x1="14" y1="9" x2="19.5" y2="9" stroke="#8A8680" strokeWidth="0.8" opacity="0.4"/>
    <line x1="14" y1="12" x2="19.5" y2="12" stroke="#8A8680" strokeWidth="0.8" opacity="0.3"/>
    <path d="M2 3h10" stroke="url(#boH)" strokeWidth="0.8" opacity="0.45"/>
  </V>
)

export const PlusIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="pl">
    <circle cx="12.3" cy="12.3" r="9.3" fill="#2A2825" opacity="0.2"/>
    <circle cx="12" cy="12" r="9" fill="url(#plF)" filter="url(#plD)"/>
    <line x1="12" y1="7.5" x2="12" y2="16.5" stroke="url(#plT)" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="7.5" y1="12" x2="16.5" y2="12" stroke="url(#plT)" strokeWidth="2.2" strokeLinecap="round"/>
    <ellipse cx="9.5" cy="9.5" rx="3" ry="1.5" fill="url(#plH)" opacity="0.38" transform="rotate(-30 9.5 9.5)"/>
  </V>
)

export const UserIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="us">
    <circle cx="12.3" cy="7.3" r="4.3" fill="#2A2825" opacity="0.2"/>
    <circle cx="12" cy="7" r="4" fill="url(#usF)" filter="url(#usD)"/>
    <ellipse cx="11.3" cy="5.5" rx="2" ry="1.2" fill="url(#usH)" opacity="0.42"/>
    <path d="M20.5 21.5v-2a4 4 0 0 0-4-4H7.5a4 4 0 0 0-4 4v2" fill="#2A2825" opacity="0.18"/>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="url(#usT)"/>
  </V>
)

export const LockIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="lk">
    <rect x="3.5" y="11.5" width="18" height="11" rx="2.5" fill="#2A2825" opacity="0.2"/>
    <rect x="3" y="11" width="18" height="11" rx="2" fill="url(#lkF)" filter="url(#lkD)"/>
    <rect x="3" y="11" width="18" height="2.5" rx="2" fill="url(#lkH)" opacity="0.38"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="url(#lkT)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="16.5" r="1.9" fill="url(#lkS)"/>
    <line x1="12" y1="16.5" x2="12" y2="19.5" stroke="url(#lkS)" strokeWidth="1.6" strokeLinecap="round"/>
  </V>
)

export const MailIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="ma">
    <rect x="2.5" y="4.5" width="20" height="16" rx="2.5" fill="#2A2825" opacity="0.2"/>
    <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#maF)" filter="url(#maD)"/>
    <rect x="2" y="4" width="20" height="2.5" rx="2" fill="url(#maH)" opacity="0.38"/>
    <polyline points="22 6 12 13 2 6" stroke="url(#maS)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </V>
)

export const CreditCardIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="cc">
    <rect x="1.5" y="4.5" width="22" height="16" rx="2.5" fill="#2A2825" opacity="0.2"/>
    <rect x="1" y="4" width="22" height="16" rx="2" fill="url(#ccF)" filter="url(#ccD)"/>
    <rect x="1" y="10" width="22" height="3" fill="url(#ccS)"/>
    <rect x="1" y="4" width="22" height="2.5" rx="2" fill="url(#ccH)" opacity="0.38"/>
    <rect x="5" y="15" width="6" height="1.5" rx="0.75" fill="url(#ccT)" opacity="0.7"/>
    <rect x="14" y="15" width="4" height="1.5" rx="0.75" fill="url(#ccG)" opacity="0.9"/>
  </V>
)

export const BuildingIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="bu">
    <path d="M3 21h18" stroke="url(#buF)" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M5.5 21.5V7.5l8.5-4.5v18.5" fill="#2A2825" opacity="0.2"/>
    <path d="M5 21V7l8-4v18" fill="url(#buF)" filter="url(#buD)"/>
    <path d="M5 7l8-4" stroke="url(#buH)" strokeWidth="0.8" opacity="0.45"/>
    <path d="M19.5 21.5V11.5l-6.5-4" fill="#2A2825" opacity="0.15"/>
    <path d="M19 21V11l-6-4" stroke="url(#buS)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <rect x="9" y="10" width="2" height="2" rx="0.5" fill="url(#buS)"/>
    <rect x="9" y="15" width="2" height="2" rx="0.5" fill="url(#buS)"/>
    <rect x="14" y="14" width="2" height="2" rx="0.5" fill="url(#buS)" opacity="0.7"/>
  </V>
)

export const SparkleIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="sk">
    <path d="M12.5 3.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2 2-5.5Z" fill="#2A2825" opacity="0.2"/>
    <path d="M12 3l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2L12 3Z" fill="url(#skG)" filter="url(#skD)"/>
    <path d="M12 3l1 3" stroke="url(#skH)" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
    <circle cx="5" cy="19" r="1.2" fill="url(#skF)"/>
    <circle cx="19" cy="5" r="0.9" fill="url(#skF)" opacity="0.8"/>
  </V>
)

export const DownloadIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="dn">
    <rect x="2.5" y="15.5" width="20" height="6" rx="2.5" fill="#2A2825" opacity="0.2"/>
    <rect x="2" y="15" width="20" height="6" rx="2" fill="url(#dnF)" filter="url(#dnD)"/>
    <rect x="2" y="15" width="20" height="2" rx="2" fill="url(#dnH)" opacity="0.38"/>
    <line x1="12" y1="3" x2="12" y2="14" stroke="url(#dnT)" strokeWidth="2.1" strokeLinecap="round"/>
    <polyline points="7 9 12 14 17 9" stroke="url(#dnG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </V>
)

export const ActivityIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="ac">
    <polyline points="22.5 12.5 18.5 12.5 15.5 21.5 9.5 3.5 6.5 12.5 2.5 12.5" stroke="#2A2825" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.18"/>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="url(#acF)" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22 11.5 18 11.5 15 20.5 9 2.5 6 11.5 2 11.5" stroke="url(#acH)" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.38"/>
  </V>
)

export const AlertIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="al">
    <path d="M10.79 4.36L2.32 18.5a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L14.21 4.36a2 2 0 0 0-3.42 0Z" fill="#2A2825" opacity="0.2" transform="translate(0.4 0.4)"/>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" fill="url(#alF)" filter="url(#alD)"/>
    <path d="M10.29 3.86L1.82 18l10.18-10.18L10.29 3.86Z" fill="url(#alT)" opacity="0.55"/>
    <line x1="12" y1="9" x2="12" y2="13.5" stroke="url(#alS)" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1.15" fill="url(#alS)"/>
    <path d="M10.29 3.86l1.5 2.5" stroke="url(#alH)" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
  </V>
)

export const InfoIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="in">
    <circle cx="12.3" cy="12.3" r="10.3" fill="#2A2825" opacity="0.18"/>
    <circle cx="12" cy="12" r="10" fill="url(#inF)" filter="url(#inD)"/>
    <ellipse cx="9.5" cy="8.5" rx="3.5" ry="2" fill="url(#inH)" opacity="0.32"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="url(#inT)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="url(#inT)" strokeWidth="2.2" strokeLinecap="round"/>
  </V>
)

export const TrashIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="ta">
    <line x1="3" y1="6" x2="21" y2="6" stroke="url(#taF)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="url(#taT)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M19.5 6.5l-1 14a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2l-1-14" fill="#2A2825" opacity="0.18"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" fill="url(#taF)" filter="url(#taD)"/>
    <line x1="10" y1="11" x2="10" y2="17" stroke="url(#taS)" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="14" y1="11" x2="14" y2="17" stroke="url(#taS)" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5 6h14v1.5H5Z" fill="url(#taH)" opacity="0.28"/>
  </V>
)

export const EditIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="ed">
    <path d="M11.5 4.5H4.5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="#2A2825" opacity="0.18" transform="translate(0.5 0.5)"/>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="url(#edT)" filter="url(#edD)"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12.5 15l-4 1 1-4 9-9.5Z" fill="#2A2825" opacity="0.2" transform="translate(0.5 0.5)"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12.5 15l-4 1 1-4 9-9.5Z" fill="url(#edG)" filter="url(#edD)"/>
    <path d="M18.5 2.5l1.5 1.5" stroke="url(#edH)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
  </V>
)

export const PDFIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="pd">
    <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#2A2825" opacity="0.2"/>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill="url(#pdT)" filter="url(#pdD)"/>
    <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2Z" fill="url(#pdF)"/>
    <path d="M14 2v6h6" stroke="url(#pdS)" strokeWidth="1" fill="none"/>
    <path d="M6 4h8" stroke="url(#pdH)" strokeWidth="0.7" strokeLinecap="round" opacity="0.45"/>
    <path d="M8 13h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8v-3Z" stroke="url(#pdS)" strokeWidth="1.2" fill="none"/>
    <path d="M13 13h1.5a1.5 1.5 0 0 1 0 3H13v-3Z" stroke="url(#pdS)" strokeWidth="1.2" fill="none"/>
  </V>
)

// ── Volumetric CI Tool Icons ──────────────────────────────────────────────────

export const VSMIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="vs">
    <rect x="2.5" y="9.5" width="5.5" height="6" rx="1.5" fill="#2A2825" opacity="0.22"/>
    <rect x="9.5" y="9.5" width="5" height="6" rx="1.5" fill="#2A2825" opacity="0.22"/>
    <rect x="16.5" y="9.5" width="5.5" height="6" rx="1.5" fill="#2A2825" opacity="0.22"/>
    <rect x="2" y="9" width="5.5" height="6" rx="1.5" fill="url(#vsF)" filter="url(#vsD)"/>
    <rect x="9" y="9" width="5" height="6" rx="1.5" fill="url(#vsT)"/>
    <rect x="16" y="9" width="5.5" height="6" rx="1.5" fill="url(#vsF)"/>
    <rect x="2" y="9" width="5.5" height="1.8" rx="1.5" fill="url(#vsH)" opacity="0.58"/>
    <rect x="9" y="9" width="5" height="1.8" rx="1.5" fill="url(#vsH)" opacity="0.5"/>
    <rect x="16" y="9" width="5.5" height="1.8" rx="1.5" fill="url(#vsH)" opacity="0.58"/>
    <path d="M7.5 12h1.5M14 12h2" stroke="url(#vsS)" strokeWidth="1.4" strokeLinecap="round"/>
    <polyline points="14.8 10.5 16.5 12 14.8 13.5" stroke="url(#vsG)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <polyline points="7.2 10.5 8.8 12 7.2 13.5" stroke="url(#vsS)" strokeWidth="1.1" fill="none"/>
    <path d="M4.8 9V6M12 9V5.5M18.8 9V6" stroke="#8A8680" strokeWidth="0.9" strokeDasharray="1.2 1.2" strokeLinecap="round"/>
  </V>
)

export const KaizenIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="ka">
    <path d="M12.5 2.5L9 10H3L8 14.5l-2 8 6-4 6 4-2-8 5-4.5h-5.5L12.5 2.5Z" fill="#2A2825" opacity="0.24"/>
    <path d="M12 2L8.5 9.5H3L8 14l-2 8 6-4 6 4-2-8 5-4.5h-5.5L12 2Z" fill="url(#kaF)" filter="url(#kaD)"/>
    <path d="M12 2L10 7h-2l3.2 2.5L12 2Z" fill="url(#kaT)" opacity="0.62"/>
    <path d="M12 2l1 2.5" stroke="url(#kaH)" strokeWidth="1" strokeLinecap="round" opacity="0.65"/>
    <circle cx="12" cy="12.5" r="2.1" fill="url(#kaG)" opacity="0.72"/>
  </V>
)

export const FishboneIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="fi">
    <line x1="3" y1="12.6" x2="21" y2="12.6" stroke="#2A2825" strokeWidth="2.6" strokeLinecap="round" opacity="0.2"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="url(#fiF)" strokeWidth="2.3" strokeLinecap="round"/>
    <line x1="3" y1="11.5" x2="18" y2="11.5" stroke="url(#fiH)" strokeWidth="0.7" strokeLinecap="round" opacity="0.42"/>
    <polygon points="19 10 21.5 12 19 14" fill="url(#fiG)"/>
    {[[8,12,6,7],[12,12,10,7],[16,12,14,7]].map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1+0.4} x2={x2} y2={y2+0.4} stroke="#2A2825" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
    ))}
    {[[8,12,6,7],[12,12,10,7],[16,12,14,7]].map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#fiT)" strokeWidth="1.5" strokeLinecap="round"/>
    ))}
    {[[8,12,6,17],[12,12,10,17],[16,12,14,17]].map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#fiS)" strokeWidth="1.5" strokeLinecap="round"/>
    ))}
  </V>
)

export const FiveWhyIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="fw">
    <circle cx="12.3" cy="6.3" r="4.5" fill="#2A2825" opacity="0.2"/>
    <circle cx="12" cy="6" r="4.1" fill="url(#fwT)" filter="url(#fwD)"/>
    <circle cx="12" cy="6" r="2.65" stroke="url(#fwF)" strokeWidth="1.6" fill="none"/>
    <path d="M10 4.5a2.5 2.5 0 0 1 2.5-1" stroke="url(#fwH)" strokeWidth="1.2" strokeLinecap="round" opacity="0.62"/>
    <line x1="12" y1="10.5" x2="10.5" y2="13"  stroke="url(#fwF)" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10.5" y1="13"  x2="9"   y2="15.5" stroke="url(#fwS)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
    <line x1="9"   y1="15.5" x2="7.5" y2="18"   stroke="url(#fwS)" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
    {[{cx:12,cy:10.5,r:1.1,fill:"url(#fwF)"},{cx:10.5,cy:13,r:.95,fill:"url(#fwS)",op:"0.85"},{cx:9,cy:15.5,r:.8,fill:"url(#fwS)",op:"0.65"},{cx:7.5,cy:18,r:.7,fill:"url(#fwS)",op:"0.5"}].map((c,i)=>(
      <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} opacity={c.op}/>
    ))}
  </V>
)

export const StopwatchIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="st">
    <circle cx="12.3" cy="13.3" r="8.6" fill="#2A2825" opacity="0.2"/>
    <circle cx="12" cy="13" r="8.3" fill="url(#stF)" filter="url(#stD)"/>
    <circle cx="12" cy="13" r="6.6" fill="#1A1714" opacity="0.92"/>
    <circle cx="12" cy="13" r="6.6" fill="url(#stT)" opacity="0.38"/>
    <path d="M7.5 8.5a8 8 0 0 1 9 0" stroke="url(#stH)" strokeWidth="1.4" strokeLinecap="round" opacity="0.58"/>
    <line x1="12" y1="13" x2="12"  y2="9.5"  stroke="#E8E4DC" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="12" y1="13" x2="14.9" y2="15.1" stroke="url(#stG)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="13" r="1.15" fill="#E8E4DC"/>
    <rect x="10.5" y="2" width="3" height="2" rx="0.8" fill="url(#stF)"/>
    <rect x="10.5" y="2" width="3" height="0.9" rx="0.8" fill="url(#stH)" opacity="0.55"/>
    <line x1="12" y1="4" x2="12" y2="5.2" stroke="url(#stF)" strokeWidth="1.2"/>
    <line x1="19.5" y1="5" x2="21.5" y2="3" stroke="url(#stS)" strokeWidth="1.3" strokeLinecap="round"/>
  </V>
)

export const WasteIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="wa">
    <path d="M12 3a9 9 0 1 0 9 9" stroke="url(#waF)" strokeWidth="2.6" strokeLinecap="round" fill="none" filter="url(#waD)"/>
    <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5" stroke="url(#waH)" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.42"/>
    <line x1="17" y1="3" x2="21" y2="3" stroke="url(#waT)" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="21" y1="3" x2="21" y2="7" stroke="url(#waT)" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="#2A2825" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="14.5" y1="9.5" x2="9.5"  y2="14.5" stroke="#2A2825" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="9"   y1="9"   x2="14"   y2="14"   stroke="url(#waS)" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="14"  y1="9"   x2="9"    y2="14"   stroke="url(#waS)" strokeWidth="1.9" strokeLinecap="round"/>
  </V>
)

export const KanbanIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="kb">
    <rect x="3.5" y="3.5" width="5.5" height="18" rx="2" fill="#2A2825" opacity="0.2"/>
    <rect x="11" y="3.5" width="3.5" height="11.5" rx="2" fill="#2A2825" opacity="0.2"/>
    <rect x="16.5" y="3.5" width="5" height="14.5" rx="2" fill="#2A2825" opacity="0.2"/>
    <rect x="3" y="3" width="5.5" height="18" rx="2" fill="url(#kbF)" filter="url(#kbD)"/>
    <rect x="10.5" y="3" width="3.5" height="11" rx="2" fill="url(#kbT)"/>
    <rect x="16" y="3" width="5" height="14" rx="2" fill="url(#kbF)"/>
    <rect x="3" y="3" width="5.5" height="2.2" rx="2" fill="url(#kbH)" opacity="0.58"/>
    <rect x="10.5" y="3" width="3.5" height="2.2" rx="2" fill="url(#kbH)" opacity="0.52"/>
    <rect x="16" y="3" width="5" height="2.2" rx="2" fill="url(#kbH)" opacity="0.58"/>
    <line x1="4.5" y1="7.5" x2="7" y2="7.5" stroke="#8A8680" strokeWidth="0.9"/>
    <line x1="4.5" y1="9.5" x2="7" y2="9.5" stroke="#8A8680" strokeWidth="0.9"/>
    <line x1="11.2" y1="7.5" x2="13.2" y2="7.5" stroke="#8A8680" strokeWidth="0.9"/>
    <line x1="17" y1="7.5" x2="20" y2="7.5" stroke="#8A8680" strokeWidth="0.9"/>
  </V>
)

export const ImprovementIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="im">
    <polyline points="2.5 20.5 7.5 13.5 11.5 16.5 17.5 8.5 22.5 4.5" fill="none" stroke="#2A2825" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <polyline points="2 20 7 13 11 16 17 8 22 4" fill="none" stroke="url(#imF)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" filter="url(#imD)"/>
    <polyline points="2 19.4 7 12.4 11 15.4 17 7.4 22 3.4" fill="none" stroke="url(#imH)" strokeWidth="0.8" strokeLinecap="round" opacity="0.38"/>
    <path d="M19 4h3v3" stroke="url(#imG)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {[{x:7,y:13},{x:11,y:16},{x:17,y:8},{x:22,y:4}].map((c,i)=>(
      <circle key={i} cx={c.x} cy={c.y} r="1.6" fill="url(#imF)"/>
    ))}
  </V>
)

export const SimulationIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="si">
    {[{x:5.3,y:12.3},{x:12.3,y:5.3},{x:19.3,y:12.3},{x:12.3,y:19.3}].map((c,i)=>(
      <circle key={i} cx={c.x} cy={c.y} r="3.2" fill="#2A2825" opacity="0.2"/>
    ))}
    <line x1="7.4" y1="10.6" x2="9.6" y2="7.4" stroke="url(#siS)" strokeWidth="1.3"/>
    <line x1="14.4" y1="7.4" x2="16.6" y2="10.6" stroke="url(#siS)" strokeWidth="1.3"/>
    <line x1="16.6" y1="13.4" x2="14.4" y2="16.6" stroke="url(#siS)" strokeWidth="1.3"/>
    <line x1="9.6" y1="16.6" x2="7.4" y2="13.4" stroke="url(#siS)" strokeWidth="1.3"/>
    {[{x:5,y:12},{x:12,y:5},{x:19,y:12},{x:12,y:19}].map((c,i)=>(
      <circle key={i} cx={c.x} cy={c.y} r="3" fill="url(#siF)" filter="url(#siD)"/>
    ))}
    <circle cx="4.3" cy="11.3" r="1.1" fill="url(#siH)" opacity="0.48"/>
    <circle cx="11.3" cy="4.3" r="1.1" fill="url(#siH)" opacity="0.48"/>
  </V>
)

export const LiveFloorIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="lv">
    <circle cx="12.3" cy="12.3" r="3.8" fill="#2A2825" opacity="0.2"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="url(#lvS)" strokeWidth="0.8" strokeDasharray="2.2 1.8" opacity="0.42"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="url(#lvF)" strokeWidth="1" opacity="0.58"/>
    <circle cx="12" cy="12" r="3.3" fill="url(#lvF)" filter="url(#lvD)"/>
    <circle cx="11" cy="11" r="1.3" fill="url(#lvH)" opacity="0.52"/>
    <circle cx="12" cy="12" r="1.1" fill="url(#lvG)"/>
    <line x1="3.5" y1="3.5" x2="5.5" y2="5.5" stroke="url(#lvG)" strokeWidth="1.3" strokeLinecap="round" opacity="0.68"/>
    <line x1="20.5" y1="3.5" x2="18.5" y2="5.5" stroke="url(#lvG)" strokeWidth="1.3" strokeLinecap="round" opacity="0.58"/>
  </V>
)

export const PDCAIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="pc">
    <circle cx="12.3" cy="12.3" r="9.8" fill="#2A2825" opacity="0.16"/>
    <path d="M12 3 A9 9 0 0 1 21 12 L12 12 Z" fill="url(#pcT)"/>
    <path d="M21 12 A9 9 0 0 1 12 21 L12 12 Z" fill="url(#pcF)"/>
    <path d="M12 21 A9 9 0 0 1 3 12 L12 12 Z" fill="url(#pcS)"/>
    <path d="M3 12 A9 9 0 0 1 12 3 L12 12 Z" fill="url(#pcF)" opacity="0.68"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="#585450" strokeWidth="0.7"/>
    <line x1="12" y1="3" x2="12" y2="21" stroke="#585450" strokeWidth="0.7"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="#585450" strokeWidth="0.7"/>
    <circle cx="12" cy="12" r="3.3" fill="url(#pcT)" filter="url(#pcD)"/>
    <circle cx="11.2" cy="11.2" r="1.3" fill="url(#pcH)" opacity="0.52"/>
    <text x="15.2" y="9.8"  fontSize="3.2" fill="#3A3835" fontFamily="Arial" fontWeight="700">P</text>
    <text x="15.2" y="15.8" fontSize="3.2" fill="#3A3835" fontFamily="Arial" fontWeight="700">D</text>
    <text x="8.5"  y="15.8" fontSize="3.2" fill="#3A3835" fontFamily="Arial" fontWeight="700">C</text>
    <text x="8.5"  y="9.8"  fontSize="3.2" fill="#3A3835" fontFamily="Arial" fontWeight="700">A</text>
  </V>
)

export const RoadmapIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="ro">
    <path d="M3.5 17.5l4-10 4 6 3-4 4 8" fill="none" stroke="#2A2825" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="3" y1="17" x2="21" y2="17" stroke="url(#roS)" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M3 17l4-10 4 6 3-4 4 8" fill="none" stroke="url(#roF)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" filter="url(#roD)"/>
    <path d="M3 16.5l4-10 4 6 3-4 4 8" fill="none" stroke="url(#roH)" strokeWidth="0.8" strokeLinecap="round" opacity="0.38"/>
    {["7,4 8.5,7 7,10 5.5,7","11,10 12.5,13 11,16 9.5,13","14,6 15.5,9 14,12 12.5,9","18,14 19.5,17 18,20 16.5,17"].map((pts,i)=>(
      <polygon key={i} points={pts} fill="url(#roT)" stroke="#8A8680" strokeWidth="0.7"/>
    ))}
  </V>
)

export const BranchIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="bn">
    <line x1="12" y1="5" x2="12" y2="9" stroke="url(#bnF)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="12" y1="9" x2="6"  y2="15" stroke="url(#bnS)" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="12" y1="9" x2="18" y2="15" stroke="url(#bnS)" strokeWidth="1.6" strokeLinecap="round"/>
    {[{x:12.3,y:3.3},{x:6.3,y:17.3},{x:18.3,y:17.3}].map((c,i)=>(
      <circle key={i} cx={c.x} cy={c.y} r="2.7" fill="#2A2825" opacity="0.2"/>
    ))}
    <circle cx="12" cy="3"  r="2.65" fill="url(#bnT)" filter="url(#bnD)"/>
    <circle cx="6"  cy="17" r="2.65" fill="url(#bnF)"/>
    <circle cx="18" cy="17" r="2.65" fill="url(#bnF)"/>
    <circle cx="11.2" cy="2.2" r="1.1" fill="url(#bnH)" opacity="0.52"/>
  </V>
)

export const ReportIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="re">
    <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#2A2825" opacity="0.2"/>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill="url(#reT)" filter="url(#reD)"/>
    <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2Z" fill="url(#reF)"/>
    <path d="M14 2v6h6" stroke="url(#reS)" strokeWidth="1" fill="none"/>
    <path d="M6 4h8" stroke="url(#reH)" strokeWidth="0.7" strokeLinecap="round" opacity="0.42"/>
    <rect x="8"  y="10" width="2" height="6.5" rx="0.5" fill="url(#reS)"/>
    <rect x="11" y="8"  width="2" height="8.5" rx="0.5" fill="url(#reF)"/>
    <rect x="14" y="11" width="2" height="5.5" rx="0.5" fill="url(#reS)" opacity="0.8"/>
    <line x1="7" y1="16.8" x2="17" y2="16.8" stroke="#6A6865" strokeWidth="0.8"/>
  </V>
)

export const SmedIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="sm">
    <circle cx="12.3" cy="12.3" r="5.3" fill="#2A2825" opacity="0.2"/>
    {[0,45,90,135,180,225,270,315].map((a,i)=>{
      const r2=a*Math.PI/180, x=12+8.2*Math.cos(r2), y=12+8.2*Math.sin(r2)
      return <ellipse key={i} cx={x} cy={y} rx="1.85" ry="1.35" transform={`rotate(${a} ${x} ${y})`} fill="url(#smF)"/>
    })}
    <circle cx="12" cy="12" r="6.3" fill="url(#smF)" filter="url(#smD)"/>
    <circle cx="12" cy="12" r="3.6" fill="url(#smS)"/>
    <circle cx="12" cy="12" r="2"   fill="#1A1714"/>
    <path d="M9 8a6 6 0 0 1 6 0" stroke="url(#smH)" strokeWidth="1.1" strokeLinecap="round" opacity="0.48"/>
    <line x1="12" y1="12" x2="12"   y2="10.2" stroke="url(#smG)" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="12" y1="12" x2="13.8" y2="13.1" stroke="url(#smT)" strokeWidth="1.1" strokeLinecap="round"/>
  </V>
)

export const SOPIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="so">
    <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#2A2825" opacity="0.2"/>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill="url(#soT)" filter="url(#soD)"/>
    <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2Z" fill="url(#soF)"/>
    <path d="M14 2v6h6" stroke="url(#soS)" strokeWidth="1" fill="none"/>
    <path d="M6 4h8" stroke="url(#soH)" strokeWidth="0.7" strokeLinecap="round" opacity="0.42"/>
    <line x1="8" y1="12"   x2="16" y2="12"   stroke="url(#soS)" strokeWidth="1"/>
    <line x1="8" y1="14.5" x2="16" y2="14.5" stroke="url(#soS)" strokeWidth="1"/>
    <line x1="8" y1="17"   x2="13" y2="17"   stroke="url(#soS)" strokeWidth="1"/>
  </V>
)

export const SupeIcon = (p) => (
  <V size={p.size} style={p.style} className={p.className} id="su">
    <circle cx="12.3" cy="12.3" r="4.8" fill="#2A2825" opacity="0.2"/>
    <circle cx="12" cy="12" r="4.6" fill="url(#suF)" filter="url(#suD)"/>
    <circle cx="10.8" cy="10.8" r="2" fill="url(#suH)" opacity="0.38"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="url(#suS)" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M17.66 6.34l2.12-2.12M4.22 19.78l2.12-2.12" stroke="url(#suS)" strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="url(#suG)"/>
    <circle cx="11.2" cy="11.2" r="0.85" fill="url(#suH)" opacity="0.58"/>
  </V>
)

export const StandardWorkIcon = SOPIcon
