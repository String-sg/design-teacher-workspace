import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

import type { AttentionTag, FilterCriterion, Student } from '@/types/student'
import type { ColumnConfig } from './column-visibility-popover'
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
import { tagColors } from '@/data/mock-students'
import {
  absencesThresholds,
  ccaMissedThresholds,
  lateComingThresholds,
  offencesThresholds,
  overallPercentageThresholds,
  riskIndicatorsThresholds,
} from '@/data/threshold-config'

interface StudentTableProps {
  students: Array<Student>
  columns: Array<ColumnConfig>
  className?: string
  pageSize?: number
  /** When provided, a divider will be shown between matched and unmatched students */
  matchedIds?: Set<string>
  /** Number of matched students (used to show divider at correct position) */
  matchedCount?: number
  /** Active filters (used to show filter indicator on column headers) */
  filters?: Array<FilterCriterion>
}

const tagVariantMap: Record<AttentionTag, 'default' | 'secondary' | 'outline'> =
  tagColors

export function StudentTable({
  students,
  columns,
  className,
  pageSize = 10,
  matchedIds,
  matchedCount = 0,
  filters = [],
}: StudentTableProps) {
  const [isMatchedCollapsed, setIsMatchedCollapsed] = useState(false)
  const [isUnmatchedCollapsed, setIsUnmatchedCollapsed] = useState(false)

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
    totalItems: students.length,
    pageSize,
  })

  // Reset collapsed state when filters change
  useEffect(() => {
    setIsMatchedCollapsed(false)
    setIsUnmatchedCollapsed(false)
  }, [matchedIds, matchedCount])

  const paginatedStudents = useMemo(() => {
    return students.slice(startIndex, startIndex + pageSize)
  }, [students, startIndex, pageSize])

  // Convert to 1-based for display
  const displayStartIndex = startIndex + 1

  // Helper to check if a column is visible
  const isVisible = (id: string) =>
    columns.find((c) => c.id === id)?.visible ?? true

  // Set of fields that have active filters
  const filteredFields = useMemo(
    () => new Set(filters.map((f) => f.field)),
    [filters],
  )

  // Helper to check if a column has an active filter
  const hasFilter = (id: string) => filteredFields.has(id)

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {isVisible('index') && (
              <TableHead className="sticky left-0 z-20 w-12 min-w-12 bg-white pl-6">
                #
              </TableHead>
            )}
            {isVisible('name') && (
              <TableHead
                className={cn(
                  'sticky z-20 min-w-[140px]',
                  isVisible('index') ? 'left-12' : 'left-0',
                  hasFilter('name') ? 'bg-blue-50' : 'bg-white',
                )}
              >
                Name
              </TableHead>
            )}
            {isVisible('class') && (
              <TableHead
                className={cn(
                  'min-w-[60px]',
                  hasFilter('class') && 'bg-blue-50',
                )}
              >
                Class
              </TableHead>
            )}
            {isVisible('attentionTags') && (
              <TableHead className="min-w-[100px]">Attention tag</TableHead>
            )}
            {isVisible('overallPercentage') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('overallPercentage') && 'bg-blue-50',
                )}
              >
                Overall %
              </TableHead>
            )}
            {isVisible('conduct') && (
              <TableHead
                className={cn(
                  'min-w-[90px]',
                  hasFilter('conduct') && 'bg-blue-50',
                )}
              >
                Conduct
              </TableHead>
            )}
            {isVisible('learningSupport') && (
              <TableHead
                className={cn(
                  'min-w-[100px]',
                  hasFilter('learningSupport') && 'bg-blue-50',
                )}
              >
                Learning Support
              </TableHead>
            )}
            {isVisible('postSecEligibility') && (
              <TableHead
                className={cn(
                  'min-w-[120px]',
                  hasFilter('postSecEligibility') && 'bg-blue-50',
                )}
              >
                Post-Sec Eligibility
              </TableHead>
            )}
            {isVisible('offences') && (
              <TableHead
                className={cn(
                  'min-w-[70px]',
                  hasFilter('offences') && 'bg-blue-50',
                )}
              >
                Offences
              </TableHead>
            )}
            {isVisible('absences') && (
              <TableHead
                className={cn(
                  'min-w-[100px]',
                  hasFilter('absences') && 'bg-blue-50',
                )}
              >
                Absences
              </TableHead>
            )}
            {isVisible('lateComing') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('lateComing') && 'bg-blue-50',
                )}
              >
                Late-coming
              </TableHead>
            )}
            {isVisible('ccaMissed') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('ccaMissed') && 'bg-blue-50',
                )}
              >
                CCA Missed
              </TableHead>
            )}
            {isVisible('riskIndicators') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('riskIndicators') && 'bg-blue-50',
                )}
              >
                Risk (TCI)
              </TableHead>
            )}
            {isVisible('lowMoodFlagged') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('lowMoodFlagged') && 'bg-blue-50',
                )}
              >
                Low Mood
              </TableHead>
            )}
            {isVisible('socialLinks') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('socialLinks') && 'bg-blue-50',
                )}
              >
                Social Links
              </TableHead>
            )}
            {isVisible('counsellingSessions') && (
              <TableHead
                className={cn(
                  'min-w-[90px]',
                  hasFilter('counsellingSessions') && 'bg-blue-50',
                )}
              >
                Counselling
              </TableHead>
            )}
            {isVisible('sen') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('sen') && 'bg-blue-50',
                )}
              >
                SEN
              </TableHead>
            )}
            {isVisible('housing') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('housing') && 'bg-blue-50',
                )}
              >
                Housing
              </TableHead>
            )}
            {isVisible('housingType') && (
              <TableHead
                className={cn(
                  'min-w-[90px]',
                  hasFilter('housingType') && 'bg-blue-50',
                )}
              >
                Ownership
              </TableHead>
            )}
            {isVisible('custody') && (
              <TableHead
                className={cn(
                  'min-w-[80px]',
                  hasFilter('custody') && 'bg-blue-50',
                )}
              >
                Custody
              </TableHead>
            )}
            {isVisible('siblings') && (
              <TableHead
                className={cn(
                  'min-w-[70px]',
                  hasFilter('siblings') && 'bg-blue-50',
                )}
              >
                Siblings
              </TableHead>
            )}
            {isVisible('externalAgencies') && (
              <TableHead
                className={cn(
                  'min-w-[100px]',
                  hasFilter('externalAgencies') && 'bg-blue-50',
                )}
              >
                Ext. Agencies
              </TableHead>
            )}
            {isVisible('fas') && (
              <TableHead
                className={cn(
                  'min-w-[60px] pr-6',
                  hasFilter('fas') && 'bg-blue-50',
                )}
              >
                FAS
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.map((student, index) => {
            // startIndex from usePagination is already 0-based
            const zeroBasedGlobalIndex = startIndex + index
            const isInMatchedSection = zeroBasedGlobalIndex < matchedCount
            const unmatchedCount = students.length - matchedCount
            const visibleColumnCount = columns.filter((c) => c.visible).length

            // Show matched header at the start when filters are active and there are matches
            const showMatchedHeader =
              matchedIds && matchedCount > 0 && zeroBasedGlobalIndex === 0

            // Show unmatched header when:
            // - Filters are active AND there are unmatched students
            // - Either: transitioning from matched to unmatched (zeroBasedGlobalIndex === matchedCount)
            // - Or: no matches exist and this is the first item (zeroBasedGlobalIndex === 0)
            const showUnmatchedHeader =
              matchedIds &&
              unmatchedCount > 0 &&
              ((matchedCount > 0 && zeroBasedGlobalIndex === matchedCount) ||
                (matchedCount === 0 && zeroBasedGlobalIndex === 0))

            // Determine if this row should be hidden due to collapsed section
            // When matchedCount is 0, all students are in the unmatched section
            const isHidden =
              matchedIds &&
              ((matchedCount > 0 && isInMatchedSection && isMatchedCollapsed) ||
                (unmatchedCount > 0 &&
                  !isInMatchedSection &&
                  isUnmatchedCollapsed))

            return (
              <React.Fragment key={student.id}>
                {showMatchedHeader && (
                  <TableRow
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => setIsMatchedCollapsed(!isMatchedCollapsed)}
                  >
                    <TableCell
                      colSpan={visibleColumnCount}
                      className="bg-muted/50 py-2 pl-4 text-sm font-medium text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isMatchedCollapsed && '-rotate-90',
                          )}
                        />
                        Matching filter criteria ({matchedCount})
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {showUnmatchedHeader && (
                  <TableRow
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      setIsUnmatchedCollapsed(!isUnmatchedCollapsed)
                    }
                  >
                    <TableCell
                      colSpan={visibleColumnCount}
                      className="bg-muted/50 py-2 pl-4 text-sm font-medium text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isUnmatchedCollapsed && '-rotate-90',
                          )}
                        />
                        Not matching filter criteria ({unmatchedCount})
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isHidden && (
                  <TableRow>
                    {isVisible('index') && (
                      <TableCell className="sticky left-0 z-10 bg-white pl-6 text-muted-foreground">
                        {displayStartIndex + index}
                      </TableCell>
                    )}
                    {isVisible('name') && (
                      <TableCell
                        className={cn(
                          'sticky z-10 bg-white font-medium',
                          isVisible('index') ? 'left-12' : 'left-0',
                        )}
                      >
                        {student.name}
                      </TableCell>
                    )}
                    {isVisible('class') && (
                      <TableCell>{student.class}</TableCell>
                    )}
                    {isVisible('attentionTags') && (
                      <TableCell>
                        {student.attentionTags.length > 0 ? (
                          <div className="flex gap-1">
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
                          className={getStatusColor(
                            student.overallPercentage,
                            overallPercentageThresholds,
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
                            student.conduct === 'Poor' &&
                              'bg-red-100 text-red-700 hover:bg-red-100',
                            student.conduct === 'Fair' &&
                              'bg-amber-100 text-amber-700 hover:bg-amber-100',
                            student.conduct === 'Good' &&
                              'bg-slate-100 text-slate-700 hover:bg-slate-100',
                            student.conduct === 'Excellent' &&
                              'bg-green-100 text-green-700 hover:bg-green-100',
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
                          className={getStatusColor(
                            student.offences,
                            offencesThresholds,
                          )}
                        >
                          {student.offences}
                        </span>
                      </TableCell>
                    )}
                    {isVisible('absences') && (
                      <TableCell>
                        <span
                          className={getStatusColor(
                            student.absences,
                            absencesThresholds,
                          )}
                        >
                          {student.absences}
                        </span>
                      </TableCell>
                    )}
                    {isVisible('lateComing') && (
                      <TableCell>
                        <span
                          className={getStatusColor(
                            student.lateComing,
                            lateComingThresholds,
                          )}
                        >
                          {student.lateComing}
                        </span>
                      </TableCell>
                    )}
                    {isVisible('ccaMissed') && (
                      <TableCell>
                        <span
                          className={getStatusColor(
                            student.ccaMissed,
                            ccaMissedThresholds,
                          )}
                        >
                          {student.ccaMissed}
                        </span>
                      </TableCell>
                    )}
                    {isVisible('riskIndicators') && (
                      <TableCell>
                        <span
                          className={getStatusColor(
                            student.riskIndicators,
                            riskIndicatorsThresholds,
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
                    {isVisible('socialLinks') && (
                      <TableCell>{student.socialLinks}</TableCell>
                    )}
                    {isVisible('counsellingSessions') && (
                      <TableCell>{student.counsellingSessions}</TableCell>
                    )}
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
                        {student.housingType === 'Rented' ? (
                          'Rental'
                        ) : student.housingType === 'Owned' ? (
                          'Owner occupied'
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('custody') && (
                      <TableCell>
                        {student.custody || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('siblings') && (
                      <TableCell>{student.siblings}</TableCell>
                    )}
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
                )}
              </React.Fragment>
            )
          })}
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
