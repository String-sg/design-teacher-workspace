import { Link } from '@tanstack/react-router'

import { NotificationPopover } from '@/components/notifications/notification-popover'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import { useAuth } from '@/lib/auth'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'

export function AppHeader() {
  const breadcrumbs = useBreadcrumbs()
  const showNotifications = useFeatureFlag('notifications')
  const { isLoggedIn, logout } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-2">
        {showNotifications && <NotificationPopover />}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full"
                />
              }
            >
              <Avatar size="xs">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>daniel_tan@school.moe.sg</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link to="/settings" />}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={logout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link to="/login" />}
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  )
}
