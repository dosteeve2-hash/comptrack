'use client'

// app/(dashboard)/layout.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getPrefs, applyPrefs, type UserPrefs, DEFAULT_PREFS } from '@/lib/prefs'
import { navItems, bottomNavItems } from './layout.config'
import { LayoutSidebar } from './LayoutSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [prefs, setPrefs]             = useState<UserPrefs>(DEFAULT_PREFS)

  useEffect(() => {
    const p = getPrefs()
    setPrefs(p)
    applyPrefs(p)
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<UserPrefs>).detail
      if (detail) setPrefs(detail)
    }
    window.addEventListener('comptrack:prefs-changed', onChange)
    return () => window.removeEventListener('comptrack:prefs-changed', onChange)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/connexion')
  }

  const sidebarProps = {
    pathname,
    prefs,
    onClose:   () => setSidebarOpen(false),
    onSignOut: handleSignOut,
  }

  const currentLabel = navItems.find((n) => pathname.startsWith(n.href))?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <LayoutSidebar {...sidebarProps} />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 flex flex-col w-64 border-r"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <LayoutSidebar {...sidebarProps} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="flex items-center gap-4 px-6 h-14 border-b flex-shrink-0"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <button className="md:hidden p-1.5 rounded-lg transition-all hover:opacity-70"
            style={{ color: 'var(--text2)' }}
            aria-label="Ouvrir le menu"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold">{currentLabel}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/notifications"
              className="relative p-2 rounded-lg transition-all hover:opacity-70"
              style={{ color: 'var(--text2)' }}
              title="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 min-w-[14px] h-3.5 flex items-center justify-center rounded-full text-[9px] font-bold px-1"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                3
              </span>
            </Link>
            <button className="md:hidden p-1.5 rounded-lg" style={{ color: 'var(--text2)' }}
              aria-label="Fermer le menu"
              onClick={() => setSidebarOpen(false)}>
              {sidebarOpen && <X className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">{children}</main>

        {/* Bottom nav — mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
          style={{
            background:          'color-mix(in srgb, var(--bg2) 88%, transparent)',
            backdropFilter:       'saturate(1.5) blur(16px)',
            WebkitBackdropFilter: 'saturate(1.5) blur(16px)',
            borderColor:         'var(--border)',
            paddingBottom:       'env(safe-area-inset-bottom)',
          }}
          aria-label="Navigation principale">
          <div className="grid grid-cols-5 max-w-md mx-auto">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}
                  className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors"
                  style={{ color: isActive ? 'var(--gold)' : 'var(--text3)' }}
                  aria-current={isActive ? 'page' : undefined}>
                  <item.icon style={{ width: 20, height: 20 }} strokeWidth={isActive ? 2.4 : 1.9} />
                  {item.label}
                </Link>
              )
            })}
            <button onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium"
              style={{ color: 'var(--text3)' }}>
              <Menu style={{ width: 20, height: 20 }} strokeWidth={1.9} />
              Plus
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
