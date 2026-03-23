import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forms2')({
  component: Forms2Layout,
})

function Forms2Layout() {
  return <Outlet />
}
