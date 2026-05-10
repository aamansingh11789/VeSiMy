// TypeScript enabled
import type { Metadata } from 'next'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Lean Glossary — VeSiMy',
  description: 'Plain-English definitions of Lean, Six Sigma, and continuous improvement terms. Cycle time, takt time, PCE, VSM, 5S, kaizen, SMED, and more.',
}

const SANS  = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO  = "'JetBrains Mono',monospace"
const AMBER = '#D4A843'
const NAVY  = '#04111F'

const TERMS = [
  {
    letter:'C',
    terms:[
      { term:'Cycle Time (CT)', def:'The time it takes to complete one unit of work at a process step — from when work starts to when work ends at that step. Measured in seconds, minutes, or hours.' },
      { term:'Changeover Time', def:'The time required to switch a process from making one product or service to another. Reducing changeover time is the goal of SMED (Single-Minute Exchange of Die).' },
      { term:'Continuous Improvement (CI)', def:'An ongoing effort to improve products, services, or processes. In Lean, CI is often called Kaizen — small, incremental changes made frequently.' },
      { term:'Current State Map', def:'A VSM that documents how a process works today — including cycle times, wait times, WIP, and information flows. The starting point for improvement.' },
    ],
  },
  {
    letter:'D',
    terms:[
      { term:'Defect Rate', def:'The percentage of units that come out of a process step with errors, rework, or quality failures. A key driver of waste. Measured as 0–100%.' },
      { term:'DMAIC', def:'Define, Measure, Analyse, Improve, Control. A structured Six Sigma problem-solving framework used for improving existing processes.' },
      { term:'Demand Rate', def:'How many units of output a customer requires per time period (e.g. 40 orders per day). Used to calculate takt time.' },
    ],
  },
  {
    letter:'F',
    terms:[
      { term:'Fishbone Diagram (Ishikawa)', def:'A visual tool for identifying root causes. Causes are grouped into categories (6M: Man, Machine, Method, Material, Measurement, Mother Nature). Used before 5 Why.' },
      { term:'5 Why Analysis', def:'A root cause technique: ask "why" five times to drill through symptoms to the underlying systemic cause. Developed by Taiichi Ohno at Toyota.' },
      { term:'Future State Map', def:'A VSM showing how the process should work after improvement. Defines targets for cycle time, WIP, wait time, and PCE. The output of a kaizen event.' },
      { term:'Flow', def:'The smooth, uninterrupted movement of work through a process without stopping, queuing, or batching unnecessarily. One of Lean\'s five principles.' },
    ],
  },
  {
    letter:'K',
    terms:[
      { term:'Kaizen', def:'Japanese for "change for the better." A structured improvement event (1–5 days) where a team maps, analyses, and improves a process together.' },
      { term:'Kanban', def:'A visual signalling system that controls the flow of work between steps. Originally physical cards; now also used in digital project management.' },
    ],
  },
  {
    letter:'L',
    terms:[
      { term:'Lead Time (LT)', def:'Total time from when a customer request enters the system to when it is fulfilled — including all waiting time and process time. Always longer than total cycle time.' },
      { term:'Lean', def:'A management philosophy derived from the Toyota Production System (TPS) focused on creating value and eliminating the 8 wastes: overproduction, waiting, transport, over-processing, inventory, motion, defects, and unused talent.' },
      { term:'Little\'s Law', def:'A queuing theory principle: Average queue size = Arrival rate × Average wait time. Used in VeSiMy\'s simulation engine to model demand changes.' },
    ],
  },
  {
    letter:'M',
    terms:[
      { term:'Muda', def:'Japanese for "waste" — any activity that consumes resources without creating value for the customer. The 8 types: overproduction, waiting, transport, over-processing, excess inventory, motion, defects, unused talent.' },
      { term:'Mura', def:'Unevenness or variability in a process. Causes stop-and-start flow, queue build-up, and worker stress. Smoothed by levelling (heijunka).' },
      { term:'Muri', def:'Overburden — pushing workers or equipment beyond their natural capacity. Causes defects, breakdowns, and burnout.' },
    ],
  },
  {
    letter:'O',
    terms:[
      { term:'OEE (Overall Equipment Effectiveness)', def:'A manufacturing metric: Availability × Performance × Quality. World-class OEE is 85%. Most plants run at 40–60%. VeSiMy calculates OEE when uptime, cycle time, and defect data are entered.' },
      { term:'Operators', def:'The number of people required to run a process step. Used in VeSiMy to calculate line balance efficiency and operator utilization.' },
    ],
  },
  {
    letter:'P',
    terms:[
      { term:'PCE (Process Cycle Efficiency)', def:'Value-added time ÷ Lead time × 100%. Shows what percentage of the total lead time is actually productive work. World-class PCE varies by industry: 25%+ is good for manufacturing, 50%+ for services.' },
      { term:'PDCA', def:'Plan, Do, Check, Act. A four-stage iterative improvement cycle originated by W. Edwards Deming. The foundation of all continuous improvement frameworks.' },
      { term:'Pull System', def:'Work is only produced when the downstream customer signals demand (via kanban). Prevents overproduction. The opposite of a push system.' },
      { term:'Push System', def:'Work is produced and pushed downstream regardless of whether the next step is ready. Creates inventory, queues, and WIP build-up.' },
    ],
  },
  {
    letter:'S',
    terms:[
      { term:'SMED (Single-Minute Exchange of Die)', def:'A method to reduce changeover time to under 10 minutes. Works by separating internal activities (machine must be stopped) from external ones (can be done while running).' },
      { term:'Standard Work', def:'The documented, current best method for performing a task safely and efficiently. Forms the baseline for further improvement.' },
      { term:'Six Sigma', def:'A data-driven methodology targeting near-zero defects (3.4 defects per million opportunities). Uses DMAIC for improvement and statistical tools including Cp/Cpk, control charts, and hypothesis testing.' },
    ],
  },
  {
    letter:'T',
    terms:[
      { term:'Takt Time', def:'Available production time ÷ Customer demand rate. The "heartbeat" of the process — how fast you need to produce one unit to meet demand. If any step\'s cycle time exceeds takt, you have a bottleneck.' },
      { term:'TPS (Toyota Production System)', def:'The original Lean system developed by Toyota. The foundation of all modern Lean and continuous improvement frameworks. Based on Jidoka (stop and fix problems) and Just-in-Time flow.' },
    ],
  },
  {
    letter:'V',
    terms:[
      { term:'Value', def:'Anything a customer is willing to pay for. In VSM, steps are classified as VA (Value-Added), NNVA (Necessary Non-Value-Added — required but wasteful), or NVA (Non-Value-Added — pure waste to eliminate).' },
      { term:'VSM (Value Stream Mapping)', def:'A Lean tool that visualises every step in a process — from supplier to customer — along with cycle times, wait times, WIP, information flows, and quality data. Used to identify improvement opportunities.' },
    ],
  },
  {
    letter:'W',
    terms:[
      { term:'Wait Time (WT)', def:'Time a unit spends waiting between process steps, not being worked on. Part of lead time but not cycle time. Reducing wait time directly improves PCE and lead time.' },
      { term:'WIP (Work In Progress)', def:'Units that have started being processed but have not yet been completed and delivered. High WIP indicates poor flow, bottlenecks, or batch processing.' },
    ],
  },
  {
    letter:'Y',
    terms:[
      { term:'Yamazumi Chart', def:'A bar chart showing cycle times for each operator or station relative to takt time. Used to identify imbalanced workloads and rebalance the line.' },
    ],
  },
]

