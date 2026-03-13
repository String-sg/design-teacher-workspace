import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forms')({
  component: FormsLayout,
})

function FormsLayout() {
  return <Outlet />
}
