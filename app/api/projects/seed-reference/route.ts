// @ts-nocheck
// ── app/api/projects/seed-reference/route.ts ─────────────────────────────────
// Creates a fully-populated reference project demonstrating every VeSiMy feature.
// Idempotent — returns existing project if one already exists for this user.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 60  // Vercel max execution time (seconds)

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // ── Idempotency ───────────────────────────────────────────────────────────
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', '⭐ Reference — Automotive Seat Assembly')
      .maybeSingle()

    if (existing?.id) {
      return NextResponse.json({ id: existing.id, already_exists: true })
    }

    // ── 1. Project (only real columns) ────────────────────────────────────────
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({
        user_id:     user.id,
        name:        '⭐ Reference — Automotive Seat Assembly',
        description: 'Fully-built reference project. Every tool populated. 6 main steps, 2 branches, time studies, fishbone, 5 Why, waste ID, kaizen events, improvement goals. Use this as your guide.',
        industry:    'Automotive',
        customer:    'OEM Assembly Plant',
        state:       'current',
        status:      'active',
      })
      .select()
      .single()

    if (projErr) throw projErr
    const pid = project.id

    // ── Helpers ───────────────────────────────────────────────────────────────
    async function step(pos: number, fields: Record<string, any>) {
      const { data, error } = await supabase
        .from('steps')
        .insert({ project_id: pid, user_id: user.id, position: pos, is_main_flow: true, ...fields })
        .select().single()
      if (error) throw error
      return data
    }

    async function bStep(pos: number, bid: string, fields: Record<string, any>) {
      const { data, error } = await supabase
        .from('steps')
        .insert({ project_id: pid, user_id: user.id, position: pos, is_main_flow: false, branch_id: bid, ...fields })
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
      if (error) console.error(`tool_data insert error (${toolName}):`, error.message)
    }

    // ── 2. Main flow (6 steps) ────────────────────────────────────────────────
    const s1 = await step(0, {
      name: 'Material Staging', department: 'Materials',
      operators: 1, cycle_time: 45, wait_time: 300, wip: 12,
      flow_type: 'push', uptime: 100, defect_rate: 0,
      notes: 'NNVA. Operator walks 40m to warehouse each cycle — motion waste. Shadow board planned.',
    })

    const s2 = await step(1, {
      name: 'Frame Sub-Assembly', department: 'Sub-Assembly',
      operators: 2, cycle_time: 98, wait_time: 60, wip: 6,
      flow_type: 'push', uptime: 92, defect_rate: 1.2,
      notes: 'VA. Consistent CT. 6s NVA: operator reaches for torque wrench not at point of use.',
    })

    const s3 = await step(2, {
      name: 'Foam & Fabric Install', department: 'Trim',
      operators: 2, cycle_time: 145, wait_time: 90, wip: 8,
      flow_type: 'push', uptime: 88, defect_rate: 2.1,
      notes: 'VA — BOTTLENECK. CT 145s exceeds takt 120s. 16s NVA walk to foam rack. KZ-001 in progress.',
    })

    const s4 = await step(3, {
      name: 'Electrical Integration', department: 'Electrical',
      operators: 1, cycle_time: 88, wait_time: 45, wip: 4,
      flow_type: 'fifo', uptime: 95, defect_rate: 0.8,
      notes: 'VA. Harness feeds from Branch A via FIFO lane (max 5 units). Stable process.',
    })

    const s5 = await step(4, {
      name: 'Final QC & Audit', department: 'Quality',
      operators: 1, cycle_time: 72, wait_time: 120, wip: 5,
      flow_type: 'push', uptime: 100, defect_rate: 0.3,
      notes: 'NNVA. In-station audit per IATF 16949 §8.6.1. 12s NVA: manual MES logging (KZ-004 open).',
    })

    const s6 = await step(5, {
      name: 'Packing & Dispatch', department: 'Logistics',
      operators: 1, cycle_time: 55, wait_time: 180, wip: 15,
      flow_type: 'push', uptime: 100, defect_rate: 0,
      notes: 'NNVA. High WIP: timed OEM collection every 2 hrs creates batch. 15s NVA: move to dispatch bay.',
    })

    // ── 3. Time Studies ───────────────────────────────────────────────────────
    await tool(s1.id, 'stopwatch', {
      baseline: 50, target: 35, mean: 45,
      laps: [44, 46, 45, 43, 48, 45, 44, 46, 45, 47], excluded: [],
      notes: '10 cycles. High variation due to walk distance. Point-of-use storage being designed.',
    })

    await tool(s2.id, 'stopwatch', {
      baseline: 110, target: 90, mean: 98,
      laps: [100, 96, 98, 102, 95, 98, 100, 97, 99, 95], excluded: [],
      notes: 'Consistent. CT within takt. Target 90s once NVA removed.',
    })

    await tool(s3.id, 'stopwatch', {
      baseline: 160, target: 110, mean: 145,
      laps: [142, 148, 145, 150, 143, 146, 144, 149, 145, 147], excluded: [],
      notes: 'BOTTLENECK. CT 145s > Takt 120s. 16s NVA walk identified as primary target.',
    })

    await tool(s4.id, 'stopwatch', {
      baseline: 95, target: 80, mean: 88,
      laps: [86, 90, 88, 87, 89, 88, 90, 86, 88, 88], excluded: [],
      notes: 'Stable. Target 80s by moving harness routing to branch sub-assembly.',
    })

    // ── 4. Fishbone (bottleneck step) ─────────────────────────────────────────
    await tool(s3.id, 'ishikawa', {
      problem: 'Foam & Fabric Install CT 145s exceeds takt 120s (3 seats/shift shortfall)',
      framework: '6m',
      causes: {
        Machine:     ['No powered assist for fabric pull', 'Jig does not hold fabric taut automatically'],
        Method:      ['Foam rack 4m from workstation (16s walk NVA)', 'Mutual check adds 13s', 'No standard work sheet for new operators'],
        Material:    ['Fabric cover too tight on winter batches — dimensional variation', 'Foam density variation affects clip engagement'],
        Manpower:    ['New operators 20% slower — no SWS', 'LH/RH operators must coordinate — creates waiting'],
        Measurement: ['No in-process CT tracking — only end-of-shift review'],
        'Mother Nature': ['Cold ambient temp increases foam stiffness in winter'],
      },
    })

    // ── 5. 5 Why ─────────────────────────────────────────────────────────────
    await tool(s3.id, 'fivewhy', {
      problem: 'Foam & Fabric Install CT 145s is 25s over takt time',
      whys: [
        { q: 'Why is CT 25s over takt?',
          a: 'Operator walks 4m to foam rack (16s NVA) and waits 13s for partner every cycle.' },
        { q: 'Why is the foam rack 4m away?',
          a: 'Line was laid out 3 years ago when foam was less frequently used. Never updated.' },
        { q: 'Why was the layout never updated when product mix changed?',
          a: 'No formal process exists to review line-side storage locations when takt time changes.' },
        { q: 'Why is there no formal line layout review process?',
          a: 'Manufacturing Engineering is not part of the takt-time review cycle. No standard for material location distance.' },
        { q: 'Why is Manufacturing Engineering excluded from takt reviews?',
          a: 'ROOT CAUSE: PFMEA review gate does not require a material flow audit when takt time is revised.' },
      ],
      rootCause: 'PFMEA review gate does not mandate a material flow audit when takt time changes — foam rack was never relocated when CT/takt ratio deteriorated.',
      countermeasure: '1. Update PFMEA procedure to include mandatory material flow audit on takt revision. 2. Relocate foam rack to within 0.5m of workstation immediately as interim fix. 3. Add 2-hour kanban replenishment cycle.',
      owner: 'Manufacturing Engineering',
      dueDate: '2026-04-15',
    })

    // ── 6. Waste ID ───────────────────────────────────────────────────────────
    await tool(s3.id, 'waste', {
      wastes: {
        Motion:           'Operator walks 4m to foam rack every cycle = 16s NVA per seat',
        Waiting:          'Operator waits 13s for partner to complete LH side before mutual check',
        'Over-processing': 'Dual mutual check adds 13s — single check + poka-yoke would suffice',
        Defects:          '2.1% defect rate — fabric mis-clip causes rework averaging 8 min each',
      },
      notes: 'Priority order: Motion (foam rack) → Defects (poka-yoke clip guide) → Over-processing (eliminate dual check).',
    })

    await tool(s1.id, 'waste', {
      wastes: {
        Motion:    'Walk 40m round trip to warehouse each cycle',
        Transport: 'Manual pallet movement — no automated line replenishment',
        Waiting:   '300s average queue before staging begins',
      },
      notes: 'Point-of-use shadow board and kanban replenishment planned Q2 2026.',
    })

    // ── 7. Kaizen events ──────────────────────────────────────────────────────
    await tool(s3.id, 'kaizen', {
      items: [
        {
          id: 'kz001', kzId: 'KZ-001',
          title: 'Relocate foam rack to point of use',
          description: 'Move foam rack from 4m to within 0.5m of workstation. Shadow board. Expected saving: 16s NVA per cycle = 64 minutes/shift.',
          category: 'Productivity', priority: 'critical', status: 'in-progress',
          owner: 'J. Patel', dueDate: '2026-04-01',
          actions: ['Mark new foam rack location', 'Arrange facilities relocation', 'Update standard work', 'Before/after time study'],
          created: Date.now() - 604800000,
        },
        {
          id: 'kz002', kzId: 'KZ-002',
          title: 'Poka-yoke fabric clip alignment jig',
          description: 'Design guide pins to locate clips automatically. Eliminates 13s mutual visual check. Quality built in.',
          category: 'Quality', priority: 'high', status: 'open',
          owner: 'S. Ahmed', dueDate: '2026-05-01',
          actions: ['Raise ECR with tooling engineering', 'Prototype guide pin design', '30-cycle trial validation'],
          created: Date.now() - 259200000,
        },
        {
          id: 'kz003', kzId: 'KZ-003',
          title: 'Create Standard Work Sheet for new operators',
          description: 'No SWS exists — new operators take 20% longer. Create with photos, task breakdown and VA/NNVA/NVA classification.',
          category: 'Morale', priority: 'medium', status: 'complete',
          owner: 'Team Leader', dueDate: '2026-03-15',
          actions: ['Complete operator task breakdown in VeSiMy', 'Print and laminate at workstation', 'Train all 4 operators'],
          created: Date.now() - 1209600000,
        },
      ],
    })

    await tool(s5.id, 'kaizen', {
      items: [{
        id: 'kz004', kzId: 'KZ-004',
        title: 'Eliminate manual MES entry — auto-close on barcode scan',
        description: 'Manual MES logging (12s NVA) replaced with automatic scan-to-pass. IT approval received.',
        category: 'Productivity', priority: 'medium', status: 'open',
        owner: 'IT / Quality', dueDate: '2026-06-01',
        actions: ['Configure MES auto-close on scan', 'UAT with quality team'],
        created: Date.now() - 172800000,
      }],
    })

    // ── 8. Improvement goals ──────────────────────────────────────────────────
    await tool(s3.id, 'improvement', {
      goals: [
        { id: 'g1', metric: 'Cycle Time', baseline: 145, target: 110, actual: null, unit: 'seconds',
          status: 'in-progress', owner: 'J. Patel', dueDate: '2026-05-01',
          notes: 'After foam rack relocation + poka-yoke clip installation' },
        { id: 'g2', metric: 'Defect Rate', baseline: 2.1, target: 0.5, actual: null, unit: '%',
          status: 'in-progress', owner: 'S. Ahmed', dueDate: '2026-05-01',
          notes: 'Clip alignment poka-yoke expected to eliminate 80% of mis-clips' },
      ],
    })

    await tool(s1.id, 'improvement', {
      goals: [
        { id: 'g3', metric: 'Cycle Time', baseline: 50, target: 32, actual: null, unit: 'seconds',
          status: 'open', owner: 'Materials Team', dueDate: '2026-06-01',
          notes: 'Point-of-use foam storage + kanban replenishment' },
      ],
    })

    // ── 9. Branch A — Electrical Harness Sub-Assembly ─────────────────────────
    const bidA = `branch-${Date.now()}-a`
    const { error: bErrA } = await supabase.from('branches').insert({
      project_id: pid, user_id: user.id, branch_id: bidA,
      label: 'Branch A — Electrical Harness',
      color: '#6426A0',
      parent_step_id: s2.id,
      merge_step_id: s4.id,
      position: 0,
    })
    if (bErrA) console.error('branch A error:', bErrA.message)

    const b1 = await bStep(0, bidA, {
      name: 'Wire Cut & Strip', department: 'Electrical',
      operators: 1, cycle_time: 38, wait_time: 20, wip: 3,
      flow_type: 'push', uptime: 100,
      notes: 'VA. Auto-cutter to length + strip 4 terminations. Consistent, no issues.',
    })

    const b2 = await bStep(1, bidA, {
      name: 'Connector Crimping', department: 'Electrical',
      operators: 1, cycle_time: 52, wait_time: 15, wip: 2,
      flow_type: 'push', uptime: 94, defect_rate: 0.5,
      notes: 'VA. 6 terminals per harness. Pull-test each crimp. 0.5% crimp failure rate tracked.',
    })

    const b3 = await bStep(2, bidA, {
      name: 'Harness Assembly & Test', department: 'Electrical',
      operators: 1, cycle_time: 44, wait_time: 10, wip: 2,
      flow_type: 'fifo', uptime: 98,
      notes: 'VA. Route into protective sleeve, fit connectors, continuity test, place in FIFO output.',
    })

    await tool(b3.id, 'kaizen', {
      items: [{
        id: 'kz005', kzId: 'KZ-005',
        title: 'Combine Harness Assembly & Test into single station',
        description: 'Two operations can merge. Integrate test fixture into assembly jig. CT reduction 44s → 32s.',
        category: 'Productivity', priority: 'medium', status: 'open',
        owner: 'Electrical Team Lead', dueDate: '2026-07-01',
        actions: ['Design integrated jig', 'Quality approval', '1-shift trial'],
        created: Date.now() - 86400000,
      }],
    })

    // ── 10. Branch B — Foam Prep Sub-Assembly ────────────────────────────────
    const bidB = `branch-${Date.now() + 1}-b`
    const { error: bErrB } = await supabase.from('branches').insert({
      project_id: pid, user_id: user.id, branch_id: bidB,
      label: 'Branch B — Foam & Fabric Prep',
      color: '#1090D4',
      parent_step_id: s1.id,
      merge_step_id: s3.id,
      position: 1,
    })
    if (bErrB) console.error('branch B error:', bErrB.message)

    await bStep(0, bidB, {
      name: 'Foam Pre-Cut', department: 'Materials',
      operators: 1, cycle_time: 35, wait_time: 180, wip: 8,
      flow_type: 'push', uptime: 100,
      notes: 'VA. Auto-cut profile to drawing. Visual dimension check. 180s wait = prep outpaces consumption.',
    })

    await bStep(1, bidB, {
      name: 'Fabric Pre-Stage', department: 'Trim',
      operators: 1, cycle_time: 28, wait_time: 60, wip: 6,
      flow_type: 'supermarket', uptime: 100, sm_min: 4, sm_max: 10,
      notes: 'NNVA. Cut fabric to pattern, place in supermarket (min 4, max 10 units). Replenish on kanban signal.',
    })

    // ── Done ──────────────────────────────────────────────────────────────────
    return NextResponse.json({ id: pid, already_exists: false })

  } catch (err: any) {
    console.error('[seed-reference]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
