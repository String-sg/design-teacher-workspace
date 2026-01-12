import { Link, useLocation } from '@tanstack/react-router'
import { GraduationCap, Home, Megaphone, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { NotificationPopover } from '@/components/notifications/notification-popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'

interface MenuItem {
  title: string
  shortTitle: string
  url: string
  icon: LucideIcon
  badge?: number
}

const topItems: Array<MenuItem> = [
  {
    title: 'Announcements',
    shortTitle: 'Announce',
    url: '/announcements',
    icon: Megaphone,
    badge: 3,
  },
]

const navigationItems: Array<MenuItem> = [
  {
    title: 'Home',
    shortTitle: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Students',
    shortTitle: 'Students',
    url: '/students',
    icon: Users,
  },
]

interface SidebarMenuItemsProps {
  items: Array<MenuItem>
  isCollapsed: boolean
  currentPath: string
}

function SidebarMenuItems({
  items,
  isCollapsed,
  currentPath,
}: SidebarMenuItemsProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            render={<Link to={item.url} />}
            isActive={currentPath === item.url}
            tooltip={item.title}
            className={isCollapsed ? 'flex-col h-auto py-2 gap-1' : ''}
          >
            <item.icon className={isCollapsed ? 'size-5' : 'size-4'} />
            <span className={isCollapsed ? 'text-[10px] leading-tight' : ''}>
              {isCollapsed ? item.shortTitle : item.title}
            </span>
          </SidebarMenuButton>
          {item.badge && !isCollapsed && (
            <SidebarMenuBadge className="bg-muted text-muted-foreground">
              {item.badge}
            </SidebarMenuBadge>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex items-center gap-2 px-2 py-2 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          {isCollapsed ? (
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
          ) : (
            <>
              <span className="text-lg font-semibold">Teacher Workspace</span>
              <NotificationPopover />
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItems
              items={topItems}
              isCollapsed={isCollapsed}
              currentPath={location.pathname}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItems
              items={navigationItems}
              isCollapsed={isCollapsed}
              currentPath={location.pathname}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
