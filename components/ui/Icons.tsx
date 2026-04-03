// @ts-nocheck
'use client'
// ── components/ui/Icons.tsx ─────────────────────────────────────────────────
// VeSiMy Icon System — Professional 3D Greyscale
// Every icon uses a unique gradient-ID counter to prevent SVG conflicts.
// UI icons: clean 1.6px stroke-based. CI icons: 3D volume with shadow/highlight.

interface P { size?:number; color?:string; style?:React.CSSProperties; className?:string; stroke?:number }

// ── Stroke icon (UI/nav) ──────────────────────────────────────────────────────
const L = ({ size=18, color='currentColor', stroke=1.65, style, className, children }:any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink:0, display:'block', ...style }} className={className}>
    {children}
  </svg>
)

// ── Volumetric 3D icon wrapper with unique gradient IDs per instance ──────────
let _uid = 0
const V = ({ size=20, style, className, children }:any) => {
  const u = `g${++_uid}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ flexShrink:0, display:'block', ...style }} className={className}>
      <defs>
        <linearGradient id={`${u}a`} x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E4E1DB"/><stop offset="100%" stopColor="#8A8680"/>
        </linearGradient>
        <linearGradient id={`${u}b`} x1="3" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0EDE8"/><stop offset="100%" stopColor="#C4C0B8"/>
        </linearGradient>
        <linearGradient id={`${u}c`} x1="12" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6A6760"/><stop offset="100%" stopColor="#3A3835"/>
        </linearGradient>
        <filter id={`${u}s`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0.6" dy="0.8" stdDeviation="0.6" floodColor="#1C1B18" floodOpacity="0.18"/>
        </filter>
      </defs>
      {children({ a:`url(#${u}a)`, b:`url(#${u}b)`, c:`url(#${u}c)`, s:`url(#${u}s)` })}
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// UI / NAV ICONS — clean stroke
// ══════════════════════════════════════════════════════════════════════════════

import type React from 'react'
export const DashboardIcon    = (p:P) => <L {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/></L>
export const FolderIcon       = (p:P) => <L {...p}><path d="M3 7a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59L10.83 7H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></L>
export const SettingsIcon     = (p:P) => <L {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></L>
export const LogOutIcon       = (p:P) => <L {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></L>
export const CrownIcon        = (p:P) => <L {...p}><path d="M3 19h18"/><path d="M3 7l4.5 8L12 5l4.5 10L21 7v12H3V7Z"/></L>
export const ChevronRightIcon = (p:P) => <L {...p}><polyline points="9 18 15 12 9 6"/></L>
export const ChevronDownIcon  = (p:P) => <L {...p}><polyline points="6 9 12 15 18 9"/></L>
export const ArrowRightIcon   = (p:P) => <L {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></L>
export const ArrowLeftIcon    = (p:P) => <L {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 18 5 12 11 6"/></L>
export const PlusIcon         = (p:P) => <L {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></L>
export const XIcon            = (p:P) => <L {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></L>
export const CheckIcon        = (p:P) => <L {...p}><polyline points="20 6 9 17 4 12"/></L>
export const EditIcon         = (p:P) => <L {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></L>
export const TrashIcon        = (p:P) => <L {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></L>
export const ClockIcon        = (p:P) => <L {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></L>
export const SearchIcon       = (p:P) => <L {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></L>
export const DownloadIcon     = (p:P) => <L {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></L>
export const ActivityIcon     = (p:P) => <L {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></L>
export const AlertIcon        = (p:P) => <L {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></L>
export const InfoIcon         = (p:P) => <L {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></L>
export const BookIcon         = (p:P) => <L {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z"/></L>
export const ZapIcon          = (p:P) => <L {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></L>
export const BarChartIcon     = (p:P) => <L {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></L>
export const UserIcon         = (p:P) => <L {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></L>
export const LockIcon         = (p:P) => <L {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></L>
export const MailIcon         = (p:P) => <L {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><polyline points="22 6 12 13 2 6"/></L>
export const GridIcon         = (p:P) => <L {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></L>
export const LayersIcon       = (p:P) => <L {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></L>
export const RefreshIcon      = (p:P) => <L {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></L>
export const ExternalLinkIcon = (p:P) => <L {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></L>
export const SunIcon          = (p:P) => <L {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></L>
export const MoonIcon         = (p:P) => <L {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></L>
export const CreditCardIcon   = (p:P) => <L {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="5" y1="15" x2="9" y2="15"/><line x1="12" y1="15" x2="14" y2="15"/></L>
export const BuildingIcon     = (p:P) => <L {...p}><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><rect x="9" y="10" width="2" height="2"/><rect x="9" y="15" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/></L>
export const SparkleIcon      = (p:P) => <L {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="M5 5l.75 2.25L8 8l-2.25.75L5 11l-.75-2.25L2 8l2.25-.75L5 5Z" strokeWidth={1.4}/></L>
export const InfinityIcon     = (p:P) => <L {...p}><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4Zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4Z"/></L>
export const DragHandleIcon   = (p:P) => <L {...p}><circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/></L>
export const PDFIcon          = (p:P) => <L {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></L>
export const StepIcon         = (p:P) => <L {...p}><rect x="2" y="7" width="14" height="10" rx="2"/><path d="M16 10l5 2-5 2"/><line x1="6" y1="11" x2="10" y2="11"/><line x1="6" y1="14" x2="9" y2="14"/></L>
export const TaktIcon         = (p:P) => <L {...p}><line x1="12" y1="20" x2="12" y2="4"/><path d="M7 9l5-5 5 5"/><path d="M9 20h6"/></L>
export const WIPIcon          = (p:P) => <L {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></L>
export const OperatorIcon     = (p:P) => <L {...p}><circle cx="12" cy="6" r="3"/><path d="M9 20v-5l-3-3 1.5-6h9L18 12l-3 3v5"/></L>
export const DefectIcon       = (p:P) => <L {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/><line x1="10" y1="10" x2="14" y2="14"/><line x1="14" y1="10" x2="10" y2="14"/></L>
export const PCEIcon          = (p:P) => <L {...p}><path d="M3 12a9 9 0 1 0 9-9"/><path d="M12 7v5l3 3"/></L>
export const SupermarketIcon  = (p:P) => <L {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="10" x2="9" y2="20"/><line x1="15" y1="10" x2="15" y2="20"/></L>

// ══════════════════════════════════════════════════════════════════════════════
// CI TOOL ICONS — volumetric 3D greyscale
// Shapes are abstract/geometric — NOT literal representations of the tool name.
// ══════════════════════════════════════════════════════════════════════════════

// VSM — three connected data blocks (process flow abstraction)
export const VSMIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <rect x="2.5" y="9.5" width="5" height="5.5" rx="1.2" fill="#1C1B18" opacity="0.2"/>
      <rect x="9.5" y="9.5" width="5" height="5.5" rx="1.2" fill="#1C1B18" opacity="0.2"/>
      <rect x="16.5" y="9.5" width="5" height="5.5" rx="1.2" fill="#1C1B18" opacity="0.2"/>
      <rect x="2" y="9" width="5" height="5.5" rx="1.2" fill={a} filter={s}/>
      <rect x="9" y="9" width="5" height="5.5" rx="1.2" fill={b}/>
      <rect x="16" y="9" width="5" height="5.5" rx="1.2" fill={a}/>
      <rect x="2" y="9" width="5" height="1.6" rx="1.2" fill="#F0EDE8" opacity="0.5"/>
      <rect x="9" y="9" width="5" height="1.6" rx="1.2" fill="#F0EDE8" opacity="0.45"/>
      <rect x="16" y="9" width="5" height="1.6" rx="1.2" fill="#F0EDE8" opacity="0.5"/>
      <path d="M7 11.8h2M14 11.8h2" stroke="#5A5855" strokeWidth="1.4" strokeLinecap="round"/>
      <polyline points="14.8 10.5 16.4 11.8 14.8 13.1" stroke="#5A5855" strokeWidth="1.1" fill="none"/>
      <polyline points="7.1 10.5 8.7 11.8 7.1 13.1" stroke="#5A5855" strokeWidth="1.1" fill="none"/>
      <path d="M4.5 9V6.5M11.5 9V5.5M18.5 9V6.5" stroke="#8A8680" strokeWidth="0.9" strokeDasharray="1.2 1.1" strokeLinecap="round"/>
    </>)}
  </V>
)

// Time Study — precision stopwatch face (abstract circular with hands)
export const StopwatchIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <circle cx="12.3" cy="13.3" r="8" fill="#1C1B18" opacity="0.18"/>
      <circle cx="12" cy="13" r="8" fill={a} filter={s}/>
      <circle cx="12" cy="13" r="6.4" fill={b}/>
      <circle cx="12" cy="13" r="6.4" fill="none" stroke="#9A9690" strokeWidth="0.5" opacity="0.35"/>
      <path d="M8.5 8.5a8 8 0 0 1 7 0" stroke="#F0EDE8" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <line x1="12" y1="13" x2="12" y2="9.8" stroke="#1C1B18" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="12" y1="13" x2="14.4" y2="15" stroke="#1C1B18" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="12" cy="13" r="1" fill="#1C1B18"/>
      <rect x="10.6" y="2.3" width="2.8" height="1.7" rx="0.5" fill="#7A7870"/>
      <rect x="10.6" y="2.3" width="2.8" height="0.9" rx="0.5" fill="#C8C4BC"/>
      <line x1="12" y1="4" x2="12" y2="4.9" stroke="#7A7870" strokeWidth="1.2"/>
    </>)}
  </V>
)

// Kaizen — upward momentum: stacked ascending blocks (continuous improvement abstraction)
export const KaizenIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,c,s}:any) => (<>
      <rect x="3.5" y="15.5" width="5" height="6" rx="1.2" fill="#1C1B18" opacity="0.18"/>
      <rect x="9.5" y="11.5" width="5" height="10" rx="1.2" fill="#1C1B18" opacity="0.18"/>
      <rect x="15.5" y="7.5" width="5" height="14" rx="1.2" fill="#1C1B18" opacity="0.18"/>
      <rect x="3" y="15" width="5" height="6" rx="1.2" fill={c} filter={s}/>
      <rect x="9" y="11" width="5" height="10" rx="1.2" fill={a} filter={s}/>
      <rect x="15" y="7" width="5" height="14" rx="1.2" fill={b} filter={s}/>
      <rect x="3" y="15" width="5" height="1.8" rx="1.2" fill="#E0DDD7" opacity="0.4"/>
      <rect x="9" y="11" width="5" height="1.8" rx="1.2" fill="#F0EDE8" opacity="0.45"/>
      <rect x="15" y="7" width="5" height="1.8" rx="1.2" fill="#F0EDE8" opacity="0.55"/>
      <polyline points="4 8 9 6 15 4" stroke="#8A8680" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <polyline points="13 3 15 4 14 6" stroke="#8A8680" strokeWidth="1" strokeLinecap="round" fill="none"/>
    </>)}
  </V>
)

// Fishbone / Root Cause — branching tree structure (abstract cause-effect)
export const FishboneIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,c,s}:any) => (<>
      <line x1="3" y1="12.5" x2="20.5" y2="12.5" stroke="#1C1B18" strokeWidth="2.4" strokeLinecap="round" opacity="0.2"/>
      <line x1="3" y1="12" x2="20.5" y2="12" stroke="#6A6760" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="3" y1="11.5" x2="19" y2="11.5" stroke="#D8D4CC" strokeWidth="0.7" strokeLinecap="round" opacity="0.4"/>
      <polygon points="19.5 10 21.5 12 19.5 14" fill="#6A6760"/>
      <polygon points="20 10.4 21.4 12 20 13.6" fill="#C8C4BC"/>
      <line x1="7" y1="12" x2="5.5" y2="7.5" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11.5" y1="12" x2="10" y2="7.5" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15.5" y1="12" x2="14" y2="7.5" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="12" x2="5.5" y2="16.5" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11.5" y1="12" x2="10" y2="16.5" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15.5" y1="12" x2="14" y2="16.5" stroke="#8A8680" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="12" r="1.2" fill={a}/>
      <circle cx="11.5" cy="12" r="1.2" fill={a}/>
      <circle cx="15.5" cy="12" r="1.2" fill={a}/>
    </>)}
  </V>
)

// 5 Why — descending depth chain (drilling down abstraction)
export const FiveWhyIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <circle cx="12.3" cy="5.8" r="4.5" fill="#1C1B18" opacity="0.18"/>
      <circle cx="12" cy="5.5" r="4.5" fill={b} filter={s}/>
      <circle cx="12" cy="5.5" r="3" fill="none" stroke="#7A7870" strokeWidth="1.5"/>
      <path d="M10.2 4a2.4 2.4 0 0 1 2.4-1" stroke="#E8E5E0" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
      <line x1="12" y1="10.2" x2="10.5" y2="12.8" stroke="#8A8680" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="10.5" y1="12.8" x2="9.2" y2="15.3" stroke="#6A6760" strokeWidth="1.1" strokeLinecap="round" opacity="0.8"/>
      <line x1="9.2" y1="15.3" x2="7.8" y2="17.8" stroke="#4A4845" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
      <circle cx="12" cy="10.2" r="1.1" fill={a}/>
      <circle cx="10.5" cy="12.8" r="0.95" fill="#8A8680" opacity="0.85"/>
      <circle cx="9.2" cy="15.3" r="0.8" fill="#6A6760" opacity="0.7"/>
      <circle cx="7.8" cy="17.8" r="0.65" fill="#4A4845" opacity="0.55"/>
      <rect x="14" y="17" width="5" height="4" rx="1" fill={a} opacity="0.6" filter={s}/>
      <line x1="15" y1="19" x2="18" y2="19" stroke="#5A5855" strokeWidth="0.8"/>
    </>)}
  </V>
)

// Waste ID — blocked path with elimination mark (waste removal abstraction)
export const WasteIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,c,s}:any) => (<>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" fill="#1C1B18" opacity="0.18"/>
      <rect x="2" y="5" width="19" height="13" rx="2" fill={a} filter={s}/>
      <rect x="2" y="5" width="19" height="3" rx="2" fill="#F0EDE8" opacity="0.45"/>
      <line x1="2" y1="8" x2="21" y2="8" stroke="#C4C0B8" strokeWidth="0.6" opacity="0.5"/>
      <line x1="9.5" y1="9.5" x2="13.5" y2="13.5" stroke="#1C1B18" strokeWidth="2.2" strokeLinecap="round" opacity="0.2"/>
      <line x1="13.5" y1="9.5" x2="9.5" y2="13.5" stroke="#1C1B18" strokeWidth="2.2" strokeLinecap="round" opacity="0.2"/>
      <line x1="9.2" y1="9.2" x2="13.2" y2="13.2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="13.2" y1="9.2" x2="9.2" y2="13.2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="3.5" y="9.5" width="4" height="4" rx="0.8" fill="#C4C0B8" opacity="0.3"/>
      <rect x="16.5" y="9.5" width="4" height="4" rx="0.8" fill="#C4C0B8" opacity="0.3"/>
    </>)}
  </V>
)

// Kaizen events — already defined above as KaizenIcon

// Yamazumi / Standard Work — operator balance bars
export const KanbanIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,c,s}:any) => (<>
      <rect x="3.5" y="3.5" width="5" height="18" rx="1.8" fill="#1C1B18" opacity="0.18"/>
      <rect x="10.5" y="3.5" width="3.5" height="12" rx="1.8" fill="#1C1B18" opacity="0.18"/>
      <rect x="16.5" y="3.5" width="5" height="14.5" rx="1.8" fill="#1C1B18" opacity="0.18"/>
      <rect x="3" y="3" width="5" height="18" rx="1.8" fill={c} filter={s}/>
      <rect x="10" y="3" width="3.5" height="11.5" rx="1.8" fill={a} filter={s}/>
      <rect x="16" y="3" width="5" height="14" rx="1.8" fill={b} filter={s}/>
      <rect x="3" y="3" width="5" height="2.2" rx="1.8" fill="#D8D4CC" opacity="0.4"/>
      <rect x="10" y="3" width="3.5" height="2.2" rx="1.8" fill="#F0EDE8" opacity="0.45"/>
      <rect x="16" y="3" width="5" height="2.2" rx="1.8" fill="#F0EDE8" opacity="0.52"/>
    </>)}
  </V>
)

// Improvement / Gap Analysis — ascending trend with target
export const ImprovementIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,c,s}:any) => (<>
      <polyline points="2.5 20.5 7.5 13.5 11.5 16.5 17.5 8.5 22.5 4.5" fill="none" stroke="#1C1B18" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.18"/>
      <polyline points="2 20 7 13 11 16 17 8 22 4" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="2 19.5 7 12.5 11 15.5 17 7.5 22 3.5" fill="none" stroke="#E8E5E0" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.38"/>
      <path d="M19.5 4h2.5v2.5" stroke="#7A7870" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="7" cy="13" r="1.6" fill={a}/>
      <circle cx="11" cy="16" r="1.6" fill={a}/>
      <circle cx="17" cy="8" r="1.6" fill={a}/>
      <circle cx="22" cy="4" r="1.6" fill="#8A8680"/>
    </>)}
  </V>
)

// Simulation — network of connected nodes
export const SimulationIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      {([[5.3,12.3],[12.3,5.3],[19.3,12.3],[12.3,19.3]] as any[]).map(([x,y]:any,i:number) =>
        <circle key={i} cx={x} cy={y} r="3.1" fill="#1C1B18" opacity="0.18"/>
      )}
      <line x1="7.4" y1="10.5" x2="9.8" y2="7.4" stroke="#7A7870" strokeWidth="1.2"/>
      <line x1="14.2" y1="7.4" x2="16.6" y2="10.5" stroke="#7A7870" strokeWidth="1.2"/>
      <line x1="16.6" y1="13.5" x2="14.2" y2="16.6" stroke="#7A7870" strokeWidth="1.2"/>
      <line x1="9.8" y1="16.6" x2="7.4" y2="13.5" stroke="#7A7870" strokeWidth="1.2"/>
      {([[5,12],[12,5],[19,12],[12,19]] as any[]).map(([x,y]:any,i:number) =>
        <circle key={i} cx={x} cy={y} r="3" fill={a} filter={s}/>
      )}
      <circle cx="4.2" cy="11.2" r="1.1" fill="#F0EDE8" opacity="0.45"/>
      <circle cx="11.2" cy="4.2" r="1.1" fill="#F0EDE8" opacity="0.45"/>
      <circle cx="12" cy="12" r="1.4" fill={b}/>
    </>)}
  </V>
)

// Live Floor Monitor — pulsing target rings
export const LiveFloorIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <circle cx="12.3" cy="12.3" r="3.4" fill="#1C1B18" opacity="0.18"/>
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="#5A5855" strokeWidth="0.7" strokeDasharray="2 1.8" opacity="0.35"/>
      <circle cx="12" cy="12" r="6.2" fill="none" stroke="#7A7870" strokeWidth="0.9" opacity="0.45"/>
      <circle cx="12" cy="12" r="3.3" fill={a} filter={s}/>
      <circle cx="10.8" cy="10.8" r="1.2" fill="#F0EDE8" opacity="0.45"/>
      <circle cx="12" cy="12" r="1" fill="#2A2825"/>
      <path d="M3.5 3.5L5.4 5.4" stroke="#8A8680" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
      <path d="M20.5 3.5L18.6 5.4" stroke="#8A8680" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
      <circle cx="12" cy="2.8" r="0.9" fill="#8A8680" opacity="0.38"/>
    </>)}
  </V>
)

