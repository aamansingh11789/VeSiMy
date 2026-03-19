// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDCA in Manufacturing: The Complete Guide for 2026 — VeSiMy',
  description: 'PDCA (Plan-Do-Check-Act) is the backbone of every ISO 9001 quality system and lean improvement program. Learn how to use it, how it connects to A3, 8D, and DMAIC, and how to run your first cycle.',
  keywords: ['PDCA manufacturing', 'plan do check act', 'PDCA vs DMAIC', 'A3 report', '8D problem solving', 'continuous improvement cycle', 'ISO 9001 PDCA'],
  openGraph: {
    title: 'PDCA in Manufacturing: The Complete Guide',
    description: 'How to run Plan-Do-Check-Act cycles that actually stick — with A3, 8D, and DMAIC export options.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function PDCAPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(140,68,204,0.15)', color: '#8C44CC', fontFamily: 'monospace', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>9 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            PDCA in Manufacturing: The Complete Guide to Plan-Do-Check-Act
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            PDCA is the backbone of ISO 9001, lean manufacturing, and Six Sigma. Yet most teams run it wrong — they Plan, Do, skip Check entirely, and never Act. Here is how to use it correctly.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What is PDCA?</h2>
          <p style={{ marginBottom: 18 }}>
            PDCA (Plan-Do-Check-Act) is a four-phase improvement cycle developed by Walter Shewhart and popularised by W. Edwards Deming. It is the foundation of ISO 9001:2015 §10.3 (Continual Improvement) and the operating framework behind Toyota Production System, Six Sigma, and every modern quality management methodology.
          </p>
          <p style={{ marginBottom: 18 }}>
            The cycle is deceptively simple: identify a problem, hypothesise a solution, test it on a small scale, measure the result, and either standardise the improvement or adjust the hypothesis and run the next cycle. The power is in the repetition — each cycle builds on the last, driving continuous improvement rather than one-time fixes.
          </p>

          {[
            { phase: 'Plan', color: '#6CB9FC', icon: '📋', desc: 'Define the problem with data. Describe the current condition. Identify the root cause using 5 Why or Fishbone analysis. Set a specific, measurable target condition. Define what success looks like before you start. Write a hypothesis: "If we do X, we expect Y because Z."' },
            { phase: 'Do', color: '#D4A208', icon: '⚡', desc: 'Implement your countermeasure — but start small. Test on one shift, one product, one line before full rollout. Document exactly what was done, what challenges arose, and what was adjusted during implementation. The Do phase is an experiment, not a permanent change.' },
            { phase: 'Check', color: '#1DD1A1', icon: '📊', desc: 'Measure the result against the target you set in Plan. Use the same metrics. Was the hypothesis proven? By how much? Were there unexpected effects? This is the phase most teams skip — and it is the most important. Without Check, you are not running PDCA, you are just doing things.' },
            { phase: 'Act', color: '#8C44CC', icon: '🔁', desc: 'If the target was met: standardise the improvement. Update Standard Work, train all operators, update control plans. If the target was not met: the information you gathered in Check is the input to the next Plan phase. Either way, you move forward.' },
          ].map(({ phase, color, icon, desc }) => (
            <div key={phase} style={{ background: `${color}08`, border: `1px solid ${color}33`, borderRadius: 12, padding: '18px 20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color }}>
                  {phase}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>PDCA vs DMAIC vs A3 vs 8D — which do you use?</h2>
          <p style={{ marginBottom: 16 }}>All four frameworks ask the same questions in different orders with different names. Choose based on your audience and problem complexity:</p>

          {[
            { fmt: 'PDCA', color: '#D4A208', use: 'Most shop floor improvement problems. Fast cycles, simple to run, no special training required. Best for: CT reduction, WIP reduction, quality improvements, line balancing.' },
            { fmt: 'A3', color: '#1DD1A1', use: 'When you need to communicate the problem and solution on one page to management or across teams. Toyota\'s standard problem-solving communication format. Essentially PDCA on one sheet of A3 paper.' },
            { fmt: '8D', color: '#FF6B6B', use: 'Required by automotive customers (Ford, GM, Stellantis, IATF 16949) when a quality escape reaches a customer. Formal, structured, customer-facing. Same data as PDCA — different format and language.' },
            { fmt: 'DMAIC', color: '#6CB9FC', use: 'Complex, statistically-driven problems requiring months of data analysis. Six Sigma Black Belt territory. Use when PDCA has been tried and the root cause is not yet understood after multiple cycles.' },
          ].map(({ fmt, color, use }) => (
            <div key={fmt} style={{ display: 'flex', gap: 14, marginBottom: 14, background: 'rgba(248,247,245,0.97)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 10, padding: '14px 16px' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color, minWidth: 55, fontFamily: 'monospace' }}>{fmt}</span>
              <span style={{ fontSize: 13, lineHeight: 1.6 }}>{use}</span>
            </div>
          ))}

          <p style={{ marginBottom: 18, marginTop: 8 }}>
            The key insight: the underlying data is identical across all four. If you run a PDCA project properly — problem statement, root cause, countermeasures, before/after metrics, standardisation — you have everything needed to produce an A3, 8D, or DMAIC report without doing any additional work. VeSiMy generates all four from the same project data.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The most common PDCA failure modes</h2>
          {[
            ['Skipping the Check phase', 'The improvement gets implemented and declared successful before any measurement is done. Without Check, there is no learning — only assumption. Require before/after data for every PDCA cycle, no exceptions.'],
            ['Corrective actions that address symptoms', 'The countermeasure fixes the visible problem without addressing the root cause. Three weeks later the problem returns. A properly completed 5 Why, attached to the Plan phase, prevents this.'],
            ['No standardisation in Act', 'The improvement works and then reverts within 60 days because Standard Work was never updated and operators gradually drift back to the old method. Act must include updating documentation and retraining.'],
            ['Starting too big', 'Teams try to solve the entire problem in one PDCA cycle. Keep cycles small — one problem, one step, one shift. Fast cycles with clear learning are more valuable than slow comprehensive projects.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ background: 'rgba(255,107,107,0.04)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#FF6B6B', marginBottom: 6 }}>✕ {title}</div>
              <div style={{ fontSize: 13, color: '#B8B5D1', lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(140,68,204,0.06)', border: '1px solid rgba(140,68,204,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              Run your first PDCA cycle free
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy's PDCA tool guides you through all four phases and exports your project as PDCA, A3, 8D, DMAIC, or OODA — whichever format your audience requires. Free to start — no credit card.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#6B24A8,#8C44CC)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Start your PDCA project free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
