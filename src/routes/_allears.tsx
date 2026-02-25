import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'

export const Route = createFileRoute('/_allears')({
  component: AllearsLayout,
})

function AllearsLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
      <Toaster position="bottom-center" />
    </div>
  )
}
