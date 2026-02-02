import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import type { Term } from '@/types/report'
import { TermSelector } from '@/components/reports/term-selector'
import { ReportTable } from '@/components/reports/report-table'
import { ClassSelector } from '@/components/students/class-selector'
import { Input } from '@/components/ui/input'
import { CURRENT_ACADEMIC_YEAR, filterReports } from '@/data/mock-reports'

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

  // Get all reports for the current academic year
  const allReports = useMemo(() => {
    return filterReports({
      studentId: initialStudentId || undefined,
      term: selectedTerm || undefined,
      academicYear: CURRENT_ACADEMIC_YEAR,
    })
  }, [initialStudentId, selectedTerm])

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
    const avgOverall =
      filteredReports.length > 0
        ? Math.round(
            filteredReports.reduce(
              (sum, r) => sum + r.academic.overallPercentage,
              0,
            ) / filteredReports.length,
          )
        : 0
    const atRiskCount = filteredReports.filter(
      (r) => r.character.riskIndicators >= 2,
    ).length

    return { totalReports, uniqueStudents, avgOverall, atRiskCount }
  }, [filteredReports])

  return (
    <div className="flex flex-col">
      {/* Fixed content area */}
      <div className="shrink-0 space-y-6 pt-6">
        {/* Page Header */}
        <div className="px-6">
          <h1 className="text-2xl font-semibold">Holistic Development Reports</h1>
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
            <div className="text-2xl font-semibold">{metrics.uniqueStudents}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Avg. Overall %</div>
            <div className="text-2xl font-semibold">{metrics.avgOverall}%</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">At Risk</div>
            <div className="text-2xl font-semibold">{metrics.atRiskCount}</div>
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
      </div>

      {/* Report Table */}
      <ReportTable reports={filteredReports} pageSize={20} />
    </div>
  )
}
