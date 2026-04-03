// @ts-nocheck
'use client'
// ── components/layout/Sidebar.tsx ─────────────────────────────────────────
// Self-contained collapsible sidebar. Manages its own open/closed state and
// writes --sidebar-w to document.documentElement so every page layout reacts
// automatically without any server-side props changes.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase'
import {
  DashboardIcon, FolderIcon, ZapIcon, SettingsIcon,
  LogOutIcon, CrownIcon, BookIcon,
} from '@/components/ui/Icons'
import type { Profile } from '@/lib/store'

const NAVY = {
  900: '#032D60', 800: '#0a3d78', 700: '#0c4a8f',
  600: '#1558a8', 500: '#1e6bb8', 400: '#5b9fd4',
  300: '#8ec5e8', 200: '#c5e0f4', 100: '#d8edff',
}
const BLUE    = '#0176D3'
const BLUE_LT = '#D8EDFF'
const WHITE   = '#FFFFFF'
const VIOLET  = '#8C44CC'

const W_OPEN     = 240
const W_COLLAPSED = 56
const LS_KEY     = 'vesimy_sidebar_collapsed'

interface SidebarProps { profile: Profile; collapsed?: boolean }

const NAV = [
  { href: '/dashboard', icon: DashboardIcon, label: 'Dashboard'      },
  { href: '/projects',  icon: FolderIcon,    label: 'Projects'        },
  { href: '/kaizen',    icon: ZapIcon,       label: 'Kaizen Hub'      },
  { href: '/settings',  icon: SettingsIcon,  label: 'Settings'        },
  { href: '/learn',     icon: BookIcon,      label: 'Learning Center' },
]

export function Sidebar({ profile, collapsed: forcedCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  // If parent forces collapsed (e.g. V2 project page), respect that permanently.
  // Otherwise use local storage to persist user's preference.
  const [collapsed, setCollapsed] = useState(() => {
    if (forcedCollapsed) return true
    if (typeof window === 'undefined') return false
    return localStorage.getItem(LS_KEY) === 'true'
  })

  // Sync CSS variable and localStorage whenever collapsed changes
  useEffect(() => {
    const w = collapsed ? W_COLLAPSED : W_OPEN
    document.documentElement.style.setProperty('--sidebar-w', `${w}px`)
    if (!forcedCollapsed) {
      localStorage.setItem(LS_KEY, String(collapsed))
    }
  }, [collapsed, forcedCollapsed])

  // Set the CSS var on first paint (before any toggle)
  useEffect(() => {
    const w = collapsed ? W_COLLAPSED : W_OPEN
    document.documentElement.style.setProperty('--sidebar-w', `${w}px`)
  }, [])

  function toggle() {
    if (forcedCollapsed) return
    setCollapsed(v => !v)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const isPro      = ['pro','lifetime','enterprise'].includes(profile.plan_tier)
  const isGold     = (profile as any).beta_tier === 'gold_standard'
  const isLifetime = (profile as any).lifetime_access === true
  const initials   = (profile.full_name || profile.email || 'U').charAt(0).toUpperCase()

  return (
    <aside style={{
      width: collapsed ? W_COLLAPSED : W_OPEN,
      minHeight: '100vh', position: 'fixed',
      left: 0, top: 0, bottom: 0, zIndex: 100,
      background: NAVY[900],
      borderRight: `1px solid ${NAVY[800]}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      transition: 'width 0.22s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden',
    }}>

      {/* ── Brand header + toggle ─────────────────────────────────────── */}
      <div style={{
        padding: collapsed ? '18px 0' : '18px 14px 14px',
        borderBottom: `1px solid ${NAVY[800]}`,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8, flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VLogoMark size={32} />
            <div>
              <VeSiMyWordmark size={16} onDark />
              <div style={{
                fontSize: 9, letterSpacing: 1.8, color: NAVY[400],
                fontFamily: 'monospace', textTransform: 'uppercase', marginTop: 2,
              }}>
                Process Intelligence
              </div>
            </div>
          </div>
        )}
        {collapsed && <VLogoMark size={30} />}

        {/* Collapse toggle — hidden when forced collapsed */}
        {!forcedCollapsed && (
          <button
            onClick={toggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: 26, height: 26, borderRadius: 6, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: NAVY[400], flexShrink: 0,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = NAVY[800]; e.currentTarget.style.color = WHITE }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY[400] }}
          >
            {/* Chevron icon — points left when open, right when collapsed */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .22s' }}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Plan chip ─────────────────────────────────────────────────── */}
      {!collapsed && (
        <div style={{ padding: '10px 12px 4px', flexShrink: 0 }}>
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
      )}

      {/* ── Section label ─────────────────────────────────────────────── */}
      {!collapsed && (
        <div style={{
          padding: '14px 16px 6px',
          fontSize: 10, letterSpacing: 1.8,
          color: NAVY[500], textTransform: 'uppercase', fontWeight: 700, flexShrink: 0,
        }}>
          Workspace
        </div>
      )}

      {/* ── Nav links ─────────────────────────────────────────────────── */}
      <nav style={{ padding: collapsed ? '8px 0' : '0 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? '10px 0' : '8px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  color: active ? WHITE : NAVY[400],
                  background: active ? 'rgba(1,118,211,0.25)' : 'transparent',
                  borderLeft: collapsed ? 'none' : `3px solid ${active ? BLUE : 'transparent'}`,
                  borderRadius: collapsed ? 8 : '0 6px 6px 0',
                  margin: collapsed ? '0 8px' : undefined,
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
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Target nudge — only when expanded ─────────────────────────── */}
      {!collapsed && (
        <div style={{
          margin: '8px 10px', flexShrink: 0,
          background: 'rgba(1,118,211,0.15)',
          border: `1px solid rgba(1,118,211,0.30)`,
          borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{ fontSize: 10, color: BLUE_LT, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
            YOUR IMPROVEMENT TARGETS
          </div>
          <div style={{ fontSize: 11, color: NAVY[300], lineHeight: 1.5 }}>
            Track progress, hit targets, build a record of wins.
          </div>
          <Link href="/projects" style={{
            display: 'inline-block', marginTop: 8,
            fontSize: 11, fontWeight: 700, color: BLUE_LT, textDecoration: 'none',
          }}>
            Open projects →
          </Link>
        </div>
      )}

      {/* ── Profile footer ────────────────────────────────────────────── */}
      <div style={{
        padding: collapsed ? '10px 6px' : '8px 10px 12px',
        borderTop: `1px solid ${NAVY[800]}`, flexShrink: 0,
      }}>
        {collapsed ? (
          /* Collapsed: just avatar + sign-out stacked */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div title={profile.full_name || profile.email} style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${BLUE}, ${VIOLET})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'default',
            }}>
              {initials}
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{
                width: 32, height: 32, borderRadius: 6, border: 'none',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: NAVY[500], transition: 'all .12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F9A8A8'; e.currentTarget.style.background = 'rgba(186,5,23,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.color = NAVY[500]; e.currentTarget.style.background = 'transparent' }}
            >
              <LogOutIcon size={13} color="currentColor" />
            </button>
          </div>
        ) : (
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
        )}
        {!collapsed && (
          <div style={{
            fontSize: 9, color: NAVY[700], marginTop: 8,
            letterSpacing: 1.5, textAlign: 'center', textTransform: 'uppercase',
          }}>
            VeSiMy · Process Intelligence
          </div>
        )}
      </div>
    </aside>
  )
}
