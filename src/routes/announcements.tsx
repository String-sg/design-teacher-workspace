import {
  Outlet,
  Link,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/announcements')({
  component: AnnouncementsLayout,
})

function AnnouncementsLayout() {
  const location = useLocation()
  const isSubPage =
    location.pathname.startsWith('/announcements/new') ||
    (location.pathname.startsWith('/announcements/') &&
      location.pathname !== '/announcements/' &&
      location.pathname !== '/announcements')

  if (isSubPage) {
    return <Outlet />
  }

  return (
    <div className="flex flex-col">
      <div className="border-b px-4 pt-4 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">
            Announcements & Forms
          </h1>
          <Button size="sm" render={<Link to="/announcements/new" />}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create
          </Button>
        </div>
        <p className="mt-1 hidden text-sm text-muted-foreground md:block">
          Manage parent communications, announcements, and forms
        </p>
        <Tabs value="announcements" className="mt-3 md:mt-4">
          <TabsList variant="line">
            <TabsTrigger
              value="announcements"
              render={<Link to="/announcements" />}
            >
              Announcements
            </TabsTrigger>
            <TabsTrigger value="forms" render={<Link to="/forms" />}>
              Forms
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Outlet />
    </div>
  )
}
