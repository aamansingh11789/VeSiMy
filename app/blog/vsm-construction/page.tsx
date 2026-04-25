// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VSM in Construction: How a Contractor Used Process Mapping to Win a Client — VeSiMy',
  description: 'Construction is not a manufacturing process, but the waste types are identical. Here is how one contractor used value stream mapping to change how they bid and deliver.',
  openGraph: { title: 'VSM in Construction: How a Contractor Used Process Mapping to Win a Client', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#F7971E22', color: '#F7971E', fontFamily: 'monospace', letterSpacing: 1.5 }}>INDUSTRY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>7 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            VSM in Construction: How a Contractor Used Process Mapping to Win a Client
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Construction is not a manufacturing process, but the waste types are identical. Here is how one contractor used value stream mapping to change how they bid and deliver.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The challenge of applying lean to construction</h2>
          <p style={{ marginBottom: 18 }}>Construction projects are not repetitive. Each project is different. The sequence changes. The site changes. The crew changes. This is the objection lean practitioners hear most from construction teams: our work is not a production line, so lean does not apply.</p>
          <p style={{ marginBottom: 18 }}>The objection is wrong. Construction is not a production line, but it is a process. It has inputs, steps, handoffs, and outputs. It has waiting, overprocessing, defects, and movement waste. Every one of the 8 wastes is present on every construction site. They are just dressed differently.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Mapping a commercial fitout project</h2>
          <p style={{ marginBottom: 18 }}>Take a commercial interior fitout. The process runs from design approval to certificate of occupancy. The steps include design finalisation, permit application and approval, procurement of materials and fixtures, site preparation, structural work, mechanical and electrical rough-in, finishing trades, commissioning, and inspection.</p>
          <p style={{ marginBottom: 18 }}>Map it. Time each step. Measure the wait time between steps. A typical finding: the actual trade work represents 35 to 45 percent of the project timeline. The rest is waiting. Waiting for approvals. Waiting for materials. Waiting for the previous trade to complete so the next trade can start.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The contractor who mapped it and won the bid</h2>
          <p style={{ marginBottom: 18 }}>A mid-size contractor in the commercial fitout space spent three days mapping their last five projects. They measured average wait times between each trade. They identified that permit approval was the single largest delay source — averaging 18 working days — and that they had no visibility into where in the approval process each permit sat.</p>
          <p style={{ marginBottom: 18 }}>They redesigned their process: a permit expediting protocol that checked application status daily and responded to requests for information within four hours. A pull-based material delivery system keyed to actual site completion status rather than project schedule. Parallel commissioning activities where previously sequential.</p>
          <p style={{ marginBottom: 18 }}>The result was a projected schedule reduction of 22 percent on a comparable project. They put that number — with the supporting VSM analysis — in a bid presentation. They won the project. The competitor bidding on the same job had no equivalent data.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The replicable parts</h2>
          <p style={{ marginBottom: 18 }}>You do not need a perfect VSM to extract value. Map the handoffs. Measure the wait times. Find the step with the longest wait before it. That is your bottleneck equivalent. Address that step and your lead time comes down.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free — no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
