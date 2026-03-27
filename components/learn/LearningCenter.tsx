// @ts-nocheck
'use client'
// ── components/learn/LearningCenter.tsx ──────────────────────────────────────
import { useState, useEffect } from 'react'
interface Props { userId: string }

const MANUAL = [
  { id:'getting-started', icon:'', title:'Getting Started', pro:false, steps:[
    { title:'Create your first project', body:'Click "New Project" on the Dashboard. Enter a name, select your industry, add the product or service name, and set customer demand and working hours. These values drive your Takt Time calculation automatically.' },
    { title:'Set Takt Time', body:'Takt Time = Available Time ÷ Customer Demand. VeSiMy calculates this automatically when you enter working hours and demand in project settings. Every process step is benchmarked against it — steps over Takt are flagged red.' },
    { title:'Navigate the workspace', body:'Your project has 10 tabs: Builder (add steps), VSM Map (visual stream), Roadmap (kaizen mission control), PDCA (improvement projects), Kaizen (events board), Kanban (task tracking), Simulation Pro, Live Floor Pro, Report, and Branches. Premium tabs require a Pro plan.' },
    { title:'Project settings', body:'Click the gear icon in the top bar to edit project details: name, industry, product, customer, supplier, demand, working hours, and shift count. Changes reflect instantly in all VSM calculations.' },
  ]},
  { id:'va-classification', icon:'', title:'VA / NNVA / NVA Classification', pro:false, steps:[
    { title:'What is VA classification?', body:'Every process step and every operator task is classified into one of three categories: Value Add (VA) — transforms the product in a way the customer pays for; Necessary Non-Value Add (NNVA) — required but adds no customer value (inspection, transport, setup); Non-Value Add (NVA) — pure waste to be eliminated.' },
    { title:'Why it matters', body:'VA classification is the foundation of lean. Without it you cannot measure process efficiency accurately. A process where 90% of operator time is NVA looks busy but produces almost no value. Classification makes the waste visible and quantifiable.' },
    { title:'How to classify steps', body:'When adding or editing a process step, select the classification using the three buttons at the top of the form. Green = VA, Amber = NNVA, Red = NVA. The VSM Map colour-codes process boxes accordingly — green boxes add value, red boxes are waste targets.' },
    { title:'Classify operator tasks too', body:'In the Operator Steps section of each step, classify each individual task separately. A machine setup step might contain both NNVA tasks (load material — necessary) and NVA tasks (walk to tool cabinet — motion waste). Fine-grained classification feeds the Yamazumi Chart.' },
    { title:'PCE and VA time', body:'Process Cycle Efficiency (PCE) = VA Time ÷ Lead Time. World-class manufacturing targets 95%+ PCE. Most processes start at 10–30%. VeSiMy calculates PCE automatically and colour-codes it green (≥90%), amber (≥60%), or red (<60%) in the KPI bar.' },
  ]},
  { id:'builder', icon:'', title:'Builder — Process Steps', pro:false, steps:[
    { title:'Add a process step', body:'Click the gold "Add Step" button in the top bar or the ⊕ FAB on mobile. Enter the step name, department, VA classification, operators, cycle time, wait time, WIP, and flow type. Steps appear in sequence representing your process flow left to right.' },
    { title:'Step classification options', body:'VA (Value Add): welding, machining, assembly — direct transformation. NNVA (Necessary Non-Value Add): inspection, setup, transport to next step — required but target for reduction. NVA (Non-Value Add): waiting, searching, correction, unnecessary motion — eliminate first.' },
    { title:'Flow type options', body:'Push: upstream produces regardless of downstream demand. Pull: downstream signals when it needs more. FIFO Lane: first-in-first-out queue with controlled WIP. Supermarket: controlled inventory buffer. Queue: deliberate wait step (drying time, cure time). One-piece flow is the ideal state.' },
    { title:'Operator Steps — Standard Work', body:'Expand the Operator Steps section to break a step into individual tasks. Each task has a name, time in seconds, and VA classification. This feeds the Yamazumi Chart and Standard Work Sheet — two of the most powerful tools for operator-level improvement.' },
    { title:'CI Tools on each step', body:'Every step has 6 CI tool buttons: Time Study, Fishbone, 5 Why, Waste ID, ⚡ Kaizen, and Improvement tracking Improvement. Click any icon to open that tool for that specific step. All data is saved per step.' },
    { title:'Import SOP', body:'Click "Import SOP" to paste a Standard Operating Procedure. VeSiMy will parse it and suggest process steps automatically — saving significant time when mapping complex existing processes.' },
  ]},
  { id:'tool-stopwatch', icon:'', title:'Tool 1 — Time Study', pro:false, steps:[
    { title:'What it does', body:'Measures actual cycle time for a process step using direct observation. Records multiple laps, calculates mean (average), standard deviation, and CV%, identifies outliers, and sets the official cycle time used in all VSM calculations and PCE score.' },
    { title:'How to use it', body:'Open Time Study on any step card. Press Start to begin timing, Lap to record each cycle. After 10+ observations, click Save. The mean of valid laps becomes the official cycle time. You can also manually enter a known time if using historical data.' },
    { title:'Exclude outliers', body:'Click any lap time to toggle it excluded (shown red with strikethrough). Exclude outliers from interruptions, abnormal cycles, or first-run effects. The final mean only uses valid observations — this is critical for accurate Takt comparison.' },
    { title:'Baseline and target', body:'Enter a baseline CT from current-state data and a target CT for your future state. The improvement gap calculates automatically. Use the Gap Analysis tool to get AI recommendations on how to close the gap.' },
    { title:'Reading the output', body:'Mean CT shows in gold on step cards. Steps exceeding Takt Time are flagged red — your bottlenecks. This data flows into the VSM map, PCE calculation, Yamazumi Chart, Gap Analysis, and AI Coaching.' },
  ]},
  { id:'tool-fishbone', icon:'', title:'Tool 2 — Fishbone (Ishikawa)', pro:false, steps:[
    { title:'What it does', body:'Structured cause-and-effect analysis for quality or process problems. Maps all potential root causes across categories so you can see every contributing factor before jumping to solutions. Developed by Kaoru Ishikawa as part of the TPS quality toolkit.' },
    { title:'Choose a framework', body:'Select 6M Manufacturing (Machine, Method, Material, Manpower, Measurement, Mother Nature), 8P Service, 4S Service, or Custom. 6M is best for manufacturing defects; 8P for service failures. The framework defines your cause categories.' },
    { title:'Add causes', body:'Enter the problem statement at the top. Click each category and add cause statements. Aim for 2–3 per category. Press Enter or click + to add each cause quickly.' },
    { title:'Connect to 5 Why and PDCA', body:'After completing the fishbone, pick the most likely root cause and drill into it with the 5 Why tool on the same step. Then link to a PDCA project to track the corrective action through to verification. Fishbone → 5 Why → PDCA is the complete RCA chain.' },
  ]},
  { id:'tool-fivewhy', icon:'', title:'Tool 3 — 5 Why Analysis', pro:false, steps:[
    { title:'What it does', body:"Iterative root cause analysis developed by Sakichi Toyoda and systematised at Toyota. You ask 'Why?' five times to get past symptoms and surface the true systemic root cause of a problem. Most problems traced to a missing standard, a standard not followed, or a standard not visible." },
    { title:'How to use it', body:"Enter the problem statement. Answer Why 1 (why did this happen?), Why 2 (why did that happen?), through Why 5. Each answer becomes the next question. Stop when you reach a root cause you can act on — something systemic, not a person." },
    { title:'Set a countermeasure', body:"Enter a countermeasure tied to the root cause — not a symptom fix. Assign an owner and due date. This populates your PDCA project's Do phase and the ISO 9001:2015 §10.2 compliant report." },
    { title:'How deep to go?', body:'Five is a guideline, not a rule. Stop at 3 if you reach root cause early. Complex problems may need 7–8 iterations. If your 5 Why ends with "operator error" you have not gone deep enough — that is always a symptom of a system failure, never the root cause.' },
  ]},
  { id:'tool-waste', icon:'', title:'Tool 4 — Waste Identification (DOWNTIME)', pro:false, steps:[
    { title:'The 8 wastes', body:'Defects (errors/rework), Overproduction (making too much), Waiting (idle time), Non-utilised talent (skills unused), Transport (moving materials), Inventory (excess stock), Motion (people moving), Extra-processing (more work than needed). DOWNTIME is the lean acronym for all 8.' },
    { title:'How to identify waste', body:"Walk the process (gemba walk) or review data. Ask: Is this step adding value the customer would pay for? Is there unnecessary movement, waiting, or rework? Mark every waste type you observe. Non-utilised talent is the most commonly forgotten waste." },
    { title:'Add notes per waste', body:"After selecting a waste type, a text field appears for a specific note. Example — Waiting: 'Machine changeover averages 45 min between batches.' These specifics focus Kaizen events and PDCA corrective actions on real problems." },
    { title:'Connects to Yamazumi', body:"Waste identification at step level and operator task classification (NVA/NNVA) together give you a complete waste picture. The Yamazumi Chart shows the NVA proportion per operator visually — making the elimination target obvious." },
  ]},
  { id:'tool-kaizen', icon:'', title:'Tool 5 — Kaizen Events', pro:false, steps:[
    { title:'What is a Kaizen event?', body:"A structured, time-boxed improvement activity focused on a specific process area. Typically 3–5 days with a dedicated cross-functional team. Kaizen = 'change for better' in Japanese. The goal is measurable improvement in days, not months." },
    { title:'Create a Kaizen item', body:'Open Kaizen on a step. Enter a title, select a category (Safety, Quality, Delivery, Cost, Morale, 5S, Productivity), set priority, assign an owner, and add a due date. Each step can have multiple Kaizen events.' },
    { title:'Track progress', body:'Update status from Open → In Progress → Complete → Verified as work advances. Open event count shows on step cards. The Kaizen tab shows all events across the entire project sorted by priority.' },
    { title:'Kaizen Burst on VSM', body:'Open Kaizen events appear as burst (starburst) markers on your VSM Map — the internationally recognised ISO 22468:2020 symbol for improvement opportunities. Closed events remove the burst automatically.' },
  ]},
  { id:'tool-improvement', icon:'', title:'Tool 6 — Improvement Tracking', pro:false, steps:[
    { title:'What it does', body:'Tracks specific, measurable improvement goals per step. Captures baseline (current state), target (future state), and actual result — giving you before/after proof of improvement for management reporting and ISO audits.' },
    { title:'Add improvement goals', body:'Open Improvement Tracking on a step. Select a metric (Cycle Time, Defect Rate, OEE, Uptime, custom), enter your baseline, set a target, and assign an owner with a due date. Add as many goals per step as needed.' },
    { title:'Record actual results', body:'After implementing the improvement, fill in the Actual Result field. Set status to Achieved or Not Achieved. The improvement delta calculates automatically.' },
    { title:'Feeds the PDCA Check phase', body:'Improvement goal results flow directly into the Check phase of your PDCA project — giving you structured before/after data for the ISO-compliant report. This closes the measurement loop of the PDCA cycle.' },
  ]},
  { id:'pdca', icon:'', title:'PDCA — Improvement Projects', pro:false, steps:[
    { title:'What is PDCA?', body:'PDCA (Plan-Do-Check-Act) is the fundamental improvement cycle used in ISO 9001, Lean, Six Sigma, and all quality management systems. Developed by Walter Shewhart and popularised by W. Edwards Deming, it provides a structured path from problem identification to permanent solution.' },
    { title:'Plan phase', body:'Define the problem clearly with data. Describe the current condition. Analyse root cause (link to your Fishbone and 5 Why tools). Set a specific, measurable target condition. Add team members with their roles. Set a hypothesis: "If we do X, we expect Y because Z."' },
    { title:'Do phase', body:'Add countermeasures (actions to test your hypothesis). Assign each action an owner and due date. Check off actions as they are completed. Add implementation notes about what was done, what challenges arose, and what was adjusted.' },
    { title:'Check phase', body:'Record before/after metrics — cycle time, defect rate, WIP, PCE, or any custom metric. Document the results. Mark whether the target was achieved: Yes (standardise), Partial (adjust and continue), or No (return to Plan with new understanding).' },
    { title:'Act phase', body:'If target met: document standardisation actions, update the Standard Work Sheet, train all operators on the new method. If target not met: capture lessons learned and use them to write a sharper problem statement for the next PDCA cycle.' },
    { title:'Export in 5 formats', body:'Click "Export Report" to choose your format. Same data, five professional outputs: PDCA (standard cycle report), A3 (Toyota one-page format), 8D (Ford customer report for quality escapes), DMAIC (Six Sigma format), OODA (rapid decision cycle). All ISO-compliant.' },
  ]},
  { id:'yamazumi', icon:'', title:'Yamazumi Chart', pro:false, steps:[
    { title:'What is a Yamazumi Chart?', body:'A Yamazumi chart (mountain chart in Japanese) is a stacked bar chart showing the work content of each operator or process step, broken down by VA, NNVA, and NVA time. It is one of the most powerful tools in lean for visualising imbalance and waste at the operator level.' },
    { title:'How to read it', body:'Each bar represents one process step. The bar height is the total cycle time. The green section (VA) should be as tall as possible. The amber section (NNVA) should be minimised over time. The red section (NVA) should be eliminated. The dashed red horizontal line is Takt Time — bars above it are bottlenecks.' },
    { title:'How to populate it', body:'Add operator tasks to each process step using the Operator Steps section in the Step editor. Each task needs a time in seconds and a VA/NNVA/NVA classification. The Yamazumi chart builds automatically from this data.' },
    { title:'Using it for line balancing', body:'The goal is to balance all operator bars to just below Takt Time with maximum VA content. If one operator is at 180s and another is at 60s, redistribute work elements. The ideal state: every operator at takt, doing only VA work.' },
    { title:'Kaizen targets', body:'Red (NVA) sections are your immediate kaizen targets. For each NVA task, open a Kaizen event or 5 Why on that step. The Yamazumi makes the target completely unambiguous — this task, this time, this step. Eliminate it.' },
  ]},
  { id:'standard-work', icon:'', title:'Standard Work Sheet', pro:false, steps:[
    { title:'What is Standard Work?', body:'Standard Work is the documented, current best method for performing a process task. It is not the fastest possible method — it is the safest, highest quality, lowest waste method that any trained operator can reliably replicate. Standard Work is the baseline for all improvement.' },
    { title:'Standard Work Sheet', body:'The Standard Work Sheet shows every operator task in sequence with its time and VA classification. It is the primary document for training new operators, auditing process compliance, and defining the baseline for PDCA improvement cycles.' },
    { title:'Standard Work Combination Sheet', body:'The combination sheet shows the relationship between operator time and machine time per task, revealing where operators wait for machines or machines wait for operators. These hidden wait times are improvement opportunities.' },
    { title:'How to generate it', body:'After adding Operator Steps to your process steps (with names, times, and VA classifications), open the Standard Work Sheet tool from the VSM Map tab. Select a step to view its full task breakdown, VA summary, and takt comparison. Export as an ISO-compliant PDF.' },
    { title:'Updating Standard Work', body:'Standard Work must be updated every time the process changes. In the Act phase of PDCA, updating the Standard Work Sheet is the primary standardisation action. If the document does not reflect reality, operators will not follow it — and improvement gains will revert.' },
  ]},
  { id:'vsm-coaching', icon:'', title:'VSM Gap Analysis & AI Coaching', pro:false, steps:[
    { title:'What is Gap Analysis?', body:'The Gap Analysis tool automatically scans your entire value stream and identifies every gap between your current state and an ideal lean flow. It evaluates PCE, takt compliance, WIP levels, flow type, line balance, and data completeness — and gives you a prioritised list of issues.' },
    { title:'PCE scoring', body:'Your PCE score is colour-coded: green (≥90% — world class), amber (≥60% — improving), red (<60% — significant waste present). The gap between your current PCE and 95% represents lead time waste. Gap Analysis tells you exactly where it is and what to do about it.' },
    { title:'Severity levels', body:'Issues are rated Critical (bottlenecks, major PCE gaps), Warning (imbalance, high WIP, push flow where pull is possible), or Info (achievements and next-level opportunities). Tackle Critical items first — they constrain throughput and will dominate all other metrics.' },
    { title:'AI Coaching', body:'Click "Get AI Coaching Recommendations" to send your full VSM data to Claude AI. It analyses your specific step names, cycle times, takt gap, and identified issues — and returns 3–4 specific, actionable recommendations referencing your actual steps by name. Not generic advice.' },
    { title:'Accessing the tools', body:'Click "Gap Analysis & AI Coaching", "Yamazumi Chart", or "Standard Work Sheet" in the toolbar above the VSM Map. These tools work with your real VSM data — the more complete your step data, the more precise the analysis.' },
  ]},
  { id:'kaizen-roadmap', icon:'', title:'Kaizen Roadmap — Mission Control', pro:false, steps:[
    { title:'What is the Roadmap?', body:'The Kaizen Roadmap is your current-state to future-state improvement journey planner. It organises kaizen events into phases, tracks progress, and shows you a PCE improvement forecast so you can see where each phase gets you — and how far you have to go to reach your target.' },
    { title:'Create phases', body:'Structure your improvement work into phases (e.g., Phase 1 — Quick Wins, Phase 2 — Flow Improvement, Phase 3 — Sustain). Each phase has a PCE target. The roadmap shows a bar chart of projected PCE at the end of each phase.' },
    { title:'Add kaizen events to phases', body:'Within each phase, add kaizen events with title, linked VSM step, owner, due date, target cycle time, target WIP, and expected PCE gain. This creates full accountability — every improvement has an owner, a deadline, and a measurable expected outcome.' },
    { title:'Track status', body:'Update event status from Planned → Active → Complete → Cancelled as work progresses. The overall progress bar shows percentage complete across all phases. Mission control in one view.' },
    { title:'PCE journey chart', body:'The PCE journey chart at the top of the Roadmap shows your current PCE, then the projected PCE at the end of each phase based on your expected gains. This is the single most powerful motivator in lean — seeing exactly what each phase of effort will deliver.' },
  ]},
  { id:'vsm', icon:'', title:'VSM Map', pro:false, steps:[
    { title:'Reading the VSM', body:'The VSM Map shows your full value stream visually using ISO 22468:2020 standard symbols. Process boxes are colour-coded: green = VA, amber = NNVA, red = NVA or bottleneck. The sawtooth timeline below shows CT (VA time) rising above the baseline and wait time below.' },
    { title:'Takt line', body:'A dashed red horizontal line crosses the sawtooth timeline at the Takt Time level. Any process bar rising above this line is a bottleneck — it cannot keep pace with customer demand. This is your primary improvement target.' },
    { title:'Bottleneck detection', body:'Steps where cycle time exceeds Takt Time are highlighted red with a ▲TAKT label and a kaizen burst symbol. The KPI bar traffic-light colours PCE (green/amber/red), WIP (red if >50, amber if >20), and open kaizen events.' },
    { title:'VSM analysis toolbar', body:'Three buttons above the map: Gap Analysis & AI Coaching (finds every lean gap), Yamazumi Yamazumi Chart (operator balance), Standard Work Standard Work Sheet (task documentation). These are the tools that transform a VSM from a diagram into an improvement engine.' },
    { title:'Flow type icons', body:'Push, Pull, FIFO Lane, Supermarket, Queue (deliberate wait step). Standard VSM notation per ISO 22468:2020. Queue steps are shown with a dashed border — they represent necessary waits (cure time, drying) rather than flow blockages.' },
  ]},
  { id:'kanban', icon:'', title:'Kanban Board', pro:false, steps:[
    { title:'What the Kanban board does', body:'Transforms your VSM process steps into a visual work management board. Each column represents a process step. Cards move through columns as work progresses, showing live WIP and flow status.' },
    { title:'First-time setup', body:'When you first open the Kanban tab, VeSiMy auto-creates columns from your process steps plus Backlog and Done. You can rename, recolor, or delete columns freely.' },
    { title:'Add and manage cards', body:'Click "+ Card" in any column. Set title, description, priority, assignee, due date, and optionally link to a VSM step. Drag cards between columns to update status.' },
    { title:'WIP limits', body:'Each column can have a WIP limit — the maximum cards allowed. When exceeded, the column header turns red as a visual signal to finish current work before starting more. WIP limits enforce pull flow.' },
  ]},
  { id:'branches', icon:'', title:'Branches — Parallel Flows', pro:false, steps:[
    { title:'What branches are', body:'Branches represent parallel or sub-process flows that join your main value stream — for example, a sub-assembly line feeding into main assembly. ISO 22468:2020 uses parallel swimlanes for these.' },
    { title:'Create a branch', body:'Go to the Branches tab and click "New Branch". Enter a label and color. Select the main flow step it connects to. Branches appear on the VSM Map as separate lanes with connection lines.' },
    { title:'Add steps to a branch', body:'Once a branch is created, click "Add Step" within it. Branch steps have their own cycle times, operators, wait times, VA classification, and CI tools — identical to main flow steps.' },
    { title:'Branch totals', body:'Branch step totals (CT, Wait) appear separately in the VSM Map KPI bar. The Report includes branch data in the full lead time calculation.' },
  ]},
  { id:'report', icon:'', title:'Report and Export', pro:false, steps:[
    { title:'What the Report contains', body:'The Report tab generates an ISO 22468:2020 aligned improvement report: project overview, VSM summary, key metrics (PCE, Lead Time, Takt), bottleneck analysis, waste register, RCA summary, Kaizen events, and improvement results.' },
    { title:'Download Full Report (PDF)', body:'Click "Download Full Report" to export a professionally formatted PDF with full document control block (document ID, revision, date, prepared by) — suitable for ISO audits, customer quality reviews, and management presentations.' },
    { title:'ISO compliance', body:'All exported documents reference the relevant ISO standards: ISO 9001:2015 for QMS, ISO 22468:2020 for VSM, ISO 31000:2018 for risk and root cause analysis, ILO standards for work measurement. Every report is audit-ready.' },
    { title:'PDCA multi-format export', body:'From the PDCA tab, export your improvement project as PDCA, A3, 8D, DMAIC, or OODA format. One dataset — five professional documents. Send the 8D to your automotive customer, the A3 to your plant manager, the DMAIC to your Six Sigma Black Belt.' },
  ]},
  { id:'supe', icon:'', title:'Supe AI — Process Intelligence', pro:true, steps:[
    { title:'What Supe does', body:'Supe is your AI process mentor. It analyses your entire value stream — all steps, cycle times, waste data, Kaizen events, and metrics — and provides specific, actionable lean improvement recommendations tailored to your actual process data.' },
    { title:'How to use Supe', body:'Click the Supe button in the top bar. Type your question or click "Analyse my process". Supe reads all your step data in real time and responds with lean-specific insights referencing your actual steps by name.' },
    { title:'What to ask Supe', body:'"Where is my biggest bottleneck and how do I fix it?", "What wastes should I prioritise?", "How can I improve my PCE from 45% to 80%?", "Suggest a PDCA project for my highest CT step." Supe understands lean methodology deeply.' },
    { title:'Supe is a Pro feature', body:'Supe AI is available on Pro and Enterprise plans. Go to Settings → Subscription or the Pricing page to upgrade.' },
  ]},
  { id:'simulation', icon:'', title:'Process Simulation', pro:true, steps:[
    { title:'What simulation does', body:"Models how your process performs under different conditions. Runs future-state what-if scenarios: What if I reduce this step's CT by 20%? What if I eliminate the queue between steps 3 and 4? Shows projected PCE and lead time changes before you spend a day implementing." },
    { title:'Current vs future state', body:'Shows current-state metrics on the left and lets you adjust parameters on the right to model the future state. All projections update in real time as you change values.' },
    { title:'Bottleneck simulation', body:'See exactly what happens to throughput when you improve each step. Identifies which improvements have the highest leverage — so you invest effort where it matters most.' },
    { title:'Simulation is a Pro feature', body:'Process Simulation requires a Pro or Enterprise plan. Upgrade from Settings or Pricing.' },
  ]},
  { id:'live', icon:'', title:'Live Floor Monitor', pro:true, steps:[
    { title:'What Live Floor Monitor does', body:'A real-time production monitoring view for shop floor use. Shows current cycle time vs target for each step, live WIP counts, operator status, and alerts for steps falling behind Takt Time.' },
    { title:'Shop floor tablet mode', body:'Open Live Floor on a tablet mounted near your process. The layout is optimised for touch screens. Operators can update their step status directly without going back to a desk.' },
    { title:'Live alerts', body:"When a step's cycle time exceeds Takt Time for consecutive cycles, Live Floor highlights it red and logs a production alert — giving supervisors instant visibility into emerging bottlenecks." },
    { title:'Live Floor is a Pro feature', body:'Live Floor Monitor requires a Pro or Enterprise plan. Upgrade from Settings or Pricing.' },
  ]},
]

