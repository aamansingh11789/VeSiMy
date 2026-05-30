// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Theory of Constraints in Plain Language: Why You Always Fix the Bottleneck First - VeSiMy",
  description: 'The most important idea in operations management, explained without jargon. Why improving anything other than the bottleneck is wasted effort.',
  openGraph: { title: "Theory of Constraints: Why You Always Fix the Bottleneck First", type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(140,68,204,0.15)', color: '#8C44CC', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>6 min read</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Theory of Constraints in Plain Language: Why You Always Fix the Bottleneck First
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            The most important idea in operations management, explained without jargon. Why improving anything other than the bottleneck is wasted effort.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The central idea</h2>
          <p style={{ marginBottom: 18 }}>Every process has one step that determines the maximum output of the entire system. One step. Not several. One. This is the constraint. Eli Goldratt published this idea in 1984 in a novel called The Goal. It remains one of the most practically useful ideas in operations management.</p>
          <p style={{ marginBottom: 18 }}>The constraint is the drum. Everything else beats to its rhythm. You cannot produce faster than the constraint allows. Until you improve the constraint, every other improvement is irrelevant to system output.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to identify your constraint</h2>
          <p style={{ marginBottom: 18 }}>The constraint step is where WIP accumulates. Work piles up in front of it because it cannot process as fast as the steps feeding it. Downstream steps starve because they are waiting for its output. If you stand in front of a process and watch where the pile grows, you have found the constraint.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The five focusing steps</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>1. Identify the constraint.</strong> One step. The one limiting the system.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>2. Exploit the constraint.</strong> Before adding capacity, get everything possible out of it as it exists today. Eliminate waste within that step. Reduce changeover. Ensure it is never starved for input.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>3. Subordinate everything else to the constraint.</strong> All upstream steps exist to feed the constraint. All downstream steps exist to process its output. Optimize for the constraint, not for local efficiency.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>4. Elevate the constraint.</strong> If exploitation is not enough, add capacity.</p>
          <p style={{ marginBottom: 18 }}><strong style={{ color: 'var(--text)' }}>5. When the constraint is broken, find the new one.</strong> Improving the constraint always creates a new constraint somewhere else. This is not failure. It is progress. Go back to step one.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why this is hard in practice</h2>
          <p style={{ marginBottom: 18 }}>Local optimization is the enemy of constraint thinking. When every supervisor is measured on the efficiency of their own area, nobody wants to slow down to subordinate to the constraint. The cutting department wants to run at full speed. The assembly area wants full utilization. The result is WIP everywhere and a system that cannot keep its promises to customers.</p>
          <p style={{ marginBottom: 18 }}>The solution is to measure the system, not the parts. Throughput accounting measures the rate at which the system generates value. That is the natural companion to this methodology.</p>
          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to find your bottleneck?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free - no account needed</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
