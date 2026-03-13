// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog — VeSiMy',
  description: 'Every update, fix, and new feature shipped to VeSiMy. Updated every time we ship.',
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const entries = [
  {
    date: 'March 12, 2026',
    tag: 'LAUNCH',
    color: '#D4A208',
    title: 'VeSiMy goes live',
    items: [
      'All 6 core CI tools live: VSM, Kaizen, 5 Why, Fishbone, Time Study, Kanban',
      'Supe AI — convert any SOP to a VSM map in under 60 seconds',
      'Free tier available — no credit card, no time limit',
      'Pro plan at $29/mo with cloud sync, unlimited projects, and full PDF export',
      'Lifetime plan at $99 — available during Launch Week only',
      'Enterprise pricing page with live quote builder',
      'Mobile-responsive across all tools',
      'PWA support — installable on iPhone and Android',
      'Supabase authentication with Google and email',
      'Stripe payment integration for Pro and Lifetime plans',
      'GDPR-compliant privacy policy',
      'Delaware incorporation',
    ],
  },
  {
    date: 'March 12, 2026',
    tag: 'FIX',
    color: '#1DD1A1',
    title: 'Mobile modal bottom nav fix',
    items: [
      'Fixed issue where modal content was hidden behind the bottom navigation bar on iPhone',
      'Modals now use 100dvh minus nav height to ensure all content is visible',
      'Safe area insets applied to modal footer and body padding',
    ],
  },
  {
    date: 'March 12, 2026',
    tag: 'SEO',
    color: '#6CB9FC',
    title: 'SEO and discoverability upgrades',
    items: [
      'Added robots.txt — Google can now crawl all public pages',
      'Added sitemap.xml — all 14 pages submitted to Google Search Console',
      'Updated meta title to include AI Operations Intelligence Platform',
      'Added Open Graph and Twitter card images for social sharing',
      'Added keyword-rich meta description targeting lean manufacturing searches',
    ],
  },
  {
    date: 'Coming soon',
    tag: 'NEXT',
    color: '#8C44CC',
    title: 'AI Monitor v1 — Anomaly Detection',
    items: [
      'Supe AI will watch your Time Study data continuously',
      'Alerts when cycle times drift more than 15% from your baseline',
      'Plain-English explanations of what the anomaly means',
      'Dashboard widget showing live process health score',
    ],
  },
  {
    date: 'Coming soon',
    tag: 'NEXT',
    color: '#8C44CC',
    title: 'SMED Calculator (Tool 7)',
    items: [
      'Record every changeover step with timer',
      'Classify steps as Internal (machine stopped) vs External (can run while machine is running)',
      'Live savings calculation — see potential time reduction instantly',
      'Annual $ value of improvement calculated automatically',
      'Export as PDF report',
    ],
  },
  {
    date: 'Coming soon',
    tag: 'NEXT',
    color: '#8C44CC',
    title: 'Gemba Walk Checklist (Tool 8)',
    items: [
      'Mobile-first checklist for floor inspections',
      'Pre-built checkpoint library: Safety, Quality, Delivery, Cost, Morale',
      'Photo capture at each checkpoint',
      'Critical issues auto-create Kaizen events instantly',
      'Walk summary report with PDF export',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#EAE8F4' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/" style={{ fontSize: 13, color: '#8B88B3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}>
          ← Back to VeSiMy
        </Link>

        <p style={{ fontSize: 11, color: '#D4A208', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 14, textTransform: 'uppercase' }}>
          What's New
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: '#F3F1FB', marginBottom: 12, lineHeight: 1.1 }}>
          Changelog
        </h1>
        <p style={{ fontSize: 15, color: '#8B88B3', marginBottom: 56, lineHeight: 1.75 }}>
          Every update shipped to VeSiMy — big and small. Updated continuously.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {entries.map((entry, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
                {i < entries.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 40, background: 'rgba(44,44,92,0.6)', marginTop: 8 }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                    background: `${entry.color}22`, color: entry.color,
                    fontFamily: 'monospace', letterSpacing: 1.5,
                  }}>
                    {entry.tag}
                  </span>
                  <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>{entry.date}</span>
                </div>

                <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#F3F1FB', marginBottom: 14 }}>
                  {entry.title}
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {entry.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: '#8B88B3', lineHeight: 1.65 }}>
                      <span style={{ color: entry.color, marginTop: 2, flexShrink: 0 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe notice */}
        <div style={{ marginTop: 56, padding: '28px 32px', background: 'rgba(8,8,24,0.78)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#8B88B3', lineHeight: 1.75 }}>
            Want updates when we ship? Follow{' '}
            <a href="https://linkedin.com/company/vesimy" target="_blank" rel="noopener noreferrer" style={{ color: '#D4A208', textDecoration: 'none' }}>
              VeSiMy on LinkedIn
            </a>
            {' '}— we post every release.
          </p>
        </div>
      </div>
    </div>
  )
}
