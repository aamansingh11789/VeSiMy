import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Aerospace Manufacturing, VeSiMy',
  description: "Aerospace manufacturing runs on precision, documentation, and zero-tolerance for error. Here\'s how structured CI tools support quality, compliance, and operational efficiency in aerospace.",
  keywords: ['aerospace process improvement', 'lean aerospace', 'AS9100 continuous improvement', 'aerospace CAPA', 'aerospace manufacturing CI'],
  openGraph: {
    title: 'Process Improvement in Aerospace: When Zero Defects Is the Floor',
    description: 'How VeSiMy supports structured improvement in low-volume, high-complexity aerospace operations.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function AerospaceBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(108,185,252,0.15)', color: '#6CB9FC', fontFamily: 'monospace', letterSpacing: 1.5 }}>AEROSPACE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>9 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Process Improvement in Aerospace: Where Zero Defects Is the Floor, Not the Goal
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            In aerospace, the consequences of a failed process aren't measured in customer returns or warranty costs. They're measured in grounded aircraft, failed audits, and in the worst cases, loss of life. That's why every aerospace operation has documented processes. The question is whether those processes are actually being improved, or just maintained.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The aerospace process paradox</h2>
          <p style={{ marginBottom: 18 }}>
            Aerospace manufacturers are often among the most process-literate organizations in the world. AS9100 certification requires documented procedures, change management, and formal CAPA systems. Most aerospace shops have all of these.
          </p>
          <p style={{ marginBottom: 18 }}>
            And yet, non-conformance costs in aerospace programs routinely run at 10–15% of total program cost. Not because the documentation is missing. But because the documentation describes the process as it was designed, not the process as it's actually running today.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>The gap between the procedure and the practice is where quality escapes live.</strong>
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What makes aerospace process improvement different</h2>
          {[
            ['Low volume, high complexity', 'You might build 12 units per year, not 12,000. Traditional statistical process control requires sample sizes that aerospace operations can\'t provide. Every unit is a data point, every deviation is significant.'],
            ['Sequence-sensitive operations', 'Out-of-sequence work is one of the leading causes of aerospace non-conformances. When a fastener gets installed before its mating surface is treated, no amount of downstream inspection catches it without disassembly.'],
            ['Traceability requirements', 'Every fastener, every material lot, every tool calibration record must be traceable. A process improvement that creates ambiguity in the traceability chain is worse than no improvement at all.'],
            ['First-time quality is the only quality', 'Rework in aerospace isn\'t a recovery option, it\'s a conformance event that requires its own documentation, re-inspection, and often engineering disposition. The process has to be right the first time.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(108,185,252,0.06)', border: '1px solid rgba(108,185,252,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Where VeSiMy applies in aerospace operations</h2>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Kaizen events for high-impact process stations</h3>
          <p style={{ marginBottom: 18 }}>
            In aerospace, kaizen isn't about speed. It's about removing the conditions that make errors possible. A focused kaizen on a critical assembly station, torque application, seal installation, harness routing, can restructure the workspace, the tooling, and the work sequence to make the correct method the only practical method.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Kaizen module structures these events with pre-work, team documentation, and improvement tracking, so the output isn't a whiteboard photo but a formal record of what changed, why, and what the measured result was.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Fishbone + 5 Why for non-conformance investigation</h3>
          <p style={{ marginBottom: 18 }}>
            When a non-conformance occurs in aerospace, the regulatory expectation is a structured root cause analysis, not a narrative paragraph in a quality report. Fishbone diagrams (Ishikawa) and 5 Why analysis are the industry-recognized formats for this work.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Fishbone and 5 Why tools produce documented, structured analyses that can be attached directly to a corrective action record. The format satisfies AS9100 CAPA requirements while ensuring the team doesn't stop at the immediate cause.
          </p>

          <div style={{ borderLeft: '3px solid #6CB9FC', paddingLeft: 20, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "The best CAPA is the one that eliminates the conditions for the failure, not just the failure itself."
            </p>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Time Study for shop floor scheduling and manning</h3>
          <p style={{ marginBottom: 18 }}>
            In a low-volume aerospace environment, accurate labor hour estimates are the basis for program pricing, delivery commitments, and resource planning. Most aerospace shops rely on historical actuals and engineering estimates, which are often 20–40% off for novel assemblies.
          </p>
          <p style={{ marginBottom: 18 }}>
            Running a structured time study on new assemblies during first article production gives the program office real data for future pricing, and gives the production team a clear baseline for improvement on follow-on units.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The CI discipline aerospace already respects</h2>
          <p style={{ marginBottom: 18 }}>
            Aerospace organizations are already conditioned for structured problem-solving. They write corrective actions, they hold technical reviews, they conduct lessons-learned sessions. VeSiMy doesn't ask them to change their culture, it gives their existing CI discipline a consistent set of digital tools that make the work faster and the outputs more traceable.
          </p>
          <p style={{ marginBottom: 18 }}>
            When your quality team runs a root cause analysis in VeSiMy, the output is structured data, not a Word document formatted differently by each engineer who runs the process.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for aerospace teams:</strong> AS9100 requires continuous improvement. VeSiMy gives you the tools to make that requirement real, not just documented.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-block', background: '#0176D3', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
              Start a free project
            </Link>
            <Link href="/industries" style={{ display: 'inline-block', border: '1px solid rgba(44,44,92,0.3)', color: 'var(--text)', fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
              ← All Industries
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
