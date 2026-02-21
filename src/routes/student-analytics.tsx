import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock } from 'lucide-react'

import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonitoringAcademicAnalytics } from '@/components/students/academic-analytics'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/student-analytics')({
  component: StudentAnalyticsPage,
})

function ComingSoon({ description }: { description?: string }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Clock className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-xl font-medium text-foreground">Coming soon</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

type AcademicView = 'monitoring' | 'benchmark'

function StudentAnalyticsPage() {
  useSetBreadcrumbs([
    { label: 'Student Analytics', href: '/student-analytics' },
  ])

  const [academicView, setAcademicView] = useState<AcademicView>('monitoring')

  return (
    <div className="flex flex-col p-6">
      {/* Page header */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Student Analytics</h1>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-900">
          Concept illustration
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Monitor trends and explore student data
      </p>

      {/* Main tabs */}
      <Tabs defaultValue="academic" className="mt-6">
        <TabsList variant="line">
          <TabsTrigger
            value="academic"
            className="after:bg-blue-600! data-active:text-blue-600"
          >
            Academic
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="after:bg-blue-600! data-active:text-blue-600"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="wellbeing"
            className="after:bg-blue-600! data-active:text-blue-600"
          >
            Wellbeing
          </TabsTrigger>
        </TabsList>

        {/* Academic tab */}
        <TabsContent value="academic">
          {/* Segmented control */}
          <div className="mt-4 flex w-fit rounded-full bg-muted p-1">
            <button
              onClick={() => setAcademicView('monitoring')}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                academicView === 'monitoring'
                  ? 'bg-background/90 text-foreground shadow-xs'
                  : 'text-foreground/50 hover:text-foreground/80',
              )}
            >
              Monitoring
            </button>
            <button
              onClick={() => setAcademicView('benchmark')}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                academicView === 'benchmark'
                  ? 'bg-background/90 text-foreground shadow-xs'
                  : 'text-foreground/50 hover:text-foreground/80',
              )}
            >
              Benchmark reports
            </button>
          </div>

          {academicView === 'benchmark' ? (
            <ComingSoon description="Benchmark reports are being prepared. They'll appear here once ready." />
          ) : (
            <MonitoringAcademicAnalytics />
          )}
        </TabsContent>

        {/* Attendance tab */}
        <TabsContent value="attendance">
          <ComingSoon description="Attendance trends and insights across your classes are on their way." />
        </TabsContent>

        {/* Wellbeing tab */}
        <TabsContent value="wellbeing">
          <ComingSoon description="Wellbeing analytics to help you support your students are on their way." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
