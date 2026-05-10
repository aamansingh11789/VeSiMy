"use client";
import React, { useState, useEffect, useRef } from "react";
import { VLogoMark, VeSiMyWordmark } from "@/components/ui/Logo";
import { ManufacturingHeroDashboard } from "@/components/homepage/ManufacturingHeroDashboard";
import { HeroCubePreview } from "@/components/home/HeroCubePreview";

// ─── DESIGN TOKENS ─────────────────────────────────────────
const C = {
  p0:    '#02040D',   // deepest background
  p1:    '#060C1A',   // hero background
  sans:  '-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif',
  mono:  '"JetBrains Mono","Fira Code","Cascadia Code",monospace',
  blue:  '#3B7CFF',
  blueL: '#90BAFF',
  cyan:  '#22D3EE',
  purple:'#A78BFA',
  green: '#10B981',
  amber: '#F59E0B',
  red:   '#EF4444',
  t1:    '#EEF2FF',
  t2:    '#8B9CC8',
  t3:    '#4B5880',
  t4:    '#2A3455',
  b1:    'rgba(255,255,255,0.04)',
  b2:    'rgba(255,255,255,0.07)',
} as const

// ─── MICRO TAG COMPONENT ────────────────────────────────────
// Usage: <MT c={C.blue}>CI Tool Suite</MT>
function MT({ c, sp = 1.5, children }: { c: string; sp?: number; children?: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: C.mono,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: sp,
      color: c,
      textTransform: 'uppercase' as const,
      display: 'block',
    }}>
      {children}
    </span>
  )
}

// ─── ANIMATED COUNTER ───────────────────────────────────────
function Counter({ end }: { end: number }) {
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const step = Math.max(1, Math.ceil(end / 40))
    let cur = 0
    const iv = setInterval(() => {
      cur = Math.min(cur + step, end)
      setN(cur)
      if (cur >= end) clearInterval(iv)
    }, 28)
    return () => clearInterval(iv)
  }, [end])
  return <>{n}</>
}

// ─── STYLE INJECTION ────────────────────────────────────────
function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('vesimy-hp-styles')) return
  const s = document.createElement('style')
  s.id = 'vesimy-hp-styles'
  s.textContent = `
    .sans { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif !important; }
    .mono { font-family: "JetBrains Mono","Fira Code",monospace !important; }

    /* 3D dark card */
    .c3d {
      background: linear-gradient(160deg,#0F1C38 0%,#091422 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.07),
        inset 0 -1px 0 rgba(0,0,0,0.5),
        3px 3px 0 rgba(4,8,20,0.9),
        6px 6px 0 rgba(3,6,15,0.7),
        9px 9px 0 rgba(2,4,10,0.4),
        0 16px 40px rgba(0,0,0,0.7);
    }

    /* Marble / silver Pro card */
    .marble {
      background: linear-gradient(160deg,#F8FAFF 0%,#EEF3FF 100%);
      border: 1px solid rgba(200,215,255,0.9);
      border-radius: 10px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.8),
        inset 0 -1px 0 rgba(0,0,0,0.1),
        3px 3px 0 rgba(160,175,210,0.4),
        6px 6px 0 rgba(140,155,190,0.3),
        9px 9px 0 rgba(120,135,170,0.2),
        0 16px 40px rgba(59,124,255,0.12);
    }

    /* Primary blue button */
    .br {
      background: linear-gradient(145deg,#4A8AFF 0%,#1E5FE8 100%);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.25),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 2px 0 rgba(10,30,100,0.8),
        0 4px 0 rgba(8,24,80,0.6),
        0 8px 20px rgba(59,124,255,0.35);
      transition: transform 0.12s, box-shadow 0.12s;
    }
    .br:hover {
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.25),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 3px 0 rgba(10,30,100,0.8),
        0 6px 0 rgba(8,24,80,0.6),
        0 12px 28px rgba(59,124,255,0.5);
    }
    .br:active { transform: translateY(1px); box-shadow: 0 1px 0 rgba(10,30,100,0.8); }

    /* Ghost / secondary button */
    .bg {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      color: #8B9CC8;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .bg:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #EEF2FF; }

    /* Gradient text */
    .tc-grd {
      background: linear-gradient(135deg,#4A8AFF 0%,#22D3EE 50%,#A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .tc { color: #EEF2FF; }

    /* Keyframes */
    @keyframes float {
      0%,100% { transform: translateY(0px) rotate(-0.4deg); }
      33%      { transform: translateY(-9px) rotate(0.3deg); }
      66%      { transform: translateY(-4px) rotate(-0.2deg); }
    }
    @keyframes pulseGlow {
      0%,100% { opacity:1; box-shadow:0 0 6px #3B7CFF,0 0 12px rgba(59,124,255,0.5); }
      50%     { opacity:0.7; box-shadow:0 0 14px #3B7CFF,0 0 28px rgba(59,124,255,0.7); }
    }
    @keyframes scanLine {
      0%   { top:0%;   opacity:0; }
      8%   { opacity:1; }
      92%  { opacity:0.5; }
      100% { top:100%; opacity:0; }
    }
    @keyframes blink {
      0%,100% { opacity:1; }
      50%     { opacity:0; }
    }

    /* Appear animations — staggered entry */
    .au  { animation: fadeUp 0.55s ease both; }
    .au1 { animation: fadeUp 0.55s ease 0.1s both; }
    .au2 { animation: fadeUp 0.55s ease 0.2s both; }
    .au3 { animation: fadeUp 0.55s ease 0.3s both; }
    .au4 { animation: fadeUp 0.55s ease 0.4s both; }
    .au5 { animation: fadeUp 0.65s ease 0.55s both; }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* Responsive helpers */
    @media (max-width:640px) {
      .hide-mobile { display:none !important; }
    }
  `
  document.head.appendChild(s)
}

// ─── PHOTOS (placeholder — add WebP files to /public/photos/) ──────────────
const P = {} // photos removed — use WebP files in /public/photos/

