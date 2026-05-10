import React from 'react'
// TypeScript enabled
import type { Metadata } from 'next'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Documentation — VeSiMy',
  description: 'How to use VeSiMy. Step-by-step guides for Value Stream Mapping, CI tools, AI analysis, and process improvement.',
}

const SANS  = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO  = "'JetBrains Mono',monospace"
const AMBER = '#D4A843'
const NAVY  = '#04111F'

const SECTIONS = [
  {
    title:'Getting Started',
    color:AMBER,
    pages:[
      { title:'Create your first project',  desc:'Set up a project, choose your industry, and enter project settings.', href:'/learn' },
      { title:'Add process steps',          desc:'Build your current state value stream by adding steps with cycle times.', href:'/learn' },
      { title:'Understanding takt time',    desc:'How to calculate customer demand and set your takt time target.', href:'/learn' },
      { title:'What is PCE?',               desc:'Process Cycle Efficiency explained — how to interpret it for your process.', href:'/lean-glossary' },
    ],
  },
  {
    title:'Value Stream Mapping',
    color:'#1670D4',
    pages:[
      { title:'Current State map',          desc:'What the VSM map shows and how to read each element.', href:'/learn' },
      { title:'Reading bottleneck alerts',  desc:'Why a step is flagged as a bottleneck and what to do next.', href:'/learn' },
      { title:'WIP triangles',              desc:'What work-in-progress inventory means in your VSM.', href:'/learn' },
      { title:'Target State with Supe AI',  desc:'How to generate an AI-assisted future state improvement plan.', href:'/learn' },
    ],
  },
  {
    title:'CI Tools',
    color:'#10B981',
    pages:[
      { title:'Time Study (Stopwatch)',     desc:'Record observations, calculate mean, CV, and process capability.', href:'/learn' },
      { title:'Fishbone (Ishikawa)',        desc:'Structure root cause categories and identify contributing factors.', href:'/learn' },
      { title:'5 Why analysis',             desc:'Step-by-step causal chain analysis to find the root cause.', href:'/learn' },
      { title:'Waste Identification',       desc:'Tag each step with the 8 wastes of Lean.', href:'/learn' },
      { title:'Kaizen actions',             desc:'Create and track improvement actions per step.', href:'/learn' },
      { title:'SMED analysis',              desc:'Separate internal and external setup activities to reduce changeover.', href:'/learn' },
    ],
  },
  {
    title:'Supe AI',
    color:AMBER,
    pages:[
      { title:'What Supe analyses',         desc:'How Supe reads your VSM data and what it looks for.', href:'/learn' },
      { title:'Understanding AI output',    desc:'How to interpret bottleneck identification, waste flags, and suggestions.', href:'/learn' },
      { title:'Target State generation',   desc:'How the AI creates a future state plan from your process data.', href:'/learn' },
      { title:'AI limitations',             desc:'What Supe cannot do — and why that matters.', href:'/learn' },
    ],
  },
  {
    title:'Reports & Export',
    color:'#8B5CF6',
    pages:[
      { title:'Generating a report',        desc:'How to create a process improvement report from your project data.', href:'/learn' },
      { title:'PDF export',                 desc:'What is included in the PDF, how to print it, how to share it.', href:'/learn' },
      { title:'Report sections explained', desc:'Executive summary, VSM metrics, CI findings, action plan.', href:'/learn' },
    ],
  },
  {
    title:'Account & Billing',
    color:'#64748B',
    pages:[
      { title:'Plan comparison',            desc:'Free Start, Trial, Pro, and Enterprise explained.', href:'/pricing' },
      { title:'Upgrading to Pro',           desc:'What changes when you upgrade and how billing works.', href:'/pricing' },
      { title:'Managing your subscription', desc:'How to cancel, pause, or change your plan.', href:'/settings' },
    ],
  },
]

