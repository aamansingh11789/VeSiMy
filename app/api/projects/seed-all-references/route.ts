// @ts-nocheck
// ── app/api/projects/seed-all-references/route.ts ─────────────────────────────
// Seeds reference projects for 18 major industries.
// Every project has: 5-8 steps, stopwatch, fishbone, 5 Why, waste ID,
// kaizen events, improvement goals, PDCA, and SMED (where applicable).
// Idempotent — skips any project that already exists.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 300  // Vercel max execution time (seconds)

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const uid = user.id
    const seeded: string[] = []
    const existing: string[] = []
    let primaryId: string | null = null

    async function exists(name: string): Promise<string | null> {
      const { data } = await supabase.from('projects').select('id')
        .eq('user_id', uid).eq('name', name).maybeSingle()
      return data?.id || null
    }

    async function proj(fields: Record<string, any>): Promise<string> {
      const { data, error } = await supabase.from('projects')
        .insert({ user_id: uid, status: 'active', state: 'current', ...fields })
        .select().single()
      if (error) throw error
      return data.id
    }

    async function stp(pid: string, pos: number, fields: Record<string, any>) {
      const { data, error } = await supabase.from('steps')
        .insert({ project_id: pid, user_id: uid, position: pos, is_main_flow: true, ...fields })
        .select().single()
      if (error) throw error
      return data
    }

    async function td(stepId: string, pid: string, toolName: string, data: any) {
      const { error } = await supabase.from('tool_data').insert({
        step_id: stepId, project_id: pid, user_id: uid,
        tool: toolName, data,
        saved_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      })
      if (error) console.error(`[seed] tool_data (${toolName}):`, error.message)
    }

    // ── Industry filter ──────────────────────────────────────────────────────
    // Pass { industryFilter: 'industry_id' } in POST body to seed only one industry.
    // Called from seed-industry-reference to avoid seeding all 62 projects.
    let allowedNames: Set<string> | null = null
    try {
      let reqBody: any = {}
      try { reqBody = await _request.clone().json() } catch { /* no body */ }
      if (reqBody?.industryFilter) {
        const { INDUSTRY_REFERENCE_NAMES } = (await import('@/lib/industry-reference-map')) as any
        const names: string[] = (INDUSTRY_REFERENCE_NAMES as any)[reqBody.industryFilter] || []
        if (names.length > 0) allowedNames = new Set<string>(names)
      }
    } catch { /* non-fatal */ }
    function shouldSeed(nm: string): boolean {
      return allowedNames === null || allowedNames.has(nm)
    }

    // ── Compact helper aliases for the second-half blocks ────────────────────
    const ex  = exists
    const pr  = proj
    const st  = stp

    // Generate realistic stopwatch laps around a mean value
    function laps(mean: number, count = 10): number[] {
      return Array.from({ length: count }, (_, i) => Math.round(mean * (0.93 + (i % 5) * 0.035)))
    }

    // Stopwatch tool data helper
    async function sw(stepId: string, pid: string, baseline: number, target: number, mean: number, lapArr: number[], notes: string) {
      await td(stepId, pid, 'stopwatch', { baseline, target, mean, laps: lapArr, notes })
    }

    // Ishikawa/fishbone helper
    async function ika(stepId: string, pid: string, problem: string, framework: string, causes: Record<string, string[]>) {
      await td(stepId, pid, 'ishikawa', { problem, framework, causes })
    }

    // Build a why step object
    function why(q: string, a: string) { return { q, a } }

    // Five why helper
    async function fw(stepId: string, pid: string, problem: string, whys: {q:string,a:string}[], rootCause: string, countermeasure: string, owner: string, dueDate: string) {
      await td(stepId, pid, 'fivewhy', { problem, whys, rootCause, countermeasure, owner, dueDate })
    }

    // Waste identification helper
    async function wa(stepId: string, pid: string, selected: string[], notes: Record<string, string>) {
      await td(stepId, pid, 'waste', { selected, notes })
    }

    // Build a kaizen item object
    function kzItem(kzId: string, title: string, description: string, category: string, priority: string, status: string, owner: string, dueDate: string, actions: string[]) {
      return { id: kzId.toLowerCase(), kzId, title, description, category, priority, status, owner, dueDate, actions }
    }

    // Kaizen helper
    async function kz(stepId: string, pid: string, items: ReturnType<typeof kzItem>[]) {
      await td(stepId, pid, 'kaizen', { items })
    }

    // Build an improvement goal object
    function goal(metric: string, baseline: string, target: string, unit: string, owner: string, dueDate: string) {
      return { id: `g-${metric.toLowerCase().replace(/\s+/g,'-')}`, metric, baseline: Number(baseline), target: Number(target), actual: null, unit, status: 'in-progress', owner, dueDate, notes: '' }
    }

    // Improvement goals helper
    async function im(stepId: string, pid: string, goals: ReturnType<typeof goal>[]) {
      await td(stepId, pid, 'improvement', { goals })
    }
    // ────────────────────────────────────────────────────────────────────────

    // ══════════════════════════════════════════════════════════════════════════
    // 1. AUTOMOTIVE MANUFACTURING — Seat Assembly Line
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Automotive Seat Assembly'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Automotive'); primaryId = ex } else {
        const pid = await proj({ name: nm, industry: 'automotive_manufacturing', customer: 'OEM Assembly Plant',
          description: 'Full seat assembly VSM. Bottleneck at Foam & Fabric. All 9 CI tools populated.' })
        primaryId = pid
        const s0 = await stp(pid, 0, { name: 'Material Staging', department: 'Materials', operators: 1, cycle_time: 45, wait_time: 300, wip: 12, uptime: 100, defect_rate: 0 })
        const s1 = await stp(pid, 1, { name: 'Frame Sub-Assembly', department: 'Sub-Assembly', operators: 2, cycle_time: 98, wait_time: 60, wip: 6, uptime: 92, defect_rate: 1.2 })
        const s2 = await stp(pid, 2, { name: 'Foam & Fabric Install', department: 'Trim', operators: 2, cycle_time: 145, wait_time: 90, wip: 8, uptime: 88, defect_rate: 2.1, notes: 'BOTTLENECK — CT 145s exceeds Takt 120s' })
        const s3 = await stp(pid, 3, { name: 'Electrical Integration', department: 'Electrical', operators: 1, cycle_time: 88, wait_time: 45, wip: 4, uptime: 95, defect_rate: 0.8 })
        const s4 = await stp(pid, 4, { name: 'Final QC Audit', department: 'Quality', operators: 1, cycle_time: 72, wait_time: 120, wip: 5, uptime: 100, defect_rate: 0.3 })
        const s5 = await stp(pid, 5, { name: 'Pack & Dispatch', department: 'Logistics', operators: 1, cycle_time: 55, wait_time: 180, wip: 15, uptime: 100, defect_rate: 0 })
        await td(s2.id, pid, 'stopwatch', { baseline: 160, target: 110, mean: 145, laps: [142,148,145,150,143,146,144,149,145,147], notes: 'BOTTLENECK. CT 145s > Takt 120s. 16s NVA walk to foam rack.' })
        await td(s2.id, pid, 'ishikawa', { problem: 'Foam & Fabric CT 145s exceeds Takt 120s', framework: '6M Manufacturing', causes: { Machine: ['No powered assist fixture','Jig loosens mid-cycle'], Method: ['Foam rack 4m from station (16s NVA)','No standard work posted'], Material: ['Fabric cover too tight on cold mornings','Foam density batch variation'], Manpower: ['New operators 20% slower first 2 weeks'], Measurement: ['No in-station CT tracking'], 'Mother Nature': ['Cold ambient temp stiffens foam'] } })
        await td(s2.id, pid, 'fivewhy', { problem: 'Foam & Fabric CT 145s — 25s over takt', whys: [{ q:'Why is CT 25s over takt?', a:'Operator walks 4m to foam rack — 16s NVA every cycle.' },{ q:'Why is the rack 4m away?', a:'Line laid out 3 years ago before takt changed.' },{ q:'Why was layout not updated when takt changed?', a:'No formal process exists to review line-side storage on takt revisions.' },{ q:'Why no formal process?', a:'Manufacturing Engineering not included in takt review gate.' },{ q:'Why excluded?', a:'ROOT CAUSE: PFMEA gate does not mandate material-flow audit on takt revision.' }], rootCause: 'PFMEA gate does not mandate material flow audit when takt changes.', countermeasure: '1. Update PFMEA procedure. 2. Relocate foam rack within 0.5m of station immediately.', owner: 'Manufacturing Engineering', dueDate: '2026-04-15' })
        await td(s2.id, pid, 'waste', { selected: ['Motion','Waiting','Defects'], notes: { Motion:'Operator walks 4m to foam rack every cycle = 16s NVA', Waiting:'Operator waits 13s for partner — workload imbalance', Defects:'2.1% defect rate — fabric mis-clip creates rework' } })
        await td(s2.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Relocate foam rack to point of use', description:'Move foam rack from 4m to within 0.5m. Shadow board. Expected saving: 16s NVA per cycle.', category:'Productivity', priority:'critical', status:'in-progress', owner:'J. Patel', dueDate:'2026-04-01', actions:['Mark new location','Arrange relocation','Update standard work','Before/after time study'] },{ id:'kz2', kzId:'KZ-002', title:'Poka-yoke fabric clip alignment jig', description:'Guide pins to locate clips automatically. Eliminates 13s mutual check between operators.', category:'Quality', priority:'high', status:'open', owner:'S. Ahmed', dueDate:'2026-05-01', actions:['Raise ECR','Prototype guide pins','30-cycle trial'] }] })
        await td(s2.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Cycle Time', baseline:145, target:110, actual:null, unit:'seconds', status:'in-progress', owner:'J. Patel', dueDate:'2026-05-01', notes:'After foam rack relocation + poka-yoke' }] })
        await td(s2.id, pid, 'pdca', { projectTitle:'Foam & Fabric CT Reduction', problemStatement:'CT 145s exceeds Takt 120s — creates daily WIP backlog and overtime.', background:'Takt changed from 160s to 120s 6 months ago. Layout not updated.', team:[{ id:'t1', name:'J. Patel', role:'IE Lead' },{ id:'t2', name:'S. Ahmed', role:'Team Leader' }], startDate:'2026-03-01', targetDate:'2026-05-01', currentCondition:'CT 145s. Operator walks 4m to foam rack every cycle. Line running 3 units/hr below plan.', targetCondition:'CT at or below 110s. Foam rack within 0.5m. Zero unplanned overtime on this station.', rootCause:'Foam rack not at point of use — 16s NVA walk per cycle. PFMEA gate does not flag on takt revision.', hypothesis:'Relocating foam rack to within 0.5m will eliminate 16s walk. Poka-yoke jig will eliminate 13s mutual check. Combined target: CT 111s.', countermeasures:[{ id:'c1', action:'Relocate foam rack to within 0.5m of station', owner:'J. Patel', dueDate:'2026-04-01', status:'open' },{ id:'c2', action:'Install alignment jig for fabric clips', owner:'S. Ahmed', dueDate:'2026-05-01', status:'open' }], implementation:'Foam rack relocation scheduled for weekend shutdown 5 April. Jig prototype in progress.', metrics:[{ id:'m1', name:'Cycle Time', before:'145', after:'', unit:'seconds' }], results:'', achieved:'', standardisation:'Update standard work sheet, re-train all operators, update PFMEA gate.', lessonsLearned:'', nextCycle:'After CT improvement — target defect rate reduction from 2.1% to 0.5%.' })
        await td(s0.id, pid, 'smed', { stepName:'Material Staging', steps:[{ id:'a1', seq:1, name:'Walk to warehouse to collect foam', type:'internal', phase:'pre', time:96, notes:'Both operators leave station', convertible:true },{ id:'a2', seq:2, name:'Scan in material on handheld', type:'internal', phase:'pre', time:45, notes:'Could be done by milk-run driver', convertible:true },{ id:'a3', seq:3, name:'Verify part numbers vs build sheet', type:'internal', phase:'pre', time:30, notes:'Standard check — stays internal', convertible:false },{ id:'a4', seq:4, name:'Load jig', type:'internal', phase:'during', time:60, notes:'Core internal setup', convertible:false },{ id:'a5', seq:5, name:'Confirm readiness with supervisor', type:'waste', phase:'post', time:45, notes:'Approval not required per PFMEA — pure waste', convertible:false }] })
        await td(s5.id, pid, 'yamazumi', { taktTime: 120, operators:[{ stepName:'Material Staging', totalTime:45, tasks:[{ name:'Parts kitting', time:30, va_type:'nva' },{ name:'Scan & confirm', time:15, va_type:'nnva' }] },{ stepName:'Frame Sub-Assembly', totalTime:98, tasks:[{ name:'Frame weld', time:70, va_type:'va' },{ name:'Torque check', time:28, va_type:'nnva' }] },{ stepName:'Foam & Fabric', totalTime:145, tasks:[{ name:'Foam install', time:55, va_type:'va' },{ name:'Fabric clip', time:54, va_type:'va' },{ name:'Walk to rack', time:36, va_type:'nva' }] }] })
        seeded.push('Automotive')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. HOSPITAL — Emergency Department Patient Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — ED Patient Flow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Hospital') } else {
        const pid = await proj({ name: nm, industry: 'hospital_acute_care', customer: 'Patient',
          description: 'Emergency department: arrival to discharge. 7 care steps, 3.2hr lead time, bottleneck at Treatment.' })
        const s0 = await stp(pid, 0, { name: 'Patient Arrival & Registration', department: 'Front Desk', operators: 1, cycle_time: 8, wait_time: 12, wip: 6, uptime: 100, defect_rate: 3 })
        const s1 = await stp(pid, 1, { name: 'Triage & Acuity', department: 'Nursing', operators: 1, cycle_time: 6, wait_time: 18, wip: 5, uptime: 100, defect_rate: 2 })
        const s2 = await stp(pid, 2, { name: 'Vitals & Nursing Assessment', department: 'Nursing', operators: 1, cycle_time: 12, wait_time: 25, wip: 8, uptime: 100, defect_rate: 1 })
        const s3 = await stp(pid, 3, { name: 'Physician Assessment & Orders', department: 'Medical', operators: 1, cycle_time: 18, wait_time: 35, wip: 10, uptime: 100, defect_rate: 5, notes: 'Highest wait-time — peak demand bottleneck' })
        const s4 = await stp(pid, 4, { name: 'Diagnostics — Lab & Imaging', department: 'Diagnostics', operators: 2, cycle_time: 45, wait_time: 30, wip: 12, uptime: 92, defect_rate: 4 })
        const s5 = await stp(pid, 5, { name: 'Treatment & Intervention', department: 'Medical', operators: 2, cycle_time: 52, wait_time: 15, wip: 7, uptime: 100, defect_rate: 6, notes: 'BOTTLENECK — highest CT + limited procedure rooms' })
        const s6 = await stp(pid, 6, { name: 'Discharge & Documentation', department: 'Nursing', operators: 1, cycle_time: 18, wait_time: 22, wip: 9, uptime: 100, defect_rate: 8 })
        await td(s5.id, pid, 'stopwatch', { baseline: 65, target: 45, mean: 52, laps: [48,55,52,58,50,54,51,56,49,53], notes: 'Treatment avg 52 min. Limited to 2 procedure rooms — 6% require additional intervention.' })
        await td(s5.id, pid, 'ishikawa', { problem: 'Door-to-discharge 3.2 hrs — target 2 hrs', framework: '8P Service', causes: { People: ['1 physician covering 8 beds at peak','1:4 nurse ratio on surge'], Process: ['No concurrent discharge documentation','No standard protocol for top-10 diagnoses'], Policy: ['Fixed staffing model — not demand-matched','Physician must sign all discharge papers'], Place: ['Only 2 procedure rooms for 8-bed department'], 'Products/Services': ['Lab TAT 45 min average — CT 60+ min'], Price: ['Overtime budget constraint limits surge staffing'], Promotion: ['No patient communication on wait time — dissatisfaction driver'], 'Physical evidence': ['Paper forms duplicated in EHR — double entry'] } })
        await td(s5.id, pid, 'fivewhy', { problem: 'Door-to-discharge 3.2 hrs vs 2-hr target', whys: [{ q:'Why 3.2hr door-to-discharge?', a:'Physician wait (35 min) and treatment (52 min) both exceed target.' },{ q:'Why does physician wait average 35 min?', a:'One physician covers 8 beds. 3+ simultaneous arrivals create immediate queue.' },{ q:'Why not scaled to demand?', a:'Staffing on fixed daily model — not matched to hourly arrival patterns.' },{ q:'Why not demand-matched?', a:'Hourly demand data never formally analysed and presented to administration.' },{ q:'Why no demand analysis?', a:'ROOT CAUSE: No CI structure. Staff observe the bottleneck daily but no mechanism to escalate through data.' }], rootCause: 'No CI structure — staff see the bottleneck daily but no data-driven escalation mechanism exists.', countermeasure: '1. Map 90-day hourly arrivals. 2. Add physician Mon/Fri 4-8pm surge. 3. Concurrent discharge documentation pilot.', owner: 'Medical Director', dueDate: '2026-05-31' })
        await td(s5.id, pid, 'waste', { selected: ['Waiting','Motion','Defects','Overprocessing'], notes: { Waiting:'Patients wait 35 min for physician + 30 min for labs = 65 min pure queue', Motion:'Nurses make avg 3 trips to medication room per patient per visit', Defects:'6% of treatments require additional intervention — undetected on triage', Overprocessing:'Paper forms re-entered into EHR — 100% duplicate data entry' } })
        await td(s5.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Point-of-care medication supply', description:'Move top 20 medications to secured dispensing cabinet in treatment area. Eliminates avg 3 med room trips per patient — 8 min nursing saving.', category:'Productivity', priority:'critical', status:'in-progress', owner:'Charge Nurse', dueDate:'2026-04-15', actions:['Identify top 20 meds by volume','Procure Pyxis unit','Install in treatment bay','Update medication protocol'] },{ id:'kz2', kzId:'KZ-002', title:'Concurrent discharge documentation during treatment', description:'Physician completes discharge plan while patient is still in treatment. Eliminates 22-min signature wait at end.', category:'Productivity', priority:'high', status:'open', owner:'Medical Director', dueDate:'2026-05-01', actions:['Redesign EHR discharge workflow','Pilot 2 physicians for 2 weeks','Measure wait time before/after'] }] })
        await td(s5.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Door-to-Discharge Time', baseline:192, target:120, actual:null, unit:'minutes', status:'in-progress', owner:'Medical Director', dueDate:'2026-09-01', notes:'KZ-001 + KZ-002 combined' }] })
        await td(s5.id, pid, 'pdca', { projectTitle:'ED Door-to-Discharge Reduction', problemStatement:'Average door-to-discharge 3.2 hrs vs 2-hr target — driving patient dissatisfaction and bed block.', background:'ED sees 85 patients/day. Mon/Fri 4-8pm surge regularly creates 2-hr physician wait.', team:[{ id:'t1', name:'Medical Director', role:'Sponsor' },{ id:'t2', name:'Charge Nurse', role:'Lead' }], startDate:'2026-03-01', targetDate:'2026-09-01', currentCondition:'3.2-hr door-to-discharge. Physician wait 35 min. 1 physician for 8 beds at peak. Lab TAT 45 min.', targetCondition:'Door-to-discharge under 2 hrs. Physician wait under 15 min. Lab TAT under 30 min.', rootCause:'Fixed staffing model not matched to demand. No concurrent documentation. Medications not at point of care.', hypothesis:'Demand-matched staffing + concurrent documentation + point-of-care meds = 75-min savings.', countermeasures:[{ id:'c1', action:'Install point-of-care medication Pyxis unit', owner:'Charge Nurse', dueDate:'2026-04-15', status:'open' },{ id:'c2', action:'Concurrent discharge documentation pilot', owner:'Medical Director', dueDate:'2026-05-01', status:'open' },{ id:'c3', action:'Demand-matched physician schedule Mon/Fri 4-8pm', owner:'Operations', dueDate:'2026-06-01', status:'open' }], implementation:'Phase 1: medication Pyxis. Phase 2: documentation workflow. Phase 3: staffing schedule.', metrics:[{ id:'m1', name:'Door-to-Discharge', before:'192', after:'', unit:'minutes' },{ id:'m2', name:'Physician Wait Time', before:'35', after:'', unit:'minutes' }], results:'', achieved:'', standardisation:'Update care protocols, train all staff, embed metrics into daily huddle board.', lessonsLearned:'', nextCycle:'After wait-time reduction — target 72-hr readmission rate from 8% to 4%.' })
        seeded.push('Hospital')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. SOFTWARE DEVELOPMENT — Feature Delivery Pipeline
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Software Feature Delivery'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Software') } else {
        const pid = await proj({ name: nm, industry: 'software_development', customer: 'End User',
          description: 'Idea-to-deploy pipeline. 6 stages, 14-day average lead time, bottleneck at Code Review.' })
        const s0 = await stp(pid, 0, { name: 'Backlog Refinement', department: 'Product', operators: 1, cycle_time: 60, wait_time: 4320, wip: 35, uptime: 100, defect_rate: 15, notes: '15% of stories refined but never developed — overproduction of backlog' })
        const s1 = await stp(pid, 1, { name: 'Development', department: 'Engineering', operators: 3, cycle_time: 1440, wait_time: 120, wip: 8, uptime: 100, defect_rate: 0 })
        const s2 = await stp(pid, 2, { name: 'Code Review', department: 'Engineering', operators: 2, cycle_time: 480, wait_time: 1440, wip: 12, uptime: 100, defect_rate: 35, notes: 'BOTTLENECK — 1440 min wait + 35% PRs require >2 review rounds' })
        const s3 = await stp(pid, 3, { name: 'QA Testing', department: 'QA', operators: 1, cycle_time: 360, wait_time: 480, wip: 6, uptime: 100, defect_rate: 20 })
        const s4 = await stp(pid, 4, { name: 'Staging & UAT', department: 'Engineering', operators: 1, cycle_time: 120, wait_time: 2880, wip: 4, uptime: 100, defect_rate: 10 })
        const s5 = await stp(pid, 5, { name: 'Production Deploy', department: 'Engineering', operators: 1, cycle_time: 30, wait_time: 0, wip: 1, uptime: 97, defect_rate: 3 })
        await td(s2.id, pid, 'stopwatch', { baseline: 720, target: 240, mean: 480, laps: [360,540,480,600,420,480,510,450,480,500], notes: 'Code review avg 480 min (8 hrs). 1440-min queue wait before review begins.' })
        await td(s2.id, pid, 'ishikawa', { problem: '35% of PRs require more than 2 review rounds — avg cycle time 14 days', framework: '8P Service', causes: { People: ['Only 2 senior engineers qualified to review','Reviewers context-switch 6+ times per day'], Process: ['No PR template — missing context forces questions','No definition of done agreed before development starts'], Policy: ['PRs not reviewed within 24hr — no SLA'], Place: ['Remote team — async review creates overnight lag'], 'Products/Services': ['Automated tests only 40% coverage — manual review compensates'], Price: ['Understaffed QA — testing burden falls on review'], Promotion: ['No architecture decision record — reviewers re-debate decided patterns'], 'Physical evidence': ['No standard commit message format — change intent unclear'] } })
        await td(s2.id, pid, 'fivewhy', { problem: 'Average PR cycle time 14 days — target 3 days', whys: [{ q:'Why 14-day PR cycle?', a:'Code review waits average 1440 min (24 hrs) before first reviewer engages.' },{ q:'Why 24-hr wait?', a:'Only 2 senior engineers can review. Both carry 4+ concurrent PRs.' },{ q:'Why only 2 qualified reviewers?', a:'No junior developer has been given graduated review responsibility.' },{ q:'Why not graduated?', a:'No review skills training or pairing programme exists.' },{ q:'Why no training programme?', a:'ROOT CAUSE: Engineering team has no defined career ladder or skills development path for review competency.' }], rootCause: 'No review skills development path. Junior developers never given graduated review responsibility.', countermeasure: '1. Pair juniors with seniors for 4-week review shadowing. 2. PR template mandatory. 3. 24-hr review SLA.', owner: 'Engineering Lead', dueDate: '2026-04-30' })
        await td(s2.id, pid, 'waste', { selected: ['Waiting','Overproduction','Defects','Non-Utilisation'], notes: { Waiting:'PRs wait 24 hrs before first review — pure queue time', Overproduction:'35 stories in backlog refined but not scheduled — wasted refinement effort', Defects:'35% of PRs fail review and cycle back — rework loop', 'Non-Utilisation':'6 junior developers capable of review but never utilised for this' } })
        await td(s2.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Mandatory PR template + 24hr review SLA', description:'PR template ensures context is complete before submission. 24-hr SLA tracked in sprint metrics. Target: avg rounds from 2.3 to 1.2.', category:'Quality', priority:'critical', status:'in-progress', owner:'Engineering Lead', dueDate:'2026-04-01', actions:['Create PR template in GitHub','Add 24hr SLA to team working agreement','Dashboard review age in daily standup','Measure rounds per PR weekly'] },{ id:'kz2', kzId:'KZ-002', title:'Junior developer review shadowing programme', description:'4-week paired review programme. 2 junior devs shadowing 1 senior each. Graduate to independent review of scoped PRs.', category:'Productivity', priority:'high', status:'open', owner:'Engineering Lead', dueDate:'2026-05-01', actions:['Pair 2 juniors with 2 seniors','Define review competency checklist','Week 1: observe, Week 2: comment, Week 3: primary, Week 4: independent'] }] })
        await td(s2.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Lead Time (Idea to Deploy)', baseline:14, target:5, actual:null, unit:'days', status:'in-progress', owner:'Engineering Lead', dueDate:'2026-06-01' }] })
        await td(s2.id, pid, 'pdca', { projectTitle:'PR Cycle Time Reduction', problemStatement:'14-day average lead time from story start to production deploy. Industry benchmark 3-5 days.', background:'Team of 8 engineers. 2 senior reviewers. 35% review failure rate causing rework loops.', team:[{ id:'t1', name:'Engineering Lead', role:'Sponsor' }], startDate:'2026-03-01', targetDate:'2026-06-01', currentCondition:'14-day lead time. 24-hr review wait. 35% PRs >2 rounds. 2 qualified reviewers only.', targetCondition:'5-day lead time. Review starts within 4 hrs. <1.5 rounds per PR. 6 qualified reviewers.', rootCause:'Insufficient review capacity. No PR template. No 24-hr SLA.', hypothesis:'Template + SLA + 2 new reviewers = review wait drops from 24hrs to 4hrs. Lead time drops from 14 to 5 days.', countermeasures:[{ id:'c1', action:'Implement mandatory PR template', owner:'Engineering Lead', dueDate:'2026-04-01', status:'open' },{ id:'c2', action:'Establish 24-hour review SLA', owner:'Engineering Lead', dueDate:'2026-04-01', status:'open' },{ id:'c3', action:'Junior reviewer shadowing programme', owner:'Engineering Lead', dueDate:'2026-05-01', status:'open' }], implementation:'Sprint 1: template + SLA. Sprint 2: shadowing programme start. Sprint 3: measure and adjust.', metrics:[{ id:'m1', name:'Lead Time', before:'14', after:'', unit:'days' },{ id:'m2', name:'Review Rounds per PR', before:'2.3', after:'', unit:'rounds' }], results:'', achieved:'', standardisation:'Embed PR template in repo, SLA in team charter, review competency in onboarding.', lessonsLearned:'', nextCycle:'After lead time — target deployment frequency from 2x/week to daily.' })
        seeded.push('Software')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. RESTAURANT — Kitchen & Service Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Restaurant Service Flow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Restaurant') } else {
        const pid = await proj({ name: nm, industry: 'restaurant_food_service', customer: 'Dining Guest',
          description: 'Full dine-in service value stream. 7 steps, 72-min lead time, bottleneck at Kitchen Production.' })
        const s0 = await stp(pid, 0, { name: 'Guest Arrival & Seating', department: 'Front of House', operators: 1, cycle_time: 4, wait_time: 8, wip: 12, uptime: 100, defect_rate: 2 })
        const s1 = await stp(pid, 1, { name: 'Order Taking', department: 'Front of House', operators: 1, cycle_time: 6, wait_time: 5, wip: 8, uptime: 100, defect_rate: 4 })
        const s2 = await stp(pid, 2, { name: 'Kitchen Production', department: 'Kitchen', operators: 3, cycle_time: 22, wait_time: 8, wip: 15, uptime: 92, defect_rate: 6, notes: 'BOTTLENECK — kitchen queue builds after 7pm. 6% wrong orders.' })
        const s3 = await stp(pid, 3, { name: 'Food Runner & Service', department: 'Front of House', operators: 1, cycle_time: 3, wait_time: 4, wip: 6, uptime: 100, defect_rate: 2 })
        const s4 = await stp(pid, 4, { name: 'Bill Presentation & Payment', department: 'Front of House', operators: 1, cycle_time: 5, wait_time: 6, wip: 5, uptime: 100, defect_rate: 1 })
        const s5 = await stp(pid, 5, { name: 'Table Reset & Turnover', department: 'Front of House', operators: 1, cycle_time: 8, wait_time: 2, wip: 4, uptime: 100, defect_rate: 0 })
        await td(s2.id, pid, 'stopwatch', { baseline: 30, target: 18, mean: 22, laps: [18,25,22,28,20,24,21,26,19,23], notes: 'Kitchen avg 22 min. Target 18 min. Post-7pm peak pushes to 35+ min. 6% orders wrong.' })
        await td(s2.id, pid, 'ishikawa', { problem: 'Kitchen production 22 min avg — 35 min during evening peak, 6% wrong orders', framework: '8P Service', causes: { People: ['Prep cook calls in sick — no cross-training cover','New front-of-house not communicating allergies clearly'], Process: ['No mise en place standard for peak service','Verbal order relay — no ticket system backup'], Policy: ['Kitchen closes prep at 5pm — no restocking during service'], Place: ['Grill and fry station share one pass — bottleneck at plating'], 'Products/Services': ['Seasonal menu introduced without updated prep guides'], Price: ['Food cost pressure — limited portion pre-prep'], Promotion: ['No 86-list communication — orders placed for out-of-stock items'], 'Physical evidence': ['Handwritten tickets — illegible under pressure'] } })
        await td(s2.id, pid, 'fivewhy', { problem: '6% wrong orders — most common complaint', whys: [{ q:'Why 6% wrong orders?', a:'Order tickets misread in the kitchen under peak pressure.' },{ q:'Why tickets misread?', a:'Handwritten ticket abbreviations not standardised — each server has own shorthand.' },{ q:'Why not standardised?', a:'No ticket-writing standard or training. Each server developed own system.' },{ q:'Why no training?', a:'Onboarding covers menu knowledge but not order communication process.' },{ q:'Why not in onboarding?', a:'ROOT CAUSE: No documented service standard for ticket-writing. Process assumed learned on-the-job.' }], rootCause: 'No ticket-writing standard. Each server uses personal abbreviations — kitchen cannot reliably decode under pressure.', countermeasure: '1. Create standard ticket abbreviation key. 2. Add to onboarding. 3. Post in kitchen pass. 4. Digital POS order system longer-term.', owner: 'Head Chef / FOH Manager', dueDate: '2026-04-01' })
        await td(s2.id, pid, 'waste', { selected: ['Defects','Waiting','Motion','Overprocessing'], notes: { Defects:'6% wrong orders — remake costs food + delay + guest dissatisfaction', Waiting:'Guests wait avg 22 min for food — 8 min above target', Motion:'Line cooks cross-station 6-8 times per service to reach shared fridge', Overprocessing:'Plating garnish on dishes that go straight to a booth — customer never sees it' } })
        await td(s2.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Standard ticket abbreviation key', description:'One-page standard ticket key for all servers. Posted at pass. Covered in onboarding. Target: wrong orders from 6% to 1%.', category:'Quality', priority:'critical', status:'in-progress', owner:'FOH Manager', dueDate:'2026-04-01', actions:['Draft standard key with head chef input','Laminate and post at pass','Train all servers','Track wrong orders weekly'] },{ id:'kz2', kzId:'KZ-002', title:'Cross-training prep cook cover', description:'At least 2 staff cross-trained as prep cook for each shift. Eliminates single point of failure on sick days.', category:'Productivity', priority:'high', status:'open', owner:'Head Chef', dueDate:'2026-04-15', actions:['Identify 2 FOH staff willing to cross-train','4 prep sessions with head chef','On-call roster for sick cover'] }] })
        await td(s2.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Kitchen Production Time', baseline:22, target:18, actual:null, unit:'minutes', status:'in-progress', owner:'Head Chef', dueDate:'2026-05-01' },{ id:'g2', metric:'Wrong Order Rate', baseline:6, target:1, actual:null, unit:'%', status:'open', owner:'FOH Manager', dueDate:'2026-04-15' }] })
        await td(s2.id, pid, 'pdca', { projectTitle:'Kitchen Production Time Reduction', problemStatement:'Kitchen avg 22 min, peak 35 min. 6% wrong orders. Table turn rate 15% below target.', background:'65-cover restaurant, 3 sittings on Fri/Sat. Kitchen team of 5.', team:[{ id:'t1', name:'Head Chef', role:'Lead' },{ id:'t2', name:'FOH Manager', role:'Co-Lead' }], startDate:'2026-03-01', targetDate:'2026-05-01', currentCondition:'22-min avg kitchen time. 35-min peak. 6% wrong orders. No ticket standard.', targetCondition:'18-min avg kitchen time. Under 25 min at peak. Under 1% wrong orders.', rootCause:'No ticket-writing standard. Cross-station motion. No peak-period prep buffer.', hypothesis:'Standard ticket key reduces wrong orders to 1%. Cross-station fridge access removes 8 min of motion per service.', countermeasures:[{ id:'c1', action:'Standard ticket abbreviation key', owner:'FOH Manager', dueDate:'2026-04-01', status:'open' },{ id:'c2', action:'Dedicated peak-period mise en place protocol', owner:'Head Chef', dueDate:'2026-04-15', status:'open' }], implementation:'Ticket key live by 1 April. Mise en place protocol for first Fri/Sat service.', metrics:[{ id:'m1', name:'Kitchen Production Time', before:'22', after:'', unit:'minutes' },{ id:'m2', name:'Wrong Order Rate', before:'6', after:'', unit:'%' }], results:'', achieved:'', standardisation:'Ticket key in staff handbook. Mise en place as daily close checklist.', lessonsLearned:'', nextCycle:'After production time — target food waste percentage from 11% to 5%.' })
        seeded.push('Restaurant')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 5. CRAFT BREWERY — Batch Production
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Craft Brewery Batch Production'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Brewery') } else {
        const pid = await proj({ name: nm, industry: 'craft_brewery', customer: 'Taproom & Wholesale',
          description: '8-step brew process. 21-day lead time. Bottleneck at Fermentation — 6 tank hard ceiling.' })
        const s0 = await stp(pid, 0, { name: 'Grain Receiving & Milling', operators: 1, cycle_time: 90, wait_time: 1440, wip: 2, uptime: 96, defect_rate: 1 })
        const s1 = await stp(pid, 1, { name: 'Mashing & Lautering', operators: 1, cycle_time: 120, wait_time: 30, wip: 1, uptime: 99, defect_rate: 3, notes: '3% stuck sparge on rye/wheat grists — 45 min rework' })
        const s2 = await stp(pid, 2, { name: 'Boil & Hop Additions', operators: 1, cycle_time: 75, wait_time: 15, wip: 1, uptime: 100, defect_rate: 2 })
        const s3 = await stp(pid, 3, { name: 'Whirlpool, Chill & Transfer', operators: 1, cycle_time: 45, wait_time: 10, wip: 1, uptime: 98, defect_rate: 1 })
        const s4 = await stp(pid, 4, { name: 'Fermentation', operators: 1, cycle_time: 8640, wait_time: 0, wip: 6, uptime: 100, defect_rate: 4, notes: 'BOTTLENECK — 6 fermenters at capacity. 4% off-flavour rate.' })
        const s5 = await stp(pid, 5, { name: 'Conditioning & Dry Hopping', operators: 1, cycle_time: 4320, wait_time: 0, wip: 4, uptime: 100, defect_rate: 2 })
        const s6 = await stp(pid, 6, { name: 'QC & Transfer to Bright Tank', operators: 1, cycle_time: 60, wait_time: 480, wip: 3, uptime: 100, defect_rate: 5 })
        const s7 = await stp(pid, 7, { name: 'Packaging — Can, Keg & Bottle', operators: 2, cycle_time: 240, wait_time: 60, wip: 2, uptime: 88, defect_rate: 3, notes: 'Canning line uptime 88% — seamer head wear causes 3% underfill' })
        await td(s4.id, pid, 'stopwatch', { baseline: 10080, target: 7200, mean: 8640, laps: [8640,8640,8640,7200,8640,8640,9072,8640,8640,8640], notes: 'Fermentation avg 6 days. NEIPA strains 5 days. Lager 10+ days. 6 fermenters = 6 batches max concurrent.' })
        await td(s1.id, pid, 'ishikawa', { problem: '3% of batches have stuck sparge — adds 45 min rework per batch', framework: '6M Manufacturing', causes: { Machine: ['10-barrel lauter tun undersized for grain bill','Vorlauf pump speed too high compacts grain bed'], Method: ['Rice hulls not specified on high-adjunct recipes','Sparge water temp allowed to drop — increases viscosity'], Material: ['Rye and wheat husks lack structure — collapse under pressure','Grain crush too fine on high-adjunct bills'], Manpower: ['Head brewer adjustment in memory only — not documented'], Measurement: ['No flow rate target documented per recipe style'], 'Mother Nature': ['Cold cellar temps increase mash viscosity'] } })
        await td(s1.id, pid, 'fivewhy', { problem: '3% stuck sparge rate — 45-min rework per batch', whys: [{ q:'Why do batches get stuck sparge?', a:'High-adjunct grain bills create dense bed restricting wort flow.' },{ q:'Why does high-adjunct restrict flow?', a:'Rice hulls not added to these grists. Recipe does not specify.' },{ q:'Why no rice hulls on recipe?', a:'Recipes written for 3-barrel system, never updated for 10-barrel.' },{ q:'Why not updated?', a:'No formal scale-up review process. Head brewer carries adjustment in memory.' },{ q:'Why not documented?', a:'ROOT CAUSE: No recipe management system with equipment-specific parameters. Recipes in Google Docs, no version control.' }], rootCause: 'No recipe management system. High-adjunct adjustments exist only in head brewer memory.', countermeasure: '1. Implement Brewfather with equipment profiles. 2. Add rice hull spec to all high-adjunct recipes. 3. Scale-up review checklist.', owner: 'Head Brewer', dueDate: '2026-04-15' })
        await td(s4.id, pid, 'waste', { selected: ['Waiting','Defects','Non-Utilisation'], notes: { Waiting:'Fermenters fully occupied — new batches wait for tanks to free up (avg 2.5 days)', Defects:'4% off-flavour rate — partial volume loss. H₂S most common cause.', 'Non-Utilisation':'Cellarman manually monitoring fermentation — no automated temperature alerts' } })
        await td(s4.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Canning line seamer rebuild', description:'Seamer head worn — 3% underfill. Full rebuild with quick-change format kit. Uptime target: 96%. Changeover from 60 min to 20 min.', category:'Quality', priority:'critical', status:'in-progress', owner:'Head Brewer', dueDate:'2026-04-01', actions:['Order rebuild kit','Schedule 1-day shutdown','Calibrate and run 50-can test','Record fill weights across 200 cans'] },{ id:'kz2', kzId:'KZ-002', title:'Staggered fermentation schedule', description:'Currently all fermenters start Mon/Thu. Staggering Mon/Wed/Fri gains +0.5 batches/week without adding tanks.', category:'Productivity', priority:'high', status:'open', owner:'Head Brewer', dueDate:'2026-04-15', actions:['Model batch schedule in Brewfather','Adjust brew day calendar','Trial 4-week staggered schedule','Measure actual throughput'] }] })
        await td(s4.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Batches Per Week', baseline:2, target:2.5, actual:null, unit:'batches', status:'in-progress', owner:'Head Brewer', dueDate:'2026-06-01' }] })
        await td(s7.id, pid, 'smed', { stepName:'Packaging Line Changeover', steps:[{ id:'a1', seq:1, name:'Drain and rinse previous batch lines', type:'internal', phase:'pre', time:1200, notes:'Core internal — must be empty before changeover', convertible:false },{ id:'a2', seq:2, name:'Retrieve new labels from storage room', type:'internal', phase:'pre', time:180, notes:'Can be done while previous batch still running', convertible:true },{ id:'a3', seq:3, name:'Load labels into labeller', type:'internal', phase:'during', time:300, notes:'Machine stopped for label change', convertible:false },{ id:'a4', seq:4, name:'Run 20-can fill weight test', type:'internal', phase:'during', time:420, notes:'QC requirement — cannot be external', convertible:false },{ id:'a5', seq:5, name:'Update batch records and transfer logs', type:'waste', phase:'post', time:600, notes:'Done after restart — delays next batch unnecessarily. Move to during or end of prior batch.', convertible:false }] })
        seeded.push('Brewery')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 6. LAW FIRM — Matter Lifecycle
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Law Firm Matter Lifecycle'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Law Firm') } else {
        const pid = await proj({ name: nm, industry: 'law_firm', customer: 'Client',
          description: 'Full matter flow from instruction to billing. 7 steps. Bottleneck at Document Drafting — revision loops add 30-40% time.' })
        const s0 = await stp(pid, 0, { name: 'Client Intake & Conflict Check', department: 'Admin', operators: 1, cycle_time: 45, wait_time: 240, wip: 8, uptime: 100, defect_rate: 5 })
        const s1 = await stp(pid, 1, { name: 'Instruction & Scoping', department: 'Fee Earner', operators: 1, cycle_time: 60, wait_time: 120, wip: 6, uptime: 100, defect_rate: 12 })
        const s2 = await stp(pid, 2, { name: 'Legal Research', department: 'Fee Earner', operators: 1, cycle_time: 180, wait_time: 60, wip: 4, uptime: 100, defect_rate: 8 })
        const s3 = await stp(pid, 3, { name: 'Document Drafting', department: 'Fee Earner', operators: 2, cycle_time: 300, wait_time: 120, wip: 10, uptime: 100, defect_rate: 40, notes: 'BOTTLENECK — 40% first drafts need substantive revision' })
        const s4 = await stp(pid, 4, { name: 'Partner Review & Sign-off', department: 'Partner', operators: 1, cycle_time: 90, wait_time: 2880, wip: 12, uptime: 100, defect_rate: 25 })
        const s5 = await stp(pid, 5, { name: 'Client Review & Negotiation', department: 'Fee Earner', operators: 1, cycle_time: 120, wait_time: 4320, wip: 6, uptime: 100, defect_rate: 30 })
        const s6 = await stp(pid, 6, { name: 'Execution, Filing & Billing', department: 'Admin / Fee Earner', operators: 1, cycle_time: 60, wait_time: 480, wip: 5, uptime: 100, defect_rate: 8 })
        await td(s3.id, pid, 'stopwatch', { baseline: 480, target: 240, mean: 300, laps: [240,360,300,420,270,330,300,390,270,310], notes: 'First draft avg 5 hrs. 40% require substantive revision. Partner queue adds 2-day wait.' })
        await td(s3.id, pid, 'ishikawa', { problem: '40% of first drafts require substantive revision — adds 2-3 days per matter', framework: '8P Service', causes: { People: ['Trainees drafting without sufficient precedent review','Partners reviewing without junior briefing note'], Process: ['No precedent review step before drafting begins','Instructions not confirmed in writing before drafting starts'], Policy: ['No draft review checklist or sign-off before partner submission'], Place: ['Drafting happens in isolation — no real-time partner input'], 'Products/Services': ['Precedent library outdated — contains pre-2020 standard forms'], Price: ['Billing pressure drives speed over accuracy'], Promotion: ['Client brief changes mid-draft — not captured formally'], 'Physical evidence': ['No version control on documents — email chain becomes source of truth'] } })
        await td(s3.id, pid, 'fivewhy', { problem: '40% of first drafts require substantive revision', whys: [{ q:'Why 40% revision rate?', a:'Instructions are ambiguous — drafters make assumptions that partners reject.' },{ q:'Why are instructions ambiguous?', a:'No structured instruction template. Notes taken by junior vary widely.' },{ q:'Why no instruction template?', a:'Firm has never standardised matter opening process.' },{ q:'Why not standardised?', a:'Each partner prefers their own way of briefing — no practice-level standard.' },{ q:'Why no practice-level standard?', a:'ROOT CAUSE: No head-of-practice role responsible for workflow standards. Each partner runs their team independently.' }], rootCause: 'No practice-level matter workflow standard. Each partner operates independently — no consistent instruction process.', countermeasure: '1. Standard instruction template per matter type. 2. Mandatory written confirmation before drafting. 3. Checklist before partner submission.', owner: 'Managing Partner', dueDate: '2026-05-01' })
        await td(s3.id, pid, 'waste', { selected: ['Defects','Waiting','Overprocessing'], notes: { Defects:'40% first-draft revision rate — rework loop adds avg 2.3 days per matter', Waiting:'Partner queue: 2-day wait for review slot (12 matters queued)', Overprocessing:'Full research undertaken before instructions confirmed — 15% of research redundant when instructions change' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Standard instruction template per matter type', description:'Structured template for each of the 8 most common matter types. Mandatory written confirmation before drafting starts. Target: revision rate from 40% to 12%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Managing Partner', dueDate:'2026-04-15', actions:['Map 8 most common matter types','Draft instruction template for each','Pilot with 3 fee earners for 1 month','Measure revision rate before/after'] },{ id:'kz2', kzId:'KZ-002', title:'Partner review slot booking system', description:'Partners hold 2 x 1-hr review slots per day in diary. Matters booked in advance. Eliminates ad-hoc 2-day queue.', category:'Productivity', priority:'high', status:'open', owner:'Practice Manager', dueDate:'2026-05-01', actions:['Set up diary blocking template','Communicate to fee earners','Trial for 1 month','Measure average review wait time'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'First Draft Revision Rate', baseline:40, target:12, actual:null, unit:'%', status:'in-progress', owner:'Managing Partner', dueDate:'2026-07-01' }] })
        await td(s3.id, pid, 'pdca', { projectTitle:'Matter Drafting Quality Improvement', problemStatement:'40% first-draft revision rate. Partner queue adds 2-day wait. Total matter cycle time 25% above budget.', background:'Practice of 8 fee earners, 2 partners. High revision rate driving write-offs and client delays.', team:[{ id:'t1', name:'Managing Partner', role:'Sponsor' },{ id:'t2', name:'Practice Manager', role:'Lead' }], startDate:'2026-03-01', targetDate:'2026-07-01', currentCondition:'40% first drafts require substantive revision. No instruction template. 2-day partner review queue.', targetCondition:'12% first-draft revision rate. Partner review within 24 hrs. Written instructions before every draft.', rootCause:'No matter workflow standard. Instructions verbal and inconsistent. No pre-submission checklist.', hypothesis:'Standard template + confirmation requirement + partner diary slots = revision rate drops from 40% to 12%.', countermeasures:[{ id:'c1', action:'Standard instruction template per matter type', owner:'Managing Partner', dueDate:'2026-04-15', status:'open' },{ id:'c2', action:'Partner diary review slots', owner:'Practice Manager', dueDate:'2026-05-01', status:'open' }], implementation:'Phase 1: instruction templates. Phase 2: diary slots. Phase 3: measure and standardise.', metrics:[{ id:'m1', name:'First Draft Revision Rate', before:'40', after:'', unit:'%' },{ id:'m2', name:'Matter Cycle Time vs Budget', before:'125', after:'', unit:'%' }], results:'', achieved:'', standardisation:'Instruction templates in practice management system. Diary protocol in partner expectations document.', lessonsLearned:'', nextCycle:'After revision rate — target billing realisation rate from 82% to 92%.' })
        seeded.push('Law Firm')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 7. RETAIL STORE — Stockroom to Shelf
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Retail Store Operations'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Retail') } else {
        const pid = await proj({ name: nm, industry: 'retail_stores', customer: 'Shopper',
          description: 'Delivery receiving to shelf replenishment. 6 steps. Bottleneck at stockroom processing — vendor delivery variability.' })
        const s0 = await stp(pid, 0, { name: 'Delivery Receiving & Check-in', department: 'Stockroom', operators: 2, cycle_time: 30, wait_time: 120, wip: 8, uptime: 100, defect_rate: 8 })
        const s1 = await stp(pid, 1, { name: 'Stockroom Processing & Sort', department: 'Stockroom', operators: 2, cycle_time: 45, wait_time: 60, wip: 20, uptime: 100, defect_rate: 3, notes: 'BOTTLENECK — delivery volume unpredictable. WIP builds when 3+ deliveries arrive same day.' })
        const s2 = await stp(pid, 2, { name: 'Ticketing & Price Verification', department: 'Stockroom', operators: 1, cycle_time: 20, wait_time: 30, wip: 15, uptime: 100, defect_rate: 5 })
        const s3 = await stp(pid, 3, { name: 'Floor Replenishment', department: 'Sales Floor', operators: 2, cycle_time: 35, wait_time: 15, wip: 10, uptime: 100, defect_rate: 2 })
        const s4 = await stp(pid, 4, { name: 'Returns Processing', department: 'Customer Service', operators: 1, cycle_time: 12, wait_time: 45, wip: 6, uptime: 100, defect_rate: 4 })
        const s5 = await stp(pid, 5, { name: 'End-of-Day Markdowns & Recovery', department: 'Sales Floor', operators: 2, cycle_time: 60, wait_time: 0, wip: 0, uptime: 100, defect_rate: 0 })
        await td(s1.id, pid, 'stopwatch', { baseline: 60, target: 30, mean: 45, laps: [35,55,42,58,40,50,44,52,38,48], notes: 'Stockroom processing avg 45 min per truck. Peaks to 90 min when 3+ deliveries arrive same day.' })
        await td(s1.id, pid, 'ishikawa', { problem: 'Stockroom WIP builds 3x on multi-delivery days — replenishment delayed 4+ hours', framework: '8P Service', causes: { People: ['Only 2 stockroom associates — no flex coverage on peak days','No cross-training between cashiers and stockroom'], Process: ['Deliveries scheduled by vendor — not store capacity','No standard processing sequence per merchandise category'], Policy: ['All deliveries processed FIFO regardless of floor priority'], Place: ['Single staging area — becomes full before processing starts'], 'Products/Services': ['Mixed-category deliveries arrive together — require different handling'], Price: ['Budget constraints limit staffing above minimum level'], Promotion: ['Sale-event replenishment not coordinated with delivery schedule'], 'Physical evidence': ['Paper manifests — discrepancies not resolved until end of day'] } })
        await td(s1.id, pid, 'fivewhy', { problem: 'Replenishment delayed 4+ hours on multi-delivery days', whys: [{ q:'Why delayed 4+ hours?', a:'Stockroom WIP exceeds 2-associate processing capacity on multi-delivery days.' },{ q:'Why insufficient capacity?', a:'Delivery schedule not visible to store — surprises create queue.' },{ q:'Why not visible?', a:'Vendor delivery windows are 4-hour blocks with no advance count notification.' },{ q:'Why no count notification?', a:'No formal delivery communication agreement with vendors.' },{ q:'Why no agreement?', a:'ROOT CAUSE: Vendor delivery standards never established in procurement contract. Accepted as variable by default.' }], rootCause: 'No vendor delivery standard. Carton counts not communicated in advance — store cannot staff to volume.', countermeasure: '1. Negotiate advance delivery manifest with top 5 vendors. 2. Cross-train 2 cashiers as stockroom backup. 3. Priority replenishment sequence by floor vacancy.', owner: 'Store Manager', dueDate: '2026-04-30' })
        await td(s1.id, pid, 'waste', { selected: ['Waiting','Inventory','Motion'], notes: { Waiting:'Replenishment waits avg 4 hrs on multi-delivery days — floor goes bare', Inventory:'Backroom holds 3x planned inventory on peak days — excess stock obscures priorities', Motion:'Associates walk full length of stockroom to locate sorted merchandise — no zone system' } })
        await td(s1.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Advance delivery manifest from top 5 vendors', description:'Negotiate 24-hr advance carton count from top 5 vendors (70% of volume). Enables staffing plan. Target: zero same-day processing backlog.', category:'Delivery', priority:'critical', status:'in-progress', owner:'Store Manager', dueDate:'2026-04-30', actions:['Identify top 5 vendors by carton volume','Draft manifest request letter','Negotiate with each vendor','Build staffing model from manifest data'] },{ id:'kz2', kzId:'KZ-002', title:'Cross-train 2 cashiers for stockroom', description:'Two cashiers trained on full stockroom process. On-call for multi-delivery days. Eliminates overtime cost.', category:'Productivity', priority:'high', status:'open', owner:'Store Manager', dueDate:'2026-05-15', actions:['Identify 2 cashier volunteers','4-shift training programme','Certify on stockroom standard work','Add to flex schedule'] }] })
        await td(s1.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Replenishment Lead Time (Delivery to Shelf)', baseline:240, target:90, actual:null, unit:'minutes', status:'in-progress', owner:'Store Manager', dueDate:'2026-06-01' }] })
        await td(s3.id, pid, 'pdca', { projectTitle:'Replenishment Speed Improvement', problemStatement:'4-hr stockroom delay on multi-delivery days. Floor goes bare. Lost sales estimated $800/week.', background:'High-volume retail store. 5 vendors, avg 3 deliveries per week, peaks 5 deliveries Friday.', team:[{ id:'t1', name:'Store Manager', role:'Lead' }], startDate:'2026-03-15', targetDate:'2026-06-01', currentCondition:'240-min replenishment lead time on peak days. 2-associate stockroom only. No advance manifests.', targetCondition:'90-min replenishment lead time any day. Advance manifest from top 5 vendors. 4 trained stockroom associates.', rootCause:'No vendor delivery standard. Staff not cross-trained. No priority replenishment sequence.', hypothesis:'Advance manifests + 2 cross-trained cashiers = capacity matches volume every day.', countermeasures:[{ id:'c1', action:'Advance manifest from top 5 vendors', owner:'Store Manager', dueDate:'2026-04-30', status:'open' },{ id:'c2', action:'Cross-train 2 cashiers', owner:'Store Manager', dueDate:'2026-05-15', status:'open' }], implementation:'Vendor outreach begins week of 1 April. Training starts 15 April.', metrics:[{ id:'m1', name:'Replenishment Lead Time', before:'240', after:'', unit:'minutes' }], results:'', achieved:'', standardisation:'Manifest requirement in vendor agreement. Cross-training in associate handbook.', lessonsLearned:'', nextCycle:'After replenishment speed — target shrinkage rate from 1.8% to 1.0%.' })
        seeded.push('Retail')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 8. WAREHOUSING — Inbound to Outbound
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Warehouse Fulfilment'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Warehousing') } else {
        const pid = await proj({ name: nm, industry: 'warehousing_distribution', customer: 'E-commerce Retailer',
          description: 'Full inbound-to-outbound warehouse flow. 7 steps. Bottleneck at Pick — accuracy 96.8%, target 99.5%.' })
        const s0 = await stp(pid, 0, { name: 'Inbound Receiving & Scan', department: 'Receiving', operators: 2, cycle_time: 8, wait_time: 30, wip: 25, uptime: 100, defect_rate: 4 })
        const s1 = await stp(pid, 1, { name: 'Put-away', department: 'Receiving', operators: 2, cycle_time: 6, wait_time: 20, wip: 18, uptime: 100, defect_rate: 2 })
        const s2 = await stp(pid, 2, { name: 'Pick', department: 'Operations', operators: 6, cycle_time: 4, wait_time: 2, wip: 40, uptime: 100, defect_rate: 3.2, notes: 'BOTTLENECK — 96.8% accuracy. 3.2% mis-picks drive returns and chargebacks.' })
        const s3 = await stp(pid, 3, { name: 'Pack & Label', department: 'Operations', operators: 4, cycle_time: 3, wait_time: 1, wip: 30, uptime: 100, defect_rate: 1 })
        const s4 = await stp(pid, 4, { name: 'Quality Check — Sample', department: 'Quality', operators: 1, cycle_time: 2, wait_time: 5, wip: 10, uptime: 100, defect_rate: 0 })
        const s5 = await stp(pid, 5, { name: 'Sortation & Load', department: 'Dispatch', operators: 2, cycle_time: 2, wait_time: 10, wip: 20, uptime: 98, defect_rate: 0.5 })
        const s6 = await stp(pid, 6, { name: 'Returns Processing', department: 'Receiving', operators: 1, cycle_time: 5, wait_time: 60, wip: 15, uptime: 100, defect_rate: 5 })
        await td(s2.id, pid, 'stopwatch', { baseline: 6, target: 3.5, mean: 4, laps: [3.5,4.5,4,5,3.8,4.2,4,4.8,3.6,4.2], notes: 'Pick avg 4 min/order. Target 3.5 min. 3.2% mis-pick rate drives chargebacks from client.' })
        await td(s2.id, pid, 'ishikawa', { problem: '3.2% mis-pick rate — 96.8% accuracy vs 99.5% client SLA', framework: '6M Manufacturing', causes: { Machine: ['Single-scan barcode system — no confirmation scan at pack','Pick labels print 2-min before pick — wrong labels on shelf'], Method: ['Zone picking — pickers crossing zones causes confusion','No check-digit verification on similar SKUs'], Material: ['Similar product packaging on adjacent bins','Bin labels sun-faded in south aisle'], Manpower: ['New associates trained 2 days — industry standard 5-7 days','No buddy system for first 30 picks'], Measurement: ['Accuracy tracked daily but not by associate — no individual coaching data'], 'Mother Nature': ['Peak season doubles daily volume — errors increase under pressure'] } })
        await td(s2.id, pid, 'fivewhy', { problem: '3.2% mis-pick rate — chargebacks costing $1,400/month', whys: [{ q:'Why 3.2% mis-pick rate?', a:'Pickers selecting wrong SKU from bin — similar packaging on adjacent locations.' },{ q:'Why similar packaging adjacent?', a:'Slotting done by SKU number sequence, not by packaging similarity risk.' },{ q:'Why number-sequence slotting?', a:'WMS default setting. Never reviewed after initial setup.' },{ q:'Why never reviewed?', a:'No slotting review process. WMS admin is same person as pick supervisor — no bandwidth.' },{ q:'Why no bandwidth?', a:'ROOT CAUSE: No dedicated continuous improvement role. Operational firefighting consumes all supervisory capacity.' }], rootCause: 'No CI role or structured improvement process. Slotting never reviewed — similar packaging adjacent by default.', countermeasure: '1. Re-slot top 50 error SKUs — separate similar packaging. 2. Confirmation scan at pack station. 3. Individual accuracy tracking by associate.', owner: 'Warehouse Manager', dueDate: '2026-04-30' })
        await td(s2.id, pid, 'waste', { selected: ['Defects','Motion','Transportation'], notes: { Defects:'3.2% mis-pick rate — returns processing + chargebacks = $1,400/month', Motion:'Pickers walk avg 2.4 miles/shift due to non-optimised slotting', Transportation:'Returns travel full warehouse loop before restocking — no direct returns lane' } })
        await td(s2.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Re-slot top 50 error SKUs', description:'Identify top 50 SKUs by mis-pick frequency. Separate similar packaging by minimum 2 bins. Add secondary barcode confirmation. Target: accuracy from 96.8% to 99.5%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Warehouse Manager', dueDate:'2026-04-15', actions:['Pull 90-day mis-pick data by SKU','Map top 50 to current bin locations','Design new slotting plan','Execute re-slot over 1 weekend','Confirm scan at pack station'] }] })
        await td(s2.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Pick Accuracy', baseline:96.8, target:99.5, actual:null, unit:'%', status:'in-progress', owner:'Warehouse Manager', dueDate:'2026-06-01' }] })
        await td(s2.id, pid, 'pdca', { projectTitle:'Pick Accuracy to 99.5%', problemStatement:'96.8% pick accuracy. $1,400/month chargebacks. Client SLA is 99.5% or contract penalty.', background:'350-order/day warehouse. 6 pickers. 8,500 active SKUs. Client SLA at risk.', team:[{ id:'t1', name:'Warehouse Manager', role:'Lead' }], startDate:'2026-03-15', targetDate:'2026-06-01', currentCondition:'96.8% accuracy. Similar packaging adjacent. No individual tracking. Single scan point.', targetCondition:'99.5% accuracy. Top error SKUs separated. Confirmation scan at pack. Individual tracking by associate.', rootCause:'No slotting review. Similar packaging adjacent by WMS default. No individual accuracy data for coaching.', hypothesis:'Re-slot top 50 + confirmation scan = accuracy from 96.8% to 99.5% within 60 days.', countermeasures:[{ id:'c1', action:'Re-slot top 50 error SKUs', owner:'Warehouse Manager', dueDate:'2026-04-15', status:'open' },{ id:'c2', action:'Confirmation scan at pack station', owner:'WMS Admin', dueDate:'2026-04-01', status:'open' }], implementation:'Scan update live 1 April. Re-slot weekend of 12-13 April.', metrics:[{ id:'m1', name:'Pick Accuracy', before:'96.8', after:'', unit:'%' }], results:'', achieved:'', standardisation:'Slotting review quarterly. Accuracy by associate in daily management system.', lessonsLearned:'', nextCycle:'After accuracy — target lines per hour from 85 to 110.' })
        seeded.push('Warehousing')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 9. HOTEL — Guest Experience Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Hotel Guest Stay Flow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Hotel') } else {
        const pid = await proj({ name: nm, industry: 'hotel_hospitality', customer: 'Hotel Guest',
          description: 'Full guest stay lifecycle. 6 steps. Bottleneck at Housekeeping Turnover — 62-min average vs 45-min standard.' })
        const s0 = await stp(pid, 0, { name: 'Reservation & Pre-Arrival', department: 'Reservations', operators: 1, cycle_time: 8, wait_time: 0, wip: 40, uptime: 100, defect_rate: 3 })
        const s1 = await stp(pid, 1, { name: 'Check-in', department: 'Front Desk', operators: 2, cycle_time: 5, wait_time: 8, wip: 12, uptime: 100, defect_rate: 4 })
        const s2 = await stp(pid, 2, { name: 'In-Stay Service', department: 'All Departments', operators: 8, cycle_time: 0, wait_time: 0, wip: 120, uptime: 96, defect_rate: 6 })
        const s3 = await stp(pid, 3, { name: 'Housekeeping Room Turnover', department: 'Housekeeping', operators: 4, cycle_time: 62, wait_time: 15, wip: 30, uptime: 100, defect_rate: 8, notes: 'BOTTLENECK — 62-min avg vs 45-min standard. 8% rooms fail inspection.' })
        const s4 = await stp(pid, 4, { name: 'Check-out', department: 'Front Desk', operators: 1, cycle_time: 4, wait_time: 5, wip: 15, uptime: 100, defect_rate: 2 })
        const s5 = await stp(pid, 5, { name: 'Post-Stay Review & Follow-up', department: 'Guest Services', operators: 1, cycle_time: 3, wait_time: 1440, wip: 25, uptime: 100, defect_rate: 0 })
        await td(s3.id, pid, 'stopwatch', { baseline: 75, target: 40, mean: 62, laps: [55,70,62,75,58,65,62,72,55,68], notes: 'Housekeeping avg 62 min. Standard 45. 8% fail first inspection. 3pm check-in deadline creates pressure after 12pm wave.' })
        await td(s3.id, pid, 'ishikawa', { problem: 'Room turnover 62 min vs 45-min standard — rooms not ready at 3pm check-in', framework: '8P Service', causes: { People: ['No housekeeping standard work sheet — each attendant has own sequence','New attendants take 90+ min until week 3'], Process: ['Linen delivered to floors in one batch — attendant waits for delivery','No priority sequence — checkout order not communicated to housekeeping'], Policy: ['Inspection done only after room reported complete — doubles the supervisor trip'], Place: ['Trolley stored at end of corridor — 3 trips per room to collect supplies'], 'Products/Services': ['Amenity kit restocking done during turnover — could be pre-staged'], Price: ['Linen laundered on-site — capacity constraint causes delays'], Promotion: ['Late checkout (1pm) not communicated to housekeeping in advance'], 'Physical evidence': ['Inspection checklist paper-based — results not visible to front desk until typed'] } })
        await td(s3.id, pid, 'fivewhy', { problem: 'Room turnover averaging 62 min — 38% over 45-min standard', whys: [{ q:'Why 62-min average turnover?', a:'Attendants make multiple trips to trolley for supplies — trolley not at room.' },{ q:'Why trolley not at room?', a:'Single corridor trolley serves 8 rooms — attendant cannot keep it at current room.' },{ q:'Why one trolley per corridor?', a:'Trolley budget allocated 1 per 8 rooms. Never reviewed despite room mix change.' },{ q:'Why not reviewed?', a:'No housekeeping performance review process. Manager tracks complaints, not cycle time.' },{ q:'Why no cycle-time tracking?', a:'ROOT CAUSE: No standard work sheet or time measurement for housekeeping. Performance never quantified — only complaints.' }], rootCause: 'No standard work or time measurement for housekeeping. Trolley allocation based on outdated room mix. Performance invisible until guest complains.', countermeasure: '1. Standard work sheet per room type. 2. One trolley per 5 rooms during peak hours. 3. Pre-stage amenity kits.', owner: 'Housekeeping Manager', dueDate: '2026-04-30' })
        await td(s3.id, pid, 'waste', { selected: ['Motion','Waiting','Defects'], notes: { Motion:'Attendants make avg 4 trips to trolley per room — 12 min of motion per turnover', Waiting:'Rooms wait avg 15 min in queue after attendant finishes previous room', Defects:'8% fail first inspection — re-clean adds 20 min and delays front desk' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Standard work sheet per room type', description:'One-page standard turnover sequence for king, queen, and twin rooms. Time study done. Target: avg turnover from 62 to 42 min.', category:'Productivity', priority:'critical', status:'in-progress', owner:'Housekeeping Manager', dueDate:'2026-04-15', actions:['Time study 10 turnovers per room type','Identify NVA steps','Design standard sequence','Laminate and post in trolley','Train all attendants'] },{ id:'kz2', kzId:'KZ-002', title:'Pre-stage amenity kits by room type', description:'Amenity kits pre-packed by room type in trolley before shift. Eliminates mid-turnover restocking.', category:'Productivity', priority:'high', status:'open', owner:'Housekeeping Supervisor', dueDate:'2026-04-30', actions:['Count amenities per room type','Pack kits before shift brief','Measure time saving per room'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Room Turnover Time', baseline:62, target:42, actual:null, unit:'minutes', status:'in-progress', owner:'Housekeeping Manager', dueDate:'2026-06-01' }] })
        seeded.push('Hotel')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 10. RETAIL BANKING — Loan Application
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Retail Banking Loan Process'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Banking') } else {
        const pid = await proj({ name: nm, industry: 'retail_banking', customer: 'Loan Applicant',
          description: 'Personal loan: inquiry to funding. 7 steps. 18-day average vs 5-day competitor. Bottleneck at Underwriting.' })
        const s0 = await stp(pid, 0, { name: 'Customer Inquiry & Pre-screen', department: 'Branch / Digital', operators: 1, cycle_time: 20, wait_time: 60, wip: 30, uptime: 100, defect_rate: 5 })
        const s1 = await stp(pid, 1, { name: 'Application Completion', department: 'Branch / Relationship', operators: 1, cycle_time: 45, wait_time: 1440, wip: 18, uptime: 100, defect_rate: 22 })
        const s2 = await stp(pid, 2, { name: 'Document Collection & Verify', department: 'Operations', operators: 2, cycle_time: 60, wait_time: 2880, wip: 12, uptime: 100, defect_rate: 35 })
        const s3 = await stp(pid, 3, { name: 'Credit Assessment & Underwriting', department: 'Credit', operators: 2, cycle_time: 90, wait_time: 4320, wip: 20, uptime: 100, defect_rate: 18, notes: 'BOTTLENECK — 3-day wait. 18% of files returned due to incomplete documents.' })
        const s4 = await stp(pid, 4, { name: 'Approval & Offer Letter', department: 'Credit', operators: 1, cycle_time: 30, wait_time: 1440, wip: 8, uptime: 100, defect_rate: 5 })
        const s5 = await stp(pid, 5, { name: 'Customer Acceptance & Documentation', department: 'Branch', operators: 1, cycle_time: 40, wait_time: 2880, wip: 6, uptime: 100, defect_rate: 8 })
        const s6 = await stp(pid, 6, { name: 'Funding & Account Setup', department: 'Operations', operators: 1, cycle_time: 20, wait_time: 480, wip: 5, uptime: 100, defect_rate: 2 })
        await td(s3.id, pid, 'stopwatch', { baseline: 5760, target: 1440, mean: 4320, laps: [3600,5760,4320,7200,4320,4320,5760,3600,4320,4320], notes: 'Underwriting avg wait 3 days (4,320 min). 18% files returned for missing docs — restart the clock.' })
        await td(s3.id, pid, 'ishikawa', { problem: '18-day application-to-funding vs 5-day competitor — 35% document error rate', framework: '8P Service', causes: { People: ['Relationship managers collect inconsistent document sets','Underwriters manually check every document — no automated pre-screen'], Process: ['No document checklist by loan type — ad-hoc collection','Files submitted to underwriting before completeness check'], Policy: ['3-day underwriter SLA — no escalation for incomplete files'], Place: ['Paper-based processing — files couriered between branches and HQ'], 'Products/Services': ['5 different loan products with different document requirements'], Price: ['Legacy IT system — no digital document upload capability'], Promotion: ['Customer not informed of required documents before appointment'], 'Physical evidence': ['No digital loan file — documents re-scanned at multiple stages'] } })
        await td(s3.id, pid, 'fivewhy', { problem: '35% of loan applications have document errors — files returned from underwriting', whys: [{ q:'Why 35% document error rate?', a:'Relationship managers collect incorrect or incomplete documents at application.' },{ q:'Why incorrect documents?', a:'No standardised checklist — each RM uses personal experience.' },{ q:'Why no checklist?', a:'5 loan products have different requirements — no single source of truth published.' },{ q:'Why no published standard?', a:'Product team updates requirements in internal memos — not in a living operational document.' },{ q:'Why memos only?', a:'ROOT CAUSE: No process owner for loan origination workflow. Product and operations operate independently.' }], rootCause: 'No process owner for loan origination. Product and operations independently update requirements without synchronising operational procedures.', countermeasure: '1. Publish loan-type document checklist. 2. Mandatory pre-underwriting completeness check. 3. Appoint loan origination process owner.', owner: 'Operations Manager', dueDate: '2026-05-01' })
        await td(s3.id, pid, 'waste', { selected: ['Waiting','Defects','Transportation','Overprocessing'], notes: { Waiting:'Files wait 3 days in underwriting queue — pure idle time', Defects:'35% document error rate — returned files restart the clock', Transportation:'Paper files physically moved between branch and HQ — adds 1-day delay', Overprocessing:'Underwriters manually verify documents that could be auto-checked against criteria' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Loan-type document checklist — mandatory pre-submission', description:'Standardised checklist for each of 5 loan types. RM completes and signs before submission to underwriting. Target: document error rate from 35% to 5%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Operations Manager', dueDate:'2026-04-30', actions:['Map requirements for all 5 loan types','Design 1-page checklist per type','Pilot with 3 RMs for 2 weeks','Deploy to all branches','Measure return rate'] },{ id:'kz2', kzId:'KZ-002', title:'Digital document upload at point of application', description:'Customer uploads documents via portal at time of appointment booking. Eliminates paper courier and 1-day physical delay.', category:'Delivery', priority:'high', status:'open', owner:'IT / Digital', dueDate:'2026-07-01', actions:['Scope digital upload portal','IT build estimate','Pilot with digital-first customers','Roll out to all channels'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Application to Funding Time', baseline:18, target:5, actual:null, unit:'days', status:'in-progress', owner:'Operations Manager', dueDate:'2026-09-01' }] })
        seeded.push('Banking')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 11. CONSTRUCTION — Build Sequence
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Construction Build Workflow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Construction') } else {
        const pid = await proj({ name: nm, industry: 'construction', customer: 'Building Owner',
          description: 'Residential build sequence. 7 phases. Bottleneck at MEP rough-in — coordination failures cause 4-day average delays.' })
        const s0 = await stp(pid, 0, { name: 'Site Mobilisation & Setup', department: 'Site Management', operators: 4, cycle_time: 2880, wait_time: 1440, wip: 1, uptime: 100, defect_rate: 0 })
        const s1 = await stp(pid, 1, { name: 'Foundations & Groundworks', department: 'Civil', operators: 6, cycle_time: 11520, wait_time: 2880, wip: 1, uptime: 90, defect_rate: 8 })
        const s2 = await stp(pid, 2, { name: 'Frame & Structure', department: 'Carpentry', operators: 8, cycle_time: 14400, wait_time: 1440, wip: 1, uptime: 95, defect_rate: 5 })
        const s3 = await stp(pid, 3, { name: 'MEP Rough-in', department: 'MEP Trades', operators: 12, cycle_time: 11520, wait_time: 5760, wip: 3, uptime: 100, defect_rate: 18, notes: 'BOTTLENECK — coordination failures cause avg 4-day rework. 18% of inspections fail first visit.' })
        const s4 = await stp(pid, 4, { name: 'Insulation & Drywall', department: 'Drywall', operators: 6, cycle_time: 8640, wait_time: 2880, wip: 1, uptime: 100, defect_rate: 4 })
        const s5 = await stp(pid, 5, { name: 'Finishes & Fit-out', department: 'Multiple Trades', operators: 10, cycle_time: 14400, wait_time: 1440, wip: 2, uptime: 100, defect_rate: 12 })
        const s6 = await stp(pid, 6, { name: 'Commissioning & Handover', department: 'Site Management', operators: 3, cycle_time: 2880, wait_time: 1440, wip: 1, uptime: 100, defect_rate: 6 })
        await td(s3.id, pid, 'stopwatch', { baseline: 14400, target: 11520, mean: 11520, laps: [11520,14400,11520,17280,10080,13440,11520,15360,11520,12960], notes: 'MEP rough-in avg 8 days. Coordination failure can extend to 12+ days. 18% first inspection fail.' })
        await td(s3.id, pid, 'ishikawa', { problem: '18% MEP first inspection fail — avg 4-day rework delay per failure', framework: '6M Manufacturing', causes: { Machine: ['No BIM clash detection — pipes and conduit designed independently','Inspection booking 5-day lead time — failed inspection adds 10 days minimum'], Method: ['MEP trades work in sequence not parallel — no co-ordination meetings','No standard drawing review before rough-in begins'], Material: ['Design drawings not updated after structural change — 3 clash points'], Manpower: ['Electrical and plumbing subs never on site simultaneously — coordination impossible','Site manager allocates MEP bays without trade sign-off'], Measurement: ['No daily MEP progress board — problems discovered at inspection'], 'Mother Nature': ['Winter weather delays pour — compressed MEP schedule increases clash risk'] } })
        await td(s3.id, pid, 'fivewhy', { problem: '18% MEP first inspection fail', whys: [{ q:'Why 18% first inspection fail?', a:'Electrical and plumbing running in same wall cavity without coordination.' },{ q:'Why no coordination?', a:'MEP trades scheduled sequentially — never on site simultaneously.' },{ q:'Why sequentially?', a:'Programme shows sequential schedule — no concurrent MEP zone built in.' },{ q:'Why no concurrent zone?', a:'Estimator and programme planner not aware of coordination requirement.' },{ q:'Why not aware?', a:'ROOT CAUSE: No MEP coordination protocol in project management system. Responsibility assumed but never assigned.' }], rootCause: 'No MEP coordination protocol. Responsibility for clash prevention assumed by all trades — owned by none.', countermeasure: '1. Weekly MEP coordination meeting with all trades. 2. BIM clash detection before rough-in sign-off. 3. Trade sign-off checklist before inspection booked.', owner: 'Site Manager', dueDate: '2026-04-30' })
        await td(s3.id, pid, 'waste', { selected: ['Defects','Waiting','Transportation'], notes: { Defects:'18% fail rate — avg 4-day rework per failure + inspector re-attend delay', Waiting:'5-day inspection booking lead time. Failed inspection restarts the 5-day clock.', Transportation:'Materials delivered before trades ready — stored on site 2+ weeks creating damage risk' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Weekly MEP coordination meeting', description:'All MEP trade leads on site every Tuesday at 7am. 30-min coordination. Clash identification before installation. Target: first inspection pass rate from 82% to 98%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Site Manager', dueDate:'2026-04-01', actions:['Schedule recurring Tuesday MEP meeting','Define attendance as sub-contract requirement','Create clash checklist','Track first-pass rate weekly'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'MEP First Inspection Pass Rate', baseline:82, target:98, actual:null, unit:'%', status:'in-progress', owner:'Site Manager', dueDate:'2026-06-01' }] })
        seeded.push('Construction')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 12. CONTACT CENTRE — Issue Resolution Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Contact Centre Resolution Flow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Contact Centre') } else {
        const pid = await proj({ name: nm, industry: 'contact_center', customer: 'Customer',
          description: 'Inbound contact to full resolution. 6 steps. Bottleneck at issue resolution — 28% repeat contacts within 7 days (low FCR).' })
        const s0 = await stp(pid, 0, { name: 'Contact Receipt & Queue', department: 'Contact Centre', operators: 1, cycle_time: 2, wait_time: 4, wip: 25, uptime: 100, defect_rate: 0 })
        const s1 = await stp(pid, 1, { name: 'Authentication & ID', department: 'Contact Centre', operators: 1, cycle_time: 1.5, wait_time: 0.5, wip: 15, uptime: 100, defect_rate: 3 })
        const s2 = await stp(pid, 2, { name: 'Issue Identification & Diagnosis', department: 'Contact Centre', operators: 1, cycle_time: 4, wait_time: 1, wip: 12, uptime: 100, defect_rate: 15, notes: '15% diagnoses incorrect — leads to wrong resolution and repeat contact' })
        const s3 = await stp(pid, 3, { name: 'Resolution & Action', department: 'Contact Centre', operators: 1, cycle_time: 6, wait_time: 2, wip: 10, uptime: 100, defect_rate: 28, notes: 'BOTTLENECK — 28% repeat contact within 7 days = low FCR' })
        const s4 = await stp(pid, 4, { name: 'Confirmation & Close', department: 'Contact Centre', operators: 1, cycle_time: 2, wait_time: 0, wip: 8, uptime: 100, defect_rate: 5 })
        const s5 = await stp(pid, 5, { name: 'Post-contact Survey & Log', department: 'Contact Centre', operators: 1, cycle_time: 1, wait_time: 1440, wip: 40, uptime: 100, defect_rate: 0 })
        await td(s3.id, pid, 'stopwatch', { baseline: 12, target: 7, mean: 8, laps: [6,10,8,12,7,9,8,11,7,8], notes: 'Handle time avg 8 min. 28% repeat contact within 7 days. FCR 72% vs 85% target.' })
        await td(s3.id, pid, 'ishikawa', { problem: '28% repeat contact within 7 days — FCR 72% vs 85% target', framework: '8P Service', causes: { People: ['Agents resolve symptom not root cause — no investigation protocol','New agents (< 3 months) have 45% repeat rate vs 18% for experienced'], Process: ['No knowledge base search step in resolution protocol','No verification that customer issue resolved before call close'], Policy: ['AHT target incentivises short calls — penalises thorough resolution','No root-cause coding in CRM — repeat reasons not tracked'], Place: ['Agent desktop has 4 separate systems — context switching mid-call'], 'Products/Services': ['Top 3 repeat issues are product defects — no feedback loop to product team'], Price: ['Workforce management uses AHT not FCR for staffing — wrong metric'], Promotion: ['Self-service knowledge base not updated — agents cannot signpost customers'], 'Physical evidence': ['No confirmation checklist before call close — verbal close only'] } })
        await td(s3.id, pid, 'fivewhy', { problem: '28% repeat contact within 7 days', whys: [{ q:'Why 28% repeat contact?', a:'Issues resolved at symptom level — root cause not addressed.' },{ q:'Why symptom-only resolution?', a:'No investigation protocol. Agents ask what the issue is, not why it occurred.' },{ q:'Why no investigation protocol?', a:'Training focuses on system navigation, not problem-solving methodology.' },{ q:'Why system-only training?', a:'Training designed by IT, not by operations. No agent voice in training design.' },{ q:'Why no agent input?', a:'ROOT CAUSE: Training programme owned by IT with no Operations governance. No mechanism for agent experience to inform training content.' }], rootCause: 'Training programme owned by IT with no Operations governance. Agents trained on systems, not on resolution methodology.', countermeasure: '1. Add root-cause investigation step to resolution protocol. 2. Operations-led training redesign. 3. FCR replace AHT as primary agent metric.', owner: 'Contact Centre Manager', dueDate: '2026-05-01' })
        await td(s3.id, pid, 'waste', { selected: ['Defects','Waiting','Overprocessing'], notes: { Defects:'28% repeat contact — each repeat call costs avg $4.50. 280 repeats/day = $1,260/day waste.', Waiting:'Queue wait avg 4 min — 40% of contacts drop before answer', Overprocessing:'Agents enter same data into 4 separate systems per call — avg 90s pure re-entry' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Root-cause investigation step in resolution protocol', description:'Add mandatory "why did this happen?" step before resolution. Script and knowledge base lookup required. Target: FCR from 72% to 85%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Contact Centre Manager', dueDate:'2026-04-15', actions:['Design investigation script','Add to agent desktop as step 3','Train all agents in 2-week rollout','Measure FCR weekly'] },{ id:'kz2', kzId:'KZ-002', title:'Replace AHT with FCR as primary agent metric', description:'FCR incentivises thorough resolution. AHT incentivises short calls that repeat. Target: align metric to customer outcome.', category:'Productivity', priority:'high', status:'open', owner:'Workforce Manager', dueDate:'2026-05-01', actions:['Model FCR tracking in WFM system','Design new performance dashboard','Communicate change to agents and supervisors'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'First Contact Resolution Rate', baseline:72, target:85, actual:null, unit:'%', status:'in-progress', owner:'Contact Centre Manager', dueDate:'2026-07-01' }] })
        seeded.push('Contact Centre')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 13. MARKETING AGENCY — Campaign Delivery
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Marketing Agency Campaign Flow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Marketing') } else {
        const pid = await proj({ name: nm, industry: 'marketing_agency', customer: 'Brand Client',
          description: 'Brief to campaign-in-market. 6 stages. Bottleneck at client approval — 3.2 revision rounds average.' })
        const s0 = await stp(pid, 0, { name: 'Brief Intake & Scoping', department: 'Account Management', operators: 1, cycle_time: 120, wait_time: 1440, wip: 8, uptime: 100, defect_rate: 25 })
        const s1 = await stp(pid, 1, { name: 'Strategy & Concept Development', department: 'Strategy', operators: 2, cycle_time: 480, wait_time: 480, wip: 5, uptime: 100, defect_rate: 20 })
        const s2 = await stp(pid, 2, { name: 'Creative Production', department: 'Creative', operators: 3, cycle_time: 960, wait_time: 240, wip: 6, uptime: 100, defect_rate: 15 })
        const s3 = await stp(pid, 3, { name: 'Internal Review & QC', department: 'Creative Director', operators: 1, cycle_time: 120, wait_time: 480, wip: 8, uptime: 100, defect_rate: 30 })
        const s4 = await stp(pid, 4, { name: 'Client Approval', department: 'Account Management', operators: 1, cycle_time: 60, wait_time: 2880, wip: 10, uptime: 100, defect_rate: 45, notes: 'BOTTLENECK — 45% of presentations require revision. Avg 3.2 rounds.' })
        const s5 = await stp(pid, 5, { name: 'Production & Campaign Launch', department: 'Production', operators: 2, cycle_time: 360, wait_time: 480, wip: 4, uptime: 100, defect_rate: 5 })
        await td(s4.id, pid, 'stopwatch', { baseline: 7200, target: 2880, mean: 4320, laps: [2880,5760,4320,7200,3600,4320,5760,4320,3600,4320], notes: 'Client approval wait avg 3 days. 45% presentations need revision. 3.2 rounds average.' })
        await td(s4.id, pid, 'ishikawa', { problem: '45% presentations require revision — 3.2 rounds average vs 1.2 target', framework: '8P Service', causes: { People: ['Brief ambiguity not resolved before creative starts','Account managers avoid challenging client brief changes mid-project'], Process: ['No creative brief sign-off from client before work begins','Presentations sent without strategic rationale — creative looks disconnected'], Policy: ['Unlimited revisions in contract — no cost to client for changes'], Place: ['Creative presented over email — context lost without conversation'], 'Products/Services': ['Brand guidelines 3 years old — creative team guessing on new brand direction'], Price: ['Fixed-fee contracts — revision cost absorbed by agency'], Promotion: ['Client stakeholders not aligned before agency presentation'], 'Physical evidence': ['No version history — client confuses rounds in long email chains'] } })
        await td(s4.id, pid, 'fivewhy', { problem: '3.2 revision rounds per campaign — 45% first-presentation fail rate', whys: [{ q:'Why 45% first-presentation fail?', a:'Client brief changes after strategy is confirmed — creative becomes misaligned.' },{ q:'Why brief changes after confirmation?', a:'Brief not signed off by all decision-makers — senior stakeholder changes direction.' },{ q:'Why not all stakeholders involved?', a:'Brief meetings typically include marketing manager only — CMO sees work at presentation.' },{ q:'Why CMO not in brief?', a:'Agency account process never required CMO attendance at brief stage.' },{ q:'Why not required?', a:'ROOT CAUSE: No brief sign-off protocol. Agency accepts verbal brief from any client contact without confirming final authority.' }], rootCause: 'No brief sign-off protocol. Agency accepts brief from any contact without confirming decision-making authority.', countermeasure: '1. Mandatory brief sign-off by decision-maker before creative begins. 2. Present strategic rationale before creative. 3. Revision limit in contract.', owner: 'Managing Director', dueDate: '2026-04-30' })
        await td(s4.id, pid, 'waste', { selected: ['Defects','Waiting','Overproduction'], notes: { Defects:'45% presentations fail first round — avg 2.2 days rework per revision', Waiting:'Client approval wait avg 3 days — creative team idle while waiting', Overproduction:'Creative team produces 3-4 concepts when only 1 needed — brief ambiguity forces options' } })
        await td(s4.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Mandatory brief sign-off by decision-maker', description:'Brief accepted only with written sign-off by named decision-maker. All client stakeholders attend brief or nominate proxy. Target: revision rounds from 3.2 to 1.5.', category:'Quality', priority:'critical', status:'in-progress', owner:'Managing Director', dueDate:'2026-04-15', actions:['Draft brief sign-off form','Add to client onboarding pack','Communicate to account managers','Track revision rounds by client'] }] })
        await td(s4.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Revision Rounds per Campaign', baseline:3.2, target:1.5, actual:null, unit:'rounds', status:'in-progress', owner:'Managing Director', dueDate:'2026-06-01' }] })
        seeded.push('Marketing')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 14. REAL ESTATE — Transaction Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Real Estate Transaction Flow'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Real Estate') } else {
        const pid = await proj({ name: nm, industry: 'real_estate', customer: 'Home Buyer',
          description: 'Lead to closed transaction. 7 steps. Bottleneck at Financing & Underwriting — 28% file kickback rate.' })
        const s0 = await stp(pid, 0, { name: 'Lead Inquiry & Response', department: 'Sales', operators: 1, cycle_time: 25, wait_time: 480, wip: 12, uptime: 100, defect_rate: 0 })
        const s1 = await stp(pid, 1, { name: 'Qualify & Buyer Consultation', department: 'Sales', operators: 1, cycle_time: 90, wait_time: 2880, wip: 6, uptime: 100, defect_rate: 15 })
        const s2 = await stp(pid, 2, { name: 'Property Search & Showings', department: 'Sales', operators: 1, cycle_time: 480, wait_time: 1440, wip: 8, uptime: 100, defect_rate: 0 })
        const s3 = await stp(pid, 3, { name: 'Offer & Negotiation', department: 'Sales', operators: 1, cycle_time: 120, wait_time: 2880, wip: 4, uptime: 100, defect_rate: 35 })
        const s4 = await stp(pid, 4, { name: 'Inspection & Appraisal', department: 'Operations', operators: 1, cycle_time: 240, wait_time: 7200, wip: 3, uptime: 100, defect_rate: 22 })
        const s5 = await stp(pid, 5, { name: 'Financing & Underwriting', department: 'Lender Liaison', operators: 1, cycle_time: 600, wait_time: 14400, wip: 5, uptime: 100, defect_rate: 28, notes: 'BOTTLENECK — 3-day lender wait + 28% file kickback' })
        const s6 = await stp(pid, 6, { name: 'Closing & Handover', department: 'Operations', operators: 1, cycle_time: 180, wait_time: 2880, wip: 3, uptime: 100, defect_rate: 5 })
        await td(s5.id, pid, 'fivewhy', { problem: '28% of financing files kicked back by lender — adds 3-5 days', whys: [{ q:'Why 28% kickbacks?', a:'Files submitted before all documents collected and verified.' },{ q:'Why before complete?', a:'No standard pre-submission checklist. Each agent assembles files differently.' },{ q:'Why no checklist?', a:'Requirements vary by loan type — no master checklist built per type.' },{ q:'Why no master checklist?', a:'No formal process owner for transaction coordination workflows.' },{ q:'Why no process owner?', a:'ROOT CAUSE: Brokerage treats every transaction as one-off agent work. No standard work for the TC role.' }], rootCause: 'No standard work or loan-type document checklist for transaction coordinators.', countermeasure: '1. Loan-type checklists. 2. Pre-submission mandatory review. 3. Assign TC process owner with defined SOP.', owner: 'Broker', dueDate: '2026-04-30' })
        await td(s5.id, pid, 'waste', { selected: ['Defects','Waiting','Transportation'], notes: { Defects:'28% kickback rate — restart the clock on 3-day underwriting wait', Waiting:'10-day lender processing with zero queue visibility', Transportation:'Paper documents physically routed — digital would eliminate 1-day physical delay' } })
        await td(s5.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Loan-type document checklists', description:'Build pre-submission checklists for conventional, FHA, VA, and jumbo loans. Target: kickback rate from 28% to under 5%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Operations Manager', dueDate:'2026-04-15', actions:['Interview top 3 lenders for requirements','Build checklist in TC system','Train all agents','Track kickback rate weekly'] }] })
        await td(s5.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Document Kickback Rate', baseline:28, target:5, actual:null, unit:'%', status:'in-progress', owner:'Operations Manager', dueDate:'2026-06-01' }] })
        await td(s5.id, pid, 'ishikawa', { problem: '45-day close time vs 30-day market average — 28% file kickbacks from lender', framework: '8P Service', causes: { People: ['Agents collect inconsistent document sets — no standard','New agents unfamiliar with loan-type requirements'], Process: ['No TC checklist. Files submitted to lender before completeness verified','Offer-to-inspection scheduling adds 5-day wait with no agent control'], Policy: ['Agents not required to use TC — some handle own files'], Place: ['Paper-based filing — documents lost or duplicated'], 'Products/Services': ['4 loan types each with different document requirements'], Price: ['TC not a mandatory cost — agents avoid using one'], Promotion: ['Buyers not pre-educated on document requirements before offer'], 'Physical evidence': ['No digital transaction management system — email is source of truth'] } })
        await td(s3.id, pid, 'stopwatch', { baseline: 5760, target: 2880, mean: 4320, laps: [2880,5760,4320,7200,3600,4320,5040,4320,2880,4320], notes: 'Negotiation avg 3 days. 35% of first offers rejected. Avg 1.8 rounds of counter-offer.' })
        seeded.push('Real Estate')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 15. PHARMACEUTICAL MANUFACTURING — Batch Release
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Pharmaceutical Batch Release'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Pharma') } else {
        const pid = await proj({ name: nm, industry: 'pharmaceutical_manufacturing', customer: 'Hospital / Pharmacy',
          description: 'Drug product manufacture and QA release. 7 steps. Bottleneck at QC Testing — 12% OOS result rate.' })
        const s0 = await stp(pid, 0, { name: 'Raw Material Receipt & Testing', department: 'QC', operators: 2, cycle_time: 1440, wait_time: 2880, wip: 8, uptime: 100, defect_rate: 4, notes: '4% of raw material lots fail CoA verification' })
        const s1 = await stp(pid, 1, { name: 'Dispensing & Weighing', department: 'Manufacturing', operators: 2, cycle_time: 180, wait_time: 60, wip: 3, uptime: 100, defect_rate: 2 })
        const s2 = await stp(pid, 2, { name: 'Granulation / Formulation', department: 'Manufacturing', operators: 3, cycle_time: 360, wait_time: 30, wip: 2, uptime: 94, defect_rate: 5 })
        const s3 = await stp(pid, 3, { name: 'Compression / Filling', department: 'Manufacturing', operators: 4, cycle_time: 480, wait_time: 60, wip: 3, uptime: 91, defect_rate: 3, notes: 'Compression machine uptime 91% — punch wear causes blend weight variation' })
        const s4 = await stp(pid, 4, { name: 'QC In-Process & Final Testing', department: 'QC Laboratory', operators: 3, cycle_time: 2880, wait_time: 4320, wip: 6, uptime: 100, defect_rate: 12, notes: 'BOTTLENECK — 12% OOS rate. Each OOS triggers investigation adding 5-10 days.' })
        const s5 = await stp(pid, 5, { name: 'Packaging & Labelling', department: 'Packaging', operators: 4, cycle_time: 240, wait_time: 480, wip: 4, uptime: 88, defect_rate: 2 })
        const s6 = await stp(pid, 6, { name: 'QP Review & Batch Release', department: 'Regulatory', operators: 1, cycle_time: 1440, wait_time: 2880, wip: 5, uptime: 100, defect_rate: 8 })
        await td(s4.id, pid, 'stopwatch', { baseline: 5760, target: 2880, mean: 2880, laps: [2880,4320,2880,5760,2880,2880,4320,2880,2880,4320], notes: 'QC testing avg 2 days. 12% OOS investigation adds 5-10 days per incident. Backlog of 6 batches.' })
        await td(s4.id, pid, 'ishikawa', { problem: '12% OOS rate in final QC — each triggers investigation adding 5-10 days to release', framework: '6M Manufacturing', causes: { Machine: ['Compression punches worn — weight variation outside spec','HPLC calibration drift causing false OOS on assay'], Method: ['IPC samples not reviewed in real-time during manufacture','OOS investigation starts after full batch complete — not detected mid-process'], Material: ['API particle size variability between supplier lots','Moisture content of excipients not checked at dispensing'], Manpower: ['Analysts run 6 concurrent tests — sample misidentification risk'], Measurement: ['Method validation outdated — specificity not current with product formulation'], 'Mother Nature': ['Humidity spike in summer affects granulation moisture content'] } })
        await td(s4.id, pid, 'fivewhy', { problem: '12% OOS result rate in final QC', whys: [{ q:'Why 12% OOS rate?', a:'Compression weight variation falls outside specification — exceeds dissolution limits.' },{ q:'Why weight variation?', a:'Punch tooling worn beyond replacement schedule — actual wear faster than assumed.' },{ q:'Why faster wear?', a:'Current blend has increased abrasiveness due to API particle size change — schedule not updated.' },{ q:'Why schedule not updated?', a:'No change control linking API specification change to tooling replacement frequency.' },{ q:'Why no link in change control?', a:'ROOT CAUSE: Change control SOP covers formulation changes but does not require tooling impact assessment.' }], rootCause: 'Change control SOP does not require tooling impact assessment on API specification changes.', countermeasure: '1. Update change control SOP to include tooling impact assessment. 2. Reduce punch replacement interval. 3. Add real-time weight monitoring.', owner: 'QA Manager', dueDate: '2026-05-01' })
        await td(s4.id, pid, 'waste', { selected: ['Defects','Waiting','Overprocessing'], notes: { Defects:'12% OOS rate — each investigation adds 5-10 days and £15,000 QA resource cost', Waiting:'6-batch QC backlog — 4,320-min average wait before testing begins', Overprocessing:'Full batch QC repeated if one OOS result — even when OOS traced to lab error' } })
        await td(s4.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Update change control SOP — tooling impact assessment', description:'Add tooling impact assessment as mandatory field in change control for API spec changes. Immediate punch replacement interval review.', category:'Quality', priority:'critical', status:'in-progress', owner:'QA Manager', dueDate:'2026-04-30', actions:['Redline change control SOP','Review board approval','Immediate punch replacement on affected line','Update replacement schedule'] },{ id:'kz2', kzId:'KZ-002', title:'Real-time weight monitoring on compression', description:'Install real-time weight feedback on compression machine. Alert when weight drifts within 2 sigma of spec limit — corrective action before OOS.', category:'Quality', priority:'high', status:'open', owner:'Engineering', dueDate:'2026-06-01', actions:['Specify weight monitoring system','Validation protocol','IQ/OQ/PQ execution','Release for production'] }] })
        await td(s4.id, pid, 'improvement', { goals: [{ id:'g1', metric:'OOS Result Rate', baseline:12, target:2, actual:null, unit:'%', status:'in-progress', owner:'QA Manager', dueDate:'2026-09-01' }] })
        seeded.push('Pharma')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 16. WINERY — Production Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Boutique Winery Production'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Winery') } else {
        const pid = await proj({ name: nm, industry: 'winery', customer: 'DTC Wine Club & Wholesale',
          description: '2,000-case boutique winery. 18-month lead time. Bottleneck at Barrel Ageing — 6% barrel defect rate.' })
        const s0 = await stp(pid, 0, { name: 'Harvest & Receiving', operators: 4, cycle_time: 480, wait_time: 24, wip: 3, uptime: 100, defect_rate: 8 })
        const s1 = await stp(pid, 1, { name: 'Crush, Destem & SO₂', operators: 2, cycle_time: 120, wait_time: 2, wip: 2, uptime: 97, defect_rate: 2 })
        const s2 = await stp(pid, 2, { name: 'Primary Fermentation', operators: 1, cycle_time: 480, wait_time: 0, wip: 8, uptime: 100, defect_rate: 5 })
        const s3 = await stp(pid, 3, { name: 'Pressing & Separation', operators: 2, cycle_time: 180, wait_time: 12, wip: 4, uptime: 95, defect_rate: 3 })
        const s4 = await stp(pid, 4, { name: 'Malolactic Fermentation', operators: 1, cycle_time: 1440, wait_time: 0, wip: 6, uptime: 100, defect_rate: 8 })
        const s5 = await stp(pid, 5, { name: 'Barrel Ageing & Topping', operators: 1, cycle_time: 13140, wait_time: 0, wip: 80, uptime: 100, defect_rate: 6, notes: 'BOTTLENECK — 80 barrels at capacity. 6% TCA/VA defect. Topping from memory — back barrels missed.' })
        const s6 = await stp(pid, 6, { name: 'Blending, Fining & Filtration', operators: 2, cycle_time: 240, wait_time: 720, wip: 3, uptime: 100, defect_rate: 4 })
        const s7 = await stp(pid, 7, { name: 'Bottling & Labelling', operators: 3, cycle_time: 360, wait_time: 48, wip: 2, uptime: 90, defect_rate: 4 })
        await td(s5.id, pid, 'fivewhy', { problem: '6% of barrels develop TCA or high VA — avg $4,200 loss per barrel', whys: [{ q:'Why 6% TCA or high VA?', a:'TCA from cork contact. High VA from insufficient topping — oxygen exposure.' },{ q:'Why insufficient topping?', a:'Topping schedule managed from memory. Back barrels missed for 3-4 weeks.' },{ q:'Why no topping log?', a:'No barrel tracking system. Each barrel identified by chalk marker only.' },{ q:'Why no tracking?', a:'Winery grew from 400 to 2,000 cases without updating record-keeping.' },{ q:'Why not updated?', a:'ROOT CAUSE: No formal operations review as winery scaled. Processes never reviewed for scalability.' }], rootCause: 'No individual barrel tracking. Topping done from memory — barrels missed.', countermeasure: '1. QR code every barrel. 2. Weekly topping log with sign-off. 3. Monthly SO₂ and VA check per barrel.', owner: 'Winemaker', dueDate: '2026-05-31' })
        await td(s5.id, pid, 'ishikawa', { problem: '6% barrel defect rate (TCA and high VA)', framework: '6M Manufacturing', causes: { Machine: ['Mobile bottling truck — no in-house QC control'], Method: ['Topping schedule from memory — no log','No individual barrel ID system'], Material: ['4th-fill barrels contributing <5% flavour — occupying premium slots','Cork supplier TCA rate 0.8% — above industry average of 0.3%'], Manpower: ['Single cellarman — topping falls behind during harvest season'], Measurement: ['No individual barrel SO₂ or VA tracking'], 'Mother Nature': ['Temperature fluctuation in barrel hall — seasonal extremes accelerate VA formation'] } })
        await td(s5.id, pid, 'waste', { selected: ['Defects','Inventory','Non-Utilisation'], notes: { Defects:'6% barrel defect — $1,200 barrel + $35/bottle wine = $4,200+ per barrel lost', Inventory:'4th-fill+ barrels (18 barrels, 22%) contributing minimal flavour — premium slot waste', 'Non-Utilisation':'Cellarman monitoring 80 barrels manually — 4 hrs/week pure labour that automation could handle' } })
        await td(s5.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Individual barrel QR tracking + topping log', description:'QR code on every barrel. Cellarman scans on each topping. Weekly report flags barrels not topped in 10+ days. Target: defect rate from 6% to under 1%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Winemaker', dueDate:'2026-04-01', actions:['Print QR codes — attach all 80 barrels','Set up topping log in Notion','Train cellarman','First monthly VA and SO₂ check'] }] })
        await td(s5.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Barrel Defect Rate', baseline:6, target:1, actual:null, unit:'%', status:'in-progress', owner:'Winemaker', dueDate:'2026-09-01' }] })
        seeded.push('Winery')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 17. E-COMMERCE FULFILMENT — Order to Door
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — E-Commerce Order Fulfilment'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('E-Commerce') } else {
        const pid = await proj({ name: nm, industry: 'ecommerce_fulfillment', customer: 'Online Shopper',
          description: 'Click to doorstep delivery. 7 steps. Bottleneck at picking — 4.2% order error rate driving $8k/month returns.' })
        const s0 = await stp(pid, 0, { name: 'Order Receipt & Release', department: 'Operations', operators: 1, cycle_time: 1, wait_time: 5, wip: 120, uptime: 100, defect_rate: 0 })
        const s1 = await stp(pid, 1, { name: 'Pick', department: 'Operations', operators: 8, cycle_time: 4, wait_time: 2, wip: 60, uptime: 100, defect_rate: 4.2, notes: 'BOTTLENECK — 4.2% error rate. Mis-picks driving $8k/month returns.' })
        const s2 = await stp(pid, 2, { name: 'Pack & Protect', department: 'Operations', operators: 5, cycle_time: 3, wait_time: 1, wip: 40, uptime: 100, defect_rate: 1.5 })
        const s3 = await stp(pid, 3, { name: 'Label & Weigh', department: 'Operations', operators: 2, cycle_time: 1, wait_time: 0.5, wip: 25, uptime: 100, defect_rate: 0.5 })
        const s4 = await stp(pid, 4, { name: 'Dispatch & Carrier Collection', department: 'Dispatch', operators: 2, cycle_time: 2, wait_time: 10, wip: 30, uptime: 98, defect_rate: 0.3 })
        const s5 = await stp(pid, 5, { name: 'Last-Mile Delivery', department: 'Carrier', operators: 0, cycle_time: 1440, wait_time: 0, wip: 200, uptime: 95, defect_rate: 3 })
        const s6 = await stp(pid, 6, { name: 'Returns Processing', department: 'Operations', operators: 2, cycle_time: 5, wait_time: 480, wip: 18, uptime: 100, defect_rate: 5 })
        await td(s1.id, pid, 'stopwatch', { baseline: 6, target: 3.5, mean: 4, laps: [3.5,4.5,4,5,3.8,4.2,4,4.6,3.6,4.2], notes: 'Pick avg 4 min/order. 4.2% error rate. Peak season (Nov/Dec) pushes error to 7%.' })
        await td(s1.id, pid, 'ishikawa', { problem: '4.2% order error rate — $8k/month returns and reshipments', framework: '6M Manufacturing', causes: { Machine: ['Single scan at pick — no confirmation scan at pack','Paper pick lists — scanner not integrated to WMS'], Method: ['Zone pick with no sort — pickers crossing zones confuse similar SKUs','No check-digit verification on adjacent similar products'], Material: ['Similar product packaging in adjacent bin locations','SKU stickers sun-faded in south aisle — misread'], Manpower: ['Peak temp staff trained 4 hrs — full training is 2 days','No buddy system for first 50 orders'], Measurement: ['Error rate tracked daily but not by picker — no individual coaching data'], 'Mother Nature': ['Peak November volume triples daily throughput — errors increase under speed pressure'] } })
        await td(s1.id, pid, 'fivewhy', { problem: '4.2% pick error rate — $8k/month returns', whys: [{ q:'Why 4.2% pick error?', a:'Pickers selecting wrong SKU from adjacent bins — similar packaging.' },{ q:'Why similar packaging adjacent?', a:'Bins slotted in SKU number sequence — similar products often sequential.' },{ q:'Why number-sequence slotting?', a:'WMS default. Never reviewed when SKU range grew from 2,000 to 12,000 SKUs.' },{ q:'Why not reviewed?', a:'No slotting review process. WMS admin is operations manager — no dedicated resource.' },{ q:'Why no resource?', a:'ROOT CAUSE: No CI role in the business. Warehouse runs entirely reactive — errors addressed per incident, never systemically.' }], rootCause: 'No CI role. Slotting never reviewed — similar packaging adjacent by WMS default as SKU range grew.', countermeasure: '1. Re-slot top 80 error SKUs. 2. Confirmation scan at pack station. 3. Individual error tracking by picker.', owner: 'Operations Manager', dueDate: '2026-04-30' })
        await td(s1.id, pid, 'waste', { selected: ['Defects','Motion','Transportation'], notes: { Defects:'4.2% error rate — returns cost $8k/month (reshipping, refunds, labour)', Motion:'Pickers walk avg 2.8 miles per shift — non-optimised slotting', Transportation:'Returned orders travel full returns process before restocking — no express lane for unopened items' } })
        await td(s1.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Confirmation scan at pack station', description:'Second barcode scan at pack confirms item matches order. Catches mis-pick before dispatch. Target: error rate from 4.2% to 0.8%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Operations Manager', dueDate:'2026-04-01', actions:['Configure WMS pack scan step','Install scanners at 5 pack stations','Test 200-order pilot','Roll out to full operation'] },{ id:'kz2', kzId:'KZ-002', title:'Re-slot top 80 error SKUs', description:'Move highest-error SKUs away from visually similar neighbours. Minimum 3-bin separation for similar packaging.', category:'Quality', priority:'high', status:'open', owner:'Warehouse Lead', dueDate:'2026-04-15', actions:['Pull 90-day error data by SKU','Map top 80 to current bin','Design re-slot plan','Execute over 1 weekend'] }] })
        await td(s1.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Order Error Rate', baseline:4.2, target:0.8, actual:null, unit:'%', status:'in-progress', owner:'Operations Manager', dueDate:'2026-06-01' }] })
        seeded.push('E-Commerce')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 18. PRIMARY CARE CLINIC — Patient Visit Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Primary Care Patient Visit'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Primary Care') } else {
        const pid = await proj({ name: nm, industry: 'primary_care_outpatient', customer: 'Patient',
          description: 'Appointment booking to post-visit. 6 steps. Bottleneck at physician visit — 38-min average vs 20-min standard.' })
        const s0 = await stp(pid, 0, { name: 'Appointment Scheduling', department: 'Reception', operators: 1, cycle_time: 5, wait_time: 14400, wip: 40, uptime: 100, defect_rate: 12, notes: '12% no-show rate. 14,400-min (10-day) avg wait for routine appointment.' })
        const s1 = await stp(pid, 1, { name: 'Check-in & Registration', department: 'Reception', operators: 1, cycle_time: 4, wait_time: 15, wip: 8, uptime: 100, defect_rate: 3 })
        const s2 = await stp(pid, 2, { name: 'Rooming & Vitals', department: 'Nursing', operators: 1, cycle_time: 8, wait_time: 12, wip: 5, uptime: 100, defect_rate: 2 })
        const s3 = await stp(pid, 3, { name: 'Physician Assessment & Plan', department: 'Medical', operators: 1, cycle_time: 38, wait_time: 18, wip: 6, uptime: 100, defect_rate: 8, notes: 'BOTTLENECK — 38-min avg vs 20-min standard. Running 45+ min behind by 2pm.' })
        const s4 = await stp(pid, 4, { name: 'Checkout & Follow-up Orders', department: 'Reception', operators: 1, cycle_time: 5, wait_time: 8, wip: 4, uptime: 100, defect_rate: 5 })
        const s5 = await stp(pid, 5, { name: 'Post-visit Documentation', department: 'Medical', operators: 1, cycle_time: 15, wait_time: 0, wip: 8, uptime: 100, defect_rate: 4 })
        await td(s3.id, pid, 'stopwatch', { baseline: 50, target: 20, mean: 38, laps: [28,45,38,52,32,42,38,48,30,42], notes: 'Physician visit avg 38 min. Standard 20 min. Variation driven by documentation during visit time.' })
        await td(s3.id, pid, 'ishikawa', { problem: 'Physician visit 38 min avg vs 20-min standard — clinic running 45 min behind by 2pm', framework: '8P Service', causes: { People: ['Physicians documenting during patient encounter — multitasking reduces both quality'], Process: ['No pre-visit summary prepared by nurse — physician repeats review at start'], Policy: ['No hard stop on visit time — social conversation overruns unchecked'], Place: ['EHR template not structured for quick documentation — narrative field only'], 'Products/Services': ['Complex patients (35%) booked into standard 20-min slots'], Price: ['No scribes or nurse-assisted documentation'], Promotion: ['Patients not informed of visit structure — bring unexpected issues'], 'Physical evidence': ['No visit agenda shared with patient before appointment'] } })
        await td(s3.id, pid, 'fivewhy', { problem: 'Physician visit avg 38 min vs 20-min standard', whys: [{ q:'Why 38-min average visit?', a:'Physician is documenting EHR during patient encounter — divides attention and extends time.' },{ q:'Why documenting during encounter?', a:'Post-visit documentation time not built into schedule — only 2 min between appointments.' },{ q:'Why no documentation time in schedule?', a:'Schedule built to maximise patient slots — documentation burden not modelled.' },{ q:'Why not modelled?', a:'Schedule designed by practice manager without physician input on actual documentation time.' },{ q:'Why without physician input?', a:'ROOT CAUSE: No structured schedule design process involving clinical staff. Schedule optimised for volume, not sustainable throughput.' }], rootCause: 'Schedule designed for maximum volume without accounting for documentation time. Physician input not included in schedule design.', countermeasure: '1. Add 5-min documentation buffer after every 3 visits. 2. Pre-visit note preparation by nurse. 3. EHR quick-entry template for top 10 diagnoses.', owner: 'Practice Manager + Lead Physician', dueDate: '2026-05-01' })
        await td(s3.id, pid, 'waste', { selected: ['Waiting','Overprocessing','Non-Utilisation'], notes: { Waiting:'Patients wait avg 18 min before physician enters — rooming not communicating readiness', Overprocessing:'Physician re-reviews patient history already prepped by nurse — duplicated effort', 'Non-Utilisation':'Nurse trained to take history and draft initial plan — skills underused in current model' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Pre-visit note preparation by nurse', description:'Nurse reviews chart and prepares 5-bullet pre-visit summary before physician enters. Eliminates 8 min of physician review time per visit.', category:'Productivity', priority:'critical', status:'in-progress', owner:'Lead Physician', dueDate:'2026-04-15', actions:['Design 5-bullet pre-visit template','Train nursing staff','Pilot with 2 physicians for 2 weeks','Measure visit time before/after'] },{ id:'kz2', kzId:'KZ-002', title:'5-min documentation buffer after every 3 visits', description:'Schedule redesign: 5-min documentation buffer every 3 appointments. Physician catches up. Clinic on time all day. Net slots lost: 2 per session.', category:'Productivity', priority:'high', status:'open', owner:'Practice Manager', dueDate:'2026-05-01', actions:['Model schedule with 5-min buffer','Calculate net capacity impact','Trial for 2 weeks','Measure end-of-day on-time rate'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Physician Visit Duration', baseline:38, target:22, actual:null, unit:'minutes', status:'in-progress', owner:'Lead Physician', dueDate:'2026-06-01' }] })
        seeded.push('Primary Care')
      }
      }
    }


    // ══════════════════════════════════════════════════════════════════════════
    // 19. GENERAL MANUFACTURING — Product Assembly Line
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 20. AEROSPACE MANUFACTURING — Wing Rib Assembly
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 21. FOOD & BEVERAGE MANUFACTURING — Snack Production Line
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Food & Beverage Production Line'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Food & Beverage') } else {
        const pid = await proj({ name: nm, industry: 'food_beverage_manufacturing', customer: 'Retail Distributor',
          description: 'Snack food production line. 6 steps. Packaging OEE at 61% — giveaway 4.2% above spec costing £22k/month.' })
        const s0 = await stp(pid, 0, { name: 'Ingredient Weighing & Prep', department: 'Mixing', operators: 2, cycle_time: 25, wait_time: 15, wip: 8, uptime: 100, defect_rate: 0.5 })
        const s1 = await stp(pid, 1, { name: 'Mixing & Seasoning', department: 'Mixing', operators: 2, cycle_time: 40, wait_time: 20, wip: 5, uptime: 95, defect_rate: 1.2 })
        const s2 = await stp(pid, 2, { name: 'Cooking / Extrusion', department: 'Production', operators: 2, cycle_time: 55, wait_time: 10, wip: 4, uptime: 88, defect_rate: 2.8 })
        const s3 = await stp(pid, 3, { name: 'Weighing & Packaging', department: 'Packing', operators: 3, cycle_time: 35, wait_time: 25, wip: 10, uptime: 72, defect_rate: 0, notes: 'BOTTLENECK — OEE 72%. Multihead weigher drift causing 4.2% giveaway above spec. £22k/month loss.' })
        const s4 = await stp(pid, 4, { name: 'Metal Detection & CCP', department: 'Quality', operators: 1, cycle_time: 8, wait_time: 5, wip: 15, uptime: 100, defect_rate: 0.1 })
        const s5 = await stp(pid, 5, { name: 'Case Packing & Palletising', department: 'Despatch', operators: 2, cycle_time: 20, wait_time: 60, wip: 12, uptime: 96, defect_rate: 0.2 })
        await td(s3.id, pid, 'stopwatch', { baseline: 45, target: 30, mean: 35, laps: [32,38,34,40,33,36,35,39,31,37], notes: 'Weighing & Packaging avg 35s per pack. OEE 72% — Availability 84%, Performance 88%, Quality 97%. Multihead weigher needs calibration every 2 hrs.' })
        await td(s3.id, pid, 'ishikawa', { problem: 'Packaging OEE 72% — multihead weigher drift causing 4.2% giveaway = £22k/month', framework: '6M Manufacturing', causes: { Machine: ['Multihead weigher requires calibration every 2 hrs — unplanned','Scale drift increases at high ambient temperature'], Method: ['Calibration check triggered by operator feel — no schedule or alarm','No OEE tracking — issue invisible until month-end cost report'], Material: ['Ingredient density variation ±6% between batches — weigher set for nominal'], Manpower: ['2 of 3 packaging operators not trained on weigher calibration','Calibration done by engineer only — production cannot self-correct'], Measurement: ['No real-time giveaway monitoring — sampled 3 times/shift','Giveaway data not shared with operators at point of production'], 'Mother Nature': ['Production hall temperature rises 8°C during afternoon — affects scale linearity'] } })
        await td(s3.id, pid, 'fivewhy', { problem: '4.2% giveaway above target = £22k/month loss', whys: [{ q:'Why 4.2% giveaway above target?', a:'Multihead weigher drifts out of calibration during the shift.' },{ q:'Why does it drift?', a:'Temperature in packing hall rises 8°C in afternoon — affects scale accuracy.' },{ q:'Why not compensated?', a:'Weigher has auto-compensation but it is disabled — not configured on install 3 years ago.' },{ q:'Why not configured?', a:'Installation engineer did not configure it. Sign-off did not require giveaway verification.' },{ q:'Why no giveaway verification at install?', a:'ROOT CAUSE: Factory acceptance test protocol does not include giveaway measurement at production temperature range.' }], rootCause: 'FAT protocol does not include giveaway test at operating temperature. Auto-compensation not configured on install.', countermeasure: '1. Enable auto-temperature compensation immediately. 2. Update FAT protocol. 3. Real-time giveaway screen at packaging station.', owner: 'Engineering Manager', dueDate: '2026-04-01' })
        await td(s3.id, pid, 'waste', { selected: ['Overproduction','Defects','Waiting'], notes: { Overproduction:'4.2% giveaway — giving away £22k of product per month above declared weight', Defects:'Calibration drift causing product out of declared weight — compliance and quality risk', Waiting:'Weigher stops 8 min/shift for manual calibration — 2 stoppages avg' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Enable weigher auto-temperature compensation', description:'Engineering to configure temperature compensation in weigher software — 30-min job. Expected giveaway reduction from 4.2% to 0.8%.', category:'Quality', priority:'critical', status:'in-progress', owner:'Engineering Manager', dueDate:'2026-03-28', actions:['Confirm software setting location','Configure compensation','Run 100-pack calibration test','Verify giveaway under 1%','Document in PM schedule'] },{ id:'kz2', kzId:'KZ-002', title:'Real-time giveaway screen at packaging station', description:'Display live average weight vs target on screen visible to operators. Enables immediate correction without waiting for QC sample.', category:'Quality', priority:'high', status:'open', owner:'Engineering', dueDate:'2026-04-30', actions:['Source display','Connect to weigher data output','Set alarm thresholds','Train operators on response'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Giveaway Rate', baseline:4.2, target:0.8, actual:null, unit:'% above target weight', status:'in-progress', owner:'Engineering Manager', dueDate:'2026-05-01', notes:'Auto-compensation + real-time monitoring' }] })
        await td(s3.id, pid, 'pdca', { projectTitle:'Packaging Giveaway Reduction', problemStatement:'Multihead weigher drift causing 4.2% giveaway = £22k/month product loss.', background:'Issue undetected for 3 years — first identified during VSM study. Auto-compensation never configured.', team:[{ id:'t1', name:'Engineering Manager', role:'Lead' },{ id:'t2', name:'QA Manager', role:'Compliance' }], startDate:'2026-03-01', targetDate:'2026-05-01', currentCondition:'4.2% giveaway. No real-time monitoring. Calibration manual every 2 hrs. OEE 72%.', targetCondition:'Giveaway under 1%. Real-time monitoring at station. OEE above 85%.', rootCause:'Auto-compensation not configured at install. FAT did not include giveaway at operating temperature.', hypothesis:'Enabling auto-compensation reduces giveaway to 0.8%. Real-time display enables operator correction.', countermeasures:[{ id:'c1', action:'Enable auto-temperature compensation', owner:'Engineering', dueDate:'2026-03-28', status:'in-progress' },{ id:'c2', action:'Real-time giveaway display at station', owner:'Engineering', dueDate:'2026-04-30', status:'open' }], implementation:'Immediate software change + 2-week monitoring period.', metrics:[{ id:'m1', name:'Giveaway Rate', before:'4.2', after:'', unit:'%' },{ id:'m2', name:'Monthly Loss', before:'22000', after:'', unit:'£' }], results:'', achieved:'', standardisation:'Update PM schedule, FAT protocol, operator training.', lessonsLearned:'', nextCycle:'OEE improvement — Availability 84% to 92% via planned maintenance.' })
        seeded.push('Food & Beverage Mfg')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 22. SURGERY / OPERATING ROOM — OR Pathway
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Operating Room Surgical Pathway'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Surgery / OR') } else {
        const pid = await proj({ name: nm, industry: 'surgery_operating_room', customer: 'Patient',
          description: 'Surgical pathway from scheduling to post-op. OR utilisation 61% — first-case start delay averaging 32 min.' })
        const s0 = await stp(pid, 0, { name: 'Surgical Scheduling & Consent', department: 'Surgical Booking', operators: 1, cycle_time: 20, wait_time: 10080, wip: 45, uptime: 100, defect_rate: 8, notes: '8% case cancellation on day of surgery — consent issues, incomplete pre-op.' })
        const s1 = await stp(pid, 1, { name: 'Pre-Op Assessment', department: 'Pre-Op', operators: 2, cycle_time: 35, wait_time: 30, wip: 6, uptime: 100, defect_rate: 5 })
        const s2 = await stp(pid, 2, { name: 'OR Preparation & Setup', department: 'OR Team', operators: 3, cycle_time: 28, wait_time: 32, wip: 2, uptime: 100, defect_rate: 0, notes: 'BOTTLENECK — avg 32-min first-case start delay. Incomplete equipment setup.' })
        const s3 = await stp(pid, 3, { name: 'Anaesthesia Induction', department: 'Anaesthesia', operators: 2, cycle_time: 18, wait_time: 5, wip: 1, uptime: 100, defect_rate: 1 })
        const s4 = await stp(pid, 4, { name: 'Surgical Procedure', department: 'Surgery', operators: 4, cycle_time: 95, wait_time: 0, wip: 1, uptime: 100, defect_rate: 2.5 })
        const s5 = await stp(pid, 5, { name: 'PACU / Recovery', department: 'Recovery', operators: 2, cycle_time: 55, wait_time: 20, wip: 4, uptime: 100, defect_rate: 3 })
        const s6 = await stp(pid, 6, { name: 'OR Turnover Between Cases', department: 'OR Team', operators: 3, cycle_time: 22, wait_time: 12, wip: 0, uptime: 100, defect_rate: 0, notes: '22-min avg turnover vs 15-min target — limits daily case capacity.' })
        await td(s2.id, pid, 'stopwatch', { baseline: 45, target: 10, mean: 32, laps: [28,38,30,42,26,35,32,40,28,36], notes: 'First-case start delay avg 32 min. Root: equipment not confirmed the prior afternoon. Anaesthesia machine check starts at scheduled incision time.' })
        await td(s2.id, pid, 'ishikawa', { problem: '32-min first-case start delay — OR utilisation 61% vs 80% target', framework: '8P Service', causes: { People: ['Anaesthesiologist arrives at incision time, not setup time','Surgeon preference cards not updated — wrong equipment pulled'], Process: ['No equipment confirmation call-ahead the afternoon before','Sterile processing delivers trays 20 min before case start'], Policy: ['OR schedule released <24 hrs before — no time for prep'], Place: ['Equipment storage room 150m from OR — transport each case'], 'Products/Services': ['Sterile tray integrity failures — 3% require re-sterilisation day-of'], Price: ['Agency staff unfamiliar with surgeon preference cards'], Promotion: ['Team briefing not standard — case details not shared at shift start'], 'Physical evidence': ['Paper preference cards — outdated information not flagged in real-time'] } })
        await td(s2.id, pid, 'fivewhy', { problem: 'First-case start delay avg 32 min', whys: [{ q:'Why 32-min delay on first case?', a:'Anaesthesia machine check and equipment confirmation happen after scheduled start time.' },{ q:'Why after scheduled start?', a:'Anaesthesiologist schedule shows incision time, not setup time. No earlier task defined.' },{ q:'Why not setup time?', a:'OR scheduling system only tracks incision and close — pre-op tasks not scheduled.', },{ q:'Why not tracked?', a:'System implemented 8 years ago. Pre-op tasks added to protocol but scheduling system never updated.' },{ q:'Why not updated?', a:'ROOT CAUSE: IT change requests for clinical systems require 6-month approval cycle — small workflow changes not escalated.' }], rootCause: 'Scheduling system tracks incision time only — setup tasks not assigned time. IT change cycle too slow for operational workflow fixes.', countermeasure: '1. Add setup time to schedule (30 min before incision). 2. Equipment confirmation call at 3pm prior day. 3. Surgeon preference cards to EHR.', owner: 'OR Manager', dueDate: '2026-05-01' })
        await td(s2.id, pid, 'waste', { selected: ['Waiting','Motion','Defects'], notes: { Waiting:'32-min first case delay = 32 min lost OR time daily. At £18/min OR cost: £576/day = £138k/year.', Motion:'Equipment transport 150m each case — 5 min per case wasted movement', Defects:'8% day-of cancellation — full OR slot wasted. Consent and pre-op issues root cause.' } })
        await td(s2.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'3pm day-before equipment confirmation call', description:'Scrub nurse calls sterile processing at 3pm prior day to confirm all trays ready and surgeon cards verified. Eliminates morning scramble.', category:'Productivity', priority:'critical', status:'in-progress', owner:'OR Manager', dueDate:'2026-04-01', actions:['Design confirmation checklist','Train scrub nurses','Pilot for 2 weeks on 2 ORs','Measure first-case start time before/after'] },{ id:'kz2', kzId:'KZ-002', title:'Add 30-min anaesthesia setup time to OR schedule', description:'Schedule anaesthesiologist 30 min before incision. Machines checked, patient in bay, team briefing complete before surgeon arrives.', category:'Productivity', priority:'high', status:'open', owner:'Anaesthesia Chief', dueDate:'2026-04-15', actions:['Agree setup time standard with anaesthesia','Update scheduling templates','Communicate to all OR staff','Monitor for 4 weeks'] }] })
        await td(s2.id, pid, 'improvement', { goals: [{ id:'g1', metric:'First-Case Start Delay', baseline:32, target:5, actual:null, unit:'minutes', status:'in-progress', owner:'OR Manager', dueDate:'2026-06-01', notes:'3pm confirmation + schedule change' }] })
        seeded.push('Surgery / OR')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 23. PHARMACY — Prescription Dispensing Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 24. INSURANCE — Claims Processing Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 25. IT OPERATIONS — Incident Management Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 26. AIRLINE / AVIATION — Aircraft Turnaround
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Airline Aircraft Turnaround'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Aviation') } else {
        const pid = await proj({ name: nm, industry: 'airline_aviation', customer: 'Passenger',
          description: 'Aircraft turnaround from gate arrival to pushback. 7 steps. Avg 52-min turn vs 35-min target. Catering loading is critical path delay.' })
        const s0 = await stp(pid, 0, { name: 'Aircraft Arrival & Chocks On', department: 'Ramp', operators: 2, cycle_time: 3, wait_time: 0, wip: 1, uptime: 100, defect_rate: 2 })
        const s1 = await stp(pid, 1, { name: 'Passenger Disembarkation', department: 'Cabin / Ramp', operators: 3, cycle_time: 12, wait_time: 2, wip: 1, uptime: 100, defect_rate: 1 })
        const s2 = await stp(pid, 2, { name: 'Baggage Offload', department: 'Ramp', operators: 4, cycle_time: 18, wait_time: 3, wip: 1, uptime: 100, defect_rate: 3, notes: 'Parallel with disembarkation — critical path only if delayed.' })
        const s3 = await stp(pid, 3, { name: 'Catering Uplift & Galley Load', department: 'Catering', operators: 4, cycle_time: 28, wait_time: 8, wip: 1, uptime: 100, defect_rate: 4, notes: 'BOTTLENECK — avg 28 min. Late catering truck arrival (avg 8-min late) makes this critical path every 3rd turn.' })
        const s4 = await stp(pid, 4, { name: 'Cleaning & Cabin Preparation', department: 'Cleaning', operators: 6, cycle_time: 18, wait_time: 5, wip: 1, uptime: 100, defect_rate: 2 })
        const s5 = await stp(pid, 5, { name: 'Passenger Boarding', department: 'Gate / Cabin', operators: 3, cycle_time: 20, wait_time: 5, wip: 1, uptime: 100, defect_rate: 5 })
        const s6 = await stp(pid, 6, { name: 'Door Close & Pushback', department: 'Ramp', operators: 2, cycle_time: 4, wait_time: 2, wip: 1, uptime: 100, defect_rate: 1 })
        await td(s3.id, pid, 'stopwatch', { baseline: 35, target: 22, mean: 28, laps: [24,32,28,34,25,30,28,33,24,31], notes: 'Catering avg 28 min. Catering truck 8-min late on avg. Truck arrives at same time as cleaning crew — access conflict at galley door.' })
        await td(s3.id, pid, 'ishikawa', { problem: 'Catering making turn critical path — 8-min late truck creating 17-min delay vs target', framework: '6M Manufacturing', causes: { Machine: ['Catering truck breaks down avg 1×/week — no spare', 'Galley door width limits parallel work — truck + cleaning crew conflict'], Method: ['Catering truck leaves depot at flight arrival, not 20 min before','No pre-positioning agreement with caterer SLA'], Material: ['Catering order changes accepted up to 2 hrs before — late changes require re-pull'], Manpower: ['Caterer uses agency staff on peak days — unfamiliar with aircraft type','One catering crew for 3 simultaneous turns in peak window'], Measurement: ['Catering completion time tracked but not benchmarked against standard — no SLA'], 'Mother Nature': ['Airport road congestion Mon/Fri 07:00–09:00 delays depot-to-stand average +12 min'] } })
        await td(s3.id, pid, 'fivewhy', { problem: 'Catering truck arriving 8 min late — making it critical path every 3rd turn', whys: [{ q:'Why is the catering truck 8 min late on average?', a:'Truck departs depot at aircraft arrival time — should depart 20 min earlier to arrive ready.' },{ q:'Why depart at arrival, not 20 min before?', a:'Current SLA states "truck at stand within 15 min of arrival" — no requirement to pre-position.' },{ q:'Why no pre-positioning in SLA?', a:'Catering contract written 7 years ago — before ground handling optimisation programme.' },{ q:'Why not updated in programme?', a:'Ground handling programme focused on ramp and cleaning. Catering managed by a separate commercial team — excluded from scope.' },{ q:'Why excluded?', a:'ROOT CAUSE: Turnaround optimisation programme siloed within ground ops. Commercial catering contracts outside scope — no cross-function governance.' }], rootCause: 'Catering SLA outdated and managed by separate commercial team. Turnaround optimisation programme had no cross-function scope.', countermeasure: '1. Renegotiate catering SLA: truck at stand 20 min before arrival. 2. Add catering KPI to daily ground ops briefing. 3. Escalation protocol if truck delayed.', owner: 'Ground Ops Manager + Commercial', dueDate: '2026-05-01' })
        await td(s3.id, pid, 'waste', { selected: ['Waiting','Motion','Defects'], notes: { Waiting:'8-min late catering truck × 3 turns/day = 24 min daily delay. At £180/min aircraft-on-ground cost: £4,320/day = £1.3M/year.', Motion:'Cleaning crew and catering crew access conflict — crew wait outside galley avg 6 min for catering to finish', Defects:'4% catering discrepancies (wrong meal count, missing items) discovered post-departure — passenger complaints and cost' } })
        await td(s3.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Renegotiate catering SLA: truck at stand 20 min before arrival', description:'Caterer pre-positions truck 20 min before aircraft arrival. Eliminates 8-min average late arrival. Critical path moves off catering to cleaning.', category:'Delivery', priority:'critical', status:'in-progress', owner:'Commercial Manager', dueDate:'2026-04-30', actions:['Model financial impact of 17-min delay savings','Present business case to caterer','Negotiate revised SLA','Update ground ops briefing metrics'] },{ id:'kz2', kzId:'KZ-002', title:'Separate galley access windows for catering and cleaning', description:'Cleaning enters cabin from front door. Catering loads from galley door. Parallel work. Eliminates 6-min access conflict per turn.', category:'Productivity', priority:'high', status:'open', owner:'Ground Ops Manager', dueDate:'2026-04-15', actions:['Design parallel task sequence','Brief cleaning and catering leads','Trial on 3 aircraft 1 week','Time study before and after'] }] })
        await td(s3.id, pid, 'improvement', { goals: [{ id:'g1', metric:'Aircraft Turn Time', baseline:52, target:35, actual:null, unit:'minutes', status:'in-progress', owner:'Ground Ops Manager', dueDate:'2026-06-01' }] })
        seeded.push('Aviation')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 27. FREIGHT & TRUCKING — Load Delivery Cycle
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 28. HIGHER EDUCATION — Student Enrolment Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 29. CORPORATE TRAINING — Learning Programme Delivery
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 30. HUMAN RESOURCES — Recruitment to Hire Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 31. POWER GENERATION — Planned Maintenance Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 32. MANAGEMENT CONSULTING — Engagement Delivery
    // ══════════════════════════════════════════════════════════════════════════
    {
      const nm = 'Reference — Management Consulting Engagement'
      if (shouldSeed(nm)) {
      const ex = await exists(nm)
      if (ex) { existing.push('Consulting') } else {
        const pid = await proj({ name: nm, industry: 'management_consulting', customer: 'Client Executive',
          description: 'Client brief to delivered recommendation. 6 steps. On-time delivery 68% vs 95% target. Analysis bottleneck from data access delays.' })
        const s0 = await stp(pid, 0, { name: 'Client Brief & Scoping', department: 'Partner / Director', operators: 2, cycle_time: 120, wait_time: 2880, wip: 5, uptime: 100, defect_rate: 30, notes: '30% of scoping briefs require revision — unclear objectives agreed at start.' })
        const s1 = await stp(pid, 1, { name: 'Data Collection & Stakeholder Interviews', department: 'Consulting Team', operators: 3, cycle_time: 2880, wait_time: 5760, wip: 3, uptime: 100, defect_rate: 0 })
        const s2 = await stp(pid, 2, { name: 'Analysis & Insight Development', department: 'Consulting Team', operators: 3, cycle_time: 4320, wait_time: 1440, wip: 2, uptime: 100, defect_rate: 12, notes: 'BOTTLENECK — analysis delayed avg 4 days waiting for client data access. Data request granted in avg 8 days vs 1-day promise.' })
        const s3 = await stp(pid, 3, { name: 'Recommendation Development', department: 'Director / Manager', operators: 2, cycle_time: 2880, wait_time: 1440, wip: 2, uptime: 100, defect_rate: 8 })
        const s4 = await stp(pid, 4, { name: 'Internal Review & QA', department: 'Partner', operators: 2, cycle_time: 480, wait_time: 2880, wip: 2, uptime: 100, defect_rate: 15 })
        const s5 = await stp(pid, 5, { name: 'Client Presentation & Sign-off', department: 'Partner', operators: 2, cycle_time: 120, wait_time: 10080, wip: 2, uptime: 100, defect_rate: 5 })
        await td(s2.id, pid, 'stopwatch', { baseline: 5760, target: 1440, mean: 4320, laps: [2880,5760,4320,6720,3360,4800,4320,6240,3600,4800], notes: 'Analysis avg 3 days. Client data access granted avg 8 days after request vs 1-day commitment in engagement letter.' })
        await td(s2.id, pid, 'ishikawa', { problem: 'On-time delivery 68%. Analysis blocked avg 4 days waiting for client data.', framework: '8P Service', causes: { People: ['Client data owner not identified at engagement kickoff — request goes to wrong contact','Senior clients approve access but IT team executes — no SLA between them'], Process: ['Data request raised mid-engagement — not structured into project plan','No data access pre-work before analysis phase begins'], Policy: ['Client IT security policy requires CISO sign-off for external data access — 5-7 days'], Place: ['Consulting team requires client VPN — provisioning averages 3 days separately'], 'Products/Services': ['Data often incomplete when finally received — second request cycle begins'], Price: ['Engagement priced on total days, not milestone dates — no financial consequence for client delay'], Promotion: ['Data access timeline risk not communicated to client at proposal stage'], 'Physical evidence': ['No engagement risk log — data access risk not tracked or escalated'] } })
        await td(s2.id, pid, 'fivewhy', { problem: '4-day data access delay on 68% of engagements', whys: [{ q:'Why data access delayed avg 4 days?', a:'Client IT requires CISO approval for external access. CISO approval averages 5-7 days with no SLA.' },{ q:'Why not initiated earlier?', a:'Data request raised when analysis phase begins — not pre-planned in engagement kick-off.' },{ q:'Why not pre-planned?', a:'Engagement project plan template does not include data access as a milestone.' },{ q:'Why not in the template?', a:'Template designed for internal engagements. External client data access added as a step informally — never embedded.' },{ q:'Why not embedded?', a:'ROOT CAUSE: Engagement delivery template not reviewed when practice expanded to external clients. Informal workaround became standard practice.' }], rootCause: 'Engagement template not updated when practice moved to external clients. Data access not a formal milestone — raised too late every time.', countermeasure: '1. Add data access request to Day 1 kickoff checklist. 2. Milestone in project plan: data access confirmed before analysis phase. 3. Escalation clause in engagement letter.', owner: 'Practice Director', dueDate: '2026-04-30' })
        await td(s2.id, pid, 'waste', { selected: ['Waiting','Defects','Non-Utilisation'], notes: { Waiting:'4-day avg data access wait. Consulting team paid and available but unable to progress — pure waste at £1,200/consultant/day.', Defects:'15% of deliverables require significant rework at internal QA — scope creep and unclear brief root cause', 'Non-Utilisation':'Senior consultants spend 2+ hrs/day on admin (tracking access requests, chasing clients) — not billable and below their level' } })
        await td(s2.id, pid, 'kaizen', { items: [{ id:'kz1', kzId:'KZ-001', title:'Data access request on Day 1 of every engagement', description:'Kickoff checklist includes data access request letter. Sent same day as kickoff. Typically 5-day lead from client IT — front-loads the wait out of analysis phase.', category:'Delivery', priority:'critical', status:'in-progress', owner:'Practice Director', dueDate:'2026-04-15', actions:['Update engagement kickoff template','Add data access to project plan milestone','Brief all managers and directors','Retrospective check on first 10 engagements'] },{ id:'kz2', kzId:'KZ-002', title:'Scoping brief standard with SMART objectives', description:'Standardise scoping brief to require SMART objectives before engagement is confirmed. Eliminates 30% revision rate and misaligned recommendations.', category:'Quality', priority:'high', status:'open', owner:'Partner Group', dueDate:'2026-05-01', actions:['Design SMART brief template','Partner review and approval','Training session for all managers','Track revision rate for 90 days'] }] })
        await td(s2.id, pid, 'improvement', { goals: [{ id:'g1', metric:'On-Time Delivery Rate', baseline:68, target:95, actual:null, unit:'%', status:'in-progress', owner:'Practice Director', dueDate:'2026-09-01' }] })
        seeded.push('Consulting')
      }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 33. NONPROFIT — Beneficiary Services Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 34. PROFESSIONAL SPORTS — Player Recruitment Flow
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 35. EVENT MANAGEMENT — Event Planning & Execution
    // ══════════════════════════════════════════════════════════════════════════
    {
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 36. MEDICAL DEVICE MANUFACTURING
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Medical Device Assembly'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Medical Device')}else{
      const pid=await pr({name:nm,industry:'pharmaceutical_manufacturing',customer:'Hospital / Surgeon',description:'Class II device assembly. Bottleneck at sterile packaging — 9% sterility failure rate triggers full lot quarantine.'})
      const s0=await st(pid,0,{name:'Component Incoming Inspection',operators:1,cycle_time:120,wait_time:1440,wip:8,uptime:100,defect_rate:3})
      const s1=await st(pid,1,{name:'Sub-component Assembly',operators:3,cycle_time:180,wait_time:60,wip:5,uptime:95,defect_rate:2})
      const s2=await st(pid,2,{name:'Final Assembly & Functional Test',operators:2,cycle_time:240,wait_time:120,wip:4,uptime:93,defect_rate:4})
      const s3=await st(pid,3,{name:'Sterile Packaging',operators:2,cycle_time:90,wait_time:180,wip:6,uptime:96,defect_rate:9,notes:'BOTTLENECK — 9% sterility failure. Each triggers lot quarantine costing $18k.'})
      const s4=await st(pid,4,{name:'EtO Sterilisation',operators:1,cycle_time:2880,wait_time:1440,wip:10,uptime:100,defect_rate:1})
      const s5=await st(pid,5,{name:'Release Testing & QP Review',operators:1,cycle_time:1440,wait_time:2880,wip:5,uptime:100,defect_rate:6})
      await sw(s3.id,pid,120,60,90,laps(90),'Sterile packaging avg 90 min/batch. 9% sterility failure — heat sealer temperature drifting mid-shift.')
      await ika(s3.id,pid,'9% sterility failure rate at packaging','6M Manufacturing',{Machine:['Heat sealer calibration drifts mid-shift','Seal integrity tester not validated at current film spec'],Method:['Visual inspection only — no 100% seal integrity test','Pouch loaded before clean room environmental monitoring confirmed in spec'],Material:['Pouch film lot-to-lot thickness variation causes seal parameter drift','Packaging material not pre-conditioned before use'],Manpower:['Packaging operators not recertified since spec change 18 months ago'],Measurement:['Seal strength sampled only — not 100% tested'],'Mother Nature':['Clean room humidity spikes on warm days']})
      await fw(s3.id,pid,'9% sterility failure rate',[why('Why 9% failure?','Seal integrity below IQ limit — heat sealer temperature drifting mid-shift.'),why('Why drifting?','Calibration only at start-of-shift — drift not caught during 8-hr run.'),why('Why not mid-shift?','SOP written for 4-hr shifts. Now running 8-hr shifts — SOP not updated.'),why('Why not updated?','SOP change control not triggered when shift pattern changed.'),why('Why not triggered?','ROOT CAUSE: Shift pattern change not recognised as a process change requiring SOP review.')],'Shift pattern change not treated as a process change — SOP update trigger not fired.','1. Immediate: mid-shift calibration check. 2. SOP update through change control. 3. 100% seal integrity test implementation.','Quality Manager','2026-04-15')
      await wa(s3.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'9% failure rate — $18k lot quarantine per event plus 3-5 day delay',Waiting:'Quarantined lots wait 5 days for deviation review board',Overprocessing:'Full lot destroyed when only 1 sub-lot failed — overblown quarantine scope'})
      await kz(s3.id,pid,[kzItem('KZ-001','Mid-shift sealer calibration check','Add calibration verification at 4-hr mark on all 8-hr shifts. Implement immediately under deviation control.','Quality','critical','in-progress','Quality Manager','2026-04-01',['Amend batch record','Add calibration step to packaging SOP','File formal change control','Track sterility failure rate weekly'])])
      await im(s3.id,pid,[goal('Sterility Failure Rate','9','1','%','Quality Manager','2026-07-01')])
      seeded.push('Medical Device')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 37. RESEARCH LABORATORY
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Research Laboratory Assay Flow'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Research Lab')}else{
      const pid=await pr({name:nm,industry:'pharmaceutical_manufacturing',customer:'Principal Investigator',description:'Sample to result. 6 steps. 35% assay repeat rate from contamination and equipment failure.'})
      const s0=await st(pid,0,{name:'Sample Receipt & Registration',operators:1,cycle_time:20,wait_time:120,wip:30,uptime:100,defect_rate:5})
      const s1=await st(pid,1,{name:'Sample Preparation',operators:2,cycle_time:45,wait_time:60,wip:15,uptime:100,defect_rate:8})
      const s2=await st(pid,2,{name:'Assay Execution',operators:2,cycle_time:240,wait_time:120,wip:10,uptime:88,defect_rate:35,notes:'BOTTLENECK — 35% repeat rate. Instrument downtime 12%.'})
      const s3=await st(pid,3,{name:'Data Acquisition & QC',operators:1,cycle_time:60,wait_time:60,wip:8,uptime:100,defect_rate:10})
      const s4=await st(pid,4,{name:'Data Analysis & Interpretation',operators:1,cycle_time:120,wait_time:480,wip:6,uptime:100,defect_rate:5})
      const s5=await st(pid,5,{name:'Report Drafting & Review',operators:1,cycle_time:180,wait_time:2880,wip:4,uptime:100,defect_rate:8})
      await sw(s2.id,pid,360,240,240,laps(240),'Assay avg 4 hrs. 35% repeat — instrument failure and contamination main causes.')
      await ika(s2.id,pid,'35% assay repeat rate','6M Manufacturing',{Machine:['HPLC column degraded — 18% of failures','Centrifuge rotor imbalance causing sample loss'],Method:['No pre-assay instrument check protocol','Samples loaded before controls confirmed acceptable'],Material:['Reagent lots not tested on receipt','Buffer concentration varies between preparers'],Manpower:['New postdoc running assay from memory — no formal training sign-off'],Measurement:['Pass/fail criteria applied retrospectively — not defined before assay run'],'Mother Nature':['Temperature gradient in lab — inconsistent assay conditions by bench position']})
      await fw(s2.id,pid,'35% assay repeat rate',[why('Why 35%?','Reagent failures and instrument downtime discovered mid-assay — too late.'),why('Why discovered mid-assay?','No pre-assay checklist — instrument and reagent status assumed OK.'),why('Why assumed?','No SOP for assay setup.'),why('Why no SOP?','Lab operates informally — experienced scientists carry protocols in memory.'),why('Why memory-based?','ROOT CAUSE: No SOP for assay setup. Lab run by individual expertise, not documented process.')],'No SOP for assay setup — lab run by individual expertise, not documented process.','1. Pre-assay checklist (instrument, reagents, controls). 2. Reagent incoming QC. 3. Instrument PM schedule.','Lab Manager','2026-05-01')
      await wa(s2.id,pid,['Defects','Waiting','Non-Utilisation'],{Defects:'35% repeat — 4 hrs scientist time + materials wasted per repeat',Waiting:'Instrument queue when HPLC down — samples wait 3+ hrs','Non-Utilisation':'Postdoc competency not validated — error rate elevated'})
      await kz(s2.id,pid,[kzItem('KZ-001','Pre-assay checklist','Mandatory checklist: instrument status, reagent QC, control readiness. Target: repeat from 35% to 10%.','Quality','critical','in-progress','Lab Manager','2026-04-30',['Draft checklist with scientists','Pilot 4 weeks','Measure repeat rate','Formalise as SOP'])])
      await im(s2.id,pid,[goal('Assay Repeat Rate','35','10','%','Lab Manager','2026-07-01')])
      seeded.push('Research Lab')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 38. INVESTMENT MANAGEMENT
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Investment Management Trade Settlement'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Investment Management')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Investor',description:'Order to settled trade. 8% settlement fail rate. Bottleneck at trade confirmation.'})
      const s0=await st(pid,0,{name:'Order Generation & Validation',operators:1,cycle_time:5,wait_time:2,wip:50,uptime:100,defect_rate:2})
      const s1=await st(pid,1,{name:'Pre-trade Compliance Check',operators:1,cycle_time:8,wait_time:3,wip:30,uptime:100,defect_rate:4})
      const s2=await st(pid,2,{name:'Trade Execution',operators:2,cycle_time:3,wait_time:1,wip:20,uptime:99,defect_rate:1})
      const s3=await st(pid,3,{name:'Trade Confirmation & Matching',operators:2,cycle_time:15,wait_time:30,wip:25,uptime:100,defect_rate:8,notes:'BOTTLENECK — 8% fail. Counterparty SSI data mismatch.'})
      const s4=await st(pid,4,{name:'Settlement',operators:1,cycle_time:20,wait_time:1440,wip:15,uptime:100,defect_rate:3})
      const s5=await st(pid,5,{name:'Reconciliation & Reporting',operators:2,cycle_time:60,wait_time:240,wip:10,uptime:100,defect_rate:5})
      await sw(s3.id,pid,30,10,15,laps(15),'Trade matching avg 15 min. 8% settlement fail — counterparty SSI data mismatch most common cause.')
      await ika(s3.id,pid,'8% settlement fail rate','8P Service',{People:['Operations manually matching — no STP','New staff not trained on counterparty ID formats'],Process:['No automated SSI validation before trade submission','Fails investigated FIFO — not by settlement date priority'],Policy:['Settlement fails reported T+2 — too late for same-day resolution'],Place:['3 separate systems — data re-keyed between them'],'Products/Services':['SSI data not updated quarterly — stale data causes mismatches'],Price:['STP investment not approved — manual reconciliation maintained'],Promotion:['Counterparties not contacted until fail confirmed — 24-hr delay'],'Physical evidence':['No fail dashboard — fails discovered in morning batch only']})
      await fw(s3.id,pid,'8% settlement fail rate',[why('Why 8% fail?','Counterparty SSI mismatch between internal systems.'),why('Why mismatch?','SSI data not synchronised across 3 internal systems.'),why('Why not synchronised?','No golden source for SSI — each system maintains its own.'),why('Why no golden source?','Systems built independently over 10 years — no data governance.'),why('Why no governance?','ROOT CAUSE: No data governance framework. SSI ownership undefined.')],'No data governance framework — SSI maintained independently in 3 systems.','1. Designate golden source for SSI. 2. Automated validation before trade submission. 3. Real-time fail dashboard.','Head of Operations','2026-06-01')
      await wa(s3.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'8% fail — 2 hrs operations investigation per event',Waiting:'Fails discovered morning batch — 18-hr delay before intervention',Overprocessing:'Manual re-keying of trade data between 3 systems — 100% duplicate entry'})
      await kz(s3.id,pid,[kzItem('KZ-001','Golden source SSI + automated validation','Single source for SSI. Automated pre-trade validation. Target: fail from 8% to 1%.','Quality','critical','in-progress','Head of Operations','2026-06-01',['Map all SSI sources','Design golden source','Migrate data','Build automated validation'])])
      await im(s3.id,pid,[goal('Settlement Fail Rate','8','1','%','Head of Operations','2026-09-01')])
      seeded.push('Investment Management')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 39. ACCOUNTING & AUDIT
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Accounting & Audit Engagement'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Accounting & Audit')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Business Client',description:'Financial statement audit. 40% working paper return rate. Bottleneck at manager review.'})
      const s0=await st(pid,0,{name:'Client Data Collection',operators:1,cycle_time:120,wait_time:4320,wip:8,uptime:100,defect_rate:30})
      const s1=await st(pid,1,{name:'Risk Assessment & Planning',operators:2,cycle_time:240,wait_time:480,wip:5,uptime:100,defect_rate:10})
      const s2=await st(pid,2,{name:'Substantive Testing',operators:3,cycle_time:960,wait_time:240,wip:6,uptime:100,defect_rate:15})
      const s3=await st(pid,3,{name:'Working Paper Review',operators:1,cycle_time:480,wait_time:1440,wip:10,uptime:100,defect_rate:40,notes:'BOTTLENECK — 40% papers returned. 1-day manager queue.'})
      const s4=await st(pid,4,{name:'Partner Sign-off',operators:1,cycle_time:120,wait_time:2880,wip:6,uptime:100,defect_rate:15})
      const s5=await st(pid,5,{name:'Report Issuance & Billing',operators:1,cycle_time:60,wait_time:480,wip:4,uptime:100,defect_rate:5})
      await sw(s3.id,pid,720,300,480,laps(480),'Working paper review avg 8 hrs. 40% returned to preparer. 1-day manager queue.')
      await ika(s3.id,pid,'40% working paper return rate at manager review','8P Service',{People:['Juniors unclear on evidence standard per assertion','Managers review informally — no consistent checklist'],Process:['No pre-review self-check step by preparer','Prepared without reviewing prior-year manager comments'],Policy:['No maximum review turnaround SLA for managers'],Place:['Remote team — questions by email only'],'Products/Services':['Audit methodology changed but training not updated'],Price:['Fixed-fee engagement — coaching time not budgeted'],Promotion:['Client data quality poor — incomplete records add preparation time'],'Physical evidence':['No WIP status dashboard — manager unaware of queue volume']})
      await fw(s3.id,pid,'40% working paper return rate',[why('Why 40% returned?','Papers lack sufficient evidence to support the audit conclusion.'),why('Why insufficient?','Juniors unclear on evidence standard per assertion type.'),why('Why unclear?','Evidence standard communicated verbally — not documented per assertion.'),why('Why not documented?','Methodology gives general guidance but no assertion-level evidence matrix.'),why('Why no matrix?','ROOT CAUSE: Methodology designed at partner level — no operational guide for preparers.')],'Methodology designed at partner level — no operational evidence matrix for preparers.','1. Per-assertion evidence matrix. 2. Mandatory preparer self-review. 3. Manager 48-hr review SLA.','Audit Manager','2026-05-01')
      await wa(s3.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'40% return — 4-6 hrs rework per loop',Waiting:'1-day manager queue. 2-day at busy season.',Overprocessing:'Managers re-explaining same comments — same errors repeat because root cause unfixed'})
      await kz(s3.id,pid,[kzItem('KZ-001','Per-assertion evidence matrix','One-page guide per assertion: required evidence, quality standard, common failures. Target: return from 40% to 12%.','Quality','critical','in-progress','Audit Manager','2026-04-15',['Map top 5 return reasons','Design evidence matrix per assertion','Train juniors pre-busy season','Measure return rate weekly'])])
      await im(s3.id,pid,[goal('Working Paper Return Rate','40','12','%','Audit Manager','2026-09-01')])
      seeded.push('Accounting & Audit')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 40. CYBERSECURITY
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Cybersecurity Threat Response'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Cybersecurity')}else{
      const pid=await pr({name:nm,industry:'it_operations',customer:'Organisation',description:'Alert to remediation. MTTD 3.8 hrs. 72% false positive rate creating analyst fatigue.'})
      const s0=await st(pid,0,{name:'Alert Detection',operators:1,cycle_time:5,wait_time:10,wip:80,uptime:100,defect_rate:72,notes:'72% false positive rate'})
      const s1=await st(pid,1,{name:'Triage & Classification',operators:2,cycle_time:15,wait_time:20,wip:30,uptime:100,defect_rate:15})
      const s2=await st(pid,2,{name:'Investigation & Threat Analysis',operators:2,cycle_time:120,wait_time:60,wip:10,uptime:100,defect_rate:25,notes:'BOTTLENECK — 120 min avg. Missing threat intel context.'})
      const s3=await st(pid,3,{name:'Containment & Isolation',operators:2,cycle_time:45,wait_time:30,wip:5,uptime:100,defect_rate:8})
      const s4=await st(pid,4,{name:'Eradication & Remediation',operators:2,cycle_time:180,wait_time:60,wip:4,uptime:100,defect_rate:10})
      const s5=await st(pid,5,{name:'Recovery & Lessons Learned',operators:1,cycle_time:60,wait_time:240,wip:3,uptime:100,defect_rate:0})
      await sw(s2.id,pid,240,60,120,laps(120),'Investigation avg 120 min. 72% alert false positive. MTTD 3.8 hrs vs <1-hr target.')
      await ika(s2.id,pid,'MTTD 3.8 hrs — 72% false positive rate','8P Service',{People:['2 Tier-2 analysts covering 24-hr SOC','Analysts averaging 400 alerts/day — cognitive overload'],Process:['No threat-intel enrichment before investigation','Investigation same procedure for P1 and P3'],Policy:['Escalation requires manager approval — 30-60 min delay'],Place:['SIEM, EDR, and threat intel in 3 separate tools'],'Products/Services':['SIEM tuning not reviewed since initial deployment'],Price:['Threat intel subscription lapsed — analysts on public OSINT only'],Promotion:['No playbook for top 10 attack techniques'],'Physical evidence':['No incident timeline dashboard — reconstructed from memory']})
      await fw(s2.id,pid,'MTTD 3.8 hrs vs <1-hr target',[why('Why 3.8-hr MTTD?','72% false positive rate — genuine threats buried in noise.'),why('Why 72%?','SIEM alert rules not tuned since initial deployment 2 years ago.'),why('Why not tuned?','No SIEM tuning process — alerts added but never retired.'),why('Why no process?','SOC focused entirely on reactive response — no time for proactive tuning.'),why('Why no time?','ROOT CAUSE: SOC headcount insufficient for response and proactive improvement. No dedicated tuning resource.')],'SOC headcount insufficient. No dedicated tuning resource.','1. 30-day SIEM tuning sprint — reduce FP by 50%. 2. Playbooks for top 10 MITRE ATT&CK. 3. Automated threat-intel enrichment.','SOC Manager','2026-05-01')
      await wa(s2.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'25% investigations escalated due to missing context',Waiting:'Escalation approval 30-60 min — threat actor dwell time increases',Overprocessing:'Analysts manually enriching IOCs from 3 tools — automated enrichment takes seconds'})
      await kz(s2.id,pid,[kzItem('KZ-001','30-day SIEM tuning sprint','Reduce false positive from 72% to 20%. Review top 50 rules by volume.','Quality','critical','in-progress','SOC Manager','2026-04-30',['Pull 30-day FP data by rule','Adjust or retire top rules','Measure FP rate weekly'])])
      await im(s2.id,pid,[goal('Alert False Positive Rate','72','20','%','SOC Manager','2026-07-01')])
      seeded.push('Cybersecurity')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 41. TELECOMMUNICATIONS
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Telecoms Service Provisioning'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Telecommunications')}else{
      const pid=await pr({name:nm,industry:'it_operations',customer:'Enterprise Customer',description:'Order to active service. 22-day average vs 5-day SLA. Bottleneck at network provisioning.'})
      const s0=await st(pid,0,{name:'Order Receipt & Validation',operators:1,cycle_time:30,wait_time:120,wip:40,uptime:100,defect_rate:18})
      const s1=await st(pid,1,{name:'Credit Check',operators:1,cycle_time:20,wait_time:240,wip:25,uptime:100,defect_rate:5})
      const s2=await st(pid,2,{name:'Network Capacity Check',operators:1,cycle_time:45,wait_time:480,wip:20,uptime:100,defect_rate:12})
      const s3=await st(pid,3,{name:'Network Provisioning',operators:3,cycle_time:240,wait_time:4320,wip:15,uptime:88,defect_rate:25,notes:'BOTTLENECK — 3-day wait. 25% require field visit adding 7 more days.'})
      const s4=await st(pid,4,{name:'Customer Equipment Config',operators:2,cycle_time:90,wait_time:1440,wip:8,uptime:100,defect_rate:8})
      const s5=await st(pid,5,{name:'Service Acceptance & Billing',operators:1,cycle_time:60,wait_time:480,wip:5,uptime:100,defect_rate:4})
      await sw(s3.id,pid,10080,1440,4320,laps(4320),'Network provisioning avg 3-day wait. 25% require field visit. Order-to-active 22 days vs 5-day SLA.')
      await fw(s3.id,pid,'22-day order-to-active vs 5-day SLA',[why('Why 22 days?','3-day queue + 7-day field visit on 25% of orders.'),why('Why 3-day queue?','3 engineers, 40 orders/week, manual process.'),why('Why manual?','OSS not integrated to network management — engineer logs into both separately.'),why('Why not integrated?','Integration project deprioritised in 2022.'),why('Why deprioritised?','ROOT CAUSE: ROI case not structured for business approval. IT and ops presented separately.')],'OSS-NMS integration deprioritised. ROI case not structured for business.','1. Remote retry protocol before field dispatch. 2. OSS-NMS integration business case. 3. Order status visibility to customers.','Head of Network Operations','2026-06-01')
      await wa(s3.id,pid,['Waiting','Defects','Overprocessing'],{Waiting:'3-day queue + 7-day field visit on 25% of orders',Defects:'25% provisioning failures — $450 field dispatch cost per event',Overprocessing:'Engineers logging into 2 systems per provisioning action'})
      await kz(s3.id,pid,[kzItem('KZ-001','Remote retry before field dispatch','3 remote retry attempts before field dispatch triggered. Target: field dispatch from 25% to 8%.','Delivery','critical','in-progress','Head of Network Ops','2026-04-15',['Document retry procedure','Train provisioning engineers','Track field dispatch rate','Measure order-to-active'])])
      await im(s3.id,pid,[goal('Order-to-Active Time','22','5','days','Head of Network Ops','2026-09-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Overprocessing'],{'Waiting':'Order stuck in provisioning queue avg 4.2 days before engineer assigned','Defects':'23% of provisioning orders have configuration errors requiring rework','Overprocessing':'Manual validation of auto-generated config — full review of 200-line config for 2-field change'})
      await kz(s2.id,pid,[kzItem('KZ-001','Auto-assign provisioning engineer on order receipt','Route orders to engineer queue automatically on CRM submission. Target: queue wait from 4.2 days to same-day assignment.','Delivery','critical','in-progress','Service Ops Manager','2026-04-30',['Define routing rules', 'Configure CRM workflow', 'Pilot 2-week trial', 'Measure queue wait before/after']),kzItem('KZ-002','Configuration error-proofing template','Pre-validated config templates per service type. Engineer selects template — eliminates manual config for standard orders (75% of volume).','Quality','high','open','Network Engineering','2026-05-15',['Map standard service types', 'Build template per type', 'Validate against known error patterns', 'Train provisioning team'])])
      seeded.push('Telecommunications')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 42. GROCERY & SUPERMARKET
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Grocery Store Operations'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Grocery')}else{
      const pid=await pr({name:nm,industry:'retail_stores',customer:'Shopper',description:'Supplier delivery to customer checkout. On-shelf availability 91% vs 98% target.'})
      const s0=await st(pid,0,{name:'Delivery Receiving & Temp Check',operators:2,cycle_time:45,wait_time:60,wip:8,uptime:100,defect_rate:5})
      const s1=await st(pid,1,{name:'Backroom Sort & Date Check',operators:2,cycle_time:30,wait_time:30,wip:25,uptime:100,defect_rate:3})
      const s2=await st(pid,2,{name:'Category Replenishment',operators:4,cycle_time:20,wait_time:120,wip:40,uptime:100,defect_rate:2,notes:'BOTTLENECK — OSA 91% vs 98%.'})
      const s3=await st(pid,3,{name:'Promotional Display',operators:2,cycle_time:60,wait_time:30,wip:5,uptime:100,defect_rate:8})
      const s4=await st(pid,4,{name:'Checkout & Customer Service',operators:6,cycle_time:4,wait_time:3,wip:30,uptime:98,defect_rate:1})
      const s5=await st(pid,5,{name:'Waste & Markdown Processing',operators:1,cycle_time:30,wait_time:0,wip:0,uptime:100,defect_rate:0})
      await sw(s2.id,pid,25,15,20,laps(20),'Replenishment cycle avg 20 min/category. OSA 91% vs 98%.')
      await fw(s2.id,pid,'OSA 91% — consistently OOS on promoted SKUs',[why('Why OOS on promoted SKUs?','Promotional volumes ordered at standard forecast — not uplifted.'),why('Why not uplifted?','Promotional uplift calculated by buying team — not communicated to store.'),why('Why not communicated?','Promotional brief sent to regional manager — store manager not on distribution.'),why('Why excluded?','Promotional briefing process never included store-level communication.'),why('Why not?','ROOT CAUSE: Process designed by central buying without store operations input.')],'Promotional planning designed by buying without store input.','1. Store manager on promotional brief distribution. 2. 48-hr advance order uplift notification. 3. Velocity-based replenishment prioritisation.','Store Manager','2026-04-30')
      await wa(s2.id,pid,['Defects','Waiting','Non-Utilisation'],{Defects:'OSA 91% — promoted OOS creates £2,200/week estimated lost sales',Waiting:'Associates wait for backroom trolley — 1 trolley for 4 associates','Non-Utilisation':'8 min per run locating stock in disorganised backroom'})
      await kz(s2.id,pid,[kzItem('KZ-001','Store manager on promotional brief distribution','Add store manager to buying brief. 48-hr advance notice enables order uplift. Target: OSA from 91% to 98%.','Delivery','critical','in-progress','Store Manager','2026-04-01',['Request buying team add store to brief','Define 48-hr uplift window','Calculate uplift for top 10 promotions','Measure promoted OSA weekly'])])
      await im(s2.id,pid,[goal('On-Shelf Availability','91','98','%','Store Manager','2026-06-01')])
      
      await wa(s2.id,pid,['Waiting', 'Motion', 'Inventory'],{'Waiting':'Checkout queue avg 6.2 mins at peak — 3 of 8 lanes staffed','Motion':'Associates walk avg 420m per replenishment trip — product stored by supplier, not by velocity','Inventory':'14% of ambient SKUs have >45-day stock cover — cash tied up, blocking space for faster movers'})
      await kz(s2.id,pid,[kzItem('KZ-001','Velocity-based shelf slotting for top-200 SKUs','Re-slot top-200 SKUs to closest pick locations in back store. Reduce replenishment walk by est. 35%.','Productivity','critical','in-progress','Store Manager','2026-04-15',['Pull top-200 velocity report', 'Map current vs ideal slot', 'Execute restock during overnight shift', 'Measure replenishment time before/after']),kzItem('KZ-002','Dynamic checkout staffing trigger','Deploy additional cashier when queue exceeds 4 customers. Simple visual trigger — no tech needed.','Delivery','high','open','Shift Supervisor','2026-05-01',['Define queue trigger (4 customers)', 'Brief all supervisors', 'Track queue length hourly for 2 weeks', 'Measure avg checkout wait'])])
      seeded.push('Grocery')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 43. POSTAL & PARCEL DELIVERY
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Postal & Parcel Delivery'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Postal & Parcel')}else{
      const pid=await pr({name:nm,industry:'warehousing_distribution',customer:'Sender / Recipient',description:'Collection to delivered. First attempt delivery 78% vs 95% target.'})
      const s0=await st(pid,0,{name:'Collection',operators:1,cycle_time:3,wait_time:0,wip:300,uptime:100,defect_rate:2})
      const s1=await st(pid,1,{name:'Sorting Hub',operators:8,cycle_time:2,wait_time:60,wip:2000,uptime:92,defect_rate:1})
      const s2=await st(pid,2,{name:'Route Planning & Loading',operators:2,cycle_time:45,wait_time:30,wip:180,uptime:100,defect_rate:4,notes:'BOTTLENECK — 22% parcels in wrong delivery sequence.'})
      const s3=await st(pid,3,{name:'Final Mile Delivery',operators:1,cycle_time:2,wait_time:0,wip:150,uptime:100,defect_rate:22})
      const s4=await st(pid,4,{name:'Failed Delivery & Carding',operators:1,cycle_time:3,wait_time:0,wip:35,uptime:100,defect_rate:0})
      const s5=await st(pid,5,{name:'Reattempt or Collection Point',operators:1,cycle_time:5,wait_time:1440,wip:25,uptime:100,defect_rate:5})
      await sw(s2.id,pid,90,30,45,laps(45),'Route planning avg 45 min. 22% parcels wrong sequence. First attempt delivery 78%.')
      await fw(s2.id,pid,'First attempt delivery 78% — 22% missed deliveries',[why('Why 22% missed?','Recipients not home — no advance notification of delivery day.'),why('Why no notification?','Delivery notification system not activated — sender not subscribed.'),why('Why not subscribed?','E-commerce clients not aware notification subscription available.'),why('Why not aware?','Notification feature not in client onboarding documentation.'),why('Why not in onboarding?','ROOT CAUSE: Documentation last updated before notification feature launched. Feature siloed in product team.')],'Notification feature not in client onboarding. Product and sales operating independently.','1. Notification subscription in all client onboarding. 2. Retrofit to existing clients. 3. 2-hr delivery window pilot.','Operations Director','2026-05-01')
      await wa(s2.id,pid,['Defects','Waiting','Motion'],{Defects:'22% failed first attempt — £4.50 reattempt × 800 parcels/day = £3,600/day',Waiting:'Parcels wait 1 day at depot before reattempt',Motion:'Drivers backtrack on routes — poor sequence adds 35 min per round'})
      await kz(s2.id,pid,[kzItem('KZ-001','Pre-delivery notification for all clients','Activate notification for all clients. SMS/email day-before with window. Target: first attempt from 78% to 90%.','Delivery','critical','in-progress','Operations Director','2026-04-30',['Pull client list without notification','Outreach to activate','Measure first attempt rate'])])
      await im(s2.id,pid,[goal('First Attempt Delivery Rate','78','92','%','Operations Director','2026-07-01')])
      
      await wa(s3.id,pid,['Waiting', 'Defects', 'Motion'],{'Waiting':'Parcels sit in depot sort area avg 14 hrs before dispatch to delivery routes','Defects':'8.4% failed first-attempt delivery — redelivery cost £4.20/item','Motion':'Driver route sequencing manual — suboptimal sequences add avg 22 mins/round'})
      await kz(s3.id,pid,[kzItem('KZ-001','Route optimisation software deployment','Implement automated route sequencing. Eliminate manual planning (45 mins/driver/day). Target: 22-min route saving + fuel reduction.','Productivity','critical','in-progress','Operations Manager','2026-04-30',['Evaluate 3 routing tools', 'Pilot with 5 drivers 2 weeks', 'Measure actual vs planned route time', 'Calculate fuel and time savings']),kzItem('KZ-002','Pre-notification SMS 30 min before delivery','Automated SMS notification triggers when driver is 3 stops away. Target: first-attempt success from 91.6% to 97%.','Quality','high','open','IT Manager','2026-05-15',['Configure notification trigger in route system', 'Pilot on 1 depot 1 month', 'Track first-attempt delivery rate', 'Measure redelivery cost reduction'])])
      seeded.push('Postal & Parcel')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 44. ARCHITECTURE & ENGINEERING DESIGN
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Architecture & Engineering Design'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Architecture & Engineering')}else{
      const pid=await pr({name:nm,industry:'construction',customer:'Building Owner / Contractor',description:'Client brief to permit-ready drawings. 38% of drawings have coordination clashes.'})
      const s0=await st(pid,0,{name:'Client Brief & Programme',operators:1,cycle_time:240,wait_time:1440,wip:5,uptime:100,defect_rate:20})
      const s1=await st(pid,1,{name:'Concept & Schematic Design',operators:3,cycle_time:960,wait_time:480,wip:3,uptime:100,defect_rate:15})
      const s2=await st(pid,2,{name:'Design Development',operators:5,cycle_time:1440,wait_time:480,wip:4,uptime:100,defect_rate:38,notes:'BOTTLENECK — 38% drawings have coordination clash.'})
      const s3=await st(pid,3,{name:'Construction Documents',operators:4,cycle_time:1200,wait_time:480,wip:3,uptime:100,defect_rate:20})
      const s4=await st(pid,4,{name:'Permit Submission',operators:2,cycle_time:240,wait_time:14400,wip:2,uptime:100,defect_rate:25})
      const s5=await st(pid,5,{name:'Tender & Contractor Selection',operators:1,cycle_time:960,wait_time:4320,wip:2,uptime:100,defect_rate:5})
      await sw(s2.id,pid,2880,1440,1440,laps(1440),'Design development avg 24 hrs/package. 38% have coordination clashes discovered 2 stages too late.')
      await fw(s2.id,pid,'38% drawing rework from coordination clashes',[why('Why 38% clash?','Architectural and structural models not coordinated weekly — clashes accumulate for 4 weeks.'),why('Why monthly only?','BIM coordination scheduled monthly to manage consultant availability.'),why('Why not more frequent?','Coordination frequency not in BIM execution plan.'),why('Why not specified?','BEP produced by architect without input from engineering consultants.'),why('Why no input?','ROOT CAUSE: BEP produced without engineering input — coordination responsibilities assumed, not agreed.')],'BEP produced without engineering input — coordination frequency not agreed.','1. Weekly automated clash detection report. 2. Bi-weekly coordination meeting all disciplines. 3. BEP revision with coordination protocol.','Project Architect','2026-04-30')
      await wa(s2.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'38% clash — each rework adds 24-40 hrs per drawing package',Waiting:'Clash discovered in construction documents — 2 stages too late',Overprocessing:'Each discipline producing separate coordination drawings — BIM should automate this'})
      await kz(s2.id,pid,[kzItem('KZ-001','Weekly automated clash detection report','BIM coordinator runs clash detection every Monday. Target: clash from 38% to 8%.','Quality','critical','in-progress','Project Architect','2026-04-15',['Configure clash detection','Automate weekly export','Share with all disciplines','Track clash count by discipline'])])
      await im(s2.id,pid,[goal('Drawing Clash Rate','38','8','%','Project Architect','2026-07-01')])
      
      await wa(s2.id,pid,['Defects', 'Waiting', 'Overprocessing'],{'Defects':'38% of design packages require client revision — avg 2.4 revision rounds per package','Waiting':'Client approval gating adds avg 12 days to each design phase','Overprocessing':'Stage 3 detail drawings produced before Stage 2 sign-off in 22% of projects — rework when client changes brief'})
      await kz(s2.id,pid,[kzItem('KZ-001','Mandatory Stage 2 sign-off gate before Stage 3 work begins','Hard gate: no Stage 3 resource allocation until signed Stage 2 approval received. Eliminates rework from brief changes late in design.','Quality','critical','in-progress','Design Director','2026-04-30',['Update project protocol', 'Brief all project managers', 'Add gate to project tracking system', 'Track rework rate before/after']),kzItem('KZ-002','Client brief template with mandatory scope fields','Structured brief requiring client to complete programme, budget, planning constraints, and sign-off authority before design starts.','Quality','high','open','Client Relationship Manager','2026-05-01',['Design brief template', 'Test with 3 new projects', 'Measure revision rate', 'Survey client experience'])])
      seeded.push('Architecture & Engineering')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 45. K-12 EDUCATION
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — K-12 Student Support Flow'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('K-12 Education')}else{
      const pid=await pr({name:nm,industry:'higher_education',customer:'Student',description:'Referral to intervention. 6-week wait from identification to support — statutory target 1 week.'})
      const s0=await st(pid,0,{name:'Attendance & Academic Monitoring',operators:4,cycle_time:15,wait_time:2880,wip:80,uptime:100,defect_rate:25})
      const s1=await st(pid,1,{name:'SENCO Referral',operators:2,cycle_time:30,wait_time:4320,wip:20,uptime:100,defect_rate:10})
      const s2=await st(pid,2,{name:'Assessment & Learning Plan',operators:2,cycle_time:120,wait_time:14400,wip:15,uptime:100,defect_rate:15})
      const s3=await st(pid,3,{name:'Intervention Delivery',operators:6,cycle_time:60,wait_time:20160,wip:12,uptime:100,defect_rate:20,notes:'BOTTLENECK — 6-week wait from identification.'})
      const s4=await st(pid,4,{name:'Progress Monitoring',operators:3,cycle_time:30,wait_time:10080,wip:10,uptime:100,defect_rate:30})
      const s5=await st(pid,5,{name:'Review & Exit',operators:2,cycle_time:60,wait_time:20160,wip:8,uptime:100,defect_rate:10})
      await sw(s3.id,pid,20160,5040,20160,laps(20160),'Intervention wait avg 6 weeks (20,160 min). Target 1 week. SENCO caseload 42 students per coordinator.')
      await fw(s3.id,pid,'6-week intervention wait',[why('Why 6-week wait?','Assessment must complete before intervention allocated — queue builds.'),why('Why assessment before support?','Policy requires formal assessment before resource allocation.'),why('Why?','Resource allocation policy prevents over-assignment — not optimised for speed.'),why('Why not optimised?','Policy written 2016. SEND volume increased 60% since.'),why('Why not reviewed?','ROOT CAUSE: No SEND policy review cycle. Reactive updates after Ofsted findings only.')],'SEND policy written 2016. No review cycle. Volume increased 60%.','1. Interim support starts immediately on referral — assessment concurrent. 2. Digital SEND tracking. 3. TA deployment to targeted intervention during lessons.','SENCO / Headteacher','2026-05-01')
      await wa(s3.id,pid,['Waiting','Non-Utilisation','Defects'],{Waiting:'6-week gap — academic gap widens during wait','Non-Utilisation':'TAs in passive support role — targeted intervention capacity unused',Defects:'30% progress monitoring reviews missed'})
      await kz(s3.id,pid,[kzItem('KZ-001','Interim support starts on referral day','TA interim support from Day 1 of referral while formal assessment runs concurrently. Target: support from week 6 to week 1.','Delivery','critical','in-progress','SENCO','2026-04-15',['Redesign SEND flow','Train TAs on interim approaches','Track referral-to-support lead time','Measure academic progress rate'])])
      await im(s3.id,pid,[goal('Referral to Intervention Start','42','7','days','SENCO','2026-06-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Referral to first support session avg 34 days — student need unmet during this period','Defects':'42% of support plans require revision after 6-week review — initial assessment incomplete','Non-Utilisation':'SENCO spending 60% of time on admin and paperwork — specialist expertise not applied to students'})
      await kz(s2.id,pid,[kzItem('KZ-001','Fast-track assessment for urgent referrals','Triage at referral: urgent cases (safeguarding, acute distress) seen within 48 hrs. Standard referrals enter planned queue.','Delivery','critical','in-progress','SENCO','2026-04-30',['Define triage criteria', 'Create 48-hr response pathway', 'Brief referral staff', 'Track referral-to-first-contact time']),kzItem('KZ-002','Standardised assessment template per support type','Structured initial assessment for the 5 most common support needs. Reduces plan revision from 42% target <15%.','Quality','high','open','Educational Psychologist','2026-05-15',['Map 5 most common support needs', 'Co-design template with SENCOs', 'Pilot with 10 new referrals', 'Measure plan revision rate'])])
      seeded.push('K-12 Education')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 46. GOVERNMENT SERVICES — PERMIT & LICENSING
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Government Permit & Licensing'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Government Services')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Citizen / Applicant',description:'Application to permit issued. 28 days vs 10-day target. 42% applications incomplete on receipt.'})
      const s0=await st(pid,0,{name:'Application Receipt & Log',operators:2,cycle_time:20,wait_time:1440,wip:80,uptime:100,defect_rate:42,notes:'42% incomplete on receipt'})
      const s1=await st(pid,1,{name:'Completeness Check',operators:2,cycle_time:30,wait_time:2880,wip:50,uptime:100,defect_rate:10})
      const s2=await st(pid,2,{name:'Technical Review',operators:3,cycle_time:120,wait_time:5760,wip:30,uptime:100,defect_rate:15,notes:'BOTTLENECK — 4-day queue.'})
      const s3=await st(pid,3,{name:'Decision & Conditions',operators:2,cycle_time:60,wait_time:2880,wip:15,uptime:100,defect_rate:8})
      const s4=await st(pid,4,{name:'Notification to Applicant',operators:1,cycle_time:20,wait_time:480,wip:12,uptime:100,defect_rate:5})
      const s5=await st(pid,5,{name:'Permit Issue & Record',operators:1,cycle_time:15,wait_time:240,wip:10,uptime:100,defect_rate:2})
      await sw(s2.id,pid,7200,1440,5760,laps(5760),'Technical review avg 4-day wait. 28-day total vs 10-day target. 42% incomplete applications restart the clock.')
      await fw(s2.id,pid,'28-day processing vs 10-day target',[why('Why 28 days?','42% incomplete applications add 5-10 days each.'),why('Why incomplete?','Applicants not understanding what information is required.'),why('Why unclear?','Guidance notes generic — not specific to permit type.'),why('Why generic?','Single document covers all 5 permit types.'),why('Why single?','ROOT CAUSE: Guidance written by policy team without operational input. Common failure points not built in.')],'Guidance written by policy without operational input.','1. Per-permit-type guidance and checklist. 2. Online portal validation before submission. 3. Status tracker for applicants.','Service Manager','2026-05-01')
      await wa(s2.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'42% incomplete — each adds 5-10 days',Waiting:'4-day technical review queue — 30 applications pending',Overprocessing:'Officers manually checking completeness at technical review — should be done at receipt'})
      await kz(s2.id,pid,[kzItem('KZ-001','Per-permit checklist + online validation','Online portal validates required fields before submission. Target: incomplete from 42% to 5%.','Quality','critical','in-progress','Service Manager','2026-06-01',['Map required fields per permit type','Build portal validation','Measure incomplete rate'])])
      await im(s2.id,pid,[goal('Permit Processing Time','28','10','days','Service Manager','2026-09-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Overprocessing'],{'Waiting':'Applications queued avg 28 days before first officer review — purely administrative delay','Defects':'31% of applications incomplete on submission — triggers back-and-forth adding 15 days per application','Overprocessing':'Senior officer sign-off required on all applications regardless of complexity — 75% are low-risk and could be delegated'})
      await kz(s2.id,pid,[kzItem('KZ-001','Digital pre-screening with mandatory fields','Online portal validates completeness before submission accepted. Target: incomplete applications from 31% to under 5%.','Quality','critical','in-progress','Digital Services Manager','2026-04-30',['Map all mandatory fields by permit type', 'Build validation into online form', 'Test with applicants', 'Track submission completeness rate']),kzItem('KZ-002','Risk-based approval delegation','Low-risk permit category (define criteria) approved by Officer. Medium by Senior Officer. Only complex/high-risk to Director. Reduce average approval time by 40%.','Delivery','high','open','Head of Licensing','2026-05-01',['Define risk tiering criteria', 'Draft delegation policy', 'Legal sign-off', 'Train officers', 'Track cycle time by tier'])])
      seeded.push('Government Services')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 47. EMERGENCY SERVICES — FIRE & RESCUE
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Fire & Rescue Emergency Response'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Fire & Rescue')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Member of Public',description:'Call to scene clearance. Mobilisation 90s avg vs 60s target. 8-min standard met 72% vs 80%.'})
      const s0=await st(pid,0,{name:'Emergency Call Receipt',operators:2,cycle_time:45,wait_time:15,wip:3,uptime:100,defect_rate:3})
      const s1=await st(pid,1,{name:'Mobilisation & Alerting',operators:1,cycle_time:90,wait_time:10,wip:2,uptime:100,defect_rate:5,notes:'BOTTLENECK — 90s mobilisation. Target 60s.'})
      const s2=await st(pid,2,{name:'Response — En Route',operators:4,cycle_time:360,wait_time:0,wip:1,uptime:98,defect_rate:2})
      const s3=await st(pid,3,{name:'Incident Management',operators:4,cycle_time:1800,wait_time:0,wip:1,uptime:100,defect_rate:5})
      const s4=await st(pid,4,{name:'Scene Clearance',operators:4,cycle_time:180,wait_time:0,wip:1,uptime:100,defect_rate:3})
      const s5=await st(pid,5,{name:'Return to Station & Debrief',operators:4,cycle_time:120,wait_time:0,wip:1,uptime:100,defect_rate:0})
      await sw(s1.id,pid,180,60,90,laps(90),'Mobilisation avg 90s. Target 60s. 8-min standard met 72% vs 80% target.')
      await fw(s1.id,pid,'Mobilisation 90s vs 60s target',[why('Why 90s avg?','PPE donning takes 25s — crew not in pre-donning position at time of call.'),why('Why not pre-positioned?','No standard for where crew should be between calls.'),why('Why no standard?','Watch manager sets own routines — no brigade standard.'),why('Why no brigade standard?','Mobilisation improvement not identified as priority until OTD analysis 2023.'),why('Why only 2023?','ROOT CAUSE: No regular response time trend analysis at station level. Aggregate data only reviewed at brigade.')],'No station-level response time analysis. Aggregate data masks station-specific mobilisation failures.','1. Standard pre-donning position during stand-down. 2. PPE pre-positioned at appliance. 3. Monthly station-level mobilisation debrief.','Station Manager','2026-04-30')
      await wa(s1.id,pid,['Waiting','Motion','Non-Utilisation'],{Waiting:'8-second alerting delay — 13% of 60s target consumed before tone sounds',Motion:'Crew moving from various station locations to appliance','Non-Utilisation':'Stand-down time not used for readiness — no pre-donning standard'})
      await kz(s1.id,pid,[kzItem('KZ-001','Pre-donning position + PPE at appliance','Crew in or adjacent to appliance bay during stand-down. PPE hung on appliance. Target: mobilisation from 90s to 60s.','Safety','critical','in-progress','Station Manager','2026-04-01',['Define pre-donning position standard','Confirm with watch managers','Install PPE hooks at appliance','Monitor mobilisation time weekly'])])
      await im(s1.id,pid,[goal('Mobilisation Time','90','60','seconds','Station Manager','2026-06-01')])
      
      await wa(s1.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Average mobilisation time 3.2 mins against 1.0-min target — pre-alerting not triggered consistently','Defects':'14% of first-attendance appliances arrive without correct equipment for incident type — requires second resource','Non-Utilisation':'Crew training time fragmented — 40% of planned training cancelled due to operational demand, not replaced'})
      await kz(s1.id,pid,[kzItem('KZ-001','Automatic pre-alerting on high-probability call types','System pre-alerts crew 15-30 seconds before full mobilisation on structure fire and RTC call types — cuts mobilisation time.','Delivery','critical','in-progress','Watch Commander','2026-04-15',['Identify qualifying call types', 'Configure MDT pre-alert logic', 'Trial on watch for 4 weeks', 'Measure mobilisation time before/after']),kzItem('KZ-002','Incident-type equipment checklist on MDT','Digital checklist on mobile data terminal confirms correct equipment loaded for specific incident type before departure.','Quality','high','open','Station Manager','2026-05-01',['Map equipment requirements per incident type', 'Build checklist in MDT system', 'Train crews', 'Track equipment adequacy at first attendance'])])
      seeded.push('Fire & Rescue')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 48. POLICE & LAW ENFORCEMENT
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Police Crime Investigation'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Police')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Victim / Complainant',description:'Crime report to case outcome. 38% of CPS files returned for more information.'})
      const s0=await st(pid,0,{name:'Initial Report & Triage',operators:2,cycle_time:30,wait_time:60,wip:40,uptime:100,defect_rate:8})
      const s1=await st(pid,1,{name:'Scene Attendance & Evidence',operators:2,cycle_time:120,wait_time:480,wip:20,uptime:100,defect_rate:15})
      const s2=await st(pid,2,{name:'Investigation',operators:2,cycle_time:2880,wait_time:4320,wip:15,uptime:100,defect_rate:20})
      const s3=await st(pid,3,{name:'Case File Preparation',operators:1,cycle_time:480,wait_time:2880,wip:10,uptime:100,defect_rate:38,notes:'BOTTLENECK — 38% returned by CPS.'})
      const s4=await st(pid,4,{name:'Charge Decision & CPS Submission',operators:1,cycle_time:120,wait_time:4320,wip:8,uptime:100,defect_rate:15})
      const s5=await st(pid,5,{name:'Court Preparation & Outcome',operators:2,cycle_time:240,wait_time:28800,wip:12,uptime:100,defect_rate:10})
      await sw(s3.id,pid,960,360,480,laps(480),'Case file preparation avg 8 hrs. 38% returned by CPS. Each return adds 2-3 weeks.')
      await fw(s3.id,pid,'38% CPS file return rate',[why('Why 38% returns?','Files missing evidence required under updated CPS charging standards.'),why('Why missing?','Officers not aware of 18-month-old CPS standard update.'),why('Why not aware?','Training on CPS update not delivered to this team.'),why('Why not delivered?','Responsibility with L&D — not linked to CPS update cycle.'),why('Why not linked?','ROOT CAUSE: No process for CPS updates to automatically trigger training. L&D and CPS liaison work independently.')],'No trigger process for CPS updates to generate training.','1. Immediate briefing on CPS update. 2. Per-offence-type file checklist. 3. Supervisor quality gate before CPS submission.','Detective Sergeant','2026-04-30')
      await wa(s3.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'38% CPS return — 2-3 weeks added per file',Waiting:'Files wait 3 days in queue before supervisor review',Overprocessing:'Officers over-documenting matters CPS does not require'})
      await kz(s3.id,pid,[kzItem('KZ-001','Per-offence-type file checklist','Checklist of required evidence per top-10 offence types. Target: CPS return from 38% to 10%.','Quality','critical','in-progress','Detective Sergeant','2026-04-15',['Map top 10 offence types','List CPS evidence requirements','Design 1-page checklist','Pilot 1 month','Measure return rate'])])
      await im(s3.id,pid,[goal('CPS File Return Rate','38','10','%','Detective Sergeant','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'File from investigation to CPS review waits avg 42 days in queue — no visibility of CPS workload','Defects':'28% of files returned by CPS requiring additional evidence or documentation','Non-Utilisation':'Detectives spending estimated 35% of time on administrative tasks that could be handled by investigation support staff'})
      await kz(s2.id,pid,[kzItem('KZ-001','File quality checklist before CPS submission','Structured pre-submission checklist aligned to CPS charging standards. Target: file return rate from 28% to under 8%.','Quality','critical','in-progress','Detective Inspector','2026-04-30',['Map most common return reasons (last 6 months)', 'Build checklist targeting those reasons', 'Pilot with 10 files', 'Measure return rate']),kzItem('KZ-002','Admin task transfer to investigation support','Audit detective time: identify tasks (CCTV requests, system entries, correspondence) transferable to support staff. Free detective capacity.','Productivity','high','open','Detective Chief Inspector','2026-05-15',['Time-and-motion study of detective activities (1 week)', 'Identify transferable tasks', 'Define new support role scope', 'Implement and measure detective hours freed'])])
      seeded.push('Police')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 49. MILITARY & DEFENSE
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Military Equipment Readiness'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Military')}else{
      const pid=await pr({name:nm,industry:'aerospace_manufacturing',customer:'Command Authority',description:'Equipment readiness and maintenance cycle. Availability 72% vs 85% target.'})
      const s0=await st(pid,0,{name:'Mission Planning & Resource Check',operators:4,cycle_time:120,wait_time:240,wip:8,uptime:100,defect_rate:8})
      const s1=await st(pid,1,{name:'Equipment Pre-mission Check',operators:6,cycle_time:180,wait_time:120,wip:6,uptime:100,defect_rate:10})
      const s2=await st(pid,2,{name:'Mission Execution',operators:20,cycle_time:480,wait_time:0,wip:4,uptime:95,defect_rate:5})
      const s3=await st(pid,3,{name:'Post-mission PMCS',operators:4,cycle_time:240,wait_time:2880,wip:10,uptime:100,defect_rate:18,notes:'BOTTLENECK — 72% availability. 18% post-mission checks find P1 faults.'})
      const s4=await st(pid,4,{name:'Repair & Parts Requisition',operators:3,cycle_time:480,wait_time:4320,wip:8,uptime:100,defect_rate:12})
      const s5=await st(pid,5,{name:'Return to Readiness',operators:2,cycle_time:60,wait_time:480,wip:5,uptime:100,defect_rate:3})
      await sw(s3.id,pid,480,180,240,laps(240),'Post-mission PMCS avg 4 hrs. 18% P1 fault rate. Parts wait avg 3 days.')
      await fw(s3.id,pid,'Equipment availability 72% — P1 fault rate 18%',[why('Why 18% P1?','Developing faults not caught at pre-mission PMCS — checklist outdated.'),why('Why outdated?','PMCS written 8 years ago for previous operating environment.'),why('Why not updated?','PMCS update requires DEME(A) approval — 18-month process.'),why('Why 18 months?','No fast-track for operational environment changes.'),why('Why no fast-track?','ROOT CAUSE: Maintenance governance designed for peacetime. No mechanism for operational environment to accelerate revision.')],'Maintenance governance designed for peacetime. No fast-track for operational PMCS revision.','1. Supplementary PMCS card for current environment (CO-authorised). 2. Forward stock of top-10 P1 parts. 3. Submit formal PMCS revision.','REME WO2','2026-05-01')
      await wa(s3.id,pid,['Waiting','Defects','Non-Utilisation'],{Waiting:'Parts wait 3-5 days — equipment grounded',Defects:'18% P1 fault rate — each grounds vehicle avg 2.5 days','Non-Utilisation':'REME technicians reactive only — no proactive condition monitoring'})
      await kz(s3.id,pid,[kzItem('KZ-001','Supplementary PMCS card — current environment','CO-authorised supplementary checks for dust, heat, and mission profile. Target: P1 fault from 18% to 8%.','Quality','critical','in-progress','REME WO2','2026-04-01',['Draft supplementary checks','CO authorisation','Brief all operators','Monitor P1 fault rate weekly'])])
      await im(s3.id,pid,[goal('Equipment Availability Rate','72','85','%','REME WO2','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Inventory'],{'Waiting':'Parts on backorder average 18-day delay — unplanned maintenance holds equipment offline','Defects':'12% of maintenance tasks have to be repeated within 30 days — quality of initial repair not meeting standard','Inventory':'23% of held spare parts have zero usage in 24 months — capital tied up, space consumed, catalogue management burden'})
      await kz(s2.id,pid,[kzItem('KZ-001','Critical spare parts pre-positioning based on failure history','Analyse 24-month failure data: pre-position top-20 failure parts at unit level. Target: AOG (aircraft/vehicle on ground) wait from 18 days to 4 days.','Delivery','critical','in-progress','Logistics Officer','2026-04-30',['Pull 24-month failure parts data', 'Identify top 20 critical spares', 'Calculate pre-positioning quantity', 'Arrange forward positioning']),kzItem('KZ-002','Post-maintenance 7-day quality check','Mandatory system check 7 days after any maintenance task >4 hours. Catches latent faults before next operational use.','Quality','high','open','Maintenance Controller','2026-05-01',['Define qualifying task types', 'Add 7-day check to job card', 'Assign check responsibility', 'Track repeat maintenance rate'])])
      seeded.push('Military')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 50. STAFFING & RECRUITMENT AGENCY
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Staffing Agency Placement Process'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Staffing Agency')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Client Company / Candidate',description:'Job order to placement. Fill rate 22% vs 65% industry average.'})
      const s0=await st(pid,0,{name:'Job Order Intake & Qualification',operators:1,cycle_time:30,wait_time:60,wip:25,uptime:100,defect_rate:20})
      const s1=await st(pid,1,{name:'Candidate Sourcing',operators:3,cycle_time:120,wait_time:240,wip:15,uptime:100,defect_rate:15})
      const s2=await st(pid,2,{name:'Candidate Screening',operators:2,cycle_time:60,wait_time:480,wip:10,uptime:100,defect_rate:25})
      const s3=await st(pid,3,{name:'Submission to Client',operators:1,cycle_time:30,wait_time:2880,wip:8,uptime:100,defect_rate:22,notes:'BOTTLENECK — 22% fill rate. 78% client rejections.'})
      const s4=await st(pid,4,{name:'Client Interview & Selection',operators:1,cycle_time:60,wait_time:4320,wip:3,uptime:100,defect_rate:30})
      const s5=await st(pid,5,{name:'Placement & Start',operators:1,cycle_time:30,wait_time:1440,wip:2,uptime:100,defect_rate:15})
      await sw(s3.id,pid,240,60,30,laps(30),'Submission prep avg 30 min. 78% rejected by client. Fill rate 22% vs 65% industry average.')
      await fw(s3.id,pid,'Fill rate 22% — 78% client rejection rate',[why('Why 78% rejection?','Candidates do not match client requirements precisely.'),why('Why not matching?','Brief taken verbally — key requirements not captured.'),why('Why not captured?','No structured brief document.'),why('Why no structure?','Brief process designed when agency was 3 people. Scale exposed the gap.'),why('Why not updated?','ROOT CAUSE: KPI is submissions, not fill rate. Consultants incentivised to submit fast, not accurately.')],'KPI incentivises volume not quality. Perverse incentive.','1. Replace submissions KPI with fill rate. 2. Structured brief document. 3. Consultant phone screen mandatory before submission.','Managing Director','2026-05-01')
      await wa(s3.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'78% rejection — 30 min wasted per rejected submission + relationship damage',Waiting:'Client review 2 days — good candidates accept elsewhere',Overprocessing:'8-10 candidates sourced per role when 2-3 well-matched would fill it'})
      await kz(s3.id,pid,[kzItem('KZ-001','Structured brief + fill rate KPI','12-field structured brief for all roles. Fill rate replaces submissions as primary KPI. Target: fill from 22% to 50%.','Quality','critical','in-progress','Managing Director','2026-04-30',['Design brief document','Change KPI to fill rate','Train consultants','Measure weekly'])])
      await im(s3.id,pid,[goal('Placement Fill Rate','22','50','%','Managing Director','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Average time-to-submit shortlist 6.2 days — client expects 48 hours','Defects':'34% of submitted candidates rejected at first client screen — brief misalignment at intake','Non-Utilisation':'Consultants spending 45% of time re-entering data across CRM, job board, and client portals — no integration'})
      await kz(s2.id,pid,[kzItem('KZ-001','Structured intake brief with mandatory criteria fields','Intake form requiring hiring manager to confirm: must-have skills, nice-to-have skills, deal-breakers, and decision-maker chain. Reduces rejection rate from 34%.','Quality','critical','in-progress','Practice Lead','2026-04-30',['Design intake template', 'Brief all consultants', 'Enforce on next 20 mandates', 'Track first-screen rejection rate']),kzItem('KZ-002','CRM integration to eliminate duplicate data entry','Single data entry in CRM auto-populates job boards and generates client-formatted shortlist. Target: save 2.5 hours/consultant/day.','Productivity','high','open','Operations Manager','2026-05-15',['Map current data entry touchpoints', 'Evaluate CRM integration tools', 'Build and test integration', 'Measure time saved per placement'])])
      seeded.push('Staffing Agency')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 51. DIGITAL MARKETING
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Digital Marketing Campaign Flow'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Digital Marketing')}else{
      const pid=await pr({name:nm,industry:'marketing_agency',customer:'Client Business',description:'Strategy to measurable outcome. ROAS 1.8x vs 3.5x target. Bottleneck at optimisation.'})
      const s0=await st(pid,0,{name:'Strategy & Audience Research',operators:2,cycle_time:480,wait_time:2880,wip:5,uptime:100,defect_rate:25})
      const s1=await st(pid,1,{name:'Creative Development',operators:3,cycle_time:480,wait_time:1440,wip:4,uptime:100,defect_rate:30})
      const s2=await st(pid,2,{name:'Platform Setup & Launch',operators:2,cycle_time:120,wait_time:480,wip:3,uptime:100,defect_rate:15})
      const s3=await st(pid,3,{name:'Monitoring & Optimisation',operators:2,cycle_time:60,wait_time:1440,wip:8,uptime:100,defect_rate:40,notes:'BOTTLENECK — reactive not systematic. ROAS 1.8x vs 3.5x.'})
      const s4=await st(pid,4,{name:'Reporting & Client Review',operators:1,cycle_time:120,wait_time:1440,wip:5,uptime:100,defect_rate:20})
      const s5=await st(pid,5,{name:'Scale & Budget Reallocation',operators:1,cycle_time:60,wait_time:2880,wip:3,uptime:100,defect_rate:15})
      await sw(s3.id,pid,120,45,60,laps(60),'Campaign optimisation avg 60 min/session. ROAS 1.8x avg vs 3.5x target. No optimisation cadence.')
      await fw(s3.id,pid,'ROAS 1.8x vs 3.5x target',[why('Why ROAS 1.8x?','Underperforming ad sets running 3 weeks before budget reallocated.'),why('Why 3 weeks?','Budget reviewed monthly — no mid-month reallocation protocol.'),why('Why no mid-month?','No structured optimisation cadence.'),why('Why no cadence?','No optimisation framework — each specialist works independently.'),why('Why no framework?','ROOT CAUSE: Agency scaled client base without scaling operations. No head of performance to define standards.')],'Agency scaled clients without scaling operations.','1. Weekly optimisation checklist per account. 2. Budget reallocation threshold. 3. A/B test every creative launch.','Head of Performance','2026-05-01')
      await wa(s3.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'40% optimisation actions do not improve ROAS — no test-and-learn',Waiting:'Underperforming ads run 3 weeks before budget pulled',Overprocessing:'Specialists pulling platform reports manually — automation would eliminate'})
      await kz(s3.id,pid,[kzItem('KZ-001','Weekly optimisation checklist + automated alerts','8-step checklist for all accounts. Automated alert when ROAS drops 20%. Target: ROAS from 1.8x to 3.2x.','Quality','critical','in-progress','Head of Performance','2026-04-30',['Design 8-step checklist','Configure automated alerts','Train specialists','Review compliance weekly'])])
      await im(s3.id,pid,[goal('Return on Ad Spend','1.8','3.2','x','Head of Performance','2026-07-01')])
      
      await wa(s2.id,pid,['Defects', 'Waiting', 'Overprocessing'],{'Defects':'38% of campaign briefs require revision after creative review — brief quality at intake is insufficient','Waiting':'Client approval on campaign assets takes avg 8.4 days — no structured review window','Overprocessing':'Full legal and brand review on every asset including minor social media variations — 80% pass unchanged'})
      await kz(s2.id,pid,[kzItem('KZ-001','Campaign brief quality gate before creative briefing','Brief must score 8/10 on standardised brief quality rubric before being passed to creative. Eliminates most revision cycles at source.','Quality','critical','in-progress','Account Director','2026-04-30',['Build brief quality rubric (10 criteria)', 'Train account managers', 'Pilot on next 5 campaigns', 'Track revision rate']),kzItem('KZ-002','Tiered asset review process by risk level','Low-risk assets (organic social, internal) — account manager approves. Medium (paid social) — creative director. High (above-line, OOH) — legal and brand. Eliminates full review on 60% of assets.','Productivity','high','open','Creative Director','2026-05-15',['Define risk tiers', 'Map approval matrix', 'Brief all teams', 'Track approval cycle time by tier'])])
      seeded.push('Digital Marketing')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 52. SOCIAL CARE & WELFARE
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Social Care Assessment Flow'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Social Care')}else{
      const pid=await pr({name:nm,industry:'hospital_acute_care',customer:'Service User',description:'Referral to care plan active. 38% of assessments outside statutory 28-day timeframe.'})
      const s0=await st(pid,0,{name:'Referral Receipt & Triage',operators:2,cycle_time:30,wait_time:1440,wip:50,uptime:100,defect_rate:10})
      const s1=await st(pid,1,{name:'Allocation to Social Worker',operators:1,cycle_time:20,wait_time:4320,wip:30,uptime:100,defect_rate:8})
      const s2=await st(pid,2,{name:'Initial Visit & Assessment',operators:5,cycle_time:240,wait_time:7200,wip:25,uptime:100,defect_rate:38,notes:'BOTTLENECK — 38% outside 28-day statutory window. Caseloads 45+.'})
      const s3=await st(pid,3,{name:'Care Plan Development',operators:5,cycle_time:180,wait_time:2880,wip:20,uptime:100,defect_rate:20})
      const s4=await st(pid,4,{name:'Service Commissioning',operators:2,cycle_time:120,wait_time:4320,wip:15,uptime:100,defect_rate:12})
      const s5=await st(pid,5,{name:'Review & Case Closure',operators:5,cycle_time:120,wait_time:20160,wip:80,uptime:100,defect_rate:25})
      await sw(s2.id,pid,7200,2880,7200,laps(7200),'Assessment wait avg 5 days. 38% outside 28-day window. Workers carry 45 cases vs 30-case maximum.')
      await fw(s2.id,pid,'38% statutory assessment breach',[why('Why 38% breach?','Workers cannot complete 45 assessments within 28-day window.'),why('Why 45 cases?','2 vacancies unfilled for 6 months — caseload redistributed.'),why('Why vacancies unfilled?','Recruitment takes 6 months — candidates withdraw.'),why('Why 6 months?','3 interview stages + DBS + references run sequentially.'),why('Why sequentially?','ROOT CAUSE: HR process requires each stage complete before next — no parallel running.')],'Sequential recruitment takes 6 months — candidates withdraw. Parallel stages would halve time-to-hire.','1. Parallel DBS with interview process. 2. Statutory compliance dashboard with 21-day alert. 3. Review caseloads — close cases inactive 60+ days.','Service Manager','2026-05-01')
      await wa(s2.id,pid,['Waiting','Defects','Overprocessing'],{Waiting:'Service users wait 5 days avg for initial visit',Defects:'38% statutory breach — generates formal compliance report',Overprocessing:'Workers maintaining 15% of cases no longer active — caseload artificially inflated'})
      await kz(s2.id,pid,[kzItem('KZ-001','Statutory compliance dashboard + 21-day alert','Real-time dashboard of open assessments with deadline. Alert at 21 days for manager intervention. Target: breach from 38% to 8%.','Quality','critical','in-progress','Service Manager','2026-04-30',['Spec dashboard in case management system','Configure 21-day alert','Pilot with 1 team','Roll out to all teams'])])
      await im(s2.id,pid,[goal('Statutory Assessment Compliance Rate','62','92','%','Service Manager','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Referral to initial assessment avg 24 days — statutory 45-day target being missed for 28% of cases','Defects':'41% of assessments require follow-up visit for missing information — incomplete referral data at intake','Non-Utilisation':'Social workers spending estimated 42% of time on recording and admin — direct service time constrained'})
      await kz(s2.id,pid,[kzItem('KZ-001','Referral completeness checker before acceptance','Digital or paper checklist at point of referral: mandatory fields per referral type. Incomplete referrals returned before entering queue.','Quality','critical','in-progress','Service Manager','2026-04-30',['Map minimum data requirements by referral type', 'Build checker', 'Brief referral sources', 'Track completeness rate and follow-up visits']),kzItem('KZ-002','Standard recording templates per assessment type','Pre-formatted recording templates for the 6 most common assessment types. Reduces recording time by est. 35% per assessment.','Productivity','high','open','Practice Development Lead','2026-05-01',['Map 6 most common assessment types', 'Co-design templates with social workers', 'Pilot with 5 workers 4 weeks', 'Measure recording time before/after'])])
      seeded.push('Social Care')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 53. FARMING & CROP PRODUCTION
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Farming & Crop Production'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Farming')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Processor / Wholesaler',description:'Land prep to delivery. 12% crop rejected at grading. Harvest timing variation main cause.'})
      const s0=await st(pid,0,{name:'Land Preparation',operators:3,cycle_time:960,wait_time:20160,wip:5,uptime:95,defect_rate:3})
      const s1=await st(pid,1,{name:'Seeding / Planting',operators:4,cycle_time:480,wait_time:2880,wip:3,uptime:100,defect_rate:5})
      const s2=await st(pid,2,{name:'Growing & Crop Management',operators:3,cycle_time:240,wait_time:201600,wip:2,uptime:100,defect_rate:15})
      const s3=await st(pid,3,{name:'Harvest',operators:8,cycle_time:480,wait_time:0,wip:10,uptime:90,defect_rate:12,notes:'BOTTLENECK — 12% rejected at grading. Delayed harvest causes over-maturity.'})
      const s4=await st(pid,4,{name:'Post-harvest Handling',operators:4,cycle_time:120,wait_time:480,wip:8,uptime:96,defect_rate:5})
      const s5=await st(pid,5,{name:'Grading & Packing',operators:6,cycle_time:60,wait_time:240,wip:6,uptime:100,defect_rate:8})
      const s6=await st(pid,6,{name:'Despatch & Delivery',operators:2,cycle_time:30,wait_time:480,wip:4,uptime:100,defect_rate:2})
      await sw(s3.id,pid,600,400,480,laps(480),'Harvest avg 8 hrs/day. 12% rejected at grading. Delayed harvest = over-maturity.')
      await fw(s3.id,pid,'12% crop rejection at grading',[why('Why 12%?','Crops harvested 10 days late — over-maturity causes quality failure.'),why('Why 10 days late?','Harvest calendar from previous variety — new variety has shorter window.'),why('Why not updated?','Variety changed 18 months ago. Calendar not reviewed at changeover.'),why('Why not reviewed?','No formal variety change review process.'),why('Why no process?','ROOT CAUSE: Agronomist contract covers planting only. Harvest timing not in scope of engagement.')],'Agronomist engagement excludes harvest timing. Variety change not triggering calendar review.','1. Extend agronomist scope to harvest timing. 2. Brix measurement protocol. 3. Staggered harvest plan by field maturity.','Farm Manager','2026-04-30')
      await wa(s3.id,pid,['Defects','Waiting','Non-Utilisation'],{Defects:'12% rejection — at £0.45/kg × 800 tonnes = £43,000 season loss',Waiting:'10% harvester breakdown — crop matures further during wait','Non-Utilisation':'Brix meter in store unused — visual assessment causes harvest timing errors'})
      await kz(s3.id,pid,[kzItem('KZ-001','Brix measurement protocol','Daily Brix readings from 3 field zones in final 3 weeks. Harvest triggered by Brix target not calendar date. Target: rejection from 12% to 4%.','Quality','critical','in-progress','Farm Manager','2026-04-15',['Define Brix target for variety','Implement daily measurement','Staggered harvest by field Brix','Track rejection rate by field'])])
      await im(s3.id,pid,[goal('Crop Rejection Rate','12','4','%','Farm Manager','2026-10-01')])
      
      await wa(s3.id,pid,['Waiting', 'Defects', 'Motion'],{'Waiting':'Harvest machinery idle avg 3.1 hrs/day waiting for trailer exchange — trailer supply not synchronised with harvest rate','Defects':'7.2% crop rejection at intake — predominantly from variable harvest timing (over/under-ripe)','Motion':'Machinery repositioning between field sections adds avg 45 mins/day — field sequence not optimised for harvest order'})
      await kz(s3.id,pid,[kzItem('KZ-001','Trailer rotation synchronisation with harvest rate','Match trailer pool size and rotation cycle to combine output rate. Add dedicated tractor-trailer loop. Target: idle time from 3.1 hrs to under 45 mins/day.','Productivity','critical','in-progress','Farm Manager','2026-04-15',['Time study combine output rate vs trailer cycle time', 'Calculate required trailer pool size', 'Arrange additional trailer if needed', 'Measure daily idle time']),kzItem('KZ-002','Brix monitoring protocol for harvest timing','Measure Brix (sugar content) daily in the 7 days before target harvest. Decision rule: harvest when Brix hits target range. Reduces rejection from variable maturity.','Quality','high','open','Agronomist','2026-05-01',['Define Brix target range per variety', 'Procure refractometers', 'Train harvest team on protocol', 'Track rejection rate vs previous season'])])
      seeded.push('Farming')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 54. AQUACULTURE & FISHERIES
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Aquaculture Production Cycle'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Aquaculture')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Processor / Retailer',description:'Stocking to market-ready. FCR 1.9 vs 1.5 target. 8% mortality from disease events.'})
      const s0=await st(pid,0,{name:'Hatchery & Juvenile Production',operators:3,cycle_time:480,wait_time:40320,wip:5,uptime:100,defect_rate:10})
      const s1=await st(pid,1,{name:'Stocking & Transfer',operators:3,cycle_time:120,wait_time:1440,wip:4,uptime:100,defect_rate:5})
      const s2=await st(pid,2,{name:'Grow-out & Feeding',operators:4,cycle_time:240,wait_time:0,wip:20,uptime:100,defect_rate:8,notes:'BOTTLENECK — 8% mortality. FCR 1.9 vs 1.5 target.'})
      const s3=await st(pid,3,{name:'Health Monitoring & Treatment',operators:2,cycle_time:120,wait_time:480,wip:5,uptime:100,defect_rate:15})
      const s4=await st(pid,4,{name:'Harvest & Processing',operators:8,cycle_time:360,wait_time:240,wip:3,uptime:92,defect_rate:5})
      const s5=await st(pid,5,{name:'Quality Check & Despatch',operators:2,cycle_time:60,wait_time:240,wip:2,uptime:100,defect_rate:3})
      await sw(s2.id,pid,0,0,240,laps(240),'Grow-out monitoring avg 4 hrs/day. 8% mortality — two significant disease events per season.')
      await fw(s2.id,pid,'8% mortality + FCR 1.9',[why('Why 8% mortality?','Disease events detected 48-72 hrs after onset — too late for effective treatment.'),why('Why detected late?','Health monitoring is visual inspection — sub-clinical signs missed.'),why('Why visual only?','No biosensor or real-time water quality monitoring in pens.'),why('Why no sensor?','Capital expenditure not approved — mortality cost not quantified.'),why('Why not quantified?','ROOT CAUSE: Mortality cost never presented. Sensor investment case not made.')],'Mortality cost never quantified and presented. Sensor ROI case not made.','1. Quantify mortality cost. 2. Present sensor ROI case. 3. Interim: twice-daily health observation protocol.','Production Manager','2026-05-01')
      await wa(s2.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'8% mortality — season revenue loss per cage',Waiting:'Disease response delayed 6 hrs — fish health officer at another site',Overprocessing:'Feed applied on weekly fixed rate — daily temperature adjustment would improve FCR'})
      await kz(s2.id,pid,[kzItem('KZ-001','Twice-daily health observation + temperature-adjusted feeding','Morning and afternoon structured health observation. Temperature-adjusted feed table. Target: mortality from 8% to 3%, FCR from 1.9 to 1.6.','Quality','critical','in-progress','Production Manager','2026-04-30',['Design observation checklist','Implement temperature-adjusted feed table','Train grow-out staff','Track FCR and mortality weekly'])])
      await im(s2.id,pid,[goal('Grow-out Mortality Rate','8','3','%','Production Manager','2026-10-01')])
      
      await wa(s3.id,pid,['Defects', 'Waiting', 'Non-Utilisation'],{'Defects':'4.8% mortality rate in grow-out phase — primarily from sea lice infestation and oxygen depletion events','Waiting':'Harvest-to-processing delay averages 8.6 hours — ice packs depleted on long hauls, quality impact','Non-Utilisation':'Feed conversion ratio 1.42 against industry benchmark 1.18 — overfeeding and uneaten feed waste'})
      await kz(s3.id,pid,[kzItem('KZ-001','Automated oxygen monitoring with alert threshold','Deploy dissolved oxygen sensors with automatic alert at <7 mg/L. Operator response protocol: increase aeration within 15 mins. Target: eliminate hypoxia mortality events.','Quality','critical','in-progress','Farm Manager','2026-04-15',['Source oxygen monitoring sensors', 'Install and calibrate', 'Set alert threshold and recipient list', 'Train operators on response protocol', 'Track mortality rate monthly']),kzItem('KZ-002','Precision feeding protocol based on appetite monitoring','Use underwater camera or AI feed waste monitor to adjust feed rate to actual appetite. Target: FCR from 1.42 to 1.25 within 90 days.','Productivity','high','open','Production Manager','2026-05-01',['Evaluate appetite monitoring options', 'Pilot on 2 pens', 'Develop decision rules', 'Track FCR weekly'])])
      seeded.push('Aquaculture')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 55. OIL & GAS
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Oil & Gas Drilling Operations'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Oil & Gas')}else{
      const pid=await pr({name:nm,industry:'aerospace_manufacturing',customer:'Production Operations',description:'Spud to total depth. NPT 18% vs 8% industry benchmark.'})
      const s0=await st(pid,0,{name:'Well Planning & Engineering',operators:5,cycle_time:2880,wait_time:20160,wip:3,uptime:100,defect_rate:12})
      const s1=await st(pid,1,{name:'Rig Mobilisation & Setup',operators:15,cycle_time:1440,wait_time:2880,wip:1,uptime:100,defect_rate:8})
      const s2=await st(pid,2,{name:'Drilling Operations',operators:20,cycle_time:2880,wait_time:0,wip:1,uptime:82,defect_rate:18,notes:'BOTTLENECK — NPT 18%. Stuck pipe most common cause.'})
      const s3=await st(pid,3,{name:'Formation Evaluation & Logging',operators:6,cycle_time:960,wait_time:480,wip:1,uptime:100,defect_rate:8})
      const s4=await st(pid,4,{name:'Completion & Well Integrity',operators:8,cycle_time:1440,wait_time:480,wip:1,uptime:96,defect_rate:10})
      const s5=await st(pid,5,{name:'Well Handover to Production',operators:4,cycle_time:480,wait_time:480,wip:1,uptime:100,defect_rate:5})
      await sw(s2.id,pid,3600,2880,2880,laps(2880),'Drilling avg 48 hrs/section. NPT 18%. Stuck pipe 11% of total NPT. Each event avg 8 hrs recovery.')
      await fw(s2.id,pid,'NPT 18% — stuck pipe 11% of drilling time',[why('Why 18% NPT?','Stuck pipe from differential sticking — mud weight too high.'),why('Why too high?','Mud weight adjusted to plan not actual pore pressure.'),why('Why not real-time?','Mud engineer reviews every 4 hours — pore pressure changes in minutes.'),why('Why 4-hourly?','Protocol written 2019 — real-time capability installed 2022 but protocol not updated.'),why('Why not updated?','ROOT CAUSE: Real-time data capability installed but monitoring protocol not updated. Technology adoption without process redesign.')],'Real-time data capability installed but monitoring protocol not updated.','1. Continuous pore pressure monitoring protocol. 2. Real-time mud adjustment response. 3. Pre-drill stuck pipe probability model per section.','Drilling Superintendent','2026-04-30')
      await wa(s2.id,pid,['Defects','Waiting','Non-Utilisation'],{Defects:'NPT 18% — at $85k/day rig rate = $15,300/day waste',Waiting:'Stuck pipe recovery avg 8 hrs — rig on standby','Non-Utilisation':'Real-time drilling data available but reviewed 4-hourly only'})
      await kz(s2.id,pid,[kzItem('KZ-001','Continuous pore pressure monitoring protocol','Real-time pore pressure from LWD. Mud weight adjusted in real-time. Target: NPT from 18% to 8%.','Quality','critical','in-progress','Drilling Superintendent','2026-04-01',['Update monitoring protocol to continuous','Brief mud engineer and team','Define response threshold','Track NPT weekly by cause code'])])
      await im(s2.id,pid,[goal('Non-Productive Time (NPT)','18','8','%','Drilling Superintendent','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Decision-making delays account for 38% of NPT — waiting for engineering, procurement, or management approval during drilling problems','Defects':'Stuck pipe contributes 11% of total NPT — root cause: PM protocol on BHA not updated since 2019','Non-Utilisation':'Drill crew idle during bit trips for formation evaluation — evaluation could be performed during trip rather than additional dedicated time'})
      await kz(s2.id,pid,[kzItem('KZ-001','Decision authority matrix for common NPT scenarios','Pre-defined decision tree for top-8 NPT causes: drill crew has authority to act within defined parameters without waiting for offshore company man. Target: decision delay from 4.2 hrs avg to under 45 mins.','Delivery','critical','in-progress','Drilling Superintendent','2026-04-30',['Map top-8 NPT causes from last 24 months', 'Define decision parameters for each', 'Issue authority matrix to drill crew', 'Debrief after each NPT event']),kzItem('KZ-002','BHA PM protocol update and compliance tracking','Update BHA PM procedure to reflect current formation and wellbore conditions. Add compliance check at each BHA pull.','Quality','high','open','Drilling Engineer','2026-05-01',['Review current BHA PM protocol vs actual conditions', 'Update procedure', 'Issue formal change control', 'Add compliance check to BHA pull checklist'])])
      seeded.push('Oil & Gas')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 56. RAIL PASSENGER SERVICES
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Rail Passenger Service Operations'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Rail')}else{
      const pid=await pr({name:nm,industry:'retail_banking',customer:'Commuter / Passenger',description:'Service planning to delivered journey. Punctuality 72% vs 92% target. Primary cause: dwell time exceedance.'})
      const s0=await st(pid,0,{name:'Service Planning & Timetabling',operators:5,cycle_time:480,wait_time:43200,wip:10,uptime:100,defect_rate:8})
      const s1=await st(pid,1,{name:'Train Preparation & Dispatch',operators:4,cycle_time:30,wait_time:15,wip:3,uptime:100,defect_rate:5})
      const s2=await st(pid,2,{name:'Station Calling — Dwell',operators:2,cycle_time:60,wait_time:0,wip:1,uptime:100,defect_rate:22,notes:'BOTTLENECK — 22% of dwells exceed planned time.'})
      const s3=await st(pid,3,{name:'On-board Service',operators:3,cycle_time:0,wait_time:0,wip:1,uptime:98,defect_rate:8})
      const s4=await st(pid,4,{name:'Fault Response & Recovery',operators:6,cycle_time:45,wait_time:30,wip:2,uptime:100,defect_rate:15})
      const s5=await st(pid,5,{name:'Performance Review & Report',operators:3,cycle_time:120,wait_time:1440,wip:1,uptime:100,defect_rate:0})
      await sw(s2.id,pid,90,60,60,laps(60),'Dwell avg 60s. Planned 45s. 22% of stations exceed 75s. Punctuality 72% vs 92%.')
      await fw(s2.id,pid,'Dwell time exceedance causing punctuality 72% vs 92%',[why('Why 22% dwell exceedance?','80% of passengers arrive in final 20 min — 10 gates insufficient for volume.'),why('Why arrive simultaneously?','No early arrival incentive.'),why('Why no incentive?','Ticketing system sets single gate-open time for all tickets.'),why('Why not variable?','Ticketing system not configured for time-banded entry.'),why('Why not configured?','ROOT CAUSE: Ticketing configured by marketing without operations input. Time-banded entry capability not utilised.')],'Ticketing configured by marketing without operations input.','1. Time-banded ticket zones. 2. Early arrival incentive. 3. Digital ticket scanning at all gates.','Performance Director','2026-05-01')
      await wa(s2.id,pid,['Waiting','Defects','Non-Utilisation'],{Waiting:'22% dwell exceedance — passengers miss connections downstream',Defects:'72% punctuality — regulatory penalty risk','Non-Utilisation':'2 gates unstaffed at peak — capacity wasted'})
      await kz(s2.id,pid,[kzItem('KZ-001','Time-banded entry zones + early arrival incentive','3 arrival bands. Concourse voucher for early arrival. Target: peak queue from 38 min to 12 min. Punctuality target 88%.','Delivery','critical','in-progress','Performance Director','2026-04-30',['Spec time-banding with ticketing supplier','Design incentive','Pilot next 3 events','Measure peak queue time'])])
      await im(s2.id,pid,[goal('Service Punctuality','72','88','%','Performance Director','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Overprocessing'],{'Waiting':'Platform dwell time exceeds timetable allocation by avg 2.4 mins at 3 key interchange stations — cascades downstream','Defects':'18% of trains arrive with reported faults carried over from previous duty — defect not cleared at depot','Overprocessing':'Train preparation at depot includes 14-step checklist — 6 steps are duplicates of driver pre-departure checks'})
      await kz(s2.id,pid,[kzItem('KZ-001','Dwell time reduction at 3 key interchange stations','Timetable revision + passenger boarding distribution improvements (door allocation signage). Target: dwell time to timetable allocation at all stations.','Delivery','critical','in-progress','Service Delivery Manager','2026-04-30',['Analyse dwell time data by station and TOD', 'Identify root causes per station', 'Pilot boarding distribution signage', 'Measure dwell time weekly']),kzItem('KZ-002','Carry-forward fault zero tolerance protocol','No train to depart depot with a reported fault unless fault cleared or risk-assessed and documented. Reduces in-service failures.','Quality','high','open','Fleet Manager','2026-05-01',['Audit current carry-forward fault volume', 'Define acceptable vs unacceptable carry-forward', 'Issue protocol to depot teams', 'Track carry-forward faults weekly'])])
      seeded.push('Rail')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 57. PORT & MARITIME OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Port & Maritime Container Operations'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Port & Maritime')}else{
      const pid=await pr({name:nm,industry:'warehousing_distribution',customer:'Shipping Line / Cargo Owner',description:'Vessel arrival to departure. Crane productivity 22 moves/hr vs 28-move target.'})
      const s0=await st(pid,0,{name:'Vessel Arrival & Berthing',operators:4,cycle_time:90,wait_time:120,wip:3,uptime:100,defect_rate:8})
      const s1=await st(pid,1,{name:'Stevedoring Setup',operators:6,cycle_time:45,wait_time:30,wip:2,uptime:100,defect_rate:5})
      const s2=await st(pid,2,{name:'Crane Operations — Discharge',operators:8,cycle_time:2,wait_time:1,wip:500,uptime:88,defect_rate:3,notes:'BOTTLENECK — 22 moves/hr vs 28-move target. Crane downtime 12%.'})
      const s3=await st(pid,3,{name:'Container Gate & Yard Management',operators:10,cycle_time:15,wait_time:30,wip:200,uptime:100,defect_rate:4})
      const s4=await st(pid,4,{name:'Crane Operations — Load',operators:8,cycle_time:2,wait_time:1,wip:400,uptime:88,defect_rate:3})
      const s5=await st(pid,5,{name:'Vessel Departure & Documentation',operators:3,cycle_time:60,wait_time:30,wip:1,uptime:100,defect_rate:5})
      await sw(s2.id,pid,0,0,2,laps(2),'Crane productivity 22 moves/hr. Target 28. Crane downtime 12%. Each hour below target = $4,200 vessel delay cost.')
      await ika(s2.id,pid,'Crane productivity 22 moves/hr vs 28 target — 12% downtime','6M Manufacturing',{Machine:['Crane 3 and 5 overdue preventive maintenance — operating beyond PM interval','Spreader misalignment causes miss-pick — 3% of lifts'],Method:['No planned maintenance during vessel gap — PM only when crane breaks','Crane drivers not briefed on vessel stow plan before operation starts'],Material:['Container weight distribution uneven — crane load varies causing speed adjustment'],Manpower:['2 crane drivers covering 3 cranes simultaneously at peak — productivity compromised'],Measurement:['Moves/hr tracked per shift but not by crane — underperforming crane invisible'],'Mother Nature':['Wind speed >18 knots forces crane to slow — no forecast-based planning']})
      await fw(s2.id,pid,'Crane productivity 22 moves/hr vs 28 target',[why('Why 22 moves/hr?','Cranes 3 and 5 operating below rated capacity — PM overdue.'),why('Why PM overdue?','PM scheduled at 2,500 operating hours — hours not tracked per crane.'),why('Why not tracked?','CMMS system tracks fleet total hours, not per-crane.'),why('Why not per-crane?','CMMS configured at fleet level when installed in 2018.'),why('Why not updated?','ROOT CAUSE: CMMS configuration never reviewed since installation. Crane availability data not informing PM scheduling.')],'CMMS configured at fleet level — per-crane hours not tracked. PM scheduling blind.','1. Configure per-crane hours in CMMS. 2. Overdue PM on cranes 3 and 5 immediately. 3. Plan PM during vessel gaps, not reactively.','Terminal Manager','2026-04-30')
      await wa(s2.id,pid,['Defects','Waiting','Non-Utilisation'],{Defects:'3% miss-pick rate — container damage and re-lift adds 4 min per event',Waiting:'PM downtime unplanned — vessel waits at berth at $4,200/hr',Overprocessing:'Crane drivers manually tracking position — terminal OS should handle allocation'})
      await kz(s2.id,pid,[kzItem('KZ-001','Per-crane hours tracking + planned PM schedule','Configure CMMS per crane. Overdue PM on cranes 3 & 5 immediately. Future PM during vessel gaps. Target: productivity from 22 to 27 moves/hr.','Quality','critical','in-progress','Terminal Manager','2026-04-15',['Configure per-crane hours in CMMS','Schedule overdue PM cranes 3 & 5','Set PM calendar aligned to vessel schedule','Track moves/hr per crane weekly'])])
      await im(s2.id,pid,[goal('Crane Productivity','22','27','moves/hr','Terminal Manager','2026-07-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Inventory'],{'Waiting':'Vessel waiting time at anchorage avg 14.2 hours — berth allocation not communicated until vessel inside pilot waters','Defects':'6.8% of containers have documentation errors requiring manual intervention — delays customs clearance','Inventory':'Container dwell time in yard avg 4.8 days — industry benchmark 2.1 days — import containers blocking space'})
      await kz(s2.id,pid,[kzItem('KZ-001','Advance berth allocation notification 24 hours out','Confirm berth slot 24 hours before vessel arrival. Allows stevedore pre-planning. Target: reduce anchorage wait from 14.2 to under 4 hours.','Delivery','critical','in-progress','Port Operations Manager','2026-04-30',['Map current berth allocation process', 'Identify decision points causing delay', 'Build 24-hr advance notification workflow', 'Track anchorage wait time weekly']),kzItem('KZ-002','Digital documentation pre-clearance portal','Importers submit customs documentation 48 hours before vessel arrival. Pre-clearance eliminates 70% of documentation hold-ups.','Quality','high','open','Customs Liaison Manager','2026-05-15',['Define pre-clearance document set', 'Build or integrate portal', 'Pilot with 10 regular importers', 'Track documentation error rate'])])
      seeded.push('Port & Maritime')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 58. ENGINEERING & TECHNICAL CONSULTING
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Engineering Consulting Delivery'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Engineering Consulting')}else{
      const pid=await pr({name:nm,industry:'management_consulting',customer:'Client Organisation',description:'Brief to accepted deliverable. 32% of reports require revision. Bottleneck at technical review.'})
      const s0=await st(pid,0,{name:'Client Brief & Scoping',operators:2,cycle_time:240,wait_time:2880,wip:5,uptime:100,defect_rate:20})
      const s1=await st(pid,1,{name:'Data Collection & Site Survey',operators:3,cycle_time:480,wait_time:1440,wip:4,uptime:100,defect_rate:12})
      const s2=await st(pid,2,{name:'Analysis & Calculation',operators:2,cycle_time:960,wait_time:480,wip:3,uptime:100,defect_rate:15})
      const s3=await st(pid,3,{name:'Technical Review & Check',operators:1,cycle_time:480,wait_time:2880,wip:6,uptime:100,defect_rate:32,notes:'BOTTLENECK — 32% reports require revision. Single checker on all work.'})
      const s4=await st(pid,4,{name:'Report Drafting',operators:2,cycle_time:360,wait_time:480,wip:4,uptime:100,defect_rate:15})
      const s5=await st(pid,5,{name:'Client Delivery & Sign-off',operators:1,cycle_time:60,wait_time:2880,wip:3,uptime:100,defect_rate:8})
      await sw(s3.id,pid,960,360,480,laps(480),'Technical review avg 8 hrs. 32% returned. 3-day queue — single checker.')
      await fw(s3.id,pid,'32% report revision rate — single checker bottleneck',[why('Why 32%?','Calculations contain errors in assumptions and boundary conditions.'),why('Why errors in assumptions?','Brief not formally confirmed in writing before analysis begins.'),why('Why not confirmed?','No written brief confirmation step in project workflow.'),why('Why not in workflow?','Workflow designed by finance not by engineering.'),why('Why not by engineering?','ROOT CAUSE: Project workflow designed at firm founding. Engineering team never involved in workflow design.')],'Project workflow designed by finance — engineering requirements not captured.','1. Written brief confirmation before analysis. 2. Calculation assumption checklist. 3. Second checker for high-complexity work.','Technical Director','2026-05-01')
      await wa(s3.id,pid,['Defects','Waiting','Non-Utilisation'],{Defects:'32% revision rate — 4-6 hrs rework per report',Waiting:'3-day queue — single checker is the rate limiter',Overprocessing:'Full calculation redone when only 1 assumption wrong — no targeted correction'})
      await kz(s3.id,pid,[kzItem('KZ-001','Written brief confirmation + assumption checklist','Client confirms brief in writing. Assumption checklist completed before analysis. Target: revision from 32% to 10%.','Quality','critical','in-progress','Technical Director','2026-04-30',['Design brief confirmation form','Design assumption checklist','Pilot on next 5 projects','Measure revision rate'])])
      await im(s3.id,pid,[goal('Report Revision Rate','32','10','%','Technical Director','2026-07-01')])
      
      await wa(s2.id,pid,['Defects', 'Waiting', 'Overprocessing'],{'Defects':'44% of deliverables require at least one revision round after client submission — scope interpretation varies between engineers','Waiting':'Client sign-off on interim deliverables adds avg 11 days per project phase — no structured review window agreed at project start','Overprocessing':'Full QA review on all deliverables including minor interim outputs — review effort not calibrated to deliverable significance'})
      await kz(s2.id,pid,[kzItem('KZ-001','Deliverable scope definition checklist at project kick-off','Mandatory scope definition session for each deliverable at project start: format, level of detail, acceptance criteria. Reduces revision rate from 44%.','Quality','critical','in-progress','Technical Director','2026-04-30',['Design scope definition template', 'Brief all project engineers', 'Enforce on next 5 projects', 'Track revision rate']),kzItem('KZ-002','Structured client review window in project schedule','Book 5-day client review window into project schedule at proposal stage. Client commits to response within window. Eliminates open-ended review delays.','Delivery','high','open','Project Manager','2026-05-01',['Draft client review commitment clause', 'Add to standard proposal template', 'Brief account managers', 'Track review turnaround time'])])
      seeded.push('Engineering Consulting')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 59. ACADEMIC RESEARCH
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Academic Research Publication Flow'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Academic Research')}else{
      const pid=await pr({name:nm,industry:'pharmaceutical_manufacturing',customer:'Academic Community / Funder',description:'Research question to published finding. 6 stages. Bottleneck at peer review — 58% of papers rejected at first submission.'})
      const s0=await st(pid,0,{name:'Hypothesis & Study Design',operators:2,cycle_time:480,wait_time:10080,wip:5,uptime:100,defect_rate:25})
      const s1=await st(pid,1,{name:'Data Collection',operators:3,cycle_time:960,wait_time:4320,wip:4,uptime:100,defect_rate:20})
      const s2=await st(pid,2,{name:'Data Analysis',operators:2,cycle_time:720,wait_time:2880,wip:3,uptime:100,defect_rate:18})
      const s3=await st(pid,3,{name:'Manuscript Writing',operators:2,cycle_time:960,wait_time:1440,wip:3,uptime:100,defect_rate:30})
      const s4=await st(pid,4,{name:'Peer Review & Revision',operators:1,cycle_time:2880,wait_time:40320,wip:4,uptime:100,defect_rate:58,notes:'BOTTLENECK — 58% rejected first submission. Avg 3.2 rounds of revision.'})
      const s5=await st(pid,5,{name:'Publication & Dissemination',operators:1,cycle_time:480,wait_time:20160,wip:2,uptime:100,defect_rate:5})
      await sw(s4.id,pid,5760,2880,2880,laps(2880),'Peer review avg 28-day wait. 58% rejected first submission. 3.2 revision rounds. Time-to-publication avg 18 months.')
      await fw(s4.id,pid,'58% rejection at first submission',[why('Why 58% rejection?','Methodology and contribution not clearly differentiated from prior literature.'),why('Why not differentiated?','Literature review not current — papers from 2+ years ago only.'),why('Why not current?','Literature review done at study outset — not updated before submission.'),why('Why not updated?','No pre-submission literature refresh step in research workflow.'),why('Why no step?','ROOT CAUSE: Research workflow informal — based on supervisor preference, not structured protocol.')],'Research workflow informal — supervisor preference, not structured protocol.','1. Pre-submission literature refresh step. 2. Target journal identified before writing begins. 3. Internal peer review before submission.','Principal Investigator','2026-06-01')
      await wa(s4.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'58% first rejection — avg 3.2 revision rounds, each 28-day wait',Waiting:'40,320 min (28 day) avg peer review wait',Overprocessing:'Full manuscript written before checking target journal fit — misaligned scope causes rejection'})
      await kz(s4.id,pid,[kzItem('KZ-001','Pre-submission internal peer review','Lab internal peer review before journal submission. Target: rejection from 58% to 25%.','Quality','critical','in-progress','Principal Investigator','2026-04-30',['Establish internal review protocol','Assign 2 reviewers per manuscript','Complete before submission','Measure external rejection rate'])])
      await im(s4.id,pid,[goal('First-Submission Rejection Rate','58','25','%','Principal Investigator','2026-09-01')])
      
      await wa(s3.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Peer review response time avg 68 days — with no visibility of reviewer status after submission','Defects':'62% of submitted manuscripts require major revisions — methodology or presentation issues identifiable pre-submission','Non-Utilisation':'Researchers spending est. 35% of time on grant administration and reporting — research time displaced'})
      await kz(s3.id,pid,[kzItem('KZ-001','Internal pre-submission peer review','Structured internal review by 2 lab colleagues before journal submission. Target: major revision rate from 62% to under 30%.','Quality','critical','in-progress','Principal Investigator','2026-05-01',['Define internal review criteria (methods, stats, presentation)', 'Assign review pairs', 'Enforce before next 3 submissions', 'Track revision rate']),kzItem('KZ-002','Grant admin delegation to research administrator','Audit PI time on grant admin tasks. Transfer routine reporting and compliance tasks to dedicated research administrator.','Productivity','high','open','Head of Department','2026-05-15',['Time study PI activities over 2 weeks', 'Identify transferable admin tasks', 'Define research admin role scope', 'Measure PI research time freed'])])
      seeded.push('Academic Research')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 60. CLINICAL TRIALS & MEDICAL RESEARCH
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Clinical Trial Operations'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Clinical Trials')}else{
      const pid=await pr({name:nm,industry:'pharmaceutical_manufacturing',customer:'Regulatory Agency / Pharma Client',description:'Protocol to regulatory submission. Bottleneck at site activation — avg 6.8 months vs 3-month target.'})
      const s0=await st(pid,0,{name:'Protocol Development & Approval',operators:4,cycle_time:2880,wait_time:20160,wip:3,uptime:100,defect_rate:20})
      const s1=await st(pid,1,{name:'Site Selection & Feasibility',operators:3,cycle_time:1440,wait_time:10080,wip:5,uptime:100,defect_rate:15})
      const s2=await st(pid,2,{name:'Site Activation',operators:4,cycle_time:2880,wait_time:40320,wip:8,uptime:100,defect_rate:35,notes:'BOTTLENECK — 6.8-month avg vs 3-month target. IRB delays main cause.'})
      const s3=await st(pid,3,{name:'Patient Recruitment',operators:6,cycle_time:480,wait_time:20160,wip:12,uptime:100,defect_rate:40})
      const s4=await st(pid,4,{name:'Data Collection & Monitoring',operators:5,cycle_time:240,wait_time:4320,wip:10,uptime:100,defect_rate:15})
      const s5=await st(pid,5,{name:'Database Lock & Regulatory Submission',operators:4,cycle_time:2880,wait_time:10080,wip:3,uptime:100,defect_rate:12})
      await sw(s2.id,pid,100800,40320,40320,laps(40320),'Site activation avg 6.8 months (40,320 min). IRB submission wait 3.2 months on average. Each month delay costs $280k.')
      await fw(s2.id,pid,'Site activation 6.8 months vs 3-month target',[why('Why 6.8 months?','IRB submission wait averages 3.2 months — IRB queue at site institutions.'),why('Why long queue?','IRB submissions not prioritised — submitted without pre-IRB engagement.'),why('Why no pre-engagement?','No pre-submission IRB meeting standard in activation process.'),why('Why no standard?','Site activation SOP written 2017 — pre-engagement not included.'),why('Why not included?','ROOT CAUSE: SOP written based on regulatory minimum requirements only. IRB engagement best practice not incorporated.')], 'Site activation SOP based on regulatory minimum only. IRB pre-engagement best practice not incorporated.','1. Pre-submission IRB meeting for all sites. 2. Parallel IRB and contract negotiation. 3. Site readiness tracker dashboard.','Clinical Operations Manager','2026-05-01')
      await wa(s2.id,pid,['Waiting','Defects','Overprocessing'],{Waiting:'40,320-min avg site activation — each month delay costs $280k per study',Defects:'35% of sites have activation issues — documents incomplete or IRB queries',Overprocessing:'Contract negotiation starts after IRB approval — sequential when both could run parallel'})
      await kz(s2.id,pid,[kzItem('KZ-001','Pre-submission IRB meeting for all sites','Schedule IRB pre-submission meeting 30 days before formal submission. Reduce query rate and queue time. Target: activation from 6.8 to 3.5 months.','Delivery','critical','in-progress','Clinical Operations Manager','2026-05-01',['Define pre-submission meeting protocol','Add to site activation SOP','Schedule meetings for all open sites','Track activation time monthly'])])
      await im(s2.id,pid,[goal('Site Activation Time','6.8','3.5','months','Clinical Operations Manager','2026-09-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Non-Utilisation'],{'Waiting':'Site activation avg 8.4 months from protocol finalisation — regulatory and ethics submissions sequential rather than parallel','Defects':'18% of data queries from monitor — source document inconsistencies and protocol deviations','Non-Utilisation':'Coordinators spending 55% of time on data entry and query resolution — patient-facing time constrained'})
      await kz(s2.id,pid,[kzItem('KZ-001','Parallel regulatory and ethics submission','Submit to regulatory authority and ethics committee simultaneously rather than sequentially. Target: site activation from 8.4 months to 5.5 months.','Delivery','critical','in-progress','Clinical Operations Director','2026-04-30',['Identify parallel submission feasibility per jurisdiction', 'Agree parallel process with regulatory affairs', 'Pilot on next 2 sites', 'Measure activation timeline']),kzItem('KZ-002','Source data verification checklist for coordinators','Site-level checklist for coordinators to self-check data entries before monitor visit. Target: data query rate from 18% to under 6%.','Quality','high','open','Clinical Research Associate','2026-05-01',['Analyse most common query types from last 3 audits', 'Build self-check checklist targeting those types', 'Train site coordinators', 'Track query rate per site'])])
      seeded.push('Clinical Trials')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 61. PROJECT MANAGEMENT — GENERAL
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Project Management Delivery'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Project Management')}else{
      const pid=await pr({name:nm,industry:'management_consulting',customer:'Project Sponsor',description:'Initiation to closure. 62% of projects delivered late or over budget. Bottleneck at planning — scope creep unchecked.'})
      const s0=await st(pid,0,{name:'Initiation & Charter',operators:2,cycle_time:240,wait_time:2880,wip:5,uptime:100,defect_rate:20})
      const s1=await st(pid,1,{name:'Planning & Scheduling',operators:3,cycle_time:960,wait_time:1440,wip:4,uptime:100,defect_rate:35,notes:'BOTTLENECK — 35% of plans do not include risk register or change control.'})
      const s2=await st(pid,2,{name:'Execution & Work Package Delivery',operators:10,cycle_time:480,wait_time:240,wip:8,uptime:100,defect_rate:25})
      const s3=await st(pid,3,{name:'Monitoring & Change Control',operators:2,cycle_time:120,wait_time:480,wip:6,uptime:100,defect_rate:40})
      const s4=await st(pid,4,{name:'Stakeholder Reporting',operators:1,cycle_time:120,wait_time:1440,wip:5,uptime:100,defect_rate:15})
      const s5=await st(pid,5,{name:'Closure & Lessons Learned',operators:2,cycle_time:180,wait_time:480,wip:3,uptime:100,defect_rate:50,notes:'50% of projects skip lessons learned — same mistakes recur'})
      await sw(s1.id,pid,1440,480,960,laps(960),'Planning avg 16 hrs. 35% of plans missing risk register. 62% of projects late or over budget.')
      await fw(s1.id,pid,'62% of projects delivered late or over budget',[why('Why 62% fail?','Scope changes accepted without impact assessment — budget and schedule overrun.'),why('Why accepted?','No formal change control process — PMs agree scope informally.'),why('Why informal?','Change control not in project management methodology.'),why('Why not in methodology?','Methodology written by PMO but not enforced — sponsor bypasses PM.'),why('Why bypasses?','ROOT CAUSE: Sponsor authority not defined. PMO methodology has no executive mandate.')], 'PMO methodology has no executive mandate — sponsors bypass change control.','1. Executive mandate for change control. 2. Risk register mandatory in project charter. 3. Change impact assessment template.','PMO Director','2026-05-01')
      await wa(s1.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'62% late/over-budget — avg 28% cost overrun per project',Waiting:'Decisions wait 5+ days for sponsor — no defined escalation path',Overprocessing:'Weekly status reports prepared but never read by 40% of stakeholders — reporting waste'})
      await kz(s1.id,pid,[kzItem('KZ-001','Executive mandate for change control + risk register','Board-mandated change control. Risk register required in charter. Target: late/over-budget from 62% to 25%.','Quality','critical','in-progress','PMO Director','2026-04-30',['Draft board mandate document','Gain executive sign-off','Update project charter template','Train all PMs'])])
      await im(s1.id,pid,[goal('Projects Delivered On Time & Budget','38','75','%','PMO Director','2026-09-01')])
      
      await wa(s2.id,pid,['Waiting', 'Defects', 'Overprocessing'],{'Waiting':'Sponsor approval of change requests avg 14 days — no dedicated decision window in governance calendar','Defects':'38% of deliverables miss acceptance criteria on first submission — criteria not defined clearly at project outset','Overprocessing':'Weekly status report takes PM avg 3.5 hours to produce — format not standardised, data pulled from multiple systems manually'})
      await kz(s2.id,pid,[kzItem('KZ-001','Fortnightly sponsor decision window in project calendar','Book 60-min fortnightly decision meeting in sponsor diary at project kick-off. All CRs and escalations batched to this window. Target: CR approval from 14 days to under 7 days.','Delivery','critical','in-progress','Programme Manager','2026-04-30',['Add decision window to project initiation checklist', 'Brief project sponsors', 'Track CR cycle time']),kzItem('KZ-002','Standardised weekly status report template','Single-page RAG status template with auto-populated data from project tool. PM time from 3.5 hours to 45 mins.','Productivity','high','open','PMO Lead','2026-05-01',['Design 1-page template (RAG, milestones, risks, decisions needed)', 'Connect to project tool for auto-data pull', 'Brief all PMs', 'Measure time to produce status report'])])
      seeded.push('Project Management')
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // 62. GRAPHIC DESIGN & BRAND
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Graphic Design Studio Flow'; if(!shouldSeed(nm)){return}
    const id=await ex(nm); if(id){existing.push('Graphic Design')}else{
      const pid=await pr({name:nm,industry:'marketing_agency',customer:'Brand Owner / Marketing Manager',description:'Brief to approved deliverable. 42% of projects exceed original scope. 2.8 revision rounds average.'})
      const s0=await st(pid,0,{name:'Brief Intake & Clarification',operators:1,cycle_time:60,wait_time:1440,wip:8,uptime:100,defect_rate:35,notes:'35% of briefs require clarification before design can start'})
      const s1=await st(pid,1,{name:'Concept Development',operators:2,cycle_time:360,wait_time:480,wip:5,uptime:100,defect_rate:20})
      const s2=await st(pid,2,{name:'Design Execution',operators:3,cycle_time:480,wait_time:240,wip:6,uptime:100,defect_rate:15})
      const s3=await st(pid,3,{name:'Internal Review',operators:1,cycle_time:120,wait_time:480,wip:8,uptime:100,defect_rate:25})
      const s4=await st(pid,4,{name:'Client Presentation & Approval',operators:1,cycle_time:60,wait_time:2880,wip:10,uptime:100,defect_rate:42,notes:'BOTTLENECK — 42% require revision. 2.8 rounds average.'})
      const s5=await st(pid,5,{name:'Production & File Delivery',operators:1,cycle_time:60,wait_time:240,wip:4,uptime:100,defect_rate:5})
      await sw(s4.id,pid,7200,2880,2880,laps(2880),'Client approval wait avg 2 days. 42% require revision. 2.8 rounds average.')
      await fw(s4.id,pid,'42% client revision rate — 2.8 rounds average',[why('Why 42%?','Client approving without involving all decision-makers — late-stage feedback reverses direction.'),why('Why not all involved?','Brief meeting with marketing manager only — brand director sees work at presentation.'),why('Why brand director excluded?','No protocol requiring final approver at brief stage.'),why('Why no protocol?','Brief process designed by account management without design input.'),why('Why no input?','ROOT CAUSE: No design representative in account management process design. Operations and design siloed.')],'No design input in account management process. Brief process designed in silo.','1. Final decision-maker attends or approves brief before design starts. 2. Brand guidelines reviewed before every project. 3. Revision limit in scope of work.','Creative Director','2026-05-01')
      await wa(s4.id,pid,['Defects','Waiting','Overproduction'],{Defects:'42% revision rate — avg 4 hrs rework per round × 2.8 rounds = 11 hrs per project',Waiting:'Client approval wait 2 days — designer idle between rounds',Overproduction:'3 concepts presented when 1 well-briefed concept would have higher first-pass rate'})
      await kz(s4.id,pid,[kzItem('KZ-001','Final approver at brief stage','Decision-maker signs off brief before concept begins. Target: revision rounds from 2.8 to 1.2.','Quality','critical','in-progress','Creative Director','2026-04-30',['Add final approver step to brief template','Require signature before design starts','Track revision rounds by project','Measure client satisfaction'])])
      await im(s4.id,pid,[goal('Revision Rounds per Project','2.8','1.2','rounds','Creative Director','2026-06-01')])
      
      await wa(s2.id,pid,['Defects', 'Waiting', 'Non-Utilisation'],{'Defects':'2.8 average revision rounds per project — brief ambiguity at intake is the primary cause','Waiting':'Client approval delays avg 7.2 days per round — no structured response window','Non-Utilisation':'Senior designers spending 30% of time on production tasks (file prep, export, resizing) that could be handled by junior staff or automation'})
      await kz(s2.id,pid,[kzItem('KZ-001','Creative brief sign-off before any design work begins','No design resource allocated until signed brief received. Brief must include: objective, audience, format, reference examples, and approval chain.','Quality','critical','in-progress','Creative Director','2026-04-30',['Design brief template', 'Brief all account handlers', 'Enforce on next 10 projects', 'Track revision rounds per project']),kzItem('KZ-002','Production task delegation to junior designer','Audit senior designer activity: identify production tasks (file export, resize, template population) to delegate. Target: free 25% of senior time for concept and creative direction.','Productivity','high','open','Studio Manager','2026-05-01',['Log senior designer tasks for 1 week', 'Identify delegation candidates', 'Brief junior designers', 'Measure senior creative time freed'])])
      seeded.push('Graphic Design')
    }}


    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — General Manufacturing Production Cell'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('General Manufacturing')}else{
    const pid=await proj({name:nm,industry:'general_manufacturing',customer:'Distribution Centre',
      description:'General manufacturing production cell. Machine utilisation 68%. Setup waste dominant bottleneck.'})
    const s0=await stp(pid,0,{name:'Raw Material Receipt',department:'Receiving',operators:1,cycle_time:12,wait_time:480,wip:30,flow_type:'push',uptime:100,defect_rate:2,notes:'2% incoming quality rejection. No supplier scorecards.'})
    const s1=await stp(pid,1,{name:'Machine Setup & Changeover',department:'Production',operators:1,cycle_time:90,wait_time:15,wip:0,flow_type:'push',uptime:85,defect_rate:0,notes:'BOTTLENECK. 90-min setup avg — 45 min is internal that could be external. SMED opportunity.'})
    const s2=await stp(pid,2,{name:'Machining Operation',department:'Production',operators:1,cycle_time:22,wait_time:5,wip:8,flow_type:'push',uptime:85,defect_rate:3,notes:'3% first-pass scrap. Tool wear not monitored. Uptime 85% — unplanned maintenance 8hrs/week.'})
    const s3=await stp(pid,3,{name:'In-Process Inspection',department:'QC',operators:1,cycle_time:8,wait_time:30,wip:4,flow_type:'push',uptime:100,defect_rate:0,notes:'NNVA. 100% inspection because upstream process not capable. Should be reduced to statistical sample.'})
    const s4=await stp(pid,4,{name:'Assembly & Packaging',department:'Assembly',operators:2,cycle_time:18,wait_time:60,wip:12,flow_type:'push',uptime:100,defect_rate:1,notes:'Manual assembly. Line balance poor — one operator waits 30% of cycle.'})
    await td(s1.id,pid,'stopwatch',{baseline:90,target:45,mean:88,laps:[85,92,88,95,84,90,88,91,86,89],notes:'Setup dominated by tooling search (22 min) and first-off inspection (18 min). Both convertible to external.'})
    await td(s1.id,pid,'smed',{currentTotal:90,internalSteps:[{id:'i1',name:'Locate tooling in store',time:22,convertible:true},{id:'i2',name:'Clean machine bed',time:12,convertible:false},{id:'i3',name:'Mount and align fixture',time:18,convertible:false},{id:'i4',name:'First-off inspection',time:18,convertible:true},{id:'i5',name:'Parameter input',time:12,convertible:true},{id:'i6',name:'Trial run',time:8,convertible:false}],externalSteps:[{id:'e1',name:'Prepare next job pack',time:5},{id:'e2',name:'Stage tooling at machine',time:8}]})
    await td(s2.id,pid,'ishikawa',{problem:'3% first-pass scrap — target <0.5%',framework:'6M Manufacturing',causes:{Machine:['Tool wear not monitored — tools run to failure','Coolant concentration not checked weekly'],Method:['No SPC on critical dimensions — operators measure but do not chart'],Material:['Incoming material hardness variation — 2% lots out of spec'],Manpower:['Setup operators not trained on tool condition assessment'],Measurement:['Go/no-go gauges only — no variable data captured'],Mother_Nature:['Temperature variation in cell — dimension drift in afternoon']}})
    await td(s2.id,pid,'waste',{selected:['Defects','Waiting','Overprocessing'],notes:{Defects:'3% scrap × avg part value £12 = £3.6k/month. Rework adds further £800/month.',Waiting:'30-min inspection wait per batch = 4 hrs/day queue time.',Overprocessing:'100% inspection (8 min/part) adds 36% to unit cost. Statistically unnecessary.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Tool life monitoring system',description:'Track tool life by part count. Replace at 80% of failure life. Reduce scrap from tool wear to zero.',category:'Quality',priority:'critical',status:'in-progress',owner:'Production Manager',dueDate:'2026-04-30',actions:['Set tool life limits per tool type','Add part counter to CNC program','Alert at 80% life','Log and review monthly']},{id:'kz2',kzId:'KZ-002',title:'SMED — Stage tooling before shutdown',description:'Stage next job tooling at machine during last 15 min of current run. Target: setup from 90 to 45 min.',category:'Productivity',priority:'high',status:'open',owner:'Setup Lead',dueDate:'2026-05-15',actions:['Map convertible vs non-convertible steps','Design shadow board at machine','Trial on one machine for 2 weeks','Measure before/after']}]})
    seeded.push('General Manufacturing'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Aerospace Component Assembly'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Aerospace')}else{
    const pid=await proj({name:nm,industry:'aerospace_manufacturing',customer:'Aircraft OEM',
      description:'Aerospace structural component assembly. AS9100 certified. First-article inspection bottleneck.'})
    const s0=await stp(pid,0,{name:'Drawing & Work Order Release',department:'Engineering',operators:1,cycle_time:60,wait_time:2880,wip:8,flow_type:'push',uptime:100,defect_rate:5,notes:'5% of work orders released with drawing discrepancies. Causes mid-production stops.'})
    const s1=await stp(pid,1,{name:'Material Kitting',department:'Stores',operators:2,cycle_time:45,wait_time:240,wip:6,flow_type:'push',uptime:100,defect_rate:2,notes:'2% kitting errors — wrong part number or revision. Discovery at assembly causes 4-hr delay.'})
    const s2=await stp(pid,2,{name:'Sub-Assembly Build',department:'Assembly',operators:3,cycle_time:180,wait_time:60,wip:4,flow_type:'push',uptime:95,defect_rate:4,notes:'4% non-conformance rate at sub-assembly. Fastener torque and sealant application most common.'})
    const s3=await stp(pid,3,{name:'First Article Inspection',department:'QC',operators:2,cycle_time:240,wait_time:1440,wip:6,flow_type:'push',uptime:100,defect_rate:0,notes:'BOTTLENECK. 1440-min wait for FAI slot. CMM queue 3 days. Blocks all downstream.'})
    const s4=await stp(pid,4,{name:'Final Assembly & Test',department:'Assembly',operators:4,cycle_time:360,wait_time:120,wip:3,flow_type:'push',uptime:95,defect_rate:2,notes:'2% fail functional test. Root cause tracing back to sub-assembly stage 80% of cases.'})
    await td(s3.id,pid,'stopwatch',{baseline:240,target:120,mean:235,laps:[220,250,240,260,225,240,235,245,228,252],notes:'FAI time itself 240 min but wait for CMM slot 1440 min. Capacity 3 CMMs for 12 product lines.'})
    await td(s3.id,pid,'ishikawa',{problem:'1440-min CMM queue — FAI blocks production 3 days',framework:'6M Manufacturing',causes:{Machine:['3 CMMs for 12 product lines — utilisation 94%','No portable CMM for simpler features'],Method:['All features inspected by CMM — no risk-based approach','FAI not started until full assembly complete'],Material:['Drawing discrepancies discovered at FAI — rework before reinspect'],Manpower:['2 qualified CMM operators — no cross-training','Overtime not approved for queue clearance'],Measurement:['All features to same tolerance class — critical vs non-critical not distinguished'],Mother_Nature:['CMM temperature sensitivity — 4 hr stabilisation after door opening']}})
    await td(s2.id,pid,'waste',{selected:['Defects','Waiting','Overprocessing'],notes:{Defects:'4% NCR rate × avg rework 8 hrs = 2.4 hrs rework per unit. AS9100 corrective action adds 4 hrs admin.',Waiting:'3-day FAI queue blocks assembly. 3 units minimum WIP held waiting.',Overprocessing:'100% CMM on all features. Risk-based approach would reduce CMM load 40%.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Risk-based FAI — critical features only on CMM',description:'Classify all features as critical/non-critical. CMM only critical. Hand gauge non-critical. Target: CMM time from 240 to 120 min, queue from 3 days to 1 day.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Chief Inspector',dueDate:'2026-05-01',actions:['Classify all features per AS9100','Define critical feature list','Update inspection plan','Pilot on 2 part numbers','Measure queue reduction']},{id:'kz2',kzId:'KZ-002',title:'Concurrent FAI — inspect sub-assemblies before final',description:'Begin FAI on sub-assemblies during build. Final FAI only covers final-assembly-specific features. Eliminates 3-day hold at final inspection.',category:'Productivity',priority:'high',status:'open',owner:'QA Manager',dueDate:'2026-05-15',actions:['Redesign inspection plan','Train inspectors','Trial on 1 product line','Measure total FAI calendar time']}]})
    seeded.push('Aerospace'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Insurance Policy Issuance'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Insurance')}else{
    const pid=await proj({name:nm,industry:'insurance',customer:'Policy Applicant',
      description:'Personal lines insurance policy issuance. 8-day average. Target 2 days.'})
    const s0=await stp(pid,0,{name:'Application Receipt & Triage',department:'Operations',operators:2,cycle_time:15,wait_time:480,wip:120,flow_type:'push',uptime:100,defect_rate:18,notes:'18% of applications incomplete — trigger back-and-forth that adds avg 3 days.'})
    const s1=await stp(pid,1,{name:'Underwriting Assessment',department:'Underwriting',operators:3,cycle_time:45,wait_time:2880,wip:85,flow_type:'push',uptime:100,defect_rate:8,notes:'BOTTLENECK. 2880-min wait. Underwriter queue 4 days for standard risks.'})
    const s2=await stp(pid,2,{name:'Quote Generation & Pricing',department:'Pricing',operators:1,cycle_time:20,wait_time:480,wip:40,flow_type:'push',uptime:100,defect_rate:3,notes:'3% pricing errors — mostly manual rate table errors. System integration gap.'})
    const s3=await stp(pid,3,{name:'Policy Document Production',department:'Operations',operators:1,cycle_time:10,wait_time:240,wip:30,flow_type:'push',uptime:100,defect_rate:2,notes:'2% document errors. Schedule of cover wrong 80% of error cases.'})
    const s4=await stp(pid,4,{name:'Issue & Customer Confirmation',department:'Operations',operators:1,cycle_time:8,wait_time:60,wip:15,flow_type:'push',uptime:100,defect_rate:0,notes:'VA. Final step — issue policy and send confirmation. Usually same day as document production.'})
    await td(s1.id,pid,'ishikawa',{problem:'4-day underwriting queue — target same day for standard risks',framework:'8P Service',causes:{People:['3 underwriters for 85 cases in queue','No tiered routing — complex and simple risks same queue'],Process:['No straight-through processing for standard risks','All cases reviewed manually regardless of risk score'],Policy:['Referral thresholds too conservative — 60% of referrals approved unchanged'],Place:['Underwriters in separate building — no real-time handoff'],Products_Services:['Risk scoring model 4 years old — low confidence leads to manual review'],Price:['Cost of delay not measured — no SLA incentive'],Promotion:['Brokers not informed of application completeness requirements'],Physical_evidence:['No case status visibility — applicants chase progress by phone']}})
    await td(s0.id,pid,'waste',{selected:['Waiting','Defects','Transportation'],notes:{Waiting:'4-day underwriting queue × 85 cases = 340 case-days of pure queue. Zero value added.',Defects:'18% incomplete applications × avg 3-day rework = 45 additional days of processing daily.',Transportation:'Physical files moved between 2 buildings. Digital workflow not implemented.'}})
    await td(s1.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Straight-through processing for standard risks',description:'Risks scoring above 70 in automated model bypass underwriter queue. Auto-approve and issue. Target: 40% of volume (34 cases/day) processed same-day without manual review.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Underwriting Manager',dueDate:'2026-04-30',actions:['Define STP eligibility criteria','IT configuration for auto-approval','Pilot 100 cases','Measure approval accuracy vs manual','Extend to full volume']},{id:'kz2',kzId:'KZ-002',title:'Mandatory completeness check at point of submission',description:'Broker portal validates mandatory fields before submission accepted. Eliminates 18% incomplete application rework.',category:'Quality',priority:'high',status:'open',owner:'Operations Manager',dueDate:'2026-05-15',actions:['Map mandatory fields by product','Configure portal validation','Communicate to brokers','Measure incomplete rate monthly']}]})
    seeded.push('Insurance'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — IT Incident Resolution'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('IT Operations')}else{
    const pid=await proj({name:nm,industry:'it_operations',customer:'Internal User',
      description:'IT service desk incident resolution. P2 average 18 hrs. ITIL-aligned.'})
    const s0=await stp(pid,0,{name:'Incident Logging & Triage',department:'Service Desk',operators:2,cycle_time:8,wait_time:30,wip:45,flow_type:'push',uptime:100,defect_rate:22,notes:'22% of incidents mis-categorised — causes wrong team assignment and rework.'})
    const s1=await stp(pid,1,{name:'L1 Diagnosis & Resolution Attempt',department:'Service Desk',operators:4,cycle_time:25,wait_time:240,wip:35,flow_type:'push',uptime:100,defect_rate:35,notes:'35% escalation rate. L1 resolution rate 65% vs 80% target. Knowledge base gaps.'})
    const s2=await stp(pid,2,{name:'L2 Escalation & Investigation',department:'L2 Support',operators:3,cycle_time:90,wait_time:480,wip:20,flow_type:'push',uptime:100,defect_rate:12,notes:'BOTTLENECK. 480-min wait to reach L2. Queue driven by 35% L1 escalation rate.'})
    const s3=await stp(pid,3,{name:'Fix Implementation & Testing',department:'L2 Support',operators:2,cycle_time:60,wait_time:60,wip:8,flow_type:'push',uptime:100,defect_rate:5,notes:'5% require re-fix. Root cause not addressed — symptom fixed only.'})
    const s4=await stp(pid,4,{name:'Resolution Confirmation & Closure',department:'Service Desk',operators:1,cycle_time:5,wait_time:120,wip:15,flow_type:'push',uptime:100,defect_rate:8,notes:'8% re-open rate. Ticket closed without user confirmation in 40% of cases.'})
    await td(s1.id,pid,'fivewhy',{problem:'L1 resolution rate 65% vs 80% target',whys:[{q:'Why L1 resolution rate only 65%?',a:'L1 agents escalate when knowledge base does not have a matching article.'},{q:'Why no matching KB article?',a:'KB not updated when L2 resolves incidents. Fix documented in ticket only.'},{q:'Why KB not updated?',a:'No process requires L2 to create/update KB on resolution. Not in job spec.'},{q:'Why not in job spec?',a:'ITIL implementation 3 years ago omitted KB management from L2 role definition.'},{q:'Why omitted?',a:'ROOT CAUSE: KB management assigned to Knowledge Manager role that was never hired. Responsibility gap.'}],rootCause:'No ownership of KB updates. L2 solves without documenting. KB becomes stale — L1 escalates.',countermeasure:'1. Add KB update to L2 resolution checklist. 2. Assign KB champion per team. 3. Monthly KB completeness review.',owner:'IT Service Manager',dueDate:'2026-04-30'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Non-Utilisation'],notes:{Waiting:'480-min L2 queue × 20 cases = 160 hrs wasted waiting daily across the business.',Defects:'22% mis-categorisation causes avg 90-min reassignment delay per incident. 8% re-open = full rework.',Non_Utilisation:'L1 agents idle during L2 wait periods. Could be resolving lower-priority tickets.'}})
    await td(s1.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'KB update mandatory at L2 resolution',description:'L2 cannot close ticket without selecting KB article updated/created. Target: L1 resolution rate from 65% to 78% in 90 days.',category:'Quality',priority:'critical',status:'in-progress',owner:'L2 Team Lead',dueDate:'2026-04-15',actions:['Add KB link field to closure form','Train L2 on KB authoring','Monthly KB champion review','Track L1 resolution rate weekly']},{id:'kz2',kzId:'KZ-002',title:'AI-suggested KB articles at L1 triage',description:'Surface top 3 KB matches as agent types incident description. Reduces escalation by giving L1 resolution path at first touch.',category:'Productivity',priority:'high',status:'open',owner:'IT Manager',dueDate:'2026-05-01',actions:['Evaluate ITSM AI assist plugins','Pilot with 2 L1 agents','Measure escalation rate before/after','Full rollout if >5% improvement']}]})
    seeded.push('IT Operations'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Retail Pharmacy Dispensing'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Pharmacy')}else{
    const pid=await proj({name:nm,industry:'pharmacy',customer:'Patient',
      description:'Retail pharmacy prescription dispensing. Avg 22-min wait. Target 10 min.'})
    const s0=await stp(pid,0,{name:'Prescription Receipt & Data Entry',department:'Pharmacy',operators:1,cycle_time:4,wait_time:8,wip:25,flow_type:'push',uptime:100,defect_rate:6,notes:'6% data entry errors — wrong DOB, strength, or quantity. Triggers DUR alert and rework.'})
    const s1=await stp(pid,1,{name:'Drug Utilisation Review (DUR)',department:'Pharmacist',operators:1,cycle_time:3,wait_time:480,wip:18,flow_type:'push',uptime:100,defect_rate:8,notes:'BOTTLENECK. 8% DUR alerts require pharmacist intervention avg 8 min each. Queue backs up.'})
    const s2=await stp(pid,2,{name:'Product Retrieval & Counting',department:'Technician',operators:2,cycle_time:6,wait_time:5,wip:12,flow_type:'push',uptime:100,defect_rate:2,notes:'2% wrong product selection. High-alert medications adjacent on shelf.'})
    const s3=await stp(pid,3,{name:'Pharmacist Verification',department:'Pharmacist',operators:1,cycle_time:5,wait_time:240,wip:10,flow_type:'push',uptime:100,defect_rate:0,notes:'240-min wait during peak — pharmacist handling DUR alerts and verification simultaneously.'})
    const s4=await stp(pid,4,{name:'Patient Counselling & Handoff',department:'Pharmacist',operators:1,cycle_time:4,wait_time:0,wip:0,flow_type:'push',uptime:100,defect_rate:0,notes:'VA. Counselling quality varies — 40% of patients report receiving no counselling.'})
    await td(s1.id,pid,'ishikawa',{problem:'22-min average wait — target 10 min',framework:'8P Service',causes:{People:['Single pharmacist handles DUR + verification + counselling — cannot parallel process','Technicians not trained to pre-sort DUR-flagged prescriptions'],Process:['No batching of routine vs complex prescriptions','DUR alert resolution not time-boxed — can take 20 min on complex cases'],Policy:['Pharmacist must personally verify every prescription — no tech-check in this state'],Place:['Will-call bin unsorted — patients queue regardless of readiness'],Products_Services:['Generic substitution prompts fire during data entry — disrupt workflow'],Price:['Low margin on generics — staffing constrained'],Promotion:['No SMS notification when ready — patients arrive before prescription complete'],Physical_evidence:['Paper prescriptions — manual transcription vs e-prescribe']}})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Motion'],notes:{Waiting:'22-min avg wait × 180 Rx/day = 66 hrs of patient waiting daily. DUR queue is primary cause.',Defects:'2% wrong product × 180 Rx = 3.6 errors/day. Each error = recount + re-verify + potential incident report.',Motion:'Pharmacist walks between DUR workstation and verification counter avg 8 times/hr.'}})
    await td(s1.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'SMS notification — prescriptions ready',description:'Auto-SMS when prescription verified and ready. Patients do not arrive before ready. Eliminates will-call queue pressure and perception of long wait.',category:'Quality',priority:'critical',status:'in-progress',owner:'Pharmacy Manager',dueDate:'2026-04-15',actions:['Configure SMS in pharmacy system','Patient opt-in at drop-off','Pilot 2 weeks','Survey patient wait perception']},{id:'kz2',kzId:'KZ-002',title:'Segregate DUR-flagged from routine at data entry',description:'Flag DUR-likely prescriptions (polypharmacy, high-alert drugs) at data entry. Route to dedicated DUR workflow. Routine Rx flow uninterrupted. Target: reduce routine wait from 22 to 10 min.',category:'Productivity',priority:'high',status:'open',owner:'Lead Pharmacist',dueDate:'2026-05-01',actions:['Define DUR-risk criteria','Update workflow routing','Train technicians','Measure routine vs complex cycle time split']}]})
    seeded.push('Pharmacy'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Freight & Trucking Load Delivery'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Freight & Trucking')}else{
    const pid=await proj({name:nm,industry:'freight_trucking',customer:'Shipper',
      description:'Full truckload delivery cycle. On-time delivery 81% vs 95% target.'})
    const s0=await stp(pid,0,{name:'Load Planning & Dispatch Assignment',department:'Operations',operators:2,cycle_time:25,wait_time:120,wip:18,flow_type:'push',uptime:100,defect_rate:12,notes:'12% of loads reassigned within 2 hrs of dispatch — driver availability mismatch.'})
    const s1=await stp(pid,1,{name:'Driver Pre-Trip & Vehicle Check',department:'Operations',operators:1,cycle_time:30,wait_time:15,wip:5,flow_type:'push',uptime:100,defect_rate:5,notes:'5% pre-trip defects delay departure avg 45 min. Tyre and lighting most common.'})
    const s2=await stp(pid,2,{name:'Shipper Loading & Documentation',department:'Driver',operators:1,cycle_time:90,wait_time:180,wip:3,flow_type:'push',uptime:100,defect_rate:8,notes:'BOTTLENECK. 180-min shipper dock wait avg. 8% BoL discrepancies cause re-documentation.'})
    const s3=await stp(pid,3,{name:'Transit (Line Haul)',department:'Driver',operators:1,cycle_time:480,wait_time:30,wip:1,flow_type:'push',uptime:100,defect_rate:3,notes:'3% incidents during transit — breakdown, traffic, HOS violation. HOS is primary constraint.'})
    const s4=await stp(pid,4,{name:'Consignee Delivery & POD',department:'Driver',operators:1,cycle_time:60,wait_time:120,wip:2,flow_type:'push',uptime:100,defect_rate:4,notes:'120-min consignee dock wait. 4% POD discrepancies — short shipment or damage claims.'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Transportation'],notes:{Waiting:'180-min shipper dock wait × 18 loads/day = 54 driver-hours wasted daily at origin. Driver HOS consumed.',Defects:'8% BoL errors cause avg 30-min rework at shipper. 4% POD discrepancies trigger claims processing.',Transportation:'Empty miles avg 22% of total miles — load planning not optimising return loads.'}})
    await td(s2.id,pid,'ishikawa',{problem:'On-time delivery 81% vs 95% target',framework:'6M Manufacturing',causes:{Machine:['Fleet avg age 6.2 years — breakdown rate 3.1/100 trips','No predictive maintenance — reactive only'],Method:['No dock appointment system — drivers queue on arrival','Load planning manual — no algorithm for HOS-aware routing'],Material:['Shipper freight often not ready at appointment time','Incorrect freight dimensions cause trailer replanning'],Manpower:['Driver turnover 68%/year — inexperienced drivers slower at loading/unloading','HOS compliance training gaps — 3 violations last quarter'],Measurement:['On-time measured at delivery only — shipper dwell not tracked separately'],Mother_Nature:['Winter weather adds avg 90 min on 35% of routes Nov-Mar']}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Dock appointment system at top 10 shippers',description:'Negotiate dock appointment windows with top 10 shippers (62% of volume). Eliminate FCFS queue. Target: shipper dwell from 180 to 45 min.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Operations Manager',dueDate:'2026-04-30',actions:['Identify top 10 shippers by volume','Present dwell cost data to each','Negotiate appointment windows','Configure in TMS','Measure dwell weekly']},{id:'kz2',kzId:'KZ-002',title:'Automated BoL via EDI with key shippers',description:'EDI 204/211 integration with top 5 shippers eliminates manual BoL. 8% discrepancy rate eliminated at source.',category:'Quality',priority:'high',status:'open',owner:'IT Manager',dueDate:'2026-05-15',actions:['Map EDI capability by shipper','Prioritise top 5 by volume','IT integration project','Test with 50 loads','Full rollout']}]})
    seeded.push('Freight & Trucking'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — University Student Journey'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Higher Education')}else{
    const pid=await proj({name:nm,industry:'higher_education',customer:'Student',
      description:'University student experience from enrolment to graduation. Dropout rate 18%.'})
    const s0=await stp(pid,0,{name:'Admissions & Enrolment',department:'Registry',operators:4,cycle_time:30,wait_time:14400,wip:850,flow_type:'push',uptime:100,defect_rate:12,notes:'12% of offers accepted but student does not enrol — information gap at offer stage.'})
    const s1=await stp(pid,1,{name:'Induction & Orientation',department:'Student Services',operators:8,cycle_time:480,wait_time:2880,wip:400,flow_type:'push',uptime:100,defect_rate:22,notes:'22% of students report feeling unprepared after induction — content not differentiated by background.'})
    const s2=await stp(pid,2,{name:'Teaching & Assessment',department:'Academic',operators:50,cycle_time:14400,wait_time:4320,wip:1200,flow_type:'push',uptime:100,defect_rate:18,notes:'18% dropout by end of Year 1. Assessment feedback avg 32 days vs 15-day target.'})
    const s3=await stp(pid,3,{name:'Academic Support & Intervention',department:'Student Services',operators:12,cycle_time:60,wait_time:10080,wip:180,flow_type:'push',uptime:100,defect_rate:0,notes:'BOTTLENECK. 7-day wait for academic support appointment. At-risk students disengage before appointment.'})
    const s4=await stp(pid,4,{name:'Graduation & Alumni Transition',department:'Registry',operators:6,cycle_time:120,wait_time:4320,wip:320,flow_type:'push',uptime:100,defect_rate:5,notes:'5% graduation ceremony issues — wrong name, missing certificate. Manual data process.'})
    await td(s3.id,pid,'fivewhy',{problem:'18% dropout rate by end of Year 1',whys:[{q:'Why 18% dropout by Year 1 end?',a:'Students disengage academically after failing first assessment or feeling unsupported.'},{q:'Why feeling unsupported?',a:'Academic support appointment wait is 7 days — student disengages before they are seen.'},{q:'Why 7-day wait?',a:'12 advisors for 1,200 at-risk students. Demand exceeds capacity.'},{q:'Why capacity insufficient?',a:'At-risk identification reactive — based on failed assessment, not early warning signals.'},{q:'Why no early warning?',a:'ROOT CAUSE: No attendance and engagement tracking system. Risk not visible until assessment failure.'}],rootCause:'No early warning system. At-risk students identified only after failure. Support too late.',countermeasure:'1. Implement attendance tracking. 2. Weekly at-risk report to advisors. 3. Proactive outreach at 2-week disengagement.',owner:'Head of Student Services',dueDate:'2026-05-01'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Non-Utilisation'],notes:{Waiting:'7-day support wait for at-risk students — dropout decision made in that window.',Defects:'18% dropout = 18% of tuition revenue lost. Avg £9,250/year × 18% = £1.7k lost revenue per dropout per year.',Non_Utilisation:'Academic advisors reactive — 40% of appointment time is crisis management that early intervention would prevent.'}})
    await td(s3.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Attendance tracking early warning system',description:'Flag students with <80% attendance in any week to personal tutor automatically. Proactive contact within 48 hrs. Target: reduce Year 1 dropout from 18% to 12%.',category:'Quality',priority:'critical',status:'in-progress',owner:'Head of Student Services',dueDate:'2026-04-30',actions:['Procure attendance tracking system','Define at-risk thresholds','Train personal tutors on early contact protocol','Measure contact rate and dropout correlation']},{id:'kz2',kzId:'KZ-002',title:'Same-week academic support slots reserved for at-risk',description:'Reserve 20% of advisor slots for same-week at-risk referrals. Eliminate 7-day wait for students flagged by tutors.',category:'Productivity',priority:'high',status:'open',owner:'Student Services Manager',dueDate:'2026-05-01',actions:['Audit current appointment utilisation','Reserve 20% of slots','Configure booking system','Measure wait time for at-risk referrals']}]})
    seeded.push('Higher Education'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — HR Recruitment & Onboarding'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Human Resources')}else{
    const pid=await proj({name:nm,industry:'human_resources',customer:'Hiring Manager',
      description:'End-to-end recruitment and onboarding. Time-to-productivity 67 days vs 30-day target.'})
    const s0=await stp(pid,0,{name:'Job Brief & Approval',department:'HR',operators:1,cycle_time:30,wait_time:4320,wip:8,flow_type:'push',uptime:100,defect_rate:35,notes:'35% of job briefs revised after approval — role scope unclear at outset. Restarts sourcing.'})
    const s1=await stp(pid,1,{name:'Sourcing & Screening',department:'Talent Acquisition',operators:3,cycle_time:120,wait_time:5760,wip:45,flow_type:'push',uptime:100,defect_rate:0,notes:'4-day candidate sourcing. 180 applications per role avg. Screening 120 min/role to shortlist 8.'})
    const s2=await stp(pid,2,{name:'Interview Process',department:'Hiring Manager',operators:2,cycle_time:90,wait_time:7200,wip:12,flow_time:'push',uptime:100,defect_rate:20,notes:'BOTTLENECK. 5-day scheduling delay per interview round. 3 rounds avg = 15 days in scheduling alone.'})
    const s3=await stp(pid,3,{name:'Offer & Reference Checks',department:'HR',operators:1,cycle_time:45,wait_time:2880,wip:3,flow_type:'push',uptime:100,defect_rate:8,notes:'2-day references. 8% offers declined — competitor counteroffer. Speed to offer is competitive.'})
    const s4=await stp(pid,4,{name:'Onboarding & Induction',department:'HR + Manager',operators:3,cycle_time:480,wait_time:0,wip:2,flow_type:'push',uptime:100,defect_rate:28,notes:'28% of new hires rate onboarding poor. 67 days to full productivity vs 30-day target.'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Overprocessing'],notes:{Waiting:'5-day scheduling per round × 3 rounds = 15 days. Candidate pipeline drops 40% after 10 days of silence.',Defects:'35% brief revision restarts sourcing. 20% declined offers. Each = full restart cost.',Overprocessing:'180 applications screened for 8 shortlisted. 94.5% of screening effort produces no output.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Self-schedule interview booking for candidates',description:'Candidates book own interview slot via Calendly-style link. Eliminates 5-day scheduling lag. Target: time-to-interview from 5 days to 1 day.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Talent Acquisition Lead',dueDate:'2026-04-15',actions:['Set up scheduling tool','Add link to interview invitation','Pilot with next 5 roles','Measure scheduling time before/after']},{id:'kz2',kzId:'KZ-002',title:'Role brief workshop — 1hr with hiring manager before posting',description:'Structured 1-hr brief with hiring manager using standard template. Reduces revision rate from 35% to target <10%.',category:'Quality',priority:'high',status:'open',owner:'HRBP',dueDate:'2026-05-01',actions:['Design brief template','Train HRBPs on facilitation','Mandate for all roles','Track revision rate monthly']}]})
    seeded.push('Human Resources'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Corporate L&D Programme Delivery'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Corporate Training')}else{
    const pid=await proj({name:nm,industry:'corporate_training',customer:'Learner / Business Unit',
      description:'Corporate L&D programme design and delivery. Completion rate 54% vs 85% target.'})
    const s0=await stp(pid,0,{name:'Training Needs Analysis',department:'L&D',operators:2,cycle_time:480,wait_time:10080,wip:6,flow_type:'push',uptime:100,defect_rate:40,notes:'40% of programmes developed without confirmed TNA — based on manager request only.'})
    const s1=await stp(pid,1,{name:'Programme Design & Content Creation',department:'L&D',operators:3,cycle_time:2400,wait_time:5760,wip:4,flow_type:'push',uptime:100,defect_rate:25,notes:'25% of content requires significant revision after SME review. Brief misalignment.'})
    const s2=await stp(pid,2,{name:'Scheduling & Delegate Enrolment',department:'L&D Operations',operators:1,cycle_time:60,wait_time:14400,wip:12,flow_type:'push',uptime:100,defect_rate:30,notes:'BOTTLENECK. 10-day lead time for scheduling. 30% enrolment drop-out before programme starts.'})
    const s3=await stp(pid,3,{name:'Programme Delivery',department:'Facilitator',operators:1,cycle_time:480,wait_time:0,wip:25,flow_type:'push',uptime:95,defect_rate:15,notes:'15% no-show rate on day. Completion rate 54% for e-learning (self-paced). 88% for instructor-led.'})
    const s4=await stp(pid,4,{name:'Assessment & Evaluation',department:'L&D',operators:1,cycle_time:60,wait_time:0,wip:0,flow_type:'push',uptime:100,defect_rate:0,notes:'Kirkpatrick Level 1 only (satisfaction). No Level 3 (behaviour change) or Level 4 (business impact) measured.'})
    await td(s3.id,pid,'waste',{selected:['Defects','Waiting','Non-Utilisation'],notes:{Defects:'54% e-learning completion = 46% of design cost wasted on uncompleted content. 30% pre-programme dropout.',Waiting:'10-day scheduling delay increases dropout probability by 60%.',Non_Utilisation:'L&D team spends 40% of time on administration and scheduling — not design.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Automated scheduling and reminders',description:'LMS auto-schedules based on delegate availability. 3 automated reminders before start. Target: pre-programme dropout from 30% to 12%.',category:'Productivity',priority:'critical',status:'in-progress',owner:'L&D Manager',dueDate:'2026-04-30',actions:['Configure LMS scheduling automation','Set reminder sequence','Pilot next cohort','Measure dropout rate before/after']},{id:'kz2',kzId:'KZ-002',title:'Mandatory TNA for all new programme requests',description:'No programme enters design without completed TNA template signed off by sponsor. Reduces revision rate from 25% to target <10%.',category:'Quality',priority:'high',status:'open',owner:'Head of L&D',dueDate:'2026-05-01',actions:['Design TNA template','Brief all business stakeholders','Configure as mandatory in LMS request form','Track revision rate quarterly']}]})
    seeded.push('Corporate Training'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Power Generation Operations'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Power Generation')}else{
    const pid=await proj({name:nm,industry:'power_generation_utilities',customer:'Grid Operator',
      description:'Combined cycle gas turbine plant. Availability 89% vs 94% target. Forced outage 3.2%.'})
    const s0=await stp(pid,0,{name:'Fuel Receipt & Quality Verification',department:'Fuel Management',operators:2,cycle_time:45,wait_time:60,wip:0,flow_type:'push',uptime:100,defect_rate:2,notes:'2% of gas deliveries outside specification. Calorific value variation affects output calculations.'})
    const s1=await stp(pid,1,{name:'Unit Startup & Synchronisation',department:'Operations',operators:4,cycle_time:90,wait_time:30,wip:0,flow_type:'push',uptime:95,defect_rate:4,notes:'4% of startups abort — instrumentation faults and IGV control issues most common.'})
    const s2=await stp(pid,2,{name:'Generation & Load Following',department:'Operations',operators:6,cycle_time:28800,wait_time:0,wip:0,flow_type:'push',uptime:89,defect_rate:0,notes:'BOTTLENECK. Availability 89% vs 94% target. Forced outages averaging 48 hrs each, 6 per year.'})
    const s3=await stp(pid,3,{name:'Planned Maintenance Execution',department:'Maintenance',operators:12,cycle_time:10080,wait_time:2880,wip:0,flow_type:'push',uptime:100,defect_rate:8,notes:'8% of planned maintenance tasks overrun — parts availability and scope growth. Avg 2.5 days overrun.'})
    const s4=await stp(pid,4,{name:'Outage Return & Performance Testing',department:'Operations',operators:4,cycle_time:240,wait_time:60,wip:0,flow_type:'push',uptime:100,defect_rate:6,notes:'6% fail first-fire test after outage — workmanship issues during maintenance.'})
    await td(s2.id,pid,'ishikawa',{problem:'Availability 89% vs 94% target — 3.2% forced outage rate',framework:'6M Manufacturing',causes:{Machine:['HP turbine blade erosion rate higher than design — fuel quality related','Inlet air filter change interval too long — pressure drop increases heat rate'],Method:['Vibration monitoring monthly only — not continuous','No oil analysis programme — bearing condition unknown between planned outages'],Material:['Fuel calorific value variation ±3% — affects combustion stability','Replacement parts lead time 16 weeks — forced outage extended by parts wait'],Manpower:['2 of 6 experienced operators retiring this year — knowledge transfer incomplete','Night shift has 1 fewer operator — slower fault response'],Measurement:['Performance degradation not trended between outages — heat rate drift not acted upon'],Mother_Nature:['Ambient temperature peaks above 38°C — output de-rate 8% in summer']}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Continuous vibration monitoring on GT train',description:'Install online vibration monitoring. Alarm thresholds for bearing wear. Planned intervention before forced outage. Target: forced outage from 6 to 3 per year.',category:'Quality',priority:'critical',status:'in-progress',owner:'Plant Manager',dueDate:'2026-05-01',actions:['Procure online monitoring system','Install on GT and ST','Set alarm thresholds','Train operators on alert response','Review after 3 months']},{id:'kz2',kzId:'KZ-002',title:'Critical spares pre-positioned for top 5 failure modes',description:'Stock 1 set of critical spares for top 5 forced outage causes. Eliminates 16-week wait. Reduces forced outage duration from avg 48 to 24 hrs.',category:'Productivity',priority:'high',status:'open',owner:'Maintenance Manager',dueDate:'2026-05-15',actions:['Identify top 5 outage causes by frequency','Cost spare stockholding vs outage cost','Procure critical spares','Define reorder protocol','Annual review of stocking list']}]})
    
      await wa(s2.id,pid,['Waiting','Defects','Non-Utilisation'],{Waiting:'Scheduled maintenance sits in planning queue avg 11 days — poor prioritisation',Defects:'8.2% maintenance callback within 14 days — repair not meeting standard first time',Non_Utilisation:'Turbine running at 84% MCR — de-rating from fouled compressor blades cleaned only at annual outage'})
      seeded.push('Power Generation'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Nonprofit Programme Delivery'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Nonprofit')}else{
    const pid=await proj({name:nm,industry:'nonprofit',customer:'Beneficiary',
      description:'Nonprofit employment support programme. 52% beneficiaries reach employment within 6 months vs 70% target.'})
    const s0=await stp(pid,0,{name:'Referral Intake & Eligibility',department:'Operations',operators:2,cycle_time:45,wait_time:7200,wip:35,flow_type:'push',uptime:100,defect_rate:25,notes:'25% of referrals ineligible — referrers not briefed on eligibility criteria. Wastes case worker time.'})
    const s1=await stp(pid,1,{name:'Needs Assessment',department:'Case Workers',operators:4,cycle_time:90,wait_time:5040,wip:28,flow_type:'push',uptime:100,defect_rate:0,notes:'3.5-day wait for needs assessment. Motivation drops — 15% disengage before assessment.'})
    const s2=await stp(pid,2,{name:'Programme Matching & Enrolment',department:'Case Workers',operators:4,cycle_time:30,wait_time:2880,wip:22,flow_type:'push',uptime:100,defect_rate:18,notes:'18% matched to wrong programme — reassessed within 4 weeks. Case worker judgement inconsistent.'})
    const s3=await stp(pid,3,{name:'Active Support & Coaching',department:'Case Workers + Partners',operators:8,cycle_time:60,wait_time:0,wip:85,flow_type:'push',uptime:100,defect_rate:0,notes:'Main programme phase. 52% reach employment vs 70% target. 48% exit without employment.'})
    const s4=await stp(pid,4,{name:'Employment Placement & Follow-up',department:'Employment Team',operators:3,cycle_time:120,wait_time:0,wip:12,flow_type:'push',uptime:100,defect_rate:15,notes:'15% lose employment within 90 days — in-work support insufficient.'})
    await td(s1.id,pid,'fivewhy',{problem:'52% employment rate vs 70% target',whys:[{q:'Why only 52% reach employment?',a:'Beneficiaries disengage from programme before completing — motivation loss.'},{q:'Why motivation loss?',a:'3.5-day wait for needs assessment. 15% disengage before first appointment.'},{q:'Why 3.5-day wait?',a:'4 case workers for 28 in assessment queue. Capacity insufficient during referral peaks.'},{q:'Why capacity insufficient?',a:'Referrals arrive in batches — grant funded projects close at same time each year.'},{q:'Why no surge capacity?',a:'ROOT CAUSE: No flexible staffing model. All staff on fixed contracts. Cannot scale to referral peaks.'}],rootCause:'Fixed staffing model cannot absorb referral peaks. Assessment wait causes early disengagement.',countermeasure:'1. Triage — phone needs assessment within 24 hrs. 2. Casual/sessional assessment staff for peaks. 3. Automated engagement touchpoints during wait.',owner:'Programme Director',dueDate:'2026-05-01'})
    await td(s1.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'24-hr phone triage replaces 3.5-day wait',description:'Case worker calls within 24 hrs for 20-min phone triage. Full needs assessment within 5 days. Prevents disengagement during wait. Target: pre-assessment dropout from 15% to 5%.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Operations Manager',dueDate:'2026-04-30',actions:['Design phone triage protocol','Train case workers','Reconfigure appointment system','Measure dropout rate weekly']},{id:'kz2',kzId:'KZ-002',title:'Standardised matching tool for programme selection',description:'Decision support tool based on needs assessment data matches to programme. Reduces case worker inconsistency. Target: reassignment rate from 18% to <8%.',category:'Quality',priority:'high',status:'open',owner:'Programme Manager',dueDate:'2026-05-15',actions:['Map matching criteria for each programme','Build decision tree','Pilot with 2 case workers','Measure reassignment rate before/after']}]})
    
      await wa(s1.id,pid,['Waiting','Defects','Non-Utilisation'],{Waiting:'3.5-day wait for assessment — 15% of beneficiaries disengage before being seen',Defects:'18% matched to wrong programme requiring reassessment within 4 weeks',Non_Utilisation:'Case workers spending 48% of time on admin reporting — direct service time constrained'})
      seeded.push('Nonprofit'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // FITNESS CLUBS — Member Journey
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Fitness Club Member Journey'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Fitness Clubs')}else{
    const pid=await proj({name:nm,industry:'fitness_clubs',customer:'Member',
      description:'Fitness club member lifecycle. Monthly churn 4.2% vs 2% target. NPS 28.'})
    const s0=await stp(pid,0,{name:'Lead Enquiry & Tour',department:'Sales',operators:2,cycle_time:30,wait_time:60,wip:15,flow_type:'push',uptime:100,defect_rate:0,notes:'Tour-to-join conversion 28% vs 40% target. Price objection handled inconsistently by staff.'})
    const s1=await stp(pid,1,{name:'Membership Setup & Welcome',department:'Membership',operators:1,cycle_time:20,wait_time:15,wip:8,flow_type:'push',uptime:100,defect_rate:8,notes:'8% setup errors — wrong payment details or membership type. Causes first-month billing disputes.'})
    const s2=await stp(pid,2,{name:'Gym Induction & Goal Setting',department:'Personal Training',operators:2,cycle_time:60,wait_time:2880,wip:12,flow_type:'push',uptime:100,defect_rate:45,notes:'BOTTLENECK. 45% of new members never complete induction. 2-day wait for PT slot.'})
    const s3=await stp(pid,3,{name:'Active Membership (Ongoing Use)',department:'Operations',operators:8,cycle_time:60,wait_time:0,wip:850,flow_type:'push',uptime:100,defect_rate:0,notes:'Members using <2x/week have 6x higher churn probability. Visit frequency not tracked per member.'})
    const s4=await stp(pid,4,{name:'Retention Intervention & Renewal',department:'Membership',operators:2,cycle_time:15,wait_time:0,wip:35,flow_type:'push',uptime:100,defect_rate:0,notes:'Retention contact reactive — only when cancellation received. 4.2% monthly churn = 50% annual turnover.'})
    await td(s2.id,pid,'waste',{selected:['Defects','Non-Utilisation','Waiting'],notes:{Defects:'45% induction non-completion. Members without induction have 3x higher 90-day churn vs completed.',Non_Utilisation:'PT staff capacity underutilised in off-peak hours but overloaded at 5-7pm.',Waiting:'2-day induction wait — new member excitement peak is days 1-3. Delay kills momentum.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Induction on join day — 15-min floor walkthrough',description:'Staff member walks every new member through equipment on signup day — no PT required. Full induction in first week. Target: induction completion from 55% to 90%.',category:'Quality',priority:'critical',status:'in-progress',owner:'Club Manager',dueDate:'2026-04-15',actions:['Design 15-min induction script','Train all floor staff','Add to joining process checklist','Measure completion rate weekly']},{id:'kz2',kzId:'KZ-002',title:'Visit frequency alert — proactive contact at 10-day no-show',description:'System flags members with no visit in 10 days. Staff calls within 24 hrs. Personal check-in. Target: monthly churn from 4.2% to 2.5%.',category:'Productivity',priority:'high',status:'open',owner:'Membership Manager',dueDate:'2026-05-01',actions:['Configure visit tracking alert','Design call script','Train membership team','Measure churn rate monthly by contact vs no-contact group']}]})
    seeded.push('Fitness Clubs'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Live Events Production'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Live Events')}else{
    const pid=await proj({name:nm,industry:'live_events',customer:'Event Client',
      description:'Live corporate events production. On-time delivery 78%. Post-event rework 35%.'})
    const s0=await stp(pid,0,{name:'Client Brief & Concept Development',department:'Account',operators:2,cycle_time:120,wait_time:2880,wip:4,flow_type:'push',uptime:100,defect_rate:42,notes:'42% of concepts require major revision. Brief not detailed enough — interpretations vary.'})
    const s1=await stp(pid,1,{name:'Supplier Sourcing & Booking',department:'Production',operators:2,cycle_time:180,wait_time:2880,wip:6,flow_type:'push',uptime:100,defect_rate:12,notes:'12% of supplier bookings revised — venue or AV spec changes after concept revision.'})
    const s2=await stp(pid,2,{name:'Pre-Production & Logistics',department:'Production',operators:3,cycle_time:480,wait_time:1440,wip:3,flow_type:'push',uptime:100,defect_rate:20,notes:'20% of pre-production items incomplete on event day — running orders, signage, credential lists.'})
    const s3=await stp(pid,3,{name:'On-Site Build & Technical Rehearsal',department:'Technical',operators:8,cycle_time:480,wait_time:0,wip:1,flow_type:'push',uptime:100,defect_rate:15,notes:'BOTTLENECK. 15% of technical rehearsals overrun into live event time. AV integration issues.'})
    const s4=await stp(pid,4,{name:'Live Event Delivery',department:'All',operators:12,cycle_time:480,wait_time:0,wip:1,flow_type:'push',uptime:100,defect_rate:8,notes:'8% of events have a significant live issue. Audience-visible technical failures most damaging.'})
    await td(s0.id,pid,'waste',{selected:['Defects','Overprocessing','Waiting'],notes:{Defects:'42% concept revision = full creative rework. Each revision costs avg 4 hrs senior time.',Overprocessing:'Running orders revised avg 3.2 times — each version distributed to full team.',Waiting:'2880-min client feedback wait causes schedule compression for suppliers.'}})
    await td(s3.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Structured brief template — 30 mandatory fields',description:'Client brief template with 30 mandatory fields. No concept presented until complete. Target: concept revision from 42% to 15%.',category:'Quality',priority:'critical',status:'in-progress',owner:'Account Director',dueDate:'2026-04-30',actions:['Design template with client-facing language','Pilot with 3 clients','Measure revision rate','Refine and roll out to all accounts']},{id:'kz2',kzId:'KZ-002',title:'Technical integration test 48 hrs before event',description:'Full AV walkthrough 48 hrs before live. All integration points tested. Snag list resolved day before. Target: rehearsal overrun from 15% to 3%.',category:'Productivity',priority:'high',status:'open',owner:'Technical Director',dueDate:'2026-05-01',actions:['Add pre-event test to all production schedules','Technical checklist for integration points','Log and resolve snags before event day','Measure rehearsal overrun rate']}]})
    seeded.push('Live Events'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Professional Sports Performance'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Professional Sports')}else{
    const pid=await proj({name:nm,industry:'professional_sports',customer:'Club / Athlete',
      description:'Elite sports performance programme. Injury rate 28 per 1000 training hours vs target 15.'})
    const s0=await stp(pid,0,{name:'Pre-Season Assessment & Load Planning',department:'Sports Science',operators:3,cycle_time:240,wait_time:0,wip:25,flow_type:'push',uptime:100,defect_rate:20,notes:'20% of players start pre-season without completed baseline assessments — data gap.'})
    const s1=await stp(pid,1,{name:'Training Session Delivery',department:'Coaching',operators:6,cycle_time:120,wait_time:1440,wip:25,flow_type:'push',uptime:100,defect_rate:0,notes:'Session RPE monitored but not systematically actioned. Acute:chronic workload ratio tracked manually.'})
    const s2=await stp(pid,2,{name:'Recovery & Load Management',department:'Sports Medicine',operators:4,cycle_time:60,wait_time:0,wip:25,flow_type:'push',uptime:100,defect_rate:12,notes:'12% of recovery protocols not completed — player non-compliance. Ice bath compliance 62%.'})
    const s3=await stp(pid,3,{name:'Injury Assessment & Treatment',department:'Physio',operators:3,cycle_time:45,wait_time:120,wip:6,flow_type:'push',uptime:100,defect_rate:0,notes:'BOTTLENECK when injury cluster occurs. 3 physios for squad of 25 in heavy fixture periods.'})
    const s4=await stp(pid,4,{name:'Return to Training Protocol',department:'Sports Medicine',operators:3,cycle_time:480,wait_time:0,wip:4,flow_type:'push',uptime:100,defect_rate:18,notes:'18% re-injury rate within 6 weeks of return. RTT protocol not consistently followed.'})
    await td(s3.id,pid,'waste',{selected:['Defects','Waiting','Non-Utilisation'],notes:{Defects:'28 injuries per 1000 hrs vs target 15. Each injury = avg 3 weeks unavailability. Squad depth depleted.',Waiting:'120-min physio wait when 3+ players injured simultaneously. Severity assessment delayed.',Non_Utilisation:'Sports science data collected but not systematically used for individual load management.'}})
    await td(s3.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Individual acute:chronic workload ratio dashboard',description:'Real-time dashboard per player. Automated alert when ratio exceeds 1.3. Proactive load reduction before injury threshold. Target: injury rate from 28 to 18 per 1000 hrs.',category:'Quality',priority:'critical',status:'in-progress',owner:'Head of Sports Science',dueDate:'2026-04-30',actions:['Configure GPS data pipeline to dashboard','Set individual alert thresholds','Brief coaching staff on protocol','Review weekly with coaching team','Track injury rate monthly']},{id:'kz2',kzId:'KZ-002',title:'RTT sign-off protocol — consultant approval required',description:'Return to full training requires sign-off from physio AND consultant. Dual-gate prevents premature return. Target: re-injury from 18% to 8%.',category:'Quality',priority:'high',status:'open',owner:'Head Physio',dueDate:'2026-05-01',actions:['Design RTT sign-off form','Agree with coaching staff and medical team','Implement for all returning players','Track re-injury rate by RTT protocol adherence']}]})
    seeded.push('Professional Sports'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // SPORTS VENUE — Management
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Sports Venue Management'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Sports Venue')}else{
    const pid=await proj({name:nm,industry:'sports_venue',customer:'Fan / Event Organiser',
      description:'40,000-seat sports venue. Fan satisfaction 6.8/10 vs 8.0 target. Queue times primary issue.'})
    const s0=await stp(pid,0,{name:'Fan Arrival & Car Park Management',department:'Operations',operators:20,cycle_time:15,wait_time:0,wip:8000,flow_type:'push',uptime:100,defect_rate:0,notes:'Unmanaged arrival profile — 60% of fans arrive in 30-min window before kickoff. Queue 45 min avg.'})
    const s1=await stp(pid,1,{name:'Turnstile Entry & Ticket Scanning',department:'Security',operators:40,cycle_time:2,wait_time:25,wip:3000,flow_type:'push',uptime:95,defect_rate:3,notes:'3% scan errors — mobile tickets low battery or screenshot issues. Each error holds queue 90s.'})
    const s2=await stp(pid,2,{name:'Concession & F&B Service',department:'Catering',operators:60,cycle_time:4,wait_time:12,wip:500,flow_type:'push',uptime:100,defect_rate:0,notes:'BOTTLENECK. 12-min avg queue at peak (half-time). 22% of fans skip purchase due to queue length.'})
    const s3=await stp(pid,3,{name:'In-Seat Fan Experience',department:'Operations',operators:15,cycle_time:90,wait_time:0,wip:38000,flow_type:'push',uptime:100,defect_rate:5,notes:'5% of seats report issues — sightline, audio, or cleanliness. Resolution time avg 18 min.'})
    const s4=await stp(pid,4,{name:'Exit & Post-Match Operations',department:'Operations',operators:30,cycle_time:20,wait_time:25,wip:5000,flow_type:'push',uptime:100,defect_rate:0,notes:'25-min exit queue for car parks. Staggered exit not communicated — all fans leave simultaneously.'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Non-Utilisation','Defects'],notes:{Waiting:'12-min F&B queue. 22% skip purchase = £4.20 avg × 8,800 fans × 15 events = £554k/year lost revenue.',Non_Utilisation:'Concession staff idle pre-match and post-match — peak demand management poor.',Defects:'3% turnstile scan errors each hold queue 90s — 90 errors/match = 135 min total queue impact.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Mobile ordering app — F&B to seat',description:'Mobile app order to seat. Eliminates concourse queue for 30% of transactions. Target: concourse queue from 12 to 7 min. Revenue recovery £180k/year.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Commercial Director',dueDate:'2026-04-30',actions:['Evaluate mobile ordering platforms','Integrate with POS system','Pilot in 2 sections','Measure queue time and revenue per head','Full venue rollout']},{id:'kz2',kzId:'KZ-002',title:'Staggered exit — section-by-section announcement',description:'Announce exit by section via PA and app. Stagger 2-min intervals. Reduces car park queue from 25 to 10 min. Fan satisfaction +0.4 pts.',category:'Quality',priority:'high',status:'open',owner:'Operations Manager',dueDate:'2026-05-01',actions:['Design announcement sequence','Brief PA operator','Trial at next 3 events','Survey fan exit experience']}]})
    seeded.push('Sports Venue'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // PUBLISHING — Editorial Workflow
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Publishing Editorial Workflow'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Publishing')}else{
    const pid=await proj({name:nm,industry:'publishing',customer:'Reader / Platform',
      description:'Digital and print publishing editorial workflow. Time-to-publish avg 31 days vs 14-day target.'})
    const s0=await stp(pid,0,{name:'Commission & Brief',department:'Editorial',operators:2,cycle_time:30,wait_time:2880,wip:12,flow_type:'push',uptime:100,defect_rate:30,notes:'30% of commissions require brief revision after author contact. Scope unclear at commission.'})
    const s1=await stp(pid,1,{name:'Content Creation & Submission',department:'Author',operators:1,cycle_time:7200,wait_time:4320,wip:8,flow_type:'push',uptime:100,defect_rate:25,notes:'25% of submissions require major structural revision. Author brief not followed.'})
    const s2=await stp(pid,2,{name:'Editorial Review & Copyedit',department:'Editorial',operators:3,cycle_time:240,wait_time:5760,wip:10,flow_type:'push',uptime:100,defect_rate:0,notes:'BOTTLENECK. 4-day queue for editorial review. Senior editor reviews all content regardless of complexity.'})
    const s3=await stp(pid,3,{name:'Design, Layout & Proofing',department:'Design',operators:2,cycle_time:180,wait_time:1440,wip:6,flow_type:'push',uptime:100,defect_rate:15,notes:'15% of layouts require 2+ proof rounds. Design brief communicated verbally — no written spec.'})
    const s4=await stp(pid,4,{name:'Publishing & Distribution',department:'Digital',operators:2,cycle_time:60,wait_time:480,wip:4,flow_type:'push',uptime:100,defect_rate:5,notes:'5% of published content has metadata errors — wrong category, missing alt text. SEO impact.'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Overprocessing'],notes:{Waiting:'4-day editorial queue × 10 articles = 40 article-days in queue. Topical content becomes stale.',Defects:'25% major revision = author rewrite avg 3 days. 30% commission revision restarts timeline.',Overprocessing:'Senior editor reviews all content. 60% could be handled by junior editors.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Tiered editorial review — junior editors handle standard content',description:'Classify content by complexity. Junior editors handle 60% of standard content. Senior reviews complex only. Target: editorial queue from 4 days to 1 day.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Editor in Chief',dueDate:'2026-04-30',actions:['Define content complexity criteria','Train junior editors','Pilot tiered workflow for 1 month','Measure queue time before/after']},{id:'kz2',kzId:'KZ-002',title:'Written design brief standard for all commissions',description:'Design brief template completed at commission stage. Designer has written spec before content delivered. Target: proof rounds from 2.2 to 1.1.',category:'Quality',priority:'high',status:'open',owner:'Creative Director',dueDate:'2026-05-01',actions:['Design brief template','Train editors','Add to commission workflow','Track proof rounds monthly']}]})
    seeded.push('Publishing'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // FILM & TV — Production
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Film & TV Production'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Film & TV')}else{
    const pid=await proj({name:nm,industry:'film_tv',customer:'Broadcaster / Distributor',
      description:'TV drama production. Average 18% over budget. Schedule overrun 3.2 days per episode.'})
    const s0=await stp(pid,0,{name:'Script Development & Approval',department:'Development',operators:4,cycle_time:1440,wait_time:28800,wip:3,flow_type:'push',uptime:100,defect_rate:40,notes:'40% of scripts require major revision after broadcaster read. Brief alignment poor at outset.'})
    const s1=await stp(pid,1,{name:'Pre-Production & Scheduling',department:'Production',operators:6,cycle_time:480,wait_time:2880,wip:2,flow_type:'push',uptime:100,defect_rate:25,notes:'25% of call sheets revised same-day. Location availability and cast availability not confirmed before strip-boarding.'})
    const s2=await stp(pid,2,{name:'Principal Photography',department:'All Departments',operators:60,cycle_time:600,wait_time:60,wip:1,flow_type:'push',uptime:100,defect_rate:15,notes:'BOTTLENECK. 15% of shoot days overrun into golden time. Camera and lighting setup delays primary cause.'})
    const s3=await stp(pid,3,{name:'Post-Production & Edit',department:'Post',operators:8,cycle_time:2400,wait_time:1440,wip:2,flow_type:'push',uptime:100,defect_rate:20,notes:'20% of edits require reshoot or ADR — pick-ups add avg £45k per episode.'})
    const s4=await stp(pid,4,{name:'Delivery & QC',department:'Delivery',operators:3,cycle_time:240,wait_time:1440,wip:1,flow_type:'push',uptime:100,defect_rate:8,notes:'8% of deliverables fail broadcaster QC — audio level, aspect ratio, or subtitle errors.'})
    await td(s2.id,pid,'waste',{selected:['Waiting','Defects','Overprocessing'],notes:{Waiting:'Camera setup avg 45 min per location move — 3 moves/day = 2.25 hrs of cast/crew waiting.',Defects:'20% reshoot/ADR = avg £45k per episode. Script revision 40% = development cost x2.',Overprocessing:'60-person crew waiting during setup. Department heads not pre-briefed on next setup.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Parallel setup — 2nd unit camera preps next location',description:'2nd unit camera crew pre-lights next location while 1st unit shoots. Reduces location move dead time from 45 to 15 min. Target: shoot day overrun from 15% to 5%.',category:'Productivity',priority:'critical',status:'in-progress',owner:'Line Producer',dueDate:'2026-04-30',actions:['Budget for 2nd unit camera operator','Schedule location moves with overlap','Trial on 2-location shoot days','Measure dead time before/after']},{id:'kz2',kzId:'KZ-002',title:'Broadcaster brief alignment meeting before script commission',description:'1-hr structured alignment with broadcaster exec before script room opens. 30 mandatory agreement points. Target: major revision rate from 40% to 15%.',category:'Quality',priority:'high',status:'open',owner:'Executive Producer',dueDate:'2026-05-01',actions:['Design alignment meeting agenda','Add to commissioning process','Pilot on next 2 productions','Track revision rate']}]})
    seeded.push('Film & TV'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // MUSIC PRODUCTION — Recording
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Music Production & Recording'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Music Production')}else{
    const pid=await proj({name:nm,industry:'music_production',customer:'Artist / Label',
      description:'Commercial music production. Average 2.4 revisions per track. Studio utilisation 58%.'})
    const s0=await stp(pid,0,{name:'Creative Brief & Direction',department:'A&R / Producer',operators:2,cycle_time:60,wait_time:1440,wip:4,flow_type:'push',uptime:100,defect_rate:45,notes:'45% of sessions start without agreed reference tracks or sonic direction. Leads to creative drift.'})
    const s1=await stp(pid,1,{name:'Tracking (Live Recording)',department:'Studio',operators:4,cycle_time:480,wait_time:720,wip:2,flow_type:'push',uptime:90,defect_rate:20,notes:'20% of tracking sessions require recall. Equipment prep incomplete. Session start avg 45 min late.'})
    const s2=await stp(pid,2,{name:'Production & Arrangement',department:'Producer',operators:2,cycle_time:960,wait_time:2880,wip:3,flow_type:'push',uptime:100,defect_rate:35,notes:'BOTTLENECK. 35% of productions revised significantly after artist review. Direction not locked.'})
    const s3=await stp(pid,3,{name:'Mix & Master',department:'Mix Engineer',operators:1,cycle_time:480,wait_time:2880,wip:4,flow_type:'push',uptime:100,defect_rate:28,notes:'28% of mixes require 2+ revision rounds. Feedback from multiple stakeholders conflicts.'})
    const s4=await stp(pid,4,{name:'Delivery & Distribution',department:'Management',operators:1,cycle_time:60,wait_time:1440,wip:2,flow_type:'push',uptime:100,defect_rate:5,notes:'5% of deliverables have metadata errors — ISRC missing or wrong genre tag.'})
    await td(s2.id,pid,'waste',{selected:['Defects','Waiting','Non-Utilisation'],notes:{Defects:'2.4 avg revisions per track × £800 studio day rate = £1,920 rework cost per track.',Waiting:'Studio idle between sessions 42% of booked time — sessions start late or end early.',Non_Utilisation:'Mix engineer revising direction rather than executing. Creative decisions should be locked before mix.'}})
    await td(s2.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Pre-production direction lock — 10-point agreement',description:'10-point creative direction document signed before tracking begins. Reference tracks, tempo range, key, arrangement style, vocal tone. Target: production revision from 35% to 12%.',category:'Quality',priority:'critical',status:'in-progress',owner:'Lead Producer',dueDate:'2026-04-30',actions:['Design direction document template','Introduce for all new projects','Train A&R team on facilitation','Track revision rate monthly']},{id:'kz2',kzId:'KZ-002',title:'Session prep checklist — completed day before',description:'Engineer completes full session prep checklist 24 hrs before. All outboard patched, templates loaded, headphone mixes set. Target: session start from 45-min late to on-time.',category:'Productivity',priority:'high',status:'open',owner:'Studio Manager',dueDate:'2026-05-01',actions:['Design checklist by session type','Train all engineers','Add to booking confirmation','Measure session start time weekly']}]})
    seeded.push('Music Production'); if(!primaryId)primaryId=pid
    }}

    // ══════════════════════════════════════════════════════════════════════════
    // VIDEO GAMES — Development
    // ══════════════════════════════════════════════════════════════════════════
    { const nm='Reference — Video Game Development'; if(!shouldSeed(nm)){return}
    const ex=await exists(nm); if(ex){existing.push('Video Games')}else{
    const pid=await proj({name:nm,industry:'video_games',customer:'Player / Platform',
      description:'Mobile game development studio. Release cycle 6 months vs 3-month target. Bug backlog 340 open.'})
    const s0=await stp(pid,0,{name:'Game Design & Concept',department:'Design',operators:3,cycle_time:960,wait_time:1440,wip:2,flow_type:'push',uptime:100,defect_rate:35,notes:'35% of design documents revised after engineering feasibility check. Technical constraints not consulted early.'})
    const s1=await stp(pid,1,{name:'Feature Development (Sprint)',department:'Engineering',operators:8,cycle_time:4800,wait_time:480,wip:15,flow_type:'push',uptime:100,defect_rate:22,notes:'22% of sprint tickets returned from QA — acceptance criteria unclear at sprint start.'})
    const s2=await stp(pid,2,{name:'QA Testing & Bug Reporting',department:'QA',operators:4,cycle_time:1200,wait_time:480,wip:85,flow_type:'push',uptime:100,defect_rate:0,notes:'BOTTLENECK. 340 open bugs. QA find-rate 12 bugs/day. Engineering fix-rate 8/day — backlog growing.'})
    const s3=await stp(pid,3,{name:'Performance Optimisation',department:'Engineering',operators:2,cycle_time:960,wait_time:1440,wip:1,flow_type:'push',uptime:100,defect_rate:15,notes:'15% of optimisation work reverted — regression introduced. No automated performance baseline.'})
    const s4=await stp(pid,4,{name:'Platform Submission & Release',department:'Publishing',operators:2,cycle_time:480,wait_time:7200,wip:1,flow_type:'push',uptime:100,defect_rate:18,notes:'18% of submissions rejected by App Store / Google Play — policy compliance or metadata errors.'})
    await td(s2.id,pid,'fivewhy',{problem:'Bug backlog growing — 340 open, adding 4/day net',whys:[{q:'Why is bug backlog growing?',a:'QA find-rate (12/day) exceeds engineering fix-rate (8/day) — net +4 bugs/day.'},{q:'Why fix-rate only 8/day?',a:'Engineers context-switch between bug fixing and new feature development simultaneously.'},{q:'Why context-switching?',a:'No separation between bug-fix sprint and feature sprint. All work in same sprint.'},{q:'Why no separation?',a:'Product roadmap pressure — product team adds features each sprint regardless of bug count.'},{q:'Why no bug threshold gate?',a:'ROOT CAUSE: No definition of done that includes bug count. Release criteria do not reference backlog size.'}],rootCause:'No bug-count gate in release criteria. Features prioritised over stability. Backlog grows unchecked.',countermeasure:'1. Add bug threshold to sprint planning (no new features if P1/P2 backlog >50). 2. Dedicated bug-fix sprint each quarter. 3. Fix-rate KPI for engineering team.',owner:'Engineering Manager',dueDate:'2026-04-30'})
    await td(s1.id,pid,'kaizen',{items:[{id:'kz1',kzId:'KZ-001',title:'Definition of ready — acceptance criteria mandatory at sprint start',description:'Ticket cannot enter sprint without 3 user stories and 5 acceptance criteria. QA sign-off on criteria before development starts. Target: QA return rate from 22% to 8%.',category:'Quality',priority:'critical',status:'in-progress',owner:'Scrum Master',dueDate:'2026-04-15',actions:['Define DoR template','Train product owners','Configure Jira mandatory fields','Measure return rate per sprint']},{id:'kz2',kzId:'KZ-002',title:'Bug-fix sprint every Q — no feature development',description:'Dedicated 2-week bug-fix sprint each quarter. Engineering 100% on backlog reduction. Target: reduce open bugs from 340 to <80.',category:'Productivity',priority:'high',status:'open',owner:'Product Director',dueDate:'2026-05-01',actions:['Schedule Q2 bug sprint in roadmap','Communicate to stakeholders','Define exit criteria (P1 zero, P2 <20)','Track backlog during sprint']}]})
    
      await wa(s2.id,pid,['Defects','Waiting','Overprocessing'],{Defects:'340 open bugs — find-rate 12/day vs fix-rate 8/day. Bug backlog growing each sprint.',Waiting:'QA queue wait avg 4.8 days per build submission — QA team under-resourced vs build frequency',Overprocessing:'Full 8-hour regression run on every build including minor UI text changes'})
      seeded.push('Video Games'); if(!primaryId)primaryId=pid
    }}


        // ── Response ──────────────────────────────────────────────────────────────
    const allExisted = seeded.length === 0
    return NextResponse.json({
      id: primaryId,
      seeded,
      existing,
      already_exists: allExisted,
      message: allExisted
        ? `All ${existing.length} reference projects already loaded`
        : `${seeded.length} reference project${seeded.length !== 1 ? 's' : ''} added: ${seeded.join(', ')}`,
    })

  } catch (err: any) {
    console.error('[seed-all-references]', err)
    return NextResponse.json({ error: err?.message || 'Failed to seed reference projects' }, { status: 500 })
  }
}
