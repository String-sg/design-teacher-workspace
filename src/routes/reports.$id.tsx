import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ClipboardList, Eye, Send } from 'lucide-react'
import { toast } from 'sonner'

import type { SchoolLevel } from '@/types/report'
import { AcademicTab } from '@/components/reports/academic-tab'
import { EmailPreviewDialog } from '@/components/reports/email-preview-dialog'
import { HolisticTab } from '@/components/reports/holistic-tab'
import { ParentPreviewDialog } from '@/components/reports/parent-preview-dialog'
import { ReportOverviewTab } from '@/components/reports/report-overview-tab'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getReportById } from '@/data/mock-reports'
import { getSchoolLevel } from '@/data/mock-students'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { cn } from '@/lib/utils'

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
  const defaultLevel = report
    ? getSchoolLevel(report.studentClass)
    : 'secondary'
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>(defaultLevel)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<'parent' | 'student'>('parent')
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false)

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

  const isPrimary = schoolLevel === 'primary'

  const handlePreview = () => {
    setPreviewMode(isPrimary ? 'parent' : 'student')
    setPreviewOpen(true)
  }

  const handleSend = () => {
    setEmailPreviewOpen(true)
  }

  const handleConfirmSend = () => {
    setEmailPreviewOpen(false)
    if (isPrimary) {
      toast.success('Report sent to parent')
    } else {
      toast.success("Report sent to student's email")
    }
  }

  return (
    <>
      {/* Floating Primary/Secondary switcher */}
      <div className="fixed right-6 top-4 z-50 flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-lg">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            schoolLevel === 'primary'
              ? 'text-[#f26c47]'
              : 'text-muted-foreground',
          )}
        >
          Primary
        </span>
        <Switch
          checked={schoolLevel === 'secondary'}
          onCheckedChange={(checked: boolean) => {
            setSchoolLevel(checked ? 'secondary' : 'primary')
          }}
        />
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            schoolLevel === 'secondary'
              ? 'text-[#f26c47]'
              : 'text-muted-foreground',
          )}
        >
          Secondary
        </span>
      </div>

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
        </div>

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
            <AcademicTab
              data={report.academic}
              secondaryData={report.secondaryAcademic}
              schoolLevel={schoolLevel}
            />
          </TabsContent>
          <TabsContent value="holistic">
            <HolisticTab
              data={report.holistic}
              studentFirstName={getFirstName(report.studentName)}
            />
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 flex gap-3 border-t bg-white py-4">
          <Button variant="outline" className="flex-1" onClick={handlePreview}>
            <Eye className="mr-2 size-4" />
            {isPrimary ? 'Preview as Parent' : 'Preview as Student'}
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
            onClick={handleSend}
          >
            <Send className="mr-2 size-4" />
            {isPrimary ? 'Send to Parent' : 'Send to Students'}
          </Button>
        </div>

        <ParentPreviewDialog
          report={report}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          studentFirstName={getFirstName(report.studentName)}
          previewMode={previewMode}
          schoolLevel={schoolLevel}
        />

        <EmailPreviewDialog
          report={report}
          open={emailPreviewOpen}
          onOpenChange={setEmailPreviewOpen}
          recipientType={isPrimary ? 'parent' : 'student'}
          onSend={handleConfirmSend}
        />
      </main>
    </>
  )
}
