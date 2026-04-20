// TypeScript enabled — @ts-nocheck removed as part of quality pass
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
    // Healthcare
    hospital_acute_care:           ['lean_healthcare'],
    primary_care_outpatient:       ['lean_healthcare'],
    surgery_operating_room:        ['lean_healthcare'],
    pharmacy:                      ['lean_healthcare'],
    medical_devices:               ['lean_manufacturing_general'],
    pharmaceutical_manufacturing:  ['lean_manufacturing_general'],
    // Brewing / Beverages
    craft_brewery:                 ['lean_brewing'],
    winery:                        ['lean_brewing'],
    // Services / Real Estate
    real_estate:                   ['lean_real_estate'],
    // Software & Tech
    software_development:          ['lean_software_tech', 'kanban', 'smed'],
    it_operations:                 ['lean_software_tech', 'kanban'],
    cybersecurity:                 ['lean_software_tech', 'kanban'],
    // Manufacturing (all types)
    automotive_manufacturing:      ['lean_manufacturing_general', 'smed', 'tpm'],
    aerospace_manufacturing:       ['lean_manufacturing_general', 'smed'],
    food_beverage_manufacturing:   ['lean_manufacturing_general'],
    general_manufacturing:         ['lean_manufacturing_general', 'smed', 'tpm'],
    metal_finishing:               ['lean_metal_finishing', 'lean_manufacturing_general', 'smed', 'tpm'],
    electronics_manufacturing:     ['lean_manufacturing_general'],
    industrial_manufacturing:      ['lean_manufacturing_general', 'tpm'],
    // Professional services
    law_firm:                      ['lean_professional_services'],
    management_consulting:         ['lean_professional_services'],
    accounting_audit:              ['lean_professional_services'],
    architecture_engineering:      ['lean_professional_services'],
    engineering_consulting:        ['lean_professional_services'],
    // Retail & E-commerce
    retail_stores:                 ['lean_retail_ecommerce'],
    ecommerce_fulfillment:         ['lean_retail_ecommerce'],
    grocery:                       ['lean_retail_ecommerce'],
    // Logistics & Transport
    warehousing_distribution:      ['lean_logistics_freight'],
    freight_trucking:              ['lean_logistics_freight'],
    postal_parcel:                 ['lean_logistics_freight'],
    rail_operations:               ['lean_logistics_freight'],
    port_maritime:                 ['lean_logistics_freight'],
    airline_aviation:              ['lean_logistics_freight', 'smed'],
    // Hospitality
    restaurant_food_service:       ['lean_hospitality_food_service'],
    hotel_hospitality:             ['lean_hospitality_food_service'],
    // Financial services
    retail_banking:                ['lean_financial_services'],
    insurance:                     ['lean_financial_services'],
    investment_management:         ['lean_financial_services'],
    // Public sector
    government_services:           ['lean_public_sector'],
    fire_rescue:                   ['lean_public_sector'],
    police:                        ['lean_public_sector'],
    military:                      ['lean_public_sector'],
    // Agriculture
    farming_crop:                  ['lean_agriculture'],
    aquaculture:                   ['lean_agriculture'],
    // Media & Creative
    film_tv:                       ['lean_media_creative'],
    music_production:              ['lean_media_creative'],
    video_games:                   ['lean_media_creative'],
    publishing:                    ['lean_media_creative'],
    graphic_design:                ['lean_media_creative'],
    digital_marketing:             ['lean_media_creative'],
    // HR & Staffing
    human_resources:               ['lean_hr_staffing'],
    staffing_agency:               ['lean_hr_staffing'],
    // Education & Training
    k12_education:                 ['lean_education_training'],
    higher_education:              ['lean_education_training'],
    corporate_training:            ['lean_education_training'],
    academic_research:             ['lean_education_training'],
    // Nonprofit & Social
    nonprofit:                     ['lean_nonprofit_social'],
    social_care:                   ['lean_nonprofit_social'],
    // Energy
    power_generation_utilities:    ['lean_energy_utilities', 'tpm'],
    oil_gas:                       ['lean_energy_utilities'],
    // Sports & Events
    professional_sports:           ['lean_sports_fitness'],
    sports_team:                   ['lean_sports_fitness'],
    sports_venue:                  ['lean_sports_fitness'],
    fitness_clubs:                 ['lean_sports_fitness'],
    live_events:                   ['lean_sports_fitness'],
    event_management:              ['lean_sports_fitness'],
    // Contact centre / Telecoms
    contact_center:                ['lean_professional_services', 'kanban'],
    telecoms:                      ['lean_software_tech'],
    // Construction
    construction:                  ['lean_manufacturing_general'],
    // Clinical / Research
    clinical_trials:               ['lean_healthcare'],
    // Project Management
    project_management:            ['lean_professional_services'],
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

