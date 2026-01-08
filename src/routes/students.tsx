import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DataCard } from '@/components/data-card'
import { StudentFilters } from '@/components/students/student-filters'
import { StudentTable } from '@/components/students/student-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { mockStudents, classOptions, getMetrics } from '@/data/mock-students'
import type { SortField, SortDirection, ConductGrade } from '@/types/student'

export const Route = createFileRoute('/students')({
  component: StudentsPage,
})

const conductOrder: Record<ConductGrade, number> = {
  Excellent: 4,
  Good: 3,
  Fair: 2,
  Poor: 1,
}

function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState('3A')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const filteredStudents = useMemo(() => {
    let students = mockStudents

    // Filter by class
    if (selectedClass !== 'all') {
      students = students.filter((s) => s.class === selectedClass)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      students = students.filter((s) => s.name.toLowerCase().includes(query))
    }

    // Sort
    students = [...students].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'class':
          comparison = a.class.localeCompare(b.class)
          break
        case 'overall':
          comparison = a.overallPercentage - b.overallPercentage
          break
        case 'conduct':
          comparison = conductOrder[a.conduct] - conductOrder[b.conduct]
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return students
  }, [selectedClass, searchQuery, sortField, sortDirection])

  const metrics = useMemo(
    () => getMetrics(filteredStudents),
    [filteredStudents],
  )

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field)
    setSortDirection(direction)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Student dashboard</h1>
          <p className="text-muted-foreground">
            Key data to understand your students holistically
          </p>
        </div>

        {/* Class Selector */}
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DataCard
          label="Attendance"
          value={`${metrics.absenteeismRate}%`}
          description="Absenteeism"
        />
        <DataCard
          label="Attendance"
          value={metrics.lateComing}
          description="Late-coming"
        />
        <DataCard
          label="Tier 2-3"
          value={metrics.tier2_3Students}
          description="Students needing support"
        />
      </div>

      {/* Filters */}
      <StudentFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Student Table */}
      <StudentTable students={filteredStudents} />
    </div>
  )
}
