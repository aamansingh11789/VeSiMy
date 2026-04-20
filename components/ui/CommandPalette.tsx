// TypeScript enabled
'use client'
import { FishboneIcon, FiveWhyIcon, StopwatchIcon, ZapIcon, SettingsIcon, BookIcon, RefreshIcon, VSMIcon, CreditCardIcon, FolderIcon } from '@/components/ui/Icons'
// ── components/ui/CommandPalette.tsx ──────────────────────────────────────────
// ⌘K command palette — search projects, steps, CI tools, nav.
// Glass overlay, keyboard navigation, instant results.

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const BRAND = '#0176D3'
const mono  = '"IBM Plex Mono",ui-monospace,monospace'

const STATIC_COMMANDS = [
  { id:'dashboard',  label:'Go to Dashboard',          icon:'⊞', category:'Navigate',  href:'/dashboard' },
  { id:'pricing',    label:'View Pricing',              icon:'billing', category:'Navigate',  href:'/pricing' },
  { id:'settings',  label:'Account Settings',          icon:'settings', category:'Navigate',  href:'/settings' },
  { id:'learn',     label:'Learning Center',           icon:'book', category:'Navigate',  href:'/learn' },
  { id:'blog',      label:'Blog',                      icon:'edit', category:'Navigate',  href:'/blog' },
  { id:'new',       label:'New Project',               icon:'＋', category:'Action',    href:'/dashboard?new=1' },
  { id:'vsm',       label:'VSM — Value Stream Mapping',icon:'vsm', category:'CI Tool',   href:'/learn#vsm' },
  { id:'fishbone',  label:'Fishbone Diagram',          icon:'fishbone', category:'CI Tool',   href:'/learn#fishbone' },
  { id:'5why',      label:'5 Why Analysis',            icon:'fivewhy', category:'CI Tool',   href:'/learn#fivewhy' },
  { id:'kaizen',    label:'Kaizen Event Tracking',     icon:'zap', category:'CI Tool',   href:'/learn#kaizen' },
  { id:'pdca',      label:'PDCA Cycle',                icon:'refresh', category:'CI Tool',   href:'/learn#pdca' },
  { id:'smed',      label:'SMED Changeover',           icon:'stopwatch', category:'CI Tool',   href:'/learn#smed' },
]

interface Result {
  id: string
  label: string
  sublabel?: string
  icon: string
  category: string
  href?: string
  action?: () => void
}

