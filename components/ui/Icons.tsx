// @ts-nocheck
'use client'
// ── components/ui/Icons.tsx ───────────────────────────────────────────────────
// VeSiMy Custom Icon Library — bespoke SVG icons, zero external dependencies
// Industrial-luxury aesthetic: 1.75px stroke, geometric, crisp

interface IconProps {
  size?:   number
  color?:  string
  stroke?: number
  style?:  React.CSSProperties
  className?: string
}

const def = (size=18, color='currentColor', stroke=1.75) => ({ size, color, stroke })

// ── Micro factory for clean SVG wrapper ───────────────────────────────────────
function I({ size=18, color='currentColor', stroke=1.75, style, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, ...style }} className={className}>
      {children}
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  NAVIGATION & UI
// ══════════════════════════════════════════════════════════════════════════════

export const DashboardIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 17.5h7M17.5 14v7" />
  </I>
)

export const FolderIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M3 7a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59L10.83 7H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </I>
)

export const SettingsIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77" />
  </I>
)

export const LogOutIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </I>
)

export const CrownIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M3 19h18" />
    <path d="M3 7l4.5 8L12 5l4.5 10L21 7v12H3V7Z" />
  </I>
)

export const ChevronRightIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="9 18 15 12 9 6" />
  </I>
)

export const ChevronDownIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="6 9 12 15 18 9" />
  </I>
)

export const ArrowRightIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </I>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="11 18 5 12 11 6" />
  </I>
)

export const PlusIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </I>
)

export const XIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </I>
)

export const CheckIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="20 6 9 17 4 12" />
  </I>
)

export const EditIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </I>
)

export const TrashIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </I>
)

export const ClockIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </I>
)

export const SearchIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </I>
)

export const DownloadIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </I>
)

export const ActivityIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </I>
)

export const AlertIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </I>
)

export const InfoIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </I>
)

export const BookIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" />
  </I>
)

export const ZapIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </I>
)

export const BarChartIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
    <line x1="2"  y1="20" x2="22" y2="20" />
  </I>
)

export const UserIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </I>
)

export const LockIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </I>
)

export const MailIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
    <polyline points="22 6 12 13 2 6" />
  </I>
)

export const GridIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </I>
)

export const LayersIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </I>
)

export const RefreshIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </I>
)

export const ExternalLinkIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </I>
)

// ══════════════════════════════════════════════════════════════════════════════
//  CI / LEAN TOOL ICONS — Custom, domain-specific
// ══════════════════════════════════════════════════════════════════════════════

// Value Stream Map — flowing arrows with process boxes
export const VSMIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="1"  y="9" width="5" height="6" rx="1" />
    <rect x="9.5" y="9" width="5" height="6" rx="1" />
    <rect x="18" y="9" width="5" height="6" rx="1" />
    <path d="M6 12h3.5M14.5 12H18" />
    <polyline points="15.5 10.5 17 12 15.5 13.5" />
    <polyline points="7 10.5 8.5 12 7 13.5" />
    <path d="M3 9V6M12 9V5M21 9V6" strokeDasharray="1.5 1.5" />
  </I>
)

// Kaizen burst — lightning/explosion
export const KaizenIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M12 2L8.5 9.5H3L8 14l-2 8 6-4 6 4-2-8 5-4.5h-5.5L12 2Z" />
  </I>
)

// Fishbone / Ishikawa — actual fishbone structure
export const FishboneIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    {/* Spine */}
    <line x1="3" y1="12" x2="21" y2="12" />
    {/* Head */}
    <polygon points="19 10 21 12 19 14" fill="currentColor" stroke="none" />
    {/* Bones top */}
    <line x1="8"  y1="12" x2="6"  y2="7"  />
    <line x1="12" y1="12" x2="10" y2="7"  />
    <line x1="16" y1="12" x2="14" y2="7"  />
    {/* Bones bottom */}
    <line x1="8"  y1="12" x2="6"  y2="17" />
    <line x1="12" y1="12" x2="10" y2="17" />
    <line x1="16" y1="12" x2="14" y2="17" />
  </I>
)

// 5 Why — stacked question marks forming a column
export const FiveWhyIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M9 4a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
    <path d="M5 20l2-4" strokeDasharray="1 1.5" />
    <path d="M8 16l2-4" strokeDasharray="1 1.5" />
    <path d="M11 12l2-4" strokeDasharray="1 1.5" />
    <circle cx="4" cy="21" r="1" fill="currentColor" stroke="none" />
  </I>
)

// Stopwatch — time study
export const StopwatchIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l3 3" />
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="19" y1="5" x2="21" y2="3" />
  </I>
)

// Waste / Muda — spiral/cycle with X
export const WasteIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M12 3a9 9 0 1 0 9 9" />
    <line x1="17" y1="3" x2="21" y2="3" />
    <line x1="21" y1="3" x2="21" y2="7" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </I>
)

// Kanban board — columns with cards
export const KanbanIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="3" y="3" width="5" height="18" rx="1" />
    <rect x="10.5" y="3" width="3" height="11" rx="1" />
    <rect x="16" y="3" width="5" height="14" rx="1" />
  </I>
)

// Improvement — upward trend with star/sparkle
export const ImprovementIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <polyline points="2 20 7 13 11 16 17 8 22 4" />
    <path d="M19 4h3v3" />
    <circle cx="8" cy="5" r="1.5" />
    <path d="M8 3.5V2M8 8v-1.5M6.5 5H5M11 5H9.5M7.06 3.56L6 2.5M10 7.5L8.94 6.44M9 3.56L10 2.5M6 7.44l1.06-1.06" strokeWidth={1} />
  </I>
)

