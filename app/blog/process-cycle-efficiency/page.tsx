import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Process Cycle Efficiency (PCE): What It Is, How to Calculate It, and What to Do When It\'s Low, VeSiMy",
  description: "Process Cycle Efficiency measures how much of your lead time is actually value-adding. Most manufacturers are at 5–30%. World-class is 95%+. Here\'s how to calculate it and improve it.",
  keywords: ['process cycle efficiency', 'PCE lean', 'process cycle efficiency formula', 'value added time lead time', 'lean manufacturing efficiency', 'VSM efficiency', 'PCE calculation', 'lead time reduction'],
  openGraph: {
    title: 'Process Cycle Efficiency (PCE): Calculate It, Understand It, Improve It',
    description: "Most manufacturers run at 5–30% PCE. World-class is 95%+. Here\'s the formula and what to do with the result.",
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function PCEPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(29,209,161,0.12)', color: '#1DD1A1', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'var(--font-mono)' }}>6 min read · March 19, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Process Cycle Efficiency: The Number That Tells You How Lean You Really Are
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Most operations teams can tell you their cycle time. Very few can tell you what percentage of their lead time is actually doing something the customer would pay for. Process Cycle Efficiency is that percentage, and for most manufacturers, the number is uncomfortable.
          </p>
        </div>

        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The PCE formula</h2>
          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>PCE = (Value-Adding Time ÷ Total Lead Time) × 100</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>Where Total Lead Time = all cycle times + all wait/queue times in the value stream</div>
          </div>

          <p style={{ marginBottom: 18 }}>
            Value-adding time is the sum of all process steps where the product is actually being transformed, machined, assembled, tested, treated. It excludes waiting, inspection, rework, transport, and storage.
          </p>
          <p style={{ marginBottom: 18 }}>
            Total lead time is the full elapsed time from when the order enters the system to when the finished product leaves, including all the time it spends sitting in queues between steps.
          </p>
          <p style={{ marginBottom: 18 }}>
            A simple example: an assembly line where the five process steps total 8 minutes of cycle time. Between steps, parts wait in trays for an average of 22 minutes total. Total lead time is 30 minutes. PCE = 8 ÷ 30 = 26.7%.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What a typical PCE looks like</h2>
          <p style={{ marginBottom: 14 }}>Industry benchmarks vary, but the ranges are consistent:</p>

          {[
            ['Manufacturing (batch)', '1–10%', 'Most of lead time is batch waiting and queue time between departments'],
            ['Manufacturing (flow)', '10–30%', 'Better flow but still significant queue time at bottlenecks'],
            ['World-class lean', '95%+', 'Near-continuous flow with minimal WIP and queue time'],
            ['Service processes', '5–25%', 'High wait time relative to actual processing steps'],
          ].map(([type, range, note]) => (
            <div key={type} style={{ display: 'grid', gridTemplateColumns: '180px 80px 1fr', gap: 12, marginBottom: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{type}</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#0176D3', fontWeight: 700 }}>{range}</div>
              <div style={{ color: 'var(--text2)' }}>{note}</div>
            </div>
          ))}

          <p style={{ marginTop: 18, marginBottom: 18 }}>
            If your PCE calculation produces a number you find hard to believe, say 3%, it's almost certainly correct. The gap between cycle time and lead time in most operations is enormous, and most teams have never measured it because it requires looking at the full value stream, not just the process steps.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why PCE matters more than cycle time alone</h2>
          <p style={{ marginBottom: 18 }}>
            Cycle time tells you how long a step takes. PCE tells you how much of the customer's wait is real work versus structural waste. A process with a 90-second cycle time and a 45-minute lead time has a 3.3% PCE, 96.7% of what the customer waits for is not the 90 seconds of assembly. It's the queues and batching around it.
          </p>
          <p style={{ marginBottom: 18 }}>
            This matters for improvement prioritisation. If you reduce the 90-second cycle time to 75 seconds, you've improved the step by 17% and improved the customer's lead time by 0.5%. If you eliminate the 45-minute queue between steps 3 and 4, you've improved lead time by 47%. PCE shows you where the leverage is.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to improve PCE</h2>
          <p style={{ marginBottom: 14 }}>PCE improves through two levers:</p>
          <p style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--text)' }}>Reduce wait time.</strong> This is the bigger lever for most operations. Queue time between steps is driven by batching, mismatched capacity between steps, and lack of pull signals. Reducing batch sizes, balancing line capacity to takt, and implementing kanban pull between steps all directly reduce wait time without touching the process steps themselves.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>Eliminate non-value-adding steps.</strong> Inspection steps, rework loops, and transport steps all consume time without adding customer value. Eliminating the defect that causes the rework loop improves PCE more sustainably than eliminating the inspection that catches it.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>PCE in value stream mapping</h2>
          <p style={{ marginBottom: 18 }}>
            PCE is one of the primary output metrics of a value stream map. The VSM captures cycle times at each process step and wait times between steps. PCE is calculated from the timeline at the bottom of the map. This is why VSM is the standard entry point for lean improvement, it simultaneously shows the bottleneck, the wait time distribution, and the PCE in a single document.
          </p>
          <p style={{ marginBottom: 18 }}>
            In VeSiMy, PCE is calculated automatically as you build your value stream. Every time you enter a cycle time or wait time, the PCE updates in real time. The metric displays in the project dashboard and feeds the AI gap analysis, so Supe can tell you not just that your PCE is 14%, but which specific queues and steps are consuming the most lead time and in what order to address them.
          </p>

          <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Calculate your PCE, free</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.7 }}>Map your value stream in VeSiMy and your PCE calculates automatically. See where your lead time is going and what to do about it.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0176D3', color: '#0D0C0A', padding: '10px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Start free →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
