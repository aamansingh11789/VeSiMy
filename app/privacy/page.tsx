// TypeScript enabled
// ── app/privacy/page.tsx ──────────────────────────────────────────────────────
import type React from 'react'
import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'

export const metadata = { title: 'Privacy Policy, VeSiMy' }

const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 12, fontFamily: "'Sora','Inter',sans-serif" }}>{title}</h2>
    <div style={{ color: 'var(--text3)', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
)

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,64,0.6)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><VesimyLogo size={36} showText /></Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>← Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, marginBottom: 12 }}>LEGAL</p>
          <h1 style={{ fontFamily: "'Sora','Inter',sans-serif", fontSize: 40, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--sl-400)' }}>Last updated: March 1, 2026</p>
        </div>

        {/* Plain English Summary */}
        <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 14, padding: '24px 28px', marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1DD1A1', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>The short version</div>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, marginBottom: 12 }}>
            Your process data is yours. We store it so you can access it across devices and sessions. We never share it, sell it, or use it to train AI models.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, marginBottom: 12 }}>
            We collect standard usage analytics, pages viewed, features used, to understand how to improve the product. Your IP address appears in standard server security logs, as it does with every web service. We do not use IP addresses to identify your operations, track your processes, or profile your company.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75, margin: 0 }}>
            You can export your data and delete your account at any time. The full policy is below.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p><strong style={{ color: '#B0B0C8' }}>Account information:</strong> Name, email address, and password when you register.</p>
          <br />
          <p><strong style={{ color: '#B0B0C8' }}>Process data:</strong> Value stream maps, kaizen boards, step data, and other content you create in VeSiMy. This data is private to your account.</p>
          <br />
          <p><strong style={{ color: '#B0B0C8' }}>Usage data:</strong> Log data including IP address, browser type, pages visited, and time spent. Used to improve the product.</p>
          <br />
          <p><strong style={{ color: '#B0B0C8' }}>Payment information:</strong> Handled entirely by Stripe. We never see or store your full card number.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to: provide and operate the VeSiMy service; send transactional emails (password reset, billing receipts); improve and develop the product; communicate product updates and new features; respond to support requests; comply with legal obligations.</p>
          <br />
          <p>We do not sell your personal data or process data to any third party, ever.</p>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>Your data is stored on Supabase-managed PostgreSQL infrastructure with encryption at rest. All data in transit is encrypted using TLS. We use Supabase Row Level Security to ensure users can only access their own data. We perform regular backups and have disaster recovery procedures in place.</p>
        </Section>

        <Section title="4. Cookies">
          <p>We use essential cookies for authentication (keeping you logged in) and session management. We do not use advertising cookies or third-party tracking cookies. You can disable cookies in your browser but this will prevent you from logging in.</p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>We use the following third-party services: <strong style={{ color: '#B0B0C8' }}>Supabase</strong> (database and authentication), <strong style={{ color: '#B0B0C8' }}>Stripe</strong> (payment processing), <strong style={{ color: '#B0B0C8' }}>Vercel</strong> (hosting), <strong style={{ color: '#B0B0C8' }}>Anthropic</strong> (AI features via Claude API, step names, timing data, and process classifications are sent to generate AI analysis; avoid including confidential identifiers in step names). Each of these providers has their own privacy policy.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to: access all data we hold about you; export your process data at any time from the dashboard; correct inaccurate personal information; delete your account and associated data; opt out of marketing emails (unsubscribe link in every email). To exercise any of these rights, email <a href="mailto:founder@vesimy.com" style={{ color: '#0B1D33' }}>founder@vesimy.com</a>.</p>
        </Section>

        <Section title="7. Data Retention">
          <p>We retain your account data for as long as your account is active. If you delete your account, we remove your personal data within 30 days and your process data within 90 days. Some data may be retained longer for legal compliance purposes.</p>
        </Section>

        <Section title="8. GDPR (EU Users)">
          <p>If you are in the European Union, you have additional rights under GDPR including the right to data portability and the right to lodge a complaint with a supervisory authority. Our legal basis for processing your data is contract performance (to provide the service you signed up for). Contact <a href="mailto:founder@vesimy.com" style={{ color: '#0B1D33' }}>founder@vesimy.com</a> for GDPR requests.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>VeSiMy is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us personal data, contact us immediately.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Continued use after changes constitutes acceptance.</p>
        </Section>

        <Section title="11. Contact">
          <p>For privacy questions or requests: <a href="mailto:founder@vesimy.com" style={{ color: '#0B1D33' }}>founder@vesimy.com</a><br />VeSiMy, Pleasant Hill, California, United States.</p>
        </Section>

        <div style={{ borderTop: '1px solid rgba(26,26,64,0.5)', paddingTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/terms"   style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/"        style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>← Back to VeSiMy</Link>
        </div>
      </div>
    </div>
  )
}
