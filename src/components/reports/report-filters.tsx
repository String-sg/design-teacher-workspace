import { TermSelector } from './term-selector'
import type { Term } from '@/types/report'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReportFiltersProps {
  students: Array<{ id: string; name: string }>
  selectedStudentId: string
  selectedTerm: Term | ''
  onStudentChange: (studentId: string) => void
  onTermChange: (term: Term | '') => void
}

export function ReportFilters({
  students,
  selectedStudentId,
  selectedTerm,
  onStudentChange,
  onTermChange,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={selectedStudentId} onValueChange={onStudentChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="All students" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All students</SelectItem>
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TermSelector value={selectedTerm} onValueChange={onTermChange} />
    </div>
  )
}