export default function LeanGlossaryPage() {
  const alphabet = TERMS.map(t => t.letter)

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
          <Link href="/docs" style={{ fontSize:13, color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>Docs</Link>
          <Link href="/learn" style={{ fontSize:13, color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>Learn</Link>
          <Link href="/dashboard" style={{ fontSize:13, color:AMBER, textDecoration:'none', fontWeight:600 }}>Dashboard →</Link>
        </div>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'56px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:700, color:AMBER, letterSpacing:1.5,
            textTransform:'uppercase', fontFamily:MONO, marginBottom:12 }}>
            LEAN GLOSSARY
          </div>
          <h1 style={{ fontSize:42, fontWeight:800, color:NAVY, letterSpacing:-0.8,
            lineHeight:1.1, margin:'0 0 14px', fontFamily:SANS }}>
            Lean, Six Sigma & VSM terms
          </h1>
          <p style={{ fontSize:16, color:'#5A6480', lineHeight:1.7, maxWidth:520, margin:0 }}>
            Plain-English definitions of every term used in VeSiMy and across
            Lean, TPS, and Six Sigma practice. No jargon required.
          </p>
        </div>

        {/* Alphabet jump nav */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:40 }}>
          {alphabet.map(l => (
            <a key={l} href={`#letter-${l}`}
              style={{ width:32, height:32, borderRadius:6, display:'flex',
                alignItems:'center', justifyContent:'center', fontSize:13,
                fontWeight:700, color:NAVY, textDecoration:'none',
                background:'#fff', border:'1px solid #E2E8F0',
                transition:'all 0.12s' }}>
              {l}
            </a>
          ))}
        </div>

        {/* Terms */}
        <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
          {TERMS.map(section => (
            <div key={section.letter} id={`letter-${section.letter}`}>
              <div style={{ fontSize:24, fontWeight:800, color:AMBER, fontFamily:SANS,
                marginBottom:16, paddingBottom:8, borderBottom:`2px solid rgba(212,168,67,0.20)` }}>
                {section.letter}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                {section.terms.map(item => (
                  <div key={item.term} style={{ padding:'16px 20px', background:'#fff',
                    borderRadius:8, border:'1px solid #E8ECF2' }}>
                    <div style={{ fontSize:14, fontWeight:700, color:NAVY, marginBottom:6,
                      fontFamily:MONO }}>
                      {item.term}
                    </div>
                    <div style={{ fontSize:13, color:'#334155', lineHeight:1.7 }}>
                      {item.def}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop:48, padding:'18px 22px', background:'rgba(212,168,67,0.06)',
          borderRadius:10, border:`1px solid rgba(212,168,67,0.16)` }}>
          <p style={{ fontSize:13, color:'#5A4800', margin:0, lineHeight:1.6 }}>
            All definitions are based on published Lean, TPS, and Six Sigma literature.
            Primary sources: Toyota Production System (Ohno), Learning to See (Rother & Shook),
            The Machine That Changed the World (Womack, Jones, Roos).
            {' '}<Link href="/contact" style={{ color:AMBER, textDecoration:'none', fontWeight:600 }}>
              Suggest a missing term →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
