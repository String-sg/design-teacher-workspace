import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CircleHelp,
  FileText,
  Home,
  Layers,
  Mail,
  Megaphone,
  MessageSquare,
  ScrollText,
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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
  alsoActiveFor?: string[]
}

const mainNavItems: Array<MenuItem> = [
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
    title: 'Analytics',
    url: '/student-analytics',
    icon: BarChart3,
    conceptTag: true,
    featureFlag: 'student-analytics',
  },
  {
    title: 'Profiles',
    url: '/students',
    icon: Users,
    conceptTag: true,
  },
  {
    title: 'Insight Buddy',
    url: '/insight-buddy',
    icon: Bot,
    conceptTag: true,
    featureFlag: 'student-analytics',
  },
  {
    title: 'Groups',
    url: '/groups',
    icon: Layers,
    conceptTag: true,
  },
]

const parentsCommItems: Array<MenuItem> = [
  {
    title: 'Announcements & Forms',
    url: '/announcements',
    icon: Mail,
    featureFlag: 'parents-gateway',
    alsoActiveFor: ['/forms'],
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
        <SidebarMenuItem
          key={item.title}
          className={item.transparent ? 'opacity-0 pointer-events-none' : ''}
        >
          <SidebarMenuButton
            render={<Link to={item.url} />}
            isActive={
              currentPath === item.url ||
              (item.url !== '/' && currentPath.startsWith(item.url)) ||
              (item.alsoActiveFor?.some((p) => currentPath.startsWith(p)) ??
                false)
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
  const holisticReportsEnabled = useFeatureFlag('holistic-reports')
  const parentsGatewayEnabled = useFeatureFlag('parents-gateway')
  const studentAnalyticsEnabled = useFeatureFlag('student-analytics')

  const filterItems = (items: Array<MenuItem>) =>
    items.filter((item) => {
      if (!item.featureFlag) return true
      if (item.featureFlag === 'announcements') return announcementsEnabled
      if (item.featureFlag === 'holistic-reports') return holisticReportsEnabled
      if (item.featureFlag === 'parents-gateway') return parentsGatewayEnabled
      return true
    })

  const filteredMainItems = filterItems(mainNavItems)
  const filteredParentsItems = filterItems(parentsCommItems)
  const filteredStudentItems = studentInsightItems.filter((item) =>
    item.featureFlag === 'student-analytics' ? studentAnalyticsEnabled : true,
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center justify-center gap-2 px-4 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold transition-[opacity,flex] duration-150 group-data-[collapsible=icon]:flex-[0] group-data-[collapsible=icon]:opacity-0 select-none cursor-default">
            Teacher Workspace
            <span className="ml-1.5 rounded-full bg-twblue-3 px-1.5 py-0.5 text-xs font-medium text-twblue-9">
              Beta
            </span>
          </span>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pb-0">
          <SidebarGroupContent>
            <SidebarMenuItems
              items={filteredMainItems}
              currentPath={location.pathname}
            />
          </SidebarGroupContent>
          <>
            <SidebarGroupLabel className="mt-2 group-data-[collapsible=icon]:pointer-events-none">
              Student Insights
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItems
                items={filteredStudentItems}
                currentPath={location.pathname}
              />
            </SidebarGroupContent>
          </>
          {filteredParentsItems.length > 0 && (
            <>
              <SidebarSeparator className="mx-0 mt-3" />
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems
                  items={filteredParentsItems}
                  currentPath={location.pathname}
                />
              </SidebarGroupContent>
            </>
          )}
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
