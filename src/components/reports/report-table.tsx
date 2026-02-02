import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { HolisticReport, ParentStatus, ReviewStatus } from '@/types/report'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'

interface ReportTableProps {
  reports: Array<HolisticReport>
  className?: string
  pageSize?: number
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
}

function getReviewStatusBadge(status: ReviewStatus) {
  const config = {
    pending: {
      label: 'Pending',
      className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    },
    in_review: {
      label: 'In Review',
      className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    },
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
    },
  }
  const { label, className } = config[status]
  return <Badge className={className}>{label}</Badge>
}

function getParentStatusBadge(status: ParentStatus) {
  const config = {
    not_sent: {
      label: 'Not Sent',
      className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    },
    sent: {
      label: 'Sent',
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    },
    viewed: {
      label: 'Viewed',
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
    },
  }
  const { label, className } = config[status]
  return <Badge className={className}>{label}</Badge>
}

export function ReportTable({
  reports,
  className,
  pageSize = 20,
  selectedIds,
  onSelectionChange,
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

  const paginatedIds = useMemo(() => {
    return new Set(paginatedReports.map((r) => r.id))
  }, [paginatedReports])

  const allPageSelected =
    paginatedReports.length > 0 &&
    paginatedReports.every((r) => selectedIds.has(r.id))

  const somePageSelected =
    paginatedReports.some((r) => selectedIds.has(r.id)) && !allPageSelected

  const handleSelectAll = () => {
    if (allPageSelected) {
      // Deselect all on current page
      const newSelection = new Set(selectedIds)
      for (const id of paginatedIds) {
        newSelection.delete(id)
      }
      onSelectionChange(newSelection)
    } else {
      // Select all on current page
      const newSelection = new Set(selectedIds)
      for (const id of paginatedIds) {
        newSelection.add(id)
      }
      onSelectionChange(newSelection)
    }
  }

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }

  return (
    <div className={cn('max-w-full overflow-x-auto bg-white', className)}>
      <Table>
        <TableHeader className="border-b bg-white">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="sticky left-0 z-10 w-12 min-w-12 bg-white pl-6">
              <Checkbox
                checked={allPageSelected}
                indeterminate={somePageSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all reports on this page"
              />
            </TableHead>
            <TableHead className="sticky left-12 z-10 min-w-[150px] bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Name
            </TableHead>
            <TableHead className="min-w-[90px]">Class</TableHead>
            <TableHead className="min-w-[90px]">Term</TableHead>
            <TableHead className="min-w-[120px]">Review Status</TableHead>
            <TableHead className="min-w-[120px] pr-6">Parent Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReports.map((report) => (
            <TableRow
              key={report.id}
              className="cursor-pointer"
              onClick={() =>
                navigate({ to: '/reports/$id', params: { id: report.id } })
              }
              data-selected={selectedIds.has(report.id) || undefined}
            >
              <TableCell
                className="sticky left-0 z-10 bg-white pl-6"
                onClick={(e) => handleSelectRow(report.id, e)}
              >
                <Checkbox
                  checked={selectedIds.has(report.id)}
                  aria-label={`Select report for ${report.studentName}`}
                />
              </TableCell>
              <TableCell className="sticky left-12 z-10 bg-white font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {report.studentName}
              </TableCell>
              <TableCell>{report.studentClass}</TableCell>
              <TableCell>
                <Badge variant="outline">{report.term}</Badge>
              </TableCell>
              <TableCell>{getReviewStatusBadge(report.reviewStatus)}</TableCell>
              <TableCell className="pr-6">
                {getParentStatusBadge(report.parentStatus)}
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
