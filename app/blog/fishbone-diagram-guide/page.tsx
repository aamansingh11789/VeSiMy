import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fishbone Diagram: How to Run an Ishikawa Analysis That Actually Finds the Root Cause, VeSiMy',
  description: 'A fishbone diagram that just lists "people, process, equipment" is not a root cause analysis. Here is how to run one that actually works, with real manufacturing examples.',
  keywords: ['fishbone diagram', 'Ishikawa diagram', 'fishbone diagram manufacturing', 'cause and effect diagram', 'root cause analysis fishbone', '6M fishbone', 'Ishikawa analysis examples', 'fishbone diagram template'],
  openGraph: {
    title: 'Fishbone Diagram: How to Run an Ishikawa Analysis That Actually Finds the Root Cause',
    description: 'Most fishbone diagrams list causes without finding them. Here is the version that works.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function FishboneDiagramPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(100,38,160,0.12)', color: '#6426A0', fontFamily: 'monospace', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'monospace' }}>7 min read · March 19, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Fishbone Diagram: How to Run an Ishikawa Analysis That Actually Finds the Root Cause
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Most fishbone diagrams produce a wall of brainstorm output and no actionable finding. The problem isn't the tool, it's how teams use it. The fishbone is a structured hypothesis framework, not a whiteboard free-for-all.
          </p>
        </div>

        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What the fishbone diagram actually is</h2>
          <p style={{ marginBottom: 18 }}>
            The Ishikawa diagram, named after Kaoru Ishikawa, who developed it at Kawasaki in the 1960s, is a cause-and-effect analysis tool. It structures potential causes of a problem into categories, with the goal of generating a complete picture before narrowing to the most likely root cause.
          </p>
          <p style={{ marginBottom: 18 }}>
            The key word is "before." The fishbone is not meant to identify the root cause on its own. It is meant to surface every plausible category of cause so that the team does not miss something obvious by focusing too early. The 5 Why analysis then drills into the most credible branch.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The 6M framework for manufacturing</h2>
          <p style={{ marginBottom: 16 }}>For manufacturing environments, the standard framework is 6M. Each category prompts a different line of investigation:</p>

          {[
            ['Man (People)', 'Training, certification, experience, fatigue, adherence to procedure. The most common category and the most misused, "operator error" is a symptom, not a root cause.'],
            ['Machine (Equipment)', 'Wear, calibration, setup, maintenance intervals, age. Always check whether the problem correlates with a specific machine or shifts across all machines.'],
            ['Method (Process)', 'Standard work gaps, SOP accuracy, sequence variability, measurement methods. If the standard allows variation, the variation isn\'t the cause, the standard is.'],
            ['Material', 'Supplier variation, incoming inspection, storage conditions, batch traceability. Problems that start intermittently and improve or worsen after a delivery are often material-driven.'],
            ['Measurement', 'Gauge R&R, calibration status, measurement system consistency. A significant fraction of quality escapes turn out to be measurement problems rather than process problems.'],
            ['Mother Nature (Environment)', 'Temperature, humidity, contamination, shift timing, seasonal variation. Often overlooked, sometimes decisive, particularly in electronics, food, and pharmaceutical environments.'],
          ].map(([cat, desc]) => (
            <div key={cat} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{cat}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to run the session correctly</h2>

          <p style={{ marginBottom: 14 }}><strong style={{ color: 'var(--text)' }}>Start with a precisely defined problem statement.</strong> "High defect rate" is not a problem statement. "Weld joint rejection rate at Station 4 is 3.2% against a target of 0.5%, occurring on the day shift between 10:00 and 14:00 since March 11" is a problem statement. The more specific the effect, the more specific the causes will be.</p>

          <p style={{ marginBottom: 14 }}><strong style={{ color: 'var(--text)' }}>Fill every category before evaluating any.</strong> The discipline of the tool is in completing the full picture before narrowing. Teams that short-circuit to their favourite explanation skip the category that contains the actual cause. Go around the full 6M before anyone argues for a specific branch.</p>

          <p style={{ marginBottom: 14 }}><strong style={{ color: 'var(--text)' }}>Use evidence to score each branch.</strong> After brainstorming, ask for each potential cause: do we have data that supports or contradicts this? A cause with supporting evidence gets prioritised. A cause that is plausible but unverified gets flagged for investigation. A cause contradicted by existing data gets removed.</p>

          <p style={{ marginBottom: 18 }}><strong style={{ color: 'var(--text)' }}>Transition to 5 Why on the highest-priority branch.</strong> The fishbone finds the most credible direction. The 5 Why goes to the bottom of it. They are sequential tools, the fishbone is not complete until it feeds a deeper analysis.</p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>A real manufacturing example</h2>
          <p style={{ marginBottom: 10 }}>Problem: Dimension out of tolerance on machined bore, 4.2% rejection rate, target 0.5%.</p>

          {[
            { cat: 'Man', causes: ['Operator B is new and hasn\'t been certified on the post-shift warm-up procedure', 'Shift handover notes not consistently completed'] },
            { cat: 'Machine', causes: ['Spindle bearing showing early wear, vibration measurement elevated', 'Tool holder showing 0.003mm runout at inspection'] },
            { cat: 'Method', causes: ['Warm-up procedure specifies 15 min but SOP says 5 min, discrepancy not resolved', 'First-piece inspection sometimes skipped when line is behind'] },
            { cat: 'Material', causes: ['Incoming billet hardness varies 12% across suppliers', 'Last batch from Supplier B showed higher hardness'] },
            { cat: 'Measurement', causes: ['Gauge last calibrated 14 months ago, 12-month interval', 'Two gauges in use, no study on inter-gauge correlation'] },
            { cat: 'Environment', causes: ['Machine located near dock door, temperature swing of 8°C over shift', 'Coolant concentration not checked since maintenance window'] },
          ].map(item => (
            <div key={item.cat} style={{ marginBottom: 12, background: 'rgba(248,247,245,0.5)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6, fontSize: 14 }}>{item.cat}</div>
              {item.causes.map(c => (
                <div key={c} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13 }}>
                  <span style={{ color: '#0176D3', flexShrink: 0 }}>→</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          ))}

          <p style={{ marginTop: 18, marginBottom: 18 }}>
            After evidence review: the gauge calibration lapse and the warm-up procedure discrepancy both had supporting data. The team ran a 5 Why on each. The warm-up discrepancy traced to a standard work update in January that was not propagated to the SOP, a change management failure, not an operator failure. That's the root cause.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Fishbone in VeSiMy</h2>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Fishbone tool supports 6M Manufacturing, 8P Service, 4S, and Custom frameworks. Causes are added by category, and the AI can generate initial cause suggestions based on the problem statement and your process context. When the analysis is complete, it feeds directly into the 5 Why tool on the same step, the problem statement carries over and the team doesn't re-enter context. The combined analysis exports as an ISO 9001:2015 §10.2.1 compliant root cause report.
          </p>

          <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Run a Fishbone analysis free</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.7 }}>Connected to 5 Why and your VSM. AI-assisted cause generation. ISO export when you need it.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0176D3', color: '#0D0C0A', padding: '10px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Start free →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
