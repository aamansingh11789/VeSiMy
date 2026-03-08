// @ts-nocheck
'use client'
// ── app/demo/page.tsx — Interactive Demo ──────────────────────────────────────
// Pre-populated sample project — no login required

import { useState } from 'react'
import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'
const GOLD  = '#D4A208'

// ── Sample dataset — automotive door assembly VSM ─────────────────────────────
const SAMPLE_PROJECT = {
  name:         'Automotive Door Assembly — Current State',
  industry:     'Automotive',
  customer:     'OEM Assembly Line',
  supplier:     'Steel Stamping Plant',
  demand:       240,
  working_hours: 8,
  takt_time:    120,
}

const SAMPLE_STEPS = [
  {
    id:'s1', position:0, name:'Steel Blank Receiving',   department:'Receiving',
    wait_time:3600, trans_time:180, wip:50,  flow_type:'push',
    operators:2, uptime:95, defect_rate:0.5,
    ct: 45, notes:'Raw blanks arrive from stamping plant. 8-hr batch delivery.',
    wastes:['Transportation','Inventory'],
    kzItems:[{title:'Reduce batch size from 8hr to 4hr',status:'open',priority:'high',owner:'Max S.'}],
    rootCause:'Long supplier lead time forces large batch',
  },
  {
    id:'s2', position:1, name:'Stamping / Press',        department:'Stamping',
    wait_time:1800, trans_time:120, wip:30,  flow_type:'push',
    operators:3, uptime:88, defect_rate:1.2, setup_time:900,
    ct: 22, notes:'Progressive die press. Setup: 15 min. Run at 160 SPM.',
    wastes:['Waiting','Overproduction'],
    kzItems:[{title:'SMED study — target 8min setup',status:'in-progress',priority:'critical',owner:'Plant Eng.'}],
    rootCause:'Manual die changeover with no standardized process',
  },
  {
    id:'s3', position:2, name:'Weld Sub-Assembly',       department:'Welding',
    wait_time:2700, trans_time:90,  wip:20,  flow_type:'fifo',
    operators:4, uptime:91, defect_rate:2.1,
    ct: 95, notes:'MIG weld of inner reinforcement to outer skin. 6 weld points.',
    wastes:['Defects','Motion'],
    kzItems:[{title:'Implement weld fixture for repeatability',status:'open',priority:'high',owner:'Quality Eng.'}],
    rootCause:'Fixture variation causing 2.1% rework rate',
  },
  {
    id:'s4', position:3, name:'Hem / Clinch Operation',  department:'Fabrication',
    wait_time:600,  trans_time:60,  wip:10,  flow_type:'fifo',
    operators:2, uptime:96, defect_rate:0.3,
    ct: 38, notes:'Hem flanges around perimeter. 4 stations in sequence.',
    wastes:[],
    kzItems:[],
  },
  {
    id:'s5', position:4, name:'E-Coat / Paint Prep',     department:'Paint',
    wait_time:7200, trans_time:300, wip:80,  flow_type:'push',
    operators:2, uptime:82, defect_rate:3.5,
    ct: 1800, notes:'Electrophoretic coating. 30-min cure cycle. Batch of 40 doors.',
    wastes:['Waiting','Inventory','Overprocessing'],
    kzItems:[{title:'Reduce cure time with temp profile optimization',status:'open',priority:'normal',owner:'Paint Eng.'}],
    rootCause:'Batch process — cannot process single piece',
  },
  {
    id:'s6', position:5, name:'Final Assembly & QC',     department:'Assembly',
    wait_time:900,  trans_time:180, wip:15,  flow_type:'pull',
    operators:5, uptime:97, defect_rate:0.8, completion_accuracy:98,
    ct: 180, notes:'Install hardware, seals, glass. Full 47-point quality check.',
    wastes:['Motion','Waiting'],
    kzItems:[
      {title:'Implement 5S in assembly cell',status:'complete',priority:'normal',owner:'Team Lead'},
      {title:'Reduce QC check from 47 to 30 points (risk-based)',status:'open',priority:'high',owner:'Quality Mgr'},
    ],
  },
  {
    id:'s7', position:6, name:'Pack & Ship to OEM',       department:'Shipping',
    wait_time:1800, trans_time:0,   wip:25,  flow_type:'push',
    operators:2, uptime:99, defect_rate:0.1,
    ct: 25, notes:'Custom racks — 6 doors per rack. Daily milk-run to OEM.',
    wastes:['Transportation','Inventory'],
    kzItems:[],
  },
]

