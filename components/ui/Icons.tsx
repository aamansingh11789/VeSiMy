// @ts-nocheck
'use client'
// ── components/ui/Icons.tsx ───────────────────────────────────────────────────
// VeSiMy Icon Library — 3D Greyscale Edition

interface IconProps {
  size?: number; color?: string; stroke?: number
  style?: React.CSSProperties; className?: string
}

function I({ size=18, color='currentColor', stroke=1.75, style, className, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, ...style }} className={className}>{children}</svg>
  )
}

function D({ size=20, style, className, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, ...style }} className={className}>
      <defs>
        <linearGradient id="gf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#D0CEC8"/><stop offset="100%" stopColor="#8A8580"/></linearGradient>
        <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8E5E0"/><stop offset="100%" stopColor="#C4C0B8"/></linearGradient>
        <linearGradient id="ga" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#B8B4AC"/><stop offset="100%" stopColor="#7A7770"/></linearGradient>
      </defs>
      {children}
    </svg>
  )
}

// ── Nav / UI Icons ────────────────────────────────────────────────────────────
export const DashboardIcon = (p: IconProps) => (<I {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/></I>)
export const FolderIcon = (p: IconProps) => (<I {...p}><path d="M3 7a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59L10.83 7H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></I>)
export const SettingsIcon = (p: IconProps) => (<I {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"/></I>)
export const LogOutIcon = (p: IconProps) => (<I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></I>)
export const CrownIcon = (p: IconProps) => (<I {...p}><path d="M3 19h18"/><path d="M3 7l4.5 8L12 5l4.5 10L21 7v12H3V7Z"/></I>)
export const ChevronRightIcon = (p: IconProps) => (<I {...p}><polyline points="9 18 15 12 9 6"/></I>)
export const ChevronDownIcon = (p: IconProps) => (<I {...p}><polyline points="6 9 12 15 18 9"/></I>)
export const ArrowRightIcon = (p: IconProps) => (<I {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></I>)
export const ArrowLeftIcon = (p: IconProps) => (<I {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 18 5 12 11 6"/></I>)
export const PlusIcon = (p: IconProps) => (<I {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>)
export const XIcon = (p: IconProps) => (<I {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>)
export const CheckIcon = (p: IconProps) => (<I {...p}><polyline points="20 6 9 17 4 12"/></I>)
export const EditIcon = (p: IconProps) => (<I {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></I>)
export const TrashIcon = (p: IconProps) => (<I {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></I>)
export const ClockIcon = (p: IconProps) => (<I {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></I>)
export const SearchIcon = (p: IconProps) => (<I {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>)
export const DownloadIcon = (p: IconProps) => (<I {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></I>)
export const ActivityIcon = (p: IconProps) => (<I {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></I>)
export const AlertIcon = (p: IconProps) => (<I {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></I>)
export const InfoIcon = (p: IconProps) => (<I {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></I>)
export const BookIcon = (p: IconProps) => (<I {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z"/></I>)
export const ZapIcon = (p: IconProps) => (<I {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></I>)
export const BarChartIcon = (p: IconProps) => (<I {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></I>)
export const UserIcon = (p: IconProps) => (<I {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></I>)
export const LockIcon = (p: IconProps) => (<I {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></I>)
export const MailIcon = (p: IconProps) => (<I {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><polyline points="22 6 12 13 2 6"/></I>)
export const GridIcon = (p: IconProps) => (<I {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></I>)
export const LayersIcon = (p: IconProps) => (<I {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></I>)
export const RefreshIcon = (p: IconProps) => (<I {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></I>)
export const ExternalLinkIcon = (p: IconProps) => (<I {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></I>)
export const SunIcon = (p: IconProps) => (<I {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></I>)
export const MoonIcon = (p: IconProps) => (<I {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></I>)
export const CreditCardIcon = (p: IconProps) => (<I {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="5" y1="15" x2="9" y2="15"/><line x1="12" y1="15" x2="14" y2="15"/></I>)
export const BuildingIcon = (p: IconProps) => (<I {...p}><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><rect x="9" y="10" width="2" height="2"/><rect x="9" y="15" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/></I>)
export const SparkleIcon = (p: IconProps) => (<I {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="M5 5l.75 2.25L8 8l-2.25.75L5 11l-.75-2.25L2 8l2.25-.75L5 5Z" strokeWidth={1.5}/></I>)
export const InfinityIcon = (p: IconProps) => (<I {...p}><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4Zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4Z"/></I>)
export const DragHandleIcon = (p: IconProps) => (<I {...p}><circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/></I>)
export const PDFIcon = (p: IconProps) => (<I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8v-3Z" strokeWidth={1.5}/><path d="M13 13h1.5a1.5 1.5 0 0 1 0 3H13v-3Z" strokeWidth={1.5}/><line x1="16.5" y1="13" x2="16.5" y2="16" strokeWidth={1.5}/><line x1="16" y1="14.5" x2="17" y2="14.5" strokeWidth={1.5}/></I>)
export const StepIcon = (p: IconProps) => (<I {...p}><rect x="2" y="7" width="14" height="10" rx="2"/><path d="M16 10l5 2-5 2"/><line x1="6" y1="11" x2="10" y2="11"/><line x1="6" y1="14" x2="9" y2="14"/></I>)
export const TaktIcon = (p: IconProps) => (<I {...p}><line x1="12" y1="20" x2="12" y2="4"/><path d="M7 9l5-5 5 5"/><path d="M9 20h6"/><circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="12" x2="14.5" y2="10.5"/></I>)
export const WIPIcon = (p: IconProps) => (<I {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></I>)
export const OperatorIcon = (p: IconProps) => (<I {...p}><circle cx="12" cy="6" r="3"/><path d="M9 20v-5l-3-3 1.5-6h9L18 12l-3 3v5"/><line x1="9" y1="20" x2="15" y2="20"/></I>)
export const DefectIcon = (p: IconProps) => (<I {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/><line x1="10" y1="10" x2="14" y2="14"/><line x1="14" y1="10" x2="10" y2="14"/></I>)
export const PCEIcon = (p: IconProps) => (<I {...p}><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 12a9 9 0 0 0 5.1 8.1"/><path d="M12 7v5l3 3"/><circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none"/></I>)
export const SupermarketIcon = (p: IconProps) => (<I {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="10" x2="9" y2="20"/><line x1="15" y1="10" x2="15" y2="20"/></I>)
export const SupeIcon = (p: IconProps) => (<I {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M17.66 6.34l2.12-2.12M4.22 19.78l2.12-2.12"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></I>)

// ── 3D Greyscale CI Tool Icons ────────────────────────────────────────────────

export const VSMIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <rect x="2.5" y="10.5" width="5.5" height="6" rx="1" fill="#4A4845"/>
    <rect x="10" y="10.5" width="5" height="6" rx="1" fill="#4A4845"/>
    <rect x="17.5" y="10.5" width="5" height="6" rx="1" fill="#4A4845"/>
    <rect x="2" y="9" width="5.5" height="6" rx="1" fill="url(#gf)"/>
    <rect x="9.5" y="9" width="5" height="6" rx="1" fill="url(#gf)"/>
    <rect x="17" y="9" width="5" height="6" rx="1" fill="url(#gf)"/>
    <rect x="2" y="9" width="5.5" height="1.5" rx="1" fill="#E0DDD7" opacity="0.7"/>
    <rect x="9.5" y="9" width="5" height="1.5" rx="1" fill="#E0DDD7" opacity="0.7"/>
    <rect x="17" y="9" width="5" height="1.5" rx="1" fill="#E0DDD7" opacity="0.7"/>
    <path d="M7.5 12h2M14.5 12h2.5" stroke="#5C5A55" strokeWidth="1.4" strokeLinecap="round"/>
    <polyline points="14.8 10.5 16.8 12 14.8 13.5" stroke="#5C5A55" strokeWidth="1.1" fill="none"/>
    <polyline points="7.2 10.5 9.2 12 7.2 13.5" stroke="#5C5A55" strokeWidth="1.1" fill="none"/>
    <path d="M5 9V6.5M12 9V5.5M19.5 9V6.5" stroke="#9A9690" strokeWidth="1" strokeDasharray="1.2 1.2" strokeLinecap="round"/>
  </D>
)

export const KaizenIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <path d="M12.5 2.5L9 10H3L8 14.5l-2 8 6-4 6 4-2-8 5-4.5h-5.5L12.5 2.5Z" fill="#3A3835" opacity="0.25"/>
    <path d="M12 2L8.5 9.5H3L8 14l-2 8 6-4 6 4-2-8 5-4.5h-5.5L12 2Z" fill="url(#gf)"/>
    <path d="M12 2L10 7h-2l3 2.5L12 2Z" fill="#E0DDD7" opacity="0.55"/>
    <path d="M12 8.5l1.5 3.5h3.5l-3 2 1 3.5-3-2-3 2 1-3.5-3-2h3.5L12 8.5Z" fill="#6A6865" opacity="0.35"/>
  </D>
)

export const FishboneIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <line x1="3" y1="12.5" x2="21" y2="12.5" stroke="#3A3835" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="#7A7770" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="19 10 21.5 12 19 14" fill="#6A6865"/>
    <polygon points="19 10.5 21 12 19 13.5" fill="#C8C4BC"/>
    <line x1="8" y1="12.3" x2="6" y2="7.3" stroke="#3A3835" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    <line x1="12" y1="12.3" x2="10" y2="7.3" stroke="#3A3835" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    <line x1="16" y1="12.3" x2="14" y2="7.3" stroke="#3A3835" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    <line x1="8" y1="12" x2="6" y2="7" stroke="#9A9690" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="12" x2="10" y2="7" stroke="#9A9690" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="12" x2="14" y2="7" stroke="#9A9690" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="6" y2="17" stroke="#9A9690" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="12" x2="10" y2="17" stroke="#9A9690" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="12" x2="14" y2="17" stroke="#9A9690" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="11.5" x2="18" y2="11.5" stroke="#D0CCC4" strokeWidth="0.7" strokeLinecap="round" opacity="0.5"/>
  </D>
)

export const FiveWhyIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <circle cx="12" cy="6.5" r="4.5" fill="#3A3835" opacity="0.15"/>
    <circle cx="12" cy="6" r="4" fill="url(#gt)"/>
    <circle cx="12" cy="6" r="2.5" fill="none" stroke="#7A7770" strokeWidth="1.6"/>
    <path d="M10 4.5a2.5 2.5 0 0 1 2.5-1" stroke="#E0DDD7" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="12" y1="10.5" x2="10" y2="13" stroke="#8A8680" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10" y1="13" x2="8.5" y2="15.5" stroke="#7A7670" strokeWidth="1.2" strokeLinecap="round" opacity="0.75"/>
    <line x1="8.5" y1="15.5" x2="7" y2="18" stroke="#6A6660" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
    <circle cx="12" cy="10.5" r="1" fill="#8A8680"/>
    <circle cx="10" cy="13" r="0.9" fill="#7A7670" opacity="0.85"/>
    <circle cx="8.5" cy="15.5" r="0.8" fill="#6A6660" opacity="0.7"/>
    <circle cx="7" cy="18" r="0.7" fill="#5A5650" opacity="0.55"/>
  </D>
)

export const StopwatchIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <circle cx="12.3" cy="13.3" r="8.5" fill="#3A3835" opacity="0.18"/>
    <circle cx="12" cy="13" r="8" fill="url(#gf)"/>
    <circle cx="12" cy="13" r="6.5" fill="#D8D4CC"/>
    <circle cx="12" cy="13" r="6.5" fill="url(#gt)" opacity="0.6"/>
    <path d="M8 8.5a8 8 0 0 1 8 0" stroke="#E8E5DF" strokeWidth="1.5" strokeLinecap="round" opacity="0.65"/>
    <line x1="12" y1="13" x2="12" y2="9.5" stroke="#3A3835" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="12" y1="13" x2="14.5" y2="15" stroke="#3A3835" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="12" cy="13" r="0.9" fill="#3A3835"/>
    <rect x="10.5" y="2" width="3" height="1.8" rx="0.5" fill="#8A8680"/>
    <rect x="10.5" y="2" width="3" height="0.8" rx="0.5" fill="#C8C4BC"/>
    <line x1="12" y1="3.8" x2="12" y2="5" stroke="#8A8680" strokeWidth="1.2"/>
    <line x1="19" y1="5" x2="21" y2="3" stroke="#9A9690" strokeWidth="1.3" strokeLinecap="round"/>
  </D>
)

export const WasteIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <path d="M12 3a9 9 0 1 0 9 9" stroke="#7A7770" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5" stroke="#C0BCB4" strokeWidth="1" strokeLinecap="round" fill="none"/>
    <line x1="17" y1="3" x2="21" y2="3" stroke="#8A8680" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="21" y1="3" x2="21" y2="7" stroke="#8A8680" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="#3A3835" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" stroke="#3A3835" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="14" y2="14" stroke="#B0ACA4" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="14" y1="9" x2="9" y2="14" stroke="#B0ACA4" strokeWidth="1.6" strokeLinecap="round"/>
  </D>
)

export const KanbanIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <rect x="3.5" y="3.5" width="5.5" height="18" rx="1.5" fill="#3A3835" opacity="0.18"/>
    <rect x="11" y="3.5" width="3.5" height="11.5" rx="1.5" fill="#3A3835" opacity="0.18"/>
    <rect x="16.5" y="3.5" width="5" height="14.5" rx="1.5" fill="#3A3835" opacity="0.18"/>
    <rect x="3" y="3" width="5.5" height="18" rx="1.5" fill="url(#gf)"/>
    <rect x="10.5" y="3" width="3.5" height="11" rx="1.5" fill="url(#gf)"/>
    <rect x="16" y="3" width="5" height="14" rx="1.5" fill="url(#gf)"/>
    <rect x="3" y="3" width="5.5" height="2" rx="1.5" fill="#E0DDD7" opacity="0.65"/>
    <rect x="10.5" y="3" width="3.5" height="2" rx="1.5" fill="#E0DDD7" opacity="0.65"/>
    <rect x="16" y="3" width="5" height="2" rx="1.5" fill="#E0DDD7" opacity="0.65"/>
    <line x1="4.5" y1="7" x2="7" y2="7" stroke="#9A9690" strokeWidth="0.8"/>
    <line x1="4.5" y1="9" x2="7" y2="9" stroke="#9A9690" strokeWidth="0.8"/>
    <line x1="11.2" y1="7" x2="13.2" y2="7" stroke="#9A9690" strokeWidth="0.8"/>
    <line x1="17" y1="7" x2="20" y2="7" stroke="#9A9690" strokeWidth="0.8"/>
  </D>
)

export const ImprovementIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <polyline points="2.5 20.5 7.5 13.5 11.5 16.5 17.5 8.5 22.5 4.5" fill="none" stroke="#3A3835" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.18"/>
    <polyline points="2 20 7 13 11 16 17 8 22 4" fill="none" stroke="url(#ga)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="2 19.5 7 12.5 11 15.5 17 7.5 22 3.5" fill="none" stroke="#D8D4CC" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <path d="M19 4h3v3" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="7" cy="13" r="1.5" fill="#B0ACA4"/>
    <circle cx="11" cy="16" r="1.5" fill="#B0ACA4"/>
    <circle cx="17" cy="8" r="1.5" fill="#B0ACA4"/>
    <circle cx="22" cy="4" r="1.5" fill="#9A9690"/>
  </D>
)

export const SimulationIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <circle cx="5.3" cy="12.3" r="3" fill="#3A3835" opacity="0.18"/>
    <circle cx="12.3" cy="5.3" r="3" fill="#3A3835" opacity="0.18"/>
    <circle cx="19.3" cy="12.3" r="3" fill="#3A3835" opacity="0.18"/>
    <circle cx="12.3" cy="19.3" r="3" fill="#3A3835" opacity="0.18"/>
    <line x1="7.4" y1="10.6" x2="9.6" y2="7.4" stroke="#8A8680" strokeWidth="1.2"/>
    <line x1="14.4" y1="7.4" x2="16.6" y2="10.6" stroke="#8A8680" strokeWidth="1.2"/>
    <line x1="16.6" y1="13.4" x2="14.4" y2="16.6" stroke="#8A8680" strokeWidth="1.2"/>
    <line x1="9.6" y1="16.6" x2="7.4" y2="13.4" stroke="#8A8680" strokeWidth="1.2"/>
    <circle cx="5" cy="12" r="3" fill="url(#gf)"/>
    <circle cx="12" cy="5" r="3" fill="url(#gf)"/>
    <circle cx="19" cy="12" r="3" fill="url(#gf)"/>
    <circle cx="12" cy="19" r="3" fill="url(#gf)"/>
    <circle cx="4.2" cy="11.2" r="1" fill="#E0DDD7" opacity="0.5"/>
    <circle cx="11.2" cy="4.2" r="1" fill="#E0DDD7" opacity="0.5"/>
  </D>
)

export const LiveFloorIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <circle cx="12.3" cy="12.3" r="3.5" fill="#3A3835" opacity="0.18"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="#6A6865" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="#8A8680" strokeWidth="1" opacity="0.55"/>
    <circle cx="12" cy="12" r="3.2" fill="url(#gf)"/>
    <circle cx="11" cy="11" r="1.2" fill="#E0DDD7" opacity="0.55"/>
    <circle cx="12" cy="12" r="1" fill="#5A5855"/>
    <path d="M3.5 3.5L5.5 5.5" stroke="#9A9690" strokeWidth="1.2" strokeLinecap="round" opacity="0.65"/>
    <path d="M20.5 3.5L18.5 5.5" stroke="#9A9690" strokeWidth="1.2" strokeLinecap="round" opacity="0.65"/>
  </D>
)

export const PDCAIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <path d="M12 3 A9 9 0 0 1 21 12 L12 12 Z" fill="#D0CCC4"/>
    <path d="M21 12 A9 9 0 0 1 12 21 L12 12 Z" fill="#C0BCB4"/>
    <path d="M12 21 A9 9 0 0 1 3 12 L12 12 Z" fill="#B4B0A8"/>
    <path d="M3 12 A9 9 0 0 1 12 3 L12 12 Z" fill="#A8A49C"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="#6A6865" strokeWidth="1"/>
    <line x1="12" y1="3" x2="12" y2="21" stroke="#6A6865" strokeWidth="0.8"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="#6A6865" strokeWidth="0.8"/>
    <circle cx="12" cy="12" r="3" fill="url(#gt)"/>
    <circle cx="11.2" cy="11.2" r="1.2" fill="#E8E5DF" opacity="0.55"/>
    <text x="15" y="9.5" fontSize="3" fill="#5A5855" fontFamily="monospace" fontWeight="700">P</text>
    <text x="15" y="15.5" fontSize="3" fill="#5A5855" fontFamily="monospace" fontWeight="700">D</text>
    <text x="8.5" y="15.5" fontSize="3" fill="#5A5855" fontFamily="monospace" fontWeight="700">C</text>
    <text x="8.5" y="9.5" fontSize="3" fill="#5A5855" fontFamily="monospace" fontWeight="700">A</text>
  </D>
)

export const RoadmapIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <path d="M3.5 17.5l4-10 4 6 3-4 4 8" fill="none" stroke="#3A3835" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.18"/>
    <line x1="3" y1="17" x2="21" y2="17" stroke="#8A8680" strokeWidth="1.5"/>
    <path d="M3 17l4-10 4 6 3-4 4 8" fill="none" stroke="url(#ga)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="7,4 8.5,7 7,10 5.5,7" fill="url(#gt)" stroke="#8A8680" strokeWidth="0.8"/>
    <polygon points="11,10 12.5,13 11,16 9.5,13" fill="url(#gt)" stroke="#8A8680" strokeWidth="0.8"/>
    <polygon points="14,6 15.5,9 14,12 12.5,9" fill="url(#gt)" stroke="#8A8680" strokeWidth="0.8"/>
    <polygon points="18,14 19.5,17 18,20 16.5,17" fill="url(#gt)" stroke="#8A8680" strokeWidth="0.8"/>
  </D>
)

export const BranchIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <line x1="12" y1="5" x2="12" y2="9" stroke="#8A8680" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="12" y1="9" x2="6" y2="15" stroke="#8A8680" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="12" y1="9" x2="18" y2="15" stroke="#8A8680" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="12.3" cy="3.3" r="2.5" fill="#3A3835" opacity="0.15"/>
    <circle cx="6.3" cy="17.3" r="2.5" fill="#3A3835" opacity="0.15"/>
    <circle cx="18.3" cy="17.3" r="2.5" fill="#3A3835" opacity="0.15"/>
    <circle cx="12" cy="3" r="2.5" fill="url(#gt)" stroke="#8A8680" strokeWidth="0.8"/>
    <circle cx="6" cy="17" r="2.5" fill="url(#gf)" stroke="#8A8680" strokeWidth="0.8"/>
    <circle cx="18" cy="17" r="2.5" fill="url(#gf)" stroke="#8A8680" strokeWidth="0.8"/>
    <circle cx="11.2" cy="2.2" r="1" fill="#E8E5DF" opacity="0.55"/>
  </D>
)

export const ReportIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#3A3835" opacity="0.18"/>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill="url(#gt)"/>
    <polyline points="14 2 14 8 20 8" fill="none" stroke="#7A7770" strokeWidth="1.2"/>
    <rect x="8" y="10" width="2" height="6" rx="0.5" fill="#8A8680"/>
    <rect x="11" y="8" width="2" height="8" rx="0.5" fill="#7A7770"/>
    <rect x="14" y="11" width="2" height="5" rx="0.5" fill="#9A9690"/>
    <line x1="7" y1="16.5" x2="17" y2="16.5" stroke="#6A6865" strokeWidth="0.8"/>
    <line x1="6" y1="4" x2="6" y2="20" stroke="#E0DDD7" strokeWidth="0.8" opacity="0.55"/>
  </D>
)

export const SmedIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <circle cx="12.3" cy="12.3" r="5" fill="#3A3835" opacity="0.18"/>
    {[0,45,90,135,180,225,270,315].map((angle, i) => {
      const r = angle * Math.PI / 180
      const x = 12 + 8 * Math.cos(r)
      const y = 12 + 8 * Math.sin(r)
      return <circle key={i} cx={x} cy={y} r="1.6" fill="#B8B4AC"/>
    })}
    <circle cx="12" cy="12" r="6" fill="url(#gf)"/>
    <circle cx="12" cy="12" r="3" fill="#C8C4BC" stroke="#8A8680" strokeWidth="0.8"/>
    <circle cx="12" cy="12" r="1.5" fill="#4A4845"/>
    <path d="M9 8a6 6 0 0 1 6 0" stroke="#E0DDD7" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
  </D>
)

export const SOPIcon = (p: IconProps) => (
  <D size={p.size} style={p.style} className={p.className}>
    <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#3A3835" opacity="0.18"/>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill="url(#gt)"/>
    <polyline points="14 2 14 8 20 8" fill="none" stroke="#7A7770" strokeWidth="1.2"/>
    <line x1="8" y1="11" x2="16" y2="11" stroke="#8A8680" strokeWidth="0.9"/>
    <line x1="8" y1="13.5" x2="16" y2="13.5" stroke="#8A8680" strokeWidth="0.9"/>
    <line x1="8" y1="16" x2="13" y2="16" stroke="#8A8680" strokeWidth="0.9"/>
    <line x1="6" y1="4" x2="6" y2="20" stroke="#E0DDD7" strokeWidth="0.8" opacity="0.55"/>
  </D>
)
