import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

import { ColumnHeaderMenu } from './column-header-menu'
import type {
  AttentionTag,
  FilterField,
  SortConfig,
  SortDirection,
  Student,
} from '@/types/student'
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
  /** Current sort configuration */
  sort: SortConfig | null
  /** Set of filter fields that have active filters */
  activeFilterFields: Set<FilterField>
  /** Handler for sorting by a column */
  onSort: (field: string, direction: SortDirection) => void
  /** Handler for clearing the current sort */
  onClearSort: () => void
  /** Handler for adding a quick filter */
  onAddQuickFilter: (field: FilterField) => void
  /** Handler for clearing a filter by field */
  onClearFilter: (field: FilterField) => void
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
  sort,
  activeFilterFields,
  onSort,
  onClearSort,
  onAddQuickFilter,
  onClearFilter,
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

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            {isVisible('index') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'index')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                isSticky
                stickyLeft="0"
                className="w-12 min-w-12 pl-6"
              />
            )}
            {isVisible('name') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'name')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                isSticky
                stickyLeft={isVisible('index') ? '48px' : '0'}
                showStickyShadow
                className="min-w-[150px]"
              />
            )}
            {isVisible('class') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'class')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[90px]"
              />
            )}
            {isVisible('attentionTags') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'attentionTags')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[150px]"
              />
            )}
            {isVisible('overallPercentage') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'overallPercentage')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[120px]"
              />
            )}
            {isVisible('conduct') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'conduct')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[115px]"
              />
            )}
            {isVisible('learningSupport') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'learningSupport')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[180px]"
              />
            )}
            {isVisible('postSecEligibility') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'postSecEligibility')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[200px]"
              />
            )}
            {isVisible('offences') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'offences')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[115px]"
              />
            )}
            {isVisible('absences') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'absences')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[115px]"
              />
            )}
            {isVisible('lateComing') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'lateComing')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[135px]"
              />
            )}
            {isVisible('ccaMissed') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'ccaMissed')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[130px]"
              />
            )}
            {isVisible('riskIndicators') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'riskIndicators')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[120px]"
              />
            )}
            {isVisible('lowMoodFlagged') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'lowMoodFlagged')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[120px]"
              />
            )}
            {isVisible('socialLinks') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'socialLinks')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[140px]"
              />
            )}
            {isVisible('counsellingSessions') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'counsellingSessions')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[135px]"
              />
            )}
            {isVisible('sen') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'sen')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[80px]"
              />
            )}
            {isVisible('housing') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'housing')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[110px]"
              />
            )}
            {isVisible('housingType') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'housingType')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[125px]"
              />
            )}
            {isVisible('custody') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'custody')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[110px]"
              />
            )}
            {isVisible('siblings') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'siblings')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[110px]"
              />
            )}
            {isVisible('externalAgencies') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'externalAgencies')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[155px]"
              />
            )}
            {isVisible('fas') && (
              <ColumnHeaderMenu
                column={columns.find((c) => c.id === 'fas')!}
                currentSort={sort}
                activeFilterFields={activeFilterFields}
                onSort={onSort}
                onClearSort={onClearSort}
                onAddQuickFilter={onAddQuickFilter}
                onClearFilter={onClearFilter}
                className="min-w-[75px] pr-6"
              />
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
                          'sticky z-10 bg-white font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]',
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
