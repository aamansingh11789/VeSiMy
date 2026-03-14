// @ts-nocheck
// ── app/api/projects/seed-reference/route.ts ─────────────────────────────────
// Creates a fully-populated reference project demonstrating every VeSiMy feature.
// Idempotent — if a reference project already exists for this user it returns it.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // ── Idempotency check ─────────────────────────────────────────────────────
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', '⭐ Reference — Automotive Seat Assembly Line 4')
      .maybeSingle()

    if (existing?.id) {
      return NextResponse.json({ id: existing.id, already_exists: true })
    }

    // ── 1. Create project ─────────────────────────────────────────────────────
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: '⭐ Reference — Automotive Seat Assembly Line 4',
        description: 'Fully-populated reference project. Every tool, every feature, branches included. Use this as a guide when building your own value stream maps.',
        industry: 'Automotive',
        product: 'Front Seat Assembly — Model X',
        customer: 'OEM Assembly Plant',
        supplier: 'Foam & Fabric Tier-2',
        demand: 240,
        working_hours: 8,
        available_time_sec: 28800,
        takt_time: 120,
        shifts: 1,
        state: 'current',
      })
      .select()
      .single()

    if (projErr) throw projErr
    const pid = project.id

    // ── Helper ────────────────────────────────────────────────────────────────
    async function addStep(pos: number, fields: any) {
      const { data, error } = await supabase
        .from('steps')
        .insert({ project_id: pid, user_id: user.id, position: pos, is_main_flow: true, ...fields })
        .select().single()
      if (error) throw error
      return data
    }

    async function addBranchStep(pos: number, branchId: string, fields: any) {
      const { data, error } = await supabase
        .from('steps')
        .insert({ project_id: pid, user_id: user.id, position: pos, is_main_flow: false, branch_id: branchId, ...fields })
        .select().single()
      if (error) throw error
      return data
    }

    async function addTool(stepId: string, tool: string, data: any) {
      await supabase.from('tool_data').insert({
        step_id: stepId, project_id: pid, user_id: user.id,
        tool, data, saved_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      })
    }

    // ── 2. Main flow steps ────────────────────────────────────────────────────
    const s1 = await addStep(0, {
      name: 'Material Staging',
      department: 'Materials',
      operators: 1, cycle_time: 45, wait_time: 300, wip: 12,
      flow_type: 'push', uptime: 100, defect_rate: 0,
      va_type: 'nnva',
      notes: 'Operator walks 40m round trip to warehouse. Motion waste identified — shadow board being added.',
      op_steps: [
        { id: 'ms1', name: 'Scan inbound pallet', time: 8, va_type: 'nnva' },
        { id: 'ms2', name: 'Walk to warehouse pick face', time: 18, va_type: 'nva' },
        { id: 'ms3', name: 'Pull components to line side', time: 12, va_type: 'nnva' },
        { id: 'ms4', name: 'Log into system', time: 7, va_type: 'nva' },
      ],
    })

    const s2 = await addStep(1, {
      name: 'Frame Sub-Assembly',
      department: 'Sub-Asm',
      operators: 2, cycle_time: 98, wait_time: 60, wip: 6,
      flow_type: 'push', uptime: 92, defect_rate: 1.2,
      va_type: 'va',
      notes: 'Key operation. CT target 90s after kaizen. Bottleneck risk if upstream delays.',
      op_steps: [
        { id: 'fa1', name: 'Position frame in jig', time: 12, va_type: 'va' },
        { id: 'fa2', name: 'Torque 4x M8 bolts', time: 24, va_type: 'va' },
        { id: 'fa3', name: 'Install seat rail LH', time: 18, va_type: 'va' },
        { id: 'fa4', name: 'Install seat rail RH', time: 18, va_type: 'va' },
        { id: 'fa5', name: 'Visual check alignment', time: 14, va_type: 'nnva' },
        { id: 'fa6', name: 'Reach for torque wrench from cart', time: 12, va_type: 'nva' },
      ],
    })

    const s3 = await addStep(2, {
      name: 'Foam & Fabric Install',
      department: 'Trim',
      operators: 2, cycle_time: 145, wait_time: 90, wip: 8,
      flow_type: 'push', uptime: 88, defect_rate: 2.1,
      va_type: 'va',
      notes: 'BOTTLENECK — CT 145s exceeds takt 120s. NVA: operator walks to foam rack (16s). Kaizen event KZ-003 in progress.',
      op_steps: [
        { id: 'ff1', name: 'Retrieve foam cushion from rack', time: 16, va_type: 'nva' },
        { id: 'ff2', name: 'Position foam on frame', time: 18, va_type: 'va' },
        { id: 'ff3', name: 'Pull fabric cover over cushion', time: 28, va_type: 'va' },
        { id: 'ff4', name: 'Clip 8 retention clips', time: 32, va_type: 'va' },
        { id: 'ff5', name: 'Smooth fabric & visual QC', time: 20, va_type: 'nnva' },
        { id: 'ff6', name: 'Wait for partner to complete LH side', time: 18, va_type: 'nva' },
        { id: 'ff7', name: 'Mutual check & sign-off', time: 13, va_type: 'nnva' },
      ],
    })

    const s4 = await addStep(3, {
      name: 'Electrical Integration',
      department: 'Electrical',
      operators: 1, cycle_time: 88, wait_time: 45, wip: 4,
      flow_type: 'fifo', uptime: 95, defect_rate: 0.8,
      va_type: 'va',
      notes: 'Harness sub-assembly feeds from Branch A. FIFO lane max 5 units between stations.',
      op_steps: [
        { id: 'ei1', name: 'Retrieve harness from FIFO lane', time: 6, va_type: 'nnva' },
        { id: 'ei2', name: 'Route harness under frame', time: 22, va_type: 'va' },
        { id: 'ei3', name: 'Connect 3x connectors', time: 18, va_type: 'va' },
        { id: 'ei4', name: 'Clip harness to 6 retention points', time: 20, va_type: 'va' },
        { id: 'ei5', name: 'Function test seat motors', time: 14, va_type: 'nnva' },
        { id: 'ei6', name: 'Record test result', time: 8, va_type: 'nva' },
      ],
    })

    const s5 = await addStep(4, {
      name: 'Final QC & Audit',
      department: 'Quality',
      operators: 1, cycle_time: 72, wait_time: 120, wip: 5,
      flow_type: 'push', uptime: 100, defect_rate: 0.3,
      va_type: 'nnva',
      notes: 'In-station audit per IATF 16949 §8.6.1. Target: eliminate rework loop through poka-yoke upstream.',
      op_steps: [
        { id: 'qc1', name: 'Torque audit 6x critical bolts', time: 22, va_type: 'nnva' },
        { id: 'qc2', name: 'Electrical function re-test', time: 12, va_type: 'nnva' },
        { id: 'qc3', name: 'Visual audit to standard work sheet', time: 18, va_type: 'nnva' },
        { id: 'qc4', name: 'Label and scan QR code', time: 8, va_type: 'nnva' },
        { id: 'qc5', name: 'Log in MES system', time: 12, va_type: 'nva' },
      ],
    })

    const s6 = await addStep(5, {
      name: 'Packing & Dispatch',
      department: 'Logistics',
      operators: 1, cycle_time: 55, wait_time: 180, wip: 15,
      flow_type: 'push', uptime: 100, defect_rate: 0,
      va_type: 'nnva',
      notes: 'High WIP due to timed OEM collection runs every 2 hours. FIFO to dispatch bay maintained.',
      op_steps: [
        { id: 'pk1', name: 'Place seat in A-frame carrier', time: 18, va_type: 'nnva' },
        { id: 'pk2', name: 'Apply protective wrap', time: 14, va_type: 'nnva' },
        { id: 'pk3', name: 'Attach shipping label', time: 8, va_type: 'nnva' },
        { id: 'pk4', name: 'Move to dispatch bay', time: 15, va_type: 'nva' },
      ],
    })

    // ── 3. Tool data — Time Studies ───────────────────────────────────────────
    await addTool(s1.id, 'stopwatch', {
      baseline: 50, target: 35, mean: 45,
      laps: [44, 46, 45, 43, 48, 45, 44, 46, 45, 47],
      excluded: [],
      notes: 'Measured over 10 cycles. High variation due to walk distance. Poka-yoke / point-of-use storage being designed.',
    })

    await addTool(s2.id, 'stopwatch', {
      baseline: 110, target: 90, mean: 98,
      laps: [100, 96, 98, 102, 95, 98, 100, 97, 99, 95],
      excluded: [],
      notes: '10 observations. Consistent. CT within takt. Target 90s once NVA removed.',
    })

    await addTool(s3.id, 'stopwatch', {
      baseline: 160, target: 110, mean: 145,
      laps: [142, 148, 145, 150, 143, 146, 144, 149, 145, 147],
      excluded: [],
      notes: 'BOTTLENECK. CT 145s > Takt 120s. Primary kaizen target. 16s NVA walk already identified.',
    })

    await addTool(s4.id, 'stopwatch', {
      baseline: 95, target: 80, mean: 88,
      laps: [86, 90, 88, 87, 89, 88, 90, 86, 88, 88],
      excluded: [],
      notes: 'Stable process. Target 80s by moving harness routing task to sub-assembly branch.',
    })

    // ── 4. Tool data — Fishbone (on bottleneck step) ──────────────────────────
    await addTool(s3.id, 'ishikawa', {
      problem: 'Foam & Fabric Install cycle time 145s exceeds takt 120s — causing 3 seats/shift shortfall',
      framework: '6m',
      causes: {
        Machine:     ['No powered assist for foam cover pull', 'Jig does not hold fabric taut'],
        Method:      ['Foam rack located 4m from workstation', 'Two-operator mutual check adds 13s', 'No standard sequence documented'],
        Material:    ['Fabric cover too tight on winter batches (dimensional variation)', 'Foam density variation affects clip engagement force'],
        Manpower:    ['New operators take 20% longer — no standard work sheet', 'LH/RH operators must coordinate — creates waiting waste'],
        Measurement: ['No in-process CT tracking — only end-of-shift review'],
        'Mother Nature': ['Cold ambient temp increases foam stiffness in winter months'],
      },
    })

    // ── 5. Tool data — 5 Why ─────────────────────────────────────────────────
    await addTool(s3.id, 'fivewhy', {
      problem: 'Foam & Fabric Install CT of 145s is 25s over takt time',
      whys: [
        { q: 'Why is cycle time 25s over takt?',                              a: 'Operator walks 4m round trip to foam rack every cycle (16s) and waits 13s for partner to complete LH side.' },
        { q: 'Why is the foam rack 4m away?',                                 a: 'The line was laid out 3 years ago when the product mix was different. Foam was less frequently used. Location was never updated.' },
        { q: 'Why was the location never updated when product mix changed?',   a: 'No formal process exists to review line-side storage locations when takt time changes or product mix changes.' },
        { q: 'Why is there no formal line layout review process?',             a: 'Manufacturing Engineering owns the layout but is not part of the takt-time review cycle. No standard for material location distance limits.' },
        { q: 'Why is Manufacturing Engineering excluded from takt reviews?',   a: 'Root cause: the PFMEA review gate does not require a material flow review. This is a gap in the engineering standard.' },
      ],
      rootCause: 'The PFMEA review gate does not mandate a material flow review when takt time is revised — so foam rack was never relocated when CT/takt ratio changed.',
      countermeasure: 'Update PFMEA review procedure to include a mandatory material flow audit. Relocate foam rack to within 0.5m of workstation immediately as interim fix. Add line-side foam buffer for 2-hour replenishment cycle.',
      owner: 'Manufacturing Engineering',
      dueDate: '2026-04-15',
    })

    // ── 6. Tool data — Waste ID ───────────────────────────────────────────────
    await addTool(s3.id, 'waste', {
      wastes: {
        Motion:           'Operator walks 4m round trip to foam rack every cycle (16s NVA)',
        Waiting:          'Operator waits 13s for partner to complete LH side before mutual check',
        'Over-processing':'Dual mutual check adds 13s — single check with poka-yoke would suffice',
        Defects:          '2.1% defect rate — fabric mis-clip requires rework averaging 8 min per occurrence',
      },
      notes: 'Top priority: Motion waste (foam rack relocation). Waiting waste can be eliminated by improved work-sharing balance via Yamazumi analysis.',
    })

    await addTool(s1.id, 'waste', {
      wastes: {
        Motion:    'Walk 40m round trip to warehouse each cycle',
        Transport: 'Manual pallet movement — no automated line replenishment',
        Waiting:   '300s average queue wait before staging begins',
      },
      notes: 'Point-of-use shadow board and kanban replenishment system planned for Q2 2026.',
    })

    // ── 7. Tool data — Kaizen events ─────────────────────────────────────────
    await addTool(s3.id, 'kaizen', {
      items: [
        {
          id: 'kz001', kzId: 'KZ-001', title: 'Relocate foam rack to point of use',
          description: 'Move foam cushion rack from 4m distance to within 0.5m of workstation. Install shadow board. Expected saving: 16s NVA per cycle.',
          category: 'Productivity', priority: 'critical', status: 'in-progress',
          owner: 'J. Patel', dueDate: '2026-04-01',
          actions: ['Measure and mark new foam rack location', 'Arrange rack relocation with facilities', 'Update standard work sheet', 'Time study before and after'],
          created: Date.now() - 604800000,
        },
        {
          id: 'kz002', kzId: 'KZ-002', title: 'Poka-yoke fabric clip alignment',
          description: 'Design jig guide pins to locate fabric clips automatically. Eliminates need for mutual visual check (13s NNVA). Quality will be built in.',
          category: 'Quality', priority: 'high', status: 'open',
          owner: 'S. Ahmed', dueDate: '2026-05-01',
          actions: ['Raise ECR with tooling engineering', 'Prototype guide pin design', 'Validate with 30-cycle trial'],
          created: Date.now() - 259200000,
        },
        {
          id: 'kz003', kzId: 'KZ-003', title: 'Standard Work Sheet for new operators',
          description: 'No Standard Work Sheet exists for Foam & Fabric Install. New operators take 20% longer. Create SWS with photos, VA/NNVA/NVA classification and operator task breakdown.',
          category: 'Morale', priority: 'medium', status: 'complete',
          owner: 'Team Leader',  dueDate: '2026-03-15',
          actions: ['Complete Operator Steps breakdown in VeSiMy', 'Print and laminate at workstation', 'Train all 4 operators on new SWS'],
          created: Date.now() - 1209600000,
        },
      ],
    })

    await addTool(s5.id, 'kaizen', {
      items: [
        {
          id: 'kz004', kzId: 'KZ-004', title: 'Eliminate MES system logging — use barcode scan only',
          description: 'Manual MES entry (12s NVA) can be replaced with automatic scan-to-pass. IT approval received. Implementation scheduled.',
          category: 'Productivity', priority: 'medium', status: 'open',
          owner: 'IT / Quality', dueDate: '2026-06-01',
          actions: ['Configure MES auto-close on scan', 'UAT with quality team'],
          created: Date.now() - 172800000,
        },
      ],
    })

    // ── 8. Tool data — Improvement goals ────────────────────────────────────
    await addTool(s3.id, 'improvement', {
      goals: [
        { id: 'imp1', metric: 'Cycle Time', baseline: 145, target: 110, actual: null, unit: 'seconds', status: 'in-progress', owner: 'J. Patel', dueDate: '2026-05-01', notes: 'Post foam-rack relocation + poka-yoke installation' },
        { id: 'imp2', metric: 'Defect Rate', baseline: 2.1, target: 0.5, actual: null, unit: '%', status: 'in-progress', owner: 'S. Ahmed', dueDate: '2026-05-01', notes: 'Clip alignment poka-yoke expected to eliminate 80% of defects' },
      ],
    })

    await addTool(s1.id, 'improvement', {
      goals: [
        { id: 'imp3', metric: 'Cycle Time', baseline: 50, target: 32, actual: null, unit: 'seconds', status: 'open', owner: 'Materials Team', dueDate: '2026-06-01', notes: 'Point-of-use foam storage + kanban replenishment' },
      ],
    })

    // ── 9. Branches ───────────────────────────────────────────────────────────
    // Branch A: Electrical Harness Sub-Assembly
    const branchAId = `branch-${Date.now()}-a`
    await supabase.from('branches').insert({
      project_id: pid, user_id: user.id, branch_id: branchAId,
      label: 'Branch A — Electrical Harness Sub-Asm', color: '#6426A0',
      parent_step_id: s2.id, merge_step_id: s4.id, position: 0,
    })

    const b1 = await addBranchStep(0, branchAId, {
      name: 'Harness Cut & Strip',
      department: 'Electrical',
      operators: 1, cycle_time: 38, wait_time: 20, wip: 3,
      flow_type: 'push', uptime: 100,
      va_type: 'va',
      op_steps: [
        { id: 'hc1', name: 'Load wire spool', time: 6, va_type: 'nnva' },
        { id: 'hc2', name: 'Auto-cut to length', time: 14, va_type: 'va' },
        { id: 'hc3', name: 'Strip 4 terminations', time: 12, va_type: 'va' },
        { id: 'hc4', name: 'Label each wire', time: 6, va_type: 'nnva' },
      ],
    })

    const b2 = await addBranchStep(1, branchAId, {
      name: 'Connector Crimping',
      department: 'Electrical',
      operators: 1, cycle_time: 52, wait_time: 15, wip: 2,
      flow_type: 'push', uptime: 94, defect_rate: 0.5,
      va_type: 'va',
      op_steps: [
        { id: 'cr1', name: 'Load terminal in crimping tool', time: 8, va_type: 'va' },
        { id: 'cr2', name: 'Crimp 6 terminals', time: 30, va_type: 'va' },
        { id: 'cr3', name: 'Pull-test each crimp', time: 14, va_type: 'nnva' },
      ],
    })

    const b3 = await addBranchStep(2, branchAId, {
      name: 'Harness Assembly & Test',
      department: 'Electrical',
      operators: 1, cycle_time: 44, wait_time: 10, wip: 2,
      flow_type: 'fifo', uptime: 98,
      va_type: 'va',
      op_steps: [
        { id: 'ha1', name: 'Route wires into protective sleeve', time: 16, va_type: 'va' },
        { id: 'ha2', name: 'Fit connectors to housing', time: 14, va_type: 'va' },
        { id: 'ha3', name: 'Continuity test on fixture', time: 10, va_type: 'nnva' },
        { id: 'ha4', name: 'Place in FIFO output lane', time: 4, va_type: 'nnva' },
      ],
    })

    await addTool(b3.id, 'kaizen', {
      items: [{
        id: 'kzb1', kzId: 'KZ-005', title: 'Combine Harness Assembly & Test into single station',
        description: 'Two separate operations can be merged. Test fixture can be integrated into assembly jig. Expected CT reduction from 44s to 32s.',
        category: 'Productivity', priority: 'medium', status: 'open',
        owner: 'Electrical Team Lead', dueDate: '2026-07-01',
        actions: ['Design integrated jig', 'Approve with Quality', 'Trial on 1 shift'],
        created: Date.now() - 86400000,
      }],
    })

    // Branch B: Foam Preparation Sub-Assembly
    const branchBId = `branch-${Date.now() + 1}-b`
    await supabase.from('branches').insert({
      project_id: pid, user_id: user.id, branch_id: branchBId,
      label: 'Branch B — Foam Prep & Pre-Cut', color: '#1090D4',
      parent_step_id: s1.id, merge_step_id: s3.id, position: 1,
    })

    const b4 = await addBranchStep(0, branchBId, {
      name: 'Foam Pre-Cut',
      department: 'Materials',
      operators: 1, cycle_time: 35, wait_time: 180, wip: 8,
      flow_type: 'push', uptime: 100,
      va_type: 'va',
      op_steps: [
        { id: 'fp1', name: 'Load foam block onto cutter', time: 10, va_type: 'nnva' },
        { id: 'fp2', name: 'Auto-cut profile', time: 18, va_type: 'va' },
        { id: 'fp3', name: 'Visual dimension check', time: 7, va_type: 'nnva' },
      ],
    })

    const b5 = await addBranchStep(1, branchBId, {
      name: 'Fabric Pre-Stage',
      department: 'Trim',
      operators: 1, cycle_time: 28, wait_time: 60, wip: 6,
      flow_type: 'supermarket', uptime: 100, sm_min: 4, sm_max: 10,
      va_type: 'nnva',
      op_steps: [
        { id: 'fs1', name: 'Pull fabric roll from storage', time: 10, va_type: 'nva' },
        { id: 'fs2', name: 'Cut to pattern', time: 14, va_type: 'va' },
        { id: 'fs3', name: 'Place in supermarket (max 10)', time: 4, va_type: 'nnva' },
      ],
    })

    // ── 10. Return project id ─────────────────────────────────────────────────
    return NextResponse.json({ id: pid, already_exists: false })

  } catch (err: any) {
    console.error('[seed-reference]', err)
    return NextResponse.json({ error: err?.message || 'Failed to create reference project' }, { status: 500 })
  }
}
