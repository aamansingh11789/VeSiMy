// @ts-nocheck
// ── components/layout/Sidebar.tsx ─────────────────────────────────────────
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VesimyLogo, VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase'
import {
  DashboardIcon, FolderIcon, ZapIcon, SettingsIcon,
  LogOutIcon, CrownIcon, BookIcon,
} from '@/components/ui/Icons'
import type { Profile } from '@/lib/store'

// ── Slate palette constants ────────────────────────────────────────────────
const SL = {
  50:  '#F8F7F5',
  100: '#ECEAE6',
  200: '#D8D5CE',
  300: '#B8B4AC',
  400: '#8E8A82',
  500: '#6B6760',
  600: '#4E4B45',
  700: '#353330',
  800: '#242220',
  900: '#161513',
}
const GOLD    = '#C49B2E'
const GOLD_LT = '#F5E9C4'
const VIOLET  = '#8C44CC'

interface SidebarProps { profile: Profile; collapsed?: boolean }

const NAV = [
  { href: '/dashboard', icon: DashboardIcon, label: 'Dashboard'       },
  { href: '/projects',  icon: FolderIcon,    label: 'Projects'         },
  { href: '/kaizen',    icon: ZapIcon,       label: 'Kaizen Hub'       },
  { href: '/settings',  icon: SettingsIcon,  label: 'Settings'         },
  { href: '/learn',     icon: BookIcon,      label: 'Learning Center'  },
]

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const isPro      = ['pro','lifetime','enterprise'].includes(profile.plan_tier)
  const isGold     = (profile as any).beta_tier === 'gold_standard'
  const isLifetime = (profile as any).lifetime_access === true

  const initials   = (profile.full_name || profile.email || 'U').charAt(0).toUpperCase()

  return (
    <aside style={{
      width: 248, minHeight: '100vh', position: 'fixed',
      left: 0, top: 0, bottom: 0, zIndex: 100,
      background: SL[800],
      borderRight: `1px solid ${SL[700]}`,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Brand header ────────────────────────────────────────────────── */}
      <div style={{
        padding: '22px 20px 16px',
        borderBottom: `1px solid ${isGold ? 'rgba(196,155,46,0.3)' : SL[700]}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={36} />
          <div>
            <VeSiMyWordmark size={18} onDark />
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#6B6760', fontFamily: 'monospace', textTransform: 'uppercase', marginTop: 2 }}>
              Lean CI Platform
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 10, fontSize: 9, letterSpacing: 2.2,
          color: isGold ? GOLD : SL[500],
          textTransform: 'uppercase', fontWeight: 700, fontFamily: 'monospace',
        }}>
          {isGold
            ? (isLifetime ? 'Gold Lifetime Workspace' : 'Gold Standard Workspace')
            : 'Continuous Improvement OS'}
        </div>
      </div>

      {/* ── Plan panel ──────────────────────────────────────────────────── */}
      {isGold ? (
        <div style={{
          margin: '12px 14px 8px',
          background: `rgba(196,155,46,0.12)`,
          border: `1px solid rgba(196,155,46,0.35)`,
          borderRadius: 12, padding: '12px 12px 10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(196,155,46,0.2)', border: '1px solid rgba(196,155,46,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CrownIcon size={12} color={GOLD} />
              </div>
              <div style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {isLifetime ? 'Lifetime' : 'Gold Standard'}
              </div>
            </div>
            {!isLifetime && (
              <Link href="/pricing#lifetime" style={{ fontSize: 10, color: GOLD, textDecoration: 'none', fontWeight: 700 }}>
                Upgrade →
              </Link>
            )}
          </div>
          <div style={{ fontSize: 11, color: SL[400] }}>
            Unlimited projects
          </div>
        </div>
      ) : !isPro ? (
        <div style={{
          margin: '12px 14px 8px',
          background: SL[700], border: `1px solid ${SL[600]}`,
          borderRadius: 12, padding: '12px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 10, color: SL[300], fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>Free Plan</div>
            <div style={{ fontSize: 11, color: SL[400], marginTop: 3 }}>Unlimited projects</div>
          </div>
          <Link href="/pricing" style={{ fontSize: 11, color: GOLD, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            <CrownIcon size={11} /> Upgrade
          </Link>
        </div>
      ) : (
        <div style={{
          margin: '12px 14px 8px',
          background: 'rgba(140,68,204,0.12)', border: '1px solid rgba(140,68,204,0.28)',
          borderRadius: 12, padding: '12px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(140,68,204,0.2)', border: '1px solid rgba(140,68,204,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CrownIcon size={13} color={VIOLET} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: VIOLET, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {profile.plan_tier.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: SL[400], marginTop: 2 }}>Premium access active</div>
          </div>
        </div>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '8px 20px 4px', fontSize: 9, letterSpacing: 2.2, color: SL[500], textTransform: 'uppercase', fontWeight: 700 }}>
          Workspace
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', fontSize: 13, fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  color: active ? '#F0E4BC' : SL[400],
                  background: active ? 'rgba(196,155,46,0.12)' : 'transparent',
                  borderLeft: `2.5px solid ${active ? GOLD : 'transparent'}`,
                  borderRadius: '0 8px 8px 0',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = SL[700]
                    e.currentTarget.style.color = SL[200]
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = SL[400]
                  }
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'rgba(196,155,46,0.18)' : 'transparent',
                }}>
                  <Icon size={14} color={active ? GOLD : SL[400]} />
                </div>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Profile footer ───────────────────────────────────────────────── */}
      <div style={{ padding: '12px 14px 16px', borderTop: `1px solid ${SL[700]}` }}>
        <div style={{
          background: SL[700], border: `1px solid ${SL[600]}`,
          borderRadius: 10, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${SL[600]}` }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${GOLD}, ${VIOLET})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: SL[100], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.full_name || 'User'}
              </div>
              <div style={{ fontSize: 10, color: SL[400], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                {profile.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 6px', background: 'transparent', border: 'none', cursor: 'pointer', color: SL[400], fontSize: 12, borderRadius: 8, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#C0402A'; e.currentTarget.style.background = 'rgba(192,64,42,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = SL[400]; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOutIcon size={13} color="currentColor" /> Sign out
          </button>
        </div>
        <div style={{ fontSize: 9, color: SL[600], marginTop: 10, letterSpacing: 2, textAlign: 'center', textTransform: 'uppercase' }}>
          VeSiMy v1.1 · Lean CI Platform
        </div>
      </div>
    </aside>
  )
}
