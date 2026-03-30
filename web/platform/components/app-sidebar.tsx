import { Link, useLocation } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CircleHelp,
  FileText,
  Home,
  Layers,
  Mail,
  MessageSquare,
  ScrollText,
  Settings,
  Users,
} from 'lucide-react';
import * as React from 'react';

import { useFeatureFlag } from '~/apps/pg/hooks/use-feature-flag';
import { FeedbackDialog } from '~/platform/components/feedback-dialog';
import { useAuth } from '~/platform/lib/auth';
import type { FeatureFlagKey } from '~/platform/lib/feature-flags';
import { Badge } from '~/shared/components/ui/badge';
import { Button } from '~/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '~/shared/components/ui/popover';
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
} from '~/shared/components/ui/sidebar';
import { cn } from '~/shared/lib/utils';

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
  featureFlag?: FeatureFlagKey;
  stage?: string;
  transparent?: boolean;
  alsoActiveFor?: string[];
}

const mainNavItems: MenuItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
];

const studentInsightItems: MenuItem[] = [
  {
    title: 'Analytics',
    url: '/student-analytics',
    icon: BarChart3,
    stage: 'Experiment',
    featureFlag: 'student-analytics',
  },
  {
    title: 'Profiles',
    url: '/students',
    icon: Users,
  },
  {
    title: 'Insight Buddy',
    url: '/insight-buddy',
    icon: Bot,
    stage: 'Experiment',
    featureFlag: 'student-analytics',
  },
];

const manageItems: MenuItem[] = [
  {
    title: 'Groups',
    url: '/groups',
    icon: Layers,
    conceptTag: true,
    featureFlag: 'student-groups',
  },
];

const parentsCommItems: MenuItem[] = [
  {
    title: 'Posts',
    url: '/announcements',
    icon: Mail,
    stage: 'Release 2',
    featureFlag: 'posts',
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
    stage: 'Experiment',
    featureFlag: 'holistic-reports',
  },
];

interface SidebarMenuItemsProps {
  items: MenuItem[];
  currentPath: string;
  highlightTitle?: string;
}

function SidebarMenuItems({ items, currentPath, highlightTitle }: SidebarMenuItemsProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.title}
          className={item.transparent ? 'pointer-events-none opacity-0' : ''}
        >
          <SidebarMenuButton
            render={<Link to={item.url} />}
            isActive={
              currentPath === item.url ||
              (item.url !== '/' && currentPath.startsWith(item.url)) ||
              (item.alsoActiveFor?.some((p) => currentPath.startsWith(p)) ?? false)
            }
            tooltip={item.title}
            className={
              highlightTitle === item.title
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : undefined
            }
          >
            <item.icon className="size-4" />
            <span>{item.title}</span>
            {item.stage && (
              <Badge
                variant="outline"
                className={
                  item.stage === 'Experiment'
                    ? 'border-purple-300 bg-purple-50 text-purple-700 group-data-[collapsible=icon]:hidden dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    : 'group-data-[collapsible=icon]:hidden'
                }
              >
                {item.stage}
              </Badge>
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
  );
}

const WELCOME_KEY = 'tw_welcome_seen';
const COACHMARK_KEY = 'tw_posts_coachmark_seen';

export function AppSidebar() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [showCoachMark, setShowCoachMark] = React.useState(false);
  const postsEnabled = useFeatureFlag('posts');
  const holisticReportsEnabled = useFeatureFlag('holistic-reports');
  const parentsGatewayEnabled = useFeatureFlag('parents-gateway');
  const studentAnalyticsEnabled = useFeatureFlag('student-analytics');
  const studentGroupsEnabled = useFeatureFlag('student-groups');

  React.useEffect(() => {
    if (localStorage.getItem(COACHMARK_KEY)) return;

    let timerId: ReturnType<typeof setTimeout> | undefined;

    const show = () => {
      timerId = setTimeout(() => setShowCoachMark(true), 500);
    };

    // Welcome modal won't show for logged-in users or if already dismissed
    if (isLoggedIn || sessionStorage.getItem(WELCOME_KEY)) {
      show();
      return () => clearTimeout(timerId);
    }

    // Welcome modal is open — wait for it to close
    const handler = () => show();
    window.addEventListener('welcome-dismissed', handler);
    return () => {
      window.removeEventListener('welcome-dismissed', handler);
      clearTimeout(timerId);
    };
  }, [isLoggedIn]);

  function dismissCoachMark() {
    localStorage.setItem(COACHMARK_KEY, '1');
    setShowCoachMark(false);
  }

  const filterItems = (items: MenuItem[]) =>
    items.filter((item) => {
      if (!item.featureFlag) return true;
      if (item.featureFlag === 'posts') return postsEnabled;
      if (item.featureFlag === 'holistic-reports') return holisticReportsEnabled;
      if (item.featureFlag === 'parents-gateway') return parentsGatewayEnabled;
      if (item.featureFlag === 'student-groups') return studentGroupsEnabled;
      return true;
    });

  const filteredMainItems = filterItems(mainNavItems);
  const filteredParentsItems = filterItems(parentsCommItems);
  const filteredManageItems = filterItems(manageItems);
  const filteredStudentItems = studentInsightItems.filter((item) =>
    item.featureFlag === 'student-analytics' ? studentAnalyticsEnabled : true,
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center justify-center gap-2 px-4 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
          <span className="min-w-0 flex-1 cursor-default truncate text-sm font-semibold transition-[opacity,flex] duration-150 select-none group-data-[collapsible=icon]:flex-[0] group-data-[collapsible=icon]:opacity-0">
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
            <SidebarMenuItems items={filteredMainItems} currentPath={location.pathname} />
          </SidebarGroupContent>
          <>
            <SidebarGroupLabel className="mt-2 group-data-[collapsible=icon]:pointer-events-none">
              Student Insights
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItems items={filteredStudentItems} currentPath={location.pathname} />
            </SidebarGroupContent>
          </>
          {filteredParentsItems.length > 0 && (
            <>
              <SidebarSeparator className="mx-0 mt-3" />
              <SidebarGroupLabel className="mt-2 group-data-[collapsible=icon]:pointer-events-none">
                Communications
              </SidebarGroupLabel>
              <Popover
                open={showCoachMark}
                onOpenChange={(o) => {
                  if (!o) dismissCoachMark();
                }}
              >
                <PopoverTrigger
                  render={<SidebarGroupContent className="mt-2 focus:outline-none" />}
                >
                  <SidebarMenuItems
                    items={filteredParentsItems}
                    currentPath={location.pathname}
                    highlightTitle={showCoachMark ? 'Posts' : undefined}
                  />
                </PopoverTrigger>
                <PopoverContent side="right" sideOffset={12}>
                  <PopoverHeader>
                    <PopoverTitle>New! Parents Gateway posts are here</PopoverTitle>
                    <PopoverDescription>
                      Send announcements, collect responses, and manage all parent communications in
                      one place.
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={dismissCoachMark}>
                      Got it
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
          {filteredManageItems.length > 0 && (
            <>
              <SidebarSeparator className="mx-0 mt-3" />
              <SidebarGroupLabel className="mt-2 group-data-[collapsible=icon]:pointer-events-none">
                Manage
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuItems items={filteredManageItems} currentPath={location.pathname} />
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
                <DropdownMenuItem render={<a href="#" target="_blank" rel="noopener noreferrer" />}>
                  <FileText />
                  Docs
                  <ArrowUpRight className="ml-auto size-3 text-muted-foreground" />
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href="#" target="_blank" rel="noopener noreferrer" />}>
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
  );
}
