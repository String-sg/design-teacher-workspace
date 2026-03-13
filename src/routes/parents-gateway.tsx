import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/parents-gateway')({
  component: ParentsGatewayLayout,
})

function ParentsGatewayLayout() {
  return <Outlet />
}
