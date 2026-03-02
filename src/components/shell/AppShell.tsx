'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MainNav } from './MainNav'

interface AppShellProps {
  children: React.ReactNode
  navigationItems: Array<{ label: string; href: string; isActive?: boolean; badge?: string }>
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  costToday?: string
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  costToday,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <MainNav
          navigationItems={navigationItems}
          user={user}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onNavigate={onNavigate}
          costToday={costToday}
        />
      </div>

      {/* Tablet sidebar (starts collapsed) */}
      <div className="hidden md:block lg:hidden">
        <MainNav
          navigationItems={navigationItems}
          user={user}
          collapsed={!mobileOpen}
          onToggleCollapse={() => setMobileOpen(!mobileOpen)}
          onNavigate={(href) => {
            setMobileOpen(false)
            onNavigate?.(href)
          }}
          costToday={costToday}
        />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <MainNav
          navigationItems={navigationItems}
          user={user}
          collapsed={false}
          onToggleCollapse={() => setMobileOpen(false)}
          onNavigate={(href) => {
            setMobileOpen(false)
            onNavigate?.(href)
          }}
          costToday={costToday}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center gap-3 border-b border-zinc-200 px-4 md:hidden dark:border-zinc-800">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            ClawBoard
          </span>
          {costToday && (
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              {costToday}
            </span>
          )}
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
