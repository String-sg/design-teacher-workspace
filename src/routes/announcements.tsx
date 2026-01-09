import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/announcements')({
  component: AnnouncementsLayout,
})

function AnnouncementsLayout() {
  return <Outlet />
}
