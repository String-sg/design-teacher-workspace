import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ds')({
  component: DsLayout,
})

function DsLayout() {
  return <Outlet />
}
