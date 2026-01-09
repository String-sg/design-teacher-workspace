import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import type { SortCriterion, Student } from '@/types/student'
import type {ColumnConfig} from '@/components/students/column-visibility-popover';
import { DataCard } from '@/components/data-card'
import { StudentFilters } from '@/components/students/student-filters'
import { StudentTable } from '@/components/students/student-table'
import { ClassSelector } from '@/components/students/class-selector'
import {
  
  defaultColumns
} from '@/components/students/column-visibility-popover'

import { getMetrics, mockStudents } from '@/data/mock-students'

export const Route = createFileRoute('/students')({
  component: StudentsPage,
})

// Check if a student matches a sort condition
function matchesCondition(student: Student, sort: SortCriterion): boolean {
  const value = student[sort.field as keyof Student]

  switch (sort.operator) {
    // Numeric operators
    case 'gt':
      return Number(value) > Number(sort.value)
    case 'gte':
      return Number(value) >= Number(sort.value)
    case 'lt':
      return Number(value) < Number(sort.value)
    case 'lte':
      return Number(value) <= Number(sort.value)
    case 'eq':
      return Number(value) === Number(sort.value)
    // Text operators
    case 'contains':
      return String(value ?? '')
        .toLowerCase()
        .includes(String(sort.value).toLowerCase())
    case 'not_contains':
      return !String(value ?? '')
        .toLowerCase()
        .includes(String(sort.value).toLowerCase())
    case 'is':
      return String(value ?? '') === String(sort.value)
    case 'is_not':
      return String(value ?? '') !== String(sort.value)
    case 'is_empty':
      return !value || value === ''
    case 'is_not_empty':
      return !!value && value !== ''
    default:
      return false
  }
}

function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState('Secondary 3')
  const [searchQuery, setSearchQuery] = useState('')
  const [sorts, setSorts] = useState<Array<SortCriterion>>([])
  const [columns, setColumns] = useState<Array<ColumnConfig>>(defaultColumns)

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

    // Filter: only show records matching ALL criteria
    if (sorts.length > 0) {
      students = students.filter((student) =>
        sorts.every((sort) => matchesCondition(student, sort)),
      )
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
          <ClassSelector
            value={selectedClass}
            onValueChange={setSelectedClass}
          />
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
          className="px-6 pb-4"
        />
      </div>

      {/* Student Table - fills remaining space */}
      <StudentTable
        students={filteredStudents}
        columns={columns}
        pageSize={20}
      />
    </div>
  )
}
