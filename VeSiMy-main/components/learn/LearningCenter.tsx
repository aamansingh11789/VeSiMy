// @ts-nocheck
'use client'
// ── components/learn/LearningCenter.tsx ──────────────────────────────────────
import { useState } from 'react'
interface Props { userId: string }

const MANUAL = [
  { id:'getting-started', icon:'🚀', title:'Getting Started', pro:false, steps:[
    { title:'Create your first project', body:'Click "New Project" on the Dashboard. Enter a name, select your industry, add the product or service name, and set customer demand and working hours. These values drive your Takt Time calculation automatically.' },
    { title:'Set Takt Time', body:'Takt Time = Available Time ÷ Customer Demand. VeSiMy calculates this automatically when you enter working hours and demand in project settings. Every process step is benchmarked against it — steps over Takt are flagged red.' },
    { title:'Navigate the workspace', body:'Your project has 8 tabs: Builder (add steps), VSM Map (visual stream), Kaizen (events board), Kanban (task tracking), Simulation 🔒 Pro, Live Floor 🔒 Pro, Report, and Branches (parallel flows). Premium tabs require a Pro plan.' },
    { title:'Project settings', body:'Click the gear icon in the top bar to edit project details: name, industry, product, customer, supplier, demand, working hours, and shift count. Changes reflect instantly in all VSM calculations.' },
  ]},
  { id:'builder', icon:'🏗️', title:'Builder — Process Steps', pro:false, steps:[
    { title:'Add a process step', body:'Click the gold "Add Step" button in the top bar or the ⊕ FAB on mobile. Enter the step name, department, operators, cycle time, wait time, WIP, and flow type. Steps appear in sequence representing your process flow left to right.' },
    { title:'Edit or delete a step', body:'Click the ✎ pencil icon on any step card to edit its data. Click the 🗑 trash icon to delete. Drag the ⠿ grip handle on the left side of each card to reorder — the order sets your VSM flow sequence.' },
    { title:'Step fields explained', body:'Cycle Time: time to complete one unit at this step. Wait/Queue Time: idle time before this step begins. WIP: units currently waiting. Operators: people assigned. Uptime: machine availability %. Defect Rate: % of output that fails quality. These feed all calculations.' },
    { title:'CI Tools on each step', body:'Every step has 6 CI tool buttons: ⏱ Time Study, 🐟 Fishbone, ❓ 5 Why, ⚠️ Waste ID, ⚡ Kaizen, and 📈 Improvement. Click any icon to open that tool for that specific step. All data is saved per step.' },
    { title:'Import SOP', body:'Click "Import SOP" to paste a Standard Operating Procedure. VeSiMy will parse it and suggest process steps automatically — saving significant time when mapping complex existing processes.' },
  ]},
  { id:'tool-stopwatch', icon:'⏱', title:'Tool 1 — Time Study', pro:false, steps:[
    { title:'What it does', body:'Measures actual cycle time for a process step. Records multiple observation laps, calculates mean (average), identifies outliers, and sets the official cycle time used in VSM calculations and PCE score.' },
    { title:'How to use it', body:'Click ⏱ on any step card. Press Start to begin timing, Lap to record each cycle. After 5–10 observations, click Save. The mean of valid laps becomes the official cycle time. You can also manually enter a known time.' },
    { title:'Exclude outliers', body:'Click any lap time to toggle it excluded (shown red with strikethrough). Exclude outliers from interruptions or abnormal cycles. The final mean only uses valid observations.' },
    { title:'Baseline and target', body:'Enter a baseline CT from current-state data and a target CT for your future state. The improvement gap calculates automatically and appears in the Report.' },
    { title:'Reading the output', body:'Mean CT shows in gold on step cards. Steps exceeding Takt Time are flagged red — your bottlenecks. This data flows into VSM, PCE calculation, Simulation, and Supe AI.' },
  ]},
  { id:'tool-fishbone', icon:'🐟', title:'Tool 2 — Fishbone (Ishikawa)', pro:false, steps:[
    { title:'What it does', body:'Structured cause-and-effect analysis for quality or process problems. Maps all potential root causes across categories so you can see every contributing factor before jumping to solutions.' },
    { title:'Choose a framework', body:'Select 6M Manufacturing (Machine, Method, Material, Manpower, Measurement, Mother Nature), 8P Service, 4S Service, or Custom. 6M is best for manufacturing defects; 8P for service failures.' },
    { title:'Add causes', body:'Enter the problem statement at the top. Click each category and add cause statements. Aim for 2–3 per category. Press Enter or click + to add each cause quickly.' },
    { title:'Connect to 5 Why', body:'After completing the fishbone, pick the most likely root cause and drill into it with the 5 Why tool on the same step. Ishikawa → 5 Why is the standard lean two-step approach for deep RCA.' },
  ]},
  { id:'tool-fivewhy', icon:'❓', title:'Tool 3 — 5 Why Analysis', pro:false, steps:[
    { title:'What it does', body:"Iterative root cause analysis developed by Taiichi Ohno at Toyota. You ask 'Why?' five times to get past symptoms and surface the true systemic root cause of a problem." },
    { title:'How to use it', body:"Enter the problem statement. Answer Why 1 (why did this happen?), Why 2 (why did that happen?), through Why 5. Each answer becomes the next question. Stop when you reach a root cause you can act on." },
    { title:'Set a countermeasure', body:"Enter a countermeasure tied to the root cause — not a symptom fix. Assign an owner and due date. This populates your Report's RCA section and can link to a Kaizen event." },
    { title:'How many Whys?', body:'Five is a guideline, not a rule. Stop at 3 if you reach root cause early. Complex problems may need 7–8 iterations. The goal is the actual systemic cause, not filling boxes.' },
  ]},
  { id:'tool-waste', icon:'⚠️', title:'Tool 4 — Waste Identification', pro:false, steps:[
    { title:'The 8 wastes (TIMWOODS)', body:'Transport (moving materials), Inventory (excess stock), Motion (people moving), Waiting (idle time), Overproduction (making too much), Over-processing (more work than needed), Defects (errors/rework), Skills (unused talent). Select all that apply to this step.' },
    { title:'How to identify waste', body:"Walk the process (gemba walk) or review data. Ask: Is this step adding value the customer would pay for? Is there unnecessary movement, waiting, or rework? Mark every waste type you observe, even minor ones." },
    { title:'Add notes per waste', body:"After selecting a waste, a text field appears for a specific note. Example — Waiting: 'Machine changeover averages 45 min between batches.' These specifics make Kaizen events much more focused." },
    { title:'Waste in the Report', body:"All waste identifications aggregate in the Report's Waste Register. Steps with the most waste types are prioritized for Kaizen events automatically — a data-driven improvement backlog." },
  ]},
  { id:'tool-kaizen', icon:'⚡', title:'Tool 5 — Kaizen Events', pro:false, steps:[
    { title:'What is a Kaizen event?', body:"A structured, time-boxed improvement activity focused on a specific process area. Typically 1–5 days with a dedicated team. Kaizen = 'change for better' in Japanese. A focused burst of change." },
    { title:'Create a Kaizen item', body:'Click ⚡ on a step. Enter a title, select a category (Safety, Quality, Delivery, Cost, Morale, 5S, Productivity), set priority, assign an owner, and add a due date. Each step can have multiple Kaizen events.' },
    { title:'Track progress', body:'Update status from Open → In Progress → Complete → Verified as work advances. Open event count shows on step cards. The Kaizen tab shows all events across the entire project.' },
    { title:'Kaizen Burst on VSM', body:'Open Kaizen events appear as burst markers on your VSM Map, following standard VSM notation — the internationally recognized symbol for improvement opportunities.' },
  ]},
  { id:'tool-improvement', icon:'📈', title:'Tool 6 — Improvement Tracking', pro:false, steps:[
    { title:'What it does', body:'Tracks specific, measurable improvement goals per step. Captures baseline (current state), target (future state), and actual result — giving you before/after proof of improvement for reporting.' },
    { title:'Add improvement goals', body:'Click 📈 on a step. Select a metric (Cycle Time, Defect Rate, OEE, Uptime, custom), enter your baseline, set a target, and assign an owner with a due date. Add as many goals per step as needed.' },
    { title:'Record actual results', body:'After implementing the improvement, fill in the Actual Result field. Set status to Achieved or Not Achieved. The improvement delta calculates automatically.' },
    { title:'Feeds the Report', body:"All improvement goals with results appear in the Report's Before/After Comparison section — proof of ROI showing management exactly what changed, by how much, and who owned it." },
  ]},
  { id:'vsm', icon:'🗺️', title:'VSM Map', pro:false, steps:[
    { title:'Reading the VSM', body:'The VSM Map tab shows your full value stream visually. Process boxes show step name, CT, operators, and flow type. The timeline below shows value-adding time (CT) in gold and non-value-adding time (Wait) in grey.' },
    { title:'Bottleneck detection', body:'Steps where cycle time exceeds Takt Time are highlighted red — your bottlenecks. The KPI bar at top shows Total CT, Total Wait, PCE %, and Takt Time.' },
    { title:'Export VSM (multi-page)', body:'Click "Export VSM" in the Report tab to open a print-ready A3 landscape layout in a new browser tab. More than 8 steps automatically wrap across multiple pages — no data is ever lost. Use Ctrl+P to print or save as PDF.' },
    { title:'Flow type icons', body:'Each step shows its flow type: → Push, ← Pull, ⊳ FIFO, ⊞ Batch, or ◼ Supermarket. These are standard VSM notation symbols recognized internationally.' },
  ]},
  { id:'kanban', icon:'📋', title:'Kanban Board', pro:false, steps:[
    { title:'What the Kanban board does', body:'Transforms your VSM process steps into a visual work management board. Each column represents a process step. Cards move through columns as work progresses, showing live WIP and flow status.' },
    { title:'First-time setup', body:'When you first open the Kanban tab, VeSiMy auto-creates columns from your process steps plus Backlog and Done. You can rename, recolor, or delete columns freely.' },
    { title:'Add and manage cards', body:'Click "+ Card" in any column. Set title, description, priority, assignee, due date, and optionally link to a VSM step. Drag cards between columns to update status.' },
    { title:'WIP limits', body:'Each column can have a WIP limit — the maximum cards allowed. When exceeded, the column header turns red as a visual signal to finish current work before starting more.' },
  ]},
  { id:'branches', icon:'🌿', title:'Branches — Parallel Flows', pro:false, steps:[
    { title:'What branches are', body:'Branches represent parallel or sub-process flows that join your main value stream — for example, a sub-assembly line feeding into main assembly. VSM standard uses parallel swimlanes for these.' },
    { title:'Create a branch', body:'Go to the Branches tab and click "New Branch". Enter a label and color. Select the main flow step it connects to. Branches appear on the VSM Map as separate lanes with connection lines.' },
    { title:'Add steps to a branch', body:'Once a branch is created, click "Add Step" within it. Branch steps have their own cycle times, operators, wait times, and CI tools — identical to main flow steps.' },
    { title:'Branch totals', body:'Branch step totals (CT, Wait) appear separately in the VSM Map KPI bar. The Report includes branch data in the full lead time calculation when parallel flows are present.' },
  ]},
  { id:'report', icon:'📄', title:'Report and Export', pro:false, steps:[
    { title:'What the Report contains', body:"The Report tab generates a complete A3-style improvement report: project overview, VSM summary, key metrics (PCE, Lead Time, Takt), bottleneck analysis, waste register, RCA summary (5 Why and Fishbone data), Kaizen events, and improvement results." },
    { title:'Download Full Report (PDF)', body:'Click "Download Full Report" to export a professionally formatted PDF with all project data — suitable for stakeholder reviews, value stream reviews, and continuous improvement audits.' },
    { title:'Export VSM separately', body:'Click "Export VSM Map" to generate a standalone multi-page A3 VSM diagram. Large value streams automatically paginate across pages — every step included, nothing truncated.' },
    { title:'Print-friendly layout', body:'Both the PDF Report and VSM Export render in a clean white background layout optimized for print. Use Ctrl+P (or Cmd+P on Mac) in the export tab to save as PDF or print directly.' },
  ]},
  { id:'supe', icon:'⚡', title:'Supe AI — Process Intelligence', pro:true, steps:[
    { title:'What Supe does', body:'Supe is your AI process mentor. It analyzes your entire value stream — all steps, cycle times, waste data, Kaizen events, and metrics — and provides specific, actionable lean improvement recommendations tailored to your actual process data.' },
    { title:'How to use Supe', body:'Click the ⚡ Supe button in the top bar (desktop) or the purple FAB on mobile. Type your question or click "Analyze my process". Supe reads all your step data in real time and responds with lean-specific insights.' },
    { title:'What to ask Supe', body:'"Where is my biggest bottleneck and how do I fix it?", "What wastes should I prioritize?", "How can I improve my PCE?", "Suggest a Kaizen event for my highest CT step." Supe understands lean methodology deeply.' },
    { title:'Supe is a Pro feature', body:'Supe AI is available on Pro and Enterprise plans only. Free users can see the Supe interface but it will be locked until you upgrade. Go to Settings → Subscription or the Pricing page to upgrade.' },
  ]},
  { id:'simulation', icon:'🔬', title:'Process Simulation', pro:true, steps:[
    { title:'What simulation does', body:"Models how your process performs under different conditions. Runs future-state what-if scenarios: What if I reduce this step's CT by 20%? What if I add an operator? What if I eliminate wait time? Shows projected PCE and lead time changes." },
    { title:'Current vs future state', body:'Shows current-state metrics on the left and lets you adjust parameters on the right to model the future state. All projections update in real time as you change values.' },
    { title:'Bottleneck simulation', body:'See exactly what happens to throughput when you improve each step. Identifies which improvements have the highest leverage — so you invest effort where it matters most.' },
    { title:'Simulation is a Pro feature', body:'Process Simulation is available on Pro and Enterprise plans only. It uses your real step data so accuracy improves the more data you have entered. Upgrade from Settings or Pricing.' },
  ]},
  { id:'live', icon:'📡', title:'Live Floor Monitor', pro:true, steps:[
    { title:'What Live Floor Monitor does', body:'A real-time production monitoring view for shop floor use. Shows current cycle time vs target for each step, live WIP counts, operator status, and alerts for steps falling behind Takt Time.' },
    { title:'Shop floor tablet mode', body:'Open Live Floor on a tablet mounted near your process. The layout is optimized for touch screens. Operators can update their step status directly without going back to a desk.' },
    { title:'Live alerts', body:'When a step\'s cycle time exceeds Takt Time for consecutive cycles, Live Floor highlights it red and logs a production alert — giving supervisors instant visibility into emerging bottlenecks.' },
    { title:'Live Floor is a Pro feature', body:'Live Floor Monitor is available on Pro and Enterprise plans only. Upgrade from Settings → Subscription or the Pricing page to unlock real-time floor tracking.' },
  ]},
]

