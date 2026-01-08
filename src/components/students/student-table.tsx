import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { AttentionTag, Student } from '@/types/student'
import { cn } from '@/lib/utils'
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
import type { ColumnConfig } from './column-visibility-popover'

import { tagColors } from '@/data/mock-students'

interface StudentTableProps {
  students: Array<Student>
  columns: ColumnConfig[]
  className?: string
  pageSize?: number
}

const tagVariantMap: Record<AttentionTag, 'default' | 'secondary' | 'outline'> =
  tagColors

export function StudentTable({
  students,
  columns,
  className,
  pageSize = 10,
}: StudentTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(students.length / pageSize)

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return students.slice(startIndex, startIndex + pageSize)
  }, [students, currentPage, pageSize])

  // Reset to page 1 when students change (e.g., filtering)
  useMemo(() => {
    if (currentPage > Math.ceil(students.length / pageSize)) {
      setCurrentPage(1)
    }
  }, [students.length, pageSize, currentPage])

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const startIndex = (currentPage - 1) * pageSize + 1

  // Helper to check if a column is visible
  const isVisible = (id: string) => columns.find((c) => c.id === id)?.visible ?? true

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {isVisible('index') && (
              <TableHead className="sticky left-0 z-20 w-12 min-w-12 bg-background pl-6">#</TableHead>
            )}
            {isVisible('name') && (
              <TableHead className={cn(
                'sticky z-20 min-w-[140px] bg-background',
                isVisible('index') ? 'left-12' : 'left-0'
              )}>Name</TableHead>
            )}
            {isVisible('class') && <TableHead className="min-w-[60px]">Class</TableHead>}
            {isVisible('attentionTags') && <TableHead className="min-w-[100px]">Attention tag</TableHead>}
            {isVisible('overallPercentage') && <TableHead className="min-w-[80px]">Overall %</TableHead>}
            {isVisible('conduct') && <TableHead className="min-w-[90px]">Conduct</TableHead>}
            {isVisible('learningSupport') && <TableHead className="min-w-[100px]">Learning Support</TableHead>}
            {isVisible('postSecEligibility') && <TableHead className="min-w-[120px]">Post-Sec Eligibility</TableHead>}
            {isVisible('offences') && <TableHead className="min-w-[70px]">Offences</TableHead>}
            {isVisible('absences') && <TableHead className="min-w-[100px]">Absences</TableHead>}
            {isVisible('lateComing') && <TableHead className="min-w-[80px]">Late-coming</TableHead>}
            {isVisible('ccaMissed') && <TableHead className="min-w-[80px]">CCA Missed</TableHead>}
            {isVisible('riskIndicators') && <TableHead className="min-w-[80px]">Risk (TCI)</TableHead>}
            {isVisible('lowMoodFlagged') && <TableHead className="min-w-[80px]">Low Mood</TableHead>}
            {isVisible('socialLinks') && <TableHead className="min-w-[80px]">Social Links</TableHead>}
            {isVisible('counsellingSessions') && <TableHead className="min-w-[90px]">Counselling</TableHead>}
            {isVisible('sen') && <TableHead className="min-w-[80px]">SEN</TableHead>}
            {isVisible('housing') && <TableHead className="min-w-[80px]">Housing</TableHead>}
            {isVisible('housingType') && <TableHead className="min-w-[90px]">Ownership</TableHead>}
            {isVisible('custody') && <TableHead className="min-w-[80px]">Custody</TableHead>}
            {isVisible('siblings') && <TableHead className="min-w-[70px]">Siblings</TableHead>}
            {isVisible('externalAgencies') && <TableHead className="min-w-[100px]">Ext. Agencies</TableHead>}
            {isVisible('fas') && <TableHead className="min-w-[60px] pr-6">FAS</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.map((student, index) => (
            <TableRow key={student.id}>
              {isVisible('index') && (
                <TableCell className="sticky left-0 z-10 bg-background pl-6 text-muted-foreground">
                  {startIndex + index}
                </TableCell>
              )}
              {isVisible('name') && (
                <TableCell className={cn(
                  'sticky z-10 bg-background font-medium',
                  isVisible('index') ? 'left-12' : 'left-0'
                )}>{student.name}</TableCell>
              )}
              {isVisible('class') && <TableCell>{student.class}</TableCell>}
              {isVisible('attentionTags') && (
                <TableCell>
                  {student.attentionTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {student.attentionTags.map((tag) => (
                        <Badge key={tag} variant={tagVariantMap[tag]}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              )}
              {isVisible('overallPercentage') && (
                <TableCell>
                  <span
                    className={cn(
                      student.overallPercentage < 40 && 'text-red-600',
                      student.overallPercentage >= 40 &&
                        student.overallPercentage < 60 &&
                        'text-amber-600',
                      student.overallPercentage >= 60 && 'text-foreground',
                    )}
                  >
                    {student.overallPercentage}%
                  </span>
                </TableCell>
              )}
              {isVisible('conduct') && (
                <TableCell>
                  <Badge
                    className={cn(
                      student.conduct === 'Poor' && 'bg-red-100 text-red-700 hover:bg-red-100',
                      student.conduct === 'Fair' && 'bg-amber-100 text-amber-700 hover:bg-amber-100',
                      student.conduct === 'Good' && 'bg-slate-100 text-slate-700 hover:bg-slate-100',
                      student.conduct === 'Excellent' && 'bg-green-100 text-green-700 hover:bg-green-100',
                    )}
                  >
                    {student.conduct}
                  </Badge>
                </TableCell>
              )}
              {isVisible('learningSupport') && (
                <TableCell>
                  {student.learningSupport || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              )}
              {isVisible('postSecEligibility') && (
                <TableCell className="max-w-[150px] truncate">
                  {student.postSecEligibility}
                </TableCell>
              )}
              {isVisible('offences') && (
                <TableCell>
                  <span
                    className={cn(
                      student.offences > 3 && 'text-red-600',
                      student.offences > 0 &&
                        student.offences <= 3 &&
                        'text-amber-600',
                    )}
                  >
                    {student.offences}
                  </span>
                </TableCell>
              )}
              {isVisible('absences') && (
                <TableCell>
                  <span
                    className={cn(
                      student.absences >= 15 && 'text-red-600',
                      student.absences >= 5 &&
                        student.absences < 15 &&
                        'text-amber-600',
                    )}
                  >
                    {student.absences}
                  </span>
                </TableCell>
              )}
              {isVisible('lateComing') && (
                <TableCell>
                  <span
                    className={cn(
                      student.lateComing >= 10 && 'text-red-600',
                      student.lateComing >= 5 &&
                        student.lateComing < 10 &&
                        'text-amber-600',
                    )}
                  >
                    {student.lateComing}
                  </span>
                </TableCell>
              )}
              {isVisible('ccaMissed') && (
                <TableCell>
                  <span
                    className={cn(
                      student.ccaMissed >= 8 && 'text-red-600',
                      student.ccaMissed >= 3 &&
                        student.ccaMissed < 8 &&
                        'text-amber-600',
                    )}
                  >
                    {student.ccaMissed}
                  </span>
                </TableCell>
              )}
              {isVisible('riskIndicators') && (
                <TableCell>
                  <span
                    className={cn(
                      student.riskIndicators >= 4 && 'text-red-600',
                      student.riskIndicators >= 2 &&
                        student.riskIndicators < 4 &&
                        'text-amber-600',
                    )}
                  >
                    {student.riskIndicators}
                  </span>
                </TableCell>
              )}
              {isVisible('lowMoodFlagged') && (
                <TableCell>
                  {student.lowMoodFlagged || (
                    <span className="text-muted-foreground">No</span>
                  )}
                </TableCell>
              )}
              {isVisible('socialLinks') && <TableCell>{student.socialLinks}</TableCell>}
              {isVisible('counsellingSessions') && <TableCell>{student.counsellingSessions}</TableCell>}
              {isVisible('sen') && (
                <TableCell>
                  {student.sen || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              )}
              {isVisible('housing') && (
                <TableCell>
                  {student.housing || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              )}
              {isVisible('housingType') && (
                <TableCell>
                  {student.housingType === 'Rented'
                    ? 'Rental'
                    : student.housingType === 'Owned'
                      ? 'Owner occupied'
                      : <span className="text-muted-foreground">N/A</span>}
                </TableCell>
              )}
              {isVisible('custody') && (
                <TableCell>
                  {student.custody || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              )}
              {isVisible('siblings') && <TableCell>{student.siblings}</TableCell>}
              {isVisible('externalAgencies') && (
                <TableCell>
                  {student.externalAgencies || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              )}
              {isVisible('fas') && (
                <TableCell className="pr-6">
                  {student.fas || (
                    <span className="text-muted-foreground">No</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Record count and Pagination */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <div className="text-sm text-muted-foreground">
          {students.length} records
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {getPageNumbers().map((page, index) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? 'outline' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
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