function Typewriter({text,speed=20,delay=0}) {
  const [s,setS]=useState(""); const [a,setA]=useState(false); const i=useRef(0);
  useEffect(()=>{
    const t=setTimeout(()=>{
      setA(true);
      const iv=setInterval(()=>{ i.current++; setS(text.slice(0,i.current)); if(i.current>=text.length)clearInterval(iv); },speed);
      return()=>clearInterval(iv);
    },delay);
    return()=>clearTimeout(t);
  },[text,speed,delay]);
  return <>{s}{a&&i.current<text.length&&<span style={{animation:"blink 0.7s infinite",color:C.blue}}>│</span>}</>;
}

// ─── PHOTO SECTION ─────────────────────────────────────────
function PhotoSection({img,title,sub,accent="#3B7CFF",opacity=0.15,children,align="center"}) {
  // img may be undefined if photos not yet added to /public/photos/
  return (
    <div style={{position:"relative",overflow:"hidden",padding:"72px 32px"}}>
      {/* Photo background */}
      <div style={{
        position:"absolute",inset:0,
        ...(img ? {backgroundImage:`url(${img})`} : {}),
        backgroundSize:"cover",backgroundPosition:"center",
        opacity,filter:"saturate(1.2) brightness(0.8)",
      }}/>
      {/* Dark overlay for readability */}
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg, rgba(3,4,13,0.85) 0%, rgba(6,12,26,0.75) 50%, rgba(3,4,13,0.9) 100%)`}}/>
      {/* Accent glow from photo colors */}
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 60% at 50% 50%, ${accent}08 0%, transparent 70%)`}}/>
      <div style={{position:"relative",maxWidth:800,margin:"0 auto",textAlign:align as React.CSSProperties["textAlign"]}}>
        {title && <div className="au" style={{fontFamily:C.sans,fontSize:40,fontWeight:800,color:C.t1,letterSpacing:-1,lineHeight:1.1,marginBottom:16,textShadow:"0 2px 4px rgba(0,0,8,0.95),0 8px 24px rgba(0,0,0,0.7)"}}>{title}</div>}
        {sub && <div style={{fontFamily:C.sans,fontSize:15,color:C.t2,lineHeight:1.8,marginBottom:children?36:0,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>{sub}</div>}
        {children}
      </div>
    </div>
  );
}