const FAQS = [
  { q:'What is Process Cycle Efficiency (PCE) and what is a good score?', a:'PCE = Total Cycle Time ÷ (Total Cycle Time + Total Wait Time). It measures what percentage of your lead time is actually adding value. World-class manufacturing targets 25–35% PCE or higher. Most processes start at 5–15%. VeSiMy shows your PCE in the metric bar on every project.' },
  { q:'How is Takt Time calculated?', a:'Takt Time = Available Working Time ÷ Customer Demand. For example, if you work 28,800 seconds/day (8 hours) and customers want 120 units/day, Takt = 240 seconds/unit. Enter working hours and demand in project settings and VeSiMy calculates it automatically.' },
  { q:'What is the difference between Cycle Time and Lead Time?', a:'Cycle Time is how long it takes to complete one unit at a single process step. Lead Time is the total time from start to finish across the entire value stream — all cycle times, wait times, and transfer times combined. VeSiMy calculates both.' },
  { q:'How many time study observations should I record?', a:'Minimum 5 observations for stable processes, 10–30 for variable ones. The goal is a statistically representative mean. Use the Exclude feature to remove outliers caused by interruptions, first-run effects, or abnormal conditions.' },
  { q:'When should I use Fishbone vs 5 Why?', a:'Use Fishbone first to brainstorm all possible causes across categories (broad thinking). Then use 5 Why to drill deep into the most likely cause (narrow thinking). Together they form the most powerful RCA combination in lean. Both tools link per step in VeSiMy.' },
  { q:'What are the 8 wastes (TIMWOODS)?', a:'Transport (moving materials unnecessarily), Inventory (excess stock), Motion (people moving unnecessarily), Waiting (idle time), Overproduction (making more than needed), Over-processing (more work than required), Defects (errors and rework), Skills (unused employee knowledge). All 8 are trackable in VeSiMy.' },
  { q:'Can multiple people collaborate on the same project?', a:'Real-time multi-user collaboration is on our near-term roadmap. Currently each user manages their own projects. Enterprise plans include team workspace features — contact us to discuss your team setup.' },
  { q:'How do I model a process with parallel sub-assemblies?', a:'Use the Branches tab to create parallel flow lanes. Each branch has its own steps, cycle times, and CI tools. Branches connect to a parent step in the main flow. The VSM Map shows both main stream and branches with connection lines.' },
  { q:'What does the Kaizen burst symbol on the VSM mean?', a:'The burst (starburst) symbol is standard VSM notation for an improvement opportunity. In VeSiMy, open Kaizen events automatically generate burst markers on the VSM Map — the internationally recognized way to show CI priorities on a value stream.' },
  { q:'What is in the A3 Report?', a:"The A3 Report includes: project overview, VSM summary, key metrics (PCE, Lead Time, Takt, Bottleneck), waste register, root cause analysis summary (5 Why and Fishbone data), all Kaizen events, and improvement tracking results. Formatted for management review." },
  { q:'What does Supe AI analyze?', a:'Supe reads all your step data — cycle times, wait times, operators, defect rates, waste identifications, Kaizen events, 5 Why and Fishbone data, and VSM metrics — then gives lean-specific recommendations. Supe is a Pro feature.' },
  { q:'Is my process data secure?', a:"Yes. All data is stored in Supabase with row-level security — only you can access your projects. Data is encrypted in transit (HTTPS) and at rest. We do not share or sell your process data." },
  { q:'Can I export my data?', a:'Yes. The Report tab lets you export a full PDF report and a standalone multi-page A3 VSM diagram. CSV and Excel export for raw step data is in development for an upcoming release.' },
  { q:'What is the difference between Pro and Lifetime plans?', a:'Pro is $29/month with all premium features (Supe AI, Process Simulation, Live Floor Monitor, unlimited projects). Lifetime is a one-time $99 payment for all Pro features forever with no monthly fee — available at founding member pricing during beta.' },
  { q:'How do I upgrade from Free to Pro?', a:'Go to Settings → Subscription and click "Upgrade to Pro", or visit the Pricing page. Payment is processed securely through Stripe. Your Pro features activate immediately after payment confirmation.' },
]

