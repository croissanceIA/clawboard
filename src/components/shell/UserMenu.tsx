'use client'

import { cn } from '@/lib/utils'

interface UserMenuProps {
  user: { name: string; avatarUrl?: string }
  collapsed?: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserMenu({ user, collapsed }: UserMenuProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        collapsed && 'justify-center'
      )}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="size-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
          {getInitials(user.name)}
        </div>
      )}
      {!collapsed && (
        <span className="truncate text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {user.name}
        </span>
      )}
    </div>
  )
}
