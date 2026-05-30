import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Standard Work in Manufacturing: Why It Is the Foundation of All Improvement, VeSiMy',
  description: 'Standard Work is not a bureaucratic procedure. It is the current best method, and the baseline that makes every future improvement measurable. Learn what it is, how to write it, and why it always gets updated.',
  keywords: ['standard work manufacturing', 'standard work lean', 'standard work sheet', 'standardised work TPS', 'standard work combination sheet', 'lean standard work'],
  openGraph: {
    title: 'Standard Work: The Foundation of All Lean Improvement',
    description: 'What standard work is, how to document it, and why it is the most important document in your process.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function StandardWorkPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(108,185,252,0.15)', color: '#6CB9FC', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>6 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Standard Work: The Foundation of All Lean Improvement
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Standard Work is not a procedure manual collecting dust in a binder. It is the current best method, the baseline that makes every future improvement measurable. Without it, you cannot improve. You can only change.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What Standard Work is, and what it is not</h2>
          <p style={{ marginBottom: 18 }}>
            Standard Work is the documented current best method for performing a specific process task. Not the fastest possible method. Not the theoretically optimal method. The <em style={{ color: 'var(--text)' }}>current</em> best method, the safest, highest quality, lowest waste approach that any trained operator can reliably replicate right now.
          </p>
          <p style={{ marginBottom: 18 }}>
            This distinction matters. Standard Work is not aspirational documentation. It describes what is happening today, after the best known optimisations have been applied. The moment a better method is discovered through a PDCA cycle, the standard work is updated to reflect it. Standard Work is always up to date because it is always being improved.
          </p>

          <div style={{ background: 'rgba(108,185,252,0.06)', border: '1px solid rgba(108,185,252,0.2)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: 15, color: 'var(--text)', lineHeight: 1.7 }}>
              "Without Standard Work, there can be no kaizen. Without a defined current state, there is no baseline to improve from, and no way to verify that any improvement has actually occurred."
            </p>
            <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--text2)' }}>, Taiichi Ohno, Toyota Production System</p>
          </div>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The three Standard Work documents</h2>

          {[
            {
              title: '1. Standard Work Sheet',
              color: '#6CB9FC',
              desc: 'Lists every operator task in sequence with time, VA classification, and quality/safety notes. Shows the total cycle time and its breakdown into VA, NNVA, and NVA. This is the primary training document and the baseline for PDCA improvement cycles.',
              use: 'Training new operators, conducting process audits, defining the improvement baseline.',
            },
            {
              title: '2. Standard Work Combination Sheet',
              color: '#0176D3',
              desc: 'Shows the relationship between operator time and machine time on a timeline. A horizontal bar for each task, manual tasks in one colour, machine auto-cycle in another, walking in a third. Reveals where operators wait for machines (opportunity for parallel work) and where machines wait for operators (bottleneck).',
              use: 'Identifying hidden wait times, optimising operator-machine interaction, reducing cycle time without adding resources.',
            },
            {
              title: '3. Production Capacity Sheet',
              color: '#1DD1A1',
              desc: 'Calculates the maximum daily capacity of each step based on net available time, cycle time, and changeover frequency. Identifies which step constrains total throughput. Confirms whether takt time requirements can be met.',
              use: 'Capacity planning, bottleneck identification, shift scheduling.',
            },
          ].map(({ title, color, desc, use }) => (
            <div key={title} style={{ background: 'rgba(248,247,245,0.97)', border: `1px solid ${color}33`, borderRadius: 12, padding: '18px 20px', marginBottom: 16 }}>
              <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color, marginBottom: 10 }}>{title}</div>
              <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}><strong style={{ color: color }}>Use for:</strong> {use}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The most important rule: Standard Work lives at the workstation</h2>
          <p style={{ marginBottom: 18 }}>
            Standard Work is useless if it is filed in a binder on the supervisor's desk. It must be visible at the point of use, laminated, posted at eye level at the workstation, updated whenever the process changes.
          </p>
          <p style={{ marginBottom: 18 }}>
            If the document in the binder differs from what operators are actually doing, you do not have a compliance problem. You have a Standard Work problem. Either the document is wrong (update it) or the operators have deviated (retrain and find out why they deviated, there is usually a reason).
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Standard Work and PDCA: the improvement loop</h2>
          <p style={{ marginBottom: 18 }}>
            Standard Work and PDCA are inseparable. The current Standard Work is the input to the Plan phase, it describes the current condition. A completed PDCA cycle that achieves its target outputs a new Standard Work, the updated method that locks in the improvement.
          </p>
          {[
            'Current Standard Work → defines current condition (Plan)',
            '5 Why or Fishbone → identifies root cause (Plan)',
            'Countermeasure tested → implementation (Do)',
            'Before/after measured → verification (Check)',
            'Standard Work updated → gains locked in (Act)',
            'New Standard Work becomes baseline for the next cycle → loop continues',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#6CB9FC', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(108,185,252,0.06)', border: '1px solid rgba(108,185,252,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              Generate Standard Work Sheets from your VSM
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy generates ISO 22468:2020 compliant Standard Work Sheets from your process step data. Add operator tasks, classify them as VA/NNVA/NVA, and export a print-ready document for any step. Free to start, no credit card.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#4A9EDA,#6CB9FC)', color: 'var(--bg)', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Generate Standard Work Sheets free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
