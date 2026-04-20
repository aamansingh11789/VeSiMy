// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── lib/ai/ai-assist.ts ──────────────────────────────────────────────────────
// Unified AI helper for all tool assist features.
// Priority: Anthropic (if ANTHROPIC_API_KEY set) → Gemini (if GEMINI_API_KEY set)
// → rule-based fallback (always free, always works).
//
// Gemini Flash free tier: 15 RPM, 1M tokens/day — plenty for in-tool assists.
// Add GEMINI_API_KEY to Vercel env vars (free at ai.google.dev) to enable.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const GEMINI_KEY    = process.env.GEMINI_API_KEY

// ── Call whichever AI is available ───────────────────────────────────────────
export async function callAI(prompt: string, maxTokens = 400): Promise<string | null> {
  // 1. Try Anthropic (Haiku — cheapest, ~$0.001 per call)
  if (ANTHROPIC_KEY) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (res.ok) {
        const d = await res.json()
        return d.content?.[0]?.text?.trim() || null
      }
    } catch { /* fall through */ }
  }

  // 2. Try Google Gemini Flash (completely free tier)
  if (GEMINI_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
          }),
        }
      )
      if (res.ok) {
        const d = await res.json()
        return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
      }
    } catch { /* fall through */ }
  }

  return null // no AI available — caller uses rule-based fallback
}

// ── Check if any AI is configured ────────────────────────────────────────────
export function aiAvailable(): boolean {
  return !!(ANTHROPIC_KEY || GEMINI_KEY)
}
