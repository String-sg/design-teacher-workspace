import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/empty-state'

export const Route = createFileRoute('/students')({
  component: StudentsPage,
})

function StudentsPage() {
  return (
    <EmptyState
      title="No Students Yet"
      description="This page is empty. Students will be displayed here once added."
    />
  )
}
