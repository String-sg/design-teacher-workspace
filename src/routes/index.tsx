import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/empty-state'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <EmptyState
      title="Welcome to MOE Teacher Workspace"
      description="This page is empty. Start by selecting a section from the sidebar."
    />
  )
}
