'use client'
// @ts-nocheck
// ── app/page.tsx — VeSiMy Homepage ───────────────────────────────────────────

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { VLogoMark, VeSiMyWordmark, VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ── Inline 3D VSM step box ────────────────────────────────────────────────────
function IsoStep({ name, sub, ct, type, isBn = false }: any) {
  const colors: Record<string, { fill: string; top: string; side: string; text: string; badge: string; badgeText: string }> = {
    va:   { fill: '#EDF9F5', top: '#D4F0E8', side: '#7DCAB5', text: '#0A4535', badge: '#EDF9F5', badgeText: '#0F6E56' },
    nnva: { fill: '#FEF9EE', top: '#FEF0CC', side: '#DEB96A', text: '#5A3A00', badge: '#FEF9EE', badgeText: '#854F0B' },
    bn:   { fill: '#FEF2F0', top: '#FDDDD9', side: '#E8735A', text: '#7A1A0A', badge: '#FEF2F0', badgeText: '#A83222' },
  }
  const c = colors[isBn ? 'bn' : type] || colors.va
  return (
    <svg width="82" height="62" viewBox="0 0 82 62" fill="none" style={{ flexShrink: 0 }}>
      {/* depth */}
      <path d={`M14 16 H68 L74 10 H20 Z`} fill={c.side} opacity="0.42" />
      <path d={`M68 16 L74 10 L74 50 L68 56 Z`} fill={c.side} opacity="0.55" />
      {/* front */}
      <rect x="14" y="16" width="54" height="40" rx="2" fill={c.fill} stroke={isBn ? '#C0402A' : c.side} strokeWidth={isBn ? 1.5 : 1} />
      {/* top bevel */}
      <path d={`M14 16 L20 10 L74 10 L68 16 Z`} fill={c.top} stroke={c.side} strokeWidth="0.8" />
      {/* right face */}
      <path d={`M68 16 L74 10 L74 50 L68 56 Z`} fill={c.top} stroke={c.side} strokeWidth="0.8" opacity="0.7" />
      {/* burst on bottleneck */}
      {isBn && (
        <polygon points="12,8 13.4,12 18,12 14.2,14.6 15.4,19 12,16.4 8.6,19 9.8,14.6 6,12 10.6,12"
                 fill="#C0402A" opacity="0.9" />
      )}
      {/* name */}
      <text x="41" y="31" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={c.text} fontFamily="sans-serif">{name}</text>
      {sub && <text x="41" y="40" textAnchor="middle" fontSize="7" fill={c.text} fontFamily="sans-serif">{sub}</text>}
      {/* ct badge */}
      <rect x="20" y="48" width="42" height="9" rx="2" fill={c.badge} stroke={isBn ? '#C0402A' : c.side} strokeWidth="0.6" />
      <text x="41" y="54.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={isBn ? '#A83222' : c.badgeText} fontFamily="monospace">{ct}</text>
    </svg>
  )
}

function WipCoins({ n, color = '#DEB96A', bg = '#FEF9EE' }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      {Array.from({ length: Math.min(n, 3) }).map((_, i) => (
        <div key={i} style={{ width: 16, height: 5, borderRadius: '50%', border: `1px solid ${color}`, background: bg, opacity: 1 - i * 0.25 }} />
      ))}
      <span style={{ fontSize: 6, color: '#8E8A82', fontFamily: 'monospace' }}>{n}</span>
    </div>
  )
}


