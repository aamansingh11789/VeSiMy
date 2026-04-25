// TypeScript enabled
// ── app/start/page.tsx ────────────────────────────────────────────────────
// Tier 0 — no-account free process mapping flow
// vesimy.com/start → 6 steps → AI lean report emailed

import type { Metadata } from 'next'
import Tier0Flow from './Tier0Flow'

export const metadata: Metadata = {
  title: 'Map Your Process Free — VeSiMy',
  description: 'Map one process in 5 minutes. Get a real lean report emailed to you. No account needed.',
}

export default function StartPage() {
  return <Tier0Flow />
}
