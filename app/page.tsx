'use client'
// ── app/page.tsx — VeSiMy Homepage v5.0 ──────────────────────────────────────
// Design: Premium dark SaaS — deep navy, warm amber glow, product mockup hero.

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { ManufacturingHeroDashboard } from '@/components/homepage/ManufacturingHeroDashboard'

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG   = '#08090F'   // page canvas
const BG2  = '#0D0F1A'   // elevated surfaces
const NAVY = '#04111F'   // deep navy
const BLUE = '#1670D4'   // electric blue
const BLUEL = '#60A5FA'  // light blue
const AMBER = '#D4A843'  // warm amber (matches reference)
const AMBERL = '#E8C466' // lighter amber for gradients
const AMBERD = '#B8912E' // darker amber for depth
const WHITE = '#F0F2FF'  // near white
const GRAY  = '#8B95B0'  // body text
const GRAY2 = '#5A6480'  // muted text
const BORD  = 'rgba(255,255,255,0.08)'
const BORD2 = 'rgba(255,255,255,0.04)'
const SANS  = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO  = "'JetBrains Mono','Fira Code',monospace"

// ── Styles injected once ──────────────────────────────────────────────────────
const CSS = `
  @keyframes float-gentle {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(0.3deg); }
  }
  @keyframes glow-pulse {
    0%,100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scan {
    0%   { top:-2px; opacity:0; }
    5%   { opacity:0.7; }
    95%  { opacity:0.7; }
    100% { top:100%; opacity:0; }
  }
  .au  { animation: fade-up 0.6s ease both; }
  .au1 { animation: fade-up 0.6s ease 0.1s both; }
  .au2 { animation: fade-up 0.6s ease 0.2s both; }
  .au3 { animation: fade-up 0.6s ease 0.3s both; }
  .au4 { animation: fade-up 0.6s ease 0.4s both; }
  .au5 { animation: fade-up 0.6s ease 0.5s both; }
  .float { animation: float-gentle 7s ease-in-out infinite; will-change: transform; }
  .amber-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:11px 26px; border-radius:8px; font-size:14px; font-weight:700;
    cursor:pointer; border:none; font-family:${SANS}; text-decoration:none;
    background:linear-gradient(135deg,${AMBER} 0%,${AMBERD} 100%);
    color:#0A0800;
    box-shadow:0 1px 0 rgba(255,255,255,0.18) inset, 0 2px 0 ${AMBERD},
               0 4px 0 rgba(160,120,20,0.4), 0 8px 24px rgba(212,168,67,0.25);
    transition:all 0.15s;
    letter-spacing:0.1px;
  }
  .amber-btn:hover {
    background:linear-gradient(135deg,${AMBERL} 0%,${AMBER} 100%);
    box-shadow:0 1px 0 rgba(255,255,255,0.22) inset, 0 2px 0 ${AMBERD},
               0 4px 0 rgba(160,120,20,0.4), 0 12px 32px rgba(212,168,67,0.35);
    transform:translateY(-1px);
  }
  .ghost-btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:11px 22px; border-radius:8px; font-size:14px; font-weight:600;
    cursor:pointer; background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.14); color:${WHITE};
    font-family:${SANS}; text-decoration:none; transition:all 0.15s;
  }
  .ghost-btn:hover { background:rgba(255,255,255,0.10); border-color:rgba(255,255,255,0.22); }
  .nav-link {
    display:inline-flex; align-items:center; gap:4px;
    font-size:14px; font-weight:500; color:${GRAY}; cursor:pointer;
    text-decoration:none; background:none; border:none; padding:4px 2px;
    font-family:${SANS}; transition:color 0.15s; white-space:nowrap;
  }
  .nav-link:hover { color:${WHITE}; }
  .feature-card {
    display:flex; flex-direction:column; gap:10px; padding:24px;
    border-radius:12px; border:1px solid rgba(255,255,255,0.07);
    background:rgba(255,255,255,0.03); transition:all 0.2s;
  }
  .feature-card:hover { border-color:rgba(212,168,67,0.22); background:rgba(212,168,67,0.03); }
  .testi-card {
    background:#FFFFFF; border-radius:12px; padding:28px;
    box-shadow:0 2px 12px rgba(0,0,0,0.06);
  }
  .pricing-card {
    border-radius:16px; padding:28px; border:1px solid ${BORD};
    background:rgba(255,255,255,0.03);
  }
  .pricing-card.featured {
    background:linear-gradient(160deg,rgba(212,168,67,0.12) 0%,rgba(212,168,67,0.04) 100%);
    border-color:rgba(212,168,67,0.35);
  }
  .check-item { display:flex; gap:8px; align-items:flex-start; margin-bottom:9px; font-size:13px; color:${GRAY}; }
  .check-item .check { color:${AMBER}; font-weight:700; margin-top:1px; flex-shrink:0; }
`

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('vesimy-v5')) return
  const s = document.createElement('style')
  s.id = 'vesimy-v5'
  s.textContent = CSS
  document.head.appendChild(s)
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:200, height:60,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 40px',
      background: scrolled ? 'rgba(8,9,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BORD}` : '1px solid transparent',
      transition:'all 0.3s',
      WebkitFontSmoothing:'antialiased',
    }}>
      {/* Logo */}
      <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:10}}>
        <VLogoMark size={30} />
        <VeSiMyWordmark size={17} onDark />
      </Link>

      {/* Nav links — desktop */}
      <div style={{display:'flex',alignItems:'center',gap:28}} className="home-nav-links">
        {[['Product','/#features'],['Solutions','/#solutions'],['Pricing','/#pricing'],['Learn','/learn'],['Blog','/blog']].map(([label,href])=>(
          <Link key={label} href={href} className="nav-link">{label}</Link>
        ))}
      </div>

      {/* CTA */}
      <div style={{display:'flex',alignItems:'center',gap:12}} className="home-nav-cta">
        <Link href="/auth/login" className="nav-link demo-link">Log in</Link>
        <Link href="/auth/signup" className="amber-btn" style={{padding:'8px 18px',fontSize:13}}>
          Get Started Free
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{display:'none',background:'transparent',border:`1px solid ${BORD}`,
          borderRadius:7,width:36,height:36,flexDirection:'column',
          alignItems:'center',justifyContent:'center',gap:4.5,cursor:'pointer',padding:8}}
        className="n-hamburger"
      >
        <span style={{display:'block',width:18,height:1.5,background:GRAY,borderRadius:2,transition:'all 0.2s',transform:open?'rotate(45deg) translate(2px,2px)':'none'}}/>
        <span style={{display:'block',width:18,height:1.5,background:GRAY,borderRadius:2,transition:'all 0.2s',opacity:open?0:1}}/>
        <span style={{display:'block',width:18,height:1.5,background:GRAY,borderRadius:2,transition:'all 0.2s',transform:open?'rotate(-45deg) translate(2px,-2px)':'none'}}/>
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{position:'fixed',top:60,left:0,right:0,zIndex:199,
          background:'rgba(8,9,15,0.98)',backdropFilter:'blur(12px)',
          borderBottom:`1px solid ${BORD}`,padding:'16px 0 24px'}}>
          {[['Product','/#features'],['Pricing','/#pricing'],['Learn','/learn'],['Log in','/auth/login']].map(([l,h])=>(
            <Link key={l} href={h} onClick={()=>setOpen(false)}
              style={{display:'block',padding:'12px 32px',fontSize:15,
                color:GRAY,textDecoration:'none',fontFamily:SANS,fontWeight:500}}>
              {l}
            </Link>
          ))}
          <div style={{padding:'12px 32px'}}>
            <Link href="/auth/signup" className="amber-btn" style={{width:'100%',justifyContent:'center'}}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Product Mockup ─────────────────────────────────────────────────────────────
