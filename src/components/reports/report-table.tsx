import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { HolisticReport } from '@/types/report'
import { cn, getStatusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'
import {
  absencesThresholds,
  ccaMissedThresholds,
  lateComingThresholds,
  offencesThresholds,
  overallPercentageThresholds,
  riskIndicatorsThresholds,
} from '@/data/threshold-config'

interface ReportTableProps {
  reports: Array<HolisticReport>
  className?: string
  pageSize?: number
}

export function ReportTable({
  reports,
  className,
  pageSize = 20,
}: ReportTableProps) {
  const navigate = useNavigate()

  const {
    currentPage,
    totalPages,
    startIndex,
    pageNumbers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    totalItems: reports.length,
    pageSize,
  })

  const paginatedReports = useMemo(() => {
    return reports.slice(startIndex, startIndex + pageSize)
  }, [reports, startIndex, pageSize])

  const displayStartIndex = startIndex + 1

  return (
    <div className={cn('max-w-full overflow-x-auto bg-white', className)}>
      <Table>
        <TableHeader className="border-b bg-white">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="sticky left-0 z-10 w-12 min-w-12 bg-white pl-6">
              #
            </TableHead>
            <TableHead className="sticky left-12 z-10 min-w-[150px] bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Name
            </TableHead>
            <TableHead className="min-w-[90px]">Class</TableHead>
            <TableHead className="min-w-[90px]">Term</TableHead>
            <TableHead className="min-w-[100px]">Overall %</TableHead>
            <TableHead className="min-w-[100px]">Conduct</TableHead>
            <TableHead className="min-w-[90px]">Absences</TableHead>
            <TableHead className="min-w-[100px]">Late</TableHead>
            <TableHead className="min-w-[100px]">CCA Missed</TableHead>
            <TableHead className="min-w-[90px]">Offences</TableHead>
            <TableHead className="min-w-[100px] pr-6">Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReports.map((report, index) => (
            <TableRow
              key={report.id}
              className="cursor-pointer"
              onClick={() => navigate({ to: '/reports/$id', params: { id: report.id } })}
            >
              <TableCell className="sticky left-0 z-10 bg-white pl-6 text-muted-foreground">
                {displayStartIndex + index}
              </TableCell>
              <TableCell className="sticky left-12 z-10 bg-white font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {report.studentName}
              </TableCell>
              <TableCell>{report.studentClass}</TableCell>
              <TableCell>
                <Badge variant="outline">{report.term}</Badge>
              </TableCell>
              <TableCell>
                <span
                  className={getStatusColor(
                    report.academic.overallPercentage,
                    overallPercentageThresholds,
                  )}
                >
                  {report.academic.overallPercentage}%
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    report.character.conduct === 'Poor' &&
                      'bg-red-100 text-red-700 hover:bg-red-100',
                    report.character.conduct === 'Fair' &&
                      'bg-amber-100 text-amber-700 hover:bg-amber-100',
                    report.character.conduct === 'Good' &&
                      'bg-slate-100 text-slate-700 hover:bg-slate-100',
                    report.character.conduct === 'Excellent' &&
                      'bg-green-100 text-green-700 hover:bg-green-100',
                  )}
                >
                  {report.character.conduct}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className={getStatusColor(
                    report.character.absences,
                    absencesThresholds,
                  )}
                >
                  {report.character.absences}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={getStatusColor(
                    report.character.lateComing,
                    lateComingThresholds,
                  )}
                >
                  {report.character.lateComing}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={getStatusColor(
                    report.character.ccaMissed,
                    ccaMissedThresholds,
                  )}
                >
                  {report.character.ccaMissed}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={getStatusColor(
                    report.character.offences,
                    offencesThresholds,
                  )}
                >
                  {report.character.offences}
                </span>
              </TableCell>
              <TableCell className="pr-6">
                <span
                  className={getStatusColor(
                    report.character.riskIndicators,
                    riskIndicatorsThresholds,
                  )}
                >
                  {report.character.riskIndicators}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Record count and Pagination */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <div className="text-sm text-muted-foreground">
          {reports.length} reports
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {pageNumbers.map((page, index) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? 'outline' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
