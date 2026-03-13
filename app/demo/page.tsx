// @ts-nocheck
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'

const GOLD  = '#D4A208'
const SERIF = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ─────────────────────────────── DATA ────────────────────────────────────────
const SOP_TEXT = `AUTOMOTIVE DOOR ASSEMBLY — STANDARD OPERATING PROCEDURE
Doc: SOP-DOOR-001 | Rev B | Date: 2026-01-15

1. STEEL BLANK RECEIVING
   - Receive raw steel blanks from stamping plant
   - Incoming inspection: visual + dimensional check
   - Batch delivery: 8hr supply cycle
   - Operators: 2 | Uptime: 95%

2. STAMPING / PRESS OPERATION
   - Progressive die press at 160 SPM
   - Setup time: 15 minutes (manual changeover)
   - WIP buffer: 30 blanks upstream
   - Operators: 3 | Uptime: 88% | Defect rate: 1.2%

3. WELD SUB-ASSEMBLY
   - MIG weld inner reinforcement to outer skin
   - 6 weld points per door panel
   - Fixture variation causing rework
   - Operators: 4 | Uptime: 91% | Defect rate: 2.1%

4. HEM / CLINCH OPERATION
   - Hem flanges around perimeter (4 stations)
   - FIFO flow from welding
   - Operators: 2 | Uptime: 96%

5. E-COAT / PAINT PREPARATION
   - Electrophoretic coating, 30-min cure
   - Batch size: 40 doors (process constraint)
   - Operators: 2 | Uptime: 82% | Defect rate: 3.5%

6. FINAL ASSEMBLY AND QUALITY CHECK
   - Install hardware, seals, window glass
   - 47-point quality inspection
   - Operators: 5 | Uptime: 97%

7. PACK AND SHIP TO OEM
   - Custom racks, 6 doors per rack
   - Daily milk-run delivery to OEM
   - Operators: 2 | Uptime: 99%`

const STEPS = [
  { id:'s1', name:'Steel Blank Receiving',  dept:'Receiving',   ct:45,   wt:3600, wip:50, ops:2, uptime:95,  defect:0.5, flow:'push',  wastes:['Transportation','Inventory'],  notes:'Raw blanks arrive from stamping plant. 8-hr batch delivery cycle.', kaizen:[{title:'Reduce batch size 8hr → 4hr',priority:'high',status:'open',owner:'Max S.'}], rootCause:'Long supplier lead time forces large batch ordering' },
  { id:'s2', name:'Stamping / Press',        dept:'Stamping',    ct:22,   wt:1800, wip:30, ops:3, uptime:88,  defect:1.2, flow:'push',  wastes:['Waiting','Overproduction'],     notes:'Progressive die press. Setup: 15 min. Run at 160 SPM.',            kaizen:[{title:'SMED study — target 8 min setup',priority:'critical',status:'in-progress',owner:'Plant Eng.'}], rootCause:'Manual die changeover, no standardised process' },
  { id:'s3', name:'Weld Sub-Assembly',       dept:'Welding',     ct:95,   wt:2700, wip:20, ops:4, uptime:91,  defect:2.1, flow:'fifo',  wastes:['Defects','Motion'],             notes:'MIG weld of inner reinforcement to outer skin. 6 weld points.',    kaizen:[{title:'Implement weld fixture for repeatability',priority:'high',status:'open',owner:'Quality Eng.'}], rootCause:'Fixture variation causing 2.1% rework rate' },
  { id:'s4', name:'Hem / Clinch',            dept:'Fabrication', ct:38,   wt:600,  wip:10, ops:2, uptime:96,  defect:0.3, flow:'fifo',  wastes:[],                              notes:'Hem flanges around perimeter. 4 stations in sequence.',            kaizen:[], rootCause:'' },
  { id:'s5', name:'E-Coat / Paint Prep',     dept:'Paint',       ct:1800, wt:7200, wip:80, ops:2, uptime:82,  defect:3.5, flow:'push',  wastes:['Waiting','Inventory','Overprocessing'], notes:'Electrophoretic coating. 30-min cure. Batch of 40 doors.',  kaizen:[{title:'Optimise cure temp profile',priority:'normal',status:'open',owner:'Paint Eng.'}], rootCause:'Batch process — cannot run single-piece flow' },
  { id:'s6', name:'Final Assembly + QC',     dept:'Assembly',    ct:180,  wt:900,  wip:15, ops:5, uptime:97,  defect:0.8, flow:'pull',  wastes:['Motion','Waiting'],             notes:'Install hardware, seals, glass. Full 47-point QC inspection.',     kaizen:[{title:'Reduce QC 47→30 pts (risk-based)',priority:'high',status:'open',owner:'Quality Mgr'},{title:'Implement 5S in cell',priority:'normal',status:'complete',owner:'Team Lead'}], rootCause:'' },
  { id:'s7', name:'Pack & Ship to OEM',      dept:'Shipping',    ct:25,   wt:1800, wip:25, ops:2, uptime:99,  defect:0.1, flow:'push',  wastes:['Transportation','Inventory'],   notes:'Custom racks, 6 doors per rack. Daily milk-run to OEM.',           kaizen:[], rootCause:'' },
]