const FAQS = [
  { q:'What is Process Cycle Efficiency (PCE) and what is a good score?', a:'PCE = Total Cycle Time (VA time) ÷ Lead Time (CT + Wait). It measures what percentage of your lead time is actually adding value. World-class lean targets 90–95%+ PCE. Most processes start at 10–30%. VeSiMy shows your PCE colour-coded in the KPI bar: green (≥90%), amber (≥60%), red (<60%).' },
  { q:'What is Takt Time and how is it calculated?', a:'Takt Time = Available Working Time ÷ Customer Demand. If you work 28,800 seconds/day (8 hours) and customers want 120 units/day, Takt = 240 seconds/unit. Enter working hours and demand in project settings and VeSiMy calculates it automatically. Steps exceeding Takt are your bottlenecks.' },
  { q:'What is the difference between PDCA and DMAIC?', a:'PDCA (Plan-Do-Check-Act) is a fast, iterative improvement cycle suitable for most shop floor problems — changeovers, defects, imbalance. DMAIC (Define-Measure-Analyse-Improve-Control) is a Six Sigma project methodology for complex, statistically-driven problems requiring months of data analysis. VeSiMy uses PDCA as the workflow but can export the same data in DMAIC format for Six Sigma audiences.' },
  { q:'What is an A3 report?', a:'An A3 report (named after A3 paper size) is Toyota\'s one-page problem-solving format. It captures background, current condition, goal, root cause, countermeasures, implementation, results, and follow-up actions on a single page. VeSiMy generates an A3-formatted PDF from your PDCA project data automatically.' },
  { q:'What is an 8D report?', a:'8D (Eight Disciplines) is a problem-solving methodology developed at Ford Motor Company, required by many automotive customers when a quality escape occurs. D1 is team formation, D2 problem description, D3 interim containment, D4 root cause, D5-D6 corrective actions, D7 prevent recurrence, D8 close and congratulate. VeSiMy exports your PDCA data in 8D format — essential for Tier 1/Tier 2 automotive suppliers.' },
  { q:'What is a Yamazumi Chart?', a:'A Yamazumi chart (Japanese for "stacking") is an operator balance chart showing work content per operator broken into VA (value add), NNVA (necessary non-value add), and NVA (waste) time. Bars are compared to a Takt Time line. The goal is all operators at takt with maximum VA content. It is the primary tool for line balancing and operator waste elimination.' },
  { q:'What is Standard Work?', a:'Standard Work is the documented current best method for a process task — the safest, highest quality, lowest waste method that any trained operator can reliably replicate. It is not the fastest possible method. Standard Work is updated every time the process improves through a PDCA cycle. Without it, gains revert.' },
  { q:'What is VA / NNVA / NVA?', a:'Value Add (VA): activities that transform the product in a way the customer pays for — machining, welding, assembly. Necessary Non-Value Add (NNVA): required but not value-adding — inspection, setup, transport. Non-Value Add (NVA): pure waste — waiting, searching, correction, unnecessary motion. Target: eliminate NVA first, reduce NNVA, maximise VA proportion.' },
  { q:'What does DOWNTIME stand for?', a:'The 8 wastes of lean: Defects, Overproduction, Waiting, Non-utilised talent, Transport, Inventory, Motion, Extra-processing. TIMWOODS is an alternative acronym (Transport, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects, Skills). VeSiMy uses DOWNTIME to align with the most current lean literature.' },
  { q:'What is the difference between Cycle Time and Lead Time?', a:'Cycle Time is how long it takes to complete one unit at a single process step. Lead Time is the total time from raw material to customer delivery — all cycle times plus all wait/queue times combined. PCE = CT / Lead Time. Reducing wait time between steps reduces Lead Time without changing CT.' },
  { q:'What is one-piece flow and why does VeSiMy push it?', a:'One-piece flow means completing one unit fully through a sequence of steps before starting the next. It eliminates WIP build-up between steps, exposes quality problems immediately (you find defects after 1 unit, not after a batch of 500), and minimises lead time. VeSiMy\'s Gap Analysis flags batch/push flow where one-piece flow is achievable.' },
  { q:'How many time study observations should I record?', a:'Minimum 10 observations for stable processes, 20–30 for variable ones. Remove outliers from interruptions or abnormal events. The ILO recommends observations until the coefficient of variation (CV%) stabilises below 10% for manual operations.' },
  { q:'Can I use VeSiMy for non-manufacturing processes?', a:'Yes. VeSiMy works for any process that can be mapped as a sequence of steps with times — healthcare patient flow, office processes, software development, logistics. The lean principles (eliminate waste, reduce lead time, achieve flow) apply universally. Select your industry in project settings.' },
  { q:'What is in the ISO-compliant export?', a:'All VeSiMy exports include: document title, document ID, revision number, date, prepared by, project name, and relevant ISO standard references in a document control block. Standards referenced include ISO 9001:2015, ISO 22468:2020 (VSM), ISO 31000:2018 (RCA), and ILO work measurement standards.' },
  { q:'Can multiple people collaborate on the same project?', a:'Real-time multi-user collaboration is in development. Currently each user manages their own projects. Enterprise plans include team workspace features. Contact founder@vesimy.com to discuss your team setup.' },
  { q:'How do I upgrade from Free to Pro?', a:'Go to Settings → Subscription and click "Upgrade to Pro", or visit the Pricing page. Payment is processed securely through Stripe. Pro features activate immediately after payment.' },
]

