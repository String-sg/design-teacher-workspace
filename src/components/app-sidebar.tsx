import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CircleHelp,
  FileText,
  Home,
  Megaphone,
  MessageSquare,
  ScrollText,
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
  SidebarGroupLabel,
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
  conceptTag?: boolean
  transparent?: boolean
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
]

const studentInsightItems: Array<MenuItem> = [
  {
    title: 'Student Profile',
    url: '/students',
    icon: Users,
    conceptTag: true,
  },
  {
    title: 'Student Analytics',
    url: '/student-analytics',
    icon: BarChart3,
    conceptTag: true,
  },
  {
    title: 'Insight Buddy',
    url: '/insight-buddy',
    icon: Bot,
    conceptTag: true,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
    transparent: true,
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
        <SidebarMenuItem
          key={item.title}
          className={item.transparent ? 'opacity-0 pointer-events-none' : ''}
        >
          <SidebarMenuButton
            render={<Link to={item.url} />}
            isActive={
              currentPath === item.url ||
              (item.url !== '/' && currentPath.startsWith(item.url))
            }
            tooltip={item.title}
          >
            <item.icon className="size-4" />
            <span>{item.title}</span>
            {item.conceptTag && (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-900 group-data-[collapsible=icon]:hidden">
                Concept
              </span>
            )}
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

  const filteredItems = navigationItems.filter((item) => {
    if (!item.featureFlag) return true
    if (item.featureFlag === 'announcements') return announcementsEnabled
    return true
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center justify-center gap-2 px-4 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold transition-[opacity,flex] duration-150 group-data-[collapsible=icon]:flex-[0] group-data-[collapsible=icon]:opacity-0 select-none cursor-default">
            Teacher Workspace
          </span>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pb-0">
          <SidebarGroupContent>
            <SidebarMenuItems
              items={filteredItems}
              currentPath={location.pathname}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel>Student Insight</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItems
              items={studentInsightItems}
              currentPath={location.pathname}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
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
