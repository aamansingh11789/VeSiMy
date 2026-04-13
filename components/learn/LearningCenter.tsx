// @ts-nocheck
'use client'
import { CheckIcon } from '@/components/ui/Icons'
// ── components/learn/LearningCenter.tsx ──────────────────────────────────────
// Industry-aware learning center.
// All content adapts to the user's industry terminology from useIndustryLanguage.
// No cross-industry language is used unless it is universally understood.

import { useState, useMemo } from 'react'
import { useIndustryLanguage } from '@/hooks/useIndustryLanguage'

interface Props { userId: string }

// ── Industry-aware content builder ───────────────────────────────────────────
// Returns the full manual, glossary, and FAQs with terminology replaced.
function buildContent(t: any, industry: string) {
  const p  = t.process       || 'process'
  const ps = t.processStep   || 'step'
  const ct = t.cycleTime     || 'Cycle Time'
  const wip = t.wip          || 'WIP'
  const vstream = t.valueStream || 'value stream'
  const prod = t.product     || 'product'
  const defect = t.defect    || 'defect'
  const kz = t.kaizen        || 'improvement event'
  const gemba = t.gemba      || 'shop floor'
  const cust = t.customer    || 'customer'
  const takt = t.taktTime    || 'Takt Time'
  const waste = t.waste      || 'waste'
  const sector = t.sectorLabel || 'your industry'

  const MANUAL = [
    {
      id: 'getting-started', icon: '', title: 'Getting Started', pro: false, steps: [
        {
          title: `Create your first ${p}`,
          body: `Click "New Project" on the Dashboard. Enter a name, select your industry, add the ${prod} or service name, and set ${cust} demand and working hours. These values drive your ${takt} calculation automatically.`,
        },
        {
          title: `Set ${takt}`,
          body: `${takt} = Available Time ÷ ${cust} Demand. VeSiMy calculates this automatically when you enter working hours and demand in project settings. Every ${ps} is benchmarked against it — ${ps}s over ${takt} are flagged red as bottlenecks.`,
        },
        {
          title: 'Navigate your workspace',
          body: `Your workspace uses the language of ${sector}. ${ct}, ${defect}, ${gemba}, and ${kz} are all expressed in terms your team already uses. Your project has tabs: Builder (add ${ps}s), VSM Map (visual ${vstream}), Roadmap (${kz} mission control), PDCA (improvement projects), Kaizen (events board), Kanban (task tracking), Simulation Pro, Live Floor Pro, Report, and Branches. Premium tabs require a Pro plan.`,
        },
        {
          title: 'Project settings',
          body: `Click the gear icon in the top bar to edit project details: name, industry, ${prod}, ${cust}, supplier, demand, working hours, and shift count. Changes reflect instantly in all ${vstream} calculations.`,
        },
      ]
    },
    {
      id: 'va-classification', icon: '', title: 'VA / NNVA / NVA Classification', pro: false, steps: [
        {
          title: 'What is VA classification?',
          body: `Every ${ps} is classified as Value Add (VA) — transforms the ${prod} in a way the ${cust} pays for; Necessary Non-Value Add (NNVA) — required but adds no ${cust} value; or Non-Value Add (NVA) — pure ${waste} to be eliminated. In ${sector}, VA examples include the core service delivery ${ps}s. NNVA includes necessary checks and handoffs. NVA includes waiting, rework, and unnecessary movement.`,
        },
        {
          title: 'Why it matters',
          body: `VA classification makes ${waste} visible and quantifiable. A ${p} where 90% of time is NVA looks busy but produces almost no value. Classification is the foundation of every improvement decision.`,
        },
        {
          title: `How to classify ${ps}s`,
          body: `When adding or editing a ${ps}, select VA, NNVA, or NVA using the three buttons at the top of the form. The VSM Map colour-codes ${p} boxes accordingly — green adds value, red is a ${waste} target.`,
        },
        {
          title: 'PCE and VA time',
          body: `Process Cycle Efficiency (PCE) = VA Time ÷ Lead Time. World-class targets 95%+ PCE. Most ${p}s start at 10–30%. VeSiMy calculates PCE automatically and colour-codes it green (≥90%), amber (≥60%), or red (<60%) in the KPI bar.`,
        },
      ]
    },
    {
      id: 'builder', icon: '', title: `Builder — ${ps.charAt(0).toUpperCase() + ps.slice(1)}s`, pro: false, steps: [
        {
          title: `Add a ${ps}`,
          body: `Click "Add ${ps.charAt(0).toUpperCase() + ps.slice(1)}" in the top bar. Enter the ${ps} name, department, VA classification, operators, ${ct}, wait time, ${wip}, and flow type. ${ps.charAt(0).toUpperCase() + ps.slice(1)}s appear in sequence representing your ${p} flow.`,
        },
        {
          title: 'Flow type options',
          body: `Push: upstream produces regardless of downstream demand. Pull: downstream signals when it needs more. FIFO Lane: first-in-first-out queue with controlled ${wip}. Supermarket: controlled inventory buffer. One-piece flow is the ideal state for any ${p}.`,
        },
        {
          title: `Operator tasks — Standard Work`,
          body: `Expand the Operator Steps section to break a ${ps} into individual tasks. Each task has a name, time in seconds, and VA classification. This feeds the Yamazumi Chart and Standard Work Sheet.`,
        },
        {
          title: 'CI Tools on each step',
          body: `Every ${ps} has 6 CI tool buttons: Time Study, Fishbone, 5 Why, ${waste.charAt(0).toUpperCase() + waste.slice(1)} ID, Kaizen, and Improvement tracking. Click any icon to open that tool for that specific ${ps}. All data is saved per ${ps}.`,
        },
      ]
    },
    {
      id: 'tool-stopwatch', icon: '', title: `Tool 1 — ${ct} Study`, pro: false, steps: [
        {
          title: 'What it does',
          body: `Measures actual ${ct} for a ${ps} using direct observation. Records multiple observations, calculates the mean, standard deviation, and CV%, identifies outliers, and sets the official ${ct} used in all ${vstream} calculations.`,
        },
        {
          title: 'How to use it',
          body: `Open Time Study on any ${ps} card. Press Start to begin timing, Lap to record each observation. After 10+ observations, click Save. The mean of valid observations becomes the official ${ct}.`,
        },
        {
          title: 'Baseline and target',
          body: `Enter a baseline ${ct} from current-state data and a target ${ct} for your future state. The improvement gap calculates automatically. Use the Gap Analysis tool to get AI recommendations on closing the gap.`,
        },
        {
          title: 'Reading the output',
          body: `Mean ${ct} shows on ${ps} cards. ${ps.charAt(0).toUpperCase() + ps.slice(1)}s exceeding ${takt} are flagged red — your bottlenecks. This data flows into the VSM map, PCE calculation, Yamazumi Chart, and AI Coaching.`,
        },
      ]
    },
    {
      id: 'tool-fishbone', icon: '', title: 'Tool 2 — Fishbone (Ishikawa)', pro: false, steps: [
        {
          title: 'What it does',
          body: `Structured cause-and-effect analysis for quality or ${p} problems. Maps all potential root causes across categories so you can see every contributing factor before jumping to solutions. Developed by Kaoru Ishikawa as part of the Toyota Production System quality toolkit.`,
        },
        {
          title: 'Choose a framework',
          body: `Select 6M (Machine, Method, Material, Manpower, Measurement, Mother Nature) for ${p} ${defect}s, or 8P (People, Process, Policy, Place, Products, Price, Promotion, Physical evidence) for service failures. Choose the framework that best matches how ${defect}s occur in ${sector}.`,
        },
        {
          title: 'Add causes',
          body: `Enter the problem statement at the top. Click each category and add cause statements — aim for 2–3 per category that reflect the real causes in your ${p}. Press Enter or click + to add each cause.`,
        },
        {
          title: 'Connect to 5 Why and PDCA',
          body: `After completing the fishbone, pick the most likely root cause and drill into it with the 5 Why tool. Then link to a PDCA project to track the corrective action. Fishbone → 5 Why → PDCA is the complete root cause analysis chain.`,
        },
      ]
    },
    {
      id: 'tool-fivewhy', icon: '', title: 'Tool 3 — 5 Why Analysis', pro: false, steps: [
        {
          title: 'What it does',
          body: `Iterative root cause analysis developed by Sakichi Toyoda and systematised at Toyota. Ask "Why?" five times to get past symptoms and surface the true systemic root cause. Most ${p} problems trace to a missing standard, a standard not followed, or a standard not visible.`,
        },
        {
          title: 'How to use it',
          body: `Enter the problem statement — a ${defect}, a delay, a ${cust} complaint. Answer Why 1, Why 2, through Why 5. Each answer becomes the next question. Stop when you reach a root cause you can act on — something systemic, not a person.`,
        },
        {
          title: 'Set a countermeasure',
          body: `Enter a countermeasure tied to the root cause, not a symptom fix. Assign an owner and due date. This populates your PDCA project's Do phase and generates an ISO 9001:2015 §10.2 compliant report.`,
        },
        {
          title: 'How deep to go?',
          body: `Five is a guideline, not a rule. Stop at 3 if you reach root cause early. If your 5 Why ends with "operator error" or "staff failure" you have not gone deep enough — those are always symptoms of a system failure, never root causes in themselves.`,
        },
      ]
    },
    {
      id: 'tool-waste', icon: '', title: `Tool 4 — ${waste.charAt(0).toUpperCase() + waste.slice(1)} Identification`, pro: false, steps: [
        {
          title: `The 8 ${waste}s`,
          body: `Defects (errors/rework), Overproduction (making too much), Waiting (idle time), Non-utilised talent (skills unused), Transport (moving materials or people), Inventory (excess stock or queue), Motion (unnecessary movement), Extra-processing (more work than the ${cust} requires). DOWNTIME is the lean acronym for all 8.`,
        },
        {
          title: `How to identify ${waste} in ${sector}`,
          body: `Walk the ${p} (${gemba}) or review data. Ask: is this ${ps} adding value the ${cust} would pay for? Is there unnecessary waiting, rework, or movement? Mark every ${waste} type you observe. Non-utilised talent is the most commonly overlooked ${waste} in ${sector}.`,
        },
        {
          title: `Add notes per ${waste}`,
          body: `After selecting a ${waste} type, a text field appears for a specific note. Example — Waiting: "${p} waits 35 minutes in queue before the next ${ps} begins." These specifics focus ${kz} events and PDCA corrective actions on real problems.`,
        },
      ]
    },
    {
      id: 'tool-kaizen', icon: '', title: `Tool 5 — ${kz.charAt(0).toUpperCase() + kz.slice(1)} Events`, pro: false, steps: [
        {
          title: `What is a ${kz}?`,
          body: `A structured, time-boxed improvement activity focused on a specific ${p} area. Typically 3–5 days with a dedicated cross-functional team. Kaizen = "change for better" in Japanese. The goal is measurable improvement in days, not months. In ${sector}, ${kz}s deliver results the team can see before the week ends.`,
        },
        {
          title: `Create a ${kz} item`,
          body: `Open Kaizen on a ${ps}. Enter a title, select a category (Safety, Quality, Delivery, Cost, Morale, 5S, Productivity), set priority, assign an owner, and add a due date.`,
        },
        {
          title: 'Track progress',
          body: `Update status from Open → In Progress → Complete → Verified as work advances. Open event count shows on ${ps} cards. The Kaizen tab shows all events across the entire project sorted by priority.`,
        },
        {
          title: `${kz.charAt(0).toUpperCase() + kz.slice(1)} burst on VSM`,
          body: `Open ${kz} events appear as burst (starburst) markers on your VSM Map — the internationally recognised ISO 22468:2020 symbol for improvement opportunities. Closed events remove the burst automatically.`,
        },
      ]
    },
    {
      id: 'tool-improvement', icon: '', title: 'Tool 6 — Improvement Tracking', pro: false, steps: [
        {
          title: 'What it does',
          body: `Tracks specific, measurable improvement goals per ${ps}. Captures baseline (current state), target (future state), and actual result — giving you before/after proof of improvement for management reporting and ISO audits.`,
        },
        {
          title: 'Add improvement goals',
          body: `Open Improvement Tracking on a ${ps}. Select a metric (${ct}, ${defect} Rate, OEE, Uptime, or custom), enter your baseline, set a target, and assign an owner with a due date.`,
        },
        {
          title: 'Record actual results',
          body: `After implementing the improvement, fill in the Actual Result field. Set status to Achieved or Not Achieved. The improvement delta calculates automatically. This is your evidence of continuous improvement.`,
        },
        {
          title: 'Feeds the PDCA Check phase',
          body: `Improvement goal results flow directly into the Check phase of your PDCA project — giving you structured before/after data for the ISO-compliant report. This closes the measurement loop of the PDCA cycle.`,
        },
      ]
    },
    {
      id: 'pdca', icon: '', title: 'PDCA — Improvement Projects', pro: false, steps: [
        {
          title: 'What is PDCA?',
          body: `PDCA (Plan-Do-Check-Act) is the fundamental improvement cycle used in ISO 9001, Lean, Six Sigma, and all quality management systems. Developed by Walter Shewhart and popularised by W. Edwards Deming, it provides a structured path from ${defect} identification to permanent solution.`,
        },
        {
          title: 'Plan phase',
          body: `Define the problem clearly with data from your ${p}. Describe the current condition. Analyse root cause using your Fishbone and 5 Why tools. Set a specific, measurable target condition. Hypothesis: "If we do X to the ${ps}, we expect Y result because of Z root cause."`,
        },
        {
          title: 'Do phase',
          body: `Add countermeasures (actions to test your hypothesis). Assign each action an owner and due date. Check off actions as they are completed. Add implementation notes about what changed in the ${p}.`,
        },
        {
          title: 'Check phase',
          body: `Record before/after metrics — ${ct}, ${defect} rate, ${wip}, PCE, or any custom metric. Document the results. Mark whether the target was achieved: Yes (standardise), Partial (adjust and continue), or No (return to Plan with new understanding).`,
        },
        {
          title: 'Act phase',
          body: `If target met: document standardisation actions, update the Standard Work Sheet, train all team members on the new method. If not met: capture lessons learned and write a sharper problem statement for the next PDCA cycle.`,
        },
        {
          title: 'Export in 5 formats',
          body: `Click "Export Report" to choose your format: PDCA (standard cycle), A3 (Toyota one-page), 8D (Ford customer report), DMAIC (Six Sigma), OODA (rapid decision cycle). All ISO-compliant. One ${p} dataset — five professional documents.`,
        },
      ]
    },
    {
      id: 'yamazumi', icon: '', title: 'Yamazumi Chart', pro: false, steps: [
        {
          title: 'What is a Yamazumi Chart?',
          body: `A Yamazumi chart (Japanese: "stacking") shows the work content of each ${ps}, broken down by VA, NNVA, and NVA time. It is the primary tool for visualising workload imbalance and operator-level ${waste} in any ${p}.`,
        },
        {
          title: 'How to read it',
          body: `Each bar represents one ${ps}. Bar height is total ${ct}. Green (VA) should be as tall as possible. Amber (NNVA) should be minimised. Red (NVA) should be eliminated. The dashed red horizontal line is ${takt} — bars above it are bottlenecks requiring immediate action.`,
        },
        {
          title: `How to use it for ${p} balancing`,
          body: `The goal is to balance all ${ps} bars to just below ${takt} with maximum VA content. If one ${ps} is at 180s and another is at 60s, redistribute work elements between them. The ideal state: every ${ps} at takt, performing only VA work.`,
        },
      ]
    },
    {
      id: 'vsm', icon: '', title: 'VSM Map', pro: false, steps: [
        {
          title: `Reading the ${vstream} map`,
          body: `The VSM Map shows your full ${vstream} visually using ISO 22468:2020 standard symbols. ${ps.charAt(0).toUpperCase() + ps.slice(1)} boxes are colour-coded: green = VA, amber = NNVA, red = NVA or bottleneck. The sawtooth timeline shows ${ct} above the baseline and wait time below.`,
        },
        {
          title: `${takt} line`,
          body: `A dashed red horizontal line crosses the timeline at ${takt}. Any ${ps} bar rising above this line cannot keep pace with ${cust} demand — it is your primary improvement target. The ${cust} is waiting.`,
        },
        {
          title: 'Bottleneck detection',
          body: `${ps.charAt(0).toUpperCase() + ps.slice(1)}s where ${ct} exceeds ${takt} are highlighted red with a ▲TAKT label and a ${kz} burst symbol. These are where your effort should focus first — bottlenecks constrain every other ${ps} in the ${vstream}.`,
        },
        {
          title: 'VSM analysis toolbar',
          body: `Three buttons above the map: Gap Analysis & AI Coaching (finds every lean gap), Yamazumi Chart (${ps} balance), Standard Work Sheet (task documentation). These tools transform a VSM from a diagram into an active improvement engine.`,
        },
      ]
    },
    {
      id: 'supe', icon: '', title: 'Supe AI — Process Intelligence', pro: true, steps: [
        {
          title: 'What Supe does',
          body: `Supe is your AI ${p} mentor. It analyses your entire ${vstream} — all ${ps}s, ${ct}s, ${waste} data, ${kz} events, and metrics — and provides specific, actionable improvement recommendations using the language and context of ${sector}.`,
        },
        {
          title: 'How to use Supe',
          body: `Click the Supe button in the top bar. Type your question or click "Analyse my ${p}". Supe reads all your ${ps} data in real time and responds with lean-specific insights referencing your actual ${ps} names and your industry context.`,
        },
        {
          title: 'What to ask Supe',
          body: `"Where is my biggest bottleneck and how do I fix it?", "What ${waste}s should I prioritise in this ${p}?", "How can I improve my PCE from 45% to 80%?", "Suggest a PDCA project for my highest ${ct} ${ps}." Supe understands lean methodology and ${sector} deeply.`,
        },
        {
          title: 'Supe is a Pro feature',
          body: 'Supe AI is available on Pro and Enterprise plans. Go to Settings → Subscription or the Pricing page to upgrade. Every analysis is private to your account.',
        },
      ]
    },
    {
      id: 'standard-work', icon: '', title: 'Standard Work Sheet', pro: false, steps: [
        {
          title: 'What is Standard Work?',
          body: `Standard Work is the documented current best method for performing a ${ps}. Not the fastest possible method — the safest, highest quality, lowest ${waste} method that any trained team member can reliably replicate. Standard Work is the baseline that makes continuous improvement possible in ${sector}.`,
        },
        {
          title: 'Standard Work Sheet',
          body: `The Standard Work Sheet shows every operator task in sequence with its time and VA classification. It is the primary document for training, auditing ${p} compliance, and defining the baseline for PDCA improvement cycles.`,
        },
        {
          title: 'Updating Standard Work',
          body: `Standard Work must be updated every time the ${p} changes. In the Act phase of PDCA, updating the Standard Work Sheet is the primary standardisation action. If the document does not reflect reality, team members will not follow it — and improvement gains will revert.`,
        },
      ]
    },
    {
      id: 'kanban', icon: '', title: 'Kanban Board', pro: false, steps: [
        {
          title: 'What the Kanban board does',
          body: `Transforms your VSM ${ps}s into a visual work management board. Each column represents a ${ps}. Work items move through columns as they progress, showing live ${wip} and flow status across your ${p}.`,
        },
        {
          title: 'WIP limits',
          body: `Each column can have a ${wip} limit — the maximum items allowed. When exceeded, the column header turns red as a visual signal to finish current work before starting more. ${wip} limits enforce pull flow and expose bottlenecks immediately.`,
        },
      ]
    },
    {
      id: 'report', icon: '', title: 'Report and Export', pro: false, steps: [
        {
          title: 'What the Report contains',
          body: `The Report tab generates an ISO 22468:2020 aligned improvement report: ${p} overview, ${vstream} summary, key metrics (PCE, Lead Time, ${takt}), bottleneck analysis, ${waste} register, root cause analysis summary, ${kz} events, and improvement results.`,
        },
        {
          title: 'Download Full Report (PDF)',
          body: `Click "Download Full Report" to export a professionally formatted PDF with a full document control block (document ID, revision, date, prepared by) — suitable for ISO audits, ${cust} quality reviews, and management presentations.`,
        },
        {
          title: 'ISO compliance',
          body: `All exported documents reference relevant ISO standards: ISO 9001:2015 for QMS, ISO 22468:2020 for VSM, ISO 31000:2018 for risk and root cause analysis, ILO standards for work measurement. Every report is audit-ready.`,
        },
      ]
    },
  ]

  const GLOSSARY = [
    { term: takt, def: `${takt} = Available Production Time ÷ ${cust} Demand. The rate at which you must complete one unit (or ${prod}, or case, or transaction) to satisfy ${cust} demand. ${ps.charAt(0).toUpperCase() + ps.slice(1)}s above ${takt} are bottlenecks. In ${sector}, ${takt} is the heartbeat of the entire ${p}.`, std: 'ISO 22468:2020 §5.2.1' },
    { term: `${ct} (CT)`, def: `The actual elapsed time to complete one ${prod} at a single ${ps}, measured by direct observation. Average of multiple observations after outlier removal. Compare to ${takt}: if ${ct} > ${takt}, the ${ps} is a bottleneck.`, std: 'ISO 22468:2020 §5.2.3, ILO §3' },
    { term: 'Lead Time', def: `Total elapsed time from input (demand, raw material, order) to output (delivered to ${cust}). = Sum of all ${ct}s + all wait/queue times. PCE = ${ct} / Lead Time. Reducing wait time between ${ps}s reduces Lead Time without changing ${ct}.`, std: 'ISO 22468:2020 §4.2' },
    { term: 'PCE (Process Cycle Efficiency)', def: `= Total VA Time ÷ Lead Time × 100%. What percentage of lead time is genuinely value-adding. World class: >90%. Most ${p}s start at 10–30%. VeSiMy colour-codes: green (≥90%), amber (≥60%), red (<60%).`, std: 'ISO 22468:2020 §5.2.2' },
    { term: `${wip} (Work In Progress)`, def: `Units, ${prod}s, cases, or requests that have been started but not yet completed — sitting between ${ps}s. High ${wip} = long lead time (Little's Law). The ${wip} triangles on a VSM show exactly where inventory is accumulating.`, std: 'ISO 22468:2020 §5.2.5' },
    { term: 'VA (Value Add)', def: `Activities that transform the ${prod} or service in a way the ${cust} recognises as valuable. In ${sector}, VA examples are the core ${ps}s of ${p} delivery. Everything else is a cost to minimise.`, std: 'ISO 22468:2020 §5.4' },
    { term: 'NNVA (Necessary Non-Value Add)', def: `Activities required by the current ${p} but adding no ${cust} value — checks, handoffs, setup. Cannot be eliminated immediately but should be minimised. Target for medium-term improvement.`, std: 'ISO 22468:2020 §5.4' },
    { term: 'NVA (Non-Value Add)', def: `Pure ${waste} — activities consuming time, space, or resources with no ${cust} value. Waiting, searching, rework, unnecessary movement. Target for immediate elimination.`, std: 'ISO 22468:2020 §5.4' },
    { term: `${kz.charAt(0).toUpperCase() + kz.slice(1)}`, def: `Japanese: "change for better." Continuous improvement through small, incremental changes made by the people doing the work. In ${sector}, ${kz}s are structured 3–5 day improvement sprints delivering measurable results before the week ends.`, std: 'ISO 9001:2015 §10.3' },
    { term: 'PDCA', def: `Plan-Do-Check-Act. The fundamental improvement cycle. Plan: define ${p} problem, identify root cause, set target. Do: implement countermeasure. Check: measure result against target. Act: standardise if successful, adjust if not.`, std: 'ISO 9001:2015 §10, ISO 9000:2015 §3.3.5' },
    { term: 'Fishbone (Ishikawa)', def: `Structured cause-and-effect analysis mapping all potential root causes of a ${p} problem across categories. Developed by Kaoru Ishikawa. Used before 5 Why to ensure no cause category is overlooked.`, std: 'ISO 9001:2015 §10.2.1' },
    { term: '5 Why', def: `Ask "Why?" iteratively (typically 5 times) to get from symptom to root cause. Always ends at a systemic failure — a missing standard, a standard not followed, or a standard not visible. Never ends at an individual person.`, std: 'ISO 9001:2015 §10.2.1' },
    { term: `${gemba.charAt(0).toUpperCase() + gemba.slice(1)} Walk`, def: `Going to the actual ${p} location to observe directly. The cornerstone of lean management — go see, don't assume. Data gathered at the ${gemba} is more accurate than any report or second-hand account.`, std: 'ISO 9001:2015 §9.1' },
    { term: 'DOWNTIME', def: `The 8 ${waste}s of lean: Defects, Overproduction, Waiting, Non-utilised talent, Transport, Inventory, Motion, Extra-processing. All 8 exist in every industry — the forms they take differ. In ${sector}, ${waste}s show up as ${defect}s, delays, and underused capacity.`, std: 'ISO 22468:2020 §5.4' },
    { term: 'Standard Work', def: `The documented current best method for performing a ${ps}. The safest, highest quality, lowest ${waste} repeatable method. Updated every time the ${p} improves. The baseline that makes continuous improvement possible.`, std: 'ISO 22468:2020 §5.2.3, ISO 9001:2015 §8.5.1' },
    { term: 'Bottleneck', def: `The ${ps} where ${ct} exceeds ${takt}. Constrains throughput for the entire ${vstream} — all other ${ps}s can only produce as fast as the bottleneck. The Theory of Constraints focuses entirely on identifying and elevating bottlenecks.`, std: 'ISO 22468:2020 §5.2.4' },
    { term: 'A3 Report', def: `Toyota's one-page problem-solving format. Contains background, current condition, goal, root cause, countermeasures, implementation plan, results, and follow-up — all on one sheet. Forces concise, complete thinking about any ${p} problem.`, std: 'ISO 22468:2020' },
    { term: '8D Report', def: `Eight Disciplines problem-solving methodology (Ford Motor Company). D1: Team, D2: Problem, D3: Containment, D4: Root Cause, D5–6: Corrective Actions, D7: Prevent Recurrence, D8: Close. Required by many customers when a quality escape occurs.`, std: 'IATF 16949 §10.2' },
    { term: 'Poka-Yoke', def: `Error-proofing: designing the ${p} so a mistake cannot be made, or is detected immediately if made. The goal is making quality automatic rather than inspected. Applied at the source of potential ${defect}s in the ${p}.`, std: 'ISO 9001:2015 §8.3.3' },
    { term: 'One-Piece Flow', def: `Ideal lean flow state: one ${prod} moves through each ${ps} without batching. Exposes quality problems immediately, minimises lead time, eliminates ${wip} ${waste}. The goal of every ${vstream} future state in ${sector}.`, std: 'ISO 22468:2020 §5.3' },
    { term: 'SMED (Single-Minute Exchange of Die)', def: `Changeover reduction methodology targeting setup times below 10 minutes. Classifies every changeover task as Internal (machine stopped) or External (can run during production). Converting internal tasks to external is the primary lever.`, std: 'ISO 22468:2020 §5.2.5' },
    { term: 'Yamazumi Chart', def: `Operator balance chart showing work content per ${ps} broken into VA, NNVA, and NVA time, compared to a ${takt} line. The primary tool for ${p} balancing and operator-level ${waste} elimination in ${sector}.`, std: 'ISO 22468:2020 §5.2.4' },
    { term: 'VSM (Value Stream Mapping)', def: `A lean tool for visualising every ${ps}, delay, and information flow in a ${p} from input to ${cust}. Shows VA time, NVA time, ${wip}, ${ct}s, and operator counts. The most important lean planning tool.`, std: 'ISO 22468:2020' },
    { term: '5S', def: `Workplace organisation methodology: Sort (remove unneeded items), Set in Order (arrange needed items), Shine (clean), Standardise (document the standard), Sustain (maintain). Foundation for visual management in any ${p}, including ${sector}.`, std: 'ISO 9001:2015 §6.4' },
  ]

  const FAQS = [
    { q: `What is PCE and what is a good score for ${sector}?`, a: `PCE = Total Cycle Time (VA time) ÷ Lead Time. It measures what percentage of your lead time is actually adding value. World-class lean targets 90–95%+ PCE. Most ${p}s in ${sector} start at 10–30%. VeSiMy colour-codes your PCE green (≥90%), amber (≥60%), red (<60%) in the KPI bar.` },
    { q: `What is ${takt} and how is it calculated?`, a: `${takt} = Available Working Time ÷ ${cust} Demand. Enter working hours and demand in project settings and VeSiMy calculates it automatically. ${ps.charAt(0).toUpperCase() + ps.slice(1)}s exceeding ${takt} are your bottlenecks. In ${sector}, understanding your ${takt} is the first step in understanding capacity.` },
    { q: `What is the difference between ${ct} and Lead Time?`, a: `${ct} is how long it takes to complete one ${prod} at a single ${ps}. Lead Time is the total time from input to ${cust} delivery — all ${ct}s plus all wait/queue times combined. PCE = ${ct} / Lead Time. Reducing wait time between ${ps}s reduces Lead Time without changing any individual ${ct}.` },
    { q: `What is the difference between PDCA and DMAIC?`, a: `PDCA (Plan-Do-Check-Act) is a fast, iterative improvement cycle suitable for most ${p} problems in ${sector}. DMAIC (Define-Measure-Analyse-Improve-Control) is a Six Sigma project methodology for complex, statistically-driven problems requiring months of data analysis. VeSiMy uses PDCA as the workflow but can export in DMAIC format for Six Sigma audiences.` },
    { q: `How do I identify ${waste} in my ${p}?`, a: `Walk the ${p} — observe the ${gemba} directly. Ask: is this ${ps} adding value the ${cust} would pay for? Is there unnecessary waiting, rework, or movement? Common ${waste}s in ${sector} include ${defect}s, waiting between ${ps}s, and underused team skills. Mark every ${waste} type in the Waste ID tool on each ${ps}.` },
    { q: `What is a ${kz} and how long does it take?`, a: `A ${kz} is a structured, time-boxed improvement activity — typically 3–5 days with a dedicated cross-functional team. The goal is measurable improvement in days, not months. In ${sector}, ${kz} events focus on specific bottlenecks or ${waste}s identified on the ${vstream} map.` },
    { q: `How many time study observations should I record?`, a: `Minimum 10 observations for stable ${p}s, 20–30 for variable ones. Remove outliers from interruptions or abnormal events. The ILO recommends observations until the coefficient of variation (CV%) stabilises below 10% for manual operations. More observations = more reliable ${ct} data.` },
    { q: `What is Standard Work and why does it matter?`, a: `Standard Work is the documented current best method for performing a ${ps} — the safest, highest quality, lowest ${waste} repeatable method. It is the baseline for all improvement. Without Standard Work, you cannot measure whether a ${kz} actually improved anything.` },
    { q: `What is in the ISO-compliant export?`, a: `All VeSiMy exports include: document title, document ID, revision number, date, prepared by, project name, and relevant ISO standard references in a document control block. Standards referenced include ISO 9001:2015, ISO 22468:2020 (VSM), ISO 31000:2018 (root cause analysis), and ILO work measurement standards.` },
    { q: `Can multiple people collaborate on the same project?`, a: `Real-time multi-user collaboration is in development. Currently each user manages their own projects. Enterprise plans include team workspace features. Contact founder@vesimy.com to discuss your team setup.` },
    { q: `How do I upgrade from Trial to Pro?`, a: `Go to Settings → Subscription and click "Upgrade to Pro", or visit the Pricing page. Payment is processed securely through Stripe. Pro features — Supe AI, Process Simulation, Live Floor Monitor — activate immediately after payment.` },
  ]

  return { MANUAL, GLOSSARY, FAQS }
}