// PDCA — four-quadrant disc (Plan/Do/Check/Act cycle)
export const PDCAIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({b,s}:any) => (<>
      <path d="M12 3A9 9 0 0 1 21 12L12 12Z" fill="#D4D0C8"/>
      <path d="M21 12A9 9 0 0 1 12 21L12 12Z" fill="#C4C0B8"/>
      <path d="M12 21A9 9 0 0 1 3 12L12 12Z" fill="#B4B0A8"/>
      <path d="M3 12A9 9 0 0 1 12 3L12 12Z" fill="#A8A49C"/>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#6A6760" strokeWidth="0.9"/>
      <line x1="12" y1="3" x2="12" y2="21" stroke="#6A6760" strokeWidth="0.7"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="#6A6760" strokeWidth="0.7"/>
      <circle cx="12.3" cy="12.3" r="3.2" fill="#1C1B18" opacity="0.18"/>
      <circle cx="12" cy="12" r="3.2" fill={b} filter={s}/>
      <circle cx="11.2" cy="11.2" r="1.2" fill="#F0EDE8" opacity="0.42"/>
      <text x="15.4" y="9.5" fontSize="2.9" fill="#4A4845" fontFamily="system-ui,sans-serif" fontWeight="700">P</text>
      <text x="15.4" y="15.6" fontSize="2.9" fill="#4A4845" fontFamily="system-ui,sans-serif" fontWeight="700">D</text>
      <text x="8.8" y="15.6" fontSize="2.9" fill="#4A4845" fontFamily="system-ui,sans-serif" fontWeight="700">C</text>
      <text x="8.8" y="9.5" fontSize="2.9" fill="#4A4845" fontFamily="system-ui,sans-serif" fontWeight="700">A</text>
    </>)}
  </V>
)

