import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Takt Time Calculator: Formula, Examples & Free Tool 2026, VeSiMy',
  description: 'Takt time is the heartbeat of lean manufacturing. Learn the formula, see real calculation examples, and use our free takt time calculator to set your production pace in minutes.',
  keywords: ['takt time calculator', 'takt time formula', 'what is takt time', 'takt time vs cycle time', 'lean manufacturing takt time', 'takt time examples'],
  openGraph: {
    title: 'Takt Time Calculator: Formula, Examples & Free Tool',
    description: 'Learn the takt time formula, see real examples, and calculate your takt time in minutes.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function TaktTimePost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontFamily: 'monospace', letterSpacing: 1.5 }}>CALCULATOR</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>5 min read · March 12, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Takt Time Calculator: Formula, Examples, and What to Do With the Number
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Takt time is the heartbeat of lean manufacturing, the maximum time you have to complete one unit to meet customer demand. Here's the formula, real examples, and exactly how to use it.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What is takt time?</h2>
          <p style={{ marginBottom: 18 }}>
            Takt time is the rate at which you need to complete products to satisfy customer demand, no faster, no slower. The word "takt" comes from the German word for a conductor's baton: it sets the rhythm the whole orchestra plays to.
          </p>
          <p style={{ marginBottom: 18 }}>
            In lean manufacturing, takt time is the single number that tells you whether your production process is in balance with your customer. If your cycle time is faster than takt, you're overproducing. If it's slower, you're falling behind.
          </p>

          {/* Formula box */}
          <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.25)', borderRadius: 14, padding: '28px 32px', marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#1DD1A1', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 2, marginBottom: 16 }}>THE FORMULA</div>
            <div style={{ fontFamily: serif, fontSize: 'clamp(18px,3vw,26px)', color: 'var(--text)', fontWeight: 700, marginBottom: 12 }}>
              Takt Time = Available Production Time ÷ Customer Demand
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              Result is in seconds, minutes, or hours per unit, whichever unit you use for time
            </div>
          </div>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Step-by-step: how to calculate takt time</h2>

          {[
            {
              step: '1. Find your available production time',
              body: 'This is the time your process is actually available to produce, not calendar time. Subtract all planned stops: breaks, lunches, shift changeovers, planned maintenance. Do NOT subtract unplanned downtime, that\'s a problem to fix, not a planning assumption.',
              example: 'Example: 8-hour shift = 480 min. Subtract 2 × 10-min breaks and 1 × 30-min lunch = 430 minutes available.',
            },
            {
              step: '2. Find your customer demand',
              body: 'How many units does the customer require in that same time period? Use actual orders or a rolling average, not your production capacity or sales targets.',
              example: 'Example: Customer orders 86 units per shift on average.',
            },
            {
              step: '3. Divide',
              body: 'Available time divided by demand gives you takt time. Convert to seconds if helpful, it\'s easier to compare to cycle times in seconds.',
              example: '430 min ÷ 86 units = 5.0 minutes per unit (or 300 seconds per unit)',
            },
          ].map(({ step, body, example }, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {i + 1}
                </div>
                <strong style={{ color: 'var(--text)', fontSize: 16 }}>{step}</strong>
              </div>
              <div style={{ paddingLeft: 42, fontSize: 14 }}>
                <p style={{ marginBottom: 10 }}>{body}</p>
                <div style={{ background: 'rgba(29,209,161,0.04)', border: '1px solid rgba(29,209,161,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1DD1A1', fontFamily: 'monospace' }}>
                  {example}
                </div>
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>4 worked examples</h2>

          {[
            {
              title: 'Automotive sub-assembly line',
              available: '435 min/shift (7.25 hr minus breaks)',
              demand: '145 units/shift',
              takt: '3.0 min (180 sec)',
              note: 'Every 3 minutes, one sub-assembly must leave this line to keep pace with the main assembly line downstream.',
            },
            {
              title: 'Food packaging, single SKU',
              available: '660 min/day (2 shifts, minus all breaks)',
              demand: '1,100 cases/day',
              takt: '0.6 min (36 sec)',
              note: '36 seconds per case. Any step with a cycle time above 36 seconds is your bottleneck and will cause the line to fall behind.',
            },
            {
              title: 'Custom fabrication shop',
              available: '2,100 min/week (5 days × 7-hr productive time)',
              demand: '35 orders/week',
              takt: '60 min/order',
              note: 'One completed order must leave the shop every hour. If any workstation takes longer than 60 minutes per order, you\'re building a queue.',
            },
            {
              title: 'Medical device final inspection',
              available: '390 min/shift (minus breaks and calibration time)',
              demand: '78 devices/shift',
              takt: '5.0 min (300 sec)',
              note: 'Each inspector must complete one device every 5 minutes. If current inspection takes 7 minutes, you either need more inspectors or a process improvement.',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background: 'rgba(248,247,245,0.97)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 12, padding: '20px 22px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>{ex.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 14 }}>
                {[
                  ['Available Time', ex.available],
                  ['Customer Demand', ex.demand],
                  ['Takt Time', ex.takt],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: 'transparent', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: '#52507A', fontFamily: 'monospace', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1DD1A1' }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', fontStyle: 'italic' }}>{ex.note}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Takt time vs cycle time vs lead time</h2>
          <p style={{ marginBottom: 16 }}>These three numbers are often confused but they measure completely different things:</p>
          {[
            ['Takt Time', 'The pace customer demand requires', 'External, set by the customer'],
            ['Cycle Time', 'How long your process actually takes', 'Internal, set by your process'],
            ['Lead Time', 'Total time from order to delivery', 'Internal, includes all waiting'],
          ].map(([term, def, note]) => (
            <div key={term} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: 12, marginBottom: 10, alignItems: 'center', background: 'rgba(248,247,245,0.97)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: '#0176D3' }}>{term}</span>
              <span>{def}</span>
              <span style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{note}</span>
            </div>
          ))}
          <p style={{ marginTop: 16, marginBottom: 18 }}>
            The goal of lean is to get your cycle time close to (but not above) takt time, while reducing lead time as much as possible by eliminating queues and waiting.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What to do once you know your takt time</h2>
          {[
            ['Compare takt to cycle time at every step', 'Any step where cycle time > takt is a bottleneck. It will cause downstream starvation and upstream pileup. That\'s where you focus your kaizen effort.'],
            ['Use it to set staffing levels', 'Takt time tells you how many operators you need. If takt is 300 sec and each operator can do 60 sec of work, you need 5 operators for a balanced line.'],
            ['Display takt at every workstation', 'Print it large. Operators need to know the pace they\'re working to. If they can\'t see takt, they\'re guessing.'],
            ['Recalculate it every month', 'Takt changes when customer demand changes. A takt time calculated in January may be wrong by March. Build recalculation into your monthly planning cycle.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                {i + 1}
              </div>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>{title}</strong>
                {body}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              See takt time live on your VSM
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy calculates takt time automatically from your project settings and displays it on your value stream map alongside cycle time, so you can instantly see which steps are bottlenecks. Free to start, no credit card.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#0FA876,#1DD1A1)', color: 'var(--bg)', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Calculate takt time on your VSM →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
