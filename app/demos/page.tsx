// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo Projects — VeSiMy | See It Working In Your Industry',
  description: 'Explore fully-built VeSiMy demo projects across manufacturing, healthcare, real estate, craft brewing, winemaking and more. Every tool populated with realistic data.',
  openGraph: {
    title: 'VeSiMy Demo Projects — Map any process. Find the waste. Fix the bottleneck.',
    description: 'See how VeSiMy works in your industry. Fully-built demos with real data, real bottlenecks, and every CI tool populated.',
    type: 'website',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const DEMOS = [
  {
    slug: 'manufacturing',
    name: 'Automotive Seat Assembly',
    industry: 'Manufacturing',
    color: '#3070B8',
    tagBg: '#EEF4FB',
    tagColor: '#1A4F8A',
    headline: 'Seat assembly line. 6 steps. Bottleneck at Foam & Fabric.',
    description: 'The original VeSiMy reference project — built from 12 years of real floor experience. A 6-step automotive seat assembly line with a live bottleneck (CT 145s vs Takt 120s), 2 branches, time studies, 5 Why drilled to root cause, and 4 open kaizen events.',
    bottleneck: 'Foam & Fabric Install — 145s vs 120s Takt',
    leadTime: '~18 min per seat',
    tools: ['VSM with 2 branches', 'Time Study', 'Fishbone (6M)', '5 Why', 'Waste ID', 'Kaizen Events', 'Improvement Goals'],
    keyInsight: 'PFMEA gate does not mandate material flow audit on takt revision — foam rack never relocated.',
    href: '/auth/signup?ref=1',
    cta: 'Load manufacturing demo',
  },
  {
    slug: 'healthcare',
    name: 'Urgent Care Patient Flow',
    industry: 'Healthcare',
    color: '#2A9E82',
    tagBg: '#E6F7F3',
    tagColor: '#0F6E56',
    headline: 'Patient flow from arrival to discharge. 3.2-hour lead time vs 45-min takt.',
    description: 'A 7-step urgent care value stream from patient arrival to discharge. Physician assessment wait (35 min), lab turnaround variation, and a treatment bottleneck at 52 min. 5 Why traces the root cause to a complete absence of CI structure in the department.',
    bottleneck: 'Treatment & Intervention — 52 min vs 45-min Takt',
    leadTime: '3.2 hrs average door-to-discharge',
    tools: ['VSM', 'Time Study (4 steps)', 'Fishbone (6M)', '5 Why', 'Waste ID', '4 Kaizen Events', 'Improvement Goals'],
    keyInsight: 'Staff observe the bottleneck daily but no mechanism exists to escalate it through data.',
    href: '/auth/signup?demo=healthcare',
    cta: 'Load healthcare demo',
  },
  {
    slug: 'realestate',
    name: 'Real Estate Transaction Flow',
    industry: 'Real Estate',
    color: '#0176D3',
    tagBg: '#FDF5E0',
    tagColor: '#8A6300',
    headline: 'Lead to close. 45-day lead time. 28% document kickback rate.',
    description: 'A 7-step real estate transaction value stream from lead inquiry to closing. The bottleneck is Financing & Underwriting — 10-day lender wait, 28% of files kicked back for missing documents, 35% of offers rejected. Days on market is cycle time. Fall-through rate is a defect rate.',
    bottleneck: 'Financing & Underwriting — 10 business days, 28% rework',
    leadTime: '~45 days average lead-to-close',
    tools: ['VSM', 'Time Study (3 steps)', 'Fishbone (6M)', '5 Why', 'Waste ID', '4 Kaizen Events', 'Improvement Goals'],
    keyInsight: 'No standard work exists for the transaction coordinator role — every agent reinvents the process.',
    href: '/auth/signup?demo=realestate',
    cta: 'Load real estate demo',
  },
  {
    slug: 'brewery',
    name: 'Craft Brewery Batch Production',
    industry: 'Food & Beverage',
    color: '#C0402A',
    tagBg: '#FEF0ED',
    tagColor: '#8A2A1A',
    headline: '10-barrel craft brewery. 8 steps. Fermenter capacity is the constraint.',
    description: 'A complete brewing value stream from grain milling to packaged product. Only 6 fermenters against 6-day fermentation time creates a hard capacity ceiling of 4 batches/week. Taproom demand requires 5. Canning line uptime at 88% with 3% underfill from a worn seamer head.',
    bottleneck: 'Fermentation — 6 tanks, 6-day cycle, demand outpacing capacity',
    leadTime: '21 days grain-to-glass',
    tools: ['VSM', 'Time Study (3 steps)', 'Fishbone (6M)', '5 Why (stuck sparge)', 'Waste ID', '4 Kaizen Events', 'Improvement Goals'],
    keyInsight: 'Recipes were never updated when equipment scaled from 3-barrel to 10-barrel — stuck sparge on every rye batch.',
    href: '/auth/signup?demo=brewery',
    cta: 'Load brewery demo',
  },
  {
    slug: 'winery',
    name: 'Boutique Winery Production',
    industry: 'Food & Beverage',
    color: '#6426A0',
    tagBg: '#F0EEFE',
    tagColor: '#6426A0',
    headline: '2,000-case boutique producer. 18-month lead time. Barrel capacity constraint.',
    description: 'An 8-step winery value stream from harvest crush to bottled wine. 80 barrels at capacity with 6% defect rate from TCA and volatile acidity — caused by no individual barrel tracking system. DTC demand growing 18% annually but output capped. Winery scaled 5x without updating its operations.',
    bottleneck: 'Barrel Ageing — 80 barrels at capacity, 18-month tie-up, 6% loss rate',
    leadTime: '18 months crush to bottle',
    tools: ['VSM', 'Time Study (3 steps)', 'Fishbone (6M)', '5 Why (barrel defects)', 'Waste ID', '4 Kaizen Events', 'Improvement Goals'],
    keyInsight: 'No formal operations review as the winery grew 5x — tracking and processes that worked at 400 cases collapsed at 2,000.',
    href: '/auth/signup?demo=winery',
    cta: 'Load winery demo',
  },
]

export default function DemosPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0', fontFamily: 'Arial, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#242220', padding: '0 clamp(16px,4vw,48px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0176D3', fontFamily: serif }}>VeSiMy</span>
          <span style={{ fontSize: 11, color: 'rgba(248,247,245,0.4)', fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase' }}>Demos</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'rgba(248,247,245,0.6)', fontSize: 13, textDecoration: 'none' }}>Home</Link>
          <Link href="/auth/signup" style={{ background: '#0176D3', color: '#0D0C0A', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Start free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#242220', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,48px)', textAlign: 'center', borderBottom: '3px solid #0176D3' }}>
        <div style={{ fontSize: 11, color: '#0176D3', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, marginBottom: 16 }}>Live Demo Projects</div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, color: '#F8F7F5', lineHeight: 1.15, marginBottom: 20 }}>
          See VeSiMy working<br />in your world.
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(248,247,245,0.65)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.8 }}>
          Every demo is a fully-built project — real bottlenecks, real root causes, every CI tool populated with realistic data. Click any demo to load it instantly into your free account.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {DEMOS.map(d => (
            <span key={d.slug} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(248,247,245,0.6)', fontFamily: 'monospace', letterSpacing: 0.5 }}>
              {d.icon} {d.industry}
            </span>
          ))}
        </div>
      </div>

      {/* Demo cards */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {DEMOS.map((demo, i) => (
            <div key={demo.slug} style={{ background: '#FFFFFF', border: '0.5px solid #D8D5CE', borderRadius: 16, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr auto', gap: 0 }}>
              <div style={{ padding: 'clamp(24px,3vw,36px)', borderRight: '0.5px solid #D8D5CE' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>{demo.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: demo.tagBg, color: demo.tagColor, fontFamily: 'monospace', letterSpacing: 0.5 }}>{demo.industry}</span>
                      <span style={{ fontSize: 11, color: '#8E8A82', fontFamily: 'monospace' }}>Demo {String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, color: '#242220', fontFamily: serif, lineHeight: 1.2 }}>{demo.name}</h2>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: '#6B6760', lineHeight: 1.75, marginBottom: 16, maxWidth: 560 }}>{demo.description}</p>

                {/* Key metrics row */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(192,64,42,0.06)', border: '1px solid rgba(192,64,42,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 9, color: '#C0402A', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 2 }}>BOTTLENECK</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#242220' }}>{demo.bottleneck}</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: '#F8F6F0', border: '1px solid #D8D5CE', borderRadius: 8 }}>
                    <div style={{ fontSize: 9, color: '#8E8A82', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 2 }}>LEAD TIME</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#242220' }}>{demo.leadTime}</div>
                  </div>
                </div>

                {/* Tools included */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: '#8E8A82', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Tools included</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {demo.tools.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: `${demo.color}10`, border: `1px solid ${demo.color}25`, color: demo.color, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Key insight */}
                <div style={{ padding: '10px 14px', background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 8, borderLeft: `3px solid #0176D3` }}>
                  <span style={{ fontSize: 10, color: '#0176D3', fontFamily: 'monospace', fontWeight: 700 }}>ROOT CAUSE FINDING: </span>
                  <span style={{ fontSize: 12, color: '#4E4B45', lineHeight: 1.5 }}>{demo.keyInsight}</span>
                </div>
              </div>

              {/* CTA column */}
              <div style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minWidth: 180, textAlign: 'center', background: '#FAFAF8' }}>
                <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: demo.color, padding: '4px 10px', background: `${demo.color}18`, border: `1px solid ${demo.color}35`, borderRadius: 6, display: 'inline-block', letterSpacing: 1, marginBottom: 8 }}>{demo.industry.split(' ')[0]}</div>
                <Link href={demo.href} style={{ display: 'block', width: '100%', padding: '12px 16px', background: demo.color, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center', lineHeight: 1.4 }}>
                  {demo.cta}
                </Link>
                <p style={{ fontSize: 11, color: '#8E8A82', lineHeight: 1.5 }}>Free account.<br />No card needed.</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 56, padding: '40px 24px', background: '#242220', borderRadius: 16, border: '0.5px solid #353330' }}>
          <div style={{ fontSize: 11, color: '#0176D3', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 12 }}>Your industry</div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(20px,3vw,30px)', fontWeight: 700, color: '#F8F7F5', marginBottom: 14 }}>
            Don't see your process here?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(248,247,245,0.55)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.8 }}>
            If you have a process, VeSiMy works for it. Start with a blank project and map your own value stream — or tell us what demo you'd like to see next.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ padding: '12px 24px', background: '#0176D3', color: '#0D0C0A', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Start with a blank project →
            </Link>
            <Link href="mailto:hello@vesimy.com?subject=Demo request" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.08)', color: '#F8F7F5', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Request a demo →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px', borderTop: '0.5px solid #D8D5CE', color: '#8E8A82', fontSize: 12 }}>
        <Link href="/" style={{ color: '#0176D3', textDecoration: 'none', fontWeight: 700 }}>VeSiMy</Link>
        {' · '}Map any process. Find the waste. Fix the bottleneck.
        {' · '}
        <Link href="/auth/signup" style={{ color: '#8E8A82', textDecoration: 'none' }}>Start free</Link>
      </div>
    </div>
  )
}
