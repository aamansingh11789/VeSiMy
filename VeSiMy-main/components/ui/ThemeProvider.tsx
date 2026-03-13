// @ts-nocheck
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@/components/ui/Icons'

type Theme = 'dark' | 'light'
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme:'dark', toggle:()=>{} })

// ── Light mode overrides ──────────────────────────────────────────────────────
// Strategy: use CSS variables + targeted overrides for every known dark pattern
const LIGHT = `
  /* ── Base ── */
  html.light, html.light body {
    background: #F2EFE8 !important;
    color: #1A1814 !important;
  }
  html.light body::before { display:none !important; }

  /* ── CSS Variables ── */
  html.light {
    --bg:      #F2EFE8;
    --bg2:     #E8E5DE;
    --bg3:     #DEDAD2;
    --text:    #1A1814;
    --text2:   #5C5850;
    --text3:   #9C9890;
    --border:  rgba(180,172,152,0.6);
    --border2: rgba(160,152,132,0.4);
    --glass:   rgba(232,229,222,0.9);
    --gold-dim: rgba(212,162,8,0.12);
    --gold-glow: rgba(212,162,8,0.3);
  }

  /* ── Nav ── */
  html.light nav,
  html.light [style*="background:'rgba(3,3,13"],
  html.light [style*="background: rgba(3,3,13"] {
    background: rgba(242,239,232,0.97) !important;
    border-color: rgba(180,172,152,0.4) !important;
  }
  html.light nav a, html.light nav span, html.light nav button { color: #5C5850 !important; }

  /* ── All dark section backgrounds ── */
  html.light section { background: transparent !important; border-color: rgba(180,172,152,0.3) !important; }

  /* ── Cards ── */
  html.light .card,
  html.light [style*="background:'rgba(8,8,24"],
  html.light [style*="background: rgba(8,8,24"],
  html.light [style*="background:'rgba(4,4,14"],
  html.light [style*="background: rgba(4,4,14"] {
    background: rgba(232,229,222,0.97) !important;
    border-color: rgba(180,172,152,0.6) !important;
  }

  /* ── Modals ── */
  html.light .modal { background: #EAE7E0 !important; border-color: rgba(180,172,152,0.6) !important; }
  html.light .modal-header { background: #E2DED6 !important; border-bottom-color: rgba(180,172,152,0.4) !important; }
  html.light .modal-body  { background: #EAE7E0 !important; }
  html.light .modal-footer { background: #E2DED6 !important; border-top-color: rgba(180,172,152,0.4) !important; }
  html.light .modal-overlay { background: rgba(0,0,0,0.4) !important; }

  /* ── Inputs ── */
  html.light input:not([type=range]), html.light select, html.light textarea {
    background: rgba(255,255,255,0.9) !important;
    border-color: rgba(180,172,152,0.7) !important;
    color: #1A1814 !important;
  }
  html.light input::placeholder, html.light textarea::placeholder { color: #9C9890 !important; }
  html.light input:focus, html.light select:focus, html.light textarea:focus {
    border-color: #D4A208 !important;
  }

  /* ── Buttons ── */
  html.light .btn-ghost {
    background: rgba(255,255,255,0.7) !important;
    border-color: rgba(180,172,152,0.7) !important;
    color: #1A1814 !important;
  }
  html.light .btn-ghost:hover { background: rgba(255,255,255,0.95) !important; }
  html.light .btn-secondary {
    background: transparent !important;
    border-color: rgba(212,162,8,0.4) !important;
    color: #D4A208 !important;
  }

  /* ── Sidebar ── */
  html.light aside {
    background: linear-gradient(180deg, #EAE7E0, #E2DED6) !important;
    border-right-color: rgba(180,172,152,0.4) !important;
  }
  html.light aside a, html.light aside button, html.light aside span { color: #5C5850 !important; }
  html.light aside a:hover, html.light aside a.active { background: rgba(212,162,8,0.1) !important; color: #1A1814 !important; }

  /* ── Tabs & toggles ── */
  html.light [style*="background:'#080818'"],
  html.light [style*="background: '#080818'"],
  html.light [style*="background:#080818"] {
    background: rgba(220,217,210,0.9) !important;
    border-color: rgba(180,172,152,0.5) !important;
  }

  /* ── Tables ── */
  html.light table { color: #1A1814 !important; }
  html.light th { color: #5C5850 !important; border-color: rgba(180,172,152,0.4) !important; }
  html.light td { border-color: rgba(180,172,152,0.25) !important; }
  html.light tr { border-color: rgba(180,172,152,0.25) !important; }

  /* ── Headings & text ── */
  html.light h1, html.light h2, html.light h3, html.light h4 { color: #1A1814 !important; }
  html.light p { color: #5C5850 !important; }
  html.light label { color: #5C5850 !important; }

  /* ── Bottom nav ── */
  html.light .bottom-nav {
    background: rgba(232,229,222,0.97) !important;
    border-top-color: rgba(180,172,152,0.4) !important;
  }
  html.light .bottom-nav-item { color: #9C9890 !important; }
  html.light .bottom-nav-item.active { color: #D4A208 !important; }

  /* ── Scrollbars ── */
  html.light ::-webkit-scrollbar-track { background: #E8E5DE !important; }
  html.light ::-webkit-scrollbar-thumb { background: rgba(180,172,152,0.6) !important; }

  /* ── Supe panel ── */
  html.light [class*="supe"], html.light [data-panel="supe"] {
    background: rgba(232,229,222,0.97) !important;
    border-color: rgba(180,172,152,0.5) !important;
  }

  /* ── Inline dark divs — cover all known rgba dark patterns ── */
  html.light [style*="rgba(3,3,13"],
  html.light [style*="rgba(4,4,14"],
  html.light [style*="rgba(8,8,24"],
  html.light [style*="rgba(13,13,34"] {
    background: rgba(232,229,222,0.9) !important;
  }

  /* ── Inline border colors ── */
  html.light [style*="rgba(26,26,64"],
  html.light [style*="rgba(40,40,92"] {
    border-color: rgba(180,172,152,0.4) !important;
  }

  /* ── Hero section ── */
  html.light [style*="radial-gradient"],
  html.light [style*="linear-gradient(160deg"] {
    background: #F2EFE8 !important;
  }

  /* ── Footer ── */
  html.light footer {
    background: rgba(232,229,222,0.97) !important;
    border-top-color: rgba(180,172,152,0.4) !important;
  }

  /* ── Project workspace — hardcoded dark colors ── */
  html.light [style*="background:'#03030D'"] { background: #F2EFE8 !important; }
  html.light [style*="background:'#080818'"] { background: #E8E5DE !important; }
  html.light [style*="background:'#0D0D22'"] { background: #E2DED6 !important; }
  html.light [style*="background:'#0A0518'"] { background: #EAE7E0 !important; }
  html.light [style*="background:'rgba(8,4,20"] { background: #EAE7E0 !important; }

  /* ── Hardcoded text colors ── */
  html.light [style*="color:'#EAE8F4'"] { color: #1A1814 !important; }
  html.light [style*="color:'#7070A0'"] { color: #5C5850 !important; }
  html.light [style*="color:'#38385C'"] { color: #7C7870 !important; }
  html.light [style*="color:'#1A1A40'"] { color: #9C9890 !important; }
  html.light [style*="color:'#28285C'"] { color: #9C9890 !important; }

  /* ── Step cards & builder ── */
  html.light [style*="border:'1px solid #1A1A40'"] { border-color: rgba(180,172,152,0.5) !important; }
  html.light [style*="borderBottom:'1px solid #1A1A40'"] { border-bottom-color: rgba(180,172,152,0.5) !important; }
  html.light [style*="borderTop:'1px solid #1A1A40'"] { border-top-color: rgba(180,172,152,0.5) !important; }

  /* ── Chat bubbles ── */
  html.light [style*="background:'rgba(26,26,64,0.6)'"] {
    background: rgba(220,217,210,0.9) !important;
    color: #1A1814 !important;
  }

  /* ── Supe mobile overlay sheet ── */
  html.light .supe-mobile-overlay > div {
    background: #EAE7E0 !important;
    border-color: rgba(180,172,152,0.5) !important;
  }

  /* ── Dashed add step button ── */
  html.light [style*="border:'1px dashed rgba(40,40,92"] {
    border-color: rgba(160,152,132,0.5) !important;
    color: #9C9890 !important;
  }

  /* ── Metric bar ── */
  html.light [style*="background:'#03030D'"][style*="borderBottom:'1px solid #1A1A40'"] {
    background: #F0EDE6 !important;
    border-bottom-color: rgba(180,172,152,0.5) !important;
  }

  /* ── Tab bars ── */
  html.light [style*="background:'#080818'"][style*="borderBottom:'1px solid #1A1A40'"] {
    background: #E8E5DE !important;
    border-bottom-color: rgba(180,172,152,0.5) !important;
  }

  /* ── Active tab indicator ── */
  html.light [style*="borderBottom:'2px solid #D4A208'"] { border-bottom-color: #B8860B !important; }

  /* ── VSM / report report page bg ── */
  html.light [style*="background:'#0D0D22'"][style*="borderRadius"] {
    background: rgba(232,229,222,0.97) !important;
    border-color: rgba(180,172,152,0.5) !important;
  }

`

function applyTheme(t: Theme) {
  const html = document.documentElement
  let tag = document.getElementById('vt') as HTMLStyleElement | null

  if (t === 'light') {
    html.classList.add('light')
    if (!tag) {
      tag = document.createElement('style')
      tag.id = 'vt'
      document.head.appendChild(tag)
    }
    tag.textContent = LIGHT
    document.body.style.background = '#F2EFE8'
    document.body.style.color = '#1A1814'
  } else {
    html.classList.remove('light')
    if (tag) tag.textContent = ''
    document.body.style.background = ''
    document.body.style.color = ''
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('vesimy-theme') as Theme) || 'dark'
    setTheme(saved)
    applyTheme(saved)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('vesimy-theme', next)
    applyTheme(next)
  }

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)

export function ThemeToggle({ size = 32 }: { size?: number }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button onClick={toggle}
      className="theme-toggle-btn"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        width: size, height: size, borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg2)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text2)',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
    >
      {isDark
        ? <SunIcon  size={Math.round(size * 0.5)} color="currentColor" />
        : <MoonIcon size={Math.round(size * 0.5)} color="currentColor" />}
    </button>
  )
}
