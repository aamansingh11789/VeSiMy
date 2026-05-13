// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Value-Added vs Non-Value-Added: How to Classify Every Task Honestly, VeSiMy',
  description: 'The honest guide to classifying every activity in your process. Most teams misclassify NVA work as necessary. Here is how to stop.',
  openGraph: { title: 'Value-Added vs Non-Value-Added: How to Classify Every Task Honestly', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#0176D322', color: '#0176D3', fontFamily: 'monospace', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Value-Added vs Non-Value-Added: How to Classify Every Task Honestly
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            The honest guide to classifying every activity in your process. Most teams misclassify NVA work as necessary. Here is how to stop.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The three categories</h2>
          <p style={{ marginBottom: 18 }}>Every activity in every process falls into one of three categories. Value-added (VA): the customer would pay for this if they knew it was happening. It physically transforms the product or service toward what the customer wants. Necessary non-value-added (NNVA): required by law, regulation, or the current process design, but the customer gets nothing for it. Non-value-added (NVA): pure waste. Eliminate it.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The customer test</h2>
          <p style={{ marginBottom: 18 }}>The test for value-added is simple but uncomfortable: would the customer pay for this step if they could see exactly what you were doing? Inspection fails the test. Rework fails. Moving materials fails. Entering data a second time because the first entry was in the wrong system fails.</p>
          <p style={{ marginBottom: 18 }}>Most teams know intellectually which steps are waste. The problem is that waste is normalized. The team has built their entire workflow around the waste. The inspection step that catches the errors from step 3 feels necessary because step 3 has always had errors. Fix step 3 and the inspection goes with it.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The most common misclassifications</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Inspection as VA:</strong> Inspection does not transform the product. It confirms what was already done. Unless your customer is paying you to certify quality, inspection is NNVA at best, NVA if the product was made right to begin with.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Expediting as necessary:</strong> Expediting is what happens when the process is broken. The expeditor is not adding value. The expeditor is compensating for a system that cannot keep its own promises. Expediting is NVA.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Meetings as value-added:</strong> The meeting that produces a decision is NNVA. The meeting that produces no decision is NVA. Neither should appear on your future state map at their current frequency.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to classify honestly during a wall session</h2>
          <p style={{ marginBottom: 18 }}>Ask of every activity: does this change the form, fit, or function of the product or service toward what the customer wants? If yes, VA. If no, ask whether it can be eliminated today. If it cannot be eliminated without changing the process design, it is NNVA. Everything else is NVA.</p>
          <p style={{ marginBottom: 18 }}>Write the classification on the sticky note. Post-its can move. Disagreements can be argued. The point is not to get it perfect on the first pass. The point is to have an honest conversation about every step, and most teams have never had that conversation.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
