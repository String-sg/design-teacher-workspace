import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { ReportDetail } from '@/components/reports/report-detail'
import { Button } from '@/components/ui/button'
import { getReportById } from '@/data/mock-reports'

export const Route = createFileRoute('/reports/$id')({
  component: ReportDetailPage,
})

function ReportDetailPage() {
  const { id } = Route.useParams()
  const report = getReportById(id)

  if (!report) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Report Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The report you're looking for doesn't exist.
          </p>
          <Button asChild className="mt-4">
            <Link to="/reports">Back to Reports</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/reports">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{report.studentName}</h1>
          <p className="text-muted-foreground">
            {report.term} {report.academicYear} - {report.studentClass}
          </p>
        </div>
      </div>

      <ReportDetail report={report} />
    </main>
  )
}
