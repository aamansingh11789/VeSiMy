// ── styles/vesimy-theme.ts ────────────────────────────────────────────
// VeSiMy Refined Precision design system - canonical token source
// All app components should reference these tokens, not inline hex values

export const VsTheme = {
  colors: {
    // Navy scale
    navy: {
      950: '#071A2F',
      900: '#0B1D33',  // primary text / sidebar / buttons
      800: '#0F2747',
      700: '#163A5F',  // active states
    },
    // Steel blue scale
    blue: {
      700: '#2F5D8A',
      600: '#3A6FA3',
      500: '#4A83BC',
    },
    // Slate scale
    slate: {
      700: '#4F6174',
      600: '#73879C',
      400: '#A9B5C2',
      200: '#DDE3EA',  // standard border
      100: '#EEF2F6',
    },
    // Champagne gold
    gold: {
      600: '#C9A66B',  // primary accent
      500: '#D9C08A',
      300: '#E8D8B5',
    },
    sand:    { 100: '#F7F3EA' },
    paper:   '#F7F8FA',
    white:   '#FFFFFF',
    success: '#2F8F6B',
    warning: '#D99A3D',
    danger:  '#C94F4F',
    info:    '#2F76D2',
  },

  fonts: {
    display: "'Sora', 'Inter', system-ui, sans-serif",        // UI headings, app
    serif:   "'Instrument Serif', Georgia, serif",            // editorial / marketing
    sans:    "'Inter', system-ui, sans-serif",                // body
    mono:    "'JetBrains Mono', 'Fira Code', monospace",      // metadata, labels
    sticky:  "'Caveat', 'Marker Felt', cursive",              // VSM sticky notes
  },

  fontSize: {
    eyebrow:    '11px',     // mono caps small label
    label:      '12px',
    body:       '14px',
    bodyLg:     '15px',
    h4:         '17px',
    h3:         '20px',
    h2:         '28px',
    h1:         '40px',
    display:    '64px',     // hero
  },

  fontWeight: {
    body:    400,
    medium:  500,
    semi:    600,
    display: 650,           // Sora display
    bold:    700,
  },

  letterSpacing: {
    display: '-0.02em',
    tight:   '-0.01em',
    normal:  '0',
    mono:    '1.5px',       // caps mono labels
  },

  spacing: {
    px:   '1px',
    1:    '4px',
    2:    '8px',
    3:    '12px',
    4:    '16px',
    5:    '20px',
    6:    '24px',
    8:    '32px',
    10:   '40px',
    12:   '48px',
    16:   '64px',
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px',
    full: '999px',
  },

  shadow: {
    card:  '0 10px 30px rgba(7, 26, 47, 0.06)',
    panel: '0 18px 50px rgba(7, 26, 47, 0.12)',
    dark:  '0 18px 60px rgba(7, 26, 47, 0.35)',
    focus: '0 0 0 3px rgba(201, 166, 107, 0.18)',
  },

  motion: {
    fast:   '0.15s ease',
    normal: '0.25s ease',
    slow:   '0.4s ease',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },

  zIndex: {
    base:     1,
    dropdown: 10,
    sticky:   20,
    overlay:  30,
    modal:    40,
    toast:    50,
    tooltip:  60,
  },
} as const

export type VsThemeType = typeof VsTheme

// Convenient direct exports for most-used values
export const navy      = VsTheme.colors.navy[900]
export const navyDeep  = VsTheme.colors.navy[950]
export const steel     = VsTheme.colors.blue[700]
export const champagne = VsTheme.colors.gold[600]
export const sand      = VsTheme.colors.gold[500]
export const slate     = VsTheme.colors.slate[600]
export const slateLine = VsTheme.colors.slate[200]
export const paper     = VsTheme.colors.paper
export const white     = VsTheme.colors.white

export const fontDisplay = VsTheme.fonts.display
export const fontSerif   = VsTheme.fonts.serif
export const fontSans    = VsTheme.fonts.sans
export const fontMono    = VsTheme.fonts.mono