const fmtS = (s: number) => {
  if (!s && s !== 0) return '—'
  if (s < 60)   return `${s.toFixed(0)}s`
  if (s < 3600) return `${(s/60).toFixed(1)}m`
  return `${(s/3600).toFixed(2)}h`
}

const WASTE_COLORS: Record<string,string> = {
  'Transportation':'#6CB9FC','Inventory':'#F4A623','Motion':'#8C44CC',
  'Waiting':'#FF6B6B','Overproduction':'#E84393','Overprocessing':'#1DD1A1',
  'Defects':'#FF6B6B',
}
const KZ_COLORS = { open:'#FF6B6B','in-progress':'#F4A623',complete:'#1DD1A1' }

// ── VSM Diagram ───────────────────────────────────────────────────────────────
function VSMDiagram({ steps }: { steps: typeof SAMPLE_STEPS }) {
  const totalCT   = steps.reduce((a,s) => a+s.ct, 0)
  const totalWait = steps.reduce((a,s) => a+(s.wait_time||0), 0)
  const pce       = ((totalCT/(totalCT+totalWait))*100).toFixed(0)

  return (
    <div style={{ overflowX:'auto', paddingBottom:16 }}>
      {/* Timeline bar */}
      <div style={{ display:'flex', gap:0, marginBottom:8, minWidth:700 }}>
        {steps.map((s,i) => {
          const pct = ((s.ct + (s.wait_time||0)) / (totalCT+totalWait) * 100).toFixed(0)
          return (
            <div key={s.id} style={{ flex:`${pct} 0 0`, minWidth:40 }}>
              <div style={{ height:6, background:`rgba(212,162,8,${0.3+i*0.1})`, borderRadius:i===0?'4px 0 0 4px':i===steps.length-1?'0 4px 4px 0':'0' }} />
            </div>
          )
        })}
      </div>
      {/* Step boxes */}
      <div style={{ display:'flex', gap:8, alignItems:'stretch', minWidth:700 }}>
        {steps.map((s,i) => (
          <div key={s.id} style={{ flex:1, minWidth:100 }}>
            {/* Box */}
            <div style={{ background:'rgba(13,13,34,0.9)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:8, padding:'10px 8px', textAlign:'center', marginBottom:8 }}>
              <div style={{ fontSize:10, color:GOLD, fontWeight:700, fontFamily:'monospace', marginBottom:4 }}>{String(i+1).padStart(2,'0')}</div>
              <div style={{ fontSize:11, fontWeight:600, color:'#EAE8F4', lineHeight:1.3, marginBottom:6 }}>{s.name}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                <span style={{ fontSize:10, color:GOLD }}>CT: {fmtS(s.ct)}</span>
                <span style={{ fontSize:10, color:'#7070A0' }}>{s.operators}op · {s.uptime}%↑</span>
                {s.defect_rate>0 && <span style={{ fontSize:10, color:'#FF6B6B' }}>{s.defect_rate}% def</span>}
              </div>
            </div>
            {/* Arrow */}
            {i < steps.length-1 && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, marginBottom:4 }}>
                <div style={{ fontSize:10, color:'#F4A623' }}>W:{fmtS(s.wait_time||0)}</div>
                <div style={{ color:'#38385C', fontSize:14 }}>→</div>
                <div style={{ fontSize:10, color:'#7070A0' }}>WIP:{s.wip}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* PCE bar */}
      <div style={{ marginTop:16, background:'rgba(8,8,24,0.8)', borderRadius:8, padding:'12px 16px', border:'1px solid rgba(40,40,92,0.4)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:11, color:'#7070A0', fontFamily:'monospace' }}>PROCESS CYCLE EFFICIENCY</span>
          <span style={{ fontSize:13, fontWeight:700, color:Number(pce)>50?'#1DD1A1':Number(pce)>25?'#F4A623':'#FF6B6B' }}>{pce}%</span>
        </div>
        <div style={{ height:8, background:'rgba(40,40,92,0.4)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ width:`${pce}%`, height:'100%', background:'linear-gradient(90deg,#D4A208,#1DD1A1)', borderRadius:4, transition:'width 1s ease' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:'#38385C' }}>
          <span>Total CT: {fmtS(totalCT)}</span>
          <span>Total Wait: {fmtS(totalWait)}</span>
          <span>Lead Time: {fmtS(totalCT+totalWait)}</span>
        </div>
      </div>
    </div>
  )
}

export default function DemoPage() {
  const [tab, setTab] = useState<'vsm'|'builder'|'kaizen'|'report'>('vsm')
  const [selectedStep, setSelectedStep] = useState<typeof SAMPLE_STEPS[0]|null>(null)

  const totalCT   = SAMPLE_STEPS.reduce((a,s) => a+s.ct, 0)
  const totalWait = SAMPLE_STEPS.reduce((a,s) => a+(s.wait_time||0), 0)
  const allWastes = SAMPLE_STEPS.flatMap(s => s.wastes)
  const allKaizen = SAMPLE_STEPS.flatMap(s => s.kzItems.map(k => ({ ...k, stepName:s.name })))
  const openKz    = allKaizen.filter(k => k.status !== 'complete').length
  const pce       = ((totalCT/(totalCT+totalWait))*100).toFixed(0)

  const TABS = [
    { id:'vsm',     label:'〜 VSM Map'     },
    { id:'builder', label:'⊞ Step Builder' },
    { id:'kaizen',  label:'⚡ Kaizen Board' },
    { id:'report',  label:'📄 Report'      },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#03030D', color:'#EAE8F4' }}>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:56,
        borderBottom:'1px solid rgba(26,26,64,0.6)', background:'rgba(3,3,13,0.95)', backdropFilter:'blur(16px)',
        position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <VesimyLogo size={28} showText />
          </Link>
          <span style={{ fontSize:11, color:'#38385C', fontFamily:'monospace', letterSpacing:2 }}>DEMO</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/auth/signup" style={{ padding:'7px 20px', borderRadius:8, fontSize:13, fontWeight:700, color:'#03030D', textDecoration:'none', background:'linear-gradient(135deg,#C49510,#D4A208)' }}>
            Try Free — No Credit Card
          </Link>
        </div>
      </nav>

      {/* Project header */}
      <div style={{ padding:'20px 32px 0', borderBottom:'1px solid rgba(26,26,64,0.4)', background:'#080818' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:4 }}>
              DEMO PROJECT · READ-ONLY
            </div>
            <h1 style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:'#EAE8F4', margin:0 }}>
              {SAMPLE_PROJECT.name}
            </h1>
            <div style={{ fontSize:12, color:'#7070A0', marginTop:4 }}>
              {SAMPLE_PROJECT.industry} · Customer: {SAMPLE_PROJECT.customer} · Demand: {SAMPLE_PROJECT.demand} units/day · Takt: {fmtS(SAMPLE_PROJECT.takt_time)}
            </div>
          </div>
          <div style={{ background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:10, padding:'12px 20px', textAlign:'center' }}>
            <div style={{ fontSize:10, color:'#7070A0', fontFamily:'monospace', letterSpacing:1, marginBottom:2 }}>PCE</div>
            <div style={{ fontFamily:serif, fontSize:28, fontWeight:700, color:GOLD }}>{pce}%</div>
            <div style={{ fontSize:10, color:'#38385C' }}>Lean target: &gt;30%</div>
          </div>
        </div>

        {/* Metrics row */}
        <div style={{ display:'flex', overflowX:'auto', gap:0, borderTop:'1px solid rgba(26,26,64,0.4)', margin:'0 -32px', padding:'0 32px' }}>
          {[
            ['STEPS',    SAMPLE_STEPS.length],
            ['TOTAL CT', fmtS(totalCT)],
            ['TOTAL WAIT',fmtS(totalWait)],
            ['OPEN KZ',  openKz],
            ['WASTES',   allWastes.length],
            ['TAKT',     fmtS(SAMPLE_PROJECT.takt_time)],
          ].map(([label, value]) => (
            <div key={label as string} style={{ padding:'10px 18px', borderRight:'1px solid rgba(26,26,64,0.4)', minWidth:80, textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:9, color:'#38385C', letterSpacing:1.5, fontFamily:'monospace' }}>{label}</div>
              <div style={{ fontSize:16, fontWeight:700, color:GOLD, marginTop:2 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, margin:'0 -32px', padding:'0 32px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} style={{
              padding:'10px 18px', fontSize:12, fontWeight:500, background:'none', border:'none', cursor:'pointer',
              color: tab===t.id ? GOLD : '#7070A0',
              borderBottom: `2px solid ${tab===t.id ? GOLD : 'transparent'}`,
              marginBottom:-1, transition:'all 0.15s', whiteSpace:'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:32, maxWidth:1100, margin:'0 auto' }}>

        {/* ── VSM Tab ─────────────────────────────────────────────────── */}
        {tab === 'vsm' && (
          <div>
            <div style={{ marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h2 style={{ fontFamily:serif, fontSize:20, fontWeight:700, margin:'0 0 4px' }}>Value Stream Map — Current State</h2>
                <p style={{ fontSize:13, color:'#7070A0', margin:0 }}>Automotive door assembly · Stamping plant → OEM line</p>
              </div>
              <div style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8, padding:'8px 16px', fontSize:12, color:'#FF6B6B' }}>
                ⚠ PCE {pce}% — Industry avg 5–30% for batch operations
              </div>
            </div>

            {/* Supplier/Customer */}
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              {[['📦 SUPPLIER','Steel Stamping Plant'],['🏭 CUSTOMER','OEM Assembly Line']].map(([label,name]) => (
                <div key={label as string} style={{ background:'rgba(8,8,24,0.8)', border:'1px solid rgba(40,40,92,0.4)', borderRadius:8, padding:'10px 16px', textAlign:'center', minWidth:140 }}>
                  <div style={{ fontSize:10, color:'#7070A0', fontFamily:'monospace', marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#EAE8F4' }}>{name}</div>
                </div>
              ))}
            </div>

            <VSMDiagram steps={SAMPLE_STEPS} />
          </div>
        )}

        {/* ── Builder Tab ─────────────────────────────────────────────── */}
        {tab === 'builder' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:serif, fontSize:20, fontWeight:700, margin:0 }}>Process Steps</h2>
              <div style={{ fontSize:12, color:'#7070A0', background:'rgba(8,8,24,0.6)', border:'1px solid rgba(40,40,92,0.4)', borderRadius:8, padding:'6px 14px' }}>
                👆 Read-only demo — <Link href="/auth/signup" style={{ color:GOLD, textDecoration:'none' }}>Sign up to edit</Link>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {SAMPLE_STEPS.map((step, idx) => (
                <div key={step.id}
                  onClick={() => setSelectedStep(selectedStep?.id === step.id ? null : step)}
                  style={{ background:'#080818', border:`1px solid ${selectedStep?.id===step.id?'rgba(212,162,8,0.4)':'rgba(26,26,64,0.8)'}`, borderRadius:10, overflow:'hidden', cursor:'pointer', transition:'border-color 0.15s' }}>

                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#0D0D22', borderBottom:'1px solid rgba(26,26,64,0.6)' }}>
                    <span style={{ fontSize:11, color:'#38385C', fontFamily:'monospace', minWidth:24 }}>{String(idx+1).padStart(2,'0')}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, color:'#EAE8F4', fontSize:14 }}>{step.name}</div>
                      <div style={{ fontSize:11, color:'#7070A0' }}>{step.department}</div>
                    </div>
                    <div style={{ display:'flex', gap:12, fontSize:11, flexWrap:'wrap', justifyContent:'flex-end' }}>
                      <span style={{ color:GOLD }}>CT: {fmtS(step.ct)}</span>
                      <span style={{ color:'#7070A0' }}>{step.operators} op</span>
                      <span style={{ color:'#7070A0' }}>↑{step.uptime}%</span>
                      {step.defect_rate>0 && <span style={{ color:'#FF6B6B' }}>{step.defect_rate}% def</span>}
                      {step.wastes.length>0 && <span style={{ color:'#FF6B6B' }}>{step.wastes.length} waste{step.wastes.length!==1?'s':''}</span>}
                      {step.kzItems.filter(k=>k.status!=='complete').length > 0 && (
                        <span style={{ color:'#F4A623' }}>⚡{step.kzItems.filter(k=>k.status!=='complete').length} KZ</span>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {selectedStep?.id === step.id && (
                    <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
                      <div>
                        <div style={{ fontSize:10, color:'#38385C', fontFamily:'monospace', letterSpacing:1, marginBottom:4 }}>METRICS</div>
                        {[
                          ['Cycle Time', fmtS(step.ct)],
                          ['Wait Time', fmtS(step.wait_time||0)],
                          ['WIP Units', step.wip],
                          ['Transfer', fmtS(step.trans_time||0)],
                          ...(step.setup_time ? [['Setup Time', fmtS(step.setup_time)]] : []),
                        ].map(([l,v]) => (
                          <div key={l as string} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'3px 0', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
                            <span style={{ color:'#7070A0' }}>{l}</span>
                            <span style={{ color:'#EAE8F4', fontWeight:500 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      {step.wastes.length > 0 && (
                        <div>
                          <div style={{ fontSize:10, color:'#FF6B6B', fontFamily:'monospace', letterSpacing:1, marginBottom:8 }}>WASTE IDENTIFIED</div>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {step.wastes.map(w => (
                              <span key={w} style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background:`${WASTE_COLORS[w] || '#7070A0'}18`, color:WASTE_COLORS[w]||'#7070A0', border:`1px solid ${WASTE_COLORS[w]||'#7070A0'}30` }}>{w}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {step.notes && (
                        <div>
                          <div style={{ fontSize:10, color:'#38385C', fontFamily:'monospace', letterSpacing:1, marginBottom:4 }}>NOTES</div>
                          <p style={{ fontSize:12, color:'#7070A0', lineHeight:1.6, margin:0 }}>{step.notes}</p>
                        </div>
                      )}
                      {step.kzItems.length > 0 && (
                        <div>
                          <div style={{ fontSize:10, color:'#F4A623', fontFamily:'monospace', letterSpacing:1, marginBottom:8 }}>KAIZEN EVENTS ({step.kzItems.length})</div>
                          {step.kzItems.map((k,ki) => (
                            <div key={ki} style={{ fontSize:12, padding:'6px 10px', borderRadius:6, background:'rgba(8,8,24,0.8)', border:'1px solid rgba(26,26,64,0.6)', marginBottom:5 }}>
                              <div style={{ fontWeight:500, color:'#EAE8F4', marginBottom:2 }}>{k.title}</div>
                              <div style={{ display:'flex', gap:8 }}>
                                <span style={{ fontSize:10, color:(KZ_COLORS as any)[k.status]||'#7070A0' }}>{k.status}</span>
                                {k.owner && <span style={{ fontSize:10, color:'#38385C' }}>👤 {k.owner}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Kaizen Board Tab ─────────────────────────────────────────── */}
        {tab === 'kaizen' && (
          <div>
            <h2 style={{ fontFamily:serif, fontSize:20, fontWeight:700, marginBottom:20 }}>Kaizen Board</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {(['open','in-progress','complete'] as const).map(status => {
                const items = allKaizen.filter(k => k.status === status)
                const color = KZ_COLORS[status]
                const label = { open:'Open', 'in-progress':'In Progress', complete:'Complete' }[status]
                return (
                  <div key={status}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color, marginBottom:10, padding:'6px 0', borderBottom:`2px solid ${color}22` }}>
                      {label} ({items.length})
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {items.map((item, ki) => (
                        <div key={ki} style={{ background:'#080818', border:`1px solid rgba(26,26,64,0.8)`, borderRadius:8, padding:'12px 14px' }}>
                          <div style={{ fontWeight:600, fontSize:13, color:'#EAE8F4', marginBottom:6 }}>{item.title}</div>
                          <div style={{ fontSize:11, color:'#7070A0', marginBottom:4 }}>📍 {item.stepName}</div>
                          {item.owner && <div style={{ fontSize:11, color:'#7070A0' }}>👤 {item.owner}</div>}
                          {(item as any).priority && (
                            <span style={{ display:'inline-block', marginTop:6, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100,
                              background: (item as any).priority==='critical'?'rgba(255,107,107,0.1)': (item as any).priority==='high'?'rgba(244,166,35,0.1)':'rgba(16,144,212,0.1)',
                              color: (item as any).priority==='critical'?'#FF6B6B': (item as any).priority==='high'?'#F4A623':'#1090D4',
                            }}>{(item as any).priority}</span>
                          )}
                        </div>
                      ))}
                      {items.length === 0 && <div style={{ color:'#38385C', fontSize:12, textAlign:'center', padding:16 }}>None</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Report Tab ───────────────────────────────────────────────── */}
        {tab === 'report' && (
          <div style={{ maxWidth:740, margin:'0 auto' }}>
            <h2 style={{ fontFamily:serif, fontSize:22, fontWeight:700, marginBottom:24 }}>VSM Executive Report</h2>

            {/* Summary KPIs */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:12, marginBottom:28 }}>
              {[
                ['Lead Time', fmtS(totalCT+totalWait), 'From first step to ship'],
                ['Value-Add', fmtS(totalCT), 'Actual processing time'],
                ['PCE', `${pce}%`, 'Process Cycle Efficiency'],
                ['Open KZ', openKz, 'Improvement events active'],
                ['Total WIP', SAMPLE_STEPS.reduce((a,s)=>a+s.wip,0), 'Units in process'],
                ['Waste Types', [...new Set(allWastes)].length, 'Distinct waste categories'],
              ].map(([label,value,note]) => (
                <div key={label as string} style={{ background:'#0D0D22', borderRadius:8, padding:'12px 14px', border:'1px solid rgba(26,26,64,0.6)' }}>
                  <div style={{ fontSize:9, color:'#38385C', fontFamily:'monospace', letterSpacing:1.5 }}>{label}</div>
                  <div style={{ fontSize:20, fontWeight:700, color:GOLD, margin:'3px 0' }}>{value}</div>
                  <div style={{ fontSize:10, color:'#7070A0' }}>{note}</div>
                </div>
              ))}
            </div>

            {/* Bottleneck analysis */}
            <div style={{ marginBottom:24 }}>
              <h3 style={{ fontFamily:serif, fontSize:14, color:'#7070A0', textTransform:'uppercase', letterSpacing:2, borderBottom:'1px solid rgba(26,26,64,0.5)', paddingBottom:8, marginBottom:14 }}>BOTTLENECK ANALYSIS</h3>
              {[...SAMPLE_STEPS].sort((a,b) => (b.wait_time||0)-(a.wait_time||0)).slice(0,3).map((s,i) => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 14px', background:'#0D0D22', borderRadius:8, border:'1px solid rgba(26,26,64,0.6)', marginBottom:8 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{i===0?'🔴':i===1?'🟡':'🟢'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:'#EAE8F4', fontSize:13 }}>{s.name}</div>
                    <div style={{ fontSize:11, color:'#7070A0' }}>Wait: {fmtS(s.wait_time||0)} · WIP: {s.wip} · Defect: {s.defect_rate}%</div>
                  </div>
                  <div style={{ fontSize:11, color:i===0?'#FF6B6B':i===1?'#F4A623':'#1DD1A1', fontWeight:700 }}>
                    {i===0?'Critical':i===1?'High':'Medium'}
                  </div>
                </div>
              ))}
            </div>

            {/* Improvement opportunities */}
            <div>
              <h3 style={{ fontFamily:serif, fontSize:14, color:'#7070A0', textTransform:'uppercase', letterSpacing:2, borderBottom:'1px solid rgba(26,26,64,0.5)', paddingBottom:8, marginBottom:14 }}>TOP IMPROVEMENT OPPORTUNITIES</h3>
              {allKaizen.filter(k => k.status !== 'complete').slice(0,5).map((item,i) => (
                <div key={i} style={{ padding:'10px 14px', background:'#0D0D22', border:'1px solid rgba(26,26,64,0.6)', borderRadius:8, marginBottom:8, display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:500, color:'#EAE8F4', fontSize:13 }}>{item.title}</div>
                    <div style={{ fontSize:11, color:'#38385C' }}>{item.stepName}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:100,
                    background:(item as any).priority==='critical'?'rgba(255,107,107,0.1)':'rgba(244,166,35,0.1)',
                    color:(item as any).priority==='critical'?'#FF6B6B':'#F4A623' }}>{(item as any).priority||'normal'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA strip */}
        <div style={{ marginTop:48, background:'linear-gradient(135deg,rgba(212,162,8,0.05),rgba(100,38,160,0.05))', border:'1px solid rgba(212,162,8,0.2)', borderRadius:16, padding:'32px 40px', textAlign:'center' }}>
          <div style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:12 }}>YOUR REAL DATA COULD LOOK LIKE THIS</div>
          <h3 style={{ fontFamily:serif, fontSize:24, fontWeight:700, marginBottom:12 }}>
            Ready to map your own process?
          </h3>
          <p style={{ fontSize:14, color:'#7070A0', maxWidth:480, margin:'0 auto 24px', lineHeight:1.7 }}>
            This demo project took 5 minutes to build. Start with your own SOP, paste your process steps, or add them manually. Free forever.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/signup" style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, textDecoration:'none',
              background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', display:'inline-flex', alignItems:'center', gap:8 }}>
              Start Free — No Credit Card
            </Link>
            <Link href="/pricing" style={{ padding:'13px 24px', borderRadius:10, fontSize:14, fontWeight:600, textDecoration:'none',
              background:'rgba(8,8,24,0.8)', color:'#D4A208', border:'1px solid rgba(212,162,8,0.3)' }}>
              View Pricing
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
