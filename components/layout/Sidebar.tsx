// @ts-nocheck
// ── components/layout/Sidebar.tsx — Salesforce-style navy sidebar ──────────
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase'
import {
  DashboardIcon, FolderIcon, ZapIcon, SettingsIcon,
  LogOutIcon, CrownIcon, BookIcon,
} from '@/components/ui/Icons'
import type { Profile } from '@/lib/store'

// Salesforce navy palette
const NAVY = {
  900: '#032D60',
  800: '#0a3d78',
  700: '#0c4a8f',
  600: '#1558a8',
  500: '#1e6bb8',
  400: '#5b9fd4',
  300: '#8ec5e8',
  200: '#c5e0f4',
  100: '#d8edff',
}
const BLUE    = '#0176D3'
const BLUE_LT = '#D8EDFF'
const WHITE   = '#FFFFFF'
const VIOLET  = '#8C44CC'

interface SidebarProps { profile: Profile }

const NAV = [
  { href: '/dashboard', icon: DashboardIcon, label: 'Dashboard'      },
  { href: '/projects',  icon: FolderIcon,    label: 'Projects'        },
  { href: '/kaizen',    icon: ZapIcon,       label: 'Kaizen Hub'      },
  { href: '/settings',  icon: SettingsIcon,  label: 'Settings'        },
  { href: '/learn',     icon: BookIcon,      label: 'Learning Center' },
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
      width: 240, minHeight: '100vh', position: 'fixed',
      left: 0, top: 0, bottom: 0, zIndex: 100,
      background: NAVY[900],
      borderRight: `1px solid ${NAVY[800]}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    }}>

      {/* ── Brand header ──────────────────────────────────────────────── */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: `1px solid ${NAVY[800]}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <VLogoMark size={34} />
          <div>
            <VeSiMyWordmark size={17} onDark />
            <div style={{
              fontSize: 9, letterSpacing: 1.8, color: NAVY[400],
              fontFamily: 'monospace', textTransform: 'uppercase', marginTop: 2,
            }}>
              Process Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* ── Plan chip ─────────────────────────────────────────────────── */}
      <div style={{ padding: '10px 14px 4px' }}>
        {!isPro && !isGold ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: NAVY[800], border: `1px solid ${NAVY[700]}`,
            borderRadius: 8, padding: '8px 10px',
          }}>
            <span style={{ fontSize: 11, color: NAVY[300], fontWeight: 600 }}>Free Plan</span>
            <Link href="/pricing" style={{
              fontSize: 11, color: BLUE_LT, fontWeight: 700,
              textDecoration: 'none',
              background: BLUE, padding: '3px 10px', borderRadius: 4,
              fontSize: 11,
            }}>
              Upgrade
            </Link>
          </div>
        ) : (
          <div style={{
            background: NAVY[800], border: `1px solid ${NAVY[700]}`,
            borderRadius: 8, padding: '8px 10px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 5,
              background: isGold ? 'rgba(1,118,211,0.3)' : 'rgba(140,68,204,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CrownIcon size={11} color={isGold ? BLUE_LT : VIOLET} />
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: isGold ? BLUE_LT : VIOLET,
              textTransform: 'uppercase', letterSpacing: 0.8,
            }}>
              {isLifetime ? 'Lifetime' : profile.plan_tier}
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation section label ───────────────────────────────────── */}
      <div style={{
        padding: '16px 18px 6px',
        fontSize: 10, letterSpacing: 1.8,
        color: NAVY[500], textTransform: 'uppercase',
        fontWeight: 700,
      }}>
        Workspace
      </div>

      {/* ── Nav links ─────────────────────────────────────────────────── */}
      <nav style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  color: active ? WHITE : NAVY[400],
                  background: active ? 'rgba(1,118,211,0.25)' : 'transparent',
                  borderLeft: `3px solid ${active ? BLUE : 'transparent'}`,
                  borderRadius: '0 6px 6px 0',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = NAVY[800]
                    e.currentTarget.style.color = WHITE
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = NAVY[400]
                  }
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'rgba(1,118,211,0.35)' : 'transparent',
                }}>
                  <Icon size={14} color={active ? WHITE : NAVY[400]} />
                </div>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Target progress nudge ──────────────────────────────────────── */}
      <div style={{
        margin: '8px 12px',
        background: 'rgba(1,118,211,0.15)',
        border: `1px solid rgba(1,118,211,0.30)`,
        borderRadius: 8, padding: '10px 12px',
      }}>
        <div style={{ fontSize: 10, color: BLUE_LT, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
          YOUR IMPROVEMENT TARGETS
        </div>
        <div style={{ fontSize: 11, color: NAVY[300], lineHeight: 1.5 }}>
          Track your progress, hit your targets, and build a record of wins.
        </div>
        <Link href="/projects" style={{
          display: 'inline-block', marginTop: 8,
          fontSize: 11, fontWeight: 700, color: BLUE_LT,
          textDecoration: 'none',
        }}>
          Open projects →
        </Link>
      </div>

      {/* ── Profile footer ────────────────────────────────────────────── */}
      <div style={{ padding: '8px 12px 14px', borderTop: `1px solid ${NAVY[800]}` }}>
        <div style={{
          background: NAVY[800], border: `1px solid ${NAVY[700]}`,
          borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${NAVY[700]}`,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: `linear-gradient(135deg, ${BLUE}, ${VIOLET})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: WHITE,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {profile.full_name || 'User'}
              </div>
              <div style={{
                fontSize: 10, color: NAVY[400],
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1,
              }}>
                {profile.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px', background: 'transparent', border: 'none',
              cursor: 'pointer', color: NAVY[400], fontSize: 12, borderRadius: 6,
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F9A8A8'; e.currentTarget.style.background = 'rgba(186,5,23,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.color = NAVY[400]; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOutIcon size={13} color="currentColor" /> Sign out
          </button>
        </div>
        <div style={{
          fontSize: 9, color: NAVY[700], marginTop: 8,
          letterSpacing: 1.5, textAlign: 'center', textTransform: 'uppercase',
        }}>
          VeSiMy · Process Intelligence
        </div>
      </div>
    </aside>
  )
}
