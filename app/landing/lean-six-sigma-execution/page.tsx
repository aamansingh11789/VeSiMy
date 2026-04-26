// TypeScript enabled
// ── app/landing/lean-six-sigma-execution/page.tsx ────────────────────────
// SEO landing page: "Lean Six Sigma for small businesses that actually gets used"
// Targets: "Lean Six Sigma training not working", "why Lean Six Sigma fails",
// "how to implement Lean Six Sigma successfully" — high-intent keywords from InsightScout

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lean Six Sigma for Small Businesses That Actually Gets Used — VeSiMy',
  description: 'VeSiMy is the execution layer for Lean Six Sigma. Turn training into real projects, repeatable habits, and measurable improvement. AI-guided, methodology-aware, built for small teams.',
  keywords: [
    'Lean Six Sigma for small businesses',
    'Lean Six Sigma training not working',
    'why Lean Six Sigma fails in companies',
    'how to implement Lean Six Sigma successfully',
    'Lean Six Sigma program implementation',
    'continuous improvement software',
    'AI Lean Six Sigma',
  ],
  openGraph: {
    title: 'Lean Six Sigma for Small Businesses That Actually Gets Used',
    description: 'Lean Six Sigma training only works when your team can execute it. VeSiMy is the execution layer that keeps improvement alive after the workshop ends.',
    type: 'website',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'
const mono  = '"IBM Plex Mono",ui-monospace,monospace'

export default function LandingLeanSixSigmaExecution() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Nav ── */}
      <nav style={{ padding: '0 clamp(16px,4vw,48px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border3)' }}>
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>VeSiMy</Link>
        <Link href="/auth/signup" style={{ textDecoration: 'none', padding: '8px 18px', background: '#0176D3', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Start free</Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(60px,10vh,120px) clamp(20px,5vw,48px) 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: 'rgba(1,118,211,0.1)', color: '#0176D3', fontFamily: mono, letterSpacing: 2, marginBottom: 24 }}>
          LEAN SIX SIGMA EXECUTION FOR SMALL TEAMS
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,60px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24, color: 'var(--text)' }}>
          Lean Six Sigma training only works when your team can execute it.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 600, margin: '0 auto 40px' }}>
          VeSiMy helps small businesses turn Lean and Six Sigma training into real projects, repeatable daily habits, and measurable process improvement. AI-guided, methodology-aware, and designed to keep continuous improvement alive after the workshop ends.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/start" style={{ textDecoration: 'none', padding: '14px 32px', background: '#0176D3', color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 14px rgba(1,118,211,0.3)' }}>
            See VeSiMy in Action
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none', padding: '14px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 15 }}>
            Start 14-day trial
          </Link>
        </div>
      </section>

      {/* ── The gap ── */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border3)', borderBottom: '1px solid var(--border3)', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            Why Lean Six Sigma fails in most small businesses
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
            The training is not the problem. The gap between the workshop and the floor is the problem. Teams leave with certificates, binders, and good intentions. Six months later nothing has changed. This is the most common pattern in Lean Six Sigma adoption across small businesses.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
            {[
              { icon: '01', title: 'Training without follow-through', body: 'Your team got the training but there is no system for project ownership, daily use, or tracking whether anything changed after the certificates were handed out.' },
              { icon: '02', title: 'Tools without context', body: 'Most Lean Six Sigma tools feel theoretical when handed to a small team without a Black Belt on staff to guide implementation.' },
              { icon: 'AN', title: 'Results nobody can see', body: 'Leadership wants measurable results. But there is no structured way to show the before/after of a process improvement without building a report from scratch.' },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px' }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text)' }}>{title}</div>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How VeSiMy closes the gap ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
            VeSiMy is the execution layer
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
            Not a training program. Not a generic AI chatbot. The system that makes Lean Six Sigma work after the training.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 28 }}>
          {[
            { icon: '01', title: 'Map it', body: 'Start by mapping one process using the VSM canvas or the free flow at vesimy.com/start. See the full picture: every step, every wait, every handoff.' },
            { icon: '02', title: 'Find it', body: 'AI guidance helps surface the bottleneck, classify the waste type, and identify where your process cycle efficiency is being lost — using structured continuous-improvement logic.' },
            { icon: '03', title: 'Fix it with structure', body: 'Run a PDCA, 8D, DMAIC, or OODA cycle inside VeSiMy with your process data pre-loaded. Every improvement cycle is documented and linked to the VSM.' },
            { icon: 'UP', title: 'Prove it', body: 'The before/after comparison is automatic. Lead time reduced. PCE improved. Waste type eliminated. The case for leadership writes itself.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text)' }}>{title}</div>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Objections ── */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border3)', borderBottom: '1px solid var(--border3)', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, marginBottom: 32, color: 'var(--text)' }}>Common questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { q: 'Is VeSiMy just another Lean Six Sigma training course?', a: 'No. VeSiMy is a process improvement tool that helps teams apply Lean and Six Sigma methods after training. The training gives you the knowledge. VeSiMy gives you the system to use it.' },
              { q: 'Do we need a dedicated Black Belt or CI expert to use it?', a: 'No. VeSiMy is built to help small teams structure improvement work and move projects forward with practical AI guidance. You do not need a certified expert on staff.' },
              { q: 'What if our team already had training but never used it?', a: 'That is exactly the gap VeSiMy is built to close. It gives teams a system for execution, not more knowledge. The training is fine. The execution infrastructure was missing.' },
              { q: 'Will this work in our industry?', a: 'VeSiMy is designed for process-heavy industries with terminology, templates, and AI responses that adapt to operational context.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderLeft: '3px solid rgba(1,118,211,0.3)', paddingLeft: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>{q}</div>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#032D60', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px,4vw,44px)', fontWeight: 700, color: '#F1F5F9', marginBottom: 16 }}>
          Your team already has the training.<br />Now give it a system.
        </h2>
        <p style={{ color: 'rgba(241,245,249,0.65)', fontSize: 17, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
          See how an AI-guided execution system can support your improvement projects, guide daily follow-through, and make continuous improvement part of how your business actually runs.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/start" style={{ textDecoration: 'none', padding: '14px 32px', background: '#0176D3', color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 700 }}>
            Map a Process Free
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)', borderRadius: 10, fontSize: 15 }}>
            Start 14-day trial — no card
          </Link>
        </div>
      </section>

    </div>
  )
}
