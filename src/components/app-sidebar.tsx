import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  ArrowUpRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Home,
  Megaphone,
  MessageSquare,
  ScrollText,
  Send,
  Settings,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { FeatureFlagKey } from '@/lib/feature-flags'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { useFeatureFlag } from '@/hooks/use-feature-flag'

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
    title: 'Announcement',
    url: '/parents-gateway',
    icon: Send,
    featureFlag: 'parents-gateway',
  },
  {
    title: 'Forms',
    url: '/forms',
    icon: ClipboardList,
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
  const [feedbackOpen, setFeedbackOpen] = React.useState(false)

  const announcementsEnabled = useFeatureFlag('announcements')
  const holisticReportsEnabled = useFeatureFlag('holistic-reports')
  const parentsGatewayEnabled = useFeatureFlag('parents-gateway')

  const filteredItems = navigationItems.filter((item) => {
    if (!item.featureFlag) return true
    if (item.featureFlag === 'announcements') return announcementsEnabled
    if (item.featureFlag === 'holistic-reports') return holisticReportsEnabled
    if (item.featureFlag === 'parents-gateway') return parentsGatewayEnabled
    return true
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center justify-center gap-2 px-4 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold transition-[opacity,flex] duration-150 group-data-[collapsible=icon]:flex-[0] group-data-[collapsible=icon]:opacity-0">
            Teacher Workspace
            <span className="ml-1.5 rounded-full bg-twblue-3 px-1.5 py-0.5 text-xs font-medium text-twblue-9">
              Beta
            </span>
          </span>
          <SidebarTrigger />
        </div>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link to="/settings" />}
              isActive={location.pathname === '/settings'}
              tooltip="Settings"
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton tooltip="Help">
                    <CircleHelp className="size-4" />
                    <span>Help</span>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem onClick={() => setFeedbackOpen(true)}>
                  <MessageSquare />
                  Send feedback
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <a href="#" target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <FileText />
                  Docs
                  <ArrowUpRight className="ml-auto size-3 text-muted-foreground" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={
                    <a href="#" target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <ScrollText />
                  Changelog
                  <ArrowUpRight className="ml-auto size-3 text-muted-foreground" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </Sidebar>
  )
}
