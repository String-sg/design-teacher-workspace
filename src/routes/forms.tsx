import {
  Outlet,
  Link,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/forms')({
  component: FormsLayout,
})

function FormsLayout() {
  const location = useLocation()
  const isSubPage =
    location.pathname.startsWith('/forms/new') ||
    (location.pathname.startsWith('/forms/') &&
      location.pathname !== '/forms/' &&
      location.pathname !== '/forms')

  // Sub-pages (new form, form detail) render without the shared tabs
  if (isSubPage) {
    return <Outlet />
  }

  return (
    <div className="flex flex-col">
      <div className="border-b px-6 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Announcements & Forms</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage parent communications, announcements, and forms
            </p>
          </div>
          <Button render={<Link to="/forms/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>
        <Tabs value="forms" className="mt-4">
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
