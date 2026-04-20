// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── app/api/projects/seed-winery/route.ts ─────────────────────────────────────
// Boutique Winery — Annual Production Value Stream
// Harvest & Crush → Destemming → Primary Fermentation → Pressing
// → Malolactic Fermentation → Barrel Ageing (bottleneck) → Blending & QC → Bottling
// Based on a 2,000-case boutique red wine producer

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
      .eq('name', 'Demo — Boutique Winery Production')
      .maybeSingle()

    if (existing?.id) return NextResponse.json({ id: existing.id, already_exists: true })

    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({
        user_id:     user.id,
        name:        'Demo — Boutique Winery Production',
        description: 'Full winery value stream from harvest crush to bottled wine. 8 steps, 18-month lead time, bottleneck at Barrel Ageing. Yield loss, label compliance, and DTC channel waste analysis included.',
        industry:    'Food & Beverage',
        customer:    'DTC Wine Club & Wholesale',
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

    // ── Steps — cycle times in hours, waits in hours ───────────────────────────
    // Takt: 2,000 cases/year. Lead time: ~18 months crush to bottle for reds.

    const s1 = await step(0, {
      name: 'Harvest & Vineyard Receiving', department: 'Cellar / Vineyard',
      operators: 4, cycle_time: 480, wait_time: 24, wip: 3,
      flow_type: 'push', uptime: 100, defect_rate: 8,
      notes: 'VA. 2-week harvest window. Fruit sorted on belt — 8% of fruit rejected (sun damage, under-ripe clusters). Night harvest adds quality but limits equipment availability. Timing driven by Brix, pH, and TA targets.',
    })

    const s2 = await step(1, {
      name: 'Destemming, Crush & SO₂ Addition', department: 'Cellar',
      operators: 2, cycle_time: 120, wait_time: 2, wip: 2,
      flow_type: 'push', uptime: 97, defect_rate: 2,
      notes: 'VA. Destemmmer-crusher uptime 97%. SO₂ addition calculated by lot. 2% of lots require re-press due to incorrect SO₂ dosage — measurement error. Cold soak 48-72 hrs for premium lots.',
    })

    const s3 = await step(2, {
      name: 'Primary Alcoholic Fermentation', department: 'Cellar',
      operators: 1, cycle_time: 480, wait_time: 0, wip: 8,
      flow_type: 'push', uptime: 100, defect_rate: 5,
      notes: 'VA. 7-20 days depending on yeast strain and style. Pump-overs 2x daily for first 7 days. 5% of tanks develop H₂S or other off-aromas requiring copper fining or extended maceration.',
    })

    const s4 = await step(3, {
      name: 'Pressing & Free-Run Separation', department: 'Cellar',
      operators: 2, cycle_time: 180, wait_time: 12, wip: 4,
      flow_type: 'push', uptime: 95, defect_rate: 3,
      notes: 'VA. Bladder press uptime 95%. Free-run separated from press fractions. 3% of lots blended incorrectly — free-run and press wine mixed unintentionally. Quality tracking by lot essential.',
    })

    const s5 = await step(4, {
      name: 'Malolactic Fermentation', department: 'Cellar',
      operators: 1, cycle_time: 1440, wait_time: 0, wip: 6,
      flow_type: 'push', uptime: 100, defect_rate: 8,
      notes: 'VA. 30-60 days for full ML completion. 8% of lots have incomplete ML at bottling — creates instability and potential for continued fermentation in bottle. Paper chromatography check often inconclusive.',
    })

    const s6 = await step(5, {
      name: 'Barrel Ageing & Topping', department: 'Cellar',
      operators: 1, cycle_time: 13140, wait_time: 0, wip: 80,
      flow_type: 'push', uptime: 100, defect_rate: 6,
      notes: 'BOTTLENECK. 12-18 months in French oak. 80 barrels in use — capacity constraint for premium programme. 6% of barrels develop TCA (cork taint) or excessive volatile acidity. Topping weekly — 4 hrs/week labour. Barrel cost $1,200 each.',
    })

    const s7 = await step(6, {
      name: 'Blending Trials, Fining & Filtration', department: 'Cellar / QC',
      operators: 2, cycle_time: 240, wait_time: 720, wip: 3,
      flow_type: 'push', uptime: 100, defect_rate: 4,
      notes: 'VA. Blending trial panel 3-4 sessions per vintage. Egg white fining for reds. Sterile filtration before bottling. 4% of final blends require reformulation after QC rejection. 30-day wait for lab analysis results.',
    })

    const s8 = await step(7, {
      name: 'Bottling, Labelling & Warehousing', department: 'Bottling',
      operators: 3, cycle_time: 360, wait_time: 48, wip: 2,
      flow_type: 'push', uptime: 90, defect_rate: 4,
      notes: 'NNVA. Mobile bottling truck — scheduled 4x/year. Uptime 90% (filler head issues). 4% of bottles have label placement errors — rejected before DTC shipment. 48-hr wait for cork/capsule delivery on short notice.',
    })

    // ── Time Studies ──────────────────────────────────────────────────────────
    await tool(s6.id, 'stopwatch', {
      baseline: 17520, target: 12960, mean: 13140,
      laps: [12960, 13920, 12960, 17520, 12960, 13920, 12960, 12960, 13920, 12960],
      excluded: [],
      notes: 'Barrel ageing time in hours. 15-24 months actual range. Target: 15 months for current vintage mix. Extended ageing (20+ months) reduces annual output by 1 vintage cycle.',
    })

    await tool(s3.id, 'stopwatch', {
      baseline: 480, target: 360, mean: 420,
      laps: [360, 480, 420, 480, 360, 480, 420, 360, 480, 360],
      excluded: [],
      notes: 'Primary fermentation active time in hours. Range 5-20 days. Faster with commercial yeast strains. Native/wild ferment adds character but extends to 20+ days.',
    })

    await tool(s8.id, 'stopwatch', {
      baseline: 480, target: 300, mean: 360,
      laps: [300, 360, 420, 480, 300, 360, 300, 420, 360, 300],
      excluded: [],
      notes: 'Bottling run time in hours per 500-case lot. Mobile bottling truck — line speed limited by filler head count. Target 300 hrs (5 days) with 6-head filler upgrade.',
    })

    // ── Fishbone (Barrel Ageing bottleneck) ───────────────────────────────────
    await tool(s6.id, 'ishikawa', {
      problem: 'Barrel programme at capacity — 80 barrels fully committed, limiting premium wine output growth to 0% YoY while DTC demand is growing 18% annually',
      framework: '6m',
      causes: {
        Machine:          ['Cellar space physically limits to 80 barrels under current layout', 'No barrel rotation system — topping done by hand, slow and inconsistent', 'Temperature zones not separated — reserve and standard lots age at same temperature'],
        Method:           ['No barrel replacement schedule — aged barrels used beyond optimal contribution', 'Topping frequency not standardised by variety — some lots topping-insufficient', 'Blending trials not structured — no formal tasting protocol, relies on winemaker judgement'],
        Material:         ['Mix of French, American, and Eastern European oak — inconsistent quality signal', '6% TCA rate from natural cork closures — Diam or synthetic not evaluated', 'Older barrels (4th fill+) contributing little but occupying space'],
        Manpower:         ['Winemaker handles all cellar decisions alone — single point of failure', 'Cellarman covers barrel topping, fermentation, and visitor tours simultaneously'],
        Measurement:      ['No individual barrel tracking — lots tracked as groups only', 'VA and SO₂ checked quarterly — not monthly as best practice recommends'],
        'Mother Nature':  ['Vintage variation: exceptional years produce more fruit than barrel capacity allows', 'Summer heat waves stress barrels without A/C — loss to evaporation (angel\'s share) higher'],
      },
    })

    // ── 5 Why (6% TCA / barrel defect rate) ──────────────────────────────────
    await tool(s6.id, 'fivewhy', {
      problem: '6% of barrels develop TCA (cork taint) or excessive volatile acidity, resulting in wine loss averaging $4,200 per affected barrel',
      whys: [
        { q: 'Why do 6% of barrels develop TCA or high VA?',
          a: 'TCA is introduced through natural cork contact or contaminated wooden barrel staves. High VA develops when barrels are not topped frequently enough and oxygen exposure occurs.' },
        { q: 'Why is topping frequency insufficient on some barrels?',
          a: 'Topping schedule is managed manually from memory. There is no documented topping log or calendar. Some barrels in the back of the cellar are missed for 3-4 weeks.' },
        { q: 'Why is there no documented topping log?',
          a: 'The cellar has no barrel tracking system. Each barrel is identified by chalk marker only — no individual ID or digital record.' },
        { q: 'Why is there no barrel tracking system?',
          a: 'The winery grew from 400 cases to 2,000 cases over 6 years without updating its record-keeping practices. The system that worked at 400 cases has not scaled.' },
        { q: 'Why were practices not updated as the winery scaled?',
          a: 'ROOT CAUSE: No formal operations review process at the winery. Growth decisions are made on quality and sales — but production processes are never systematically reviewed for scalability.' },
      ],
      rootCause: 'No formal operations review as the winery scaled 5x. Barrel tracking, topping logs, and defect monitoring were never systematised. Individual barrel loss goes undetected until blending — by which point the wine is unsalvageable.',
      countermeasure: '1. Assign RFID or QR code to every barrel — scan on each topping. 2. Implement weekly topping log with cellarman sign-off. 3. Monthly SO₂ and VA check per barrel (not per lot). 4. Evaluate Diam or synthetic cork for barrels with repeated TCA history.',
      owner: 'Winemaker / Operations',
      dueDate: '2026-05-31',
    })

    // ── Waste ID ──────────────────────────────────────────────────────────────
    await tool(s6.id, 'waste', {
      wastes: {
        Defects:           '6% barrel defect rate — TCA and high VA. At $1,200 barrel cost + $35/bottle wine value, each affected barrel = $4,200+ loss',
        Waiting:           '18-month ageing creates 18-month cash flow gap — capital tied up in barrels',
        'Over-processing': '4th-fill+ barrels contributing less than 5% flavour but occupying full capacity slot',
        'Non-Utilisation': 'Winemaker expertise underutilised on topping routine — could delegate with tracking system',
      },
      notes: 'Strategic: evaluate reducing ageing time on entry-level tier to 12 months, freeing capacity for reserve programme.',
    })

    await tool(s8.id, 'waste', {
      wastes: {
        Defects:           '4% label placement errors — pre-shipment inspection catches but creates rework and delay',
        Waiting:           '48-hr emergency cork/capsule delivery when stock runs short — mobile bottling truck idle',
        'Over-processing': 'Hand-labelling estate reserve bottles — 3 hrs per 100 bottles',
        Motion:            'Mobile bottling truck requires full cellar rearrangement each visit — 4 hrs setup',
      },
      notes: 'Label error rate driven by applicator calibration drift. Calibrate before every bottling run.',
    })

    // ── Kaizen Events ─────────────────────────────────────────────────────────
    await tool(s6.id, 'kaizen', {
      items: [
        {
          id: 'kz001', kzId: 'KZ-001',
          title: 'Individual barrel tracking — QR code + topping log',
          description: 'Assign QR code to every barrel. Cellarman scans on each topping — logs date, SO₂ addition, visual inspection. Weekly report flags any barrel not topped in 10+ days. Target: TCA/VA rate from 6% to under 1%.',
          category: 'Quality', priority: 'critical', status: 'in-progress',
          owner: 'Winemaker', dueDate: '2026-04-01',
          actions: ['Print QR codes, attach to all 80 barrels', 'Set up Google Sheet or Vintrace log', 'Train cellarman on scan protocol', 'First monthly VA and SO₂ check'],
          created: Date.now() - 604800000,
        },
        {
          id: 'kz002', kzId: 'KZ-002',
          title: 'Retire 4th-fill+ barrels — reallocate to entry tier or sell',
          description: '18 barrels (22% of programme) are 4th fill or older. Contributing minimal flavour. Retire after current vintage, sell to spirits producers or home winemakers. Frees capacity for new premium oak.',
          category: 'Productivity', priority: 'high', status: 'open',
          owner: 'Winemaker', dueDate: '2026-08-01',
          actions: ['Audit all barrels by fill count', 'Identify 4th fill+ group', 'List on winery barrel marketplace', 'Allocate replacement budget to 1st-fill French oak'],
          created: Date.now() - 259200000,
        },
        {
          id: 'kz003', kzId: 'KZ-003',
          title: 'Label applicator calibration — pre-run protocol',
          description: 'Label placement errors (4%) driven by applicator drift between bottling runs. Calibrate before every run using test bottles. Target: under 0.5% error rate.',
          category: 'Quality', priority: 'medium', status: 'open',
          owner: 'Bottling Crew Lead', dueDate: '2026-05-01',
          actions: ['Create calibration checklist', 'Run 20-bottle calibration test before each lot', 'Log placement measurements', 'Adjust if >1mm deviation'],
          created: Date.now() - 172800000,
        },
        {
          id: 'kz004', kzId: 'KZ-004',
          title: 'DTC inventory buffer — 90-day safety stock before release',
          description: 'Wine club releases currently timed to bottling completion — no buffer. If bottling delayed, club shipment delayed. Build 90-day safety stock before release date to absorb bottling variability.',
          category: 'Productivity', priority: 'medium', status: 'open',
          owner: 'DTC Manager', dueDate: '2026-06-01',
          actions: ['Calculate DTC shipment volume by quarter', 'Schedule bottling 90 days before each club release', 'Update 2026 production calendar'],
          created: Date.now() - 86400000,
        },
      ],
    })

    // ── Improvement Goals ─────────────────────────────────────────────────────
    await tool(s6.id, 'improvement', {
      goals: [
        { id: 'g1', metric: 'Barrel Defect Rate', baseline: 6, target: 1, actual: null, unit: '%',
          status: 'in-progress', owner: 'Winemaker', dueDate: '2026-12-01',
          notes: 'QR tracking + monthly SO₂/VA monitoring expected to achieve under 1%' },
        { id: 'g2', metric: 'Premium Barrel Capacity', baseline: 80, target: 100, actual: null, unit: 'barrels',
          status: 'open', owner: 'Winemaker', dueDate: '2026-10-01',
          notes: 'Retiring 18 4th-fill+ barrels + purchasing 38 new 1st-fill barrels = net +20 premium slots' },
      ],
    })

    await tool(s8.id, 'improvement', {
      goals: [
        { id: 'g3', metric: 'Label Error Rate', baseline: 4, target: 0.5, actual: null, unit: '%',
          status: 'open', owner: 'Bottling Crew Lead', dueDate: '2026-05-01',
          notes: 'Pre-run calibration protocol expected to achieve under 0.5%' },
      ],
    })

    return NextResponse.json({ id: pid, already_exists: false })

  } catch (err: any) {
    console.error('[seed-winery]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