function ProductMockup() {
  const steps = [
    {name:'Intake',   ct:'12s', va:'VA',   bot:false},
    {name:'Process',  ct:'45s', va:'VA',   bot:false},
    {name:'Inspect',  ct:'62s', va:'NNVA', bot:true },
    {name:'Dispatch', ct:'22s', va:'VA',   bot:false},
  ]
  return (
    <div className="float" style={{position:'relative',width:580,flexShrink:0,
      WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale'}}>

      {/* Main browser frame */}
      <div style={{
        background:'#FAFBFE', borderRadius:14,
        boxShadow:'0 0 0 1px rgba(255,255,255,0.12), 0 32px 80px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)',
        overflow:'hidden',
      }}>
        {/* Browser chrome */}
        <div style={{
          background:'#F0F2F8', padding:'10px 16px',
          borderBottom:'1px solid #E2E6F0',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <div style={{display:'flex',gap:5}}>
            {['#FF5F57','#FFBD2E','#28C940'].map(c=>(
              <div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>
            ))}
          </div>
          <div style={{flex:1,background:'#E4E8F2',borderRadius:5,padding:'4px 12px',
            fontSize:11,color:'#5A6480',fontFamily:SANS,display:'flex',alignItems:'center',gap:6}}>
            <span style={{color:'#94A3B8'}}>🔒</span> vesimy.com/project/assembly-line-a
          </div>
          <div style={{display:'flex',gap:8,fontSize:11,color:'#94A3B8'}}>
            <span>v1.2 ↓</span>
            <button style={{background:BLUE,color:'#fff',border:'none',borderRadius:5,
              padding:'3px 10px',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:SANS}}>
              Share
            </button>
          </div>
        </div>

        {/* App content */}
        <div style={{padding:'16px 18px', background:'#F5F7FA'}}>
          {/* Top bar */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:'#0F172A',fontFamily:SANS}}>
              Current State · Assembly Line A
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:5,
              background:'rgba(22,112,212,0.10)',border:'1px solid rgba(22,112,212,0.25)',
              borderRadius:100,padding:'3px 9px'}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#10B981'}}/>
              <span style={{fontSize:11,fontWeight:700,color:'#10B981',fontFamily:MONO}}>LIVE</span>
            </div>
          </div>

          {/* KPI row */}
          <div style={{display:'flex',gap:8,marginBottom:14}}>
            {[['Lead Time','18.2m','#1670D4'],['PCE','26%','#D4A843'],['Takt','32s','#5A6480'],['WIP','31','#EF4444']].map(([l,v,c])=>(
              <div key={l as string} style={{flex:1,background:'#fff',borderRadius:8,
                border:'1px solid #E2E8F0',padding:'8px 10px',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                <div style={{fontSize:10,color:'#94A3B8',fontFamily:SANS,letterSpacing:0.4}}>{l}</div>
                <div style={{fontSize:16,fontWeight:800,color:c as string,fontFamily:MONO,lineHeight:1.1,marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>

          {/* VSM steps */}
          <div style={{background:'#fff',borderRadius:10,border:'1px solid #E2E8F0',
            padding:'14px 16px',boxShadow:'0 2px 6px rgba(0,0,0,0.04)'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#5A6480',letterSpacing:1,
              textTransform:'uppercase',fontFamily:SANS,marginBottom:10}}>Value Stream</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{fontSize:10,color:'#94A3B8',flexShrink:0}}>Supplier →</div>
              {steps.map((s,i)=>(
                <React.Fragment key={s.name}>
                  <div style={{
                    flex:1, borderRadius:8, padding:'10px 10px 8px',
                    background: s.bot ? 'rgba(239,68,68,0.05)' : '#FAFBFE',
                    border:`1.5px solid ${s.bot ? '#EF4444' : '#E2E8F0'}`,
                    position:'relative',
                  }}>
                    {s.bot && <div style={{position:'absolute',top:-5,right:-4,
                      width:14,height:14,background:'#EF4444',borderRadius:'50%',
                      display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{fontSize:8,color:'#fff',fontWeight:800,lineHeight:1}}>!</span>
                    </div>}
                    <div style={{fontSize:11,fontWeight:700,color:s.bot?'#EF4444':'#0F172A',
                      fontFamily:SANS,marginBottom:3}}>{s.name}</div>
                    <div style={{fontSize:14,fontWeight:800,color:s.bot?'#EF4444':'#1670D4',
                      fontFamily:MONO,lineHeight:1}}>{s.ct}</div>
                    <div style={{display:'inline-block',marginTop:4,fontSize:9,fontWeight:700,
                      padding:'1px 5px',borderRadius:4,
                      background:s.va==='VA'?'rgba(16,185,129,0.10)':'rgba(245,158,11,0.10)',
                      color:s.va==='VA'?'#10B981':'#D4A843'}}>{s.va}</div>
                  </div>
                  {i < steps.length-1 && (
                    <div style={{fontSize:14,color:'#CBD5E1',flexShrink:0}}>→</div>
                  )}
                </React.Fragment>
              ))}
              <div style={{fontSize:10,color:'#94A3B8',flexShrink:0}}>→ Customer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Process Insights card */}
      <div style={{
        position:'absolute', bottom:-20, left:-32,
        background:'#fff', borderRadius:12,
        boxShadow:'0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        padding:'16px 18px', width:190, zIndex:10,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
          <div style={{width:18,height:18,borderRadius:5,background:BLUE,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:9,color:'#fff'}}>◈</span>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:'#0F172A',fontFamily:SANS}}>Process Insights</span>
        </div>
        <div style={{display:'flex',gap:14,marginBottom:10}}>
          {[['14','Steps'],['2','Bottlenecks'],['87%','PCE Score']].map(([v,l])=>(
            <div key={l}>
              <div style={{fontSize:16,fontWeight:800,color:'#0F172A',fontFamily:MONO,lineHeight:1}}>{v}</div>
              <div style={{fontSize:9,color:'#94A3B8',fontFamily:SANS,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {/* Sparkline */}
        <svg width={154} height={32} style={{display:'block'}}>
          <polyline points="0,28 20,22 40,18 60,24 80,12 100,8 120,14 154,4"
            fill="none" stroke="#1670D4" strokeWidth={1.5} strokeLinecap="round"/>
          <polyline points="0,28 20,22 40,18 60,24 80,12 100,8 120,14 154,4 154,32 0,32"
            fill="rgba(22,112,212,0.08)" stroke="none"/>
        </svg>
        <div style={{fontSize:10,color:BLUE,fontWeight:600,fontFamily:SANS,marginTop:4}}>
          View full analysis →
        </div>
      </div>

      {/* Floating Supe AI card */}
      <div style={{
        position:'absolute', top:-18, right:-28,
        background:'#fff', borderRadius:12,
        boxShadow:'0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        padding:'14px 16px', width:200, zIndex:10,
      }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:16,height:16,borderRadius:4,background:`linear-gradient(135deg,${AMBER},${AMBERD})`,
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:8,fontWeight:800}}>✦</span>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:'#0F172A',fontFamily:SANS}}>VeSiMy AI</span>
          </div>
          <span style={{fontSize:11,color:'#CBD5E1'}}>×</span>
        </div>
        <div style={{fontSize:11,color:'#64748B',fontFamily:SANS,marginBottom:10}}>How can I help you today?</div>
        {['Analyze process efficiency','Find bottlenecks','Suggest improvements','Generate documentation'].map(item=>(
          <div key={item} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 0',
            borderTop:'1px solid #F1F5F9'}}>
            <div style={{width:14,height:14,borderRadius:3,background:'#F0F4FF',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:7,color:BLUE}}>◈</span>
            </div>
            <span style={{fontSize:10.5,color:'#334155',fontFamily:SANS}}>{item}</span>
          </div>
        ))}
        <div style={{marginTop:8,display:'flex',gap:6,alignItems:'center',
          background:'#F8FAFB',borderRadius:7,border:'1px solid #E2E8F0',padding:'7px 10px'}}>
          <span style={{flex:1,fontSize:10,color:'#94A3B8',fontFamily:SANS}}>Ask anything about your process...</span>
          <div style={{width:20,height:20,borderRadius:5,background:BLUE,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontSize:10}}>→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position:'relative', overflow:'hidden',
      minHeight:'92vh', padding:'60px 40px 80px',
      backgroundImage:"url('/hero-bg.png')",
      backgroundSize:'cover', backgroundPosition:'center',
      display:'flex', alignItems:'center',
    }}>
      {/* Overlays */}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(5,6,14,0.85) 0%,rgba(6,8,16,0.70) 50%,rgba(5,6,14,0.90) 100%)'}}/>
      {/* Warm amber glow — upper right, like reference */}
      <div style={{position:'absolute',top:-80,right:-80,width:600,height:600,
        background:'radial-gradient(ellipse at center, rgba(212,168,67,0.14) 0%, transparent 70%)',
        filter:'blur(40px)',pointerEvents:'none'}}/>
      {/* Blue glow — left */}
      <div style={{position:'absolute',bottom:0,left:0,width:500,height:400,
        background:'radial-gradient(ellipse at bottom left, rgba(22,112,212,0.08) 0%, transparent 70%)',
        pointerEvents:'none'}}/>

      <div style={{position:'relative',maxWidth:1220,margin:'0 auto',width:'100%',
        display:'flex',alignItems:'center',gap:80, WebkitFontSmoothing:'antialiased'}}>

        {/* Left: copy */}
        <div style={{flex:'1 1 500px',minWidth:0}}>
          {/* Badge */}
          <div className="au" style={{display:'inline-flex',alignItems:'center',gap:8,
            marginBottom:28,background:'rgba(212,168,67,0.10)',
            border:'1px solid rgba(212,168,67,0.28)',borderRadius:100,padding:'5px 14px 5px 10px'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:AMBER,
              boxShadow:`0 0 6px ${AMBER}`,animation:'glow-pulse 2.5s ease-in-out infinite'}}/>
            <span style={{fontSize:11,fontWeight:700,color:AMBER,letterSpacing:1.5,
              textTransform:'uppercase',fontFamily:MONO}}>
              AI-Powered Process Intelligence
            </span>
          </div>

          {/* Headline */}
          <div className="au1">
            <h1 style={{fontSize:54,fontWeight:800,color:WHITE,lineHeight:1.07,
              letterSpacing:-1.8,marginBottom:0,fontFamily:SANS}}>
              From process mapping
            </h1>
          </div>
          <div className="au2" style={{marginBottom:24}}>
            <h1 style={{fontSize:54,fontWeight:800,lineHeight:1.07,
              letterSpacing:-1.8,marginBottom:0,fontFamily:SANS,
              background:`linear-gradient(135deg, ${AMBER} 0%, ${AMBERL} 50%, ${AMBER} 100%)`,
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundClip:'text'}}>
              to continuous improvement.
            </h1>
          </div>

          {/* Sub */}
          <p className="au3" style={{fontSize:16,color:GRAY,lineHeight:1.75,
            maxWidth:480,marginBottom:36,fontFamily:SANS}}>
            VeSiMy helps operations teams map, measure, analyze, and improve how
            work gets done — with AI that turns process complexity into clarity.
          </p>

          {/* CTAs */}
          <div className="au4" style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:48}}
            id="hero-cta-row">
            <Link href="/auth/signup" className="amber-btn">
              Get Started Free
            </Link>
            <Link href="/start" className="ghost-btn">
              <span style={{fontSize:12}}>▶</span> Try Free Demo
            </Link>
          </div>

          {/* Trust bar */}
          <div className="au5">
            <div style={{fontSize:10,fontWeight:700,color:GRAY2,letterSpacing:1.5,
              textTransform:'uppercase',fontFamily:MONO,marginBottom:14}}>
              Used across operations-focused teams
            </div>
            <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
              {['Manufacturing','Healthcare','Logistics','Food & Beverage','Financial Services','Construction'].map((label)=>(
                <div key={label} style={{
                  display:'flex',alignItems:'center',gap:0,
                  fontSize:11,color:GRAY2,fontFamily:SANS,fontWeight:500,
                  padding:'4px 12px',borderRadius:100,
                  border:'1px solid rgba(255,255,255,0.10)',
                  background:'rgba(255,255,255,0.04)',
                }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: product mockup */}
        <div className="au5" style={{flexShrink:0}}>
          <ProductMockup />
        </div>
      </div>
    </section>
  )
}

// ── Social proof — honest, no fake metrics ────────────────────────────────────
// NOTE: No fake testimonials, ratings, or user counts.
// Replace this section with real customer quotes when available.

function SocialProof() {
  // Honest proof section — no fake reviews, no fake ratings, no invented quotes
  // Replace placeholder cards with real customer stories when available
  const INDUSTRIES = [
    {icon:'⚙', name:'Manufacturing',       desc:'Assembly, machining, fabrication, production lines'},
    {icon:'🏥', name:'Healthcare',          desc:'Clinics, hospitals, labs, care pathways'},
    {icon:'📦', name:'Logistics',           desc:'Warehousing, fulfilment, last-mile delivery'},
    {icon:'🍺', name:'Food & Beverage',     desc:'Brewing, bottling, food processing, FMCG'},
    {icon:'✈', name:'Aerospace',           desc:'MRO, assembly, quality systems, traceability'},
    {icon:'🏗', name:'Construction',        desc:'Site processes, project handoffs, defect tracking'},
  ]
  return (
    <section style={{background:'#F5F7FA',padding:'72px 40px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:11,fontWeight:700,color:AMBER,letterSpacing:1.5,
            textTransform:'uppercase',fontFamily:MONO,marginBottom:12}}>
            BUILT FOR OPERATIONS
          </div>
          <h2 style={{fontSize:36,fontWeight:800,color:'#04111F',
            letterSpacing:-0.6,lineHeight:1.15,fontFamily:SANS,margin:0}}>
            Works across industries with processes
          </h2>
          <p style={{fontSize:15,color:GRAY2,maxWidth:520,margin:'14px auto 0',
            lineHeight:1.7,fontFamily:SANS}}>
            Any team that maps, measures, and improves how work gets done
            can use VeSiMy. The tools adapt to your industry language automatically.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
          {INDUSTRIES.map((ind)=>(
            <div key={ind.name} style={{display:'flex',gap:14,alignItems:'flex-start',
              padding:'18px 20px',background:'#fff',borderRadius:12,
              border:'1px solid #E8ECF2',boxShadow:'0 1px 4px rgba(4,17,31,0.05)'}}>
              <div style={{width:40,height:40,borderRadius:10,background:'rgba(212,168,67,0.10)',
                border:'1px solid rgba(212,168,67,0.20)',display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:18,flexShrink:0}}>
                {ind.icon}
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#0F172A',fontFamily:SANS,marginBottom:4}}>
                  {ind.name}
                </div>
                <div style={{fontSize:12,color:'#64748B',lineHeight:1.5,fontFamily:SANS}}>
                  {ind.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:40,padding:'20px 24px',background:'rgba(212,168,67,0.06)',
          border:'1px solid rgba(212,168,67,0.18)',borderRadius:12,textAlign:'center'}}>
          <p style={{fontSize:14,color:'#5A4800',fontFamily:SANS,lineHeight:1.7,margin:0}}>
            <strong>Structured around ISO 22468:2020, Lean, TPS, and Six Sigma principles.</strong>
            {' '}Not a generic AI chatbot. Not a training platform.
            A dedicated execution workspace for process improvement teams.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {icon:'⊕',  title:'Map with ease',         body:'Drag-drop VSM builder. Capture any process in minutes, not hours.'},
  {icon:'✦',  title:'AI-powered Supe',        body:'Detects bottlenecks, waste, and improvement opportunities automatically.'},
  {icon:'◎',  title:'17 CI tools',            body:'Stopwatch, Fishbone, 5 Why, SMED, Kaizen, PDCA — all in one platform.'},
  {icon:'⟳',  title:'Target State',           body:'AI generates a Future State VSM with projected metrics and action plan.'},
  {icon:'▨',  title:'Multi-industry support',  body:'66 industry verticals. Lean terminology adapts to your sector automatically.'},
]

function Features() {
  return (
    <section id="features" style={{background:BG,padding:'80px 40px',borderTop:`1px solid ${BORD2}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{fontSize:11,fontWeight:700,color:AMBER,letterSpacing:1.5,
            textTransform:'uppercase',fontFamily:MONO,marginBottom:12}}>
            PLATFORM CAPABILITIES
          </div>
          <h2 style={{fontSize:38,fontWeight:800,color:WHITE,letterSpacing:-0.8,
            lineHeight:1.15,fontFamily:SANS,margin:0}}>
            Everything your CI team needs
          </h2>
          <p style={{fontSize:15,color:GRAY,maxWidth:540,margin:'16px auto 0',
            lineHeight:1.7,fontFamily:SANS}}>
            Not a training platform. Not a generic AI chatbot. VeSiMy is the
            execution layer that turns Lean knowledge into measurable improvement.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
          {FEATURES.map((f,i)=>(
            <div key={i} className="feature-card">
              <div style={{width:40,height:40,borderRadius:10,
                background:`rgba(212,168,67,0.10)`,
                border:`1px solid rgba(212,168,67,0.20)`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:18}}>
                <span style={{color:AMBER}}>{f.icon}</span>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:WHITE,fontFamily:SANS}}>{f.title}</div>
              <div style={{fontSize:13,color:GRAY,lineHeight:1.6,fontFamily:SANS}}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name:'Free Start', price:'Free', sub:'No account needed', featured:false,
      color:GRAY2, cta:'Start mapping now', href:'/start',
      features:['1 process map','Stopwatch & time study','Plain language report','1 improvement action'],
    },
    {
      name:'Trial', price:'14 days', sub:'No credit card', featured:false,
      color:'#10B981', cta:'Create free account', href:'/auth/signup',
      features:['All 17 CI tools','AI-guided workflow','Up to 3 projects','AI report preview'],
    },
    {
      name:'Pro', price:'$29', priceSub:'/month', sub:'or $23/mo billed annually',
      featured:true, color:AMBER, cta:'Start Pro', href:'/auth/signup',
      features:['Everything in Trial','Supe AI full analysis','Target State VSM','PDF export','Simulation engine','Kaizen roadmap'],
    },
    {
      name:'Enterprise', price:'Custom', sub:'Volume discounts available',
      featured:false, color:BLUEL, cta:'Get a quote', href:'/contact',
      features:['Team collaboration','Leader & member roles','Version comparison','API + SSO + SLA'],
    },
  ]

  return (
    <section id="pricing" style={{background:BG2,padding:'80px 40px',borderTop:`1px solid ${BORD}`}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{fontSize:11,fontWeight:700,color:AMBER,letterSpacing:1.5,
            textTransform:'uppercase',fontFamily:MONO,marginBottom:12}}>
            PRICING
          </div>
          <h2 style={{fontSize:38,fontWeight:800,color:WHITE,letterSpacing:-0.8,
            lineHeight:1.15,fontFamily:SANS,margin:0}}>
            Start free. Upgrade when VeSiMy earns it.
          </h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,alignItems:'start'}}>
          {plans.map((p,i)=>(
            <div key={i} className={`pricing-card${p.featured?' featured':''}`}
              style={{position:'relative',borderColor: p.featured?`rgba(212,168,67,0.40)`:BORD}}>
              {p.featured && (
                <div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',
                  background:`linear-gradient(90deg,${AMBER},${AMBERL})`,
                  borderRadius:100,padding:'4px 16px',whiteSpace:'nowrap'}}>
                  <span style={{fontSize:10,fontWeight:800,color:'#0A0800',
                    letterSpacing:1,textTransform:'uppercase',fontFamily:MONO}}>
                    Most Popular
                  </span>
                </div>
              )}
              <div style={{fontSize:10,fontWeight:700,color:p.color,letterSpacing:1.5,
                textTransform:'uppercase',fontFamily:MONO,marginBottom:12}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:4}}>
                <span style={{fontSize:28,fontWeight:800,color:WHITE,fontFamily:SANS,
                  letterSpacing:-0.5}}>{p.price}</span>
                {(p as any).priceSub && <span style={{fontSize:13,color:GRAY,fontFamily:SANS}}>{(p as any).priceSub}</span>}
              </div>
              <div style={{fontSize:12,color:GRAY2,fontFamily:SANS,marginBottom:20}}>{p.sub}</div>
              {p.features.map(f=>(
                <div key={f} className="check-item">
                  <span className="check">✓</span>
                  <span style={{fontFamily:SANS}}>{f}</span>
                </div>
              ))}
              <Link href={p.href}
                style={{
                  display:'block',textAlign:'center',marginTop:20,padding:'11px',
                  borderRadius:8,fontSize:13,fontWeight:700,textDecoration:'none',
                  fontFamily:SANS,transition:'all 0.15s',
                  ...(p.featured ? {
                    background:`linear-gradient(135deg,${AMBER},${AMBERD})`,
                    color:'#0A0800',
                    boxShadow:`0 4px 12px rgba(212,168,67,0.30)`,
                  } : {
                    background:'rgba(255,255,255,0.07)',
                    color:WHITE,
                    border:`1px solid ${BORD}`,
                  }),
                }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p style={{textAlign:'center',marginTop:28,fontSize:13,color:GRAY2,fontFamily:SANS}}>
          Start with one process. No account needed. Upgrade when you see the value.
        </p>
      </div>
    </section>
  )
}

// ── Bottom CTA ────────────────────────────────────────────────────────────────
function BottomCTA() {
  return (
    <section style={{padding:'48px 40px 56px'}}>
      <div style={{
        maxWidth:1100,margin:'0 auto',borderRadius:20,
        background:`linear-gradient(160deg,${BG2} 0%,rgba(12,14,24,1) 100%)`,
        border:`1px solid rgba(212,168,67,0.18)`,
        padding:'56px 48px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        flexWrap:'wrap',gap:32,
        position:'relative',overflow:'hidden',
      }}>
        {/* Amber glow */}
        <div style={{position:'absolute',right:-60,top:-60,width:400,height:400,
          background:'radial-gradient(ellipse at center,rgba(212,168,67,0.10) 0%,transparent 70%)',
          pointerEvents:'none'}}/>
        <div style={{position:'relative',flex:'1 1 400px'}}>
          <h2 style={{fontSize:36,fontWeight:800,color:WHITE,letterSpacing:-0.8,
            lineHeight:1.2,fontFamily:SANS,marginBottom:12}}>
            Ready to turn complexity<br/>
            into your{' '}
            <span style={{background:`linear-gradient(135deg,${AMBER},${AMBERL})`,
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
              backgroundClip:'text'}}>
              competitive advantage?
            </span>
          </h2>
          <div style={{display:'flex',gap:24,marginTop:16,flexWrap:'wrap'}}>
            {['✓ Free 14-day trial','✓ No credit card required','✓ Cancel anytime'].map(item=>(
              <span key={item} style={{fontSize:13,color:GRAY,fontFamily:SANS}}>{item}</span>
            ))}
          </div>
        </div>
        <div style={{position:'relative',display:'flex',flexDirection:'column',
          alignItems:'flex-start',gap:14}}>
          <Link href="/auth/signup" className="amber-btn" style={{fontSize:15,padding:'13px 32px'}}>
            Get Started Free →
          </Link>
          <div style={{fontSize:12,color:GRAY2,fontFamily:SANS,textAlign:'center',width:'100%'}}>
            Start with one process. No account required.
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:BG,borderTop:`1px solid ${BORD}`,padding:'40px 40px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',
          flexWrap:'wrap',gap:32,marginBottom:40}}>
          {/* Brand */}
          <div style={{flex:'1 1 200px'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <VLogoMark size={26} />
              <VeSiMyWordmark size={16} onDark />
            </div>
            <p style={{fontSize:12,color:GRAY2,lineHeight:1.7,maxWidth:220,fontFamily:SANS}}>
              The execution layer for Lean. Map it. Measure it. Improve it.
            </p>
          </div>
          {/* Links */}
          {[
            ['Product',[
              ['VSM Builder','/learn/vsm-fundamentals'],
              ['CI Tools','/learn/ci-tools'],
              ['Simulation','/#pricing'],
              ['PDF Reports','/#pricing'],
              ['Supe AI','/learn/lean-fundamentals'],
            ]],
            ['Company',[
              ['About','/about'],
              ['Blog','/blog'],
              ['Pricing','/pricing'],
              ['Contact','/contact'],
              ['Changelog','/changelog'],
            ]],
            ['Resources',[
              ['Learning Center','/learn'],
              ['Documentation','/docs'],
              ['ISO 22468 Guide','/iso-22468'],
              ['Lean Glossary','/lean-glossary'],
            ]],
          ].map(([heading, links])=>(
            <div key={heading as string} style={{flex:'1 1 140px'}}>
              <div style={{fontSize:11,fontWeight:700,color:WHITE,letterSpacing:1,
                textTransform:'uppercase',fontFamily:MONO,marginBottom:14}}>
                {heading as string}
              </div>
              {(links as [string,string][]).map(([l,href])=>(
                <div key={l} style={{marginBottom:8}}>
                  <a href={href} style={{fontSize:13,color:GRAY2,fontFamily:SANS,
                    textDecoration:'none',transition:'color 0.15s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color=WHITE}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=GRAY2}>
                    {l}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${BORD}`,paddingTop:20,
          display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <span style={{fontSize:11,color:GRAY2,fontFamily:MONO}}>
            © 2026 VeSiMy · Structured around Lean, VSM, and Continuous Improvement principles
          </span>
          <div style={{display:'flex',gap:20}}>
            {['Privacy','Terms','Security'].map(l=>(
              <a key={l} href="#" style={{fontSize:12,color:GRAY2,fontFamily:SANS,textDecoration:'none'}}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { injectStyles() }, [])
  return (
    <div style={{background:BG,minHeight:'100vh',fontFamily:SANS,
      WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale'}}>
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <ManufacturingHeroDashboard />
      <Pricing />
      <BottomCTA />
      <Footer />
    </div>
  )
}
