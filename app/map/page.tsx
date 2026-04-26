import { redirect } from 'next/navigation'

// Public alias for the Tier 0 no-account mapping flow.
// The v4 spec allows either /start or /map as the direct CTA URL.
export default function MapAliasPage() {
  redirect('/start')
}
