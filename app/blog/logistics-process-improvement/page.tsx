import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Logistics & Warehousing — VeSiMy',
  description: "Logistics and warehousing operations are process-intensive environments where small improvements compound into major efficiency gains. Here\'s how structured CI tools apply.",
  keywords: ['logistics process improvement', 'warehouse CI', 'lean logistics', 'warehouse waste reduction', 'fulfillment center improvement'],
  openGraph: {
    title: 'Process Improvement in Logistics: Speed Without Structure Is Just Chaos',
    description: 'How VeSiMy helps logistics and warehouse teams eliminate motion, waiting, and process variation at scale.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function LogisticsBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(247,151,30,0.15)', color: '#F7971E', fontFamily: 'monospace', letterSpacing: 1.5 }}>LOGISTICS</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>8 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Speed Without Structure Is Just Chaos: CI in Logistics and Warehousing
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Modern logistics operations are under pressure that would have seemed impossible a decade ago. Two-day delivery has become table stakes. Customers track their orders in real time and escalate within hours of a miss. In this environment, process improvement isn't a lean initiative — it's a survival strategy.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why logistics is a process problem, not a speed problem</h2>
          <p style={{ marginBottom: 18 }}>
            The instinct in logistics is to solve performance gaps with more labor. More pickers, more packers, more drivers. But in most underperforming operations, the constraint isn't labor — it's process. Poorly laid out pick paths, unclear SOPs, informal handoffs between receiving and putaway, and the quiet waste of people walking 40% of their shift to find things that should have been labeled.
          </p>
          <p style={{ marginBottom: 18 }}>
            A warehouse that runs 80 orders per hour isn't necessarily working harder than one that runs 120. It's working with a less efficient process. And that gap is closable without adding a single head.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The wastes that dominate logistics operations</h2>
          {[
            ['Motion — the invisible tax', 'Unnecessary travel is the most visible waste in a warehouse, but it\'s often treated as fixed. Layout-driven pick path optimization, slotting by velocity, and zone design can cut travel distance by 20–40% without changing the building footprint.'],
            ['Waiting at dock interfaces', 'Dock scheduling, trailer positioning, and putaway queue management determine whether a team is productive or standing around. Unmanaged dock interfaces create waiting waste that doesn\'t show up in productivity reports — it just disappears into shift time.'],
            ['Defects from process variation', 'In logistics, a defect is a mis-pick, a mislabel, a short-ship, or a damaged item. Each one costs 5–10x the value of the original order to resolve when you account for customer contact, reshipping, and credit handling. Most pick errors trace to unclear SOPs or label placement variation, not individual mistakes.'],
            ['Over-processing in receiving', 'Receiving teams often perform multiple redundant verification steps on inbound freight — count, verify against PO, enter into WMS, re-count for putaway. Mapping this process often reveals steps that can be eliminated with smarter WMS configuration and supplier compliance programs.'],
            ['Inventory inaccuracy driving search behavior', 'When bin locations don\'t match WMS records, pickers search. Search time is pure waste — and it compounds across every picker on every shift. The root cause is almost always a process failure in cycle count execution or putaway confirmation.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(247,151,30,0.06)', border: '1px solid rgba(247,151,30,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How VeSiMy applies to logistics and warehousing</h2>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Time Study for standard process characterization</h3>
          <p style={{ marginBottom: 18 }}>
            How long does it actually take to pick an order in your operation? Not the engineered standard — the actual time, broken down by element: locate, pick, verify, pack, label, move to consolidation. VeSiMy's Time Study tool gives team leads the ability to answer this question with data from their floor, not an industrial engineering textbook.
          </p>
          <p style={{ marginBottom: 18 }}>
            Once you have actual elemental times, the improvement opportunities are obvious. The element that's 3x longer than it should be is the one hiding a process problem — a confusing label, a poorly positioned bin, a verification step that could be automated.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'van(--text)', margin: '32px 0 12px' }}>Value Stream Map for dock-to-stock and order fulfillment flows</h3>
          <p style={{ marginBottom: 18 }}>
            Dock-to-stock time is a metric most warehouses track. But few map the entire value stream from trailer arrival to inventory availability — including the waiting, the handoffs, the verification steps, and the exceptions. A VSM of this flow typically reveals 2–4 hours of lead time that nobody owns, because it lives between departments.
          </p>

          <div style={{ borderLeft: '3px solid #F7971E', paddingLeft: 20, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "Most warehouses know their orders-per-hour. Almost none know their true process lead time from dock to dispatch. The gap is where the improvement lives."
            </p>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Kaizen for high-impact station redesign</h3>
          <p style={{ marginBottom: 18 }}>
            A focused kaizen on a packing station, a receiving dock, or a returns processing area can compress hours of work per shift with relatively simple changes: better label printer placement, standardized bin layout, laminated quick-reference cards, re-sequenced work steps. These aren't capital projects. They're process improvements that take an afternoon to implement and deliver results the same day.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Kaizen module documents these events formally — before state, team observations, changes made, and measured result — so the improvement is captured and repeatable across other shifts and sites.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for logistics teams:</strong> Your customers don't see your pick path. They see whether their order arrived on time and undamaged. Every process improvement in your facility is a direct investment in that outcome.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-block', background: '#0176D3', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
              Start a free project
            </Link>
            <Link href="/industries" style={{ display: 'inline-block', border: '1px solid rgba(44,44,92,0.3)', color: 'var(--text)', fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
              ← All Industries
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