// ─── NAV ───────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false)
  const NAV_LINKS = [
    {n:'Guided',     href:'/guided'},
    {n:'Tools',      href:'/dashboard'},
    {n:'Industries', href:'/industries'},
    {n:'Enterprise', href:'/enterprise'},
    {n:'Blog',       href:'/blog'},
  ]
  return (
    <>
      <div style={{background:`${C.p0}F2`,backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:`1px solid ${C.b1}`,boxShadow:'0 1px 0 rgba(255,255,255,0.02),0 4px 20px rgba(0,0,0,0.6)',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={22} onDark={true} />
        </div>
        <div className="hide-mobile" style={{display:'flex',alignItems:'center',gap:24}}>
          <div style={{width:1,height:16,background:C.b2}}/>
          {NAV_LINKS.map(({n,href})=>(
            <a key={n} href={href} style={{textDecoration:'none'}}>
              <span className="sans" style={{fontSize:12.5,color:n==='Guided'?C.blueL:C.t3,cursor:'pointer',transition:'color 0.15s',fontWeight:n==='Guided'?600:400}}
                onMouseEnter={e=>(e.target as HTMLElement).style.color=C.t1}
                onMouseLeave={e=>(e.target as HTMLElement).style.color=n==='Guided'?C.blueL:C.t3}>{n}</span>
            </a>
          ))}
        </div>
        <div className="hide-mobile" style={{display:'flex',gap:8}}>
          <a href="/auth/login" style={{textDecoration:'none'}}><button className="bg" style={{padding:'7px 16px',fontSize:12}}>Sign in</button></a>
          <a href="/start" style={{textDecoration:'none'}}><button className="br" style={{padding:'7px 16px',fontSize:12}}>Start free</button></a>
        </div>
        <div className="show-mobile" style={{display:'none',alignItems:'center',gap:10}}>
          <a href="/auth/login" style={{textDecoration:'none'}}><button className="bg" style={{padding:'6px 14px',fontSize:11}}>Sign in</button></a>
          <button onClick={()=>setOpen(o=>!o)} aria-label={open?'Close menu':'Open menu'} style={{background:'transparent',border:`1px solid ${C.b2}`,borderRadius:7,width:36,height:36,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5,cursor:'pointer',padding:8}}>
            <span style={{display:'block',width:18,height:1.5,background:open?C.blue:C.t2,borderRadius:2,transition:'all 0.2s',transform:open?'rotate(45deg) translate(2px,2px)':'none'}}/>
            <span style={{display:'block',width:18,height:1.5,background:open?C.blue:C.t2,borderRadius:2,transition:'all 0.2s',opacity:open?0:1}}/>
            <span style={{display:'block',width:18,height:1.5,background:open?C.blue:C.t2,borderRadius:2,transition:'all 0.2s',transform:open?'rotate(-45deg) translate(2px,-2px)':'none'}}/>
          </button>
        </div>
      </div>
      {open && (
        <div style={{position:'fixed',top:56,left:0,right:0,zIndex:199,background:`${C.p0}F8`,backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:`1px solid ${C.b1}`,padding:'12px 0 20px'}}>
          {NAV_LINKS.map(({n,href})=>(
            <a key={n} href={href} onClick={()=>setOpen(false)} style={{textDecoration:'none',display:'block',padding:'13px 28px'}}>
              <span style={{fontFamily:C.sans,fontSize:15,color:n==='Guided'?C.blueL:C.t2,fontWeight:n==='Guided'?600:400}}>{n}</span>
            </a>
          ))}
          <div style={{margin:'12px 28px 0',display:'flex',gap:8}}>
            <a href="/start" style={{textDecoration:'none',flex:1}}><button className="br" style={{width:'100%',padding:'10px 0',fontSize:13}}>Start free</button></a>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 720px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}

// ── HERO ────────────────────────────────────────────────────
function Hero() {
  const [step,setStep]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setStep(1),2400);return()=>clearTimeout(t);},[]);

  return (
    <div style={{position:"relative",background:C.p1,overflow:"hidden",padding:"80px 32px 60px"}}>
      {/* Starfield photo at low opacity */}
      
      {/* Deep overlay */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(6,12,26,0.7) 0%,rgba(6,12,26,0.5) 40%,rgba(6,12,26,0.85) 100%)"}}/>
      {/* Blue dots */}
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(59,124,255,0.2) 1px, transparent 1px)",backgroundSize:"28px 28px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)"}}/>
      {/* Glows */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 40% at 25% 40%, rgba(59,124,255,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 35% 45% at 75% 55%, rgba(34,211,238,0.04) 0%,transparent 70%)",pointerEvents:"none"}}/>

      {/* ── 2-column hero layout: copy left, cube right ── */}
      <div style={{position:"relative",maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:64}}>
        {/* Left column: copy */}
        <div style={{flex:1,minWidth:0,textAlign:"left"}}>
        {/* Badge */}
        <div className="au" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:30,background:"linear-gradient(145deg,rgba(59,124,255,0.15),rgba(59,124,255,0.07))",border:"1px solid rgba(59,124,255,0.3)",borderRadius:100,padding:"5px 16px 5px 10px",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07),0 2px 0 rgba(0,0,20,0.5),0 4px 12px rgba(59,124,255,0.12),0 8px 24px rgba(0,0,0,0.3)"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:C.blue,boxShadow:`0 0 6px ${C.blue},0 0 12px rgba(59,124,255,0.5)`,animation:"pulseGlow 2.5s ease-in-out infinite"}}/>
          <MT c={C.blueL} sp={2.5}>AI-Powered Continuous Improvement · ISO 22468:2020</MT>
        </div>

        {/* Headline : carved. Spec §3.1 */}
        <div className="au1" style={{marginBottom:4}}>
          <h1 className="tc sans" style={{fontSize:50,fontWeight:800,color:C.t1,lineHeight:1.08,letterSpacing:-1.8}}>
            Every operation has a process.<br/>Every process has waste.
          </h1>
        </div>
        {/* Gradient marble line */}
        <div className="au2" style={{marginBottom:24}}>
          <div className="tc-grd sans" style={{fontSize:50,fontWeight:800,lineHeight:1.08,letterSpacing:-1.8}}>VeSiMy makes it visible.</div>
        </div>

        <p className="au3 sans" style={{fontSize:15,color:C.t2,lineHeight:1.8,maxWidth:520,margin:"0 0 36px",textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>
          Most teams know where the problem is. Almost none can see it clearly enough to fix it and prove it.
        </p>

        {/* Two entry points : spec §3.4 */}
        <div className="au4" style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center",marginBottom:56}}>
          <div style={{display:"flex",gap:12}}>
            <a href="/start" style={{textDecoration:"none"}}>
              <button className="br" style={{padding:"12px 24px",fontSize:13}}>New to process mapping? Start here.</button>
            </a>
            <a href="/dashboard" style={{textDecoration:"none"}}>
              <button className="bg" style={{padding:"12px 24px",fontSize:13}}>Already know lean? Use the full tool.</button>
            </a>
          </div>
          <span className="sans" style={{fontSize:11,color:C.t4}}>No account needed to start · 14-day free trial on all plans</span>
        </div>

        {/* Floating 3D process card */}
        <div className="au5" style={{borderRadius:12,overflow:"hidden",animation:"float 7s ease-in-out infinite",background:"linear-gradient(160deg,#0E1C38 0%,#091422 100%)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.4),6px 6px 0 rgba(3,6,16,0.9),12px 12px 0 rgba(2,4,12,0.7),18px 18px 0 rgba(2,3,8,0.4),24px 32px 60px rgba(0,0,0,0.8)",border:"1px solid rgba(255,255,255,0.07)",position:"relative"}}>
          {/* Scan line */}
          <div style={{position:"absolute",inset:0,overflow:"hidden",borderRadius:12,zIndex:10,pointerEvents:"none"}}>
            <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(59,124,255,0.3),transparent)",animation:"scanLine 6s ease-in-out infinite"}}/>
          </div>
          {/* Header */}
          <div style={{padding:"10px 16px",background:"linear-gradient(180deg,#0F1C38,#0A1428)",borderBottom:"1px solid rgba(255,255,255,0.05)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:10}}>
            <div style={{display:"flex",gap:5}}>
              {[C.red,C.amber,C.green].map(c=><div key={c} style={{width:8,height:8,borderRadius:"50%",background:c,opacity:0.5,boxShadow:`0 0 4px ${c}40`}}/>)}
            </div>
            <div style={{width:1,height:12,background:"rgba(255,255,255,0.05)"}}/>
            <MT c={C.t4}>Process Map · Live</MT>
            <div style={{marginLeft:"auto",display:"flex",gap:16}}>
              {[["LEAD TIME","2m 05s",C.amber],["PCE","68%",C.green],["DEFECTS","2.8%",C.red]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"right"}}>
                  <div className="mono" style={{fontSize:7.5,letterSpacing:2,color:C.t4,textTransform:"uppercase"}}>{l}</div>
                  <div className="mono" style={{fontSize:12,fontWeight:700,color:c,textShadow:`0 0 8px ${c}60,0 1px 4px rgba(0,0,0,0.8)`}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Steps */}
          <div style={{padding:"14px 12px",display:"flex",alignItems:"center",gap:3}}>
            {[
              {n:"Order Receipt",ct:"12s",d:"2%",c:C.blue},
              {n:"Pick",ct:"28s",d:"0%",c:C.blue},
              {n:"Pack",ct:"45s",d:"3%",c:C.blue},
              {n:"Quality Check",ct:"38s",d:"8%",c:C.red,warn:true},
              {n:"Dispatch",ct:"22s",d:"0%",c:C.blue},
            ].map((st,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",flex:i<4?1:"none"}}>
                <div style={{background:st.warn?"linear-gradient(160deg,#1A0808,#120505)":"linear-gradient(160deg,#0F1C38,#091422)",border:`1px solid ${st.warn?"rgba(239,68,68,0.25)":"rgba(255,255,255,0.06)"}`,borderTop:`2px solid ${st.c}`,borderRadius:5,padding:"8px 8px",minWidth:70,boxShadow:st.warn?"inset 0 1px 0 rgba(239,68,68,0.05),2px 2px 0 rgba(3,1,1,0.9),4px 5px 12px rgba(0,0,0,0.6)":"inset 0 1px 0 rgba(255,255,255,0.04),2px 2px 0 rgba(2,4,12,0.9),4px 5px 12px rgba(0,0,0,0.5)",position:"relative"}}>
                  {st.warn&&<div style={{position:"absolute",top:-6,right:5,width:13,height:13,borderRadius:"50%",background:"linear-gradient(145deg,#FF6B6B,#CC2222)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 8px rgba(239,68,68,0.6),inset 0 1px 0 rgba(255,255,255,0.2),0 2px 0 rgba(100,0,0,0.8)"}}><span style={{color:"#fff",fontSize:7,fontWeight:800}}>!</span></div>}
                  <div className="sans" style={{fontSize:9,fontWeight:600,color:st.warn?"#FCA5A5":C.t2,marginBottom:3,textShadow:"0 1px 4px rgba(0,0,0,0.9)"}}>{st.n}</div>
                  <div className="mono" style={{fontSize:12,fontWeight:700,color:st.c,textShadow:`0 0 8px ${st.c}50,0 1px 4px rgba(0,0,0,0.9)`}}>{st.ct}</div>
                  <div className="mono" style={{fontSize:8,color:C.t4,marginTop:1}}>D:{st.d}</div>
                </div>
                {i<4&&<div style={{flex:1,height:1.5,background:"linear-gradient(90deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))",margin:"0 2px",position:"relative"}}><div style={{position:"absolute",right:-1,top:"50%",transform:"translateY(-50%)",width:0,height:0,borderTop:"4px solid transparent",borderBottom:"4px solid transparent",borderLeft:"5px solid rgba(255,255,255,0.07)"}}/></div>}
              </div>
            ))}
          </div>
          {/* Supe */}
          <div style={{padding:"10px 16px",background:"linear-gradient(180deg,rgba(59,124,255,0.07),rgba(59,124,255,0.03))",borderTop:"1px solid rgba(59,124,255,0.1)",display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,marginTop:1,background:"linear-gradient(145deg,#4A8AFF,#22D3EE)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.3),0 2px 0 rgba(20,40,100,0.6),0 4px 12px rgba(59,124,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span className="sans" style={{fontSize:8,fontWeight:800,color:"#fff",textShadow:"0 1px 2px rgba(0,0,0,0.5)"}}>S</span>
            </div>
            <div className="sans" style={{fontSize:11,color:"rgba(144,186,255,0.9)",lineHeight:1.65,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>
              {step===0?<Typewriter text="Analysing process map..." speed={50}/>:<Typewriter text="Quality Check is your constraint. CT 38s vs takt 32s. SMED analysis on changeover sequence recommended. Pre-staging materials could recover 8–12s per cycle." speed={16} delay={200}/>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"flex",flexWrap:"wrap",marginTop:44,paddingTop:32,borderTop:`1px solid ${C.b1}`}}>
          {[["68","","Industries"],["20","+","CI Tools"],["70","","Ref Projects"],["14","-day","Free Trial"]].map(([n,s,l],i)=>(
            <div key={l} style={{flex:1,textAlign:"left",borderLeft:i>0?`1px solid ${C.b1}`:"none",padding:"8px 0"}}>
              <div className="mono tc" style={{fontSize:26,fontWeight:700,color:C.t1,letterSpacing:-0.5,textShadow:"0 2px 8px rgba(0,0,0,0.9),0 0 20px rgba(59,124,255,0.12)"}}><Counter end={parseInt(n)}/>{s}</div>
              <MT c={C.t4}>{l}</MT>
            </div>
          ))}
        </div>
        </div>{/* end left column */}

        {/* Right column: 3D cube */}
        <div className="hide-mobile" style={{flexShrink:0,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <HeroCubePreview/>
        </div>

      </div>{/* end 2-col */}
    </div>
  );
}

// ─── PHOTO DIVIDER: Golden light rods (stars + rods photo) ─
function PhotoDivider() {
  return (
    <div style={{position:"relative",height:280,overflow:"hidden"}}>
      
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(3,4,13,1) 0%,rgba(3,4,13,0) 30%,rgba(3,4,13,0) 70%,rgba(6,12,26,1) 100%)"}}/>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div className="tc-grd sans" style={{fontSize:36,fontWeight:800,letterSpacing:-0.8}}>Every process has a constraint.</div>
          <div className="sans" style={{fontSize:15,color:C.t2,marginTop:10,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>VeSiMy finds it. Then helps you fix it.</div>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURES SECTION (purple lantern bg) ──────────────────
function Features() {
  const features = [
    {icon:"◈",title:"Value Stream Mapping",desc:"ISO 22468:2020-aligned VSM with sticky-note canvas, sub-process nesting, and inline data editing.",color:C.blue},
    {icon:"⏱",title:"Stopwatch CT Capture",desc:"Single-tap timing on the floor. 3-lap methodology. Auto-populates your data strip.",color:C.cyan},
    {icon:"⬡",title:"Bottleneck Detection",desc:"AI identifies your constraint using takt comparison, WIP analysis, and Little's Law validation.",color:C.purple},
    {icon:"⚑",title:"Root Cause Tools",desc:"5 Whys, Fishbone, FMEA, and 8D: each with distinct workflows pre-populated from your map.",color:C.green},
    {icon:"◎",title:"SMED Analysis",desc:"Separates internal from external setup. Calculates potential reduction. Shows time savings projection.",color:C.amber},
    {icon:"▦",title:"AI Improvement Report",desc:"Pareto charts, lead time projection, prioritisation matrix. Generated from your map in seconds.",color:"#F472B6"},
  ];
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      {/* Purple lantern bg */}
      
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${C.p1} 0%,rgba(6,12,26,0.92) 50%,${C.p1} 100%)`}}/>
      {/* Dot grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(59,124,255,0.12) 1px, transparent 1px)",backgroundSize:"28px 28px",opacity:0.6}}/>

      <div style={{position:"relative",padding:"72px 32px",maxWidth:1000,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <MT c={C.blue}>CI Tool Suite</MT>
          <div className="tc sans" style={{fontSize:38,fontWeight:800,color:C.t1,marginTop:12,letterSpacing:-0.8}}>Every tool the methodology demands.</div>
          <div className="sans" style={{fontSize:15,color:C.t2,marginTop:12,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>Connected, not siloed. Every finding linked to the same step.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {features.map(f=>(
            <div key={f.title} className="c3d" style={{padding:22}}>
              <div style={{fontFamily:C.mono,fontSize:20,color:f.color,marginBottom:12,textShadow:`0 0 16px ${f.color}50,0 2px 6px rgba(0,0,0,0.9)`}}>{f.icon}</div>
              <div className="tc sans" style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:8}}>{f.title}</div>
              <div className="sans" style={{fontSize:12,color:C.t2,lineHeight:1.65}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SUPE SECTION (teal lantern bg) ────────────────────────
function SupeSection() {
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${C.p0} 0%,rgba(3,4,13,0.88) 50%,${C.p0} 100%)`}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(34,211,238,0.10) 1px, transparent 1px)",backgroundSize:"28px 28px"}}/>

      <div style={{position:"relative",padding:"72px 32px",maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48,alignItems:"center"}}>
          <div>
            <MT c={C.cyan}>Supe AI</MT>
            <div className="tc sans" style={{fontSize:38,fontWeight:800,color:C.t1,marginTop:12,marginBottom:8,letterSpacing:-0.8}}>An AI that knows lean.</div>
            <div className="tc-grd sans" style={{fontSize:38,fontWeight:800,letterSpacing:-0.8,marginBottom:20}}>Not just language.</div>
            <div className="sans" style={{fontSize:14,color:C.t2,lineHeight:1.8,marginBottom:28}}>Trained on TPS, VSM, Six Sigma, and ISO 22468 source material. Asks clarifying questions before answering. Generates future states from your actual map data.</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {["Bottleneck detection: CT vs takt at every step","Root cause brainstorming: targeted questions first","Future state generation : data-backed improvement map","Gap analysis : every missing field identified"].map(f=>(
                <div key={f} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:C.cyan,marginTop:6,flexShrink:0,boxShadow:`0 0 6px ${C.cyan}80`}}/>
                  <span className="sans" style={{fontSize:13,color:C.t2}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="c3d" style={{padding:24}}>
            <MT c={C.cyan}>Live Conversation</MT>
            <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:12}}>
              {/* User message */}
              <div style={{background:"rgba(59,124,255,0.08)",border:"1px solid rgba(59,124,255,0.15)",borderRadius:"8px 8px 2px 8px",padding:"10px 14px"}}>
                <div className="sans" style={{fontSize:12,color:C.blueL,lineHeight:1.6}}>My assembly line is at 68% PCE. Station 4 CT is above takt. Ideas?</div>
              </div>
              {/* Supe message */}
              <div style={{background:"linear-gradient(145deg,rgba(34,211,238,0.07),rgba(59,124,255,0.05))",border:"1px solid rgba(34,211,238,0.12)",borderRadius:"2px 8px 8px 8px",padding:"10px 14px"}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"linear-gradient(145deg,#4A8AFF,#22D3EE)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.3),0 2px 8px rgba(59,124,255,0.4)"}}>
                    <span className="sans" style={{fontSize:7,fontWeight:800,color:"#fff"}}>S</span>
                  </div>
                  <div className="sans" style={{fontSize:12,color:"rgba(144,186,255,0.9)",lineHeight:1.65}}>Before I recommend a fix : is Station 4 single-operator, and is the variance consistent across shifts or only during changeover cycles?</div>
                </div>
              </div>
              <div style={{background:"rgba(59,124,255,0.08)",border:"1px solid rgba(59,124,255,0.15)",borderRadius:"8px 8px 2px 8px",padding:"10px 14px"}}>
                <div className="sans" style={{fontSize:12,color:C.blueL,lineHeight:1.6}}>Single operator. High variance : setup changes every 3rd cycle.</div>
              </div>
              <div style={{background:"linear-gradient(145deg,rgba(34,211,238,0.07),rgba(59,124,255,0.05))",border:"1px solid rgba(34,211,238,0.12)",borderRadius:"2px 8px 8px 8px",padding:"10px 14px"}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"linear-gradient(145deg,#4A8AFF,#22D3EE)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.3),0 2px 8px rgba(59,124,255,0.4)"}}>
                    <span className="sans" style={{fontSize:7,fontWeight:800,color:"#fff"}}>S</span>
                  </div>
                  <div className="sans" style={{fontSize:12,color:"rgba(144,186,255,0.9)",lineHeight:1.65}}>
                    <Typewriter text="SMED is the right approach. The changeover variance is your constraint : not operator speed. Start by filming one complete changeover and separating internal from external setup. Typically recovers 40–60% of changeover time." speed={14} delay={300}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRICING (marble cards) ────────────────────────────────
function Pricing() {
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      {/* Stars trees bg */}
      
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${C.p0} 0%,rgba(3,4,13,0.85) 50%,${C.p0} 100%)`}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(59,124,255,0.10) 1px, transparent 1px)",backgroundSize:"28px 28px"}}/>

      <div style={{position:"relative",padding:"72px 32px",maxWidth:960,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <MT c={C.blue}>Pricing</MT>
          <div className="tc sans" style={{fontSize:38,fontWeight:800,color:C.t1,marginTop:12,letterSpacing:-0.8}}>Start free. Upgrade when VeSiMy earns it.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,alignItems:"start"}}>
          {/* Free Start : Tier 0, no account */}
          <div className="c3d" style={{padding:24}}>
            <MT c={C.t4}>Free Start</MT>
            <div className="tc sans" style={{fontSize:26,fontWeight:800,color:C.t1,marginTop:10,marginBottom:3,letterSpacing:-0.8}}>Free</div>
            <div className="sans" style={{fontSize:11,color:C.t3,marginBottom:16}}>No account needed</div>
            {["1 process map","Single-tap stopwatch","Plain language report","1 improvement action"].map(f=>(
              <div key={f} style={{display:"flex",gap:7,marginBottom:7}}>
                <span style={{color:C.t3,fontSize:11}}>·</span>
                <span className="sans" style={{fontSize:11,color:C.t2}}>{f}</span>
              </div>
            ))}
            <a href="/start" style={{textDecoration:"none"}}>
              <button className="bg" style={{width:"100%",marginTop:16,padding:"9px 0",fontSize:12}}>Start mapping now</button>
            </a>
            <div className="sans" style={{fontSize:10,color:C.t4,textAlign:"center",marginTop:8}}>You can create a free account afterwards.</div>
          </div>

          {/* Free Trial : full account, 14 days */}
          <div className="c3d" style={{padding:24,borderTop:`2px solid ${C.green}`}}>
            <MT c={C.green}>Free Trial</MT>
            <div className="tc sans" style={{fontSize:26,fontWeight:800,color:C.t1,marginTop:10,marginBottom:3,letterSpacing:-0.8}}>14 days</div>
            <div className="sans" style={{fontSize:11,color:C.t3,marginBottom:16}}>No credit card</div>
            {["All CI tools","VeSiMy Guided","Up to 3 projects","AI report teaser","No PDF export"].map(f=>(
              <div key={f} style={{display:"flex",gap:7,marginBottom:7}}>
                <span style={{color:C.green,fontSize:11}}>·</span>
                <span className="sans" style={{fontSize:11,color:C.t2}}>{f}</span>
              </div>
            ))}
            <button className="bg" style={{width:"100%",marginTop:16,padding:"9px 0",fontSize:12,borderColor:"rgba(16,185,129,0.3)"}}>Create free account</button>
          </div>

          {/* Pro : MARBLE */}
          <div className="marble" style={{padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#3B7CFF,#22D3EE)",borderRadius:"0 0 8px 8px",padding:"4px 14px"}}>
              <MT c="#fff" sp={2}>Most Popular</MT>
            </div>
            <MT c={C.blue}>Pro</MT>
            <div className="sans" style={{fontSize:26,fontWeight:800,color:"#0A1228",marginTop:10,marginBottom:3,letterSpacing:-0.8,textShadow:"0 1px 0 rgba(255,255,255,0.5),0 2px 4px rgba(0,20,60,0.2)"}}>$29<span style={{fontSize:14,fontWeight:500}}>/mo</span></div>
            <div className="sans" style={{fontSize:11,color:"#4A5880",marginBottom:16}}>or $23/mo billed annually</div>
            {["All CI tools + AI report","Lead time projection","Prioritisation matrix","PDF export + journal","Mobile floor observation","Kaizen roadmap"].map(f=>(
              <div key={f} style={{display:"flex",gap:7,marginBottom:7,alignItems:"flex-start"}}>
                <span style={{color:C.blue,fontSize:11,marginTop:1,fontWeight:700}}>✓</span>
                <span className="sans" style={{fontSize:11,color:"#2A3878",fontWeight:500}}>{f}</span>
              </div>
            ))}
            <button className="br" style={{width:"100%",marginTop:16,padding:"10px 0",fontSize:12}}>Start Pro</button>
          </div>

          {/* Enterprise */}
          <div className="c3d" style={{padding:24,borderTop:`2px solid ${C.blue}`}}>
            <MT c={C.blue}>Enterprise</MT>
            <div className="tc sans" style={{fontSize:26,fontWeight:800,color:C.t1,marginTop:10,marginBottom:3,letterSpacing:-0.8}}>Custom</div>
            <div className="sans" style={{fontSize:11,color:C.t3,marginBottom:16}}>$15/user/mo · volume discounts</div>
            {["Real-time team collaboration","Leader + member authority","Version comparison","Org skill matrix dashboard","API + SSO + SLA"].map(f=>(
              <div key={f} style={{display:"flex",gap:7,marginBottom:7}}>
                <span style={{color:C.cyan,fontSize:11}}>·</span>
                <span className="sans" style={{fontSize:11,color:C.t2}}>{f}</span>
              </div>
            ))}
            <button className="bg" style={{width:"100%",marginTop:16,padding:"9px 0",fontSize:12}}>Get a quote</button>
          </div>
        </div>
        {/* Positioning line : spec §22.3 */}
        <div className="sans" style={{textAlign:"center",marginTop:32,fontSize:13,color:C.t3}}>
          Start with one process and a real report. No account needed. Upgrade when VeSiMy earns it.
        </div>
      </div>
    </div>
  );
}

// ─── BOTTLENECK SECTION (red sphere bg) ────────────────────
function BottleneckSection() {
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${C.p0} 0%,rgba(3,4,13,0.9) 100%)`}}/>

      <div style={{position:"relative",padding:"64px 32px",maxWidth:900,margin:"0 auto",textAlign:"center"}}>
        <MT c={C.red}>The Problem</MT>
        <div className="tc sans" style={{fontSize:38,fontWeight:800,color:C.t1,marginTop:14,marginBottom:16,letterSpacing:-0.8}}>
          You already know what's wrong.
        </div>
        <div className="tc-grd sans" style={{fontSize:38,fontWeight:800,letterSpacing:-0.8,marginBottom:20}}>
          You just can't prove it yet.
        </div>
        <div className="sans" style={{fontSize:15,color:C.t2,maxWidth:540,margin:"0 auto 44px",lineHeight:1.8}}>
          The bottleneck is obvious to anyone who walks the floor. The root cause is debated in every meeting. The improvement gets started, loses momentum, and the problem comes back.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {[
            {t:"Reject rate climbing",d:"No structured root cause linked to real process data.",c:C.red},
            {t:"Cycle time drifting",d:"Standard says 90s. Floor runs at 145s. Gap never measured properly.",c:C.amber},
            {t:"Improvements don't stick",d:"Kaizen ran. Post-its went up. Three months later the problem is back.",c:C.blue},
          ].map(p=>(
            <div key={p.t} className="c3d" style={{padding:20,borderTop:`2px solid ${p.c}`}}>
              <div className="tc sans" style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:8}}>{p.t}</div>
              <div className="sans" style={{fontSize:11,color:C.t2,lineHeight:1.65}}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FOUNDER STATEMENT ─────────────────────────────────────
// ── VSM LIVE PREVIEW SECTION ────────────────────────────────────────────────────
function VSMPreview() {
  const notes = [
    {name:"Order\nReceived",  bg:"#FEF3C7",border:"#F0D87A",text:"#3B2F00",stripe:"#F59E0B",fold:"#F0D87A",rot:1.2, ct:"3m", wip:0,  va:"VA",   dot:"#10B981",bot:false,x:68},
    {name:"Inventory\nCheck", bg:"#DBEAFE",border:"#93C5FD",text:"#1E3A5F",stripe:"#3B82F6",fold:"#BFDBFE",rot:-0.8,ct:"7m", wip:24, va:"NNVA", dot:"#F59E0B",bot:false,x:300},
    {name:"Pick &\nPack",     bg:"#FEF3C7",border:"#F0D87A",text:"#3B2F00",stripe:"#F59E0B",fold:"#F0D87A",rot:1.5, ct:"14m",wip:18, va:"VA",   dot:"#EF4444",bot:true, x:532},
    {name:"Quality\nCheck",   bg:"#FCE7F3",border:"#F9A8D4",text:"#4A1535",stripe:"#EC4899",fold:"#FBCFE8",rot:-1.1,ct:"6m", wip:8,  va:"NNVA", dot:"#F59E0B",bot:false,x:764},
    {name:"Ship\nOrders",     bg:"#D1FAE5",border:"#6EE7B7",text:"#064E3B",stripe:"#10B981",fold:"#A7F3D0",rot:0.7, ct:"4m", wip:3,  va:"VA",   dot:"#10B981",bot:false,x:996},
  ]
  const NW=158,NH=90,NY=72
  // Total canvas width needed = last note x + NW + customer block
  const CANVAS_W = 996 + NW + 70
  return (
    <div style={{position:"relative",overflow:"hidden",padding:"72px 0 0"}}>
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${C.p0} 0%,rgba(3,4,13,0.92) 100%)`}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:1120,margin:"0 auto",padding:"0 32px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(59,124,255,0.12)",border:`1px solid rgba(59,124,255,0.25)`,borderRadius:999,padding:"5px 16px",marginBottom:14}}>
            <span style={{fontFamily:"monospace",fontSize:10,fontWeight:700,color:C.blue,letterSpacing:2}}>LIVE CANVAS PREVIEW</span>
          </div>
          <h2 className="tc sans" style={{fontSize:"clamp(22px,3.5vw,36px)",fontWeight:800,color:C.t1,lineHeight:1.1,letterSpacing:-0.8,marginBottom:10}}>
            This is what your process looks like inside VeSiMy
          </h2>
          <p style={{fontSize:14,color:C.t2,maxWidth:460,margin:"0 auto",lineHeight:1.7}}>
            Physical sticky notes. Real data. The bottleneck glows red automatically.
          </p>
        </div>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch" as any,borderRadius:16,boxShadow:"0 4px 0 rgba(10,18,80,0.9),0 8px 0 rgba(8,14,60,0.7),0 24px 64px rgba(0,0,0,0.8)",marginBottom:-2}}>
        <div style={{background:"#F5F4F1",borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",minWidth:CANVAS_W+80}}>
          <div style={{background:"#060C1A",height:38,display:"flex",alignItems:"center",padding:"0 14px",gap:7,borderBottom:"1px solid rgba(59,124,255,0.15)"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#3B7CFF",boxShadow:"0 0 6px #3B7CFF"}}/>
            <span style={{fontFamily:C.sans,fontWeight:800,fontSize:11,color:"#EEF2FF"}}>Ve<span style={{color:"#3B7CFF"}}>Si</span>My</span>
            <span style={{color:"#2A3455",fontSize:10}}>/</span>
            <span style={{color:"#8B9CC8",fontSize:10}}>Order Fulfilment Process</span>
            <div style={{background:"rgba(59,124,255,0.15)",color:"#90BAFF",fontSize:7,fontFamily:"monospace",letterSpacing:1,padding:"2px 6px",borderRadius:999}}>PHASE 2</div>
            <div style={{flex:1}}/>
            <span style={{fontFamily:"monospace",fontSize:8,color:"#2A3455"}}>PCE: 23% · Lead Time: 2.7h</span>
          </div>
          <div style={{position:"relative",background:"#F5F4F1",height:200,overflow:"hidden"}}>
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.4}}>
              <defs><pattern id="pvdot" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#C8B89A"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#pvdot)"/>
            </svg>
            <div style={{position:"absolute",left:8,top:60,width:46,height:44,background:"#607D8B",borderRadius:4,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"monospace",fontSize:6,fontWeight:700,color:"white"}}>SUPPLIER</span>
            </div>
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
              <defs>
                <marker id="pvah" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#3B7CFF"/></marker>
                <marker id="pvph" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#B0BEC5"/></marker>
              </defs>
              {notes.slice(0,-1).map((n,i)=>{
                const fx=n.x+NW,tx=notes[i+1].x,mx=(fx+tx)/2,Y=NY+NH/2,wip=notes[i+1].wip,pull=i%2===0
                return(<g key={i}>
                  <line x1={fx} y1={Y} x2={tx} y2={Y} stroke={pull?"#3B7CFF":"#B0BEC5"} strokeWidth={pull?1.5:1} markerEnd={`url(#${pull?"pvah":"pvph"})`}/>
                  {wip>0&&<><circle cx={mx} cy={Y} r={10} fill="#FEF3C7" stroke="#F59E0B" strokeWidth={1.2}/><text x={mx} y={Y+4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#F59E0B" fontFamily="monospace">{wip}</text></>}
                </g>)
              })}
            </svg>
            {notes.map((n,i)=>(
              <div key={i} style={{position:"absolute",left:n.x,top:NY,width:NW,height:NH,background:n.bg,border:`0.5px solid ${n.border}`,borderRadius:3,padding:"8px 10px 8px 12px",transform:`rotate(${n.rot}deg)`,transformOrigin:"center center",cursor:"default",overflow:"visible"}}>
                <div style={{position:"absolute",top:0,left:0,width:4,bottom:0,background:n.stripe,borderRadius:"3px 0 0 3px"}}/>
                <div style={{position:"absolute",top:0,right:0,width:0,height:0,borderStyle:"solid",borderWidth:`0 15px 15px 0`,borderColor:`transparent ${n.fold} transparent transparent`,opacity:0.65}}/>
                <div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:n.dot}}/>
                <div style={{fontSize:9,fontWeight:700,color:n.text,lineHeight:1.3,whiteSpace:"pre-line",marginBottom:5}}>{n.name}</div>
                <div style={{fontFamily:"monospace",fontSize:7,color:n.text,opacity:0.85,marginBottom:2}}>CT: {n.ct}  WIP: {n.wip}</div>
                <div style={{fontSize:6.5,fontWeight:700,fontFamily:"monospace",background:`${n.dot}22`,color:n.dot,padding:"1px 4px",borderRadius:3,display:"inline-block"}}>{n.va}</div>
                {n.bot&&<div style={{position:"absolute",bottom:4,left:10,fontSize:5.5,fontWeight:700,color:"#EF4444",fontFamily:"monospace",background:"rgba(239,68,68,0.12)",padding:"1px 4px",borderRadius:3}}>BOTTLENECK</div>}
              </div>
            ))}
            <div style={{position:"absolute",left:62,right:62,bottom:22,height:4,background:"rgba(0,0,0,0.06)",borderRadius:2,display:"flex",gap:1}}>
              {[{w:"8%",c:"#3B7CFF"},{w:"55%",c:"rgba(0,0,0,0.05)"},{w:"12%",c:"#3B7CFF"},{w:"14%",c:"rgba(0,0,0,0.05)"},{w:"6%",c:"#EC4899"},{w:"5%",c:"rgba(0,0,0,0.05)"}].map((seg,i)=>(
                <div key={i} style={{width:seg.w,height:"100%",background:seg.c,borderRadius:2}}/>
              ))}
            </div>
            <div style={{position:"absolute",bottom:6,left:0,right:0,textAlign:"center",fontSize:7,fontFamily:"monospace",color:"#9CA3AF"}}>CT: 34m · Wait: 2.1h · Lead Time: 2.7h · PCE: 23%</div>
            <div style={{position:"absolute",left:notes[notes.length-1].x+NW+10,top:60,width:46,height:44,background:"#607D8B",borderRadius:4,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"monospace",fontSize:6,fontWeight:700,color:"white"}}>CUSTOMER</span>
            </div>
          </div>
        </div>
        </div>
        <div style={{textAlign:"center",marginTop:20,paddingBottom:64}}>
          <a href="/start" style={{textDecoration:"none"}}>
            <button className="br" style={{fontSize:13,padding:"11px 28px"}}>Try it on your own process</button>
          </a>
        </div>
      </div>
    </div>
  )
}

function FounderStatement() {
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(3,4,13,0.9) 0%,rgba(3,4,13,0.7) 50%,rgba(3,4,13,0.95) 100%)"}}/>

      <div style={{position:"relative",padding:"80px 32px",maxWidth:700,margin:"0 auto",textAlign:"center"}}>
        <div style={{width:40,height:1,background:`linear-gradient(90deg,transparent,${C.blue},transparent)`,margin:"0 auto 32px"}}/>
        <blockquote className="sans" style={{fontSize:20,color:C.t1,lineHeight:1.8,fontWeight:400,fontStyle:"italic",textShadow:"0 1px 0 rgba(255,255,255,0.04),0 2px 4px rgba(0,0,8,0.95),0 6px 16px rgba(0,0,0,0.7)",marginBottom:28}}>
          "Lean is not a manufacturing methodology. It is the discipline of seeing clearly. Every business has a process. Every process has waste. The only question is whether you can see it. VeSiMy makes it visible."
        </blockquote>
        <div style={{width:40,height:1,background:`linear-gradient(90deg,transparent,${C.blue},transparent)`,margin:"0 auto 20px"}}/>
        <div className="sans" style={{fontSize:13,color:C.t3,fontWeight:600}}>Max Singh · Founder, VeSiMy</div>
        <div className="mt" style={{color:C.t4,display:"block",marginTop:4}}>LSS Green Belt · 12+ years manufacturing ops · ex-Tesla</div>
      </div>
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function App() {
  useEffect(()=>{ injectStyles(); },[]);
  return (
    <div style={{background:C.p0,minHeight:"100vh",fontFamily:C.sans}}>
      <Nav/>
      <Hero/>
      <ManufacturingHeroDashboard/>
      <PhotoDivider/>
      <VSMPreview/>
      <Features/>
      <BottleneckSection/>
      <SupeSection/>
      <FounderStatement/>
      <Pricing/>
      {/* Footer */}
      <div style={{background:C.p0,borderTop:`1px solid ${C.b1}`,padding:"32px",textAlign:"center"}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:8}}>
          <VLogoMark size={22} />
          <VeSiMyWordmark size={18} onDark={true} />
        </div>
        <MT c={C.t4}>Structured around ISO 22468:2020 · Lean · TPS · Six Sigma</MT>
      </div>
    </div>
  );
}