const WASTE_COLORS: Record<string,string> = {
  Transportation:'#6CB9FC', Inventory:'#F4A623', Motion:'#8C44CC',
  Waiting:'#FF6B6B', Overproduction:'#E84393', Overprocessing:'#1DD1A1',
  Defects:'#FF4444',
}
const KZ_COLORS  = { open:'#FF6B6B', 'in-progress':'#F4A623', complete:'#1DD1A1' }

const fmtS = (s:number) => {
  if (!s && s !== 0) return '—'
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${(s/60).toFixed(1)}m`
  return `${(s/3600).toFixed(1)}h`
}

// ─────────────────── SOP → VSM FLOWCHART ─────────────────────────────────────
const FLOW_NODES = [
  { id:'sop',     icon:'📄', label:'SOP Document',        sub:'Raw text uploaded',             color:'#6CB9FC' },
  { id:'parse',   icon:'🔍', label:'AI Text Parser',       sub:'Extracting process steps',      color:'#8C44CC' },
  { id:'extract', icon:'⚙',  label:'Step Extraction',      sub:'Identifying 7 process steps',   color:'#D4A208' },
  { id:'metrics', icon:'📊', label:'Metrics Inference',    sub:'CT, operators, uptime, defects', color:'#F4A623' },
  { id:'waste',   icon:'🚩', label:'Waste Detection',      sub:'8 wastes auto-identified',       color:'#FF6B6B' },
  { id:'kaizen',  icon:'⚡', label:'Kaizen Opportunities', sub:'5 improvement events flagged',   color:'#1DD1A1' },
  { id:'vsm',     icon:'~→', label:'VSM Map Generated',    sub:'Full current-state map ready',  color:'#D4A208' },
]

function SOPFlowchart() {
  const [active,   setActive]   = useState(-1)
  const [typing,   setTyping]   = useState(false)
  const [typedText,setTyped]    = useState('')
  const [running,  setRunning]  = useState(false)
  const timerRef = useRef<any>(null)

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
    setActive(-1)
    setTyped('')
    setTyping(false)

    // Type SOP text first
    setTyping(true)
    let i = 0
    const lines = SOP_TEXT.split('\n').slice(0, 18)
    const fullText = lines.join('\n')
    const typeInterval = setInterval(() => {
      i += 3
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(typeInterval)
        setTyping(false)
        // Now animate nodes
        FLOW_NODES.forEach((_, ni) => {
          timerRef.current = setTimeout(() => {
            setActive(ni)
            if (ni === FLOW_NODES.length - 1) {
              setTimeout(() => setRunning(false), 1200)
            }
          }, 900 + ni * 900)
        })
      }
    }, 18)
    return () => clearInterval(typeInterval)
  }, [running])

  useEffect(() => {
    const t = setTimeout(start, 600)
    return () => { clearTimeout(t); clearTimeout(timerRef.current) }
  }, [])

  return (
    <div style={{ background:'rgba(4,4,14,0.9)', borderRadius:16, border:'1px solid rgba(44,44,92,0.8)', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(44,44,92,0.6)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:2 }}>SOP → VSM PIPELINE</div>
          <div style={{ fontSize:13, color:'#F3F1FB', fontWeight:600 }}>How Supe AI transforms your SOP into a live VSM map</div>
        </div>
        <button onClick={start} disabled={running}
          style={{ padding:'7px 18px', borderRadius:8, background:running?'rgba(212,162,8,0.08)':'linear-gradient(135deg,#C49510,#D4A208)', color:running?'#7070A0':'#03030D', fontWeight:700, fontSize:12, border:'none', cursor:running?'not-allowed':'pointer', transition:'all 0.2s' }}>
          {running ? '⟳ Running…' : '▶ Run Again'}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
        {/* Left: SOP terminal */}
        <div style={{ padding:'16px 18px', borderRight:'1px solid rgba(44,44,92,0.5)', minHeight:340 }}>
          <div style={{ fontSize:10, color:'#52507A', fontFamily:'monospace', letterSpacing:1.5, marginBottom:10 }}>INPUT · SOP DOCUMENT</div>
          <div style={{ background:'rgba(0,0,0,0.5)', borderRadius:8, padding:'12px 14px', minHeight:280, fontFamily:'monospace', fontSize:10.5, color:'#1DD1A1', lineHeight:1.7, whiteSpace:'pre-wrap', wordBreak:'break-word', overflow:'hidden' }}>
            {typedText}{typing && <span style={{ animation:'blink 0.7s infinite', borderRight:'2px solid #1DD1A1' }}>&nbsp;</span>}
            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
          </div>
        </div>

        {/* Right: pipeline nodes */}
        <div style={{ padding:'16px 18px' }}>
          <div style={{ fontSize:10, color:'#52507A', fontFamily:'monospace', letterSpacing:1.5, marginBottom:10 }}>AI PROCESSING PIPELINE</div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {FLOW_NODES.map((node, i) => {
              const done    = i <= active
              const current = i === active
              return (
                <div key={node.id} style={{ display:'flex', alignItems:'stretch', gap:0 }}>
                  {/* Line + dot */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:28, flexShrink:0 }}>
                    {i > 0 && <div style={{ width:2, height:12, background: i <= active ? node.color : 'rgba(44,44,92,0.5)', transition:'background 0.4s' }} />}
                    <div style={{
                      width:20, height:20, borderRadius:'50%', flexShrink:0,
                      background: done ? node.color : 'rgba(44,44,92,0.5)',
                      border: `2px solid ${done ? node.color : 'rgba(44,44,92,0.8)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all 0.4s ease',
                      boxShadow: current ? `0 0 14px ${node.color}` : 'none',
                      transform: current ? 'scale(1.2)' : 'scale(1)',
                    }}>
                      {done && <div style={{ width:8, height:8, borderRadius:'50%', background:'#03030D' }} />}
                    </div>
                    {i < FLOW_NODES.length - 1 && <div style={{ width:2, flex:1, minHeight:8, background: i < active ? node.color : 'rgba(44,44,92,0.5)', transition:'background 0.4s 0.2s' }} />}
                  </div>

                  {/* Content */}
                  <div style={{
                    flex:1, padding:'8px 12px', marginLeft:8, marginBottom:4,
                    borderRadius:8,
                    background: current ? `${node.color}15` : done ? 'rgba(255,255,255,0.02)' : 'transparent',
                    border: `1px solid ${current ? node.color+'50' : done ? 'rgba(44,44,92,0.4)' : 'transparent'}`,
                    transition:'all 0.4s ease',
                    opacity: done ? 1 : 0.35,
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:16 }}>{node.icon}</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color: done ? '#F3F1FB' : '#7070A0', transition:'color 0.3s' }}>{node.label}</div>
                        <div style={{ fontSize:11, color: done ? node.color : '#38385C', transition:'color 0.3s' }}>{node.sub}</div>
                      </div>
                      {current && (
                        <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
                          {[0,1,2].map(d => (
                            <div key={d} style={{ width:5, height:5, borderRadius:'50%', background:node.color, animation:`pulse 0.8s ${d*0.2}s infinite` }} />
                          ))}
                          <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }`}</style>
                        </div>
                      )}
                      {done && i < active && <div style={{ marginLeft:'auto', color:'#1DD1A1', fontSize:13 }}>✓</div>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Output row - shows when complete */}
      {active >= FLOW_NODES.length - 1 && (
        <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(44,44,92,0.5)', background:'rgba(212,162,8,0.04)', display:'flex', alignItems:'center', justifyContent:'space-between', animation:'fadeIn 0.5s ease' }}>
          <div style={{ display:'flex', gap:24 }}>
            {[['7', 'Steps mapped'], ['12', 'Wastes found'], ['5', 'Kaizen events'], ['11%', 'PCE score']].map(([v, l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:700, color:GOLD, fontFamily:SERIF }}>{v}</div>
                <div style={{ fontSize:10, color:'#7070A0', fontFamily:'monospace' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12, color:'#1DD1A1', fontWeight:600 }}>✓ VSM Map ready in 4.2 seconds</div>
          <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>
        </div>
      )}
    </div>
  )
}

// ─────────────────────── VSM MAP ─────────────────────────────────────────────
function VSMMap() {
  const totalCT   = STEPS.reduce((a,s) => a+s.ct, 0)
  const totalWT   = STEPS.reduce((a,s) => a+s.wt, 0)
  const pce       = ((totalCT/(totalCT+totalWT))*100).toFixed(1)
  const [hovered, setHovered] = useState<string|null>(null)

  return (
    <div>
      {/* Supplier / Customer bar */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        {[['📦 SUPPLIER', 'Steel Stamping Plant', '#6CB9FC'], ['🏭 CUSTOMER', 'OEM Assembly Line', '#1DD1A1']].map(([label,name,col]) => (
          <div key={label as string} style={{ background:`${col}10`, border:`1px solid ${col}30`, borderRadius:8, padding:'9px 16px', textAlign:'center', minWidth:148 }}>
            <div style={{ fontSize:10, color: col as string, fontFamily:'monospace', marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:12, fontWeight:600, color:'#EAE8F4' }}>{name}</div>
          </div>
        ))}
      </div>

      {/* Timeline gradient bar */}
      <div style={{ display:'flex', marginBottom:6, gap:2 }}>
        {STEPS.map((s, i) => {
          const w = ((s.ct + s.wt) / (totalCT + totalWT) * 100).toFixed(1)
          return <div key={s.id} style={{ flex:`${w} 0 0`, height:5, background:`rgba(212,162,8,${0.25+i*0.1})`, borderRadius:i===0?'4px 0 0 4px':i===STEPS.length-1?'0 4px 4px 0':'0', minWidth:8 }} />
        })}
      </div>

      {/* Step boxes + arrows */}
      <div style={{ display:'flex', gap:6, alignItems:'stretch', overflowX:'auto', paddingBottom:8 }}>
        {STEPS.map((s, i) => {
          const isHot = hovered === s.id
          const isBN  = s.ct > 200
          return (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:0, flexShrink:0 }}>
              <div
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHot ? 'rgba(212,162,8,0.12)' : isBN ? 'rgba(255,107,107,0.07)' : 'rgba(13,13,34,0.9)',
                  border:`1px solid ${isHot?'rgba(212,162,8,0.6)':isBN?'rgba(255,107,107,0.35)':'rgba(44,44,92,0.8)'}`,
                  borderRadius:10, padding:'10px 9px', textAlign:'center', minWidth:100, cursor:'pointer',
                  transition:'all 0.2s', transform:isHot?'translateY(-2px)':'none',
                  boxShadow:isHot?`0 6px 20px rgba(212,162,8,0.15)`:'none',
                }}>
                <div style={{ fontSize:10, color:GOLD, fontFamily:'monospace', marginBottom:3 }}>{String(i+1).padStart(2,'0')}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#F3F1FB', lineHeight:1.25, marginBottom:5 }}>{s.name}</div>
                <div style={{ fontSize:10, color:GOLD }}>CT: {fmtS(s.ct)}</div>
                <div style={{ fontSize:10, color:'#7070A0' }}>{s.ops}op · {s.uptime}%↑</div>
                {s.defect > 0 && <div style={{ fontSize:10, color:'#FF6B6B' }}>{s.defect}% def</div>}
                {isBN && <div style={{ fontSize:9, color:'#FF6B6B', marginTop:3, fontWeight:700 }}>⚠ BOTTLENECK</div>}
                {/* Waste dots */}
                {s.wastes.length > 0 && (
                  <div style={{ display:'flex', gap:3, justifyContent:'center', marginTop:5, flexWrap:'wrap' }}>
                    {s.wastes.map(w => (
                      <div key={w} title={w} style={{ width:7, height:7, borderRadius:'50%', background:WASTE_COLORS[w]||'#7070A0' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow + wait/wip */}
              {i < STEPS.length-1 && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'0 4px', flexShrink:0 }}>
                  <div style={{ fontSize:9, color:'#F4A623', whiteSpace:'nowrap' }}>W:{fmtS(s.wt)}</div>
                  <div style={{ color:'#38385C', fontSize:18, lineHeight:1 }}>→</div>
                  <div style={{ fontSize:9, color:'#7070A0' }}>WIP:{s.wip}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* PCE bar */}
      <div style={{ marginTop:14, background:'rgba(8,8,24,0.8)', borderRadius:10, padding:'12px 16px', border:'1px solid rgba(40,40,92,0.4)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, alignItems:'center' }}>
          <span style={{ fontSize:11, color:'#7070A0', fontFamily:'monospace' }}>PROCESS CYCLE EFFICIENCY</span>
          <span style={{ fontSize:14, fontWeight:700, color:+pce>30?'#1DD1A1':+pce>15?'#F4A623':'#FF6B6B' }}>{pce}%</span>
        </div>
        <div style={{ height:8, background:'rgba(40,40,92,0.4)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ width:`${pce}%`, height:'100%', background:'linear-gradient(90deg,#FF6B6B,#F4A623,#1DD1A1)', borderRadius:4, transition:'width 1.2s ease' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:'#38385C', flexWrap:'wrap', gap:8 }}>
          <span>Value-Add CT: {fmtS(totalCT)}</span>
          <span>Total Queue: {fmtS(totalWT)}</span>
          <span>Lead Time: {fmtS(totalCT+totalWT)}</span>
          <span style={{ color:'#7070A0' }}>Target: &gt;30%</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────── STEP BUILDER ────────────────────────────────────────
function StepBuilder() {
  const [sel, setSel] = useState<string|null>('s2')
  const selectedStep  = STEPS.find(s => s.id === sel)

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:16, alignItems:'start' }}>
      {/* Step list */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {STEPS.map((s, i) => {
          const active = sel === s.id
          const isBN   = s.ct > 200
          return (
            <div key={s.id} onClick={() => setSel(sel === s.id ? null : s.id)}
              style={{
                background: active ? 'rgba(212,162,8,0.08)' : 'rgba(8,8,24,0.8)',
                border:`1px solid ${active?'rgba(212,162,8,0.5)':isBN?'rgba(255,107,107,0.3)':'rgba(26,26,64,0.8)'}`,
                borderRadius:10, overflow:'hidden', cursor:'pointer', transition:'all 0.15s',
              }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px' }}>
                <span style={{ fontSize:11, color:'#38385C', fontFamily:'monospace', minWidth:24 }}>{String(i+1).padStart(2,'0')}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:'#EAE8F4', fontSize:13 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'#7070A0' }}>{s.dept}</div>
                </div>
                <div style={{ display:'flex', gap:8, fontSize:11 }}>
                  <span style={{ color:GOLD }}>CT:{fmtS(s.ct)}</span>
                  {s.wastes.length > 0 && <span style={{ color:'#FF6B6B' }}>⚠{s.wastes.length}</span>}
                  {s.kaizen.filter(k=>k.status!=='complete').length > 0 && <span style={{ color:'#F4A623' }}>⚡{s.kaizen.filter(k=>k.status!=='complete').length}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      {selectedStep ? (
        <div style={{ background:'rgba(8,8,24,0.9)', border:'1px solid rgba(44,44,92,0.7)', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(44,44,92,0.5)', background:'rgba(13,13,34,0.8)' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#F3F1FB', marginBottom:2 }}>{selectedStep.name}</div>
            <div style={{ fontSize:12, color:'#7070A0' }}>{selectedStep.dept}</div>
          </div>

          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:14 }}>
            {/* Metrics grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[['Cycle Time', fmtS(selectedStep.ct), GOLD], ['Wait Time', fmtS(selectedStep.wt), '#F4A623'],
                ['Operators', selectedStep.ops, '#6CB9FC'], ['WIP Buffer', selectedStep.wip, '#8B88B3'],
                ['Machine Uptime', selectedStep.uptime+'%', selectedStep.uptime<90?'#FF6B6B':'#1DD1A1'],
                ['Defect Rate', selectedStep.defect+'%', selectedStep.defect>1.5?'#FF6B6B':'#1DD1A1'],
              ].map(([l,v,c]) => (
                <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'8px 10px', border:'1px solid rgba(44,44,92,0.4)' }}>
                  <div style={{ fontSize:10, color:'#52507A', fontFamily:'monospace', marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:15, fontWeight:700, color: c as string }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Wastes */}
            {selectedStep.wastes.length > 0 && (
              <div>
                <div style={{ fontSize:10, color:'#FF6B6B', fontFamily:'monospace', letterSpacing:1, marginBottom:6 }}>WASTE IDENTIFIED</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {selectedStep.wastes.map(w => (
                    <span key={w} style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background:`${WASTE_COLORS[w]||'#7070A0'}18`, color:WASTE_COLORS[w]||'#7070A0', border:`1px solid ${WASTE_COLORS[w]||'#7070A0'}30` }}>{w}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedStep.notes && (
              <div>
                <div style={{ fontSize:10, color:'#7070A0', fontFamily:'monospace', letterSpacing:1, marginBottom:4 }}>OPERATOR NOTES</div>
                <p style={{ fontSize:12, color:'#8B88B3', lineHeight:1.65, margin:0 }}>{selectedStep.notes}</p>
              </div>
            )}

            {/* Root cause */}
            {selectedStep.rootCause && (
              <div style={{ background:'rgba(255,107,107,0.06)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8, padding:'10px 12px' }}>
                <div style={{ fontSize:10, color:'#FF6B6B', fontFamily:'monospace', letterSpacing:1, marginBottom:4 }}>ROOT CAUSE (5 WHY)</div>
                <p style={{ fontSize:12, color:'#EAE8F4', lineHeight:1.6, margin:0 }}>{selectedStep.rootCause}</p>
              </div>
            )}

            {/* Kaizen events */}
            {selectedStep.kaizen.length > 0 && (
              <div>
                <div style={{ fontSize:10, color:'#F4A623', fontFamily:'monospace', letterSpacing:1, marginBottom:6 }}>KAIZEN EVENTS</div>
                {selectedStep.kaizen.map((k, ki) => (
                  <div key={ki} style={{ fontSize:12, padding:'8px 10px', borderRadius:7, background:'rgba(8,8,24,0.8)', border:'1px solid rgba(26,26,64,0.6)', marginBottom:5 }}>
                    <div style={{ fontWeight:600, color:'#EAE8F4', marginBottom:4 }}>{k.title}</div>
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:10, color:(KZ_COLORS as any)[k.status]||'#7070A0', fontWeight:700 }}>{k.status.toUpperCase()}</span>
                      <span style={{ fontSize:10, color:'#52507A', fontWeight:700 }}>{k.priority.toUpperCase()}</span>
                      {k.owner && <span style={{ fontSize:10, color:'#38385C' }}>👤 {k.owner}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background:'rgba(8,8,24,0.5)', border:'1px dashed rgba(44,44,92,0.5)', borderRadius:12, padding:'40px 24px', textAlign:'center' }}>
          <div style={{ fontSize:28, marginBottom:10 }}>👆</div>
          <p style={{ fontSize:13, color:'#7070A0' }}>Select a step to see full details</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────── KAIZEN BOARD ────────────────────────────────────────
function KaizenBoard() {
  const allKaizen = STEPS.flatMap(s => s.kaizen.map(k => ({ ...k, stepName:s.name })))
  const cols = [
    { id:'open',        label:'Open',        color:'#FF6B6B' },
    { id:'in-progress', label:'In Progress', color:'#F4A623' },
    { id:'complete',    label:'Complete',    color:'#1DD1A1' },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
      {cols.map(col => {
        const items = allKaizen.filter(k => k.status === col.id)
        return (
          <div key={col.id}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, paddingBottom:8, borderBottom:`2px solid ${col.color}30` }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:1.2, color:col.color, fontFamily:'monospace' }}>{col.label}</span>
              <span style={{ fontSize:11, color:col.color, background:`${col.color}15`, padding:'2px 10px', borderRadius:100, fontWeight:700 }}>{items.length}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {items.map((item, ki) => (
                <div key={ki} style={{ background:'rgba(8,8,24,0.85)', border:'1px solid rgba(26,26,64,0.8)', borderRadius:9, padding:'11px 13px', transition:'transform 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform='translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform='none')}>
                  <div style={{ fontWeight:600, fontSize:13, color:'#EAE8F4', marginBottom:6, lineHeight:1.35 }}>{item.title}</div>
                  <div style={{ fontSize:11, color:'#7070A0', marginBottom:5 }}>📍 {item.stepName}</div>
                  {item.owner && <div style={{ fontSize:11, color:'#52507A' }}>👤 {item.owner}</div>}
                  <div style={{ marginTop:7 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:100,
                      background:item.priority==='critical'?'rgba(255,107,107,0.12)':item.priority==='high'?'rgba(244,166,35,0.12)':'rgba(108,185,252,0.12)',
                      color:item.priority==='critical'?'#FF6B6B':item.priority==='high'?'#F4A623':'#6CB9FC',
                    }}>{item.priority?.toUpperCase()}</span>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div style={{ color:'#38385C', fontSize:12, textAlign:'center', padding:'24px 0' }}>None</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────── REPORT PREVIEW ──────────────────────────────────────
function ReportPreview() {
  const totalCT   = STEPS.reduce((a,s) => a+s.ct, 0)
  const totalWT   = STEPS.reduce((a,s) => a+s.wt, 0)
  const allKaizen = STEPS.flatMap(s => s.kaizen.map(k => ({ ...k, stepName:s.name })))
  const pce       = ((totalCT/(totalCT+totalWT))*100).toFixed(1)

  return (
    <div style={{ maxWidth:760, margin:'0 auto' }}>
      {/* ISO header preview */}
      <div style={{ background:'rgba(8,8,24,0.9)', border:'2px solid rgba(30,58,95,0.6)', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
        <div style={{ background:'rgba(30,58,95,0.4)', padding:'14px 20px', borderBottom:'1px solid rgba(30,58,95,0.5)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:9, color:'#6CB9FC', letterSpacing:2, fontFamily:'monospace', marginBottom:5 }}>QUALITY MANAGEMENT SYSTEM — VALUE STREAM ANALYSIS</div>
            <div style={{ fontSize:18, fontWeight:700, color:'#F3F1FB', fontFamily:SERIF, marginBottom:3 }}>Value Stream Mapping Report</div>
            <div style={{ fontSize:13, color:'#6CB9FC', fontWeight:600 }}>{STEPS[0].name.split(' ')[0]} Automotive Door Assembly</div>
          </div>
          <div style={{ textAlign:'right', fontSize:11, color:'#7070A0', lineHeight:1.8 }}>
            <div>Doc: VSM-2026-4821</div>
            <div>Rev A · {new Date().toLocaleDateString()}</div>
            <div style={{ color:'#6CB9FC', fontFamily:'monospace', fontSize:10 }}>ISO 9001:2015 / ISO 13053</div>
            <div style={{ marginTop:6, background:'rgba(30,58,95,0.4)', borderRadius:4, padding:'2px 8px', fontSize:10, color:'#94A3B8' }}>
              INTERNAL CONTROLLED
            </div>
          </div>
        </div>
        {/* KPI strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:0 }}>
          {[['Steps', STEPS.length, '#6CB9FC'], ['Cycle Time', fmtS(totalCT), '#1DD1A1'], ['Queue Time', fmtS(totalWT), '#F4A623'], ['Lead Time', fmtS(totalCT+totalWT), '#D4A208'], ['PCE', pce+'%', +pce>15?'#1DD1A1':'#FF6B6B']].map(([l,v,c],i) => (
            <div key={l as string} style={{ padding:'12px 14px', borderRight:i<4?'1px solid rgba(26,26,64,0.6)':'none', textAlign:'center' }}>
              <div style={{ fontSize:9, color:'#52507A', fontFamily:'monospace', letterSpacing:1, marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:700, color:c as string, fontFamily:SERIF }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections preview */}
      {[
        { n:'1', title:'Executive Summary — Key Performance Indicators', done:true },
        { n:'2', title:'Value Stream Flow — Current State (ISO 9001:2015 §8.5)', done:true },
        { n:'3', title:'Process Step Detail — ISO 13053-1 Data Collection Matrix', done:true },
        { n:'4', title:'Constraint and Bottleneck Analysis', done:true },
        { n:'5', title:'Waste Identification — 8 Wastes of Lean', done:true },
        { n:'6', title:'Kaizen Continuous Improvement Register', done:true },
        { n:'7', title:'Root Cause Analysis — 5 Why Method (ISO 13053-2 §8)', done:true },
        { n:'8', title:'Cause-and-Effect Analysis — Ishikawa Diagrams (6M)', done:true },
        { n:'9', title:'Time Study — Cycle Time Measurement Data', done:true },
        { n:'10', title:'Improvement Recommendations — Priority Matrix', done:true },
        { n:'11', title:'Project Parameters and Process Context', done:true },
        { n:'12', title:'Document Control Sign-Off Block', done:true },
      ].map((sec) => (
        <div key={sec.n} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 14px', background:'rgba(8,8,24,0.6)', border:'1px solid rgba(26,26,64,0.5)', borderRadius:8, marginBottom:5 }}>
          <span style={{ fontSize:11, color:'#7070A0', fontFamily:'monospace', minWidth:22 }}>{sec.n}.</span>
          <span style={{ fontSize:12, color:sec.done?'#EAE8F4':'#52507A', flex:1 }}>{sec.title}</span>
          <span style={{ fontSize:11, color:'#1DD1A1' }}>✓ White paper</span>
        </div>
      ))}

      <div style={{ marginTop:16, background:'rgba(212,162,8,0.06)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:10, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:12, color:'#F3F1FB', fontWeight:600, marginBottom:3 }}>ISO 9001:2015 / ISO 13053 Compliant Report</div>
          <div style={{ fontSize:11, color:'#7070A0' }}>White paper · 12 sections · Sign-off block · Multi-page PDF</div>
        </div>
        <Link href="/auth/signup" style={{ padding:'9px 22px', background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', fontWeight:700, fontSize:13, borderRadius:9, textDecoration:'none' }}>
          Export Your Report →
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────── MAIN DEMO ───────────────────────────────────────────
const TABS = [
  { id:'pipeline', label:'⟳ SOP → VSM Pipeline', desc:'Watch AI transform a raw SOP into a live map' },
  { id:'vsm',      label:'~→ VSM Map',             desc:'Current-state value stream with live metrics' },
  { id:'steps',    label:'⊞ Step Explorer',         desc:'Deep-dive into every process step' },
  { id:'kaizen',   label:'⚡ Kaizen Board',          desc:'All improvement events across the project' },
  { id:'report',   label:'📋 ISO Report Preview',   desc:'White-paper report structure preview' },
]

export default function DemoPage() {
  const [tab, setTab]   = useState<string>('pipeline')
  const totalCT         = STEPS.reduce((a,s) => a+s.ct, 0)
  const totalWT         = STEPS.reduce((a,s) => a+s.wt, 0)
  const allKaizen       = STEPS.flatMap(s => s.kaizen)
  const openKz          = allKaizen.filter(k => k.status !== 'complete').length
  const pce             = ((totalCT/(totalCT+totalWT))*100).toFixed(1)

  const activeTab = TABS.find(t => t.id === tab)

  return (
    <div style={{ minHeight:'100vh', background:'#03030D', color:'#EAE8F4' }}>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:54, borderBottom:'1px solid rgba(26,26,64,0.6)', background:'rgba(3,3,13,0.96)', backdropFilter:'blur(16px)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Link href="/" style={{ textDecoration:'none' }}><VesimyLogo size={26} showText /></Link>
          <span style={{ fontSize:10, color:'#38385C', fontFamily:'monospace', letterSpacing:2, background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.2)', padding:'2px 8px', borderRadius:4 }}>LIVE DEMO</span>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#7070A0' }}>Automotive Door Assembly · Read-only</span>
          <Link href="/auth/signup" style={{ padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:700, color:'#03030D', textDecoration:'none', background:'linear-gradient(135deg,#C49510,#D4A208)' }}>
            Try Free — No Card
          </Link>
        </div>
      </nav>

      {/* Project header */}
      <div style={{ background:'#06060F', borderBottom:'1px solid rgba(26,26,64,0.5)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
          {/* Metrics strip */}
          <div style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
            {[['PCE', pce+'%', +pce>15?GOLD:'#FF6B6B'], ['STEPS', STEPS.length, GOLD], ['LEAD TIME', fmtS(totalCT+totalWT), GOLD], ['TOTAL CT', fmtS(totalCT), GOLD], ['OPEN KZ', openKz, '#F4A623'], ['WASTES', STEPS.flatMap(s=>s.wastes).length, '#FF6B6B'], ['TAKT', '120s', '#6CB9FC']].map(([label,value,col]) => (
              <div key={label as string} style={{ padding:'10px 18px', borderRight:'1px solid rgba(26,26,64,0.4)', minWidth:88, textAlign:'center', flexShrink:0 }}>
                <div style={{ fontSize:9, color:'#38385C', letterSpacing:1.5, fontFamily:'monospace' }}>{label}</div>
                <div style={{ fontSize:16, fontWeight:700, color: col as string, marginTop:1 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'11px 18px', fontSize:12, fontWeight:600, background:'none', border:'none', cursor:'pointer',
                color: tab===t.id ? GOLD : '#7070A0',
                borderBottom: `2px solid ${tab===t.id ? GOLD : 'transparent'}`,
                marginBottom:-1, transition:'all 0.15s', whiteSpace:'nowrap',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 28px' }}>
        {/* Tab description */}
        {activeTab && (
          <div style={{ marginBottom:22, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <h2 style={{ fontFamily:SERIF, fontSize:20, fontWeight:700, margin:'0 0 4px' }}>{activeTab.label}</h2>
              <p style={{ fontSize:13, color:'#7070A0', margin:0 }}>{activeTab.desc}</p>
            </div>
            <div style={{ fontSize:11, color:'#7070A0', background:'rgba(8,8,24,0.8)', border:'1px solid rgba(40,40,92,0.4)', borderRadius:8, padding:'6px 14px' }}>
              👆 Read-only demo ·{' '}
              <Link href="/auth/signup" style={{ color:GOLD, textDecoration:'none' }}>Sign up to use your own data</Link>
            </div>
          </div>
        )}

        {tab === 'pipeline' && <SOPFlowchart />}
        {tab === 'vsm'      && <VSMMap />}
        {tab === 'steps'    && <StepBuilder />}
        {tab === 'kaizen'   && <KaizenBoard />}
        {tab === 'report'   && <ReportPreview />}

        {/* CTA */}
        <div style={{ marginTop:44, background:'linear-gradient(135deg,rgba(212,162,8,0.05),rgba(100,38,160,0.05))', border:'1px solid rgba(212,162,8,0.2)', borderRadius:16, padding:'28px 36px', textAlign:'center' }}>
          <div style={{ fontSize:10, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:10 }}>START WITH YOUR OWN PROCESS</div>
          <h3 style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, marginBottom:10 }}>Ready to map your value stream?</h3>
          <p style={{ fontSize:14, color:'#7070A0', maxWidth:480, margin:'0 auto 22px', lineHeight:1.75 }}>
            This demo used a pre-built automotive example. Upload your own SOP and get a live map in under 60 seconds. Free forever.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/signup" style={{ padding:'12px 30px', borderRadius:10, fontSize:15, fontWeight:700, textDecoration:'none', background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', display:'inline-flex', alignItems:'center', gap:8 }}>
              Start Free — No Credit Card
            </Link>
            <Link href="/pricing" style={{ padding:'12px 22px', borderRadius:10, fontSize:14, fontWeight:600, textDecoration:'none', background:'rgba(8,8,24,0.8)', color:GOLD, border:`1px solid rgba(212,162,8,0.3)` }}>
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
