import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Food & Beverage Manufacturing — VeSiMy',
  description: "Food & beverage operations face yield loss, changeover waste, sanitation downtime, and food safety compliance — all on the same line. Here\'s how structured CI addresses these challenges.",
  keywords: ['food beverage process improvement', 'lean food manufacturing', 'food production waste reduction', 'changeover food production', 'food safety CI'],
  openGraph: {
    title: 'Process Improvement in Food & Beverage: Freshness Is a Process Problem',
    description: 'How VeSiMy helps food & beverage teams reduce waste, improve yield, and hit compliance targets.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function FoodBeverageBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontFamily: 'monospace', letterSpacing: 1.5 }}>FOOD & BEVERAGE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>8 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Freshness Is a Process Problem: CI in Food & Beverage Manufacturing
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Food and beverage operations are some of the most process-intensive environments in manufacturing. You're managing perishable inputs, regulatory compliance, sanitation windows, SKU proliferation, and consumer expectations — all on the same line, every shift. Continuous improvement isn't optional. It's the operating model.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why food & beverage is uniquely process-constrained</h2>
          <p style={{ marginBottom: 18 }}>
            In most manufacturing environments, WIP inventory is a waste — but it's a recoverable one. A part sitting in a queue still becomes a part. In food manufacturing, WIP has a clock on it. Unused dough goes to waste. Filled containers that miss a temperature window get condemned. Line stoppages during a fill run can mean a full batch disposal.
          </p>
          <p style={{ marginBottom: 18 }}>
            This time-sensitive reality means that process waste in food & beverage isn't just an efficiency problem — it's a direct cost on the P&L with no recovery path.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The 5 process losses that cost food operations the most</h2>
          {[
            ['Changeover time between SKUs', 'A high-mix food line might run 8–15 different products per week. Every changeover is a window of zero production. Unoptimized changeovers — where cleaning, setup, and first-article checks aren\'t sequenced properly — can consume 30–60 minutes of productive line time per event.'],
            ['Yield loss at critical process steps', 'Filling, portioning, slicing, and packaging all have inherent giveaway. When those steps aren\'t characterized and controlled, giveaway compounds — often without anyone measuring it against standard.'],
            ['Unplanned sanitation downtime', 'Regulatory sanitation requirements are non-negotiable. But the time spent in sanitation can often be reduced and better scheduled. Unplanned sanitation events caused by process issues (foreign material, product buildup, temperature excursion) are a signal that a process step isn\'t controlled.'],
            ['Rework and re-pack', 'Product that comes off the line out of spec — wrong weight, damaged packaging, label error — often gets reworked rather than disposed. Rework lines consume labor that should be on the primary line. The root cause is almost always in the process, not the product.'],
            ['Documentation and traceability gaps', 'FSMA, HACCP, and SQF/BRC requirements demand lot traceability. Manual records, incomplete batch sheets, and informal SOPs create audit exposure and slow down recall response times when they\'re needed.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Where VeSiMy fits in a food & beverage operation</h2>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Value Stream Mapping for line configuration</h3>
          <p style={{ marginBottom: 18 }}>
            Mapping the value stream of a food line reveals the true cost of changeovers and sanitation windows in context. Most food operations know their line rate. Far fewer know their effective utilization rate — the percentage of scheduled time when the line is actually running product to standard.
          </p>
          <p style={{ marginBottom: 18 }}>
            A VSM session that quantifies changeover time, sanitation downtime, startup losses, and rate inefficiency often reveals that a line running at 90% of rated speed is actually producing at 65% of capacity.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Kaizen for changeover reduction</h3>
          <p style={{ marginBottom: 18 }}>
            SMED (Single Minute Exchange of Die) principles apply directly to food production changeovers. The approach: separate internal steps (line must be stopped) from external steps (can be done while running), eliminate steps that don't add value, and standardize the sequence so every changeover takes the same time regardless of who runs it.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Kaizen module structures this as a team event with before/after measurement, so the improvement has a documented baseline and a verified result — not just a perception that it's better.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Waste Identification for yield and giveaway</h3>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Waste ID tool gives teams a structured framework to walk a process and identify the 8 wastes — calibrated to a food environment. In food manufacturing, overproduction waste is particularly insidious: making more than the production order to "cover" for expected rework or shortfill, and then disposing of the overage.
          </p>

          <div style={{ borderLeft: '3px solid #1DD1A1', paddingLeft: 20, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "In food manufacturing, you don't get to call the yield loss 'normal.' At the margins this business runs on, normal yield loss is a margin problem."
            </p>
          </div>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Food safety as a process improvement framework</h2>
          <p style={{ marginBottom: 18 }}>
            HACCP is, at its core, a process improvement framework. It identifies the points in a process where failure can cause harm, characterizes those failure modes, and requires control measures. That's process engineering — the same discipline that drives CI in any other industry.
          </p>
          <p style={{ marginBottom: 18 }}>
            The teams that manage food safety best are the ones who treat every deviation not as a compliance event to be closed but as a process signal to be understood. VeSiMy's 5 Why and Fishbone tools are direct complements to a HACCP-based deviation management process.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for food & beverage teams:</strong> Every minute of unplanned downtime, every pound of yield loss, every rework event is a process problem waiting to be solved. VeSiMy gives your team the tools to find the signal in the noise.
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
