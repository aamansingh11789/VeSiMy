// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About VeSiMy — AI Process Intelligence for Every Industry',
  description: 'VeSiMy is an AI-powered process improvement platform built for lean practitioners, operators, managers, and consultants across process-heavy industries. Learn about our mission and the team behind it.',
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        {/* Back nav */}
        <Link href="/" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}>
          ← Back to VeSiMy
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, color: '#0176D3', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 14, textTransform: 'uppercase' }}>
            Our Story
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700, color: 'var(--text)', marginBottom: 20, lineHeight: 1.1 }}>
            Built by practitioners.<br />
            <span style={{ color: '#0176D3' }}>For practitioners.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 640 }}>
            VeSiMy started with a simple observation: operations teams across every industry were still running their continuous improvement programs on Excel spreadsheets, sticky notes, and $500/month desktop software that hadn't changed in a decade.
          </p>
        </div>

        {/* Mission */}
        <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 16, padding: '32px 36px', marginBottom: 56 }}>
          <p style={{ fontSize: 11, color: '#0176D3', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 12, textTransform: 'uppercase' }}>Our Mission</p>
          <p style={{ fontFamily: serif, fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.45 }}>
            "Make every team — manufacturer, clinic, law firm, or warehouse — as sharp as the best process consultant in the world. On demand. At a fraction of the cost."
          </p>
        </div>

        {/* What we're building */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>What We're Building</h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
            VeSiMy is an AI operations intelligence platform. It gives you the tools to see your processes clearly, identify where waste is costing you time and money, and take structured action to fix it.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
            We built 9 core CI tools: VSM, Time Study, 5 Why, Fishbone, Waste ID, Kaizen, Yamazumi, Standard Work, and PDCA. In v4.0 we added OODA, 8D, and DMAIC. The AI layer turns your map data into a business-ready improvement report with specific actions, prioritised by impact.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
            The goal: replace the reactive, manual, disconnected world of CI tooling with a proactive, intelligent, connected platform that any operations team can afford.
          </p>
        </div>

        {/* The Team */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>The Team</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 32, lineHeight: 1.7 }}>
            VeSiMy is an early-stage startup. We're a small, focused team building fast and listening closely to our users.
          </p>

          {/* Founder card */}
          <div style={{ background: 'rgba(248,247,245,0.97)', border: '1px solid rgba(44,44,92,0.86)', borderRadius: 16, padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(1,118,211,0.4),rgba(100,38,160,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22, fontWeight: 700, color: '#0176D3', fontFamily: 'Palatino Linotype,serif' }}>M</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>Founder & CEO</div>
              <div style={{ fontSize: 13, color: '#0176D3', marginBottom: 12, fontFamily: 'monospace', letterSpacing: 1 }}>VESIMY · UNITED STATES</div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>
                Building VeSiMy from the ground up. Product, engineering, and growth. On a mission to bring AI-powered continuous improvement to every operations team in the world.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/aamansingh11789" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#6CB9FC', textDecoration: 'none', border: '1px solid rgba(108,185,252,0.24)', borderRadius: 8, padding: '5px 12px' }}>
                  LinkedIn →
                </a>
                <a href="https://github.com/aamansingh11789" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--text2)', textDecoration: 'none', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 8, padding: '5px 12px' }}>
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Company facts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 56 }}>
          {[
            { label: 'Location', value: 'United States' },
            { label: 'Founded', value: '2026' },
            { label: 'Stage', value: 'Pre-Seed' },
            { label: 'Users', value: 'Growing daily' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(248,247,245,0.97)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ fontSize: 11, color: 'var(--sl-400)', letterSpacing: 2, fontFamily: 'monospace', marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0176D3' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(248,247,245,0.97)', borderRadius: 20, border: '1px solid rgba(215,213,206,0.95)' }}>
          <h3 style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
            Want to work with us or invest?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28, lineHeight: 1.75 }}>
            We're actively looking for enterprise pilots, lean consultants who want to partner,<br />
            and investors who believe process intelligence is the next AI frontier.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:founder@vesimy.com"
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#0a5eaa,#0176D3)', color: 'var(--bg)', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              founder@vesimy.com
            </a>
            <Link href="/enterprise"
              style={{ padding: '12px 28px', border: '1px solid rgba(1,118,211,0.3)', color: '#0176D3', fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Enterprise Inquiry →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
