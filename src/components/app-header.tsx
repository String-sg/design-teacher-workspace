import { Link, useMatches } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'

// Route configuration with labels and parent relationships
const routeConfig: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Home' },
  '/students': { label: 'Student dashboard' },
  '/announcements': { label: 'Announcements' },
  '/announcements/': { label: 'Announcements' },
  '/announcements/$id': { label: 'Announcement', parent: '/announcements' },
}

export function AppHeader() {
  const matches = useMatches()

  const lastMatch = matches.at(-1)!
  const currentPath = lastMatch.pathname
  const routeId = lastMatch.routeId

  // Use routeId for config lookup (handles dynamic routes like /announcements/$id)
  const configKey = routeId === '/' ? '/' : routeId.replace(/_/g, '')
  const config = routeConfig[configKey]

  // Build breadcrumbs based on parent relationships, not URL hierarchy
  const breadcrumbs: Array<{ label: string; href: string }> = []

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- config may be undefined for unregistered routes
  if (config?.parent) {
    const parentConfig = routeConfig[config.parent]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (parentConfig) {
      breadcrumbs.push({
        label: parentConfig.label,
        href: config.parent,
      })
    }
  }

  const defaultLabel = currentPath.split('/').pop() || 'Page'
  breadcrumbs.push({
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- config may be undefined for unregistered routes
    label: config?.label ?? defaultLabel,
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

      <Avatar size="lg">
        <AvatarImage src="" alt="User avatar" />
        <AvatarFallback>MT</AvatarFallback>
      </Avatar>
    </header>
  )
}