export function LearningCenter({ userId }: Props) {
  const [activeTab,     setActiveTab]     = useState<'manual'|'faqs'>('manual')
  const [activeSection, setActiveSection] = useState('getting-started')
  const [expandedStep,  setExpandedStep]  = useState<string|null>(null)
  const [expandedFAQ,   setExpandedFAQ]   = useState<number|null>(null)
  const section = MANUAL.find(s => s.id === activeSection) || MANUAL[0]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding:'24px 32px 20px', borderBottom:'1px solid var(--border)', background:'var(--bg2)', flexShrink:0 }}>
        <h1 style={{ fontFamily:'Palatino Linotype,serif', fontSize:26, fontWeight:700, color:'var(--text)', marginBottom:4 }}>📚 Learning Center</h1>
        <p style={{ fontSize:13, color:'var(--text2)', margin:0 }}>Everything you need to master lean process improvement with VeSiMy.</p>
        <div style={{ display:'flex', gap:4, marginTop:16 }}>
          {(['manual','faqs'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:activeTab===t?700:400,
              background:activeTab===t?'rgba(212,162,8,0.12)':'transparent',
              border:`1px solid ${activeTab===t?'rgba(212,162,8,0.35)':'var(--border)'}`,
              color:activeTab===t?'#D4A208':'var(--text2)', cursor:'pointer',
            }}>
              {t==='manual'?'📖 App Manual':'❓ FAQs'}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Tab */}
      {activeTab==='manual' && (
        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
          {/* Sidebar */}
          <div style={{ width:220, flexShrink:0, borderRight:'1px solid var(--border)', overflowY:'auto', padding:'12px 0' }}>
            {MANUAL.map(s => (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setExpandedStep(null) }} style={{
                width:'100%', textAlign:'left', padding:'9px 16px',
                background:activeSection===s.id?'rgba(212,162,8,0.08)':'transparent',
                border:'none', borderLeft:`3px solid ${activeSection===s.id?'#D4A208':'transparent'}`,
                cursor:'pointer', display:'flex', alignItems:'center', gap:8,
              }}>
                <span style={{ fontSize:14 }}>{s.icon}</span>
                <span style={{ fontSize:12, fontWeight:activeSection===s.id?700:400,
                  color:activeSection===s.id?'#D4A208':'var(--text2)', lineHeight:1.3, flex:1 }}>{s.title}</span>
                {s.pro && <span style={{ fontSize:8, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1,
                  background:'rgba(100,38,160,0.12)', border:'1px solid rgba(100,38,160,0.25)',
                  borderRadius:4, padding:'1px 4px', flexShrink:0 }}>PRO</span>}
              </button>
            ))}
          </div>
          {/* Content */}
          <div style={{ flex:1, overflowY:'auto', padding:'24px 28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:24 }}>{section.icon}</span>
              <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:20, fontWeight:700, color:'var(--text)', margin:0 }}>{section.title}</h2>
              {section.pro && <span style={{ fontSize:10, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1.5,
                background:'rgba(100,38,160,0.12)', border:'1px solid rgba(100,38,160,0.25)', borderRadius:6, padding:'3px 8px' }}>🔒 PRO FEATURE</span>}
            </div>
            {section.pro && (
              <div style={{ background:'rgba(100,38,160,0.06)', border:'1px solid rgba(100,38,160,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
                <p style={{ fontSize:13, color:'#8C44CC', margin:0 }}>
                  This feature requires a <strong>Pro or Enterprise plan</strong>.{' '}
                  <a href="/settings" style={{ color:'#D4A208', textDecoration:'none' }}>Settings</a> · <a href="/pricing" style={{ color:'#D4A208', textDecoration:'none' }}>Pricing</a>
                </p>
              </div>
            )}
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:20, lineHeight:1.7 }}>
              {section.steps.length} topic{section.steps.length!==1?'s':''} in this section. Click any topic to expand.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {section.steps.map((step, i) => {
                const key=`${section.id}-${i}`; const open=expandedStep===key
                return (
                  <div key={key} style={{ background:'var(--bg2)', border:`1px solid ${open?'rgba(212,162,8,0.3)':'var(--border)'}`, borderRadius:10, overflow:'hidden' }}>
                    <button onClick={() => setExpandedStep(open?null:key)}
                      style={{ width:'100%', textAlign:'left', padding:'14px 18px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ width:24, height:24, borderRadius:6, flexShrink:0,
                        background:open?'rgba(212,162,8,0.15)':'rgba(112,112,160,0.1)',
                        border:`1px solid ${open?'rgba(212,162,8,0.3)':'var(--border)'}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:11, fontWeight:700, color:open?'#D4A208':'var(--text3)' }}>{i+1}</span>
                      <span style={{ flex:1, fontSize:14, fontWeight:600, color:open?'#D4A208':'var(--text)', lineHeight:1.4 }}>{step.title}</span>
                      <span style={{ color:'var(--text3)', fontSize:16, transition:'transform 0.2s', transform:open?'rotate(90deg)':'none', flexShrink:0 }}>›</span>
                    </button>
                    {open && (
                      <div style={{ padding:'0 18px 16px 54px', borderTop:'1px solid var(--border)' }}>
                        <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.8, margin:'12px 0 0' }}>{step.body}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {(() => { const idx=MANUAL.findIndex(s=>s.id===activeSection); const next=MANUAL[idx+1]; return next?(
              <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid var(--border)' }}>
                <button onClick={() => { setActiveSection(next.id); setExpandedStep(null) }} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:8,
                  background:'rgba(212,162,8,0.06)', border:'1px solid rgba(212,162,8,0.2)',
                  color:'#D4A208', cursor:'pointer', fontSize:13, fontWeight:600,
                }}>Next: {next.icon} {next.title} →</button>
              </div>
            ):null })()}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab==='faqs' && (
        <div style={{ flex:1, overflowY:'auto', padding:'24px 32px', maxWidth:820 }}>
          <p style={{ fontSize:13, color:'var(--text2)', marginBottom:20, lineHeight:1.7 }}>{FAQS.length} frequently asked questions — click any to expand.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map((faq,i) => (
              <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
                <button onClick={() => setExpandedFAQ(expandedFAQ===i?null:i)}
                  style={{ width:'100%', textAlign:'left', padding:'14px 18px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--text)', lineHeight:1.4, flex:1 }}>{faq.q}</span>
                  <span style={{ color:'var(--text3)', fontSize:18, flexShrink:0, transition:'transform 0.2s', transform:expandedFAQ===i?'rotate(90deg)':'none' }}>›</span>
                </button>
                {expandedFAQ===i && (
                  <div style={{ padding:'0 18px 16px', borderTop:'1px solid var(--border)' }}>
                    <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.8, margin:'12px 0 0' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
