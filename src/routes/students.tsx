import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/students')({
  component: StudentsLayout,
})

function StudentsLayout() {
  return <Outlet />
}
