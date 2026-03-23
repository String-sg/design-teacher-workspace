import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'

import { ColumnHeaderMenu } from './column-header-menu'
import type {
  AttentionTag,
  FilterField,
  SortConfig,
  SortDirection,
  Student,
} from '@/types/student'
import type { ColumnConfig } from './column-visibility-popover'
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
import { usePagination } from '@/hooks/use-pagination'
import { tagColors } from '@/data/mock-students'
import { useFeatureFlags } from '@/lib/feature-flags'

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
  /** Selected subjects for overall % computation (null = all subjects) */
  selectedSubjects?: Array<string> | null
  /** Opens the subject selector dialog */
  onConfigureSubjects?: () => void
}

const tagVariantMap: Record<AttentionTag, 'default' | 'secondary' | 'outline'> =
  tagColors

function computeOverallPct(
  student: Student,
  selectedSubjects: Array<string> | null | undefined,
): number {
  if (!selectedSubjects || !student.subjectScores) {
    return student.overallPercentage
  }
  const relevant = student.subjectScores.filter((s) =>
    selectedSubjects.includes(s.subject),
  )
  if (relevant.length === 0) return student.overallPercentage
  return Math.round(
    relevant.reduce((sum, s) => sum + s.percentage, 0) / relevant.length,
  )
}

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
  selectedSubjects,
  onConfigureSubjects,
}: StudentTableProps) {
  const navigate = useNavigate()
  const { isEnabled } = useFeatureFlags()
  // Sticky header state
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const stickyHeaderRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isScrollingSyncRef = useRef(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  // Find the scroll container by data attribute
  const findScrollContainer = useCallback(
    (el: HTMLElement | null): HTMLElement | null => {
      while (el) {
        if (el.hasAttribute('data-scroll-container')) {
          return el
        }
        el = el.parentElement
      }
      return null
    },
    [],
  )

  // Detect when header should be sticky using IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    let observer: IntersectionObserver | null = null
    let mounted = true

    const setupObserver = () => {
      if (!mounted) return

      const scrollContainer = findScrollContainer(sentinel.parentElement)

      // Retry after a frame if scroll container not found yet
      if (!scrollContainer) {
        requestAnimationFrame(setupObserver)
        return
      }

      // Set initial state based on current scroll position
      const sentinelRect = sentinel.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()
      setIsHeaderVisible(sentinelRect.top >= containerRect.top)

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeaderVisible(entry.isIntersecting)
        },
        {
          root: scrollContainer,
          threshold: 0,
        },
      )

      observer.observe(sentinel)
    }

    // Use RAF to ensure initial layout is complete
    requestAnimationFrame(setupObserver)

    return () => {
      mounted = false
      observer?.disconnect()
    }
  }, [findScrollContainer])

  // Sync scroll position when sticky header becomes visible
  useEffect(() => {
    if (
      !isHeaderVisible &&
      stickyHeaderRef.current &&
      tableContainerRef.current
    ) {
      stickyHeaderRef.current.scrollLeft = tableContainerRef.current.scrollLeft
    }
  }, [isHeaderVisible])

  // Bidirectional scroll sync with loop prevention
  const handleTableScroll = useCallback(() => {
    if (isScrollingSyncRef.current) return
    isScrollingSyncRef.current = true
    if (stickyHeaderRef.current && tableContainerRef.current) {
      stickyHeaderRef.current.scrollLeft = tableContainerRef.current.scrollLeft
    }
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false
    })
  }, [])

  const handleStickyHeaderScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (isScrollingSyncRef.current) return
      isScrollingSyncRef.current = true
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollLeft = e.currentTarget.scrollLeft
      }
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    },
    [],
  )

  // Attach scroll listener to table container
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleTableScroll)
    return () => container.removeEventListener('scroll', handleTableScroll)
  }, [handleTableScroll])

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

  const paginatedStudents = useMemo(() => {
    return students.slice(startIndex, startIndex + pageSize)
  }, [students, startIndex, pageSize])

  // Convert to 1-based for display
  const displayStartIndex = startIndex + 1

  // Helper to check if a column is visible
  const isVisible = (id: string) =>
    columns.find((c) => c.id === id)?.visible ?? true

  // Render header content (reusable for both regular and fixed header)
  const renderHeaderContent = () => (
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
      {isVisible('cca') && (
        <ColumnHeaderMenu
          column={columns.find((c) => c.id === 'cca')!}
          currentSort={sort}
          activeFilterFields={activeFilterFields}
          onSort={onSort}
          onClearSort={onClearSort}
          onAddQuickFilter={onAddQuickFilter}
          onClearFilter={onClearFilter}
          className="min-w-[130px]"
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
      {isVisible('attendance') && (
        <ColumnHeaderMenu
          column={columns.find((c) => c.id === 'attendance')!}
          currentSort={sort}
          activeFilterFields={activeFilterFields}
          onSort={onSort}
          onClearSort={onClearSort}
          onAddQuickFilter={onAddQuickFilter}
          onClearFilter={onClearFilter}
          className="min-w-[120px]"
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
          onConfigureSubjects={onConfigureSubjects}
          hasCustomSubjects={!!selectedSubjects}
        />
      )}
      {isVisible('approvedMtl') && (
        <ColumnHeaderMenu
          column={columns.find((c) => c.id === 'approvedMtl')!}
          currentSort={sort}
          activeFilterFields={activeFilterFields}
          onSort={onSort}
          onClearSort={onClearSort}
          onAddQuickFilter={onAddQuickFilter}
          onClearFilter={onClearFilter}
          className="min-w-[130px]"
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
      {isVisible('fas') && (
        <ColumnHeaderMenu
          column={columns.find((c) => c.id === 'fas')!}
          currentSort={sort}
          activeFilterFields={activeFilterFields}
          onSort={onSort}
          onClearSort={onClearSort}
          onAddQuickFilter={onAddQuickFilter}
          onClearFilter={onClearFilter}
          className="min-w-[75px]"
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
      {isVisible('commuterStatus') && (
        <ColumnHeaderMenu
          column={columns.find((c) => c.id === 'commuterStatus')!}
          currentSort={sort}
          activeFilterFields={activeFilterFields}
          onSort={onSort}
          onClearSort={onClearSort}
          onAddQuickFilter={onAddQuickFilter}
          onClearFilter={onClearFilter}
          className="min-w-[140px]"
        />
      )}
      {isVisible('afterSchoolArrangement') && (
        <ColumnHeaderMenu
          column={columns.find((c) => c.id === 'afterSchoolArrangement')!}
          currentSort={sort}
          activeFilterFields={activeFilterFields}
          onSort={onSort}
          onClearSort={onClearSort}
          onAddQuickFilter={onAddQuickFilter}
          onClearFilter={onClearFilter}
          className="min-w-[180px]"
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
          className="min-w-[110px] pr-6"
        />
      )}
    </TableRow>
  )

  return (
    <>
      {/* Sentinel to detect when header scrolls out */}
      <div ref={sentinelRef} className="h-0" aria-hidden="true" />

      {/* Sticky header - outside horizontal scroll container */}
      <div
        ref={stickyHeaderRef}
        className={cn(
          'sticky top-0 z-50 overflow-x-auto bg-white',
          isHeaderVisible ? 'invisible h-0 overflow-hidden' : 'shadow-md',
        )}
        style={{ scrollbarWidth: 'none' }}
        onScroll={handleStickyHeaderScroll}
      >
        <Table>
          <TableHeader className="border-b bg-white">
            {renderHeaderContent()}
          </TableHeader>
        </Table>
      </div>

      {/* Main table container */}
      <div
        ref={tableContainerRef}
        className={cn('max-w-full overflow-x-auto bg-white', className)}
      >
        <Table>
          <TableHeader className="border-b bg-white">
            {renderHeaderContent()}
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student, index) => {
              return (
                <React.Fragment key={student.id}>
                  <TableRow
                    className="group cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate({
                        to: '/students/$id',
                        params: { id: student.id },
                      })
                    }
                  >
                    {isVisible('index') && (
                      <TableCell className="sticky left-0 z-10 bg-white pl-6 text-muted-foreground transition-colors group-hover:bg-muted/50">
                        {displayStartIndex + index}
                      </TableCell>
                    )}
                    {isVisible('name') && (
                      <TableCell
                        className={cn(
                          'sticky z-10 bg-white font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors group-hover:bg-muted/50',
                          isVisible('index') ? 'left-12' : 'left-0',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {student.name}
                          <Link
                            to="/students/$id"
                            params={{ id: student.id }}
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="size-4" />
                          </Link>
                        </div>
                      </TableCell>
                    )}
                    {isVisible('class') && (
                      <TableCell>{student.class}</TableCell>
                    )}
                    {isVisible('cca') && <TableCell>{student.cca}</TableCell>}
                    {isVisible('attentionTags') && (
                      <TableCell>
                        {student.attentionTags.length > 0 ? (
                          <div className="flex gap-1">
                            {student.attentionTags
                              .filter(
                                (tag) =>
                                  tag !== 'LTA' ||
                                  isEnabled('lta-intervention'),
                              )
                              .map((tag) => (
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
                    {isVisible('attendance') && (
                      <TableCell>
                        {student.totalSchoolDays > 0
                          ? Math.round(
                              (student.daysPresent / student.totalSchoolDays) *
                                100,
                            )
                          : 0}
                        %
                      </TableCell>
                    )}
                    {isVisible('lateComing') && (
                      <TableCell>{student.lateComing}</TableCell>
                    )}
                    {isVisible('absences') && (
                      <TableCell>{student.absences}</TableCell>
                    )}
                    {isVisible('ccaMissed') && (
                      <TableCell>{student.ccaMissed}</TableCell>
                    )}
                    {isVisible('offences') && (
                      <TableCell>{student.offences}</TableCell>
                    )}
                    {isVisible('conduct') && (
                      <TableCell>{student.conduct}</TableCell>
                    )}
                    {isVisible('counsellingSessions') && (
                      <TableCell>{student.counsellingSessions}</TableCell>
                    )}
                    {isVisible('sen') && (
                      <TableCell>
                        {student.sen || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('socialLinks') && (
                      <TableCell>{student.socialLinks}</TableCell>
                    )}
                    {isVisible('riskIndicators') && (
                      <TableCell>{student.riskIndicators}</TableCell>
                    )}
                    {isVisible('lowMoodFlagged') && (
                      <TableCell>
                        {student.lowMoodFlagged || (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('overallPercentage') && (
                      <TableCell>
                        {computeOverallPct(student, selectedSubjects)}%
                      </TableCell>
                    )}
                    {isVisible('approvedMtl') && (
                      <TableCell>
                        {student.approvedMtl || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('learningSupport') && (
                      <TableCell>
                        {student.learningSupport || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('postSecEligibility') && (
                      <TableCell className="max-w-[150px] truncate">
                        {student.postSecEligibility}
                      </TableCell>
                    )}
                    {isVisible('fas') && (
                      <TableCell>
                        {student.fas || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('housing') && (
                      <TableCell>
                        {student.housing || (
                          <span className="text-muted-foreground">-</span>
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
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('custody') && (
                      <TableCell>
                        {student.custody || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('commuterStatus') && (
                      <TableCell>
                        {student.commuterStatus || (
                          <span className="text-muted-foreground">
                            Non-commuter
                          </span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('afterSchoolArrangement') && (
                      <TableCell>
                        {student.afterSchoolArrangement || (
                          <span className="text-muted-foreground">
                            No arrangement
                          </span>
                        )}
                      </TableCell>
                    )}
                    {isVisible('siblings') && (
                      <TableCell className="pr-6">{student.siblings}</TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>

        {/* Record count and Pagination */}
        <div className="flex shrink-0 items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {displayStartIndex}–
            {Math.min(startIndex + pageSize, students.length)} of{' '}
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
    </>
  )
}
