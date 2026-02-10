import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardCheck, Search, Send } from 'lucide-react'

import type {
  HolisticReport,
  ParentStatus,
  ReviewStatus,
  SchoolLevel,
  StudentStatus,
  Term,
} from '@/types/report'
import { TermSelector } from '@/components/reports/term-selector'
import { ReportTable } from '@/components/reports/report-table'
import { ClassSelector } from '@/components/students/class-selector'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { CURRENT_ACADEMIC_YEAR, mockReports } from '@/data/mock-reports'
import { getSchoolLevel } from '@/data/mock-students'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface ReportsSearchParams {
  studentId?: string
  term?: Term
}

export const Route = createFileRoute('/reports/')({
  component: ReportsPage,
  validateSearch: (search: Record<string, unknown>): ReportsSearchParams => {
    return {
      studentId: search.studentId as string | undefined,
      term: search.term as Term | undefined,
    }
  },
})

function ReportsPage() {
  const { studentId: initialStudentId, term: initialTerm } = Route.useSearch()
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('secondary')
  const [selectedClass, setSelectedClass] = useState('Secondary 3')
  const [selectedTerm, setSelectedTerm] = useState<Term | ''>(initialTerm || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReviewStatus, setSelectedReviewStatus] = useState<
    ReviewStatus | ''
  >('')
  const [selectedParentStatus, setSelectedParentStatus] = useState<
    ParentStatus | ''
  >('')
  const [selectedStudentStatus, setSelectedStudentStatus] = useState<
    StudentStatus | ''
  >('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [reports, setReports] = useState<Array<HolisticReport>>(
    () => mockReports,
  )

  useSetBreadcrumbs([{ label: 'Reports', href: '/reports' }])

  // Filter by school level first
  const levelFilteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (report.academicYear !== CURRENT_ACADEMIC_YEAR) return false
      if (initialStudentId && report.studentId !== initialStudentId)
        return false
      if (selectedTerm && report.term !== selectedTerm) return false
      return getSchoolLevel(report.studentClass) === schoolLevel
    })
  }, [reports, initialStudentId, selectedTerm, schoolLevel])

  // Filter by class/level
  const classFilteredReports = useMemo(() => {
    if (selectedClass === 'all') {
      return levelFilteredReports
    }

    if (
      selectedClass.startsWith('Secondary') ||
      selectedClass.startsWith('Primary')
    ) {
      const levelPart = selectedClass.replace(/^(Secondary|Primary)\s*/, '')
      if (schoolLevel === 'primary') {
        return levelFilteredReports.filter((r) =>
          r.studentClass.startsWith(`P${levelPart}`),
        )
      }
      return levelFilteredReports.filter((r) =>
        r.studentClass.startsWith(levelPart),
      )
    }

    return levelFilteredReports.filter((r) => r.studentClass === selectedClass)
  }, [levelFilteredReports, selectedClass, schoolLevel])

  // Filter by search query
  const searchFilteredReports = useMemo(() => {
    if (!searchQuery) {
      return classFilteredReports
    }

    const query = searchQuery.toLowerCase()
    return classFilteredReports.filter((r) =>
      r.studentName.toLowerCase().includes(query),
    )
  }, [classFilteredReports, searchQuery])

  // Filter by status
  const filteredReports = useMemo(() => {
    return searchFilteredReports.filter((r) => {
      if (selectedReviewStatus && r.reviewStatus !== selectedReviewStatus) {
        return false
      }
      if (selectedParentStatus && r.parentStatus !== selectedParentStatus) {
        return false
      }
      if (selectedStudentStatus && r.studentStatus !== selectedStudentStatus) {
        return false
      }
      return true
    })
  }, [
    searchFilteredReports,
    selectedReviewStatus,
    selectedParentStatus,
    selectedStudentStatus,
  ])

  // Metrics
  const metrics = useMemo(() => {
    const totalReports = filteredReports.length
    const uniqueStudents = new Set(filteredReports.map((r) => r.studentId)).size
    const pendingReview = filteredReports.filter(
      (r) => r.reviewStatus === 'pending',
    ).length
    const notSentCount = filteredReports.filter(
      (r) => r.parentStatus === 'not_sent',
    ).length

    return { totalReports, uniqueStudents, pendingReview, notSentCount }
  }, [filteredReports])

  const sendableCount = useMemo(() => {
    if (schoolLevel === 'secondary') {
      return reports.filter(
        (r) => selectedIds.has(r.id) && r.studentStatus === 'not_sent',
      ).length
    }
    return reports.filter(
      (r) => selectedIds.has(r.id) && r.parentStatus === 'not_sent',
    ).length
  }, [reports, selectedIds, schoolLevel])

  const reviewableCount = useMemo(() => {
    return reports.filter(
      (r) => selectedIds.has(r.id) && r.reviewStatus === 'pending',
    ).length
  }, [reports, selectedIds])

  const handleSend = () => {
    if (schoolLevel === 'secondary') {
      setReports((prev) =>
        prev.map((report) =>
          selectedIds.has(report.id) && report.studentStatus === 'not_sent'
            ? { ...report, studentStatus: 'sent' as const }
            : report,
        ),
      )
    } else {
      setReports((prev) =>
        prev.map((report) =>
          selectedIds.has(report.id) && report.parentStatus === 'not_sent'
            ? { ...report, parentStatus: 'sent' as const }
            : report,
        ),
      )
    }
    setSelectedIds(new Set())
  }

  const handleRequestReview = () => {
    setReports((prev) =>
      prev.map((report) =>
        selectedIds.has(report.id) && report.reviewStatus === 'pending'
          ? { ...report, reviewStatus: 'in_review' as const }
          : report,
      ),
    )
    setSelectedIds(new Set())
  }

  const handleLevelChange = (level: SchoolLevel) => {
    setSchoolLevel(level)
    setSelectedIds(new Set())
    setSelectedClass(level === 'primary' ? 'all' : 'Secondary 3')
    setSelectedStudentStatus('')
  }

  const sendLabel =
    schoolLevel === 'secondary' ? 'Send to Students' : 'Send to Parents'

  // Draggable floating bar state
  const floatingRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hasDragged, setHasDragged] = useState(false)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-slot="switch"]')) return
      e.preventDefault()
      const rect = floatingRef.current?.getBoundingClientRect()
      if (!rect) return
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: position.x,
        origY: position.y,
      }
    },
    [position],
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      setPosition({
        x: dragState.current.origX + dx,
        y: dragState.current.origY + dy,
      })
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) setHasDragged(true)
    }
    const onMouseUp = () => {
      dragState.current = null
      setTimeout(() => setHasDragged(false), 0)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Floating draggable level switch */}
      <div
        ref={floatingRef}
        onMouseDown={onMouseDown}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className="fixed right-6 top-4 z-50 flex cursor-grab items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-lg active:cursor-grabbing"
      >
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
            if (!hasDragged)
              handleLevelChange(checked ? 'secondary' : 'primary')
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

      {/* Fixed content area */}
      <div className="shrink-0 space-y-6 pt-6">
        {/* Page Header */}
        <div className="px-6">
          <h1 className="text-2xl font-semibold">
            Holistic Development Reports
          </h1>
          <p className="text-muted-foreground">
            View student progress across academic and character development
          </p>
        </div>

        {/* Class Selector */}
        <div className="px-6">
          <ClassSelector
            value={selectedClass}
            onValueChange={setSelectedClass}
          />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Total Reports</div>
            <div className="text-2xl font-semibold">{metrics.totalReports}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Students</div>
            <div className="text-2xl font-semibold">
              {metrics.uniqueStudents}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Pending Review</div>
            <div className="text-2xl font-semibold">
              {metrics.pendingReview}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Not Sent</div>
            <div className="text-2xl font-semibold">{metrics.notSentCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:w-[200px]"
              aria-label="Search students"
            />
          </div>
          <TermSelector value={selectedTerm} onValueChange={setSelectedTerm} />
          <Select
            value={selectedReviewStatus || 'all'}
            onValueChange={(val) =>
              setSelectedReviewStatus(
                val === 'all' ? '' : (val as ReviewStatus),
              )
            }
          >
            <SelectTrigger className="w-[160px]">
              {selectedReviewStatus
                ? {
                    pending: 'Pending',
                    in_review: 'In Review',
                    approved: 'Approved',
                  }[selectedReviewStatus]
                : 'All review'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All review</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedParentStatus || 'all'}
            onValueChange={(val) =>
              setSelectedParentStatus(
                val === 'all' ? '' : (val as ParentStatus),
              )
            }
          >
            <SelectTrigger className="w-[160px]">
              {selectedParentStatus
                ? {
                    not_sent: 'Not Sent',
                    sent: 'Sent',
                    viewed: 'Viewed',
                    acknowledged: 'Acknowledged',
                  }[selectedParentStatus]
                : 'View status'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All parent</SelectItem>
              <SelectItem value="not_sent">Not Sent</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
            </SelectContent>
          </Select>
          {schoolLevel === 'secondary' && (
            <Select
              value={selectedStudentStatus || 'all'}
              onValueChange={(val) =>
                setSelectedStudentStatus(
                  val === 'all' ? '' : (val as StudentStatus),
                )
              }
            >
              <SelectTrigger className="w-[160px]">
                {selectedStudentStatus
                  ? {
                      not_sent: 'Not Sent',
                      sent: 'Sent',
                      viewed: 'Viewed',
                      acknowledged: 'Acknowledged',
                      sent_to_parents: 'Sent to Parents',
                    }[selectedStudentStatus]
                  : 'Student status'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All student</SelectItem>
                <SelectItem value="not_sent">Not Sent</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="sent_to_parents">Sent to Parents</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="mx-6 flex items-center gap-4 rounded-lg border bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button size="sm" variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      {sendLabel}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{sendLabel}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Send {sendableCount} report
                      {sendableCount !== 1 ? 's' : ''} to{' '}
                      {schoolLevel === 'secondary' ? 'students' : 'parents'}?{' '}
                      {schoolLevel === 'secondary'
                        ? 'Students will be notified via email.'
                        : 'Parents will be notified and can view these reports.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSend}>
                      Send
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button size="sm" variant="outline">
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Request Review
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Request Review</AlertDialogTitle>
                    <AlertDialogDescription>
                      Request review for {reviewableCount} report
                      {reviewableCount !== 1 ? 's' : ''}? These reports will be
                      sent for approval.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRequestReview}>
                      Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>

      {/* Report Table */}
      <ReportTable
        reports={filteredReports}
        pageSize={20}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        schoolLevel={schoolLevel}
      />
    </div>
  )
}
