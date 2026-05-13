// TypeScript enabled
// ── app/terms/page.tsx ────────────────────────────────────────────────────────
import type React from 'react'
import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'

export const metadata = { title: 'Terms of Service, VeSiMy' }

const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 12, fontFamily: 'Palatino Linotype,serif' }}>{title}</h2>
    <div style={{ color: 'var(--text3)', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
)

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,64,0.6)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><VesimyLogo size={36} showText /></Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>← Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'monospace', letterSpacing: 1.5, marginBottom: 12 }}>LEGAL</p>
          <h1 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 40, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: 'var(--sl-400)' }}>Last updated: March 1, 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using VeSiMy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. VeSiMy is operated by VeSiMy Ltd, a company registered in England and Wales. These Terms are governed by the laws of England and Wales.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>VeSiMy is a continuous improvement SaaS platform providing value stream mapping, lean manufacturing tools, process analytics, and AI-powered insights. We offer free and paid subscription tiers with different feature sets and usage limits.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You must create an account to use VeSiMy. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be 18 years or older to create an account. You may not share your account with others or create accounts on behalf of others without their consent.</p>
        </Section>

        <Section title="4. Subscriptions and Billing">
          <p>The Trial plan is available at no cost with no credit card required. The trial period is 14 days with access to up to 3 projects and all CI tools. After the trial period, your account remains active but project creation is restricted until you upgrade. Paid plans are billed monthly or annually depending on your selection. When upgrading to Pro for the first time, a 14-day free trial applies, you will not be charged until the trial period ends. Paid subscriptions automatically renew unless cancelled before the renewal date. You may cancel at any time from your account settings. Refunds are available within 30 days of any charge, contact founder@vesimy.com. We use Stripe for payment processing and do not store your payment card details.</p>
        </Section>

        <Section title="5. Your Data">
          <p>You own all process data, value stream maps, and content you create in VeSiMy. We do not sell your data to third parties. We use your data solely to provide and improve the Service. See our Privacy Policy for full details on data handling.</p>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree not to: use the Service for any unlawful purpose; attempt to gain unauthorized access to any system; upload malicious code or content; reverse engineer the platform; resell or sublicense access without written permission; use the Service to compete directly with VeSiMy. We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>VeSiMy and its original content, features, and functionality are owned by VeSiMy Ltd and are protected by international copyright and other intellectual property laws. The VeSiMy name, logo, and associated marks are proprietary to VeSiMy Ltd.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>To the maximum extent permitted by law, VeSiMy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you for any claim arising from these terms shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </Section>

        <Section title="9. Termination">
          <p>We may terminate or suspend your account at any time for violation of these terms. You may delete your account at any time. Upon termination, your right to use the Service ceases immediately. We will make your data available for export for 30 days after termination upon request.</p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>We may update these Terms from time to time. We will notify you of significant changes by email or in-app notification. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </Section>

        <Section title="11. Contact">
          <p>For questions about these Terms, contact us at: <a href="mailto:founder@vesimy.com" style={{ color: '#0176D3' }}>founder@vesimy.com</a></p>
        </Section>

        <div style={{ borderTop: '1px solid rgba(26,26,64,0.5)', paddingTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>← Back to VeSiMy</Link>
        </div>
      </div>
    </div>
  )
}
