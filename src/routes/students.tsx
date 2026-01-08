import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DataCard } from '@/components/data-card'
import { StudentFilters } from '@/components/students/student-filters'
import { StudentTable } from '@/components/students/student-table'
import { ClassSelector } from '@/components/students/class-selector'
import {
  defaultColumns,
  type ColumnConfig,
} from '@/components/students/column-visibility-popover'

import { mockStudents, getMetrics } from '@/data/mock-students'
import type {
  SortCriterion,
  SortField,
  ConductGrade,
  Student,
} from '@/types/student'

export const Route = createFileRoute('/students')({
  component: StudentsPage,
})

const conductOrder: Record<ConductGrade, number> = {
  Excellent: 4,
  Good: 3,
  Fair: 2,
  Poor: 1,
}

function compareByField(a: Student, b: Student, field: SortField): number {
  switch (field) {
    case 'name':
      return a.name.localeCompare(b.name)
    case 'class':
      return a.class.localeCompare(b.class)
    case 'overall':
      return a.overallPercentage - b.overallPercentage
    case 'conduct':
      return conductOrder[a.conduct] - conductOrder[b.conduct]
    case 'offences':
      return a.offences - b.offences
    case 'riskIndicators':
      return a.riskIndicators - b.riskIndicators
    case 'absences':
      return a.absences - b.absences
    case 'lateComing':
      return a.lateComing - b.lateComing
    case 'ccaMissed':
      return a.ccaMissed - b.ccaMissed
    case 'learningSupport':
      return (a.learningSupport || '').localeCompare(b.learningSupport || '')
    case 'postSecEligibility':
      return a.postSecEligibility.localeCompare(b.postSecEligibility)
    default:
      return 0
  }
}

function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState('Secondary 3')
  const [searchQuery, setSearchQuery] = useState('')
  const [sorts, setSorts] = useState<SortCriterion[]>([])
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns)

  const filteredStudents = useMemo(() => {
    let students = mockStudents

    // Filter by class or level
    if (selectedClass !== 'all') {
      if (selectedClass.startsWith('Secondary')) {
        // Extract level number and filter by classes starting with that number
        const levelNum = selectedClass.replace('Secondary ', '')
        students = students.filter((s) => s.class.startsWith(levelNum))
      } else {
        students = students.filter((s) => s.class === selectedClass)
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      students = students.filter((s) => s.name.toLowerCase().includes(query))
    }

    // Multi-sort
    if (sorts.length > 0) {
      students = [...students].sort((a, b) => {
        for (const { field, direction } of sorts) {
          const comparison = compareByField(a, b, field)
          if (comparison !== 0) {
            return direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    return students
  }, [selectedClass, searchQuery, sorts])

  const metrics = useMemo(
    () => getMetrics(filteredStudents),
    [filteredStudents],
  )

  return (
    <div className="flex h-full flex-col">
      {/* Fixed content area */}
      <div className="shrink-0 space-y-6 pt-6">
        {/* Page Header */}
        <div className="px-6">
          <h1 className="text-2xl font-semibold">Student dashboard</h1>
          <p className="text-muted-foreground">
            Key data to understand your students holistically
          </p>
        </div>

        {/* Class Selector */}
        <div className="px-6">
          <ClassSelector value={selectedClass} onValueChange={setSelectedClass} />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-3">
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
          sorts={sorts}
          onSortsChange={setSorts}
          columns={columns}
          onColumnsChange={setColumns}
          className="px-6"
        />
      </div>

      {/* Student Table - fills remaining space */}
      <StudentTable students={filteredStudents} columns={columns} />
    </div>
  )
}
