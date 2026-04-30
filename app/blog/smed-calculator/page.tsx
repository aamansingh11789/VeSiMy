import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SMED Calculator: Reduce Changeover Time & Calculate Annual Savings — VeSiMy',
  description: 'Free SMED calculator for manufacturers. Enter your changeover steps, classify Internal vs External, and see exactly how much time and money you recover. Built on Shingo methodology.',
  keywords: ['SMED calculator', 'changeover time calculator', 'SMED methodology', 'single minute exchange of die', 'changeover reduction', 'setup time reduction', 'lean manufacturing changeover', 'internal external setup'],
  openGraph: {
    title: 'SMED Calculator: Free Changeover Time & Savings Calculator',
    description: 'Calculate exactly how much time and money you recover by converting internal changeover steps to external. Free tool built on Shingo SMED methodology.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function SMEDCalculatorPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(1,118,211,0.12)', color: '#0176D3', fontFamily: 'monospace', letterSpacing: 1.5 }}>TOOL GUIDE</span>
            <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'monospace' }}>7 min read · March 19, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            SMED Calculator: How to Calculate Changeover Savings Before You Touch a Wrench
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Most changeover reduction projects start with gut feel. This one starts with numbers. Before you change a single procedure, a SMED calculator shows you exactly where the time goes — and what you recover when you apply Shingo's three-stage methodology.
          </p>
        </div>

        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What is SMED?</h2>
          <p style={{ marginBottom: 18 }}>
            SMED — Single-Minute Exchange of Die — is the methodology developed by Shigeo Shingo at Toyota in the 1950s and 60s. The goal is to reduce every changeover to under 10 minutes. The name comes from the target: single-digit minutes. Not zero, not five — under ten.
          </p>
          <p style={{ marginBottom: 18 }}>
            The core insight is deceptively simple: not everything that happens during a changeover actually requires the machine to be stopped. Tasks like retrieving tools, pre-heating components, staging materials, and completing paperwork can all be done while the previous run is still producing. Shingo called these External steps. The tasks that genuinely require the machine to be stopped — physical die changes, fixture adjustments, calibration — are Internal steps.
          </p>
          <p style={{ marginBottom: 18 }}>
            Most operations that haven't applied SMED are running 60–80% of their changeover time as Internal when 30–50% of it could safely move to External. That's the recoverable time a SMED calculator quantifies before you start.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The three stages of SMED</h2>

          {[
            {
              stage: 'Stage 1 — Observe and record',
              desc: 'Video the entire changeover as it actually happens — not how the SOP says it should happen. Document every step, in sequence, with times. Do not improve yet. This stage produces the baseline your SMED calculator works from.',
            },
            {
              stage: 'Stage 2 — Separate Internal from External',
              desc: 'For each recorded step, ask one question: does this step require the machine to be stopped? If yes, it is Internal. If no — if it could be done while the previous batch is running or while the next run is setting up — it is External. Mark every step.',
            },
            {
              stage: 'Stage 3 — Convert Internal to External',
              desc: 'Take every step marked as convertible and redesign the procedure so it happens outside the machine-stopped window. Pre-stage tooling. Pre-heat fixtures. Complete all paperwork before the last piece. This is where the time savings are realised.',
            },
          ].map(item => (
            <div key={item.stage} style={{ background: 'rgba(1,118,211,0.05)', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 12, padding: '18px 20px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6, fontFamily: serif, fontSize: 16 }}>{item.stage}</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to use a SMED calculator</h2>
          <p style={{ marginBottom: 18 }}>
            A SMED calculator takes your recorded changeover steps, classified as Internal, External, or Waste/NVA, and calculates three numbers:
          </p>

          {[
            ['Convertible Internal time', 'The portion of Internal time that could move to External with procedure changes. This is your primary target.'],
            ['SMED target minimum', 'What your changeover looks like after conversion and waste elimination. This is the realistic floor.'],
            ['Annual $ savings', 'Convert time saved × changeovers per year × labour rate. This is the number you take to management.'],
          ].map(([term, def]) => (
            <div key={term} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0176D3', marginTop: 9, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{term}: </span>
                <span>{def}</span>
              </div>
            </div>
          ))}

          <p style={{ marginBottom: 18, marginTop: 10 }}>
            For example: a food and beverage line with a 45-minute changeover running 3 times per day, 250 days per year. If SMED analysis reveals 18 minutes of convertible internal time and 7 minutes of waste, the new changeover is 20 minutes. That's 25 minutes saved per changeover × 750 changeovers per year = 312 hours recovered. At $45/hour fully loaded, that's $14,000 per year — from process changes alone, before any capital investment.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What most SMED projects miss</h2>
          <p style={{ marginBottom: 18 }}>
            The calculation is straightforward. The discipline is not. There are three failure modes that kill SMED projects before they deliver:
          </p>
          <p style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--text)' }}>Skipping Stage 1.</strong> Teams jump straight to solutions before documenting what actually happens. The changeover they improve is the one from the SOP, not the one their operators actually run. The real changeover contains 8–12 minutes of informal steps that never appear in any document.
          </p>
          <p style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--text)' }}>Treating all Internal as fixed.</strong> Most teams assume Internal steps cannot be touched. Many of them can — not moved to External, but dramatically shortened through quick-connect tooling, colour-coding, standard kits, and parallel workflows. Stage 4 of the full SMED methodology addresses this.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>No Standard Work after the event.</strong> You reduce changeover time in the kaizen event. Six months later the time creeps back. Without Standard Work documenting the new sequence and training records showing every operator has been certified on it, the improvement isn't an improvement — it's a one-time event.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>SMED in VeSiMy</h2>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's SMED tool builds the calculator directly into your value stream. You record every changeover step with a built-in stopwatch, classify each as Internal, External, or Waste/NVA, and the tool calculates your SMED potential, target minimum, and annual ROI in real time. When you're done, a single click exports an ISO 9001:2015 §8.5.1 compliant PDF report with the full step analysis, financial impact, and the five-stage implementation roadmap.
          </p>
          <p style={{ marginBottom: 18 }}>
            Because SMED lives inside the same project as your VSM, the improved changeover time feeds directly back into your value stream — so your PCE and lead time calculations reflect the actual post-improvement state, not a spreadsheet guess.
          </p>

          <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 12, padding: '20px 24px', marginTop: 32, marginBottom: 8 }}>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Try the SMED calculator free</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.7 }}>Record your changeover steps, classify them, and see your savings calculation — with ISO export when you're ready to present it.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0176D3', color: '#0D0C0A', padding: '10px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Start free — no credit card →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
