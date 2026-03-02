'use client'

import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from './AppShell'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/' },
  { label: 'Tâches', href: '/tasks' },
  { label: 'Paramètres', href: '/settings' },
]

const DEFAULT_USER = {
  name: 'Naier Saidane',
  avatarUrl: '/avatar.png',
}

export function ShellWrapper({ children, costToday }: { children: React.ReactNode; costToday?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = NAV_ITEMS.map((item) => ({
    ...item,
    isActive: item.href === '/'
      ? pathname === '/'
      : pathname.startsWith(item.href),
  }))

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={DEFAULT_USER}
      onNavigate={handleNavigate}
      costToday={costToday || "$0.00"}
    >
      {children}
    </AppShell>
  )
}