// Roadmap — milestone path
export const RoadmapIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,c,s}:any) => (<>
      <path d="M3.5 17.5l4-10 4 6 3-4 4 8" fill="none" stroke="#1C1B18" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.18"/>
      <line x1="3" y1="17" x2="21" y2="17" stroke="#7A7870" strokeWidth="1.5"/>
      <path d="M3 17l4-10 4 6 3-4 4 8" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 16.5l4-10 4 6 3-4 4 8" fill="none" stroke="#E0DDD7" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.38"/>
      {([[7,4],[11,10],[14,6],[18,14]] as any[]).map(([x,y]:any,i:number) => (
        <polygon key={i} points={`${x},${y-3} ${x+2},${y} ${x},${y+3} ${x-2},${y}`} fill={a} stroke="#7A7870" strokeWidth="0.7"/>
      ))}
    </>)}
  </V>
)

// Branch — split/merge paths
export const BranchIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <line x1="12" y1="5.5" x2="12" y2="9.5" stroke="#7A7870" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="12" y1="9.5" x2="6.5" y2="15.5" stroke="#7A7870" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="12" y1="9.5" x2="17.5" y2="15.5" stroke="#7A7870" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="12.3" cy="3.8" r="2.7" fill="#1C1B18" opacity="0.18"/>
      <circle cx="6.8" cy="17.8" r="2.7" fill="#1C1B18" opacity="0.18"/>
      <circle cx="17.8" cy="17.8" r="2.7" fill="#1C1B18" opacity="0.18"/>
      <circle cx="12" cy="3.5" r="2.7" fill={b} filter={s}/>
      <circle cx="6.5" cy="17.5" r="2.7" fill={a} filter={s}/>
      <circle cx="17.5" cy="17.5" r="2.7" fill={a} filter={s}/>
      <circle cx="11.2" cy="2.7" r="1" fill="#F0EDE8" opacity="0.42"/>
    </>)}
  </V>
)

