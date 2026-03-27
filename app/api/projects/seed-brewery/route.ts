// @ts-nocheck
// ── app/api/projects/seed-brewery/route.ts ────────────────────────────────────
// Craft Brewery — Batch Production Value Stream
// Grain-In → Milling → Mashing → Lautering → Boil & Hop Addition
// → Fermentation (bottleneck) → Conditioning → Packaging & QC
// Based on a 10-barrel craft brewery producing 4 batches/week

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: existing } = await supabase
      .from('projects').select('id')
      .eq('user_id', user.id)
      .eq('name', 'Demo — Craft Brewery Batch Production')
      .maybeSingle()

    if (existing?.id) return NextResponse.json({ id: existing.id, already_exists: true })

    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({
        user_id:     user.id,
        name:        'Demo — Craft Brewery Batch Production',
        description: 'Full brewing value stream from grain delivery to packaged product. 8 steps, 21-day lead time, bottleneck at Fermentation. Taproom throughput and packaging waste analysis included.',
        industry:    'Food & Beverage',
        customer:    'Taproom & Wholesale Accounts',
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

    // ── Steps — cycle times in minutes, waits in minutes ──────────────────────
    // Takt: 1 batch every 2 days (target: 3 batches/week to meet taproom demand)

    const s1 = await step(0, {
      name: 'Grain Receiving & Milling', department: 'Brew Floor',
      operators: 1, cycle_time: 90, wait_time: 1440, wip: 2,
      flow_type: 'push', uptime: 96, defect_rate: 1,
      notes: 'NNVA. Grain delivery twice weekly — creates batch release rather than flow. Mill uptime 96% (bearing replaced Q1). 1% batches with moisture-damaged grain rejected.',
    })

    const s2 = await step(1, {
      name: 'Mashing & Lautering', department: 'Brew Floor',
      operators: 1, cycle_time: 120, wait_time: 30, wip: 1,
      flow_type: 'push', uptime: 99, defect_rate: 3,
      notes: 'VA. Mash temp held 152°F for 60 min. Lauter takes 40-60 min depending on grain bill. 3% batches have stuck sparge — adds 45 min rework. Rye and wheat grists most problematic.',
    })

    const s3 = await step(2, {
      name: 'Boil & Hop Addition', department: 'Brew Floor',
      operators: 1, cycle_time: 75, wait_time: 15, wip: 1,
      flow_type: 'push', uptime: 100, defect_rate: 2,
      notes: 'VA. 60-min boil, 4 hop additions per recipe. 2% batches require hop bill adjustment due to alpha acid variation from supplier. Brewer reviews each lot.',
    })

    const s4 = await step(3, {
      name: 'Whirlpool, Chill & Transfer', department: 'Brew Floor',
      operators: 1, cycle_time: 45, wait_time: 10, wip: 1,
      flow_type: 'push', uptime: 98, defect_rate: 1,
      notes: 'VA. Whirlpool 20 min, chill to 68°F via plate chiller, transfer to fermenter. Glycol chiller uptime 98% — single compressor unit. Backup plan: ice bath (adds 60 min).',
    })

    const s5 = await step(4, {
      name: 'Fermentation', department: 'Cellar',
      operators: 1, cycle_time: 8640, wait_time: 0, wip: 6,
      flow_type: 'push', uptime: 100, defect_rate: 4,
      notes: 'BOTTLENECK. 6-day average active fermentation. Only 6 fermenters — capacity constraint. 4% batches develop off-flavours requiring extended conditioning or blend-down. Limits output to 4 batches/week max.',
    })

    const s6 = await step(5, {
      name: 'Conditioning & Dry Hopping', department: 'Cellar',
      operators: 1, cycle_time: 4320, wait_time: 0, wip: 4,
      flow_type: 'push', uptime: 100, defect_rate: 2,
      notes: 'VA. 3-day cold conditioning at 32°F. Dry hop addition day 1 for IPAs. 2% batches require extended conditioning (up to 7 days) due to haze or attenuation issues.',
    })

    const s7 = await step(6, {
      name: 'QC & Transfer to Bright Tank', department: 'Cellar / QC',
      operators: 1, cycle_time: 60, wait_time: 480, wip: 3,
      flow_type: 'push', uptime: 100, defect_rate: 5,
      notes: 'VA. Gravity check, pH, dissolved oxygen, sensory panel. 5% batches fail sensory — blended, sold as taproom-only, or dumped. 8-hr wait for QC analyst availability on smaller batches.',
    })

    const s8 = await step(7, {
      name: 'Packaging — Can, Keg & Bottle', department: 'Packaging',
      operators: 2, cycle_time: 240, wait_time: 60, wip: 2,
      flow_type: 'push', uptime: 88, defect_rate: 3,
      notes: 'NNVA. Canning line uptime 88% — seamer head issues cause 3% underfill. Keg fill auto, 15 min/keg. Bottle filler runs 2x/month only. 60-min changeover between formats. KZ-001 open.',
    })

    // ── Time Studies ──────────────────────────────────────────────────────────
    await tool(s5.id, 'stopwatch', {
      baseline: 10080, target: 7200, mean: 8640,
      laps: [8640, 7200, 8640, 10080, 8640, 7200, 8640, 10080, 8640, 7200],
      excluded: [],
      notes: 'Fermentation time in minutes. 5-7 days typical. Faster with higher pitch rate and temp control. Target 5 days with optimised yeast management — would unlock 5th batch/week.',
    })

    await tool(s8.id, 'stopwatch', {
      baseline: 360, target: 180, mean: 240,
      laps: [180, 240, 300, 240, 180, 360, 240, 180, 300, 240],
      excluded: [],
      notes: 'Canning run time in minutes per batch. Variation driven by seamer head issues and label changeovers. Target 3 hours with seamer rebuild and pre-staged labels.',
    })

    await tool(s2.id, 'stopwatch', {
      baseline: 165, target: 120, mean: 132,
      laps: [120, 135, 125, 165, 120, 140, 125, 135, 125, 120],
      excluded: [],
      notes: 'Mash + lauter total in minutes. High-end outlier (165 min) = stuck sparge on rye batch. Target 120 min with ricehull addition protocol for high-adjunct recipes.',
    })

    // ── Fishbone (Fermentation capacity bottleneck) ───────────────────────────
    await tool(s5.id, 'ishikawa', {
      problem: 'Fermentation capacity limits output to 4 batches/week — taproom demand requires 5 batches/week peak season',
      framework: '6m',
      causes: {
        Machine:          ['Only 6 fermenters — all occupied during 6-day fermentation', 'No unitank capability — separate fermenter and bright tank required per batch', 'Glycol cooling limited to 6 zones — 7th fermenter would need new manifold'],
        Method:           ['Fermentation schedule not optimised — staggered starts could increase throughput', 'Yeast pitch rate inconsistent — affects lag time and overall fermentation duration', 'No dry yeast backup protocol — single strain failure stops production'],
        Material:         ['Yeast health variable — repitching generation 4+ shows 15% longer fermentation', 'Dissolved oxygen at transfer affects yeast performance', 'Nutrient addition not standardised across all styles'],
        Manpower:         ['1 cellarman covering fermentation monitoring, QC, and packaging', 'No Saturday coverage — fermentation checked once instead of twice on weekends'],
        Measurement:      ['Gravity checked once daily — misses rapid fermentation events overnight', 'No automated temperature logging — relies on manual walk-through'],
        'Mother Nature':  ['Summer ambient temp increases glycol load — compressor struggles over 85°F ambient', 'Seasonal demand spike (May-Sept) exceeds capacity by 25%'],
      },
    })

    // ── 5 Why (stuck sparge rework) ───────────────────────────────────────────
    await tool(s2.id, 'fivewhy', {
      problem: '3% of batches have stuck sparge, adding 45 minutes of rework and causing downstream schedule delay',
      whys: [
        { q: 'Why do batches get stuck sparge?',
          a: 'High-adjunct grain bills (rye, oats, wheat) create a dense grain bed that restricts wort flow through the false bottom.' },
        { q: 'Why do high-adjunct bills restrict flow?',
          a: 'Rice hulls are not being added to these grists. The recipe sheet does not specify rice hull addition.' },
        { q: 'Why don\'t the recipe sheets specify rice hulls?',
          a: 'Recipes were written before the brewery scaled to 10-barrel system. The original 3-barrel system had a different lauter geometry.' },
        { q: 'Why were recipes not updated when equipment changed?',
          a: 'No formal recipe scale-up review process exists. Head brewer carried the adjustment in memory — not documented.' },
        { q: 'Why is the adjustment not documented?',
          a: 'ROOT CAUSE: No standard recipe management system. Recipes are in a shared Google Doc with no version control or equipment-specific parameters.' },
      ],
      rootCause: 'No recipe management system with equipment-specific parameters. High-adjunct adjustments (rice hulls) exist only in the head brewer\'s memory — not in the recipe. When a new brewer runs the batch, stuck sparge occurs.',
      countermeasure: '1. Implement brewing software (Brewfather or BreweryDB) with equipment profiles. 2. Add rice hull requirement to all high-adjunct recipe sheets immediately. 3. Create standard recipe review checklist for any new or scaled recipe.',
      owner: 'Head Brewer',
      dueDate: '2026-04-15',
    })

    // ── Waste ID ──────────────────────────────────────────────────────────────
    await tool(s5.id, 'waste', {
      wastes: {
        Waiting:           'Fermenters fully occupied — new batches wait for tanks to free up',
        Defects:           '4% of batches develop off-flavours — partial volume loss or blend-down required',
        'Non-Utilisation': 'Cellarman monitoring fermentation manually — no automated alerts for gravity or temp deviation',
        Inventory:         'Hop inventory not rotated by alpha acid lot — oldest lot used last, alpha acid degradation',
      },
      notes: 'Priority: fermenter capacity is the constraint. Every other improvement has limited impact until tank count increases or fermentation time decreases.',
    })

    await tool(s8.id, 'waste', {
      wastes: {
        Defects:           '3% underfill on canning line — seamer head inconsistency causes fill variation',
        Waiting:           '60-min format changeover between cans and kegs — no quick-change tooling',
        'Over-processing': 'Label application done manually for small bottle runs — 45 min per batch',
        Inventory:         'Surplus cans from short fills held as taproom pours — not sellable retail',
      },
      notes: 'Canning line rebuild (KZ-001) addresses underfill and changeover simultaneously.',
    })

    // ── Kaizen Events ─────────────────────────────────────────────────────────
    await tool(s8.id, 'kaizen', {
      items: [
        {
          id: 'kz001', kzId: 'KZ-001',
          title: 'Canning line seamer rebuild — eliminate underfill',
          description: 'Seamer head worn — causing 3% underfill rate. Full rebuild with new tooling includes quick-change format kit. Reduces changeover from 60 min to 20 min. Uptime target: 96%.',
          category: 'Quality', priority: 'critical', status: 'in-progress',
          owner: 'Head Brewer / Maintenance', dueDate: '2026-04-01',
          actions: ['Order seamer rebuild kit', 'Schedule 1-day shutdown for rebuild', 'Calibrate and run 50-can test', 'Record fill weights across 200 cans post-rebuild'],
          created: Date.now() - 604800000,
        },
        {
          id: 'kz002', kzId: 'KZ-002',
          title: 'Pre-stage labels and materials before packaging run',
          description: 'Labels, ends, and trays currently retrieved mid-run from storage. Pre-staging cuts 30 min from each packaging shift. Standard: all materials at line before run starts.',
          category: 'Productivity', priority: 'medium', status: 'open',
          owner: 'Packaging Team', dueDate: '2026-05-01',
          actions: ['Create pre-run checklist', 'Assign day-prior staging task', 'Shadow board for line-side storage'],
          created: Date.now() - 172800000,
        },
      ],
    })

    await tool(s5.id, 'kaizen', {
      items: [
        {
          id: 'kz003', kzId: 'KZ-003',
          title: 'Optimise fermentation schedule — staggered starts',
          description: 'Currently all fermenters start Monday and Thursday. Staggering to Mon/Wed/Fri maximises throughput without adding tanks. Modelling shows +0.5 batches/week average.',
          category: 'Productivity', priority: 'high', status: 'open',
          owner: 'Head Brewer', dueDate: '2026-04-15',
          actions: ['Model batch schedule in spreadsheet', 'Adjust brew day calendar', 'Trial 4-week staggered schedule', 'Measure actual batch throughput'],
          created: Date.now() - 259200000,
        },
        {
          id: 'kz004', kzId: 'KZ-004',
          title: 'Automated fermentation monitoring — temp and gravity alerts',
          description: 'Manual walk-through twice daily. Rapid fermentation events overnight go undetected. Tilt hydrometer + Bluetooth temp probes in each tank. Alerts to brewer phone.',
          category: 'Quality', priority: 'medium', status: 'open',
          owner: 'Head Brewer / IT', dueDate: '2026-06-01',
          actions: ['Purchase 6 Tilt Pro hydrometers', 'Set up Brewfather integration', 'Configure alert thresholds per style', 'Train cellarman on alert response'],
          created: Date.now() - 86400000,
        },
      ],
    })

    // ── Improvement Goals ─────────────────────────────────────────────────────
    await tool(s5.id, 'improvement', {
      goals: [
        { id: 'g1', metric: 'Batch Throughput', baseline: 4, target: 5, actual: null, unit: 'batches/week',
          status: 'in-progress', owner: 'Head Brewer', dueDate: '2026-07-01',
          notes: 'Staggered schedule + fermentation optimisation target 5 batches/week peak season' },
        { id: 'g2', metric: 'Off-Flavour Rate', baseline: 4, target: 1, actual: null, unit: '%',
          status: 'open', owner: 'Head Brewer', dueDate: '2026-06-01',
          notes: 'Automated monitoring + yeast health protocol expected to reduce to under 1%' },
      ],
    })

    await tool(s8.id, 'improvement', {
      goals: [
        { id: 'g3', metric: 'Canning Line Uptime', baseline: 88, target: 96, actual: null, unit: '%',
          status: 'in-progress', owner: 'Head Brewer', dueDate: '2026-04-01',
          notes: 'Seamer rebuild expected to achieve 96% uptime and eliminate underfill' },
        { id: 'g4', metric: 'Changeover Time', baseline: 60, target: 20, actual: null, unit: 'minutes',
          status: 'in-progress', owner: 'Packaging Team', dueDate: '2026-04-01',
          notes: 'Quick-change format kit included in seamer rebuild' },
      ],
    })

    return NextResponse.json({ id: pid, already_exists: false })

  } catch (err: any) {
    console.error('[seed-brewery]', err)
    return NextResponse.json({ error: err?.message || 'Failed to create demo' }, { status: 500 })
  }
}
