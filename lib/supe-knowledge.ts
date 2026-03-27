// @ts-nocheck
// ── lib/supe-knowledge.ts ─────────────────────────────────────────────────────
// VeSiMy Supe AI RAG Knowledge Base — 32 discrete knowledge chunks.
// Supe no longer uses generic web knowledge. It uses THIS as its source of truth.
// Industry context is injected alongside retrieved chunks.

import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'

export interface KnowledgeChunk {
  id:       string
  section:  string
  tags:     string[]
  content:  string
}

// ── Build Supe system prompt with industry context + relevant knowledge ───────
export function buildSupeSystemPrompt(options: {
  industryKey?:    string | null
  projectName?:    string
  stepContext?:    string
  includeChunks?:  string[]   // specific section IDs to include
}): string {

  const { industryKey, projectName, stepContext, includeChunks } = options
  const t = getIndustryTerms(industryKey)
  const industryLabel = getIndustryLabel(industryKey || 'general_manufacturing')

  const industryContext = `
INDUSTRY CONTEXT:
You are advising a ${industryLabel} professional. Use their industry's language throughout:
- Their product is called: ${t.product}
- Their customer is: ${t.customer}
- A process step is: ${t.processStep}
- Cycle time is: ${t.cycleTime}
- Wait time is: ${t.waitTime}
- WIP means: ${t.wip}
- A defect is: ${t.defect}
- The place where work happens is: ${t.gemba}
- Standard work is called: ${t.standardWork}
- An improvement action is: ${t.kaizen}
Never say "production floor" or "factory" unless they are in manufacturing.
Never say "product" if their industry calls it something else.
Translate every lean term into their industry's native language automatically.
`

  const corePhilosophy = `
YOUR ROLE — SUPE AI:
You are Supe — VeSiMy's AI process mentor. Your job is to help every employee reach their performance targets by:
1. Identifying what they have already improved (celebrate and quantify the gain)
2. Finding the next highest-impact improvement opportunity in their specific process
3. Giving them a clear, actionable step they can take today — not theory, not generalities
4. Tracking their progress toward targets over time

The user is not a lean expert. They are a ${industryLabel} professional trying to hit their targets. 
Speak in their language. Be specific to their data. Be direct. No jargon unless you explain it.
The lean methodology is your engine — it is never the message.
`

  const knowledgeBase = buildRelevantKnowledge(industryKey, includeChunks)

  return `${corePhilosophy}

${industryContext}

${projectName ? `CURRENT PROJECT: ${projectName}` : ''}
${stepContext ? `STEP CONTEXT: ${stepContext}` : ''}

KNOWLEDGE BASE (use this — do not use general web knowledge):
${knowledgeBase}

RESPONSE RULES:
- Always reference actual data from the user's process, not hypothetical examples
- Lead with the most important finding, not background
- If cycle time exceeds takt time, say so clearly with the exact numbers
- Recommend one specific improvement action at a time
- Use the user's industry terminology throughout — never default to manufacturing terms
- End every analysis with: "Your next target: [specific measurable action]"
`
}

function buildRelevantKnowledge(industryKey?: string | null, specific?: string[]): string {
  // Always include core foundations + relevant industry section
  const alwaysInclude = [
    'tps_philosophy', 'seven_wastes', 'value_definition', 'vsm_methodology',
    'time_study', 'five_why', 'fishbone', 'kaizen', 'pdca', 'standard_work',
    'key_metrics', 'lean_transformation'
  ]
  
  const industrySpecific: Record<string, string[]> = {
    hospital_acute_care:     ['lean_healthcare'],
    primary_care_outpatient: ['lean_healthcare'],
    surgery_operating_room:  ['lean_healthcare'],
    pharmacy:                ['lean_healthcare'],
    craft_brewery:           ['lean_brewing'],
    winery:                  ['lean_brewing'],
    real_estate:             ['lean_real_estate'],
    software_development:    ['kanban', 'smed'],
    it_operations:           ['kanban'],
  }

  const toInclude = new Set([
    ...alwaysInclude,
    ...(industryKey ? (industrySpecific[industryKey] || []) : []),
    ...(specific || [])
  ])

  return KNOWLEDGE_CHUNKS
    .filter(c => toInclude.has(c.id))
    .map(c => `[${c.section}]\n${c.content}`)
    .join('\n\n---\n\n')
}

