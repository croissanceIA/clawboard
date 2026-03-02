'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  ListChecks,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserMenu } from './UserMenu'

interface MainNavProps {
  navigationItems: Array<{ label: string; href: string; isActive?: boolean; badge?: string }>
  user?: { name: string; avatarUrl?: string }
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigate?: (href: string) => void
  costToday?: string
}

const iconMap: Record<string, React.ReactNode> = {
  'Tableau de bord': <LayoutDashboard className="size-5 shrink-0" />,
  'Tâches': <ListChecks className="size-5 shrink-0" />,
  'Paramètres': <Settings className="size-5 shrink-0" />,
}

export function MainNav({
  navigationItems,
  user,
  collapsed,
  onToggleCollapse,
  onNavigate,
  costToday,
}: MainNavProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      setIsDark(true)
    } else if (stored === 'light') {
      setIsDark(false)
    } else {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <nav
      className={cn(
        'flex h-full flex-col border-r border-zinc-200 bg-zinc-50 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header with logo and collapse toggle */}
      <div className={cn(
        'flex h-14 items-center border-b border-zinc-200 dark:border-zinc-800',
        collapsed ? 'justify-center px-2' : 'gap-2 px-4'
      )}>
        {!collapsed && (
          <>
            <Terminal className="size-5 shrink-0 text-blue-500" />
            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              ClawBoard
            </span>
          </>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300',
            !collapsed && 'ml-auto'
          )}
          title={collapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      {/* Cost indicator */}
      {costToday && (
        <div className={cn('border-b border-zinc-200 px-4 py-2 dark:border-zinc-800', collapsed && 'px-2')}>
          {collapsed ? (
            <div className="flex justify-center">
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                $
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Aujourd'hui</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {costToday}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Navigation items */}
      <div className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const icon = iconMap[item.label] || <LayoutDashboard className="size-5 shrink-0" />
          return (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-2',
                item.isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              )}
              title={collapsed ? item.label : undefined}
            >
              {icon}
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Theme toggle */}
      <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
        <button
          onClick={toggleTheme}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300',
            collapsed && 'justify-center px-2'
          )}
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {isDark ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
          {!collapsed && (
            <span className="truncate">{isDark ? 'Mode clair' : 'Mode sombre'}</span>
          )}
        </button>
      </div>

      {/* User menu */}
      {user && (
        <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
          <UserMenu user={user} collapsed={collapsed} />
        </div>
      )}
    </nav>
  )
}
