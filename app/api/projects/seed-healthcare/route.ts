// @ts-nocheck
// ── app/api/projects/seed-healthcare/route.ts ─────────────────────────────────
// Creates a fully-populated Healthcare demo project.
// Value stream: Patient Arrival → Triage → Registration → Assessment → Diagnosis
//              → Treatment (bottleneck) → Discharge & Documentation
// All 9 CI tools populated with realistic clinic/ED data.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 60  // Vercel max execution time (seconds)

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: existing } = await supabase
      .from('projects').select('id')
      .eq('user_id', user.id)
      .eq('name', 'Demo — Urgent Care Patient Flow')
      .maybeSingle()

    if (existing?.id) return NextResponse.json({ id: existing.id, already_exists: true })

    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({
        user_id:     user.id,
        name:        'Demo — Urgent Care Patient Flow',
        description: 'Full patient value stream from arrival to discharge. 7 steps, 3.2hr lead time against 45-min takt. Bottleneck at Treatment. All CI tools populated. Use as a guide for your own process.',
        industry:    'Healthcare',
        customer:    'Patient',
        state:       'current',
        status:      'active',
      })
      .select().single()

    if (projErr) throw projErr
    const pid = project.id

    async function step(pos: number, fields: Record<string, any>) {
      const { data, error } = await supabase.from('steps')
        .insert({ project_id: pid, user_id: user.id, position: pos, is_main_flow: true, ...fields })
        .select().single()
      if (error) throw error
      return data
    }

    async function tool(stepId: string, toolName: string, data: any) {
      const { error } = await supabase.from('tool_data').insert({
        step_id: stepId, project_id: pid, user_id: user.id,
        tool: toolName, data,
        saved_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      })
      if (error) console.error(`tool_data (${toolName}):`, error.message)
    }

    // ── Steps — all times in minutes ──────────────────────────────────────────
    // Takt: 45 min (target door-to-discharge for non-critical urgent care)

    const s1 = await step(0, {
      name: 'Patient Arrival & Check-In', department: 'Front Desk',
      operators: 1, cycle_time: 8, wait_time: 12, wip: 6,
      flow_type: 'push', uptime: 100, defect_rate: 3,
      notes: 'NNVA. Paper registration form duplicates EHR entry downstream. 3% patients incorrectly registered — causes downstream rework in billing. 12-min wait when front desk occupied.',
    })

    const s2 = await step(1, {
      name: 'Triage & Acuity Assessment', department: 'Nursing',
      operators: 1, cycle_time: 6, wait_time: 18, wip: 5,
      flow_type: 'push', uptime: 100, defect_rate: 2,
      notes: 'VA. ESI Level 1-5 classification. 18-min queue when 2+ ambulances arrive simultaneously. 2% incorrect triage requiring reassessment.',
    })

    const s3 = await step(2, {
      name: 'Vitals & Initial Nursing Assessment', department: 'Nursing',
      operators: 1, cycle_time: 12, wait_time: 25, wip: 8,
      flow_type: 'push', uptime: 100, defect_rate: 1,
      notes: 'VA. BP, HR, SpO2, temp, pain scale, chief complaint documented. 25-min wait for room assignment is primary patient satisfaction driver.',
    })

    const s4 = await step(3, {
      name: 'Physician Assessment & Orders', department: 'Medical',
      operators: 1, cycle_time: 18, wait_time: 35, wip: 10,
      flow_type: 'push', uptime: 100, defect_rate: 5,
      notes: 'VA. Physician takes history, physical exam, orders labs/imaging/treatment. 35-min wait is highest source of patient dissatisfaction. 5% of orders require clarification — rework.',
    })

    const s5 = await step(4, {
      name: 'Diagnostics — Lab & Imaging', department: 'Diagnostics',
      operators: 2, cycle_time: 45, wait_time: 30, wip: 12,
      flow_type: 'push', uptime: 92, defect_rate: 4,
      notes: 'NNVA. Lab turnaround 45 min average. X-ray 20 min, CT 60+ min. 4% of results require repeat collection — equipment calibration or patient movement. Uptime 92% due to one CT scanner.',
    })

    const s6 = await step(5, {
      name: 'Treatment & Intervention', department: 'Medical / Nursing',
      operators: 2, cycle_time: 52, wait_time: 15, wip: 7,
      flow_type: 'push', uptime: 100, defect_rate: 6,
      notes: 'BOTTLENECK. Highest CT. Medication admin, procedures, wound care, IV therapy. 6% treatment incidents require additional intervention. Limited procedure rooms create waiting.',
    })

    const s7 = await step(6, {
      name: 'Discharge & Documentation', department: 'Medical / Nursing',
      operators: 1, cycle_time: 18, wait_time: 22, wip: 9,
      flow_type: 'push', uptime: 100, defect_rate: 8,
      notes: 'NNVA. Discharge instructions, prescription, follow-up plan, EHR documentation. 8% of patients return within 72hrs — potential discharge quality issue. 22-min wait for physician signature.',
    })

    // ── Time Studies ──────────────────────────────────────────────────────────
    await tool(s4.id, 'stopwatch', {
      baseline: 55, target: 18, mean: 35,
      laps: [28, 42, 35, 55, 22, 38, 35, 45, 28, 32], excluded: [],
      notes: 'Wait time for physician to begin assessment in minutes. Target: 15 min from room placement. Variation driven by physician-to-patient ratio — peak hours vs off-peak.',
    })

    await tool(s5.id, 'stopwatch', {
      baseline: 90, target: 35, mean: 45,
      laps: [40, 55, 35, 90, 42, 45, 38, 60, 35, 45], excluded: [],
      notes: 'Lab result turnaround in minutes. High variation — basic panel 20 min, comprehensive 90 min. CT wait included in peak hours.',
    })

    await tool(s6.id, 'stopwatch', {
      baseline: 65, target: 40, mean: 52,
      laps: [45, 60, 48, 65, 42, 55, 48, 60, 45, 52], excluded: [],
      notes: 'Active treatment time in minutes. Variation driven by complexity. Simple laceration 20 min. IV therapy + monitoring 90 min. Bottleneck is procedure room availability.',
    })

    await tool(s7.id, 'stopwatch', {
      baseline: 40, target: 15, mean: 22,
      laps: [18, 25, 22, 40, 15, 28, 18, 25, 22, 20], excluded: [],
      notes: 'Wait for physician discharge signature in minutes. Physician completing other assessments. Target: concurrent discharge documentation during treatment.',
    })

    // ── Fishbone (bottleneck: Treatment) ──────────────────────────────────────
    await tool(s6.id, 'ishikawa', {
      problem: 'Treatment step CT 52 min exceeds 45-min takt — causing average door-to-discharge of 3.2 hours against 2-hour target',
      framework: '6m',
      causes: {
        Machine:          ['Only 2 procedure rooms for 8-bed department — creates queuing', 'IV pump shortage during peak hours — nurses share equipment', 'EHR documentation slow — 8 clicks to record medication administration'],
        Method:           ['No concurrent discharge documentation — physician completes after patient leaves room', 'Treatment plans not standardised for top 10 diagnoses — variability', 'Medication preparation not batched — nurse makes multiple trips to medication room'],
        Material:         ['Medication supply kept in central pharmacy — not at point of care', 'Wound care supply cart restocked only once per shift — items run out at peak'],
        Manpower:         ['1 physician covering 8 beds during peak hours — cognitive load', 'Nurse-to-patient ratio 1:4 during surge — delays in IV monitoring', 'Float pool nurses unfamiliar with department layout'],
        Measurement:      ['Door-to-discharge time tracked but not broken down by step', 'No real-time visibility of which patients are in which step'],
        'Mother Nature':  ['Monday and Friday 4-8pm surge doubles patient volume in 2 hours', 'Winter respiratory season increases complexity of presentations'],
      },
    })

    // ── 5 Why ─────────────────────────────────────────────────────────────────
    await tool(s6.id, 'fivewhy', {
      problem: 'Average door-to-discharge time is 3.2 hours — 1.2 hours over the 2-hour target, driving patient dissatisfaction and delayed care',
      whys: [
        { q: 'Why is door-to-discharge 3.2 hours?',
          a: 'The bottleneck is physician assessment wait (35 min) and treatment (52 min) — both exceed takt time significantly.' },
        { q: 'Why does physician assessment wait average 35 minutes?',
          a: 'One physician covers 8 beds during peak hours. When 3+ patients arrive simultaneously, queue forms immediately.' },
        { q: 'Why is physician coverage not scaled to demand?',
          a: 'Staffing is scheduled on a fixed daily model — not matched to the hourly demand pattern that shows consistent Monday and Friday 4-8pm surges.' },
        { q: 'Why has staffing not been matched to the demand pattern?',
          a: 'The demand pattern has never been formally analysed and presented to administration in a way that justifies the cost of additional physician hours.' },
        { q: 'Why has demand analysis not been done?',
          a: 'ROOT CAUSE: No continuous improvement process exists in the department. Staff observe the problem daily but there is no mechanism to escalate it through data — and no standard for what good looks like.' },
      ],
      rootCause: 'No CI structure exists to measure demand patterns, set performance standards, and escalate capacity gaps with data. Staff observe the bottleneck daily but lack the tools to quantify and escalate it.',
      countermeasure: '1. Map hourly patient arrival data by day of week for 90 days. 2. Redesign physician schedule to add 1 physician during Mon/Fri 4-8pm surge. 3. Standardise treatment protocols for top 10 diagnoses. 4. Implement concurrent discharge documentation.',
      owner: 'Medical Director / Operations',
      dueDate: '2026-05-31',
    })

    // ── Waste ID ──────────────────────────────────────────────────────────────
    await tool(s6.id, 'waste', {
      wastes: {
        Waiting:           'Patients wait 35 min for physician, 30 min for labs — 65 min of pure queue',
        Defects:           '6% of treatments require additional intervention — medication error or missed diagnosis',
        Motion:            'Nurses make avg 3 trips to medication room per patient — supply not at point of care',
        'Over-processing': 'Paper forms at check-in re-entered into EHR — duplicate data entry, no value',
        Inventory:         'Wound care cart depletes by 6pm — supplies not replenished based on demand',
      },
      notes: 'Quick wins: medication supply at point of care, concurrent discharge documentation. Medium: demand-matched staffing. Long: EHR workflow redesign.',
    })

    await tool(s7.id, 'waste', {
      wastes: {
        Waiting:           '22-min wait for physician discharge signature — physician completing other assessments',
        'Over-processing': 'Discharge instructions re-explained by nurse after physician already explained — duplication',
        Defects:           '8% of patients return within 72hrs — discharge instructions not understood or incomplete',
      },
      notes: 'Concurrent documentation during treatment would eliminate most of the 22-min wait.',
    })

    // ── Kaizen Events ─────────────────────────────────────────────────────────
    await tool(s6.id, 'kaizen', {
      items: [
        {
          id: 'kz001', kzId: 'KZ-001',
          title: 'Point-of-care medication supply — eliminate med room trips',
          description: 'Move top 20 medications to a secured automated dispensing cabinet in the main treatment area. Eliminates avg 3 trips per patient to central medication room. Nursing time saving: 8 min per patient.',
          category: 'Productivity', priority: 'critical', status: 'in-progress',
          owner: 'Charge Nurse / Pharmacy', dueDate: '2026-04-15',
          actions: ['Identify top 20 medications by volume', 'Procure 1 additional Pyxis unit', 'Install in treatment area bay 3', 'Update medication administration protocol'],
          created: Date.now() - 604800000,
        },
        {
          id: 'kz002', kzId: 'KZ-002',
          title: 'Concurrent discharge documentation during treatment',
          description: 'Physician completes discharge plan and instructions while patient is in treatment — not after. Eliminates 22-min signature wait. Requires EHR workflow change and habit shift.',
          category: 'Productivity', priority: 'high', status: 'open',
          owner: 'Medical Director', dueDate: '2026-05-01',
          actions: ['Redesign EHR discharge workflow — concurrent entry enabled', 'Pilot with 2 physicians for 2 weeks', 'Measure wait time before/after'],
          created: Date.now() - 259200000,
        },
        {
          id: 'kz003', kzId: 'KZ-003',
          title: 'Demand-matched physician schedule — Mon/Fri 4-8pm surge',
          description: '90-day arrival data analysis shows consistent surge Mon and Fri 4-8pm. Adding 1 physician for these 4-hour windows reduces physician wait from 35 min to under 15 min. Business case being built.',
          category: 'Productivity', priority: 'high', status: 'open',
          owner: 'Operations Manager', dueDate: '2026-06-01',
          actions: ['Pull 90-day hourly arrival data', 'Build cost-benefit analysis for additional physician hours', 'Present to administration with data', 'Pilot 4-week schedule change'],
          created: Date.now() - 172800000,
        },
        {
          id: 'kz004', kzId: 'KZ-004',
          title: 'Eliminate paper check-in — digital intake at arrival',
          description: 'Replace paper registration form with tablet-based digital intake. Data flows directly to EHR — eliminates front desk re-entry and 3% registration errors that cause billing rework.',
          category: 'Quality', priority: 'medium', status: 'open',
          owner: 'IT / Front Desk Manager', dueDate: '2026-07-01',
          actions: ['Evaluate 3 digital intake vendors', 'EHR integration test', 'Staff training', 'Go-live with 30-day evaluation'],
          created: Date.now() - 86400000,
        },
      ],
    })

    // ── Improvement Goals ─────────────────────────────────────────────────────
    await tool(s6.id, 'improvement', {
      goals: [
        { id: 'g1', metric: 'Door-to-Discharge Time', baseline: 192, target: 120, actual: null, unit: 'minutes',
          status: 'in-progress', owner: 'Medical Director', dueDate: '2026-09-01',
          notes: 'KZ-001 + KZ-002 + KZ-003 combined expected to reduce to 120 min' },
        { id: 'g2', metric: 'Treatment Cycle Time', baseline: 52, target: 40, actual: null, unit: 'minutes',
          status: 'in-progress', owner: 'Charge Nurse', dueDate: '2026-06-01',
          notes: 'Point-of-care medication + concurrent discharge documentation expected to achieve 40 min' },
      ],
    })

    await tool(s4.id, 'improvement', {
      goals: [{
        id: 'g3', metric: 'Physician Assessment Wait', baseline: 35, target: 15, actual: null, unit: 'minutes',
        status: 'open', owner: 'Operations Manager', dueDate: '2026-07-01',
        notes: 'Demand-matched schedule during surge hours targets under 15 min',
      }],
    })

    await tool(s7.id, 'improvement', {
      goals: [{
        id: 'g4', metric: '72-Hour Return Rate', baseline: 8, target: 3, actual: null, unit: '%',
        status: 'open', owner: 'Medical Director', dueDate: '2026-08-01',
        notes: 'Improved discharge documentation and patient instruction quality',
      }],
    })

    return NextResponse.json({ id: pid, already_exists: false })

  } catch (err: any) {
    console.error('[seed-healthcare]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
