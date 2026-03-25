import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups')({
  component: () => <Outlet />,
})
