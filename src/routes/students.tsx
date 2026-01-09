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

  // Get students for the selected class/level (this determines the base list)
  const classStudents = useMemo(() => {
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

    return students
  }, [selectedClass])

  // Determine which students match the current filters (search + sort criteria)
  const { matchedIds, hasActiveFilters } = useMemo(() => {
    const hasSearch = !!searchQuery
    const hasSortFilters = sorts.length > 0
    const hasActiveFilters = hasSearch || hasSortFilters

    if (!hasActiveFilters) {
      // No filters active - all students are "matched"
      return { matchedIds: new Set<string>(), hasActiveFilters: false }
    }

    const matchedIds = new Set<string>()
    const query = searchQuery.toLowerCase()

    for (const student of classStudents) {
      // Check search query
      const matchesSearch = !hasSearch || student.name.toLowerCase().includes(query)

      // Check sort/filter criteria
      const matchesSorts = !hasSortFilters || sorts.every((sort) => matchesCondition(student, sort))

      if (matchesSearch && matchesSorts) {
        matchedIds.add(student.id)
      }
    }

    return { matchedIds, hasActiveFilters }
  }, [classStudents, searchQuery, sorts])

  // Sort students: matched first, then unmatched
  const sortedStudents = useMemo(() => {
    if (!hasActiveFilters) {
      return classStudents
    }

    return [...classStudents].sort((a, b) => {
      const aMatched = matchedIds.has(a.id)
      const bMatched = matchedIds.has(b.id)
      if (aMatched && !bMatched) return -1
      if (!aMatched && bMatched) return 1
      return 0
    })
  }, [classStudents, matchedIds, hasActiveFilters])

  // For metrics, we only count the matched students
  const matchedStudents = useMemo(() => {
    if (!hasActiveFilters) {
      return classStudents
    }
    return classStudents.filter((s) => matchedIds.has(s.id))
  }, [classStudents, matchedIds, hasActiveFilters])

  const metrics = useMemo(
    () => getMetrics(matchedStudents),
    [matchedStudents],
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
        students={sortedStudents}
        columns={columns}
        pageSize={20}
        matchedIds={hasActiveFilters ? matchedIds : undefined}
        matchedCount={hasActiveFilters ? matchedIds.size : 0}
      />
    </div>
  )
}
