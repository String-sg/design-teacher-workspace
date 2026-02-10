import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ReportOverviewTab } from './report-overview-tab'
import { AcademicTab } from './academic-tab'
import { HolisticTab } from './holistic-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { HolisticReport } from '@/types/report'

interface ParentPreviewDialogProps {
  report: HolisticReport
  open: boolean
  onOpenChange: (open: boolean) => void
  studentFirstName: string
}

export function ParentPreviewDialog({
  report,
  open,
  onOpenChange,
  studentFirstName,
}: ParentPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-w-sm flex-col gap-0 overflow-hidden rounded-[2.5rem] p-0"
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <DialogHeader className="flex-1">
            <DialogTitle className="text-sm">
              Parent Mobile Preview
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-6 pt-4">
            <div className="mb-1 text-lg font-semibold">
              {report.studentName}
              <span className="text-muted-foreground ml-1.5 text-sm font-normal">
                {report.studentClass}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              {report.term} {report.academicYear}
            </p>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList variant="line">
                <TabsTrigger
                  value="overview"
                  className="text-xs data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="academic"
                  className="text-xs data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
                >
                  Academic
                </TabsTrigger>
                <TabsTrigger
                  value="holistic"
                  className="text-xs data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
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
                  studentFirstName={studentFirstName}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <Button
            className="w-full bg-[#12b886] text-white hover:bg-[#0ca678]"
            size="sm"
            disabled
          >
            Acknowledge Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
