// TypeScript enabled
import Link from 'next/link'
import { VsLogo } from '@/components/ui/VsLogo'

export const metadata = {
  title: 'Security · VeSiMy',
  description: 'How VeSiMy protects your process data.',
}

const NAVY = '#0B1D33'
const STEEL = '#3A5A7D'
const CHAMPAGNE = '#C9A66B'
const SLATE = '#73879C'
const PAPER = '#F7F8FA'
const SERIF = "'Instrument Serif', Georgia, serif"
const SANS = "'Inter', system-ui, sans-serif"
const MONO = "'JetBrains Mono', monospace"

export default function SecurityPage() {
  const practices = [
    {
      title: 'Row-Level Security',
      body: 'Every database table enforces row-level security policies. Your projects, process maps, and tool data are readable and writable only by your authenticated account. No user can access another user\'s data.',
    },
    {
      title: 'Encrypted in transit and at rest',
      body: 'All connections use TLS encryption. Data stored in our database is encrypted at rest by our infrastructure provider.',
    },
    {
      title: 'Authentication',
      body: 'Accounts are protected by secure authentication with email confirmation. Passwords are never stored in plain text. Sessions use secure, HTTP-only cookies.',
    },
    {
      title: 'Payment security',
      body: 'We use Stripe for all payment processing. VeSiMy never sees or stores your full payment card details. Stripe is PCI-DSS Level 1 certified.',
    },
    {
      title: 'Data ownership',
      body: 'Your process data belongs to you. You can export it at any time from your dashboard, and you can delete your account and all associated data whenever you choose.',
    },
    {
      title: 'Infrastructure',
      body: 'VeSiMy runs on established cloud infrastructure with automated backups, monitoring, and redundancy. Our database provider maintains SOC 2 compliance.',
    },
  ]

  return (
    <div style={{ background: PAPER, minHeight: '100vh', fontFamily: SANS, color: NAVY }} data-vs-page>
      {/* Nav */}
      <nav style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', borderBottom: '1px solid #E6E8EC' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <VsLogo size={30} />
        </Link>
        <Link href="/" style={{ fontFamily: SANS, fontSize: 13, color: STEEL, textDecoration: 'none', fontWeight: 500 }}>← Back to home</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 28px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 24, height: 1, background: NAVY }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: STEEL, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
            Security & Trust
          </span>
        </div>

        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 400, color: NAVY, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 20 }}>
          How we protect<br />your process data.
        </h1>

        <p style={{ fontSize: 17, color: STEEL, lineHeight: 1.65, marginBottom: 48, maxWidth: 620 }}>
          VeSiMy is built for operations teams that take their data seriously. Here is how we keep
          your value stream maps, time studies, and improvement records safe.
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          {practices.map(p => (
            <div key={p.title} style={{
              background: '#FFFFFF', border: '1px solid #DDE3EA', borderRadius: 16,
              padding: '24px 28px', boxShadow: '0 10px 30px rgba(7,26,47,0.06)',
            }}>
              <h2 style={{ fontFamily: "'Sora', 'Inter', sans-serif", fontSize: 18, fontWeight: 650, color: NAVY, marginBottom: 8, letterSpacing: '-0.01em' }}>
                {p.title}
              </h2>
              <p style={{ fontSize: 14, color: STEEL, lineHeight: 1.65, margin: 0 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: '24px 28px', background: 'rgba(201,166,107,0.08)', border: '1px solid rgba(201,166,107,0.28)', borderRadius: 16 }}>
          <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.65, margin: 0 }}>
            Have a security question or want to report a concern? Email{' '}
            <a href="mailto:founder@vesimy.com" style={{ color: CHAMPAGNE, fontWeight: 600, textDecoration: 'none' }}>founder@vesimy.com</a>
            {' '}and we will respond promptly.
          </p>
        </div>

        <p style={{ fontSize: 12, color: SLATE, marginTop: 32, fontStyle: 'italic', lineHeight: 1.6 }}>
          This page describes our security practices in good faith. It is not a formal compliance
          certification. For enterprise security reviews or detailed documentation, please contact us directly.
        </p>
      </div>
    </div>
  )
}
