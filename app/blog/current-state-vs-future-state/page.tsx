// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Current State vs Future State: The Two Maps Every Lean Project Needs, VeSiMy',
  description: 'The current state map shows what is. The future state map shows what is possible. The gap between them is where the improvement work lives.',
  openGraph: { title: 'Current State vs Future State: The Two Maps Every Lean Project Needs', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#0176D322', color: '#0176D3', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Current State vs Future State: The Two Maps Every Lean Project Needs
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            The current state map shows what is. The future state map shows what is possible. The gap between them is where the improvement work lives.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why you need both</h2>
          <p style={{ marginBottom: 18 }}>A current state map without a future state is a diagnostic without a plan. You know what is wrong but not what you are building toward. A future state without a current state is a fantasy. You know what you want but have no grounded understanding of the gap you need to close.</p>
          <p style={{ marginBottom: 18 }}>The power of VSM is in holding both maps in the same room. The current state shows the waste clearly. The future state shows the same process with the waste removed. The team can see the gap. The gap becomes the project plan.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Building the current state</h2>
          <p style={{ marginBottom: 18 }}>The current state maps what is actually happening today. Not the procedure. Not the ideal. What actually happens when you observe the process. Every step, every delay, every piece of WIP, every information flow. The facilitator's job is to keep asking: is that what actually happens? until the map is honest.</p>
          <p style={{ marginBottom: 18 }}>Data fields, cycle time, wait time, WIP, defect rate, uptime, come from direct observation during Phase 2. The current state is not complete until every major step has measured data, not estimates.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Building the future state</h2>
          <p style={{ marginBottom: 18 }}>The future state is designed, not observed. The team asks: given what we now know about waste and constraint, what would this process look like if we eliminated the highest-impact problems?</p>
          <p style={{ marginBottom: 18 }}>Future state design rules: set takt time as the ceiling. Eliminate NVA steps where possible. Reduce WIP to the minimum needed for stable flow. Establish pull systems where push creates batching problems. Introduce pacemaker scheduling at or near the constraint.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The gap is the project backlog</h2>
          <p style={{ marginBottom: 18 }}>Every difference between the current state and the future state is a project or an action. Eliminate step 4 entirely, that is a project. Reduce WIP at step 7 from 40 to 5, that is a project. Introduce kanban between steps 9 and 10, that is a project.</p>
          <p style={{ marginBottom: 18 }}>Prioritise by impact on the constraint. Every action that does not address the current constraint is background improvement. Start with the actions that move the needle on lead time or throughput, because those are the metrics the customer feels.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Version history is the improvement story</h2>
          <p style={{ marginBottom: 18 }}>Every time a future state is implemented, it becomes the new current state and a new future state is designed. The progression of current state maps over time is the measurement of how the organisation is improving. VeSiMy stores every version permanently so the improvement story is always visible.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
