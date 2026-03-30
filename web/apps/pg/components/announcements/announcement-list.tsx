import { useMemo } from 'react';

import type { Announcement } from '~/apps/pg/types/announcement';

import { AnnouncementCard } from './announcement-card';

interface AnnouncementListProps {
  announcements: Announcement[];
}

type TimeGroup =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'Last Week'
  | 'This Month'
  | 'Last Month'
  | 'Older';

function getTimeGroup(date: Date): TimeGroup {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  // Get start of this week (Sunday)
  const startOfThisWeek = new Date(startOfToday);
  startOfThisWeek.setDate(startOfThisWeek.getDate() - startOfThisWeek.getDay());

  // Get start of last week
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  // Get start of this month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get start of last month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  if (date >= startOfToday) {
    return 'Today';
  }
  if (date >= startOfYesterday) {
    return 'Yesterday';
  }
  if (date >= startOfThisWeek) {
    return 'This Week';
  }
  if (date >= startOfLastWeek) {
    return 'Last Week';
  }
  if (date >= startOfThisMonth) {
    return 'This Month';
  }
  if (date >= startOfLastMonth) {
    return 'Last Month';
  }
  return 'Older';
}

const groupOrder: TimeGroup[] = [
  'Today',
  'Yesterday',
  'This Week',
  'Last Week',
  'This Month',
  'Last Month',
  'Older',
];

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const groupedAnnouncements = useMemo(() => {
    const groups = new Map<TimeGroup, Announcement[]>();

    // Sort by date descending first
    const sorted = [...announcements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Group by time period
    for (const announcement of sorted) {
      const group = getTimeGroup(announcement.createdAt);
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(announcement);
    }

    // Return in order
    return groupOrder
      .filter((group) => groups.has(group))
      .map((group) => ({
        label: group,
        announcements: groups.get(group)!,
      }));
  }, [announcements]);

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">No announcements</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedAnnouncements.map((group) => (
        <div key={group.label}>
          <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {group.label}
          </h2>
          <div className="space-y-2">
            {group.announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
