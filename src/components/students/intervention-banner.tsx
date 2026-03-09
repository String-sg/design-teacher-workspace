import { useState } from 'react'
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react'

import { interventionRules } from '@/data/intervention-config'
import type { Student } from '@/types/student'
import { Button } from '@/components/ui/button'
import { LtaDialog } from '@/components/students/lta-dialog'

interface InterventionBannerProps {
  student: Student
}

export function InterventionBanner({ student }: InterventionBannerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!student.attentionTags.includes('LTA')) return null

  const ltaPkg = interventionRules
    .map((r) => (r.trigger(student) ? r.buildPackage(student) : null))
    .find((p) => p?.id === 'lta')

  if (!ltaPkg) return null

  return (
    <>
      <div className="rounded-lg border bg-slate-50 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-semibold">Action required</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-foreground">
            LTA: long-term absenteeism
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {ltaPkg.why}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setDialogOpen(true)}
          >
            Check
          </Button>
        </div>
      </div>

      <LtaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
