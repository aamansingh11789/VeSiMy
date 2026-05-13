// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Small Business: Why You Do Not Need a Black Belt to Start, VeSiMy',
  description: 'Lean thinking is not a large-company methodology. Small businesses often have the clearest view of their waste and the fastest path to fixing it.',
  openGraph: { title: 'Process Improvement in Small Business: Why You Do Not Need a Black Belt to Start', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#8C44CC22', color: '#8C44CC', fontFamily: 'monospace', letterSpacing: 1.5 }}>INDUSTRY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Process Improvement in Small Business: Why You Do Not Need a Black Belt to Start
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Lean thinking is not a large-company methodology. Small businesses often have the clearest view of their waste and the fastest path to fixing it.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The certification myth</h2>
          <p style={{ marginBottom: 18 }}>Lean Six Sigma has a certification industry built around it. Green Belt. Black Belt. Master Black Belt. Courses cost thousands of dollars and take months to complete. This has created the impression that process improvement is something you need permission to do, that without certification, you are not qualified to touch the process.</p>
          <p style={{ marginBottom: 18 }}>This is wrong. The certification programs teach methodology. The methodology is valuable. But the methodology was not created for certified practitioners in large organisations. It was developed by Toyota production workers observing their own processes and eliminating waste they could see with their own eyes.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What a small business owner can do today</h2>
          <p style={{ marginBottom: 18 }}>Pick the process that is costing you the most time or causing the most customer complaints. Map it. Write down every step from start to finish, the real steps, including the workarounds and the rework loops. Time each step. Note where work piles up. Note where the team has to wait.</p>
          <p style={{ marginBottom: 18 }}>You have just done a current state map. You do not need software or training to do this. You need paper, a pen, and honest observation.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The five questions that find the improvement</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Where does work pile up?</strong> That is your bottleneck. Fix it first.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What steps exist only because earlier steps fail?</strong> Inspection and rework loops are the direct cost of process failures upstream.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What do customers complain about most?</strong> Customer complaints are defect data. They tell you where the process is failing from the perspective of the person who matters most.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What does the team spend the most time on that is not the actual work?</strong> Chasing information, correcting errors, duplicating data entry, answering the same question repeatedly, these are visible wastes that improve quickly.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>What would you eliminate first if you had to?</strong> The team usually knows. The reason it has not been eliminated is usually politics, inertia, or lack of a structured change process. Lean gives you the structure.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The advantage small businesses have</h2>
          <p style={{ marginBottom: 18 }}>The owner of a 20-person business can call the team together this afternoon, map a process on a whiteboard, agree on one change, implement it this week, and measure the result next week. The PDCA cycle that takes six months in a large organisation takes six days in a small one.</p>
          <p style={{ marginBottom: 18 }}>VeSiMy was built to make this accessible, the methodology, the analysis, and the documentation, without requiring a lean department or a consultant to run it.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
