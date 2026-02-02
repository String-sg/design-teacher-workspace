import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import type { HolisticReport } from '@/types/report'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, getStatusColor } from '@/lib/utils'
import {
  offencesThresholds,
  overallPercentageThresholds,
  riskIndicatorsThresholds,
} from '@/data/threshold-config'

interface ReportCardProps {
  report: HolisticReport
}

export function ReportCard({ report }: ReportCardProps) {
  const conductColors: Record<string, string> = {
    Excellent: 'bg-green-100 text-green-700 hover:bg-green-100',
    Good: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    Fair: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    Poor: 'bg-red-100 text-red-700 hover:bg-red-100',
  }

  return (
    <Link to="/reports/$id" params={{ id: report.id }}>
      <Card
        size="sm"
        className="hover:ring-foreground/20 cursor-pointer transition-all hover:shadow-md"
      >
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{report.studentName}</CardTitle>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>{report.studentClass}</span>
              <span>·</span>
              <span>
                {report.term} {report.academicYear}
              </span>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground size-5" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Overall:</span>
              <span
                className={cn(
                  'font-medium',
                  getStatusColor(
                    report.academic.overallPercentage,
                    overallPercentageThresholds,
                  ),
                )}
              >
                {report.academic.overallPercentage}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Conduct:</span>
              <Badge className={conductColors[report.character.conduct]}>
                {report.character.conduct}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Offences:</span>
              <span
                className={cn(
                  'font-medium',
                  getStatusColor(report.character.offences, offencesThresholds),
                )}
              >
                {report.character.offences}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Risk:</span>
              <span
                className={cn(
                  'font-medium',
                  getStatusColor(
                    report.character.riskIndicators,
                    riskIndicatorsThresholds,
                  ),
                )}
              >
                {report.character.riskIndicators}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
