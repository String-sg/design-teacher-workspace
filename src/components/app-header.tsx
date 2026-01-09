import { Link, useMatches } from '@tanstack/react-router'
import { Bell } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

// Route configuration with labels and parent relationships
const routeConfig: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Home' },
  '/students': { label: 'Student dashboard' },
  '/announcements': { label: 'Announcements' },
  '/announcements/': { label: 'Announcements' },
  '/announcements/$id': { label: 'Announcement', parent: '/announcements' },
}

interface AppHeaderProps {
  notificationCount?: number
}

export function AppHeader({ notificationCount = 0 }: AppHeaderProps) {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname || '/'
  const routeId = matches[matches.length - 1]?.routeId || '/'

  // Use routeId for config lookup (handles dynamic routes like /announcements/$id)
  const configKey = routeId === '/' ? '/' : routeId.replace(/_/g, '')
  const config = routeConfig[configKey] || routeConfig[currentPath]

  // Build breadcrumbs based on parent relationships, not URL hierarchy
  const breadcrumbs: Array<{ label: string; href: string }> = []

  if (config?.parent && routeConfig[config.parent]) {
    breadcrumbs.push({
      label: routeConfig[config.parent].label,
      href: config.parent,
    })
  }

  breadcrumbs.push({
    label: config?.label || currentPath.split('/').pop() || 'Page',
    href: currentPath,
  })

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <BreadcrumbItem key={item.href}>
                  {index > 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={item.href} />}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button variant="secondary" size="icon" aria-label="Notifications">
            <Bell className="size-4 fill-current" />
          </Button>
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-pink-500 text-xs font-medium text-white ring-2 ring-background">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </div>
        <Avatar size="lg">
          <AvatarImage src="" alt="User avatar" />
          <AvatarFallback>MT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