export function CommandPalette() {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()
  const supabase = createClient()

  // ── Open/close with ⌘K ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(''); setSelected(0) }
  }, [open])

  // ── Search ────────────────────────────────────────────────────────────────
  const search = useCallback(async (q: string) => {
    const static_ = STATIC_COMMANDS.filter(c =>
      c.label.toLowerCase().includes(q.toLowerCase()) ||
      c.category.toLowerCase().includes(q.toLowerCase())
    ).map(c => ({ ...c }))

    if (!q.trim()) { setResults(static_.slice(0, 8)); return }

    setLoading(true)
    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, industry, created_at')
        .ilike('name', `%${q}%`)
        .limit(5)

      const projectResults: Result[] = (projects || []).map(p => ({
        id: `project-${p.id}`,
        label: p.name,
        sublabel: p.industry || 'Project',
        icon: 'folder',
        category: 'Project',
        href: `/project/${p.id}`,
      }))

      setResults([...projectResults, ...static_].slice(0, 10))
    } catch {
      setResults(static_.slice(0, 8))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const t = setTimeout(() => search(query), 120)
    return () => clearTimeout(t)
  }, [query, search])

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s+1, results.length-1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s-1, 0)) }
    if (e.key === 'Enter') {
      const r = results[selected]
      if (r?.href) { router.push(r.href); setOpen(false) }
      if (r?.action) { r.action(); setOpen(false) }
    }
  }

  const go = (r: Result) => {
    if (r.href) router.push(r.href)
    if (r.action) r.action()
    setOpen(false)
  }

  const categoryColors: Record<string,string> = {
    Navigate: '#38BDF8', Action: '#4ADE80', 'CI Tool': BRAND, Project: '#A78BFA'
  }

  if (!open) return null

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'14vh' }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      {/* Backdrop */}
      <div style={{ position:'absolute', inset:0, background:'rgba(3,8,20,0.75)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' }}/>

      {/* Palette */}
      <div style={{
        position:'relative', zIndex:1, width:'100%', maxWidth:600, margin:'0 16px',
        background:'rgba(10,18,40,0.95)',
        backdropFilter:'blur(32px)',
        WebkitBackdropFilter:'blur(32px)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:16,
        boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08) inset, 0 1px 0 rgba(255,255,255,0.1) inset',
        overflow:'hidden',
      }}>
        {/* Top light */}
        <div style={{ position:'absolute',top:0,left:0,right:0,height:'40%',background:'linear-gradient(180deg,rgba(56,189,248,0.05) 0%,transparent 100%)',pointerEvents:'none',borderRadius:'16px 16px 0 0' }}/>

        {/* Search input */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={onKey}
            placeholder="Search projects, tools, or navigate…"
            style={{
              flex:1, background:'none', border:'none', outline:'none',
              color:'rgba(241,245,249,0.9)', fontSize:15, fontFamily:'inherit',
              caretColor:'#38BDF8',
            }}
          />
          {loading && (
            <div style={{ width:14, height:14, border:'1.5px solid rgba(56,189,248,0.2)', borderTopColor:'#38BDF8', borderRadius:'50%', animation:'cmdspin 0.7s linear infinite' }}/>
          )}
          <kbd style={{ fontFamily:mono, fontSize:9, letterSpacing:1, color:'rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:5, padding:'3px 6px' }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight:360, overflowY:'auto' }}>
          {results.length === 0 && !loading && (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:13, fontFamily:mono }}>
              No results for "{query}"
            </div>
          )}
          {results.map((r, i) => (
            <div key={r.id}
              onClick={() => go(r)}
              onMouseEnter={() => setSelected(i)}
              style={{
                display:'flex', alignItems:'center', gap:12, padding:'10px 18px',
                cursor:'pointer', transition:'background 0.1s',
                background: selected === i ? 'rgba(56,189,248,0.08)' : 'transparent',
                borderLeft: selected === i ? '2px solid #38BDF8' : '2px solid transparent',
              }}>
              <span style={{ fontSize:16, flexShrink:0, width:24, textAlign:'center' }}>{r.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, color: selected===i ? '#F1F5F9' : 'rgba(241,245,249,0.7)', fontWeight: selected===i ? 600 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {r.label}
                </div>
                {r.sublabel && <div style={{ fontFamily:mono, fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:2 }}>{r.sublabel}</div>}
              </div>
              <span style={{ fontFamily:mono, fontSize:8, letterSpacing:1.5, color:categoryColors[r.category] || 'rgba(255,255,255,0.3)', background:`${categoryColors[r.category] || 'rgba(255,255,255,0.1)'}18`, border:`1px solid ${categoryColors[r.category] || 'rgba(255,255,255,0.1)'}30`, borderRadius:4, padding:'2px 7px', flexShrink:0 }}>
                {r.category.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:'10px 18px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:16, alignItems:'center' }}>
          {[['↑↓','navigate'],['↵','open'],['esc','close']].map(([k,l]) => (
            <span key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <kbd style={{ fontFamily:mono, fontSize:9, color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:4, padding:'2px 6px' }}>{k}</kbd>
              <span style={{ fontFamily:mono, fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:1 }}>{l}</span>
            </span>
          ))}
          <span style={{ marginLeft:'auto', fontFamily:mono, fontSize:9, color:'rgba(56,189,248,0.3)', letterSpacing:1 }}>⌘K</span>
        </div>
      </div>

      <style>{`@keyframes cmdspin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── Trigger button (for nav/sidebar) ─────────────────────────────────────────
export function CommandPaletteTrigger({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false)
  const handler = (e: KeyboardEvent) => { if ((e.metaKey||e.ctrlKey)&&e.key==='k') setOpen(v=>!v) }
  useEffect(() => { window.addEventListener('keydown', handler); return ()=>window.removeEventListener('keydown',handler) }, [])

  return (
    <button
      onClick={() => { const ev = new KeyboardEvent('keydown',{key:'k',metaKey:true,bubbles:true}); window.dispatchEvent(ev) }}
      title="Command palette (⌘K)"
      style={{
        display:'flex', alignItems:'center', gap:8, width:'100%',
        padding: collapsed ? '10px 0' : '9px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:9, cursor:'pointer', transition:'all .15s',
        color:'rgba(255,255,255,0.4)', fontFamily:mono, fontSize:11, letterSpacing:1,
      }}
      onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(56,189,248,0.08)';(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(56,189,248,0.2)';(e.currentTarget as HTMLButtonElement).style.color='rgba(56,189,248,0.7)'}}
      onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.08)';(e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.4)'}}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      {!collapsed && (
        <>
          <span style={{ flex:1, textAlign:'left' }}>Search…</span>
          <kbd style={{ fontSize:9, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, padding:'1px 5px', color:'rgba(255,255,255,0.25)' }}>⌘K</kbd>
        </>
      )}
    </button>
  )
}