// Process simulation — flow with nodes
export const SimulationIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="5"  cy="12" r="2.5" />
    <circle cx="12" cy="5"  r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
    <circle cx="12" cy="19" r="2.5" />
    <line x1="7.4"  y1="10.6" x2="9.6" y2="7.4"  />
    <line x1="14.4" y1="7.4"  x2="16.6" y2="10.6" />
    <line x1="16.6" y1="13.4" x2="14.4" y2="16.6" />
    <line x1="9.6"  y1="16.6" x2="7.4"  y2="13.4" />
  </I>
)

// Live floor — pulse/broadcast
export const LiveFloorIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M6.34 6.34a8 8 0 0 0 0 11.32" />
    <path d="M17.66 6.34a8 8 0 0 1 0 11.32" />
    <path d="M3 3L5.5 5.5M21 3L18.5 5.5" />
  </I>
)

// Branch / fork process
export const BranchIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="12" y1="3" x2="12" y2="9" />
    <line x1="12" y1="9" x2="6"  y2="15" />
    <line x1="12" y1="9" x2="18" y2="15" />
    <circle cx="12" cy="3"  r="2" />
    <circle cx="6"  cy="17" r="2" />
    <circle cx="18" cy="17" r="2" />
  </I>
)

// Report / document
export const ReportIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </I>
)

// SOP / standard work document
export const SOPIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="17" x2="11" y2="17" />
  </I>
)

// Process step — box with chevron
export const StepIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="2" y="7" width="14" height="10" rx="2" />
    <path d="M16 10l5 2-5 2" />
    <line x1="6"  y1="11" x2="10" y2="11" />
    <line x1="6"  y1="14" x2="9"  y2="14" />
  </I>
)

// Takt time / metronome
export const TaktIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <line x1="12" y1="20" x2="12" y2="4" />
    <path d="M7 9l5-5 5 5" />
    <path d="M9 20h6" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <line x1="12" y1="12" x2="14.5" y2="10.5" />
  </I>
)

// WIP / inventory  
export const WIPIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </I>
)

// Operator / worker
export const OperatorIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="6" r="3" />
    <path d="M9 20v-5l-3-3 1.5-6h9L18 12l-3 3v5" />
    <line x1="9" y1="20" x2="15" y2="20" />
  </I>
)

// Defect / quality issue
export const DefectIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    <line x1="10" y1="10" x2="14" y2="14" />
    <line x1="14" y1="10" x2="10" y2="14" />
  </I>
)

// PCE / efficiency gauge
export const PCEIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M3 12a9 9 0 1 0 9-9" />
    <path d="M3 12a9 9 0 0 0 5.1 8.1" />
    <path d="M12 7v5l3 3" />
    <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </I>
)

// Supermarket / pull system
export const SupermarketIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="9" y1="10" x2="9"  y2="20" />
    <line x1="15" y1="10" x2="15" y2="20" />
  </I>
)

// PDF export
export const PDFIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8v-3Z" strokeWidth={1.5} />
    <path d="M13 13h1.5a1.5 1.5 0 0 1 0 3H13v-3Z" strokeWidth={1.5} />
    <line x1="16.5" y1="13" x2="16.5" y2="16" strokeWidth={1.5} />
    <line x1="16" y1="14.5" x2="17" y2="14.5" strokeWidth={1.5} />
  </I>
)

// Supe / AI analyze — circuit brain
export const SupeIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <path d="M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M17.66 6.34l2.12-2.12M4.22 19.78l2.12-2.12" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </I>
)

// Drag handle
export const DragHandleIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="9"  cy="7"  r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="7"  r="1" fill="currentColor" stroke="none" />
    <circle cx="9"  cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="9"  cy="17" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="17" r="1" fill="currentColor" stroke="none" />
  </I>
)

// Sun (light mode)
export const SunIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2"  x2="12" y2="5"  />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2"  y1="12" x2="5"  y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
    <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
  </I>
)

// Moon (dark mode)
export const MoonIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </I>
)

// Stripe / payment
export const CreditCardIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1"  y1="10" x2="23" y2="10" />
    <line x1="5"  y1="15" x2="9"  y2="15" />
    <line x1="12" y1="15" x2="14" y2="15" />
  </I>
)

// Building (enterprise)
export const BuildingIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <rect x="9"  y="10" width="2" height="2" />
    <rect x="9"  y="15" width="2" height="2" />
    <rect x="14" y="14" width="2" height="2" />
  </I>
)

// Sparkle / free tier
export const SparkleIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    <path d="M5 5l.75 2.25L8 8l-2.25.75L5 11l-.75-2.25L2 8l2.25-.75L5 5Z" strokeWidth={1.5} />
    <path d="M19 14l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" strokeWidth={1.5} />
  </I>
)

// Infinite (lifetime)
export const InfinityIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4Zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4Z" />
  </I>
)

// PDCA cycle icon
export const PDCAIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M12 2a10 10 0 0 1 7.39 16.74" />
    <path d="M12 2a10 10 0 0 0-9.95 10.74" />
    <path d="M22 12a10 10 0 0 1-10 10" />
    <path d="M2 12a10 10 0 0 0 10 10" />
    <polyline points="16 8 12 12 8 8" />
    <line x1="12" y1="12" x2="12" y2="17" />
  </I>
)

// Roadmap icon
export const RoadmapIcon = (p: IconProps) => (
  <I {...def(p.size, p.color, p.stroke)} style={p.style} className={p.className}>
    <path d="M3 17l4-10 4 6 3-4 4 8" />
    <line x1="3" y1="17" x2="21" y2="17" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="11" cy="13" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14" cy="9" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18" cy="17" r="1.5" fill="currentColor" stroke="none" />
  </I>
)
