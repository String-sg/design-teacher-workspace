import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_allears/allears')({
  component: AllearsPathLayout,
})

function AllearsPathLayout() {
  return <Outlet />
}