// Report / A3 — document with data visualisation inside
export const ReportIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({b,s}:any) => (<>
      <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#1C1B18" opacity="0.18"/>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill={b} filter={s}/>
      <polyline points="14 2 14 8 20 8" fill="none" stroke="#7A7870" strokeWidth="1.1"/>
      <rect x="7.5" y="10" width="2" height="5.5" rx="0.4" fill="#7A7870"/>
      <rect x="10.8" y="8" width="2" height="7.5" rx="0.4" fill="#6A6760"/>
      <rect x="14.2" y="11.5" width="2" height="4" rx="0.4" fill="#8A8880"/>
      <line x1="7" y1="15.8" x2="17" y2="15.8" stroke="#5A5855" strokeWidth="0.7"/>
      <line x1="6" y1="4.5" x2="6" y2="19.5" stroke="#F0EDE8" strokeWidth="0.7" opacity="0.42"/>
    </>)}
  </V>
)

// SMED — precision gear (setup/changeover abstraction)
export const SmedIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <circle cx="12.3" cy="12.3" r="5" fill="#1C1B18" opacity="0.18"/>
      {([0,45,90,135,180,225,270,315] as number[]).map((deg:number, i:number) => {
        const r = deg * Math.PI / 180
        return <circle key={i} cx={12 + 8 * Math.cos(r)} cy={12 + 8 * Math.sin(r)} r="1.7" fill="#B8B4AC"/>
      })}
      <circle cx="12" cy="12" r="6" fill={a} filter={s}/>
      <circle cx="12" cy="12" r="3.3" fill={b} stroke="#7A7870" strokeWidth="0.7"/>
      <circle cx="12" cy="12" r="1.6" fill="#2A2825"/>
      <circle cx="11.2" cy="11.2" r="0.75" fill="#7A7870" opacity="0.45"/>
      <path d="M9.4 8.8a6 6 0 0 1 5.2 0" stroke="#F0EDE8" strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>
    </>)}
  </V>
)