// ── Extended industry-specific knowledge chunks ───────────────────────────────
// Appended: covers the remaining 65 industries not in the original set

KNOWLEDGE_CHUNKS.push(

{
  id: 'lean_manufacturing_general',
  section: 'Lean in General Manufacturing & Industrial',
  tags: ['manufacturing','industrial','OEE','assembly','production','general manufacturing','automotive','aerospace','electronics','food beverage'],
  content: `Manufacturing lean focuses on flow from raw material to finished goods. Takt time drives every decision — it is the drumbeat of the operation. Setup reduction (SMED) unlocks flexibility. OEE tracks the three losses: availability (unplanned stops), performance (speed loss), and quality (defects). 5S creates the foundation — a clean, organised, standard workplace is the precondition for every other improvement. Autonomous maintenance puts operators in charge of basic care. Standard work is the current best method, always being improved. Line balancing ensures no operator is overloaded or idle relative to takt.`
},
{
  id: 'lean_professional_services',
  section: 'Lean in Professional Services (Law, Consulting, Accounting, Architecture)',
  tags: ['law firm','consulting','accounting','audit','architecture','engineering consulting','professional services','knowledge work'],
  content: `Professional services translate lean perfectly. The product is a deliverable (contract, report, design, advice). Value is added when the professional is applying expertise toward the client's outcome. Waiting waste dominates — waiting for client input, partner review, regulatory approval, or information. Rework waste is the silent killer — revision cycles add 40-60% to total effort in many firms. Takt time = available billable hours / client demand. VSM maps the matter/engagement lifecycle from instruction to delivery. Standard work in professional services is templates, checklists, and defined review stages. Kanban boards for work in progress limit multitasking and make bottlenecks visible.`
},
{
  id: 'lean_software_tech',
  section: 'Lean in Software Development & IT Operations',
  tags: ['software development','it operations','cybersecurity','DevOps','agile','tech','code review','deployment'],
  content: `Software development waste: partially done work (inventory), extra features (overproduction), relearning (motion), handoffs (transportation), defects (bugs requiring rework), task switching (waiting). Cycle time in software = time from work started to value delivered to users. Lead time includes queue time before work starts. WIP limits prevent teams from starting more than they can finish. Code review queues are the most common bottleneck — visible on Kanban boards. Definition of Done is the standard work equivalent. CI/CD pipelines reduce batch size and deployment risk. Retrospectives are the kaizen equivalent. Incident response (IT/cybersecurity) maps as a VSM: detection → triage → containment → resolution → post-mortem.`
},
{
  id: 'lean_retail_ecommerce',
  section: 'Lean in Retail, E-Commerce & Grocery',
  tags: ['retail','e-commerce','grocery','store operations','fulfilment','warehouse','order picking'],
  content: `Retail lean targets: shrinkage (defect waste), stockouts (waiting waste), overstocking (inventory waste), and excessive associate motion (motion waste). In e-commerce fulfilment, pick-pack-ship is the value stream. Pick accuracy and units-per-hour are the primary metrics. Top-50 SKU slotting at prime pick locations reduces motion. Kanban for replenishment prevents stockouts without overstocking. Grocery: scan-based trading and vendor-managed inventory are pull systems. Store lean: shelf availability, checkout wait time (takt = customers per hour / checkout lanes), and receiving dock flow. 5S transforms the backroom and reduces the time staff spend searching for product.`
},
{
  id: 'lean_logistics_freight',
  section: 'Lean in Logistics, Freight & Postal Operations',
  tags: ['logistics','freight','trucking','postal','parcel','delivery','3PL','warehousing','rail','port','maritime'],
  content: `Logistics lean targets lead time from order to delivery. The value stream spans: order receipt → warehouse pick → load → transit → delivery → proof of delivery. Waiting waste: dwell time at loading docks, driver wait at shipper, customs delays. Motion waste: inefficient route sequencing. Overproduction: running partial loads because of poor demand aggregation. Rail and port operations use takt to schedule berth utilisation and train slots. Container dwell time at ports is the primary waste metric — measured in days. 5S in the warehouse is the foundation. Milk-run delivery routes reduce inventory at receiving facilities. Standardised trailer loading reduces damage defects.`
},
{
  id: 'lean_hospitality_food_service',
  section: 'Lean in Hospitality, Restaurants & Food Service',
  tags: ['restaurant','hotel','hospitality','food service','kitchen','front of house','catering'],
  content: `Restaurant lean: the kitchen is a production cell. Takt time = covers per service / available preparation time. Waiting waste dominates: tables waiting to be turned, food sitting at the pass, guests waiting for bills. Motion waste: poorly organised mise en place forces cooks to reach and walk mid-service. Standard work in the kitchen is the recipe and prep list executed in the correct sequence. Hotel lean: housekeeping room turnaround is a SMED problem — every minute of turn time is capacity. Front desk check-in is a value stream. Kaizen events in hospitality typically focus on checklist compliance, not tool repositioning.`
},
{
  id: 'lean_financial_services',
  section: 'Lean in Financial Services (Banking, Insurance, Investment)',
  tags: ['retail banking','insurance','investment management','financial services','claims','loan processing'],
  content: `Financial services lean targets transaction processing cycle time. Loan approval, claims processing, and trade settlement share the same waste profile: waiting for approvals (waiting waste), multiple data entry (motion waste), rework from incomplete applications (defect waste), and over-checking by multiple reviewers (overprocessing waste). Takt = applications per day / available processing hours. Error-proofing (poka-yoke) in financial services: mandatory fields, validation rules, digital forms that prevent bad data entry. Kanban: claims queue boards make WIP visible and prevent batch processing. Standard work for insurance adjusters dramatically reduces cycle time variation.`
},
{
  id: 'lean_public_sector',
  section: 'Lean in Government, Emergency Services & Public Sector',
  tags: ['government','permit','licensing','fire rescue','police','military','public sector','emergency response'],
  content: `Public sector lean targets citizen/resident service cycle time. Government permitting: value stream from application to decision. Waiting waste is endemic — applications sit in queues between departments. Standard work for reviewers reduces variation. Emergency services lean: Fire & Rescue targets response time from call to on-scene. Dispatch protocol standardisation and apparatus positioning are the primary levers. Police: crime investigation VSM from report to charge. Military equipment readiness: preventive maintenance cycles, MTTR (mean time to repair), and parts availability are the KPIs. Kaizen in public sector requires framing improvement as service improvement to citizens, not cost reduction.`
},
{
  id: 'lean_agriculture',
  section: 'Lean in Agriculture, Farming & Aquaculture',
  tags: ['farming','crop production','aquaculture','agriculture','harvest'],
  content: `Agriculture lean: the value stream runs from field preparation through harvest to market. Waiting waste is structural (crop growth time) but the surrounding processes — planting, irrigation, harvest logistics, and post-harvest processing — are highly improvable. SMED applies to harvest equipment changeover between crops. 5S in machinery sheds and packing sheds reduces defects and downtime. Aquaculture: the value stream is spawn to harvest. Feed conversion ratio is the primary efficiency metric. Mortality rate is the defect metric. Biosecurity protocols are standard work with zero tolerance for deviation. Batch tracking and water quality monitoring are poka-yoke equivalents.`
},
{
  id: 'lean_media_creative',
  section: 'Lean in Media, Creative, Publishing & Entertainment',
  tags: ['film','tv','music production','video games','publishing','graphic design','digital marketing','creative'],
  content: `Creative industry lean: the value stream ends at published/delivered/released work. Revision cycles are rework waste and are the dominant source of lead time. Scope creep is overproduction. Brief clarity at the start of a project is the poka-yoke — incomplete briefs generate near-certain rework. Film/TV production VSM: script → pre-production → shoot → edit → delivery. Setup (location, lighting, equipment) is changeover time — SMED principles apply. Publishing: manuscript to print. Video game development: feature → build → test → release cycle. Kanban boards for sprint work are universal across creative industries. Daily standups are the andon equivalent.`
},
{
  id: 'lean_hr_staffing',
  section: 'Lean in HR, Recruitment & Staffing',
  tags: ['human resources','recruitment','onboarding','hr','staffing agency'],
  content: `Recruitment lean: value stream from role requisition to candidate start date. Time-to-fill is the lead time metric. Interview scheduling is frequently a waiting waste bottleneck — automated scheduling tools eliminate it. Rework waste: candidates dropped after final stage because role requirements were unclear at the start. Standard work: structured interview guides, consistent scoring rubrics, defined offer approval levels. Onboarding: time to productivity is the metric. Checklist-driven onboarding with defined Day 1/Week 1/Month 1 deliverables is standard work. Staffing agencies: VSM from client order to placed candidate. Defect = poor placement (early departure or client complaint).`
},
{
  id: 'lean_education_training',
  section: 'Lean in Education, Training & L&D',
  tags: ['education','k12','higher education','corporate training','learning development','university','academic'],
  content: `Education lean: the value stream produces learning outcomes and qualifications. Student throughput (enrolment to graduation) is the lead time metric. Dropout is the defect metric. Waiting waste: enrolment queues, financial aid delays, advisor unavailability. Standard work in education: lesson plans, assessment rubrics, onboarding checklists. L&D: training programme lead time from identified need to certified competency. 30% pre-programme dropout is a common waste — automated scheduling and reminders reduce it. E-learning completion rates below 70% indicate design problems, not learner problems. Kirkpatrick Level 4 (business impact) measurement is the equivalent of measuring actual defect reduction after a quality intervention.`
},
{
  id: 'lean_nonprofit_social',
  section: 'Lean in Nonprofit, Social Care & Healthcare Adjacent',
  tags: ['nonprofit','social care','beneficiary services','charity','community services'],
  content: `Nonprofit lean: resources are scarce by definition — every waste matters more. The value stream runs from referral or need identification to service delivery and outcome. Waiting waste: long waits for assessment, approval, or caseworker capacity. Defect waste: incomplete referral forms requiring re-contact. Standard work for caseworkers ensures consistent quality regardless of experience level. Triage models (low complexity vs. high complexity pathways) are the kanban equivalent — right resource to right need. Outcome measurement is the quality metric. Overhead reduction through process improvement is more sustainable than budget cuts.`
},
{
  id: 'lean_energy_utilities',
  section: 'Lean in Power Generation, Oil & Gas & Utilities',
  tags: ['power generation','oil gas','utilities','energy','drilling','maintenance'],
  content: `Energy sector lean: planned vs unplanned maintenance is the primary OEE lever. Planned shutdowns follow SMED principles — minimise duration through pre-staged materials and parallel work sequences. Oil & gas: NPT (non-productive time) is the waste metric. Stuck pipe, equipment failure, and waiting on decisions are the top NPT causes. Root cause analysis (5 Why and fishbone) on each NPT event builds a pattern that drives PM procedure updates. Power generation: forced outage rate and heat rate efficiency are the KPIs. Planned outage management is a project VSM. TPM in power stations: operators own the first-line checks on rotating equipment.`
},
{
  id: 'lean_sports_fitness',
  section: 'Lean in Sports, Fitness & Live Events',
  tags: ['professional sports','sports team','sports venue','fitness clubs','live events','event management'],
  content: `Sports operations lean: athlete performance support is a production process — training stimulus, recovery, medical clearance, match-day preparation. Bottlenecks appear as athlete unavailability (injury) and data latency (delayed GPS/biometric feedback). Fitness clubs: member check-in, class scheduling, and equipment availability follow service lean principles. Retention rate is the quality metric. Live events: production VSM from brief to event delivery. Technical rehearsal is the changeover. Defects = technical failures during live performance. Sports venue: fan experience VSM from car park entry to seat to concession to exit — queue time at each point is the waste. Takt = spectators / available flow paths.`
},

)

