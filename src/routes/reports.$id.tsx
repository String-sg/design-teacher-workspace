import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ClipboardList, Eye, Send } from 'lucide-react'
import { toast } from 'sonner'

import { AcademicSection } from '@/components/reports/academic-section'
import { AcademicTab } from '@/components/reports/academic-tab'
import { CharacterSection } from '@/components/reports/character-section'
import { HolisticTab } from '@/components/reports/holistic-tab'
import { ParentPreviewDialog } from '@/components/reports/parent-preview-dialog'
import { ReportDetail } from '@/components/reports/report-detail'
import { ReportOverviewTab } from '@/components/reports/report-overview-tab'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getReportById } from '@/data/mock-reports'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/reports/$id')({
  component: ReportDetailPage,
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getFirstName(name: string): string {
  return name.split(' ').filter((part) => part.length > 0)[0] ?? name
}

function ReportDetailPage() {
  const { id } = Route.useParams()
  const report = getReportById(id)
  const [classicView, setClassicView] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const breadcrumbLabel = report
    ? `${report.studentName} - ${report.term} ${report.academicYear}`
    : 'Report'

  useSetBreadcrumbs([
    { label: 'Reports', href: '/reports' },
    { label: breadcrumbLabel, href: `/reports/${id}` },
  ])

  if (!report) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
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
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/reports">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Avatar size="lg">
          <AvatarFallback>{getInitials(report.studentName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {report.studentName}
            <span className="text-muted-foreground ml-2 text-base font-normal">
              {report.studentClass}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Issued{' '}
            {report.generatedAt.toLocaleDateString('en-SG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Classic</span>
          <Switch
            checked={classicView}
            onCheckedChange={setClassicView}
            size="sm"
          />
        </label>
      </div>

      {classicView ? (
        <ReportDetail report={report} />
      ) : (
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger
              value="overview"
              className="data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="academic"
              className="data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
            >
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="holistic"
              className="data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
            >
              Holistic
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ReportOverviewTab report={report} />
          </TabsContent>
          <TabsContent value="academic">
            <AcademicTab data={report.academic} />
          </TabsContent>
          <TabsContent value="holistic">
            <HolisticTab
              data={report.holistic}
              studentFirstName={getFirstName(report.studentName)}
            />
          </TabsContent>
        </Tabs>
      )}

      {!classicView && (
        <div className="sticky bottom-0 flex gap-3 border-t bg-white py-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="mr-2 size-4" />
            Preview as Parent
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toast.success('Review requested')}
          >
            <ClipboardList className="mr-2 size-4" />
            Request for Review
          </Button>
          <Button
            className="flex-1 bg-[#f26c47] text-white hover:bg-[#e05a37]"
            onClick={() => toast.success('Report sent to parent')}
          >
            <Send className="mr-2 size-4" />
            Send to Parent
          </Button>
        </div>
      )}

      <ParentPreviewDialog
        report={report}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        studentFirstName={getFirstName(report.studentName)}
      />
    </main>
  )
}
