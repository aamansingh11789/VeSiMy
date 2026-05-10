'use client'
// ── components/home/HeroCubePreview.tsx ──────────────────────────────────────
// Auto-rotating 3D CSS cube — 4 faces showing real VeSiMy app previews.
// Pauses on hover. Respects prefers-reduced-motion.

import React, { useState, useEffect, useRef } from 'react'

const T = {
  blue:'#2B7FFF', blueL:'#60A5FA', cyan:'#22D3EE',
  amber:'#E8941A', green:'#10B981', red:'#EF4444',
  navy:'#04111F', navy2:'#071828', white:'#EEF2FF',
  sub:'#8B9CC8', mono:'"JetBrains Mono",monospace', sans:'"Satoshi","Inter",sans-serif',
}
const S = 290, S2 = S / 2

function FaceVSM() {
  const steps = [
    { name:'Intake',   ct:'12s', va:'VA',   bot:false },
    { name:'Process',  ct:'45s', va:'VA',   bot:false },
    { name:'Inspect',  ct:'62s', va:'NNVA', bot:true  },
    { name:'Dispatch', ct:'22s', va:'VA',   bot:false },
  ]
  return (
    <div style={{background:'#FFFFFF',width:'100%',height:'100%',padding:'14px 12px',display:'flex',flexDirection:'column',gap:7,overflow:'hidden',WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale',transform:'translateZ(0)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:9,fontWeight:800,color:'#0F172A',letterSpacing:0.5}}>CURRENT STATE</div>
          <div style={{fontSize:10,color:'#64748B',marginTop:1}}>Assembly Line A</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(16,185,129,0.10)',border:'1px solid rgba(16,185,129,0.30)',borderRadius:100,padding:'2px 7px'}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:'#10B981'}}/>
          <span style={{fontSize:10,fontWeight:700,color:'#10B981'}}>LIVE</span>
        </div>
      </div>
      <div style={{display:'flex',gap:5}}>
        {[['Lead Time','18.2m',T.blue],['PCE','26%',T.amber],['Takt','32s','#64748B'],['WIP','31',T.red]].map(([l,v,c])=>(
          <div key={l as string} style={{flex:1,background:'rgba(0,0,0,0.03)',border:'1px solid #E2E8F0',borderRadius:5,padding:'4px 4px'}}>
            <div style={{fontSize:9,color:'#94A3B8',letterSpacing:0.4}}>{l}</div>
            <div style={{fontSize:11,fontWeight:800,color:c as string,fontFamily:T.mono,lineHeight:1.1}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',gap:4,overflow:'hidden'}}>
        <div style={{fontSize:9,color:'#94A3B8',flexShrink:0}}>SUP→</div>
        {steps.map((s,i)=>(
          <React.Fragment key={s.name}>
            <div style={{flex:1,borderRadius:6,background:s.bot?'rgba(239,68,68,0.06)':'#FAFBFE',border:`1.5px solid ${s.bot?'#EF4444':'#E2E8F0'}`,padding:'5px 4px',position:'relative'}}>
              {s.bot&&<div style={{position:'absolute',top:-4,right:-3,width:9,height:9,background:T.red,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontSize:9,color:'#fff',fontWeight:800}}>!</span>
              </div>}
              <div style={{fontSize:10,fontWeight:700,color:s.bot?T.red:'#0F172A',marginBottom:1}}>{s.name}</div>
              <div style={{fontSize:10,fontWeight:800,color:s.bot?T.red:T.blue,fontFamily:T.mono}}>{s.ct}</div>
              <div style={{fontSize:9,marginTop:2,display:'inline-block',background:s.va==='VA'?'rgba(16,185,129,0.12)':'rgba(245,158,11,0.12)',color:s.va==='VA'?'#10B981':'#F59E0B',borderRadius:3,padding:'1px 4px',fontWeight:700}}>{s.va}</div>
            </div>
            {i<steps.length-1&&<div style={{fontSize:11,color:'#CBD5E1',flexShrink:0}}>→</div>}
          </React.Fragment>
        ))}
        <div style={{fontSize:9,color:'#94A3B8',flexShrink:0}}>→CUS</div>
      </div>
      <div style={{background:'rgba(43,127,255,0.05)',border:'1px solid rgba(43,127,255,0.15)',borderRadius:6,padding:'5px 7px'}}>
        <div style={{fontSize:9,fontWeight:800,color:T.amber,letterSpacing:0.8,marginBottom:2}}>SUPE AI · ROOT CAUSE</div>
        <div style={{fontSize:10,color:'#334155',lineHeight:1.5}}><strong style={{color:T.red}}>Inspect</strong> is your bottleneck — CT 62s vs Takt 32s. SMED analysis recommended.</div>
      </div>
    </div>
  )
}

function FaceTargetState() {
  const items = [
    {label:'Inspect CT',  from:'62s',to:'28s', delta:'−55%',color:T.green},
    {label:'Wait Time',   from:'26s',to:'4s',  delta:'−85%',color:T.blue},
    {label:'PCE',         from:'26%',to:'44%', delta:'+18pt',color:T.amber},
    {label:'WIP',         from:'31', to:'18',  delta:'−42%',color:T.cyan},
    {label:'Lead Time',   from:'18m',to:'11m', delta:'−39%',color:T.blueL},
  ]
  return (
    <div style={{background:T.navy,width:'100%',height:'100%',padding:'14px 12px',display:'flex',flexDirection:'column',gap:6,overflow:'hidden',WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale',transform:'translateZ(0)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:2}}>
        <div>
          <div style={{fontSize:9,fontWeight:800,color:T.white,letterSpacing:0.5}}>TARGET STATE</div>
          <div style={{fontSize:10,color:T.sub,marginTop:1}}>AI-generated improvement plan</div>
        </div>
        <div style={{background:'rgba(232,148,26,0.15)',border:'1px solid rgba(232,148,26,0.35)',borderRadius:4,padding:'3px 7px'}}>
          <span style={{fontSize:10,fontWeight:800,color:T.amber,letterSpacing:0.8}}>✦ SUPE</span>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:5}}>
        {items.map(item=>(
          <div key={item.label} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 7px',borderRadius:6,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10.5,fontWeight:600,color:T.white}}>{item.label}</div>
              <div style={{fontSize:10,color:T.sub,marginTop:1}}>{item.from} → <span style={{color:item.color,fontWeight:700}}>{item.to}</span></div>
            </div>
            <div style={{background:`${item.color}18`,border:`1px solid ${item.color}40`,borderRadius:100,padding:'2px 7px',fontSize:11,fontWeight:800,color:item.color,fontFamily:T.mono,whiteSpace:'nowrap'}}>
              {item.delta}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
          <span style={{fontSize:10,color:T.sub}}>PCE progression</span>
          <span style={{fontSize:10,color:T.amber,fontWeight:700,fontFamily:T.mono}}>26% → 44%</span>
        </div>
        <div style={{height:5,borderRadius:3,background:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
          <div style={{height:'100%',width:'44%',background:`linear-gradient(90deg,${T.blue},${T.amber})`,borderRadius:3}}/>
        </div>
      </div>
    </div>
  )
}

function FaceDashboard() {
  const projects=[
    {name:'Assembly Line A', score:72, color:T.blue,  status:'Good',      industry:'Manufacturing'},
    {name:'QC Inspection',   score:44, color:'#F59E0B',status:'Fair',      industry:'Manufacturing'},
    {name:'Order Fulfilment',score:88, color:T.green, status:'Excellent',  industry:'Logistics'},
  ]
  return (
    <div style={{background:'#F5F7FA',width:'100%',height:'100%',padding:'14px 12px',display:'flex',flexDirection:'column',gap:8,overflow:'hidden',WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale',transform:'translateZ(0)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:9,fontWeight:800,color:'#04111F',letterSpacing:0.5}}>DASHBOARD</div>
        <div style={{fontSize:10.5,color:'#94A3B8'}}>3 active projects</div>
      </div>
      <div style={{display:'flex',gap:5}}>
        {[['3','Projects',T.blue],['17','Tools',T.amber],['2','Overdue',T.red]].map(([v,l,c])=>(
          <div key={l as string} style={{flex:1,background:'#fff',border:'1px solid #E2E8F0',borderRadius:6,padding:'5px 6px'}}>
            <div style={{fontSize:14,fontWeight:800,color:c as string,fontFamily:T.mono,lineHeight:1}}>{v}</div>
            <div style={{fontSize:9,color:'#64748B',marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:5}}>
        {projects.map(p=>(
          <div key={p.name} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',background:'#fff',borderRadius:7,border:'1px solid #E8ECF4',boxShadow:'0 1px 3px rgba(4,17,31,0.06)'}}>
            <div style={{width:26,height:26,flexShrink:0,position:'relative'}}>
              <svg width={26} height={26} viewBox="0 0 26 26">
                <circle cx={13} cy={13} r={10} fill="none" stroke="#E8ECF4" strokeWidth={3}/>
                <circle cx={13} cy={13} r={10} fill="none" stroke={p.color} strokeWidth={3}
                  strokeDasharray={`${(p.score/100)*63} 63`} strokeLinecap="round" transform="rotate(-90 13 13)"/>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:p.color,fontFamily:T.mono}}>{p.score}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0F172A',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
              <div style={{fontSize:9,color:'#94A3B8',marginTop:1}}>{p.industry}</div>
            </div>
            <div style={{fontSize:10,fontWeight:700,color:p.color,background:`${p.color}12`,border:`1px solid ${p.color}25`,borderRadius:100,padding:'2px 6px',whiteSpace:'nowrap'}}>{p.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaceCITools() {
  const tools=[
    {name:'Stopwatch', icon:'⏱',color:T.blue,   status:'12 obs · CV 8.4% ✓'},
    {name:'Fishbone',  icon:'🔍',color:T.amber,  status:'6 causes identified'},
    {name:'5 Why',     icon:'❓',color:T.cyan,   status:'4/5 · root cause found'},
    {name:'Kaizen',    icon:'⚡',color:T.green,  status:'3 actions · 1 overdue'},
    {name:'SMED',      icon:'🔧',color:'#8B5CF6',status:'28s changeover saved'},
    {name:'Simulation',icon:'📊',color:T.amber,  status:'Demand +25% modelled'},
  ]
  return (
    <div style={{background:T.navy,width:'100%',height:'100%',padding:'14px 12px',display:'flex',flexDirection:'column',gap:6,overflow:'hidden',WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale',transform:'translateZ(0)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:2}}>
        <div style={{fontSize:9,fontWeight:800,color:T.white,letterSpacing:0.5}}>CI TOOLKIT</div>
        <div style={{fontSize:10,color:T.sub}}>17 tools</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,flex:1}}>
        {tools.map(tool=>(
          <div key={tool.name} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${tool.color}25`,borderRadius:7,padding:'7px 8px'}}>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
              <span style={{fontSize:10}}>{tool.icon}</span>
              <span style={{fontSize:10.5,fontWeight:700,color:T.white}}>{tool.name}</span>
            </div>
            <div style={{fontSize:9,color:T.sub,lineHeight:1.4}}>{tool.status}</div>
            <div style={{marginTop:4,height:2,borderRadius:1,background:`${tool.color}25`,overflow:'hidden'}}>
              <div style={{height:'100%',width:'70%',background:tool.color,borderRadius:1}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroCubePreview() {
  const [paused,  setPaused]  = useState(false)
  const [reduced, setReduced] = useState(false)
  const [angle,   setAngle]   = useState(0)
  const rafRef  = useRef<number | null>(null)
  const lastRef = useRef<number>(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    if (reduced) return
    const tick = (ts: number) => {
      if (!paused) setAngle(a => a + (ts - lastRef.current) * 0.016)
      lastRef.current = ts
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [paused, reduced])

  const faces = [
    { el: <FaceVSM />,         ry: 0   },
    { el: <FaceTargetState />, ry: 90  },
    { el: <FaceDashboard />,   ry: 180 },
    { el: <FaceCITools />,     ry: 270 },
  ]

  const tiltX = 14
  const rotY  = reduced ? -24 : angle

  return (
    <div
      style={{ perspective: 900, perspectiveOrigin: '50% 42%', width: S, height: S, flexShrink: 0, position: 'relative' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div style={{ position:'absolute', inset:-40, borderRadius:'50%', background:'radial-gradient(ellipse at center, rgba(43,127,255,0.14) 0%, transparent 70%)', filter:'blur(24px)', pointerEvents:'none', zIndex:0 }}/>

      {/* The cube */}
      <div style={{
        width:S, height:S, position:'relative',
        transformStyle:'preserve-3d',
        transform:`rotateX(${tiltX}deg) rotateY(${rotY}deg)`,
        transition: paused ? 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
        zIndex:1,
      }}>
        {/* 4 side faces */}
        {faces.map((f,i) => (
          <div key={i} style={{
            position:'absolute', width:S, height:S,
            backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
            transform:`rotateY(${f.ry}deg) translateZ(${S2}px)`,
            borderRadius:12, overflow:'hidden',
            boxShadow:'0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
            border:'1px solid rgba(255,255,255,0.09)',
          }}>
            {f.el}
          </div>
        ))}

        {/* Top face — brand */}
        <div style={{
          position:'absolute', width:S, height:S,
          backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          transform:`rotateX(90deg) translateZ(${S2}px)`,
          background:'linear-gradient(135deg,#04111F 0%,#0A2035 100%)',
          borderRadius:12,
          border:'1px solid rgba(43,127,255,0.18)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:12,fontWeight:800,color:'rgba(255,255,255,0.6)',letterSpacing:4,marginBottom:6}}>VeSiMy</div>
            <div style={{width:48,height:1,background:'rgba(43,127,255,0.40)',margin:'0 auto'}}/>
            <div style={{fontSize:10.5,color:'rgba(255,255,255,0.55)',letterSpacing:2.5,marginTop:6}}>PROCESS INTELLIGENCE</div>
          </div>
        </div>

        {/* Bottom face — KPIs */}
        <div style={{
          position:'absolute', width:S, height:S,
          backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          transform:`rotateX(-90deg) translateZ(${S2}px)`,
          background:'linear-gradient(135deg,#04111F,#07182A)',
          borderRadius:12,
          border:'1px solid rgba(43,127,255,0.10)',
          display:'flex', alignItems:'center', justifyContent:'center',
          gap:20, flexWrap:'wrap', padding:24,
        }}>
          {[['18.2m','Lead Time',T.blue],['26%','PCE',T.amber],['32s','Takt','#94A3B8'],['31','WIP',T.red]].map(([v,l,c])=>(
            <div key={l as string} style={{textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:c as string,fontFamily:T.mono}}>{v}</div>
              <div style={{fontSize:10.5,color:'rgba(255,255,255,0.60)',letterSpacing:0.5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hint text */}
      <div style={{ position:'absolute', bottom:-24, left:'50%', transform:'translateX(-50%)', fontSize:9, color:'rgba(255,255,255,0.55)', letterSpacing:1, whiteSpace:'nowrap' }}>
        {paused ? '⏸ hover to inspect' : '↻ rotating'}
      </div>
    </div>
  )
}
