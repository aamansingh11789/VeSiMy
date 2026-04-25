// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Little Law: The Formula That Validates Your WIP and Lead Time Data - VeSiMy",
  description: 'A queueing theorem from 1961 that every lean practitioner should know. If your numbers do not reconcile, your data has a problem.',
  openGraph: { title: "Little Law: The Formula That Validates WIP and Lead Time", type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontFamily: 'monospace', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>5 min read</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            The Formula That Validates Your WIP and Lead Time Data
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            A queueing theorem from 1961 that every lean practitioner should know. If your numbers do not reconcile, your data has a problem.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The formula</h2>
          <p style={{ marginBottom: 18 }}>L equals lambda times W. L is the average number of items in the system (WIP), lambda is the average arrival rate (throughput), and W is the average time an item spends in the system (lead time). Rearranged: Lead time equals WIP divided by throughput.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Using it as a data quality check</h2>
          <p style={{ marginBottom: 18 }}>If your WIP is 120 units, your throughput is 30 units per day, and your measured lead time is 5 days, something is wrong. The formula says lead time should be 4 days. Before trusting any VSM analysis, verify that your WIP, throughput, and lead time reconcile through this relationship.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Using it as a design tool</h2>
          <p style={{ marginBottom: 18 }}>If your throughput is 30 units per day and your target lead time is 3 days, your maximum WIP should be 90 units. More than 90 units in the system and your lead time guarantee is broken by the math. This is how you design supermarkets and kanban quantities: by arithmetic, not by feel.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The leverage</h2>
          <p style={{ marginBottom: 18 }}>Lead time can be reduced by reducing WIP, increasing throughput, or both. In most operations, reducing WIP is faster and cheaper than increasing throughput. The WIP lever is often available immediately. The throughput lever requires a project.</p>
          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free - no account needed</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