// ── Tool Showcase — sticky scroll with animated previews ──────────────────────
const TOOLS_DATA = [
  {
    id: 'vsm',
    icon: '🗺',
    name: 'Value Stream Map',
    label: 'See your whole process at once',
    body: 'Map every step your product takes from start to finish. Cycle times, wait times, WIP, and bottlenecks all calculated automatically. Steps over Takt Time are flagged in red — no guessing where the constraint is.',
    badge: 'Core',
    badgeBg: '#EEF4FB', badgeColor: '#1A4F8A',
    preview: () => (
      <div style={{ fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, padding: '8px 10px', background: '#F0F4FF', borderRadius: 8, fontSize: 11 }}>
          {[['STEPS','6'],['TOTAL CT','8m 14s'],['TAKT','2m 00s'],['PCE','34%'],['WIP','47']].map(([l,v]) => (
            <div key={l} style={{ flex:1, textAlign:'center', borderRight:'1px solid #D8D5CE', paddingRight:6 }}>
              <div style={{ fontSize:8, color:'#8E8A82', letterSpacing:1 }}>{l}</div>
              <div style={{ fontSize:13, fontWeight:700, color: l==='PCE'?'#C0402A':'#C49B2E' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4, overflowX:'auto', padding:'4px 0' }}>
          {[
            { name:'Staging', ct:'45s', ok:true },
            { name:'Frame Asm', ct:'98s', ok:true },
            { name:'Foam & Fabric', ct:'145s', ok:false },
            { name:'Electrical', ct:'88s', ok:true },
            { name:'Final QC', ct:'72s', ok:true },
          ].map((s, i) => (
            <div key={s.name} style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
              <div style={{ width:90, background:'#FFFFFF', border:`1.5px solid ${s.ok?'#D8D5CE':'#C0402A'}`, borderRadius:8, padding:'8px 8px 6px', position:'relative', boxShadow: s.ok?'none':'0 0 10px rgba(192,64,42,0.18)' }}>
                {!s.ok && <div style={{ position:'absolute', top:-7, right:-5, fontSize:10 }}>⚠️</div>}
                <div style={{ fontSize:8, fontWeight:700, color: s.ok?'#242220':'#C0402A', marginBottom:4, textAlign:'center' }}>{s.name}</div>
                <div style={{ height:3, background:'#EEE', borderRadius:2, marginBottom:4 }}>
                  <div style={{ height:3, borderRadius:2, background: s.ok?'#C49B2E':'#C0402A', width: s.ok ? `${Math.round(parseInt(s.ct)*100/145)}%` : '100%' }} />
                </div>
                <div style={{ fontSize:8, color: s.ok?'#8E8A82':'#C0402A', textAlign:'center', fontWeight:700 }}>{s.ct}</div>
              </div>
              {i < 4 && <div style={{ fontSize:11, color:'#C8C5BC' }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, padding:'6px 10px', background:'#FEF2F0', border:'1px solid rgba(192,64,42,0.2)', borderRadius:6, fontSize:11, color:'#C0402A' }}>
          ⚠ Bottleneck: <strong>Foam & Fabric</strong> is running 21% over Takt Time — 47 units queued upstream.
        </div>
      </div>
    ),
  },
  {
    id: 'timestudy',
    icon: '⏱',
    name: 'Time Study',
    label: 'Measure it before you manage it',
    body: 'Built-in stopwatch records every observation lap. Calculates mean cycle time, flags outliers, and sets the official CT used across your VSM. Works with manual entry too — paste in existing data from your clipboard.',
    badge: 'Free',
    badgeBg: '#EDF9F5', badgeColor: '#0F6E56',
    preview: () => (
      <div>
        <div style={{ textAlign:'center', padding:'16px 0 12px', borderBottom:'1px solid #EEE', marginBottom:12 }}>
          <div style={{ fontSize:44, fontWeight:800, color:'#242220', fontFamily:'monospace', letterSpacing:2 }}>1:24.3</div>
          <div style={{ fontSize:11, color:'#8E8A82', marginTop:4 }}>Observation 6 of 10</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:12 }}>
          {[['Mean CT','98.4s','#C49B2E'],['Min','82s','#2A9E82'],['Max','141s','#C0402A']].map(([l,v,c]) => (
            <div key={l} style={{ background:'#F8F7F5', borderRadius:6, padding:'8px', textAlign:'center' }}>
              <div style={{ fontSize:9, color:'#8E8A82', letterSpacing:1, marginBottom:2 }}>{l}</div>
              <div style={{ fontSize:16, fontWeight:700, color:c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {[82,95,91,110,88,141,97,84,102,99].map((t,i) => (
            <div key={i} style={{ padding:'4px 9px', borderRadius:5, fontSize:11, fontFamily:'monospace', fontWeight:600,
              background: i===5 ? '#FEF2F0' : '#F0FAF6',
              color: i===5 ? '#C0402A' : '#0F6E56',
              border: `1px solid ${i===5?'rgba(192,64,42,0.3)':'rgba(15,110,86,0.2)'}`,
              textDecoration: i===5 ? 'line-through' : 'none' }}>
              #{i+1} {t}s
            </div>
          ))}
        </div>
        <div style={{ marginTop:8, fontSize:10, color:'#8E8A82' }}>Tap any lap to exclude from mean · Outlier excluded</div>
      </div>
    ),
  },
  {
    id: 'fivewhy',
    icon: '❓',
    name: '5 Why Analysis',
    label: 'Stop fixing symptoms. Find the cause.',
    body: 'Ask why five times and reach the real root cause — not the one that's easiest to blame. Each answer becomes the next question. Assign a countermeasure, an owner, and a due date. The whole chain stays attached to the step it came from.',
    badge: 'Free',
    badgeBg: '#EDF9F5', badgeColor: '#0F6E56',
    preview: () => (
      <div>
        <div style={{ padding:'10px 12px', background:'#FEF9EE', border:'1px solid rgba(196,155,46,0.3)', borderRadius:8, marginBottom:12, fontSize:12, color:'#5A3A00', fontWeight:600 }}>
          Problem: Weld defect rate at Station 4 is 3.2% — target is 0.5%
        </div>
        {[
          ['Why 1', 'Weld joint gaps are inconsistent between parts'],
          ['Why 2', 'Fixture wear is not being caught in pre-shift checks'],
          ['Why 3', 'Pre-shift checklist was updated but operators not retrained'],
          ['Why 4', 'No retraining trigger exists when checklists are revised'],
          ['Why 5', 'Change management process has no mandatory notification step'],
        ].map(([w, a], i) => (
          <div key={w} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
            <div style={{ width:22, height:22, borderRadius:6, background:'rgba(196,155,46,0.12)', border:'1px solid rgba(196,155,46,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#C49B2E', flexShrink:0, marginTop:2 }}>{i+1}</div>
            <div>
              <div style={{ fontSize:9, color:'#C49B2E', fontFamily:'monospace', letterSpacing:1, marginBottom:2 }}>{w}</div>
              <div style={{ fontSize:12, color:'#4E4B45', lineHeight:1.5 }}>{a}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:10, padding:'10px 12px', background:'#EDF9F5', border:'1px solid rgba(15,110,86,0.25)', borderRadius:8 }}>
          <div style={{ fontSize:9, color:'#0F6E56', letterSpacing:1, fontFamily:'monospace', marginBottom:4 }}>ROOT CAUSE → COUNTERMEASURE</div>
          <div style={{ fontSize:12, color:'#242220' }}>Add mandatory notification step to change management SOP — Owner: J.Torres · Due: 15 Apr</div>
        </div>
      </div>
    ),
  },
  {
    id: 'fishbone',
    icon: '🐟',
    name: 'Fishbone Diagram',
    label: 'Map all possible causes before you fix anything',
    body: 'Choose 6M Manufacturing, 8P Service, 4S, or Custom. Add causes across every category — Machine, Method, Material, Manpower, Measurement, Mother Nature. See the full picture before you start solving. Connects directly to your 5 Why.',
    badge: 'Free',
    badgeBg: '#EDF9F5', badgeColor: '#0F6E56',
    preview: () => (
      <div>
        <div style={{ textAlign:'center', padding:'6px 12px', background:'#FEF2F0', border:'1px solid rgba(192,64,42,0.2)', borderRadius:6, fontSize:12, color:'#C0402A', fontWeight:600, marginBottom:12 }}>
          Effect: High defect rate at Welding Station 4
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[
            { cat:'Machine', color:'#1A4F8A', bg:'#EEF4FB', causes:['Fixture worn — 0.3mm play','Calibration last done Q3'] },
            { cat:'Method', color:'#0F6E56', bg:'#EDF9F5', causes:['Sequence varies by operator','No standard tack pattern'] },
            { cat:'Material', color:'#854F0B', bg:'#FEF9EE', causes:['Batch 44C had thickness variance','Storage humidity uncontrolled'] },
            { cat:'Manpower', color:'#534AB7', bg:'#EEEDFE', causes:['2 operators trained vs 5 needed','Shift handover informal'] },
          ].map(({ cat, color, bg, causes }) => (
            <div key={cat} style={{ background:bg, border:`1px solid ${color}22`, borderRadius:8, padding:'10px' }}>
              <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:0.5, marginBottom:6 }}>{cat}</div>
              {causes.map(c => (
                <div key={c} style={{ fontSize:11, color:'#4E4B45', lineHeight:1.5, marginBottom:3 }}>→ {c}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'waste',
    icon: '⚠️',
    name: 'Waste Identification',
    label: '8 wastes. See them all. Fix the worst ones.',
    body: 'Walk through all eight DOWNTIME wastes for any step. Select what you observe, add a specific note for each. Waste data rolls up to your Report automatically — giving you a prioritised improvement backlog without any extra work.',
    badge: 'Free',
    badgeBg: '#EDF9F5', badgeColor: '#0F6E56',
    preview: () => (
      <div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
          {[
            { id:'T', label:'Transport', selected:false },
            { id:'I', label:'Inventory', selected:true, note:'18 units queued before step' },
            { id:'M', label:'Motion', selected:false },
            { id:'W', label:'Waiting', selected:true, note:'Avg 4.2 min idle between batches' },
            { id:'O', label:'Overproduction', selected:false },
            { id:'O2', label:'Over-processing', selected:false },
            { id:'D', label:'Defects', selected:true, note:'3.2% rework rate — weld joints' },
            { id:'S', label:'Skills', selected:false },
          ].map(w => (
            <div key={w.id}>
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:7, background: w.selected?'rgba(192,64,42,0.05)':'#F8F7F5', border:`1px solid ${w.selected?'rgba(192,64,42,0.3)':'#D8D5CE'}`, cursor:'default' }}>
                <div style={{ width:14, height:14, borderRadius:3, background: w.selected?'#C0402A':'#EEE', border:`1px solid ${w.selected?'#C0402A':'#CCC'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {w.selected && <span style={{ color:'#fff', fontSize:9, fontWeight:700 }}>✓</span>}
                </div>
                <span style={{ fontSize:11, fontWeight: w.selected?600:400, color: w.selected?'#C0402A':'#6B6760' }}>{w.label}</span>
              </div>
              {w.selected && w.note && (
                <div style={{ padding:'4px 8px', background:'rgba(192,64,42,0.04)', borderRadius:'0 0 6px 6px', fontSize:10, color:'#C0402A', borderLeft:'2px solid #C0402A', marginTop:1 }}>{w.note}</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, padding:'6px 12px', background:'#FEF2F0', borderRadius:6, fontSize:11, color:'#C0402A', fontWeight:600 }}>3 wastes identified · This step is a priority for Kaizen</div>
      </div>
    ),
  },
  {
    id: 'kaizen',
    icon: '⚡',
    name: 'Kaizen Events',
    label: 'Every improvement idea gets an owner and a deadline',
    body: 'Log Kaizen events directly on the step where the problem lives. Set category, priority, owner, and due date. Open events show on your VSM Map as burst markers — the standard notation for improvement in progress. Nothing gets lost between shifts.',
    badge: 'Free',
    badgeBg: '#EDF9F5', badgeColor: '#0F6E56',
    preview: () => (
      <div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { id:'KZ-001', title:'SMED event — reduce changeover from 38min to 18min', cat:'Delivery', priority:'high', status:'in-progress', owner:'J.Torres', due:'Apr 15', color:'#C49B2E' },
            { id:'KZ-002', title:'Fixture inspection added to pre-shift checklist', cat:'Quality', priority:'critical', status:'complete', owner:'R.Singh', due:'Apr 3', color:'#2A9E82' },
            { id:'KZ-003', title:'5S audit of weld consumables storage area', cat:'5S', priority:'medium', status:'open', owner:'T.Nakamura', due:'Apr 22', color:'#8E8A82' },
          ].map(k => (
            <div key={k.id} style={{ background:'#FFFFFF', border:'0.5px solid #D8D5CE', borderRadius:9, padding:'12px 14px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:8 }}>
                <div style={{ fontSize:10, color:'#8E8A82', fontFamily:'monospace' }}>{k.id}</div>
                <div style={{ display:'flex', gap:5 }}>
                  <span style={{ fontSize:8, padding:'2px 7px', borderRadius:100, background: k.status==='complete'?'rgba(42,158,130,0.12)':k.status==='in-progress'?'rgba(196,155,46,0.12)':'rgba(142,138,130,0.12)', color: k.status==='complete'?'#2A9E82':k.status==='in-progress'?'#C49B2E':'#8E8A82', fontWeight:700 }}>
                    {k.status==='in-progress'?'In Progress':k.status==='complete'?'Complete':'Open'}
                  </span>
                  <span style={{ fontSize:8, padding:'2px 7px', borderRadius:100, background:'rgba(192,64,42,0.08)', color:'#C0402A', fontWeight:700 }}>{k.priority}</span>
                </div>
              </div>
              <div style={{ fontSize:12, color:'#242220', fontWeight:600, lineHeight:1.4, marginBottom:8 }}>{k.title}</div>
              <div style={{ display:'flex', gap:12, fontSize:10, color:'#8E8A82' }}>
                <span>👤 {k.owner}</span>
                <span>📅 {k.due}</span>
                <span>📁 {k.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function ToolShowcase() {
  const [active, setActive] = useState(0)
  const tool = TOOLS_DATA[active]

  return (
    <section id="tools" style={{ padding: '80px 0', background: '#F8F7F5', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: '#8E8A82', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>What's inside</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#242220', marginBottom: 10, fontFamily: serif }}>Every tool a lean team needs</h2>
          <p style={{ fontSize: 15, color: '#6B6760', maxWidth: 500, lineHeight: 1.75 }}>All connected to your value stream. The work you do feeds the reports you need.</p>
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {TOOLS_DATA.map((t, i) => (
            <button key={t.id} onClick={() => setActive(i)} style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: active===i ? 700 : 400,
              background: active===i ? '#C49B2E' : '#FFFFFF',
              color: active===i ? '#FFFFFF' : '#6B6760',
              border: active===i ? 'none' : '0.5px solid #D8D5CE',
              cursor: 'pointer', transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span> {t.name}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, alignItems: 'start' }}>

          {/* Left: copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{tool.icon}</span>
              <span style={{ fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: tool.badgeBg, color: tool.badgeColor, letterSpacing: 0.5, fontFamily: 'monospace' }}>{tool.badge}</span>
            </div>
            <h3 style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 700, color: '#242220', marginBottom: 12, lineHeight: 1.25, fontFamily: serif }}>
              {tool.label}
            </h3>
            <p style={{ fontSize: 14, color: '#6B6760', lineHeight: 1.85, marginBottom: 28 }}>{tool.body}</p>
            <a href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#C49B2E', color: '#fff', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              Try it free →
            </a>
          </div>

          {/* Right: live preview */}
          <div style={{ background: '#FFFFFF', border: '0.5px solid #D8D5CE', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            {/* App chrome */}
            <div style={{ background: '#F0F0F4', borderBottom: '0.5px solid #D8D5CE', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#FF6B6B','#F4A623','#1DD1A1'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c, opacity:0.7 }} />)}
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#8E8A82', fontFamily: 'monospace' }}>{tool.name} — Step: Foam & Fabric</div>
              {/* VeSiMy brand */}
              <div style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px', background:'rgba(196,155,46,0.1)', border:'1px solid rgba(196,155,46,0.2)', borderRadius:5 }}>
                <svg width="10" height="11" viewBox="0 0 100 108" fill="none"><defs><linearGradient id="vb" x1="8" y1="0" x2="92" y2="108" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#FFD56C"/><stop offset="50%" stopColor="#D4A208"/><stop offset="100%" stopColor="#6426A0"/></linearGradient></defs><path d="M8 8L38 88L50 64L62 88L92 8H72L50 60L28 8Z" fill="url(#vb)"/></svg>
                <span style={{ fontSize:9, fontWeight:700, color:'#8E8A82', letterSpacing:0.5, fontFamily:'Palatino Linotype,serif' }}>VeSiMy</span>
              </div>
            </div>
            <div style={{ padding: '18px 16px' }}>
              {tool.preview()}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [pce, setPce] = useState(36)
  const [bnVis, setBnVis] = useState(true)
  const dir = useRef(1)

  useEffect(() => {
    const t1 = setInterval(() => {
      setPce(p => {
        const next = p + dir.current * 0.4
        if (next > 40 || next < 33) dir.current *= -1
        return next
      })
    }, 100)
    const t2 = setInterval(() => setBnVis(v => !v), 950)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div style={{ background: '#F8F7F5', color: '#242220', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .reveal { opacity:0; animation: fadeUp 0.7s ease forwards; }
        .r1 { animation-delay:0.05s } .r2 { animation-delay:0.18s }
        .r3 { animation-delay:0.30s } .r4 { animation-delay:0.44s }
        .r5 { animation-delay:0.56s }
        @keyframes logoFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-7px) rotate(1deg); }
        }
        @keyframes logoGlow {
          0%,100% { filter: drop-shadow(0 4px 18px rgba(196,155,46,0.22)) drop-shadow(0 0 0px rgba(140,68,204,0)); }
          50%     { filter: drop-shadow(0 8px 32px rgba(196,155,46,0.45)) drop-shadow(0 0 18px rgba(140,68,204,0.25)); }
        }
        @keyframes wordmarkIn {
          from { opacity:0; transform: translateX(-12px) skewX(-4deg); }
          to   { opacity:1; transform: translateX(0)     skewX(0deg); }
        }
        @keyframes taglineIn {
          from { opacity:0; letter-spacing: 6px; }
          to   { opacity:1; letter-spacing: 3px; }
        }
        @keyframes shimmerSweep {
          0%   { background-position: -200% center; }
          100% { background-position: 300% center; }
        }
        .logo-mark-anim {
          animation: logoFloat 4.2s ease-in-out infinite, logoGlow 4.2s ease-in-out infinite;
        }
        .wordmark-anim {
          opacity:0;
          animation: wordmarkIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards;
        }
        .tagline-anim {
          opacity:0;
          animation: taglineIn 0.9s ease 0.6s forwards;
        }
        .nav-link { color:#6B6760; text-decoration:none; font-size:13px; transition:color 0.15s; }
        .nav-link:hover { color:#242220; }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;padding:40px 20px 0!important;}
          .hero-text{padding-right:0!important;}
          .vsm-card{display:none!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .tools-grid{grid-template-columns:1fr 1fr!important;}
          .plan-grid{grid-template-columns:1fr!important;}
          .hide-mobile{display:none!important;}
          .nav-pad{padding:0 20px!important;}
          .sec-pad{padding:40px 20px!important;}
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="nav-pad" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 60, background: '#FFFFFF', borderBottom: '0.5px solid #D8D5CE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={30} />
          <VeSiMyWordmark size={19} />
        </div>
        <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
          {[['Tools', '#tools'], ['Pricing', '#pricing'], ['Blog', '/blog'], ['Learn', '/learn']].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #D8D5CE', borderRadius: 8, fontSize: 13, color: '#4E4B45', textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{ padding: '7px 18px', background: '#C49B2E', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
            Start free
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr', minHeight: 620, alignItems: 'center', padding: '56px 48px 0', gap: 32, background: '#F8F7F5', overflow: 'hidden' }}>

        <div className="hero-text" style={{ paddingRight: 24 }}>

          {/* Hero Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div className="logo-mark-anim" style={{ flexShrink: 0 }}>
              <VLogoMark size={88} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="wordmark-anim">
                <VeSiMyWordmark size={52} />
              </div>
              <span className="tagline-anim" style={{
                fontSize: 11, letterSpacing: 3, fontFamily: 'monospace',
                textTransform: 'uppercase', color: '#8E8A82', fontWeight: 600,
              }}>
                Continuous Improvement Platform
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="reveal r2" style={{ fontSize: 'clamp(36px,4vw,54px)', lineHeight: 1.08, fontWeight: 700, color: '#242220', marginBottom: 18, letterSpacing: -0.5, fontFamily: serif }}>
            Map the waste.<br /><span style={{ color: '#C49B2E' }}>Kill</span> the waste.<br />Repeat.
          </h1>

          {/* V Trade Statement */}
          <div className="reveal r3" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, padding: '14px 16px', background: '#FFFFFF', border: '1px solid #D8D5CE', borderLeft: '3px solid #C49B2E', borderRadius: '0 10px 10px 0' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#C49B2E', fontFamily: serif, lineHeight: 1 }}>V</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#242220', lineHeight: 1.3 }}>Add Value to your process and yourself</div>
              <div style={{ fontSize: 12, color: '#8E8A82', marginTop: 3, lineHeight: 1.5 }}>Value Stream · Value Add · Value for your team</div>
            </div>
          </div>

          <p className="reveal r3" style={{ fontSize: 15, color: '#6B6760', lineHeight: 1.8, marginBottom: 30, maxWidth: 420 }}>
            A complete lean CI toolkit — VSM, time study, fishbone, 5&nbsp;Why, kaizen, PDCA — all connected, all free.
          </p>

          <div className="reveal r4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ padding: '13px 28px', background: '#C49B2E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start your 14-day free trial <ArrowRightIcon size={14} color="#fff" />
            </Link>
            <Link href="/auth/signup" style={{ padding: '13px 20px', background: '#fff', color: '#4E4B45', border: '1px solid #D8D5CE', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              See reference project →
            </Link>
          </div>

          <p className="reveal r5" style={{ fontSize: 11, color: '#8E8A82', marginTop: 14 }}>
            14-day free trial · No credit card · Cancel anytime
          </p>
        </div>

        {/* ── VSM PREVIEW CARD ── */}
        <div className="vsm-card" style={{ background: '#fff', borderRadius: '16px 16px 0 0', border: '1px solid #D8D5CE', borderBottom: 'none', padding: '16px 16px 0', boxShadow: '0 -4px 32px rgba(0,0,0,0.08)', transform: 'perspective(900px) rotateX(2deg)', transformOrigin: 'bottom center' }}>

          {/* Card top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, paddingBottom: 11, borderBottom: '0.5px solid #ECEAE6' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#E8A49A', '#DEB96A', '#7DCAB5'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
            </div>
            <span style={{ fontSize: 10, color: '#8E8A82', flex: 1, marginLeft: 5 }}>Seat Assembly Line 4 — Current State VSM</span>
            <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 999, fontWeight: 700, background: '#EEF4FB', color: '#1A4F8A' }}>ISO 22468:2020</span>
          </div>

          {/* KPIs */}
          <div style={{ display: 'flex', border: '0.5px solid #D8D5CE', borderRadius: 7, overflow: 'hidden', marginBottom: 12 }}>
            {[
              { label: 'Total CT', val: '8m 20s', color: '#C49B2E' },
              { label: 'Takt', val: '2m 00s', color: '#C49B2E' },
              { label: 'PCE', val: `${Math.round(pce)}%`, color: '#C0402A' },
              { label: 'WIP', val: '47', color: '#C49B2E' },
              { label: 'Open KZ', val: '4', color: '#C49B2E' },
            ].map((k, i) => (
              <div key={i} style={{ flex: 1, padding: '6px 8px', textAlign: 'center', borderRight: i < 4 ? '0.5px solid #D8D5CE' : 'none' }}>
                <div style={{ fontSize: 7, color: '#8E8A82', letterSpacing: 1.2, textTransform: 'uppercase' }}>{k.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: k.color, marginTop: 1 }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* 3D ISO Steps */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, overflowX: 'auto', paddingBottom: 2 }}>
            <IsoStep name="Material" sub="Staging" ct="NNVA · 45s" type="nnva" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <WipCoins n={12} />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <IsoStep name="Frame" sub="Sub-Asm" ct="VA · 98s" type="va" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <WipCoins n={6} />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <div style={{ opacity: bnVis ? 1 : 0.7, transition: 'opacity 0.4s' }}>
              <IsoStep name="Foam &amp; Fabric" sub="" ct="NVA · 145s" type="va" isBn />
            </div>
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <WipCoins n={8} color="#E8A49A" bg="#FEF2F0" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <IsoStep name="Electrical" sub="Integr." ct="VA · 88s" type="va" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <IsoStep name="Final" sub="QC" ct="NNVA · 72s" type="nnva" />
          </div>

          {/* Sawtooth timeline */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 14, fontSize: 7, color: '#8E8A82', marginBottom: 4, fontFamily: 'monospace' }}>
              <span style={{ color: '#2A9E82' }}>▲ value-add</span>
              <span style={{ color: '#E8A49A' }}>▼ wait/queue</span>
              <span style={{ color: '#C0402A' }}>— — takt 120s</span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: 40, gap: 2, borderBottom: '1px solid #D8D5CE' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, borderTop: '1.5px dashed #C0402A' }}>
                <span style={{ position: 'absolute', right: 0, fontSize: 7, color: '#C0402A', fontWeight: 700, fontFamily: 'monospace', bottom: 2 }}>TAKT</span>
              </div>
              {[
                { h: 9,  bg: '#DEB96A' }, { h: 20, bg: '#E8A49A', top: true }, { h: 18, bg: '#7DCAB5' },
                { h: 11, bg: '#E8A49A', top: true }, { h: 34, bg: '#C0402A' },
                { h: 16, bg: '#E8A49A', top: true }, { h: 16, bg: '#7DCAB5' },
                { h: 9,  bg: '#E8A49A', top: true }, { h: 13, bg: '#DEB96A' },
              ].map((b, i) => (
                <div key={i} style={{ width: 18, height: b.h, background: b.bg, opacity: b.top ? 0.45 : 0.82, borderRadius: '2px 2px 0 0', alignSelf: b.top ? 'flex-start' : 'flex-end', flexShrink: 0 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY MARQUEE ─────────────────────────────────────────────────── */}
      <div style={{ padding: '22px 48px', background: '#FFFFFF', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE', overflow: 'hidden' }}>
        <div style={{ fontSize: 10, color: '#8E8A82', textAlign: 'center', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>
          Built for lean teams across manufacturing industries
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 56, alignItems: 'center', animation: 'mq 22s linear infinite', width: 'max-content' }}>
            {['Automotive', 'Aerospace', 'Food & Beverage', 'Medical Devices', 'Logistics', 'Electronics', 'Pharmaceuticals', 'Industrial', 'Automotive', 'Aerospace', 'Food & Beverage', 'Medical Devices', 'Logistics', 'Electronics', 'Pharmaceuticals', 'Industrial'].map((n, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 700, color: '#C8C5BC', whiteSpace: 'nowrap', letterSpacing: 0.5, textTransform: 'uppercase' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: '#D8D5CE' }}>
        {[
          { icon: '📊', bg: '#EDF9F5', title: 'Value Stream Mapping', body: 'ISO 22468:2020 notation. Bottlenecks flagged automatically. Export A3 maps and full ISO improvement reports in one click.' },
          { icon: '🔗', bg: '#FAEEDA', title: 'Every CI tool connected', body: 'Time Study, Fishbone, 5 Why, Waste ID, Kaizen, PDCA, Yamazumi, Standard Work — all linked to your steps, all feeding one report.' },
          { icon: '🛡', bg: '#EEEDFE', title: '14-day free trial.', body: 'Start today — no credit card required. Get full access to every tool for 14 days with up to 3 projects. Then choose the plan that fits.' },
        ].map(f => (
          <div key={f.title} style={{ background: '#FFFFFF', padding: '28px 24px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#242220', marginBottom: 7 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.7 }}>{f.body}</div>
          </div>
        ))}
      </div>

      {/* ── TOOL SHOWCASE ────────────────────────────────────────────────────── */}
      <ToolShowcase />

      {/* ── QUOTE ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '60px 48px', textAlign: 'center', background: '#FFFFFF', borderTop: '0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 500, color: '#242220', lineHeight: 1.55, marginBottom: 14, fontFamily: serif }}>
            "This could serve as <em style={{ color: '#C49B2E', fontStyle: 'italic' }}>Mission Control</em> — to drive progress and allow for correction and modification along the way."
          </p>
          <p style={{ fontSize: 13, color: '#8E8A82' }}>Max Singh · Creator of VeSiMy</p>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="sec-pad" style={{ padding: '64px 48px', background: '#F8F7F5' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, color: '#8E8A82', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: '#242220', marginBottom: 10, fontFamily: serif }}>Simple, honest pricing.</h2>
            <p style={{ fontSize: 15, color: '#6B6760', maxWidth: 480, margin: '0 auto' }}>Try everything free for 14 days — no credit card required. Upgrade when you're ready.</p>
          </div>

          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {(Object.entries(PLANS) as any[]).map(([key, plan]) => {
              const isPro = key === 'pro'
              const isLife = key === 'lifetime'
              const isEnt = key === 'enterprise'
              return (
                <div key={key} style={{ background: '#FFFFFF', border: isPro || isLife ? '1.5px solid rgba(196,155,46,0.4)' : '0.5px solid #D8D5CE', borderRadius: 16, padding: '26px 22px', position: 'relative' }}>
                  {(isPro || isLife) && (
                    <div style={{ display: 'inline-flex', background: '#C49B2E', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 14px', borderRadius: 999, letterSpacing: 1.5, marginBottom: 12 }}>
                      {isLife ? '👑 LAUNCH WEEK' : 'MOST POPULAR'}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#C49B2E', letterSpacing: 2, fontWeight: 700, marginBottom: 6, fontFamily: 'monospace', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#242220', marginBottom: 6, lineHeight: 1, fontFamily: serif }}>
                    {isEnt ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {!isEnt && plan.price !== null && Number(plan.price) > 0 && (
                      <span style={{ fontSize: 13, fontWeight: 400, color: '#8E8A82', marginLeft: 4 }}>{isLife ? ' once' : '/mo'}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#6B6760', marginBottom: 18, lineHeight: 1.65, minHeight: 40 }}>{plan.description}</p>
                  <ul style={{ listStyle: 'none', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {plan.features.map((f: string) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#4E4B45', lineHeight: 1.5 }}>
                        <CheckIcon size={13} color="#C49B2E" style={{ marginTop: 3, flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={isEnt ? '/enterprise' : isLife ? '/beta' : plan.price === 0 ? '/auth/signup' : `/auth/signup?plan=${key}`}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '11px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: isPro || isLife ? '#C49B2E' : 'transparent', color: isPro || isLife ? '#fff' : '#4E4B45', border: isPro || isLife ? 'none' : '1px solid #D8D5CE' }}
                  >
                    {plan.cta}
                  </Link>
                  {isLife && (
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#C49B2E', marginTop: 10 }}>
                      Launch Week open → <Link href="/beta" style={{ color: '#C49B2E' }}>Claim Gold Standard</Link>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href="/pricing" style={{ fontSize: 13, color: '#8E8A82', textDecoration: 'none', borderBottom: '1px solid #D8D5CE', paddingBottom: 2 }}>
              View full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#242220', padding: '72px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: '#F8F7F5', marginBottom: 10, fontFamily: serif }}>
          Stop describing waste.<br />Start <span style={{ color: '#C49B2E' }}>eliminating</span> it.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 28 }}>Start your 14-day free trial today. No credit card. Cancel anytime.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ padding: '14px 38px', background: '#C49B2E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Start free trial
          </Link>
          <Link href="/auth/signup" style={{ padding: '14px 24px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, fontSize: 15, textDecoration: 'none' }}>
            Load reference project →
          </Link>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 16 }}>
          ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned
        </p>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '0.5px solid #D8D5CE', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} />
        </div>
        <div style={{ display: 'flex', gap: 22, fontSize: 12, color: '#8E8A82', flexWrap: 'wrap' }}>
          {[['About', '/about'], ['Blog', '/blog'], ['Changelog', '/changelog'], ['Pricing', '/pricing'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', 'mailto:founder@vesimy.com']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C49B2E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8E8A82')}>
              {l}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 11, color: '#B8B4AC', letterSpacing: 1.5, fontFamily: 'monospace', textTransform: 'uppercase' }}>© 2026 VeSiMy</span>
      </footer>
    </div>
  )
}