export function LearningCenter({ userId }: Props) {
  const [activeTab,      setActiveTab]      = useState<'manual'|'glossary'|'faqs'>('manual')
  const [activeSection,  setActiveSection]  = useState('getting-started')
  const [expandedStep,   setExpandedStep]   = useState<string|null>(null)
  const [expandedFAQ,    setExpandedFAQ]    = useState<number|null>(null)
  const [glossarySearch, setGlossarySearch] = useState('')
  const [showMobilePicker, setShowMobilePicker] = useState(false)

  const section = MANUAL.find(s => s.id === activeSection) || MANUAL[0]

  function pickSection(id: string) {
    setActiveSection(id)
    setExpandedStep(null)
    setShowMobilePicker(false)
  }

  const GLOSSARY = [
    { term:'5S', def:'Workplace organisation methodology: Sort (remove unneeded items), Set in Order (arrange needed items), Shine (clean), Standardise (document the standard), Sustain (maintain). Foundation for any visual management or lean implementation.', std:'ISO 9001:2015 §6.4 (Work Environment)' },
    { term:'5 Why', def:'Root cause analysis technique: ask "Why?" iteratively (typically 5 times) to get from symptom to root cause. Developed by Sakichi Toyoda. Always ends at a systemic failure — never at an individual person.', std:'ISO 9001:2015 §10.2.1' },
    { term:'8D (Eight Disciplines)', def:'Ford Motor Company problem-solving methodology. Eight structured steps from team formation through root cause, corrective action, verification, and prevention of recurrence. Required by many automotive customers for quality escapes.', std:'IATF 16949 §10.2' },
    { term:'A3 Report', def:"Toyota's one-page problem-solving format (named for A3 paper). Contains background, current condition, goal, root cause, countermeasures, implementation plan, results, and follow-up — all on one sheet. Forces concise thinking.", std:'ISO 22468:2020' },
    { term:'Bottleneck', def:"The process step with cycle time greater than takt time. It constrains throughput for the entire value stream — all other steps can only produce as fast as the bottleneck. Goldratt's Theory of Constraints focuses entirely on identifying and elevating bottlenecks.", std:'ISO 22468:2020 §5.2.4' },
    { term:'Changeover Time (C/O)', def:'Time to switch a machine or workstation from producing one product to another. SMED (Single-Minute Exchange of Die) methodology targets <10 minutes. Key VSM data point — long C/O forces large batches which create WIP and inventory waste.', std:'ISO 9001:2015 §8.5.1' },
    { term:'Cycle Time (CT)', def:'The actual elapsed time to complete one unit at a single process step, measured by direct observation (stopwatch). The average of multiple observations after outlier removal. Compare to Takt Time: if CT > Takt, the step is a bottleneck.', std:'ISO 22468:2020 §5.2.3, ILO §3' },
    { term:'DMAIC', def:'Six Sigma improvement framework: Define (problem), Measure (current performance), Analyse (root cause), Improve (implement solution), Control (sustain). Used for statistically complex problems requiring months of data. Compare to PDCA which is faster and simpler.', std:'ISO 13053:2011' },
    { term:'DOWNTIME', def:'Acronym for the 8 wastes: Defects, Overproduction, Waiting, Non-utilised talent, Transport, Inventory, Motion, Extra-processing. Every waste makes a process slower, more expensive, or less reliable. Lean aims to eliminate all 8.', std:'ISO 22468:2020 §5.4' },
    { term:'FIFO Lane', def:'First-In-First-Out queue between two process steps. Limits WIP to a controlled maximum, maintains sequence, and makes flow interruptions visible immediately. Preferred over push scheduling when pure one-piece flow is not yet achievable.', std:'ISO 22468:2020 §5.3' },
    { term:'Future State Map', def:'The target VSM showing what the process will look like after improvements are implemented. Drawn after the current state map. The gap between current and future state is the kaizen roadmap.', std:'ISO 22468:2020 §6' },
    { term:'Gemba Walk', def:"Going to the actual workplace (gemba = 'real place' in Japanese) to observe the process directly. The cornerstone of Toyota management — go see, don't assume. Data gathered on a gemba walk is more accurate than any report.", std:'ISO 9001:2015 §9.1' },
    { term:'Kaizen', def:'Japanese: "change for better." Continuous improvement through small, incremental changes made by the people doing the work. In lean practice, kaizen events are focused 3–5 day improvement sprints delivering measurable results before the week ends.', std:'ISO 9001:2015 §10.3' },
    { term:'Lead Time', def:'Total elapsed time from raw material (or customer order) to delivery. = Sum of all cycle times + all wait/queue times. Reducing lead time is the primary VSM goal. Shorter lead time = more responsive to customers = less working capital tied up in WIP.', std:'ISO 22468:2020 §4.2' },
    { term:'NNVA (Necessary Non-Value Add)', def:"Activities required by the current process but that add no value from the customer's perspective — setup, inspection, transport between steps. Cannot be eliminated immediately (unlike NVA) but should be minimised.", std:'ISO 22468:2020 §5.4' },
    { term:'NVA (Non-Value Add)', def:'Pure waste — activities that consume time, space, or resources but add no value and are not required by the current process. Motion waste (searching for tools), waiting, rework, unnecessary processing. Target for immediate elimination.', std:'ISO 22468:2020 §5.4' },
    { term:'One-Piece Flow', def:'Ideal lean flow state: one unit moves through each process step without batching or waiting. Exposes quality defects immediately (after 1 unit, not 500), minimises lead time, eliminates most WIP waste. The goal of every VSM future state.', std:'ISO 22468:2020 §5.3' },
    { term:'OODA Loop', def:'Observe-Orient-Decide-Act. Rapid decision cycle developed by military strategist John Boyd. In manufacturing: observe the current situation with data, orient understanding of the cause, decide on a response, act and observe again.', std:'Operational strategy' },
    { term:'PCE (Process Cycle Efficiency)', def:'= Total VA Time ÷ Lead Time × 100%. Measures what percentage of lead time is genuinely value-adding. World class: >90%. Most processes start at 10–30%. VeSiMy colour-codes: green (≥90%), amber (≥60%), red (<60%).', std:'ISO 22468:2020 §5.2.2' },
    { term:'PDCA', def:'Plan-Do-Check-Act. The fundamental improvement cycle. Plan: define problem, identify root cause, set target. Do: implement countermeasure (small scale). Check: measure result against target. Act: standardise if successful, adjust if not. Repeat.', std:'ISO 9001:2015 §10, ISO 9000:2015 §3.3.5' },
    { term:'Poka-Yoke', def:'Error-proofing: designing the process so a mistake cannot be made, or is detected immediately if made. A jig that only accepts a part in the correct orientation is a poka-yoke. The goal is making quality automatic rather than inspected.', std:'ISO 9001:2015 §8.3.3' },
    { term:'Pull System', def:'Production triggered by downstream demand — a step only produces when the next step signals it needs more. Eliminates overproduction (the worst of the 8 wastes). Kanban cards are the classic pull signal mechanism.', std:'ISO 22468:2020 §5.3.1' },
    { term:'Push System', def:'Production driven by schedule or forecast regardless of downstream demand. Creates inventory and WIP accumulation between steps. Most traditional manufacturing operates in push mode. VSM shows push arrows between steps that should be converted to pull or FIFO.', std:'ISO 22468:2020 §5.3' },
    { term:'Standard Work', def:"The documented current best method for performing a process task — the safest, highest quality, lowest waste repeatable method. Updated every time the process improves. Standard Work is the baseline that makes continuous improvement possible.", std:'ISO 22468:2020 §5.2.3, ISO 9001:2015 §8.5.1' },
    { term:'Supermarket', def:'A controlled inventory buffer between two process steps with defined min/max quantities. Used where one-piece flow is not yet achievable — particularly before bottleneck steps. The supermarket prevents the bottleneck from ever starving while controlling total WIP.', std:'ISO 22468:2020 §5.3.2' },
    { term:'Takt Time', def:'= Available Production Time ÷ Customer Demand. The rate at which you must complete products to satisfy customer demand. Not a target for speed — a pace setter. If Takt = 120s, one unit must leave every 2 minutes. Steps above Takt are bottlenecks.', std:'ISO 22468:2020 §5.2.1' },
    { term:'TPS (Toyota Production System)', def:'The operating system developed at Toyota over decades, combining just-in-time production, jidoka (quality at source), standard work, kaizen, and respect for people. The foundation from which Lean Manufacturing, Six Sigma, and all modern CI methodologies derive.', std:'ISO 22468:2020' },
    { term:'VA (Value Add)', def:"Activities that physically transform the product or service in a way the customer recognises as valuable and would pay for. Machining, welding, assembly, painting. VA activities are what the customer is buying — everything else is a cost to be minimised.", std:'ISO 22468:2020 §5.4' },
    { term:'VSM (Value Stream Mapping)', def:'A lean tool for visualising every step, delay, and information flow in a process from raw material to customer. Shows VA time, NVA time, WIP, cycle times, and operator counts. The VSM is the most important lean planning tool.', std:'ISO 22468:2020' },
    { term:'WIP (Work In Progress)', def:"Units that have been started but not yet completed — sitting between process steps. WIP = Lead Time × Throughput Rate (Little's Law). High WIP means long lead time. The WIP triangles on a VSM show exactly where inventory is accumulating and how much.", std:'ISO 22468:2020 §5.2.5' },
    { term:'Yamazumi Chart', def:'Operator balance chart (Japanese: "stacking"). Stacked bars showing each operator\'s work content broken into VA, NNVA, and NVA time, compared to a Takt Time line. The primary tool for line balancing and operator-level waste elimination.', std:'ISO 22468:2020 §5.2.4' },
  ].filter(g => !glossarySearch || g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || g.def.toLowerCase().includes(glossarySearch.toLowerCase()))

  // ── Shared: step accordion (used in manual tab) ───────────────────────────
  function StepAccordion({ sec }: { sec: typeof section }) {
    return (
      <>
        {sec.pro && (
          <div style={{ background:'rgba(100,38,160,0.06)', border:'1px solid rgba(100,38,160,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
            <p style={{ fontSize:13, color:'#8C44CC', margin:0 }}>
              This feature requires a <strong>Pro or Enterprise plan</strong>.{' '}
              <a href="/pricing" style={{ color:'var(--brand)', textDecoration:'none' }}>View Pricing →</a>
            </p>
          </div>
        )}
        <p style={{ fontSize:12, color:'var(--text3)', marginBottom:14, lineHeight:1.7 }}>
          {sec.steps.length} topic{sec.steps.length!==1?'s':''} — tap any to expand.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {sec.steps.map((step: any, i: number) => {
            const key=`${sec.id}-${i}`; const open=expandedStep===key
            return (
              <div key={key} style={{ background:'#FFFFFF', border:`1px solid ${open?'var(--brand)':'var(--border)'}`, borderRadius:10, overflow:'hidden' }}>
                <button onClick={() => setExpandedStep(open?null:key)}
                  style={{ width:'100%', textAlign:'left', padding:'13px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ width:22, height:22, borderRadius:6, flexShrink:0,
                    background:open?'rgba(1,118,211,0.12)':'var(--sl-100)',
                    border:`1px solid ${open?'var(--brand)':'var(--border)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, fontWeight:700, color:open?'var(--brand)':'var(--text3)' }}>{i+1}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight:600, color:open?'var(--brand)':'var(--text)', lineHeight:1.4 }}>{step.title}</span>
                  <span style={{ color:'var(--text3)', fontSize:16, transition:'transform 0.2s', transform:open?'rotate(90deg)':'none', flexShrink:0 }}>›</span>
                </button>
                {open && (
                  <div style={{ padding:'0 16px 14px 48px', borderTop:'1px solid var(--border)' }}>
                    <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.85, margin:'10px 0 0' }}>{step.body}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {(() => {
          const idx=MANUAL.findIndex(s=>s.id===sec.id); const next=MANUAL[idx+1]
          return next ? (
            <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
              <button onClick={() => pickSection(next.id)} style={{
                display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:8,
                background:'rgba(1,118,211,0.06)', border:'1px solid rgba(1,118,211,0.2)',
                color:'var(--brand)', cursor:'pointer', fontSize:13, fontWeight:600,
              }}>Next: {next.icon} {next.title} →</button>
            </div>
          ) : null
        })()}
      </>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid var(--border)', background:'#FFFFFF', flexShrink:0 }}>
        <h1 style={{ fontFamily:'Palatino Linotype,serif', fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:3 }}>Learning Center</h1>
        <p style={{ fontSize:12, color:'var(--text3)', margin:'0 0 12px' }}>Master lean CI — PDCA, VSM, Yamazumi, 8D and more.</p>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {([['manual','Manual'],['glossary','Glossary'],['faqs','FAQs']] as const).map(([t,label]) => (
            <button key={t} onClick={() => { setActiveTab(t); setShowMobilePicker(false) }} style={{
              padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:activeTab===t?700:400,
              background:activeTab===t?'rgba(1,118,211,0.10)':'transparent',
              border:`1px solid ${activeTab===t?'rgba(1,118,211,0.4)':'var(--border)'}`,
              color:activeTab===t?'var(--brand)':'var(--text3)', cursor:'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── MANUAL TAB ─────────────────────────────────────────────────────── */}
      {activeTab==='manual' && (
        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

          {/* Desktop sidebar — hidden on mobile via CSS */}
          <div className="learn-sidebar">
            {MANUAL.map(s => (
              <button key={s.id} onClick={() => pickSection(s.id)} style={{
                width:'100%', textAlign:'left', padding:'9px 14px',
                background:activeSection===s.id?'rgba(1,118,211,0.08)':'transparent',
                border:'none', borderLeft:`3px solid ${activeSection===s.id?'var(--brand)':'transparent'}`,
                cursor:'pointer', display:'flex', alignItems:'center', gap:8,
              }}>
                <span style={{ fontSize:14, flexShrink:0 }}>{s.icon}</span>
                <span style={{ fontSize:12, fontWeight:activeSection===s.id?700:400,
                  color:activeSection===s.id?'var(--brand)':'var(--sl-600)', lineHeight:1.3, flex:1 }}>{s.title}</span>
                {s.pro && <span style={{ fontSize:8, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1,
                  background:'rgba(100,38,160,0.10)', border:'1px solid rgba(100,38,160,0.22)',
                  borderRadius:4, padding:'1px 4px', flexShrink:0 }}>PRO</span>}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div style={{ flex:1, overflowY:'auto', minWidth:0, paddingBottom:80 }}>

            {/* Mobile section picker — shown only on mobile via CSS */}
            <div className="learn-mobile-picker">
              <button
                onClick={() => setShowMobilePicker(v => !v)}
                style={{
                  width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'12px 16px', background:'#FFFFFF', border:'none',
                  borderBottom:'1px solid var(--border)', cursor:'pointer', gap:10,
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:18 }}>{section.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', textAlign:'left' }}>{section.title}</div>
                    <div style={{ fontSize:10, color:'var(--text3)', textAlign:'left' }}>{section.steps.length} topics</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <span style={{ fontSize:10, color:'var(--text3)' }}>Change section</span>
                  <span style={{ color:'var(--brand)', fontSize:16, transform: showMobilePicker ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', display:'inline-block' }}>⌄</span>
                </div>
              </button>

              {/* Dropdown */}
              {showMobilePicker && (
                <div style={{
                  position:'absolute', left:0, right:0, zIndex:50,
                  background:'#FFFFFF', border:'1px solid var(--border)',
                  borderTop:'none', boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
                  maxHeight:'60vh', overflowY:'auto',
                }}>
                  {MANUAL.map(s => (
                    <button key={s.id} onClick={() => pickSection(s.id)} style={{
                      width:'100%', textAlign:'left', padding:'11px 16px',
                      background:activeSection===s.id?'rgba(1,118,211,0.08)':'transparent',
                      border:'none', borderBottom:'1px solid var(--border)',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:10,
                    }}>
                      <span style={{ fontSize:16 }}>{s.icon}</span>
                      <span style={{ flex:1, fontSize:13, fontWeight:activeSection===s.id?700:400,
                        color:activeSection===s.id?'var(--brand)':'var(--text)' }}>{s.title}</span>
                      {s.pro && <span style={{ fontSize:9, color:'#8C44CC', background:'rgba(100,38,160,0.10)', border:'1px solid rgba(100,38,160,0.2)', borderRadius:4, padding:'2px 5px' }}>PRO</span>}
                      {activeSection===s.id && <span style={{ color:'var(--brand)' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section content */}
            <div style={{ padding:'20px 18px' }}>
              {/* Desktop header — hidden on mobile */}
              <div className="learn-section-header" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <span style={{ fontSize:24 }}>{section.icon}</span>
                <h2 style={{ fontFamily:'Palatino Linotype,serif', fontSize:19, fontWeight:700, color:'var(--text)', margin:0 }}>{section.title}</h2>
                {section.pro && <span style={{ fontSize:10, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1.5,
                  background:'rgba(100,38,160,0.10)', border:'1px solid rgba(100,38,160,0.22)', borderRadius:6, padding:'3px 8px' }}>PRO</span>}
              </div>
              <StepAccordion sec={section} />
            </div>
          </div>
        </div>
      )}

      {/* ── GLOSSARY TAB ──────────────────────────────────────────────────── */}
      {activeTab==='glossary' && (
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', paddingBottom:80 }}>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:10, lineHeight:1.7 }}>
            {GLOSSARY.length} lean CI terms with ISO references. Tap to expand.
          </p>
          <input
            className="input"
            placeholder="Search terms…"
            value={glossarySearch}
            onChange={e => setGlossarySearch(e.target.value)}
            style={{ marginBottom:12, fontSize:13 }}
          />
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {GLOSSARY.map((g, i) => (
              <div key={i} style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                <button onClick={() => setExpandedFAQ(expandedFAQ===i?null:i)}
                  style={{ width:'100%', textAlign:'left', padding:'11px 14px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                  <div style={{ minWidth:0 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--brand)', display:'block' }}>{g.term}</span>
                    <span style={{ fontSize:9, fontFamily:'monospace', color:'var(--text3)' }}>{g.std}</span>
                  </div>
                  <span style={{ color:'var(--text3)', fontSize:16, flexShrink:0, transition:'transform 0.2s', transform:expandedFAQ===i?'rotate(90deg)':'none' }}>›</span>
                </button>
                {expandedFAQ===i && (
                  <div style={{ padding:'0 14px 12px', borderTop:'1px solid var(--border)' }}>
                    <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.85, margin:'10px 0 0' }}>{g.def}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQS TAB ──────────────────────────────────────────────────────── */}
      {activeTab==='faqs' && (
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', paddingBottom:80 }}>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:14, lineHeight:1.7 }}>{FAQS.length} frequently asked questions — tap to expand.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map((faq,i) => (
              <div key={i} style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
                <button onClick={() => setExpandedFAQ(expandedFAQ===i?null:i)}
                  style={{ width:'100%', textAlign:'left', padding:'13px 14px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text)', lineHeight:1.5, flex:1 }}>{faq.q}</span>
                  <span style={{ color:'var(--text3)', fontSize:16, flexShrink:0, transition:'transform 0.2s', transform:expandedFAQ===i?'rotate(90deg)':'none' }}>›</span>
                </button>
                {expandedFAQ===i && (
                  <div style={{ padding:'0 14px 14px', borderTop:'1px solid var(--border)' }}>
                    <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.85, margin:'10px 0 0' }}>{faq.a}</p>
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
