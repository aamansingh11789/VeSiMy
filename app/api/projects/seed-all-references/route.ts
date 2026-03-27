// @ts-nocheck
// ── app/api/projects/seed-all-references/route.ts ─────────────────────────────
// Seeds all 5 industry reference projects directly via Supabase.
// No internal HTTP calls — runs entirely server-side.
// Idempotent per project. Returns manufacturing project ID to navigate to.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const uid = user.id
    const seeded: string[] = []
    const existing: string[] = []
    let primaryId: string | null = null

    // ── Helper: check if project exists by name ───────────────────────────────
    async function exists(name: string): Promise<string | null> {
      const { data } = await supabase.from('projects').select('id')
        .eq('user_id', uid).eq('name', name).maybeSingle()
      return data?.id || null
    }

    // ── Helper: create a project ──────────────────────────────────────────────
    async function createProject(fields: Record<string, any>): Promise<string> {
      const { data, error } = await supabase.from('projects')
        .insert({ user_id: uid, status: 'active', state: 'current', ...fields })
        .select().single()
      if (error) throw error
      return data.id
    }

    // ── Helper: create a step ─────────────────────────────────────────────────
    async function step(pid: string, pos: number, fields: Record<string, any>) {
      const { data, error } = await supabase.from('steps')
        .insert({ project_id: pid, user_id: uid, position: pos, is_main_flow: true, ...fields })
        .select().single()
      if (error) throw error
      return data
    }

    // ── Helper: insert tool data ──────────────────────────────────────────────
    async function tool(stepId: string, pid: string, toolName: string, data: any) {
      const { error } = await supabase.from('tool_data').insert({
        step_id: stepId, project_id: pid, user_id: uid,
        tool: toolName, data,
        saved_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      })
      if (error) console.error(`[seed-all] tool_data (${toolName}):`, error.message)
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 1. MANUFACTURING — seed-reference handles this one (it's the richest)
    // ══════════════════════════════════════════════════════════════════════════
    const mfgName = 'Reference — Automotive Seat Assembly'
    const mfgId = await exists(mfgName)
    if (mfgId) {
      existing.push('Manufacturing')
      primaryId = mfgId
    } else {
      // Call the dedicated seed-reference route logic inline via its own API
      // — or just create a lightweight version of the key steps
      const pid = await createProject({
        name: mfgName,
        description: 'Fully-built reference project. Every tool populated. 6 main steps, 2 branches, time studies, fishbone, 5 Why, waste ID, kaizen events, improvement goals.',
        industry: 'Automotive', customer: 'OEM Assembly Plant',
      })
      primaryId = pid
      const s1 = await step(pid, 0, { name: 'Material Staging', department: 'Materials', operators: 1, cycle_time: 45, wait_time: 300, wip: 12, flow_type: 'push', uptime: 100, defect_rate: 0, notes: 'NNVA. Operator walks 40m to warehouse each cycle — motion waste.' })
      const s2 = await step(pid, 1, { name: 'Frame Sub-Assembly', department: 'Sub-Assembly', operators: 2, cycle_time: 98, wait_time: 60, wip: 6, flow_type: 'push', uptime: 92, defect_rate: 1.2, notes: 'VA. Consistent CT. 6s NVA: operator reaches for torque wrench not at point of use.' })
      const s3 = await step(pid, 2, { name: 'Foam & Fabric Install', department: 'Trim', operators: 2, cycle_time: 145, wait_time: 90, wip: 8, flow_type: 'push', uptime: 88, defect_rate: 2.1, notes: 'VA — BOTTLENECK. CT 145s exceeds Takt 120s. 16s NVA walk to foam rack. KZ-001 in progress.' })
      const s4 = await step(pid, 3, { name: 'Electrical Integration', department: 'Electrical', operators: 1, cycle_time: 88, wait_time: 45, wip: 4, flow_type: 'fifo', uptime: 95, defect_rate: 0.8, notes: 'VA. Stable process.' })
      const s5 = await step(pid, 4, { name: 'Final QC & Audit', department: 'Quality', operators: 1, cycle_time: 72, wait_time: 120, wip: 5, flow_type: 'push', uptime: 100, defect_rate: 0.3, notes: 'NNVA. In-station audit per IATF 16949.' })
      const s6 = await step(pid, 5, { name: 'Packing & Dispatch', department: 'Logistics', operators: 1, cycle_time: 55, wait_time: 180, wip: 15, flow_type: 'push', uptime: 100, defect_rate: 0, notes: 'NNVA. High WIP: timed OEM collection every 2 hrs.' })
      await tool(s3.id, pid, 'stopwatch', { baseline: 160, target: 110, mean: 145, laps: [142,148,145,150,143,146,144,149,145,147], excluded: [], notes: 'BOTTLENECK. CT 145s > Takt 120s. 16s NVA walk identified.' })
      await tool(s3.id, pid, 'ishikawa', { problem: 'Foam & Fabric CT 145s exceeds Takt 120s', framework: '6m', causes: { Machine: ['No powered assist', 'Jig loosens'], Method: ['Foam rack 4m away (16s NVA)', 'No standard work sheet'], Material: ['Fabric cover too tight', 'Foam density varies'], Manpower: ['New operators 20% slower'], Measurement: ['No in-process CT tracking'], 'Mother Nature': ['Cold temp increases foam stiffness'] } })
      await tool(s3.id, pid, 'fivewhy', { problem: 'Foam & Fabric CT 145s is 25s over takt', whys: [{ q: 'Why is CT 25s over takt?', a: 'Operator walks 4m to foam rack (16s NVA) every cycle.' }, { q: 'Why is the foam rack 4m away?', a: 'Line laid out 3 years ago. Never updated.' }, { q: 'Why was layout never updated?', a: 'No formal process to review line-side storage when takt changes.' }, { q: 'Why no formal review?', a: 'Manufacturing Engineering not part of takt-time review cycle.' }, { q: 'Why is MFG Eng excluded?', a: 'ROOT CAUSE: PFMEA gate does not require material flow audit on takt revision.' }], rootCause: 'PFMEA gate does not mandate material flow audit when takt changes.', countermeasure: '1. Update PFMEA procedure. 2. Relocate foam rack within 0.5m immediately.', owner: 'Manufacturing Engineering', dueDate: '2026-04-15' })
      await tool(s3.id, pid, 'waste', { wastes: { Motion: 'Operator walks 4m to foam rack every cycle = 16s NVA', Waiting: 'Operator waits 13s for partner each cycle', Defects: '2.1% defect rate — fabric mis-clip causes rework' }, notes: 'Priority: foam rack relocation first.' })
      await tool(s3.id, pid, 'kaizen', { items: [{ id: 'kz001', kzId: 'KZ-001', title: 'Relocate foam rack to point of use', description: 'Move foam rack from 4m to within 0.5m. Shadow board. Expected saving: 16s NVA.', category: 'Productivity', priority: 'critical', status: 'in-progress', owner: 'J. Patel', dueDate: '2026-04-01', actions: ['Mark new location', 'Arrange relocation', 'Update standard work', 'Before/after time study'], created: Date.now() - 604800000 }, { id: 'kz002', kzId: 'KZ-002', title: 'Poka-yoke fabric clip alignment jig', description: 'Design guide pins to locate clips automatically. Eliminates 13s mutual check.', category: 'Quality', priority: 'high', status: 'open', owner: 'S. Ahmed', dueDate: '2026-05-01', actions: ['Raise ECR', 'Prototype guide pins', '30-cycle trial'], created: Date.now() - 259200000 }] })
      await tool(s3.id, pid, 'improvement', { goals: [{ id: 'g1', metric: 'Cycle Time', baseline: 145, target: 110, actual: null, unit: 'seconds', status: 'in-progress', owner: 'J. Patel', dueDate: '2026-05-01', notes: 'After foam rack relocation + poka-yoke' }] })
      seeded.push('Manufacturing')
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. HEALTHCARE
    // ══════════════════════════════════════════════════════════════════════════
    const hcName = 'Demo — Urgent Care Patient Flow'
    const hcId = await exists(hcName)
    if (hcId) { existing.push('Healthcare') } else {
      const pid = await createProject({ name: hcName, description: 'Urgent care patient flow from arrival to discharge. 7 steps, 3.2hr lead time, bottleneck at Treatment. All CI tools populated.', industry: 'Healthcare', customer: 'Patient' })
      const s1 = await step(pid, 0, { name: 'Patient Arrival & Check-In', department: 'Front Desk', operators: 1, cycle_time: 8, wait_time: 12, wip: 6, flow_type: 'push', uptime: 100, defect_rate: 3, notes: 'NNVA. Paper form duplicates EHR entry. 3% incorrect registrations cause billing rework.' })
      const s2 = await step(pid, 1, { name: 'Triage & Acuity Assessment', department: 'Nursing', operators: 1, cycle_time: 6, wait_time: 18, wip: 5, flow_type: 'push', uptime: 100, defect_rate: 2, notes: 'VA. ESI Level classification. 18-min queue on ambulance surge.' })
      const s3 = await step(pid, 2, { name: 'Vitals & Nursing Assessment', department: 'Nursing', operators: 1, cycle_time: 12, wait_time: 25, wip: 8, flow_type: 'push', uptime: 100, defect_rate: 1, notes: 'VA. 25-min wait for room assignment — #1 patient satisfaction driver.' })
      const s4 = await step(pid, 3, { name: 'Physician Assessment & Orders', department: 'Medical', operators: 1, cycle_time: 18, wait_time: 35, wip: 10, flow_type: 'push', uptime: 100, defect_rate: 5, notes: 'VA. 35-min wait — highest dissatisfaction source. 5% orders require clarification.' })
      const s5 = await step(pid, 4, { name: 'Diagnostics — Lab & Imaging', department: 'Diagnostics', operators: 2, cycle_time: 45, wait_time: 30, wip: 12, flow_type: 'push', uptime: 92, defect_rate: 4, notes: 'NNVA. Lab 45 min avg. CT 60+ min. 4% repeat collection.' })
      const s6 = await step(pid, 5, { name: 'Treatment & Intervention', department: 'Medical / Nursing', operators: 2, cycle_time: 52, wait_time: 15, wip: 7, flow_type: 'push', uptime: 100, defect_rate: 6, notes: 'BOTTLENECK. Highest CT. 6% require additional intervention. Limited procedure rooms.' })
      const s7 = await step(pid, 6, { name: 'Discharge & Documentation', department: 'Medical / Nursing', operators: 1, cycle_time: 18, wait_time: 22, wip: 9, flow_type: 'push', uptime: 100, defect_rate: 8, notes: 'NNVA. 8% return within 72hrs. 22-min wait for physician signature.' })
      await tool(s6.id, pid, 'ishikawa', { problem: 'Treatment CT 52 min exceeds 45-min takt — 3.2hr door-to-discharge vs 2hr target', framework: '6m', causes: { Machine: ['Only 2 procedure rooms for 8-bed dept', 'IV pump shortage at peak'], Method: ['No concurrent discharge documentation', 'No standard treatment protocol top-10 diagnoses'], Material: ['Medication not at point of care — 3 trips to med room per patient'], Manpower: ['1 physician covering 8 beds at peak', '1:4 nurse ratio during surge'], Measurement: ['Door-to-discharge tracked but not broken down by step'], 'Mother Nature': ['Mon/Fri 4-8pm surge doubles volume', 'Winter respiratory season complexity'] } })
      await tool(s6.id, pid, 'fivewhy', { problem: 'Door-to-discharge 3.2 hrs — 1.2 hrs over 2-hr target', whys: [{ q: 'Why 3.2 hr door-to-discharge?', a: 'Physician wait 35 min and treatment 52 min both exceed takt.' }, { q: 'Why does physician wait average 35 min?', a: 'One physician covers 8 beds. 3+ simultaneous arrivals create immediate queue.' }, { q: 'Why is coverage not scaled to demand?', a: 'Staffing on fixed daily model — not matched to hourly demand pattern.' }, { q: 'Why not matched to demand?', a: 'Demand pattern never formally analysed and presented with data to administration.' }, { q: 'Why no demand analysis?', a: 'ROOT CAUSE: No CI structure in the department. Staff observe the problem daily but no mechanism to escalate through data.' }], rootCause: 'No CI structure — staff observe the bottleneck daily but have no mechanism to escalate through data.', countermeasure: '1. Map hourly arrivals for 90 days. 2. Add physician Mon/Fri 4-8pm. 3. Standardise top-10 diagnosis protocols. 4. Concurrent discharge documentation.', owner: 'Medical Director', dueDate: '2026-05-31' })
      await tool(s6.id, pid, 'waste', { wastes: { Waiting: 'Patients wait 35 min for physician + 30 min for labs = 65 min pure queue', Motion: 'Nurses make avg 3 trips to medication room per patient', Defects: '6% of treatments require additional intervention', 'Over-processing': 'Paper forms re-entered into EHR — duplicate data entry' }, notes: 'Quick win: point-of-care medication supply eliminates 3 trips per patient.' })
      await tool(s6.id, pid, 'kaizen', { items: [{ id: 'kz001', kzId: 'KZ-001', title: 'Point-of-care medication supply', description: 'Move top 20 medications to secured dispensing cabinet in treatment area. Eliminates avg 3 med room trips per patient. 8 min nursing time saving per patient.', category: 'Productivity', priority: 'critical', status: 'in-progress', owner: 'Charge Nurse / Pharmacy', dueDate: '2026-04-15', actions: ['Identify top 20 meds by volume', 'Procure Pyxis unit', 'Install in treatment bay 3', 'Update protocol'], created: Date.now() - 604800000 }, { id: 'kz002', kzId: 'KZ-002', title: 'Concurrent discharge documentation during treatment', description: 'Physician completes discharge plan while patient in treatment. Eliminates 22-min signature wait.', category: 'Productivity', priority: 'high', status: 'open', owner: 'Medical Director', dueDate: '2026-05-01', actions: ['Redesign EHR discharge workflow', 'Pilot with 2 physicians 2 weeks', 'Measure wait time before/after'], created: Date.now() - 259200000 }, { id: 'kz003', kzId: 'KZ-003', title: 'Demand-matched physician schedule — Mon/Fri surge', description: '90-day data shows consistent Mon/Fri 4-8pm surge. Adding 1 physician for these windows reduces wait from 35 to under 15 min.', category: 'Productivity', priority: 'high', status: 'open', owner: 'Operations Manager', dueDate: '2026-06-01', actions: ['Pull 90-day hourly arrival data', 'Build cost-benefit for admin', 'Pilot 4-week schedule change'], created: Date.now() - 172800000 }] })
      await tool(s6.id, pid, 'improvement', { goals: [{ id: 'g1', metric: 'Door-to-Discharge Time', baseline: 192, target: 120, actual: null, unit: 'minutes', status: 'in-progress', owner: 'Medical Director', dueDate: '2026-09-01', notes: 'KZ-001 + KZ-002 + KZ-003 combined target' }] })
      seeded.push('Healthcare')
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. REAL ESTATE
    // ══════════════════════════════════════════════════════════════════════════
    const reName = 'Demo — Real Estate Transaction Flow'
    const reId = await exists(reName)
    if (reId) { existing.push('Real Estate') } else {
      const pid = await createProject({ name: reName, description: 'Full value stream from lead inquiry to closing. 7 steps, 45-day lead time, bottleneck at Financing & Underwriting.', industry: 'Real Estate', customer: 'Home Buyer' })
      await step(pid, 0, { name: 'Lead Inquiry & Initial Response', department: 'Sales', operators: 1, cycle_time: 25, wait_time: 480, wip: 12, flow_type: 'push', uptime: 100, defect_rate: 0, notes: 'NNVA. Avg 8hr response time — best practice is under 5 min. Response time is #1 conversion driver.' })
      await step(pid, 1, { name: 'Qualify & Buyer Consultation', department: 'Sales', operators: 1, cycle_time: 90, wait_time: 2880, wip: 6, flow_type: 'push', uptime: 100, defect_rate: 15, notes: 'VA. 15% of leads are unqualified — pure waste if not screened earlier.' })
      await step(pid, 2, { name: 'Property Search & Showings', department: 'Sales', operators: 1, cycle_time: 480, wait_time: 1440, wip: 8, flow_type: 'push', uptime: 100, defect_rate: 0, notes: 'VA. Average buyer views 10 properties.' })
      await step(pid, 3, { name: 'Offer Preparation & Negotiation', department: 'Sales', operators: 1, cycle_time: 120, wait_time: 2880, wip: 4, flow_type: 'push', uptime: 100, defect_rate: 35, notes: 'VA. 35% of first offers rejected — rework loop. Avg 1.8 rounds of negotiation.' })
      await step(pid, 4, { name: 'Inspection & Appraisal', department: 'Operations', operators: 1, cycle_time: 240, wait_time: 7200, wip: 3, flow_type: 'push', uptime: 100, defect_rate: 22, notes: 'NNVA. 5-day scheduling wait. 22% of inspections trigger renegotiation.' })
      const s6 = await step(pid, 5, { name: 'Financing & Underwriting', department: 'Lender Liaison', operators: 1, cycle_time: 600, wait_time: 14400, wip: 5, flow_type: 'push', uptime: 100, defect_rate: 28, notes: 'BOTTLENECK. 10-day lender wait. 28% of files kicked back for missing docs.' })
      await step(pid, 6, { name: 'Closing & Handover', department: 'Operations', operators: 1, cycle_time: 180, wait_time: 2880, wip: 3, flow_type: 'push', uptime: 100, defect_rate: 5, notes: 'NNVA. 5% fall-through at closing due to last-minute financing issues.' })
      await tool(s6.id, pid, 'fivewhy', { problem: '28% of financing files kicked back by lender — adds 3-5 days per transaction', whys: [{ q: 'Why 28% of files kicked back?', a: 'Files submitted before all required documents collected and verified.' }, { q: 'Why before complete?', a: 'No standardised pre-submission checklist. Each agent assembles files differently.' }, { q: 'Why no standardised checklist?', a: 'Requirements vary by loan type — no master checklist built per type.' }, { q: 'Why no master checklist?', a: 'No formal process owner for transaction coordination workflows.' }, { q: 'Why no process owner?', a: 'ROOT CAUSE: Brokerage treats every transaction as one-off agent work. No standard work exists for the TC role.' }], rootCause: 'No standard work or loan-type document checklist for transaction coordinators.', countermeasure: '1. Create loan-type checklists. 2. Mandatory pre-submission review. 3. Assign TC role with defined SOP.', owner: 'Broker / Operations Manager', dueDate: '2026-04-30' })
      await tool(s6.id, pid, 'waste', { wastes: { Defects: '28% of files kicked back — document rework adds avg 3.5 days', Waiting: '10-day lender processing wait with zero queue visibility', 'Over-processing': 'Agent re-collects docs already submitted — no single file source of truth' }, notes: 'Primary target: eliminate 28% kickback rate through document standardisation.' })
      await tool(s6.id, pid, 'kaizen', { items: [{ id: 'kz001', kzId: 'KZ-001', title: 'Create loan-type document checklists', description: 'Build pre-submission checklists for conventional, FHA, VA, and jumbo loans. Target: kickback rate from 28% to under 5%.', category: 'Quality', priority: 'critical', status: 'in-progress', owner: 'Operations Manager', dueDate: '2026-04-15', actions: ['Interview top 3 lenders for requirements', 'Build checklist in transaction system', 'Train all agents', 'Track kickback rate weekly'], created: Date.now() - 604800000 }] })
      seeded.push('Real Estate')
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. CRAFT BREWERY
    // ══════════════════════════════════════════════════════════════════════════
    const brewName = 'Demo — Craft Brewery Batch Production'
    const brewId = await exists(brewName)
    if (brewId) { existing.push('Craft Brewery') } else {
      const pid = await createProject({ name: brewName, description: 'Full brewing value stream from grain delivery to packaged product. 8 steps, 21-day lead time, bottleneck at Fermentation.', industry: 'Food & Beverage', customer: 'Taproom & Wholesale' })
      await step(pid, 0, { name: 'Grain Receiving & Milling', department: 'Brew Floor', operators: 1, cycle_time: 90, wait_time: 1440, wip: 2, flow_type: 'push', uptime: 96, defect_rate: 1, notes: 'NNVA. Grain delivery twice weekly — creates batch release. Mill uptime 96%.' })
      await step(pid, 1, { name: 'Mashing & Lautering', department: 'Brew Floor', operators: 1, cycle_time: 120, wait_time: 30, wip: 1, flow_type: 'push', uptime: 99, defect_rate: 3, notes: 'VA. 3% batches have stuck sparge — adds 45 min rework. Rye and wheat grists most problematic.' })
      await step(pid, 2, { name: 'Boil & Hop Addition', department: 'Brew Floor', operators: 1, cycle_time: 75, wait_time: 15, wip: 1, flow_type: 'push', uptime: 100, defect_rate: 2, notes: 'VA. 60-min boil, 4 hop additions per recipe.' })
      await step(pid, 3, { name: 'Whirlpool, Chill & Transfer', department: 'Brew Floor', operators: 1, cycle_time: 45, wait_time: 10, wip: 1, flow_type: 'push', uptime: 98, defect_rate: 1, notes: 'VA. Chill to 68°F via plate chiller, transfer to fermenter.' })
      const s5 = await step(pid, 4, { name: 'Fermentation', department: 'Cellar', operators: 1, cycle_time: 8640, wait_time: 0, wip: 6, flow_type: 'push', uptime: 100, defect_rate: 4, notes: 'BOTTLENECK. 6-day average. Only 6 fermenters — hard capacity ceiling. 4% off-flavour rate.' })
      await step(pid, 5, { name: 'Conditioning & Dry Hopping', department: 'Cellar', operators: 1, cycle_time: 4320, wait_time: 0, wip: 4, flow_type: 'push', uptime: 100, defect_rate: 2, notes: 'VA. 3-day cold conditioning at 32°F.' })
      await step(pid, 6, { name: 'QC & Transfer to Bright Tank', department: 'Cellar / QC', operators: 1, cycle_time: 60, wait_time: 480, wip: 3, flow_type: 'push', uptime: 100, defect_rate: 5, notes: 'VA. Gravity, pH, dissolved oxygen, sensory panel.' })
      await step(pid, 7, { name: 'Packaging — Can, Keg & Bottle', department: 'Packaging', operators: 2, cycle_time: 240, wait_time: 60, wip: 2, flow_type: 'push', uptime: 88, defect_rate: 3, notes: 'NNVA. Canning line uptime 88% — seamer head issues cause 3% underfill.' })
      await tool(s5.id, pid, 'fivewhy', { problem: '3% of batches have stuck sparge — adds 45 min rework per batch', whys: [{ q: 'Why do batches get stuck sparge?', a: 'High-adjunct grain bills (rye, oats, wheat) create dense grain bed restricting wort flow.' }, { q: 'Why do high-adjunct bills restrict flow?', a: 'Rice hulls not added to these grists. Recipe sheet does not specify rice hull addition.' }, { q: 'Why no rice hulls on recipe?', a: 'Recipes were written for 3-barrel system. Equipment changed to 10-barrel but recipes never updated.' }, { q: 'Why were recipes not updated?', a: 'No formal recipe scale-up review process. Head brewer carried adjustment in memory only.' }, { q: 'Why not documented?', a: 'ROOT CAUSE: No recipe management system with equipment-specific parameters. Recipes in Google Docs with no version control.' }], rootCause: 'No recipe management system. High-adjunct adjustments exist only in head brewer memory — not in recipe.', countermeasure: '1. Implement Brewfather with equipment profiles. 2. Add rice hull requirement to all high-adjunct recipes immediately. 3. Create scale-up review checklist.', owner: 'Head Brewer', dueDate: '2026-04-15' })
      await tool(s5.id, pid, 'waste', { wastes: { Waiting: 'Fermenters fully occupied — new batches wait for tanks to free up', Defects: '4% of batches develop off-flavours — partial volume loss', 'Non-Utilisation': 'Cellarman monitoring fermentation manually — no automated alerts' }, notes: 'Fermenter capacity is the constraint. Every other improvement has limited impact until tank count increases or fermentation time decreases.' })
      await tool(s5.id, pid, 'kaizen', { items: [{ id: 'kz001', kzId: 'KZ-001', title: 'Canning line seamer rebuild', description: 'Seamer head worn — 3% underfill. Full rebuild with quick-change format kit. Uptime target: 96%. Changeover from 60 min to 20 min.', category: 'Quality', priority: 'critical', status: 'in-progress', owner: 'Head Brewer / Maintenance', dueDate: '2026-04-01', actions: ['Order rebuild kit', 'Schedule 1-day shutdown', 'Calibrate and run 50-can test', 'Record fill weights across 200 cans'], created: Date.now() - 604800000 }, { id: 'kz002', kzId: 'KZ-002', title: 'Optimise fermentation schedule — staggered starts', description: 'Currently all fermenters start Mon/Thu. Staggering to Mon/Wed/Fri gains +0.5 batches/week without adding tanks.', category: 'Productivity', priority: 'high', status: 'open', owner: 'Head Brewer', dueDate: '2026-04-15', actions: ['Model batch schedule', 'Adjust brew day calendar', 'Trial 4-week staggered schedule', 'Measure actual throughput'], created: Date.now() - 259200000 }] })
      seeded.push('Craft Brewery')
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 5. WINERY
    // ══════════════════════════════════════════════════════════════════════════
    const wineName = 'Demo — Boutique Winery Production'
    const wineId = await exists(wineName)
    if (wineId) { existing.push('Winery') } else {
      const pid = await createProject({ name: wineName, description: '2,000-case boutique winery. 8 steps, 18-month lead time, bottleneck at Barrel Ageing. 6% barrel defect rate. DTC demand growing 18% annually.', industry: 'Food & Beverage', customer: 'DTC Wine Club & Wholesale' })
      await step(pid, 0, { name: 'Harvest & Vineyard Receiving', department: 'Cellar / Vineyard', operators: 4, cycle_time: 480, wait_time: 24, wip: 3, flow_type: 'push', uptime: 100, defect_rate: 8, notes: 'VA. 8% of fruit rejected (sun damage, under-ripe). Night harvest adds quality.' })
      await step(pid, 1, { name: 'Destemming, Crush & SO₂ Addition', department: 'Cellar', operators: 2, cycle_time: 120, wait_time: 2, wip: 2, flow_type: 'push', uptime: 97, defect_rate: 2, notes: 'VA. 2% of lots require re-press due to incorrect SO₂ dosage.' })
      await step(pid, 2, { name: 'Primary Alcoholic Fermentation', department: 'Cellar', operators: 1, cycle_time: 480, wait_time: 0, wip: 8, flow_type: 'push', uptime: 100, defect_rate: 5, notes: 'VA. 7-20 days depending on yeast strain. Pump-overs 2x daily. 5% develop H₂S.' })
      await step(pid, 3, { name: 'Pressing & Free-Run Separation', department: 'Cellar', operators: 2, cycle_time: 180, wait_time: 12, wip: 4, flow_type: 'push', uptime: 95, defect_rate: 3, notes: 'VA. 3% of lots blended incorrectly — free-run and press wine mixed unintentionally.' })
      await step(pid, 4, { name: 'Malolactic Fermentation', department: 'Cellar', operators: 1, cycle_time: 1440, wait_time: 0, wip: 6, flow_type: 'push', uptime: 100, defect_rate: 8, notes: 'VA. 30-60 days for full ML completion. 8% of lots have incomplete ML at bottling.' })
      const s6 = await step(pid, 5, { name: 'Barrel Ageing & Topping', department: 'Cellar', operators: 1, cycle_time: 13140, wait_time: 0, wip: 80, flow_type: 'push', uptime: 100, defect_rate: 6, notes: 'BOTTLENECK. 12-18 months in French oak. 80 barrels at capacity. 6% develop TCA or high VA. Topping weekly — 4 hrs/week labour.' })
      await step(pid, 6, { name: 'Blending Trials, Fining & Filtration', department: 'Cellar / QC', operators: 2, cycle_time: 240, wait_time: 720, wip: 3, flow_type: 'push', uptime: 100, defect_rate: 4, notes: 'VA. 3-4 blending trial sessions per vintage. 4% of final blends require reformulation.' })
      await step(pid, 7, { name: 'Bottling, Labelling & Warehousing', department: 'Bottling', operators: 3, cycle_time: 360, wait_time: 48, wip: 2, flow_type: 'push', uptime: 90, defect_rate: 4, notes: 'NNVA. Mobile bottling truck scheduled 4x/year. 4% label placement errors.' })
      await tool(s6.id, pid, 'fivewhy', { problem: '6% of barrels develop TCA or excessive volatile acidity — avg $4,200 loss per barrel', whys: [{ q: 'Why do 6% develop TCA or high VA?', a: 'TCA from cork contact. High VA from insufficient topping — oxygen exposure.' }, { q: 'Why is topping insufficient?', a: 'Topping schedule managed from memory. No documented topping log. Back barrels missed for 3-4 weeks.' }, { q: 'Why no topping log?', a: 'No barrel tracking system. Each barrel identified by chalk marker only — no individual ID.' }, { q: 'Why no tracking system?', a: 'Winery grew from 400 to 2,000 cases without updating record-keeping practices.' }, { q: 'Why were practices not updated?', a: 'ROOT CAUSE: No formal operations review as the winery scaled. Production processes never reviewed for scalability.' }], rootCause: 'No individual barrel tracking. Topping done from memory — barrels in the back missed for weeks.', countermeasure: '1. Assign QR code to every barrel. 2. Weekly topping log with sign-off. 3. Monthly SO₂ and VA check per barrel. 4. Evaluate Diam cork for TCA-prone barrels.', owner: 'Winemaker / Operations', dueDate: '2026-05-31' })
      await tool(s6.id, pid, 'waste', { wastes: { Defects: '6% barrel defect rate — TCA and high VA. $1,200 barrel + $35/bottle wine = $4,200+ per barrel', 'Non-Utilisation': '4th-fill+ barrels contributing <5% flavour but occupying full capacity slot', Waiting: '18-month ageing creates 18-month cash flow gap' }, notes: 'Retire 4th-fill+ barrels to free premium capacity for 1st-fill French oak.' })
      await tool(s6.id, pid, 'kaizen', { items: [{ id: 'kz001', kzId: 'KZ-001', title: 'Individual barrel tracking — QR code + topping log', description: 'QR code on every barrel. Cellarman scans on each topping. Weekly report flags barrels not topped in 10+ days. Target: TCA/VA rate from 6% to under 1%.', category: 'Quality', priority: 'critical', status: 'in-progress', owner: 'Winemaker', dueDate: '2026-04-01', actions: ['Print QR codes, attach to all 80 barrels', 'Set up topping log', 'Train cellarman on scan protocol', 'First monthly VA and SO₂ check'], created: Date.now() - 604800000 }, { id: 'kz002', kzId: 'KZ-002', title: 'Retire 4th-fill+ barrels — reallocate to entry tier', description: '18 barrels (22%) are 4th fill or older. Contributing minimal flavour. Retire after current vintage, sell to spirits producers. Frees capacity for premium oak.', category: 'Productivity', priority: 'high', status: 'open', owner: 'Winemaker', dueDate: '2026-08-01', actions: ['Audit all barrels by fill count', 'Identify 4th fill+ group', 'List on barrel marketplace', 'Allocate replacement budget'], created: Date.now() - 259200000 }] })
      seeded.push('Winery')
    }

    // ── Done ──────────────────────────────────────────────────────────────────
    const allExisted = seeded.length === 0
    return NextResponse.json({
      id: primaryId,
      seeded,
      existing,
      already_exists: allExisted,
      message: allExisted
        ? 'All reference projects already in your dashboard'
        : `${seeded.length} reference project${seeded.length !== 1 ? 's' : ''} added: ${seeded.join(', ')}`,
    })

  } catch (err: any) {
    console.error('[seed-all-references]', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to seed reference projects' },
      { status: 500 }
    )
  }
}
