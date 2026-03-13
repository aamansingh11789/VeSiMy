// @ts-nocheck
// ── components/layout/Sidebar.tsx ─────────────────────────────────────────
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VesimyLogo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
import { createClient } from '@/lib/supabase'
import {
  DashboardIcon,
  FolderIcon,
  ZapIcon,
  SettingsIcon,
  LogOutIcon,
  CrownIcon,
  BookIcon,
} from '@/components/ui/Icons'
import type { Profile } from '@/lib/store'

interface SidebarProps {
  profile: Profile
  collapsed?: boolean
}

const NAV = [
  { href: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
  { href: '/projects', icon: FolderIcon, label: 'Projects' },
  { href: '/kaizen', icon: ZapIcon, label: 'Kaizen Hub' },
  { href: '/settings', icon: SettingsIcon, label: 'Settings' },
  { href: '/learn', icon: BookIcon, label: 'Learning Center' },
]

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const isPro = profile.plan_tier !== 'free'
  const isGold = (profile as any).beta_tier === 'gold_standard'
  const isLifetime = (profile as any).lifetime_access === true
  const usagePct = Math.min(
    100,
    ((profile.projects_count || 0) / Math.max(profile.projects_limit || 1, 1)) * 100
  )

  const initials = (profile.full_name || profile.email || 'U').charAt(0).toUpperCase()

  return (
    <aside
      style={{
        width: 248,
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        background:
          'linear-gradient(180deg, rgba(8,8,24,0.97) 0%, rgba(12,8,28,0.96) 46%, rgba(8,8,24,0.98) 100%)',
        borderRight: `1px solid ${
          isGold ? 'rgba(212,162,8,0.24)' : 'rgba(255,255,255,0.05)'
        }`,
        backdropFilter: 'blur(24px)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header / Brand */}
      <div
        style={{
          padding: '24px 20px 18px',
          borderBottom: `1px solid ${
            isGold ? 'rgba(212,162,8,0.18)' : 'rgba(255,255,255,0.05)'
          }`,
          background: isGold
            ? 'linear-gradient(180deg, rgba(212,162,8,0.045), transparent 72%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.015), transparent 72%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <VesimyLogo size={40} showText />
          <ThemeToggle size={28} />
        </div>

        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2.1,
              color: isGold ? '#D4A208' : 'var(--text3)',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            {isGold
              ? isLifetime
                ? 'Gold Lifetime Workspace'
                : 'Gold Standard Workspace'
              : 'Continuous Improvement OS'}
          </div>
        </div>
      </div>

      {/* Plan / Usage Panel */}
      {isGold ? (
        <div
          className="card"
          style={{
            margin: '14px 16px 10px',
            padding: '14px 14px 12px',
            borderRadius: 16,
            background:
              'linear-gradient(135deg, rgba(212,162,8,0.11), rgba(196,149,16,0.05) 48%, rgba(8,8,24,0.7))',
            border: '1px solid rgba(212,162,8,0.24)',
            boxShadow:
              '0 10px 28px rgba(212,162,8,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 9,
                  background: 'rgba(212,162,8,0.12)',
                  border: '1px solid rgba(212,162,8,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CrownIcon size={13} color="#D4A208" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#D4A208',
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                  }}
                >
                  {isLifetime ? 'Lifetime Access' : 'Gold Standard'}
                </div>
              </div>
            </div>

            {!isLifetime && (
              <Link
                href="/pricing#lifetime"
                style={{
                  fontSize: 10,
                  color: '#D4A208',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Upgrade →
              </Link>
            )}
          </div>

          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>
            {profile.projects_count} / {profile.projects_limit} projects used
          </div>

          <div
            style={{
              height: 5,
              borderRadius: 999,
              background: 'rgba(212,162,8,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                width: `${usagePct}%`,
                background: 'linear-gradient(90deg,#D4A208,#F5D060)',
                boxShadow: '0 0 12px rgba(212,162,8,0.28)',
              }}
            />
          </div>
        </div>
      ) : !isPro ? (
        <div
          className="card"
          style={{
            margin: '14px 16px 10px',
            padding: '14px 14px 12px',
            borderRadius: 16,
            background:
              'linear-gradient(135deg, rgba(212,162,8,0.06), rgba(8,8,24,0.72) 56%)',
            border: '1px solid rgba(212,162,8,0.14)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: '#D4A208',
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                }}
              >
                Free Plan
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
                Starter workspace access
              </div>
            </div>

            <Link
              href="/pricing"
              style={{
                fontSize: 11,
                color: '#8C44CC',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
              }}
            >
              <CrownIcon size={11} />
              Upgrade
            </Link>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>
            {profile.projects_count} / {profile.projects_limit} projects
          </div>

          <div
            style={{
              height: 5,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                width: `${usagePct}%`,
                background:
                  usagePct > 80
                    ? '#FF6B6B'
                    : 'linear-gradient(90deg,#D4A208,#F4A623)',
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className="card"
          style={{
            margin: '14px 16px 10px',
            padding: '12px 14px',
            borderRadius: 16,
            background:
              'linear-gradient(135deg, rgba(100,38,160,0.10), rgba(8,8,24,0.72) 64%)',
            border: '1px solid rgba(100,38,160,0.22)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              background: 'rgba(100,38,160,0.14)',
              border: '1px solid rgba(100,38,160,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CrownIcon size={14} color="#8C44CC" />
          </div>

          <div>
            <div
              style={{
                fontSize: 10,
                color: '#8C44CC',
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
            >
              {profile.plan_tier.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
              Premium access active
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ padding: '10px 0', flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '10px 20px 6px',
            fontSize: 9,
            letterSpacing: 2,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Workspace
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 10px' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')

            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 12px',
                  fontSize: 13,
                  fontWeight: active ? 650 : 500,
                  textDecoration: 'none',
                  color: active ? '#F4A623' : 'var(--text2)',
                  background: active ? 'rgba(212,162,8,0.08)' : 'transparent',
                  border: active
                    ? '1px solid rgba(212,162,8,0.16)'
                    : '1px solid transparent',
                  borderRadius: 12,
                  transition: 'all 0.18s ease',
                  boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = 'var(--text)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text2)'
                  }
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 9,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: active ? 'rgba(212,162,8,0.12)' : 'rgba(255,255,255,0.02)',
                    border: active
                      ? '1px solid rgba(212,162,8,0.18)'
                      : '1px solid rgba(255,255,255,0.03)',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} />
                </div>

                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer / Profile */}
      <div
        style={{
          padding: '14px 16px 18px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.01))',
        }}
      >
        <div
          className="card"
          style={{
            padding: '12px 12px 10px',
            borderRadius: 16,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.006)), rgba(8,8,24,0.64)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '2px 2px 10px',
              marginBottom: 8,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: 'linear-gradient(135deg,#D4A208,#6426A0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 8px 18px rgba(0,0,0,0.22)',
              }}
            >
              {initials}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 650,
                  color: 'var(--text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile.full_name || 'User'}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text3)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: 3,
                }}
              >
                {profile.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 8px',
              background: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              color: 'var(--text3)',
              fontSize: 12,
              borderRadius: 10,
              transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FF6B6B'
              e.currentTarget.style.background = 'rgba(255,107,107,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,107,107,0.14)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text3)'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <LogOutIcon size={13} />
            Sign out
          </button>
        </div>

        <div
          style={{
            fontSize: 9,
            color: 'var(--text3)',
            marginTop: 12,
            letterSpacing: 2,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          VeSiMy v1.1 · AI Operations Intelligence
        </div>
      </div>
    </aside>
  )
}