// ── Knowledge chunks ─────────────────────────────────────────────────────────
export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
{
  id: 'tps_philosophy',
  section: 'Toyota Production System — Philosophy',
  tags: ['TPS', 'Toyota', 'philosophy', 'waste elimination', 'JIT', 'jidoka'],
  content: `TPS rests on two pillars: Just-In-Time (produce only what is needed, when needed, in the amount needed) and Jidoka (build quality in — never pass a defect to the next step). The goal is to shorten the time between order and delivery by eliminating waste. A perfect process has capacity equal to demand at every step — no overproduction, no waiting, no excess inventory. The three production challenges are muda (waste), mura (unevenness), and muri (overburden).`
},
{
  id: 'seven_wastes',
  section: 'The Seven Wastes (Muda)',
  tags: ['muda', 'waste', 'TIMWOOD', 'DOWNTIME', 'elimination'],
  content: `Waste is any activity consuming resources without creating customer value. Seven types:
1. TRANSPORTATION — moving things that don't need to be moved. Co-locate sequential steps.
2. INVENTORY — anything in excess of immediate need. Hides problems. Pull systems fix this.
3. MOTION — unnecessary movement of people. 5S and ergonomic design fix this.
4. WAITING — idle time between steps. The #1 driver of long lead times. Levelling and balancing fix this.
5. OVERPRODUCTION — making more than needed. Worst waste — creates all others. Pull systems fix this.
6. OVERPROCESSING — doing more than the customer requires. Clear value definition fixes this.
7. DEFECTS — errors requiring rework. Poka-yoke and standard work fix this.
EIGHTH WASTE: Unused human potential — not involving people in improvement. The most significant waste in modern organisations.`
},
{
  id: 'value_definition',
  section: 'Value — Customer Value Definition',
  tags: ['value', 'VA', 'NNVA', 'NVA', 'PCE', 'waste identification'],
  content: `An activity is Value-Added ONLY if: (1) the customer would pay for it, (2) it physically transforms the product/service toward what the customer wants, (3) it is done right the first time. Everything else is waste. PCE = Value-Added Time / Total Lead Time × 100%. World-class: manufacturing 25%+, service 50%+. Most organisations start below 5%. That gap is your entire improvement opportunity.`
},
{
  id: 'vsm_methodology',
  section: 'Value Stream Mapping — Complete Methodology',
  tags: ['VSM', 'value stream', 'current state', 'future state', 'ISO 22468'],
  content: `VSM traces the end-to-end process from supplier to customer, capturing: cycle time, wait time, changeover time, uptime, operators, WIP, and defect rates at each step. The current state map shows reality — not what is supposed to happen. Takt Time = Available Time / Customer Demand. Any step with cycle time > takt time is a bottleneck. PCE = value-added time / total lead time. The improvement sequence: (1) map current state, (2) identify bottleneck, (3) identify top 3 wastes, (4) design future state, (5) implement and measure, (6) repeat.`
},
{
  id: 'time_study',
  section: 'Time Study — Measurement Methodology',
  tags: ['time study', 'cycle time', 'stopwatch', 'observation', 'takt time'],
  content: `Time study is direct observation of actual process times. Minimum 10 observations for reliability. Calculate the mean — use it in VSM. Never use standard or documented times. Compare to takt time: cycle time > takt time = bottleneck. Coefficient of variation (std dev / mean) above 15% = unstable process — investigate variation before speed. The Yamazumi chart plots each operator's cycle time against takt time to show workload balance.`
},
{
  id: 'five_why',
  section: '5 Why Root Cause Analysis',
  tags: ['5 Why', 'root cause', 'problem solving', 'countermeasure'],
  content: `Ask why repeatedly until reaching a system-level root cause. Rules: ask about the process not the person; each answer must be evidence-based; the countermeasure must logically address the root cause. Root causes are system failures — in the standard, process design, training, or management system. Example chain: defect → tool worn → not replaced → schedule not visible → no system for operator communication → root cause: PM system lacks operator communication. Countermeasure: visual PM schedule at workstation. If fixing it won't eliminate the problem, you haven't found the root cause.`
},
{
  id: 'fishbone',
  section: 'Fishbone (Ishikawa) Diagram',
  tags: ['fishbone', 'Ishikawa', 'cause and effect', '6M', '8P', 'root cause'],
  content: `Fishbone organises potential causes into categories before 5 Why traces the specific chain. 6M categories (manufacturing): Machine, Method, Material, Man, Measurement, Mother Nature. 8P categories (service): People, Process, Policy, Place, Products, Price, Promotion, Physical evidence. Construction: (1) write problem at fish head, (2) brainstorm causes per category, (3) vote on most likely category, (4) use 5 Why on that category. Limitation: only reveals what the team already knows.`
},
{
  id: 'kaizen',
  section: 'Kaizen — Continuous Improvement',
  tags: ['kaizen', 'improvement', 'rapid improvement', 'PDCA'],
  content: `Kaizen = change for the better. Every person at every level is responsible for identifying and implementing improvements. Small consistent improvements beat large infrequent overhauls. A kaizen event is 3-5 days: Day 1 — observe current process at gemba, collect data. Day 2 — root cause analysis. Days 3-4 — implement changes immediately. Day 5 — document standard, train, set monitoring metrics. Key rule: implement now, don't wait for perfect. The kaizen newspaper tracks all actions with owner and deadline.`
},
{
  id: 'pdca',
  section: 'PDCA — Plan Do Check Act',
  tags: ['PDCA', 'Deming cycle', 'improvement cycle', 'hypothesis'],
  content: `Plan: define the problem with data, set measurable target, analyse root causes, form a hypothesis, define how results will be measured. Do: implement on small scale — this is an experiment, not a solution. Check: did it work? Compare actual to predicted. If yes: proceed to Act. If no: return to Plan. Act: standardise the change, update standard work, train operators, implement at full scale, then begin the next cycle. Without standardisation, improvements disappear within weeks. SDCA (Standardise-Do-Check-Act) maintains standards between improvement cycles.`
},
{
  id: 'standard_work',
  section: 'Standard Work',
  tags: ['standard work', 'standardisation', 'takt time', 'best practice'],
  content: `Standard work defines: (1) takt time, (2) work sequence, (3) standard WIP. You cannot improve what is not standardised — without a baseline there is nothing to measure improvement against. Standard work is NOT an SOP: SOPs describe what to do and why (compliance). Standard work describes the precise sequence, timing, and WIP for the current best-known method (improvement). Standard work is always updated when a better method is confirmed. Deviations from standard work are the primary source of quality variation.`
},
{
  id: 'kanban',
  section: 'Kanban — Pull System',
  tags: ['kanban', 'pull system', 'JIT', 'WIP limits', 'visual management'],
  content: `Kanban controls flow using consumption signals. Nothing is produced until a downstream signal says it is needed. Push = produce to schedule regardless of need (creates inventory). Pull = produce only when downstream has consumed (minimises inventory). WIP limits on kanban boards prevent overloading any stage. Reducing kanban cards forces upstream processes to improve. Kanban sizing: (demand × lead time + safety stock) / container size.`
},
{
  id: 'smed',
  section: 'SMED — Setup Reduction',
  tags: ['SMED', 'changeover', 'setup', 'flexibility', 'batch size'],
  content: `Long changeover forces large batches. Large batches create large inventory and long lead times. SMED targets changeover below 10 minutes. Phase 1: separate internal (machine stopped) from external (machine running) setup. Most changeovers are 50%+ external activities performed as internal — simply separating them cuts time 30-50%. Phase 2: convert internal to external. Phase 3: streamline — standardise tooling, use clamps not bolts, run parallel operations. Applies anywhere: hospital OR turnover, call centre shift change, software context switching.`
},
{
  id: 'tpm',
  section: 'Total Productive Maintenance — OEE',
  tags: ['TPM', 'OEE', 'maintenance', 'availability', 'performance'],
  content: `OEE = Availability × Performance × Quality. World-class: 85%+ overall. Six big losses: (1) unplanned downtime, (2) planned downtime/changeover, (3) minor stoppages, (4) reduced speed, (5) startup defects, (6) production defects. Autonomous maintenance: operators take responsibility for basic cleaning, inspection, and lubrication. Cleaning is inspection — problems discovered during cleaning prevent breakdowns. TPM targets zero breakdowns, zero defects, zero accidents.`
},
{
  id: 'key_metrics',
  section: 'Key Lean Metrics',
  tags: ['metrics', 'KPIs', 'takt time', 'cycle time', 'PCE', 'OEE', 'SQDC'],
  content: `Takt time = available time / demand. Every step above takt = bottleneck. Cycle time = actual measured time per step. Lead time = sum of all cycle times + all wait times. PCE = VA time / lead time (most organisations: <5%; world-class: 25%+). OEE = availability × performance × quality (world-class: 85%+). First Pass Yield = good units / total started. Rolled Throughput Yield = product of all individual step FPY — reveals cumulative quality loss across multi-step processes. SQDC priority order: Safety first, then Quality, Delivery, Cost.`
},
{
  id: 'lean_healthcare',
  section: 'Lean in Healthcare',
  tags: ['lean healthcare', 'patient flow', 'clinical', 'NHS', 'hospital'],
  content: `Healthcare terminology: product = patient outcome; customer = patient; inventory = patients waiting; cycle time = care step duration; takt time = patients per hour based on arrival rate; defect = adverse event or readmission; gemba = bedside/OR/ED. Key metrics: door-to-physician time, length of stay, OR on-time start rate, medication turnaround time, readmission rate. Patient journey mapping = healthcare VSM. WHO Surgical Safety Checklist = poka-yoke against wrong-site surgery. 5S in supply rooms eliminates nurse motion waste. Kanban for supply replenishment prevents stock-outs.`
},
{
  id: 'lean_brewing',
  section: 'Lean in Craft Brewing',
  tags: ['lean brewing', 'brewery', 'batch process', 'fermentation'],
  content: `Brewing is a batch process. Terminology: product = batch; customer = distributor/taproom guest; production line = brew house flow; cycle time = brew step duration; takt time = batches per week to meet demand; defect = off-flavour or failed batch; gemba = brew house. VSM traces grain delivery through packaging. Most lead time is waiting — fermentation and conditioning are value-adding but long. Value-added: mashing, fermentation, conditioning. SMED applies to CIP (Clean-in-Place) optimisation. 5 Why for batch failures. Fishbone cause categories: yeast health, sanitation, water chemistry, temperature control, recipe execution.`
},
{
  id: 'lean_real_estate',
  section: 'Lean in Real Estate',
  tags: ['lean real estate', 'transaction', 'deal flow'],
  content: `Real estate terminology: product = transaction closed; customer = buyer/seller; value stream = lead to close; cycle time = step duration; takt time = transactions per month target; defect = deal fall-through or documentation error; gemba = office/property. Most transaction time is waiting — waiting for signatures, approvals, financing, title search. This is waiting waste. 5 Why example: deal fell through → financing denied → credit issue → not found at pre-qualification → pre-qual process insufficient → root cause: no full credit review standard at pre-qualification.`
},
{
  id: 'visual_management',
  section: 'Visual Management',
  tags: ['visual management', 'andon', 'kanban board', 'shadow board'],
  content: `A well-managed process communicates its status within 30 seconds without asking anyone. Four levels: (1) indicator — shares information; (2) signal — alerts to abnormality; (3) control — limits behaviour (shadow board); (4) guarantee — makes correct behaviour automatic (poka-yoke). Andon: any worker signals an abnormality, triggering immediate response. The culture test: do workers feel safe stopping the process when they detect a problem? If not, defects are being hidden.`
},
{
  id: 'lean_transformation',
  section: 'Lean Culture and Transformation',
  tags: ['lean culture', 'leadership', 'gemba walk', 'sustainability'],
  content: `Lean fails when: tools are implemented without changing management behaviour; improvement activities are disconnected from strategy; production pressure overrides improvement; internal capability is not developed. Lean is sustained when: leaders go to gemba as a habit; problems are surfaced and celebrated rather than hidden; workers initiate improvement without being asked; standard work is followed and updated; metrics improve processes, not blame people. Respect for people is a TPS core pillar — trust that the people doing the work are the experts on that work.`
},
]

// Export a lookup by ID
export const CHUNK_BY_ID = Object.fromEntries(KNOWLEDGE_CHUNKS.map(c => [c.id, c]))
