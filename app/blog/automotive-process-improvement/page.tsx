// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Automotive Manufacturing — VeSiMy',
  description: 'How lean CI tools like Time Study, VSM, and 5 Why apply to the unique process challenges of automotive manufacturing — takt-driven lines, supplier quality, and model-mix complexity.',
  keywords: ['automotive process improvement', 'lean manufacturing automotive', 'takt time automotive', 'automotive waste reduction', 'VSM automotive'],
  openGraph: {
    title: 'Process Improvement in Automotive Manufacturing',
    description: 'If you build cars, you build processes. VeSiMy helps you make both better.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function AutomotiveBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(212,162,8,0.15)', color: '#D4A208', fontFamily: 'monospace', letterSpacing: 1.5 }}>AUTOMOTIVE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>9 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Process Improvement in Automotive Manufacturing: Where Every Second Has a Price Tag
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Automotive is where lean manufacturing was born. The Toyota Production System, takt time, kanban, jidoka — all of it came from the floor of a car plant. And yet, most automotive lines still carry enormous amounts of preventable waste. Here's why, and what structured CI tools actually do about it.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The process problem in automotive</h2>
          <p style={{ marginBottom: 18 }}>
            Automotive manufacturing is defined by precision at scale. A single assembly line might produce 60 vehicles per hour. Each vehicle has thousands of parts, hundreds of fasteners, and dozens of sub-assemblies — each with its own process, its own cycle time, and its own failure mode.
          </p>
          <p style={{ marginBottom: 18 }}>
            The math is unforgiving: if your takt time is 60 seconds and one station runs at 63 seconds, you're building a queue. If that queue doesn't get resolved, you're either slowing the entire line or you're building a buffer that hides the problem instead of solving it.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>The real issue isn't the 3-second gap. The real issue is that most lines don't know they have it.</strong>
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The 5 most common process wastes in automotive</h2>
          {[
            ['Unbalanced line stations', 'When one station takes longer than takt, every other station waits. Operator balance analysis reveals these gaps — but only if someone is tracking cycle times per station, not just line rate.'],
            ['Changeover time losses', 'Model-mix production requires frequent changeovers. Unoptimized changeovers — where internal setup time hasn\'t been driven toward SMED principles — silently consume hours every shift.'],
            ['Rework loops', 'Parts that fail end-of-line check go back for rework. Every rework event hides a process failure upstream. The rework station is a symptom; the root cause is almost always a process parameter.'],
            ['Supplier variation passed forward', 'Incoming part variation that exceeds your process window causes fitment issues, torque failures, and NVH problems. These often get "absorbed" by skilled operators instead of traced to source.'],
            ['Over-processing in quality inspection', 'Redundant check points, manual data entry, and paper-based inspection records don\'t add value — they add time and introduce transcription errors.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.15)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How VeSiMy applies to automotive processes</h2>
          <p style={{ marginBottom: 18 }}>
            VeSiMy doesn't claim to replace your MES, your APQP process, or your control plan. What it does is give your teams — at every level — a structured way to see and act on process problems that are hiding in plain sight.
          </p>

          <div style={{ borderLeft: '3px solid #D4A208', paddingLeft: 20, marginBottom: 24 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "The tools exist in Toyota. The discipline to use them every day is what's rare."
            </p>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>— A principle that applies to every automotive plant, not just one</p>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Time Study: Making the 3-second gap visible</h3>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Time Study tool lets a team leader or process engineer walk a station, record actual cycle times against their elements, and instantly see where the process is living against takt. Not the average — the actual distribution. The outlier events that paper time studies smooth over. The micro-delays that don't show up in daily production counts but compound into lost JPH by shift end.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Value Stream Map: Seeing the whole, not just the part</h3>
          <p style={{ marginBottom: 18 }}>
            A typical automotive stamping-to-assembly value stream has 15–30 process steps. The cycle time at each step might be measured. But the inventory sitting between steps — the parts in supermarkets, the WIP queues, the "safety stock" someone added two years ago and nobody removed — is often invisible.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's VSM tool makes those queues visible as part of the total lead time calculation. A line that looks like it runs at 60 JPH might have 3 days of WIP embedded in it. That's not a capacity number. That's a kaizen target.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'van(--text)', margin: '32px 0 12px' }}>5 Why: Getting past the symptom</h3>
          <p style={{ marginBottom: 18 }}>
            In automotive, defect investigations often stop at the part. "The part was bad." But why was the part bad? Was it a tooling issue? A process parameter drift? An operator method variation? A supplier dimension that slipped tolerance?
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's 5 Why module structures these investigations so they don't stop at "operator error" — the most common, and least useful, answer in manufacturing. It pushes the team to the system-level cause: the process that allowed human error to produce a defective part.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What automotive CI teams actually need</h2>
          <p style={{ marginBottom: 18 }}>
            The challenge in automotive isn't a lack of lean knowledge. Most plants have CI coordinators, production system standards, and quality systems that reference TPS principles. The challenge is <strong style={{ color: 'var(--text)' }}>consistent execution at the work team level</strong>.
          </p>
          <p style={{ marginBottom: 18 }}>
            Team leaders don't have time for complex software. They have a takt time to hit and a quality gate to pass. VeSiMy is built for that reality — lightweight enough to run on a tablet at the line, structured enough to produce data that feeds up into the plant's improvement tracking.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for automotive teams:</strong> If you can describe the process, you can improve it. VeSiMy gives you the structure to stop describing problems and start solving them — with data, not instinct.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-block', background: '#D4A208', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
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
