// @ts-nocheck
// ── app/terms/page.tsx ────────────────────────────────────────────────────────
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
import { VesimyLogo } from '@/components/ui/Logo'

export const metadata = { title: 'Terms of Service — Vesimy' }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#EAE8F4', marginBottom: 12, fontFamily: 'Palatino Linotype,serif' }}>{title}</h2>
    <div style={{ color: '#7070A0', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
)

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#03030D' }}>
      <nav style={{ borderBottom: '1px solid rgba(26,26,64,0.6)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><VesimyLogo size={36} showText /></Link>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}><ThemeToggle size={28} /><Link href="/dashboard" style={{ fontSize: 13, color: '#7070A0', textDecoration: 'none' }}>← Dashboard</Link></div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, color: '#38385C', fontFamily: 'monospace', letterSpacing: 1.5, marginBottom: 12 }}>LEGAL</p>
          <h1 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 40, fontWeight: 700, color: '#EAE8F4', marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: '#38385C' }}>Last updated: March 1, 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using VeSiMy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. VeSiMy is operated by VeSiMy Inc., a Delaware corporation.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>VeSiMy is a continuous improvement SaaS platform providing value stream mapping, lean manufacturing tools, process analytics, and AI-powered insights. We offer free and paid subscription tiers with different feature sets and usage limits.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You must create an account to use VeSiMy. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be 18 years or older to create an account. You may not share your account with others or create accounts on behalf of others without their consent.</p>
        </Section>

        <Section title="4. Subscriptions and Billing">
          <p>Paid plans are billed monthly or annually depending on your selection. All subscriptions include a 14-day free trial. You will not be charged until the trial period ends. Subscriptions automatically renew unless cancelled before the renewal date. You may cancel at any time from your account settings. Refunds are available within 30 days of any charge — contact support@vesimy.com. We use Stripe for payment processing and do not store your payment card details.</p>
        </Section>

        <Section title="5. Your Data">
          <p>You own all process data, value stream maps, and content you create in VeSiMy. We do not sell your data to third parties. We use your data solely to provide and improve the Service. See our Privacy Policy for full details on data handling.</p>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree not to: use the Service for any unlawful purpose; attempt to gain unauthorized access to any system; upload malicious code or content; reverse engineer the platform; resell or sublicense access without written permission; use the Service to compete directly with VeSiMy. We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>VeSiMy and its original content, features, and functionality are owned by VeSiMy Inc. and are protected by international copyright, trademark, and other intellectual property laws. The VeSiMy name, logo, and associated marks are trademarks of VeSiMy Inc.</p>
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
          <p>For questions about these Terms, contact us at: <a href="mailto:legal@vesimy.com" style={{ color: '#D4A208' }}>legal@vesimy.com</a> or VeSiMy Inc., Delaware, United States.</p>
        </Section>

        <div style={{ borderTop: '1px solid rgba(26,26,64,0.5)', paddingTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 13, color: '#7070A0', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/" style={{ fontSize: 13, color: '#7070A0', textDecoration: 'none' }}>← Back to VeSiMy</Link>
        </div>
      </div>
    </div>
  )
}
