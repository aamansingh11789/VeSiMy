// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VSM for Service Businesses: Mapping Processes That Have No Physical Product, VeSiMy',
  description: 'Value stream mapping originated in manufacturing but applies with equal force to any process where a service flows from request to delivery.',
  openGraph: { title: 'VSM for Service Businesses: Mapping Processes That Have No Physical Product', type: 'article' },
}

const serif = "'Sora','Inter',sans-serif"

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#6CB9FC22', color: '#6CB9FC', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>INDUSTRY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>7 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            VSM for Service Businesses: Mapping Processes That Have No Physical Product
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Value stream mapping originated in manufacturing but applies with equal force to any process where a service flows from request to delivery.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What flows in a service business</h2>
          <p style={{ marginBottom: 18 }}>In manufacturing, the value stream is easy to see. Materials arrive, are transformed, and leave as a finished product. You can watch the flow and touch the inventory.</p>
          <p style={{ marginBottom: 18 }}>In a service business, the flow is information, decisions, and work output. A mortgage application flows from submission through credit assessment, document verification, underwriting, approval, and closing. A tax return flows from document collection through preparation, review, and filing. A consulting engagement flows from scoping through research, analysis, presentation, and implementation.</p>
          <p style={{ marginBottom: 18 }}>The flow is less visible but the waste is identical. Waiting. Rework. Overprocessing. Unnecessary handoffs. Information that needs to travel from one system to another because the systems do not talk.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Adapting VSM notation for services</h2>
          <p style={{ marginBottom: 18 }}>The core notation stays the same. Supplier becomes the source of the request or input, the client, the customer, the regulatory body. Customer becomes the recipient of the service output. Process steps are the activities performed on the work as it flows through.</p>
          <p style={{ marginBottom: 18 }}>The key adaptations: WIP in a service context is queued work, cases waiting, applications pending, tickets open, emails unanswered. Cycle time is the time actively worked on a case. Wait time is the time the case sits in a queue between active work sessions.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>A professional services example</h2>
          <p style={{ marginBottom: 18 }}>A law firm maps its contract review process. From client request to signed contract returned. Steps: intake and conflict check, matter opening, document receipt, initial review, redline, client review cycle, negotiation, final review, execution.</p>
          <p style={{ marginBottom: 18 }}>The VSM reveals: total active work time across all steps is 4.5 hours. Total elapsed time from request to execution averages 18 business days. PCE: 3 percent. More than 97 percent of the elapsed time is the work sitting in a queue waiting for someone's attention.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The levers that move service lead time</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Reduce queue time.</strong> The biggest lever in almost every service process. Dedicated capacity for high-priority requests. Daily clearing of the intake queue. Time-boxed review cycles with hard handoff dates.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Reduce handoffs.</strong> Every handoff adds a queue. Reduce the number of people who touch a case by cross-training for the most common case types.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Eliminate rework loops.</strong> The client review cycle that generates 15 rounds of changes usually has a root cause in the initial brief not being specific enough. Fix the intake form, not the review process.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why service businesses benefit most from VSM</h2>
          <p style={{ marginBottom: 18 }}>In manufacturing, waste is often visible. Piles of inventory, idle machines, scrap bins. In service businesses, waste is invisible. The case sitting in someone's inbox does not look like waste, it looks like a normal part of the workflow. Making it visible with a VSM is often the first time a service team has seen their own process clearly.</p>

          <div style={{ background: 'rgba(11,29,51,0.06)', border: '1px solid rgba(11,29,51,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0B1D33', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