export default function DocsPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA', fontFamily:SANS,
      WebkitFontSmoothing:'antialiased' }}>
      {/* Nav */}
      <div style={{ background:NAVY, borderBottom:'1px solid rgba(255,255,255,0.08)',
        padding:'0 40px', height:56, display:'flex', alignItems:'center',
        justifyContent:'space-between' }}>
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:7,
            background:`linear-gradient(135deg,${AMBER},#B8912E)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:800, color:'#1A0E00' }}>V</div>
          <span style={{ fontSize:15, fontWeight:700, color:'#F0F2FF' }}>VeSiMy</span>
        </Link>
        <div style={{ display:'flex', gap:24 }}>
          <Link href="/learn" style={{ fontSize:13, color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>Learning Center</Link>
          <Link href="/lean-glossary" style={{ fontSize:13, color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>Lean Glossary</Link>
          <Link href="/dashboard" style={{ fontSize:13, color:AMBER, textDecoration:'none', fontWeight:600 }}>Dashboard →</Link>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'56px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:700, color:AMBER, letterSpacing:1.5,
            textTransform:'uppercase', fontFamily:MONO, marginBottom:12 }}>
            DOCUMENTATION
          </div>
          <h1 style={{ fontSize:42, fontWeight:800, color:NAVY, letterSpacing:-0.8,
            lineHeight:1.1, margin:'0 0 14px', fontFamily:SANS }}>
            How VeSiMy works
          </h1>
          <p style={{ fontSize:16, color:'#5A6480', lineHeight:1.7, maxWidth:560, margin:0 }}>
            Step-by-step guides for Value Stream Mapping, CI tools, AI analysis,
            and process improvement. No Lean certification required.
          </p>
        </div>

        {/* Quick start banner */}
        <div style={{ padding:'20px 24px', background:NAVY, borderRadius:12,
          border:`1px solid rgba(212,168,67,0.20)`, marginBottom:40,
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'#F0F2FF', marginBottom:4 }}>
              New to VeSiMy?
            </div>
            <div style={{ fontSize:13, color:'rgba(240,242,255,0.60)' }}>
              Start with the Learning Center — it walks you through your first value stream map interactively.
            </div>
          </div>
          <Link href="/learn" style={{ display:'inline-flex', alignItems:'center', gap:6,
            padding:'9px 20px', borderRadius:8, background:`linear-gradient(135deg,${AMBER},#B8912E)`,
            color:'#1A0E00', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' }}>
            Open Learning Center →
          </Link>
        </div>

        {/* Documentation sections */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:24 }}>
          {SECTIONS.map(section => (
            <div key={section.title} style={{ background:'#fff', borderRadius:12,
              border:'1px solid #E2E8F0', overflow:'hidden',
              boxShadow:'0 1px 4px rgba(4,17,31,0.05)' }}>
              {/* Section header */}
              <div style={{ padding:'16px 20px 14px', borderBottom:'1px solid #F1F5F9',
                display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:3, height:18, borderRadius:2, background:section.color, flexShrink:0 }}/>
                <div style={{ fontSize:13, fontWeight:700, color:NAVY }}>{section.title}</div>
              </div>
              {/* Links */}
              <div style={{ padding:'8px 0' }}>
                {section.pages.map(page => (
                  <Link key={page.title} href={page.href}
                    className='doc-link' style={{ display:'block', padding:'10px 20px', textDecoration:'none', borderBottom:'1px solid #F8FAFC' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:NAVY, marginBottom:2 }}>
                      {page.title}
                    </div>
                    <div style={{ fontSize:11, color:'#94A3B8', lineHeight:1.4 }}>
                      {page.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop:48, padding:'20px 24px', background:'rgba(212,168,67,0.06)',
          borderRadius:10, border:`1px solid rgba(212,168,67,0.16)`, textAlign:'center' }}>
          <p style={{ fontSize:13, color:'#5A4800', margin:0, lineHeight:1.6 }}>
            Documentation is written by the same person who built VeSiMy — Max Singh, Lean Six Sigma Green Belt,
            12+ years in manufacturing and operations.{' '}
            <Link href="/contact" style={{ color:AMBER, textDecoration:'none', fontWeight:600 }}>
              Missing something? Tell us.
            </Link>
          </p>
        </div>
      </div>
    
      <style>{`
        .doc-link:hover { background: #FAFBFE !important; }
        .footer-link:hover { color: #F0F2FF !important; }
        .inner-nav-link:hover { color: #D4A843 !important; }
      `}</style>
    </div>
  )
}
