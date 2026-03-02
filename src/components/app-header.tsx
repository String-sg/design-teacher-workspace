import { Link } from '@tanstack/react-router'
import { ChevronRight, MessageCircle } from 'lucide-react'

import { NotificationPopover } from '@/components/notifications/notification-popover'
import { useHeyTalia } from '@/components/heytalia/heytalia-context'
import { AGENTS } from '@/components/heytalia/heytalia-panel'
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
  const { setView } = useHeyTalia()

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
      <div className="flex items-center justify-center gap-3">
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
        <div className="h-4 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="gap-1.5" />
            }
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Assistant
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="text-sm font-semibold">Teacher Assistant</span>
                <p className="text-xs font-normal text-muted-foreground">
                  Choose an agent to help you
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {AGENTS.map((agent) => (
              <DropdownMenuItem
                key={agent.id}
                onSelect={() => setView('chat')}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${agent.color}15` }}
                >
                  <img
                    src={agent.icon}
                    alt={agent.name}
                    className="h-6 w-6 rounded"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">
                      {agent.name}
                    </span>
                    {agent.tag && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          background: `${agent.color}18`,
                          color: agent.color,
                        }}
                      >
                        {agent.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
