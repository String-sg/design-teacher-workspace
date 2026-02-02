import { Link, useLocation } from '@tanstack/react-router'
import { FileText, Home, Megaphone, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { FeatureFlagKey } from '@/lib/feature-flags'
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { useFeatureIsOn } from '@/lib/feature-flags'

interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
  badge?: number
  featureFlag?: FeatureFlagKey
}

const navigationItems: Array<MenuItem> = [
  {
    title: 'Announcements',
    url: '/announcements',
    icon: Megaphone,
    badge: 3,
    featureFlag: 'announcements',
  },
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Students',
    url: '/students',
    icon: Users,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
    featureFlag: 'holistic-reports',
  },
]

interface SidebarMenuItemsProps {
  items: Array<MenuItem>
  currentPath: string
}

function SidebarMenuItems({ items, currentPath }: SidebarMenuItemsProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            render={<Link to={item.url} />}
            isActive={currentPath === item.url}
            tooltip={item.title}
          >
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </SidebarMenuButton>
          {item.badge && (
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

  const announcementsEnabled = useFeatureIsOn('announcements')
  const holisticReportsEnabled = useFeatureIsOn('holistic-reports')

  const filteredItems = navigationItems.filter((item) => {
    if (!item.featureFlag) return true
    if (item.featureFlag === 'announcements') return announcementsEnabled
    if (item.featureFlag === 'holistic-reports') return holisticReportsEnabled
    return true
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={
          isCollapsed ? 'flex flex-col items-center gap-2 px-2 py-4' : 'p-0'
        }
      >
        {isCollapsed ? (
          <SidebarTrigger />
        ) : (
          <div className="flex h-14 items-center justify-between gap-2 px-4">
            <span className="text-sm font-semibold">Teacher Workspace</span>
            <SidebarTrigger />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItems
              items={filteredItems}
              currentPath={location.pathname}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
