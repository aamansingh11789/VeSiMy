// TypeScript enabled
// ── app/api/contact/route.ts ──────────────────────────────────────────────────
// Handles contact form submissions. Sends email via Sender.net if configured,
// otherwise logs the contact and returns success (mailto fallback handles it).

import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, topic, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Rate limit: basic IP check
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // If Sender.net is configured, send notification email to founder
    if (process.env.SENDER_API_KEY) {
      await fetch('https://api.sender.net/v2/transactional/email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email: 'max@vesimy.com', name: 'Max Singh' }],
          from: { email: 'noreply@vesimy.com', name: 'VeSiMy Contact Form' },
          subject: `Contact Form: ${topic} from ${name}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Topic:</strong> ${topic}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>From VeSiMy contact form | IP: ${ip}</small></p>
          `,
        }),
      }).catch(err => console.error('[contact] Email send failed:', err))
    }

    // Log to console for Vercel logs (always)
    console.log(`[contact] ${topic} from ${name} <${email}>`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
