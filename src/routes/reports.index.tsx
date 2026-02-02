import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardCheck, Search, Send } from 'lucide-react'

import type { HolisticReport, Term } from '@/types/report'
import { TermSelector } from '@/components/reports/term-selector'
import { ReportTable } from '@/components/reports/report-table'
import { ClassSelector } from '@/components/students/class-selector'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CURRENT_ACADEMIC_YEAR, mockReports } from '@/data/mock-reports'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

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
  const [selectedClass, setSelectedClass] = useState('Secondary 3')
  const [selectedTerm, setSelectedTerm] = useState<Term | ''>(initialTerm || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [reports, setReports] = useState<Array<HolisticReport>>(
    () => mockReports,
  )

  useSetBreadcrumbs([{ label: 'Reports', href: '/reports' }])

  // Get all reports for the current academic year
  const allReports = useMemo(() => {
    return reports.filter((report) => {
      if (initialStudentId && report.studentId !== initialStudentId) {
        return false
      }
      if (selectedTerm && report.term !== selectedTerm) {
        return false
      }
      if (report.academicYear !== CURRENT_ACADEMIC_YEAR) {
        return false
      }
      return true
    })
  }, [reports, initialStudentId, selectedTerm])

  // Filter by class/level
  const classFilteredReports = useMemo(() => {
    if (selectedClass === 'all') {
      return allReports
    }

    if (selectedClass.startsWith('Secondary')) {
      const levelNum = selectedClass.replace('Secondary ', '')
      return allReports.filter((r) => r.studentClass.startsWith(levelNum))
    }

    return allReports.filter((r) => r.studentClass === selectedClass)
  }, [allReports, selectedClass])

  // Filter by search query
  const filteredReports = useMemo(() => {
    if (!searchQuery) {
      return classFilteredReports
    }

    const query = searchQuery.toLowerCase()
    return classFilteredReports.filter((r) =>
      r.studentName.toLowerCase().includes(query),
    )
  }, [classFilteredReports, searchQuery])

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

  const handleSendToParents = () => {
    setReports((prev) =>
      prev.map((report) =>
        selectedIds.has(report.id) && report.parentStatus === 'not_sent'
          ? { ...report, parentStatus: 'sent' as const }
          : report,
      ),
    )
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

  return (
    <div className="flex flex-col">
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
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="mx-6 flex items-center gap-4 rounded-lg border bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSendToParents}>
                <Send className="mr-2 h-4 w-4" />
                Send to Parents
              </Button>
              <Button size="sm" variant="outline" onClick={handleRequestReview}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Request Review
              </Button>
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
      />
    </div>
  )
}