// Update industrySpecific map in buildRelevantKnowledge to cover remaining industries

// ── Metal Finishing industry knowledge ────────────────────────────────────────
KNOWLEDGE_CHUNKS.push({
  id: 'lean_metal_finishing',
  section: 'Lean in Metal Finishing & Surface Treatment',
  tags: ['metal finishing','surface treatment','electroplating','anodizing','powder coating','tank line','throughput','job shop','plating','chemical treatment'],
  content: `Metal finishing is a job shop / batch process. Terminology: product = job (the part being finished); customer = end customer or OEM; value stream = order receipt to shipment; cycle time = stage time in each tank or process step; takt time = required throughput rate (jobs per hour or shift to meet demand); defect = reject or strip-and-reprocess; gemba = tank line / finishing floor.

Value-added stages: active process steps where chemistry or mechanical action transforms the surface — pre-treatment (alkaline clean, acid etch), electroplating or coating, conversion coating, sealing. Non-value-added: queue time between tanks, manual handling and racking, inspection hold time, waiting for chemistry lab results.

Key waste types in metal finishing:
1. WAITING — jobs queuing between stages. Most lead time is wait time. Root cause: imbalanced tank capacity vs actual job mix.
2. DEFECTS — rejects requiring strip and re-process. High cost: chemistry consumed twice, tank capacity consumed twice. Root causes: chemistry out of spec, rack contact failure, contamination, incorrect amperage or time.
3. TRANSPORTATION — manual job movement between tanks. Overhead crane and conveyor lines reduce this.
4. OVERPROCESSING — longer tank times than specification requires. Occurs when operators lack real-time chemistry data.
5. WAITING (chemistry) — waiting for lab analysis before starting jobs. Inline monitoring eliminates this wait.

Throughput model: Total capacity = (tank time per job × jobs per rack) / number of racks running. Bottleneck = tank with highest utilisation vs takt. Takt time = daily demand in jobs / available shift time in minutes.

SMED in metal finishing applies to: rack changeover between job types, chemistry changeover between specifications, anode change, filter changes. Target: all changeovers under 10 minutes.

Key process failure modes: anode passivation, bath contamination from tramp metals, pH and temperature drift, current density variation across rack, rack contact resistance. Each should appear in the Fishbone for any quality problem.`
})

