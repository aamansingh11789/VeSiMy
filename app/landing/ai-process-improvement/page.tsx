// TypeScript enabled
// ── app/landing/ai-process-improvement/page.tsx ───────────────────────────
// SEO landing page: "AI process improvement for small businesses"
// Keywords: process improvement tool, Lean Six Sigma for small business,
// AI process improvement, continuous improvement software, business workflow optimization

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Process Improvement for Small Businesses, VeSiMy',
  description: 'VeSiMy helps small businesses find bottlenecks, reduce waste, and hit targets with AI-guided Lean and Six Sigma tools. Built on an Lean and VSM-structured knowledge base. 68+ industries.',
  keywords: ['AI process improvement', 'process improvement tool', 'Lean Six Sigma for small business', 'continuous improvement software', 'business workflow optimization', 'AI tools for small business owners'],
  openGraph: {
    title: 'AI Process Improvement for Small Businesses, VeSiMy',
    description: 'Stop babysitting your processes. Start improving them. AI-guided Lean and Six Sigma for small businesses across 68+ industries.',
    type: 'website',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'
const mono  = '"IBM Plex Mono",ui-monospace,monospace'

export default function LandingAIProcessImprovement() {
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
          LEAN SIX SIGMA + AI FOR REAL-WORLD OPERATIONS
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,60px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24, color: 'var(--text)' }}>
          Stop babysitting your processes.<br />Start improving them.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 580, margin: '0 auto 40px' }}>
          VeSiMy helps small businesses find bottlenecks, reduce waste, and hit targets with AI-guided Lean and Six Sigma tools. Built on an Lean and VSM-structured knowledge base so your improvement workflow is practical, structured, and easy to act on.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/start" style={{ textDecoration: 'none', padding: '14px 32px', background: '#0176D3', color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 14px rgba(1,118,211,0.3)' }}>
            Map a Process Free
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none', padding: '14px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 15 }}>
            Start 14-day trial
          </Link>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(20px,5vw,48px) 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
          {[
            { icon: '🔍', title: 'The problem is buried', body: 'Your team knows something is slowing them down, but the real cause is scattered across spreadsheets, handoffs, and tribal knowledge. Nobody has a complete picture.' },
            { icon: '🤖', title: 'Generic AI is not enough', body: 'General AI tools can answer questions but they do not guide a real improvement workflow from root cause to action plan. You end up doing the thinking yourself.' },
            { icon: '📋', title: 'Lean feels too complex', body: 'Lean Six Sigma sounds useful but for small businesses it often feels too consultant-heavy or too disconnected from day-to-day operations.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text)' }}>{title}</div>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Solution ── */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border3)', borderBottom: '1px solid var(--border3)', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>How VeSiMy is different</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>Not a general-purpose chatbot. A purpose-built improvement system grounded in real methodology.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Map one process', body: 'Use the VSM canvas or the free flow at vesimy.com/start to map any process in your operation, from order fulfilment to service delivery to patient discharge.' },
              { step: '02', title: 'Find the waste', body: 'VeSiMy analyzes your process using Lean methodology and surfaces the delays, defects, and non-value-added steps that are costing you time and money.' },
              { step: '03', title: 'Take a structured action', body: 'Follow a guided improvement cycle, PDCA, 8D, DMAIC, or OODA, with AI support based on an Lean and VSM-structured knowledge base. From problem to root cause to fix.' },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ display: 'flex', gap: 20 }}>
                <div style={{ fontFamily: mono, fontSize: 11, color: '#0176D3', fontWeight: 700, paddingTop: 4, flexShrink: 0 }}>{step}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text)' }}>{title}</div>
                  <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof / Proof points ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24, marginBottom: 60 }}>
          {[
            { stat: '68+', label: 'Industries supported' },
            { stat: '200+', label: 'Lean knowledge chunks in the AI' },
            { stat: 'ISO', label: '22468 VSM standard aligned' },
            { stat: '14d', label: 'Free trial, no card' },
          ].map(({ stat, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: '#0176D3', marginBottom: 6 }}>{stat}</div>
              <div style={{ color: 'var(--text3)', fontSize: 13 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Objections */}
        <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, marginBottom: 28, color: 'var(--text)' }}>Common questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { q: 'Is this only for manufacturing or technical teams?', a: 'No. VeSiMy is built for small businesses across 68+ industries, including service operations, admin, logistics, healthcare, hospitality, and any workflow-heavy team.' },
            { q: 'Do I need to understand Lean Six Sigma already?', a: 'No. VeSiMy translates improvement methods into a guided workflow so you can identify problems and act on them without needing to be an expert.' },
            { q: 'Will this replace our current tools?', a: 'No. VeSiMy improves the way your team works, not forces a rip-and-replace. It helps you make better decisions and fix the process you already have.' },
            { q: 'How is this different from ChatGPT or Claude?', a: 'General AI tools know language. VeSiMy knows Lean methodology. It gives you operationally correct guidance, takt time calculations, waste classification, PDCA cycles, not polished-sounding generic advice.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ borderLeft: '3px solid rgba(1,118,211,0.3)', paddingLeft: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>{q}</div>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#032D60', padding: 'clamp(60px,8vh,100px) clamp(20px,5vw,48px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px,4vw,44px)', fontWeight: 700, color: '#F1F5F9', marginBottom: 16 }}>
          If your team keeps saying "we need a better way to do this"
        </h2>
        <p style={{ color: 'rgba(241,245,249,0.65)', fontSize: 17, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Map a process in under 5 minutes. Get a real AI lean report with bottleneck identification, waste classification, and a first action for this week. No account required.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/start" style={{ textDecoration: 'none', padding: '14px 32px', background: '#0176D3', color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 700 }}>
            Map a Process Free
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)', borderRadius: 10, fontSize: 15 }}>
            Start 14-day trial
          </Link>
        </div>
      </section>

    </div>
  )
}
