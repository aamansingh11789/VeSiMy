// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Industries — VeSiMy | Process Improvement for Every Industry',
  description: 'If you have a process, VeSiMy can help you improve it. Manufacturing, healthcare, real estate, legal, construction, logistics and beyond — the same structured method, applied to your world.',
  keywords: ['continuous improvement', 'lean manufacturing industries', 'process improvement', 'automotive CI', 'aerospace lean', 'pharmaceutical process improvement'],
  openGraph: {
    title: 'VeSiMy | Map any process. Find the waste. Fix the bottleneck.',
    description: 'VSM, time study, root cause analysis, and kaizen — for manufacturing, healthcare, real estate, legal, logistics and any other process-driven business.',
    type: 'website',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const industries = [
  {
    slug: 'automotive-process-improvement',
    icon: '',
    name: 'Automotive',
    color: '#0176D3',
    tagline: 'Build quality in. Don\'t inspect it in.',
    challenge: 'Takt-driven lines, model-mix complexity, supplier quality cascades. One second of cycle time deviation can ripple into millions in annual cost.',
    tools: ['Time Study', 'Value Stream Map', 'Waste ID', '5 Why'],
    stat: '94% of automotive defects trace to process variation, not people.',
  },
  {
    slug: 'aerospace-process-improvement',
    icon: '',
    name: 'Aerospace',
    color: '#6CB9FC',
    tagline: 'Zero defects isn\'t a goal. It\'s the floor.',
    challenge: 'Low-volume, high-complexity assemblies where one missed torque spec or out-of-sequence operation can ground a fleet. Documentation trails must be airtight.',
    tools: ['Kaizen', 'Fishbone', '5 Why', 'Time Study'],
    stat: 'Non-conformance costs in aerospace average 10–15% of total program cost.',
  },
  {
    slug: 'food-beverage-process-improvement',
    icon: '',
    name: 'Food & Beverage',
    color: '#1DD1A1',
    tagline: 'Freshness is a process problem.',
    challenge: 'Shelf life, changeover between SKUs, sanitation downtime, yield loss, and food safety compliance — all fighting for the same line hours.',
    tools: ['Kaizen', 'Waste ID', 'Value Stream Map', 'Time Study'],
    stat: 'Up to 30% of food production costs come from preventable process losses.',
  },
  {
    slug: 'medical-devices-process-improvement',
    icon: '',
    name: 'Medical Devices',
    color: '#FF6B6B',
    tagline: 'FDA doesn\'t grade on a curve.',
    challenge: 'Design History Files, Device History Records, CAPA loops, and validation protocols — all while hitting production targets. Traceability is non-negotiable.',
    tools: ['5 Why', 'Fishbone', 'Kaizen', 'Improvement Log'],
    stat: 'Over 60% of FDA 483 observations cite inadequate CAPA systems.',
  },
  {
    slug: 'logistics-process-improvement',
    icon: '',
    name: 'Logistics',
    color: '#F7971E',
    tagline: 'Speed without structure is just chaos.',
    challenge: 'Dock-to-stock time, pick accuracy, wave planning, and last-mile delivery windows — all measured to the minute by customers who switched carriers once already.',
    tools: ['Time Study', 'Value Stream Map', 'Waste ID', 'Kaizen'],
    stat: 'Warehouses lose an average of 3,000 hours per year to preventable motion and waiting waste.',
  },
  {
    slug: 'electronics-process-improvement',
    icon: '',
    name: 'Electronics',
    color: '#8C44CC',
    tagline: 'Yield loss isn\'t in the component. It\'s in the process.',
    challenge: 'SMT line OEE, solder defect rates, ESD discipline, rework ratios, and the brutal economics of scrapping a $400 PCB because of a $0.02 process step.',
    tools: ['Time Study', 'Fishbone', '5 Why', 'Waste ID'],
    stat: 'Each rework event in electronics costs 5–10x more than building it right the first time.',
  },
  {
    slug: 'pharmaceuticals-process-improvement',
    icon: '',
    name: 'Pharmaceuticals',
    color: '#1DD1A1',
    tagline: 'Every deviation is a documented failure or a documented lesson.',
    challenge: 'Batch record compliance, deviation investigation, GMP documentation, and a regulatory environment where the cost of getting it wrong is measured in recalls and consent decrees.',
    tools: ['5 Why', 'Fishbone', 'CAPA / Improvement Log', 'Kaizen'],
    stat: 'Drug recalls cost an average of $10M+ per event — most root causes were process-level.',
  },
  {
    slug: 'industrial-process-improvement',
    icon: '',
    name: 'Industrial',
    color: '#0176D3',
    tagline: 'The machine doesn\'t know it\'s inefficient. You have to tell it.',
    challenge: 'Heavy equipment, custom job shops, made-to-order production, and maintenance-intensive environments where OEE and changeover are the biggest levers left.',
    tools: ['Value Stream Map', 'Time Study', 'Kaizen', 'Waste ID'],
    stat: 'Average industrial OEE sits at 60%. World-class is 85%. VeSiMy closes the gap.',
  },
]

export default function IndustriesPage() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 56 }}>
          ← Back to VeSiMy
        </Link>

        {/* Hero */}
        <div style={{ maxWidth: 720, marginBottom: 72 }}>
          <p style={{ fontSize: 11, color: '#0176D3', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 14, textTransform: 'uppercase' }}>
            Industries
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(34px,4.5vw,56px)', fontWeight: 700, color: 'var(--text)', marginBottom: 20, lineHeight: 1.1 }}>
            If You Have a Process,<br />VeSiMy Can Help You Improve It
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.85, marginBottom: 28 }}>
            VeSiMy is not an automotive tool. It is not a pharma tool. It is a <strong style={{ color: 'var(--text)' }}>process improvement tool</strong> — and every industry runs on processes.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85, marginBottom: 28 }}>
            The 8 wastes don't check your industry badge before they show up on your floor. Waiting waste in a medical device cleanroom looks different from waiting waste in an automotive assembly plant — but they both have the same root structure: a process that was never fully seen, never fully measured, and never formally improved.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85 }}>
            VeSiMy gives every team — regardless of what they make — the tools to see their process clearly, measure it honestly, and improve it systematically.
          </p>
        </div>

        {/* Philosophy block */}
        <div style={{
          background: 'rgba(1,118,211,0.06)',
          border: '1px solid rgba(1,118,211,0.25)',
          borderRadius: 20,
          padding: 'clamp(28px,4vw,48px)',
          marginBottom: 72,
        }}>
          <p style={{ fontSize: 11, color: '#0176D3', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 16, textTransform: 'uppercase' }}>
            The Core Belief
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: 'var(--text)', marginBottom: 20, lineHeight: 1.2 }}>
            Industry-specific language. Universal process logic.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {[
              ['Every process has waste in it', 'Not because your team isn\'t trying. Because waste is the default state of any unexamined process. VeSiMy makes it visible.'],
              ['Every team can improve', 'You don\'t need a Six Sigma Black Belt or a $200k consulting engagement. You need structured tools, consistently applied.'],
              ['Improvement compounds', 'A 5% cycle time reduction today. A defect eliminated next month. A changeover halved next quarter. The math surprises people.'],
            ].map(([title, body]) => (
              <div key={title}>
                <div style={{ fontWeight: 700, color: '#0176D3', fontSize: 14, marginBottom: 8, fontFamily: serif }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry cards */}
        <p style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 28, textTransform: 'uppercase' }}>
          Explore by Industry
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(400px,1fr))', gap: 24, marginBottom: 80 }}>
          {industries.map((ind) => (
            <Link key={ind.slug} href={`/blog/${ind.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{
                background: 'rgba(248,247,245,0.97)',
                border: '1px solid rgba(44,44,92,0.86)',
                borderRadius: 18,
                padding: '28px 28px 24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 32, lineHeight: 1 }}>{ind.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 1.5, color: ind.color, marginBottom: 4 }}>
                      {ind.name.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                      {ind.tagline}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 18, flex: 1 }}>
                  {ind.challenge}
                </p>

                <div style={{ background: `${ind.color}12`, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: ind.color, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                    {ind.stat}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {ind.tools.map(t => (
                    <span key={t} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, border: `1px solid ${ind.color}40`, color: ind.color, fontFamily: 'monospace', fontWeight: 700 }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: 13, color: '#0176D3', textAlign: 'right' }}>
                  Read the guide →
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: 'rgba(44,44,92,0.05)',
          border: '1px solid rgba(44,44,92,0.15)',
          borderRadius: 20,
          padding: 'clamp(28px,4vw,48px)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
            Your industry isn't on this list?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            If your work involves a repeatable process — any process — VeSiMy was built for it. Start a free project and find out what's hiding in your workflow.
          </p>
          <Link href="/demo" style={{
            display: 'inline-block',
            background: '#0176D3',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            padding: '12px 28px',
            borderRadius: 10,
            textDecoration: 'none',
            letterSpacing: 0.5,
          }}>
            Try VeSiMy Free →
          </Link>
        </div>

      </div>
    </div>
  )
}