// SOP — document with procedure lines
export const SOPIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({b,s}:any) => (<>
      <path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" fill="#1C1B18" opacity="0.18"/>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill={b} filter={s}/>
      <polyline points="14 2 14 8 20 8" fill="none" stroke="#7A7870" strokeWidth="1.1"/>
      <line x1="8" y1="11.5" x2="16" y2="11.5" stroke="#8A8680" strokeWidth="1"/>
      <line x1="8" y1="14" x2="16" y2="14" stroke="#8A8680" strokeWidth="1"/>
      <line x1="8" y1="16.5" x2="13" y2="16.5" stroke="#8A8680" strokeWidth="1"/>
      <line x1="6" y1="4.5" x2="6" y2="19.5" stroke="#F0EDE8" strokeWidth="0.7" opacity="0.42"/>
    </>)}
  </V>
)

// Supe AI — radiant core (intelligence/insight abstraction)
export const SupeIcon = (p:P) => (
  <V size={p.size} style={p.style} className={p.className}>
    {({a,b,s}:any) => (<>
      <circle cx="12.3" cy="12.3" r="4.6" fill="#1C1B18" opacity="0.18"/>
      <circle cx="12" cy="12" r="4.5" fill={a} filter={s}/>
      <circle cx="12" cy="12" r="3" fill={b} opacity="0.55"/>
      <path d="M12 2.5v2.8M12 18.7v2.8M2.5 12h2.8M18.7 12h2.8" stroke="#7A7870" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M4.5 4.5l2 2M17.5 17.5l2 2M17.5 6.5l2-2M4.5 19.5l2-2" stroke="#7A7870" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.8" fill="#2A2825"/>
      <circle cx="11.2" cy="11.2" r="0.8" fill="#D8D4CC" opacity="0.42"/>
    </>)}
  </V>
)

export const StandardWorkIcon = SOPIcon