// ── Component ─────────────────────────────────────────────────────────────────
export function LearningCenter({ userId }: Props) {
  const { t, industry } = useIndustryLanguage()
  const { MANUAL, GLOSSARY, FAQS } = useMemo(() => buildContent(t, industry || ''), [t, industry])

  const [activeTab,         setActiveTab]         = useState<'manual'|'glossary'|'faqs'>('manual')
  const [activeSection,     setActiveSection]      = useState('getting-started')
  const [expandedStep,      setExpandedStep]       = useState<string|null>(null)
  const [expandedFAQ,       setExpandedFAQ]        = useState<number|null>(null)
  const [glossarySearch,    setGlossarySearch]     = useState('')
  const [showMobilePicker,  setShowMobilePicker]   = useState(false)

  const section = MANUAL.find(s => s.id === activeSection) || MANUAL[0]

  const filteredGlossary = useMemo(() =>
    GLOSSARY.filter(g =>
      !glossarySearch ||
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.def.toLowerCase().includes(glossarySearch.toLowerCase())
    ), [GLOSSARY, glossarySearch])

  function pickSection(id: string) {
    setActiveSection(id)
    setExpandedStep(null)
    setShowMobilePicker(false)
    setExpandedFAQ(null)
  }

  const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'
  const sectorLabel = t.sectorLabel || 'your industry'

  // ── Step accordion ──────────────────────────────────────────────────────────
  function StepAccordion({ sec }: { sec: typeof section }) {
    return (
      <>
        {sec.pro && (
          <div style={{ background:'rgba(100,38,160,0.06)', border:'1px solid rgba(100,38,160,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
            <p style={{ fontSize:13, color:'#8C44CC', margin:0 }}>
              This feature requires a <strong>Pro or Enterprise plan</strong>.{' '}
              <a href="/pricing" style={{ color:'var(--brand)', textDecoration:'none' }}>View Pricing &rarr;</a>
            </p>
          </div>
        )}
        <p style={{ fontSize:12, color:'var(--text3)', marginBottom:14, lineHeight:1.7 }}>
          {sec.steps.length} topic{sec.steps.length !== 1 ? 's' : ''} — tap any to expand.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {sec.steps.map((step: any, i: number) => {
            const key = `${sec.id}-${i}`
            const open = expandedStep === key
            return (
              <div key={key} style={{ background:'#FFFFFF', border:`1px solid ${open ? 'var(--brand)' : 'var(--border)'}`, borderRadius:10, overflow:'hidden' }}>
                <button
                  onClick={() => setExpandedStep(open ? null : key)}
                  style={{ width:'100%', textAlign:'left', padding:'13px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}
                >
                  <span style={{
                    width:22, height:22, borderRadius:6, flexShrink:0,
                    background: open ? 'rgba(1,118,211,0.12)' : 'var(--sl-100)',
                    border: `1px solid ${open ? 'var(--brand)' : 'var(--border)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, fontWeight:700, color: open ? 'var(--brand)' : 'var(--text3)',
                  }}>{i + 1}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight:600, color: open ? 'var(--brand)' : 'var(--text)', lineHeight:1.4 }}>{step.title}</span>
                  <span style={{ color:'var(--text3)', fontSize:16, transition:'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none', flexShrink:0 }}>›</span>
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
          const idx = MANUAL.findIndex(s => s.id === sec.id)
          const next = MANUAL[idx + 1]
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
        <h1 style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
          {industry ? `Learning Center — ${sectorLabel}` : 'Learning Center'}
        </h1>
        <p style={{ fontSize:12, color:'var(--text3)', margin:'0 0 12px', lineHeight:1.6 }}>
          {industry
            ? `All content uses ${sectorLabel} terminology. No manufacturing language unless it applies directly to your ${t.process || 'process'}.`
            : 'Master lean CI — PDCA, VSM, Yamazumi, 5 Why, and more. Select your industry in Settings to see content in your terminology.'}
        </p>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {([['manual', 'Manual'], ['glossary', 'Glossary'], ['faqs', 'FAQs']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setShowMobilePicker(false) }} style={{
              padding:'7px 14px', borderRadius:8, fontSize:12,
              fontWeight: activeTab === tab ? 700 : 400,
              background: activeTab === tab ? 'rgba(1,118,211,0.10)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'rgba(1,118,211,0.4)' : 'var(--border)'}`,
              color: activeTab === tab ? 'var(--brand)' : 'var(--text3)',
              cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── MANUAL TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'manual' && (
        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
          {/* Sidebar */}
          <div className="learn-sidebar">
            {MANUAL.map(s => (
              <button key={s.id} onClick={() => pickSection(s.id)} style={{
                width:'100%', textAlign:'left', padding:'9px 14px',
                background: activeSection === s.id ? 'rgba(1,118,211,0.08)' : 'transparent',
                border:'none', borderLeft:`3px solid ${activeSection === s.id ? 'var(--brand)' : 'transparent'}`,
                cursor:'pointer', display:'flex', alignItems:'center', gap:8,
              }}>
                <span style={{ fontSize:14, flexShrink:0 }}>{s.icon}</span>
                <span style={{
                  fontSize:12, fontWeight: activeSection === s.id ? 700 : 400,
                  color: activeSection === s.id ? 'var(--brand)' : 'var(--sl-600)',
                  lineHeight:1.3, flex:1,
                }}>{s.title}</span>
                {s.pro && (
                  <span style={{
                    fontSize:8, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1,
                    background:'rgba(100,38,160,0.10)', border:'1px solid rgba(100,38,160,0.22)',
                    borderRadius:4, padding:'1px 4px', flexShrink:0,
                  }}>PRO</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:'auto', minWidth:0, paddingBottom:80 }}>
            {/* Mobile picker */}
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
                <span style={{ color:'var(--brand)', fontSize:16, transform: showMobilePicker ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', display:'inline-block' }}>⌄</span>
              </button>
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
                      background: activeSection === s.id ? 'rgba(1,118,211,0.08)' : 'transparent',
                      border:'none', borderBottom:'1px solid var(--border)',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:10,
                    }}>
                      <span style={{ fontSize:16 }}>{s.icon}</span>
                      <span style={{ flex:1, fontSize:13, fontWeight: activeSection === s.id ? 700 : 400, color: activeSection === s.id ? 'var(--brand)' : 'var(--text)' }}>{s.title}</span>
                      {s.pro && <span style={{ fontSize:9, color:'#8C44CC', background:'rgba(100,38,160,0.10)', border:'1px solid rgba(100,38,160,0.2)', borderRadius:4, padding:'2px 5px' }}>PRO</span>}
                      {activeSection === s.id && <span style={{ color:'var(--brand)' }}><CheckIcon size={13} color='var(--brand)'/></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section content */}
            <div style={{ padding:'20px 18px' }}>
              <div className="learn-section-header" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <span style={{ fontSize:24 }}>{section.icon}</span>
                <h2 style={{ fontFamily:serif, fontSize:19, fontWeight:700, color:'var(--text)', margin:0 }}>{section.title}</h2>
                {section.pro && (
                  <span style={{
                    fontSize:10, color:'#8C44CC', fontFamily:'monospace', letterSpacing:1.5,
                    background:'rgba(100,38,160,0.10)', border:'1px solid rgba(100,38,160,0.22)',
                    borderRadius:6, padding:'3px 8px',
                  }}>PRO</span>
                )}
              </div>
              <StepAccordion sec={section} />
            </div>
          </div>
        </div>
      )}

      {/* ── GLOSSARY TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'glossary' && (
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', paddingBottom:80 }}>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:10, lineHeight:1.7 }}>
            {filteredGlossary.length} terms — all defined in {sectorLabel} context. Tap to expand.
          </p>
          <input
            className="input"
            placeholder="Search terms…"
            value={glossarySearch}
            onChange={e => setGlossarySearch(e.target.value)}
            style={{ marginBottom:12, fontSize:13 }}
          />
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {filteredGlossary.map((g, i) => (
              <div key={i} style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  style={{ width:'100%', textAlign:'left', padding:'11px 14px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}
                >
                  <div style={{ minWidth:0 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--brand)', display:'block' }}>{g.term}</span>
                    <span style={{ fontSize:9, fontFamily:'monospace', color:'var(--text3)' }}>{g.std}</span>
                  </div>
                  <span style={{ color:'var(--text3)', fontSize:16, flexShrink:0, transition:'transform 0.2s', transform: expandedFAQ === i ? 'rotate(90deg)' : 'none' }}>›</span>
                </button>
                {expandedFAQ === i && (
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
      {activeTab === 'faqs' && (
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', paddingBottom:80 }}>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:14, lineHeight:1.7 }}>
            {FAQS.length} questions — answered in {sectorLabel} context. Tap to expand.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  style={{ width:'100%', textAlign:'left', padding:'13px 14px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}
                >
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text)', lineHeight:1.5, flex:1 }}>{faq.q}</span>
                  <span style={{ color:'var(--text3)', fontSize:16, flexShrink:0, transition:'transform 0.2s', transform: expandedFAQ === i ? 'rotate(90deg)' : 'none' }}>›</span>
                </button>
                {expandedFAQ === i && (
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
