// @ts-nocheck
// ── app/api/projects/seed-realestate/route.ts ─────────────────────────────────
// Creates a fully-populated Real Estate demo project.
// Value stream: Lead Inquiry → Qualify → Property Search → Offer → Inspection
//              → Financing & Underwriting (bottleneck) → Closing
// All 9 CI tools populated with real estate data.

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
      .eq('name', 'Demo — Real Estate Transaction Flow')
      .maybeSingle()

    if (existing?.id) return NextResponse.json({ id: existing.id, already_exists: true })

    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({
        user_id:     user.id,
        name:        'Demo — Real Estate Transaction Flow',
        description: 'Full value stream from lead inquiry to closing. 7 steps, 45-day lead time, bottleneck at Financing & Underwriting. All CI tools populated. Use as a guide for mapping your own process.',
        industry:    'Real Estate',
        customer:    'Home Buyer',
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
    const s1 = await step(0, {
      name: 'Lead Inquiry & Initial Response', department: 'Sales',
      operators: 1, cycle_time: 25, wait_time: 480, wip: 12,
      flow_type: 'push', uptime: 100, defect_rate: 0,
      notes: 'NNVA. Avg 8hr response time — industry best practice is under 5 min. 12 leads in queue at any time. Response time is the #1 conversion driver.',
    })

    const s2 = await step(1, {
      name: 'Qualify & Buyer Consultation', department: 'Sales',
      operators: 1, cycle_time: 90, wait_time: 2880, wip: 6,
      flow_type: 'push', uptime: 100, defect_rate: 15,
      notes: 'VA. Pre-approval discussion, needs analysis, area and budget alignment. 15% of leads are unqualified — pure waste if not screened earlier.',
    })

    const s3 = await step(2, {
      name: 'Property Search & Showings', department: 'Sales',
      operators: 1, cycle_time: 480, wait_time: 1440, wip: 8,
      flow_type: 'push', uptime: 100, defect_rate: 0,
      notes: 'VA. Average buyer views 10 properties. Key waste: showing properties that don\'t match criteria due to poor initial qualification.',
    })

    const s4 = await step(3, {
      name: 'Offer Preparation & Negotiation', department: 'Sales',
      operators: 1, cycle_time: 120, wait_time: 2880, wip: 4,
      flow_type: 'push', uptime: 100, defect_rate: 35,
      notes: 'VA. 35% of first offers rejected — rework loop. Average 1.8 rounds of negotiation. Each round = 2-day wait. Counter-offer is a defect in this process.',
    })

    const s5 = await step(4, {
      name: 'Inspection & Appraisal', department: 'Operations',
      operators: 1, cycle_time: 240, wait_time: 7200, wip: 3,
      flow_type: 'push', uptime: 100, defect_rate: 22,
      notes: 'NNVA. 5-day scheduling wait for inspector and appraiser. 22% of inspections trigger renegotiation. Appraiser backlog is a system constraint.',
    })

    const s6 = await step(5, {
      name: 'Financing & Underwriting', department: 'Lender Liaison',
      operators: 1, cycle_time: 600, wait_time: 14400, wip: 5,
      flow_type: 'push', uptime: 100, defect_rate: 28,
      notes: 'BOTTLENECK. 10-day lender wait. 28% of files kicked back for missing docs — rework adds 3-5 days. This single step determines whether deals close on time.',
    })

    const s7 = await step(6, {
      name: 'Closing & Handover', department: 'Operations',
      operators: 1, cycle_time: 180, wait_time: 2880, wip: 3,
      flow_type: 'push', uptime: 100, defect_rate: 5,
      notes: 'NNVA. Title search, deed prep, final walk-through, funds transfer. 5% fall-through at closing due to last-minute financing issues from Step 6.',
    })

    // ── Time Studies ──────────────────────────────────────────────────────────
    await tool(s1.id, 'stopwatch', {
      baseline: 480, target: 5, mean: 287,
      laps: [120, 480, 240, 60, 720, 480, 120, 240, 480, 180], excluded: [],
      notes: 'Response time in minutes. Massive variation — 2 min to 12 hr. Industry data: contact within 5 min = 9x higher conversion rate.',
    })

    await tool(s6.id, 'stopwatch', {
      baseline: 21600, target: 7200, mean: 14400,
      laps: [10080, 14400, 21600, 10080, 18000, 14400, 14400, 10080, 21600, 14400], excluded: [],
      notes: 'Total lender processing time in minutes. 7-15 business days. Target: 5 days with pre-underwriting. Variation driven by document completeness at submission.',
    })

    await tool(s4.id, 'stopwatch', {
      baseline: 5760, target: 2880, mean: 4320,
      laps: [2880, 5760, 2880, 8640, 2880, 4320, 2880, 5760, 4320, 2880], excluded: [],
      notes: 'Total negotiation cycle in minutes. High variation. Multiple counter-offer rounds extend this step significantly.',
    })

    // ── Fishbone ──────────────────────────────────────────────────────────────
    await tool(s6.id, 'ishikawa', {
      problem: 'Financing & Underwriting averages 10 business days — 30% of deals miss target close date',
      framework: '6m',
      causes: {
        Machine:          ['Lender portal times out on large uploads', 'No automated file completeness check before submission'],
        Method:           ['Documents collected piecemeal — no complete package at submission', '28% of files kicked back — no pre-submission checklist', 'Agent sends file before buyer docs are ready'],
        Material:         ['Buyers unprepared — missing tax returns, bank statements, pay stubs', 'Self-employed buyers need 2yr P&L — rarely ready at offer stage'],
        Manpower:         ['Agent not trained on lender documentation requirements per loan type', 'Lender underwriter backlog — 3 underwriters handling 200 files'],
        Measurement:      ['No tracking of submission-to-approval time per lender', 'Agent has no visibility into queue position'],
        'Mother Nature':  ['Rate lock expiry creates pressure and errors', 'End-of-month volume spikes delay lender processing 3-5 days'],
      },
    })

    // ── 5 Why ─────────────────────────────────────────────────────────────────
    await tool(s6.id, 'fivewhy', {
      problem: '28% of financing files kicked back by lender for missing documents — adds 3-5 days per transaction',
      whys: [
        { q: 'Why are 28% of files kicked back?',
          a: 'Files submitted before all required documents collected and verified for completeness.' },
        { q: 'Why are files submitted before complete?',
          a: 'No standardised pre-submission checklist exists. Each agent assembles files differently.' },
        { q: 'Why is there no standardised checklist?',
          a: 'Lender requirements vary by loan type (conventional, FHA, VA, jumbo) and no master checklist has been built per type.' },
        { q: 'Why has no master checklist been created?',
          a: 'No formal process owner for transaction coordination workflows exists at the brokerage.' },
        { q: 'Why is there no process owner for transaction coordination?',
          a: 'ROOT CAUSE: The brokerage treats every transaction as one-off agent work rather than a standardised repeatable process. No standard work exists.' },
      ],
      rootCause: 'No standard work or loan-type document checklist for the transaction coordinator role. Each agent reinvents the process — creating inconsistent, incomplete submissions.',
      countermeasure: '1. Create loan-type document checklists (conventional, FHA, VA, jumbo). 2. Mandatory pre-submission review before file goes to lender. 3. Assign Transaction Coordinator role with defined SOP. 4. Track kickback rate weekly.',
      owner: 'Broker / Operations Manager',
      dueDate: '2026-04-30',
    })

    // ── Waste ID ──────────────────────────────────────────────────────────────
    await tool(s6.id, 'waste', {
      wastes: {
        Defects:           '28% of files kicked back — document rework adds avg 3.5 days',
        Waiting:           '10-day lender processing wait with zero visibility into queue position',
        'Over-processing': 'Agent re-collects docs already submitted — no single file source of truth',
        'Non-Utilisation': 'TC capacity underused — agents doing file assembly TC should own',
      },
      notes: 'Primary target: eliminate 28% kickback rate through document standardisation.',
    })

    await tool(s1.id, 'waste', {
      wastes: {
        Waiting:   '8-hour average response time. Leads go cold after 30 min — conversion drops 90%.',
        Defects:   'Unqualified leads accepted into pipeline — 15% wasted showing to non-buyers.',
        Motion:    'Agent manually checking multiple inboxes — no unified lead routing.',
      },
      notes: 'Quick win: automated lead routing with 5-min response target. Conversion rate 3% → 8% with no extra spend.',
    })

    // ── Kaizen Events ─────────────────────────────────────────────────────────
    await tool(s6.id, 'kaizen', {
      items: [
        {
          id: 'kz001', kzId: 'KZ-001',
          title: 'Create loan-type document checklists',
          description: 'Build pre-submission checklists for conventional, FHA, VA, and jumbo loans. Mandatory sign-off before file goes to lender. Target: kickback rate from 28% to under 5%.',
          category: 'Quality', priority: 'critical', status: 'in-progress',
          owner: 'Operations Manager', dueDate: '2026-04-15',
          actions: ['Interview top 3 lenders for doc requirements per loan type', 'Build checklist in transaction system', 'Train all agents', 'Track kickback rate weekly'],
          created: Date.now() - 604800000,
        },
        {
          id: 'kz002', kzId: 'KZ-002',
          title: 'Collect buyer documents at consultation — not at offer',
          description: 'Require all buyer documents at qualification stage. Eliminates 3-5 day document chase after offer accepted.',
          category: 'Productivity', priority: 'high', status: 'open',
          owner: 'Lead Agent', dueDate: '2026-05-01',
          actions: ['Update buyer consultation script', 'Create secure upload portal', 'Policy: no offers without complete doc package'],
          created: Date.now() - 259200000,
        },
        {
          id: 'kz003', kzId: 'KZ-003',
          title: 'Automated lead response — 5-minute target',
          description: 'Auto-response with personalised listings within 5 min. Human follow-up within 30 min. Industry data: 9x conversion improvement under 5 min.',
          category: 'Productivity', priority: 'critical', status: 'open',
          owner: 'Broker', dueDate: '2026-04-01',
          actions: ['Configure CRM auto-response workflow', 'Write personalised template', 'Set agent alert for every new lead', 'Track response time weekly'],
          created: Date.now() - 86400000,
        },
      ],
    })

    // ── Improvement Goals ─────────────────────────────────────────────────────
    await tool(s6.id, 'improvement', {
      goals: [
        { id: 'g1', metric: 'Document Kickback Rate', baseline: 28, target: 5, actual: null, unit: '%',
          status: 'in-progress', owner: 'Operations Manager', dueDate: '2026-06-01',
          notes: 'Loan-type checklist + pre-underwriting doc collection expected to drive below 5%' },
        { id: 'g2', metric: 'Lender Processing Time', baseline: 10, target: 7, actual: null, unit: 'business days',
          status: 'open', owner: 'Transaction Coordinator', dueDate: '2026-07-01',
          notes: 'Complete file submission + preferred lender relationships target 7 days' },
      ],
    })

    await tool(s1.id, 'improvement', {
      goals: [{
        id: 'g3', metric: 'Lead Response Time', baseline: 480, target: 5, actual: null, unit: 'minutes',
        status: 'open', owner: 'Broker', dueDate: '2026-04-01',
        notes: 'Automated 5-min response → 9x conversion rate improvement projected',
      }],
    })

    return NextResponse.json({ id: pid, already_exists: false })

  } catch (err: any) {
    console.error('[seed-realestate]', err)
    return NextResponse.json({ error: err?.message || 'Failed to create demo' }, { status: 500 })
  }
}
