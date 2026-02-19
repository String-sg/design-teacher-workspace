import { createFileRoute } from '@tanstack/react-router'

import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/student-analytics')({
  component: StudentAnalyticsPage,
})

function StudentAnalyticsPage() {
  useSetBreadcrumbs([
    { label: 'Student Analytics', href: '/student-analytics' },
  ])

  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Student Analytics</h1>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Concept illustration
        </span>
      </div>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
