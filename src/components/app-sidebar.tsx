import { Link, useLocation } from '@tanstack/react-router'
import { GraduationCap, Home, Megaphone, Users } from 'lucide-react'

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

const topItems = [
  {
    title: 'Announcements',
    shortTitle: 'Announce',
    url: '/announcements',
    icon: Megaphone,
    badge: 3,
  },
]

const navigationItems = [
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

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex items-center gap-2 px-2 py-2 ${isCollapsed ? 'justify-center' : ''}`}
        >
          {isCollapsed ? (
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
          ) : (
            <span className="text-lg font-semibold">Teacher Workspace</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link to={item.url} />}
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className={isCollapsed ? 'flex-col h-auto py-2 gap-1' : ''}
                  >
                    <item.icon className={isCollapsed ? 'size-5' : 'size-4'} />
                    <span
                      className={isCollapsed ? 'text-[10px] leading-tight' : ''}
                    >
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
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link to={item.url} />}
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className={isCollapsed ? 'flex-col h-auto py-2 gap-1' : ''}
                  >
                    <item.icon className={isCollapsed ? 'size-5' : 'size-4'} />
                    <span
                      className={isCollapsed ? 'text-[10px] leading-tight' : ''}
                    >
                      {isCollapsed ? item.shortTitle : item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
