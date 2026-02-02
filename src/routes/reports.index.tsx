import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import type { Term } from '@/types/report'
import { ReportFilters } from '@/components/reports/report-filters'
import { ReportList } from '@/components/reports/report-list'
import {
  CURRENT_ACADEMIC_YEAR,
  filterReports,
  getUniqueStudents,
} from '@/data/mock-reports'

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
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || '',
  )
  const [selectedTerm, setSelectedTerm] = useState<Term | ''>(initialTerm || '')

  const students = useMemo(() => getUniqueStudents(), [])

  const filteredReports = useMemo(() => {
    return filterReports({
      studentId: selectedStudentId || undefined,
      term: selectedTerm || undefined,
      academicYear: CURRENT_ACADEMIC_YEAR,
    })
  }, [selectedStudentId, selectedTerm])

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Holistic Development Reports</h1>
        <p className="text-muted-foreground">
          View student progress across academic and character development
        </p>
      </div>

      <ReportFilters
        students={students}
        selectedStudentId={selectedStudentId}
        selectedTerm={selectedTerm}
        onStudentChange={setSelectedStudentId}
        onTermChange={setSelectedTerm}
      />

      <ReportList reports={filteredReports} />
    </main>
  )
}
