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

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/students': 'Student dashboard',
}

interface AppHeaderProps {
  notificationCount?: number
}

export function AppHeader({ notificationCount = 0 }: AppHeaderProps) {
  const matches = useMatches()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...matches
      .filter((match) => match.pathname !== '/')
      .map((match) => ({
        label: routeLabels[match.pathname] || match.pathname,
        href: match.pathname,
      })),
  ]
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <BreadcrumbItem key={item.label}>
                  {index > 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={item.href || '/'} />}>
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
          <Button variant="ghost" size="icon">
            <Bell className="size-4" />
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
