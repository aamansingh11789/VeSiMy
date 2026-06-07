import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Industrial Manufacturing, VeSiMy',
  description: "Industrial manufacturing, heavy equipment, job shops, custom fabrication, has some of the largest untapped CI potential of any sector. Here\'s how structured process improvement applies.",
  keywords: ['industrial manufacturing process improvement', 'lean industrial manufacturing', 'job shop CI', 'OEE improvement industrial', 'industrial kaizen'],
  openGraph: {
    title: "Process Improvement in Industrial Manufacturing: The Machine Doesn\'t Know It\'s Inefficient",
    description: 'How VeSiMy brings structured CI methodology to heavy industrial, job shop, and custom fabrication environments.',
    type: 'article',
  },
}

const serif = "'Sora','Inter',sans-serif"

export default function IndustrialBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(11,29,51,0.15)', color: '#0B1D33', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>INDUSTRIAL</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>8 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            The Machine Doesn't Know It's Inefficient. You Have to Tell It.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Industrial manufacturing, heavy equipment fabrication, custom job shops, process equipment manufacturers, industrial component production, represents some of the largest untapped potential for CI in any sector. Not because these operations are poorly run, but because they've historically had the fewest tools designed for their specific operating environment.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why industrial manufacturing is CI-underserved</h2>
          <p style={{ marginBottom: 18 }}>
            Most lean manufacturing tools were designed for high-volume, repetitive production environments. Takt time, kanban, standardized work, these concepts scale beautifully across 10,000 units per day. They require more translation work in an environment where you might build 10 units per month, where each unit is configured differently, and where your machine setup time can exceed your run time.
          </p>
          <p style={{ marginBottom: 18 }}>
            The result is that many industrial operations have concluded that "lean doesn't apply here", and have left significant efficiency opportunities on the table. The CI principles absolutely apply. The specific tools need to be applied thoughtfully.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>Every industrial operation has processes. Every process has waste. The principles of identifying and eliminating that waste are universal.</strong>
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The process wastes that industrial operations normalize</h2>
          {[
            ['Excessive setup and changeover', 'In a job shop, setup time is often longer than run time. This is treated as a fixed cost of custom manufacturing. But most setup time contains significant internal work, work that requires the machine to be stopped, that could be converted to external work performed while the machine runs the previous job. SMED principles apply even at very low volumes.'],
            ['Unplanned maintenance interruptions', 'Heavy industrial equipment fails. When it does, the productive time lost is often 5–10x the actual repair time, because the failure wasn\'t anticipated, the parts aren\'t in stock, and the maintenance crew has to diagnose before they can repair. Preventive maintenance programs designed around actual failure modes, not calendar intervals, directly reduce this waste.'],
            ['Material handling and staging delays', 'In large fabrication environments, moving heavy components is a significant portion of total cycle time. Informal staging areas, unclear work sequencing, and ad hoc crane scheduling create material handling delays that are invisible in job cost accounting but visible when you time-study a fabrication sequence.'],
            ['Quality rework on first-off parts', 'Custom and low-volume parts fail first-article inspection at higher rates than high-volume parts because there are fewer opportunities to optimize the setup. Structured first-article review processes that feed back into setup documentation reduce this failure rate over time.'],
            ['Knowledge locked in individuals', 'Industrial operations often rely on veteran machinists, fabricators, and welders who carry setup knowledge, tooling preferences, and workholding solutions in their heads. When they leave, or aren\'t available, productivity drops. Capturing this knowledge in standard work documents preserves it and makes it trainable.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(11,29,51,0.06)', border: '1px solid rgba(11,29,51,0.15)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How VeSiMy applies to industrial environments</h2>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Time Study for setup characterization</h3>
          <p style={{ marginBottom: 18 }}>
            In a job shop, the most valuable time study isn't of the machining operation itself, it's of the setup. How long does it actually take to go from last-part-off to first-good-part-off on a new job? What are the elements? Which elements can be prepared while the machine is still running?
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Time Study tool captures this at the elemental level, not as a single setup time number but as a breakdown that makes optimization decisions visible. Reduce the two-hour average setup to 90 minutes, and a 5-setup week recovers 2.5 hours of machine time. Multiply that across your shop and the math becomes significant.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Value Stream Map for job flow and constraint identification</h3>
          <p style={{ marginBottom: 18 }}>
            Even in a low-volume, high-mix environment, a value stream map of a representative product family reveals the dominant flow pattern, and the constraints that limit throughput. The operation that has the longest queue of work waiting in front of it is your constraint. Everything else in the shop is either starving it or feeding it.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's VSM tool makes this visible, even in job shop environments where standard product families are harder to define.
          </p>

          <div style={{ borderLeft: '3px solid #0B1D33', paddingLeft: 20, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "A job shop that thinks it doesn't have repeatable processes is usually running the same 20 setups 80% of the time, it just hasn't standardized them yet."
            </p>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Kaizen for targeted OEE improvement</h3>
          <p style={{ marginBottom: 18 }}>
            Industrial OEE improvement is most effective when focused on a single piece of equipment, the one that's both a constraint and an OEE underperformer. A focused kaizen on that machine, examining availability losses (unplanned downtime), performance losses (speed reduction and micro-stoppages), and quality losses (first-pass yield), typically finds that 2–3 root causes are driving 70–80% of the OEE gap.
          </p>
          <p style={{ marginBottom: 18 }}>
            Those 2–3 root causes are tractable. A kaizen event focused on a single machine is achievable in a week and measurable in a month.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for industrial teams:</strong> The argument that lean doesn't apply to custom manufacturing has never been true. VeSiMy makes that clear, one process improvement at a time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-block', background: '#0B1D33', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
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
