import { useMemo } from 'react'

import { ReportCard } from './report-card'
import type { HolisticReport } from '@/types/report'
import { EmptyState } from '@/components/empty-state'

interface ReportListProps {
  reports: Array<HolisticReport>
}

export function ReportList({ reports }: ReportListProps) {
  const groupedReports = useMemo(() => {
    const groups = new Map<string, Array<HolisticReport>>()

    for (const report of reports) {
      const key = report.studentName
      const existing = groups.get(key) || []
      existing.push(report)
      groups.set(key, existing)
    }

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [reports])

  if (reports.length === 0) {
    return (
      <EmptyState
        title="No reports found"
        description="Try adjusting your filters to see more reports."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedReports.map(([studentName, studentReports]) => (
        <div key={studentName} className="flex flex-col gap-3">
          {studentReports.length > 1 && (
            <h2 className="text-muted-foreground text-sm font-medium">
              {studentName}
            </h2>
          )}
          <div className="flex flex-col gap-3">
            {studentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
