import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { AnnouncementList } from '@/components/announcements/announcement-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockAnnouncements } from '@/data/mock-announcements'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/announcements/')({
  component: AnnouncementsPage,
})

// Static filtering - computed once at module level since mockAnnouncements never changes
const unreadAnnouncements = mockAnnouncements.filter((a) => !a.isRead)

function AnnouncementsPage() {
  useSetBreadcrumbs([{ label: 'Announcements', href: '/announcements' }])

  const [activeTab, setActiveTab] = useState<string>('to-read')

  const unreadCount = unreadAnnouncements.length

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news and updates
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="to-read">
            To Read
            {unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-pink-500 px-1.5 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="to-read" className="mt-6">
          <AnnouncementList announcements={unreadAnnouncements} />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <AnnouncementList announcements={mockAnnouncements} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
