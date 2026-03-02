import { useCallback, useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

import type {
  FilterCriterion,
  FilterField,
  SortConfig,
  SortDirection,
  Student,
} from '@/types/student'
import type { ColumnConfig } from '@/components/students/column-visibility-popover'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { filterFieldConfigs } from '@/data/filter-config'
import { DataCard } from '@/components/data-card'
import { StudentFilters } from '@/components/students/student-filters'
import { StudentTable } from '@/components/students/student-table'
import { ClassSelector } from '@/components/students/class-selector'
import { defaultColumns } from '@/components/students/column-visibility-popover'

import { getMetrics, mockStudents } from '@/data/mock-students'

export const Route = createFileRoute('/students/')({
  component: StudentsPage,
})

// Check if a student matches a filter condition
function matchesCondition(student: Student, filter: FilterCriterion): boolean {
  const value = student[filter.field as keyof Student]

  switch (filter.operator) {
    // Numeric operators
    case 'gt':
      return Number(value) > Number(filter.value)
    case 'gte':
      return Number(value) >= Number(filter.value)
    case 'lt':
      return Number(value) < Number(filter.value)
    case 'lte':
      return Number(value) <= Number(filter.value)
    case 'eq':
      return Number(value) === Number(filter.value)
    // Text operators
    case 'contains':
      return String(value ?? '')
        .toLowerCase()
        .includes(String(filter.value).toLowerCase())
    case 'not_contains':
      return !String(value ?? '')
        .toLowerCase()
        .includes(String(filter.value).toLowerCase())
    case 'is':
      return String(value ?? '') === String(filter.value)
    case 'is_not':
      return String(value ?? '') !== String(filter.value)
    case 'is_empty':
      return !value || value === ''
    case 'is_not_empty':
      return !!value && value !== ''
    default:
      return false
  }
}

function StudentsPage() {
  useSetBreadcrumbs([{ label: 'Students', href: '/students' }])

  const { isLoggedIn } = useAuth()

  const [selectedClass, setSelectedClass] = useState('Secondary 3')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Array<FilterCriterion>>([])
  const [columns, setColumns] = useState<Array<ColumnConfig>>(defaultColumns)
  const [sort, setSort] = useState<SortConfig | null>(null)

  // Get students for the selected class/level (this determines the base list)
  const classStudents = useMemo(() => {
    let students = mockStudents

    // Filter by class or level
    if (selectedClass !== 'all') {
      if (selectedClass.startsWith('Secondary')) {
        const levelNum = selectedClass.replace('Secondary ', '')
        students = students.filter((s) => s.class.startsWith(`Sec ${levelNum}`))
      } else if (selectedClass.startsWith('Primary')) {
        const levelNum = selectedClass.replace('Primary ', '')
        students = students.filter((s) => s.class.startsWith(`P${levelNum}`))
      } else {
        students = students.filter((s) => s.class === selectedClass)
      }
    }

    return students
  }, [selectedClass])

  // Determine which students match the current filters (search + filter criteria)
  const { matchedIds, hasActiveFilters } = useMemo(() => {
    const hasSearch = !!searchQuery
    const hasFilterCriteria = filters.length > 0
    const isFiltering = hasSearch || hasFilterCriteria

    if (!isFiltering) {
      // No filters active - all students are "matched"
      return { matchedIds: new Set<string>(), hasActiveFilters: false }
    }

    const matched = new Set<string>()
    const query = searchQuery.toLowerCase()

    for (const student of classStudents) {
      // Check search query
      const matchesSearch =
        !hasSearch || student.name.toLowerCase().includes(query)

      // Check filter criteria
      const matchesFilters =
        !hasFilterCriteria ||
        filters.every((filter) => matchesCondition(student, filter))

      if (matchesSearch && matchesFilters) {
        matched.add(student.id)
      }
    }

    return { matchedIds: matched, hasActiveFilters: isFiltering }
  }, [classStudents, searchQuery, filters])

  // Compute active filter fields for header indicators
  const activeFilterFields = useMemo(
    () => new Set(filters.map((f) => f.field)),
    [filters],
  )

  // Sort handlers
  const handleSort = useCallback((field: string, direction: SortDirection) => {
    setSort({ field, direction })
  }, [])

  const handleClearSort = useCallback(() => {
    setSort(null)
  }, [])

  const handleAddQuickFilter = useCallback((field: FilterField) => {
    const fieldConfig = filterFieldConfigs.find((c) => c.field === field)
    if (!fieldConfig) return

    setFilters((prev) => [
      ...prev,
      {
        id: `filter-${Date.now()}`,
        field,
        operator: fieldConfig.defaultOperator,
        value: fieldConfig.defaultValue,
      },
    ])
  }, [])

  const handleClearFilter = useCallback((field: FilterField) => {
    setFilters((prev) => prev.filter((f) => f.field !== field))
  }, [])

  // Sort students: apply column sort first, then partition by filter matches
  const sortedStudents = useMemo(() => {
    const result = [...classStudents]

    // Apply column sort first
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.field as keyof Student]
        const bVal = b[sort.field as keyof Student]

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return sort.direction === 'asc' ? 1 : -1
        if (bVal == null) return sort.direction === 'asc' ? -1 : 1

        // Numeric comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sort.direction === 'asc' ? aVal - bVal : bVal - aVal
        }

        // String comparison
        const comparison = String(aVal).localeCompare(String(bVal))
        return sort.direction === 'asc' ? comparison : -comparison
      })
    }

    // Then partition by filter matches (matched students first)
    if (hasActiveFilters) {
      result.sort((a, b) => {
        const aMatched = matchedIds.has(a.id)
        const bMatched = matchedIds.has(b.id)
        if (aMatched && !bMatched) return -1
        if (!aMatched && bMatched) return 1
        return 0
      })
    }

    return result
  }, [classStudents, sort, matchedIds, hasActiveFilters])

  // For metrics, we only count the matched students
  const matchedStudents = useMemo(() => {
    if (!hasActiveFilters) {
      return classStudents
    }
    return classStudents.filter((s) => matchedIds.has(s.id))
  }, [classStudents, matchedIds, hasActiveFilters])

  const metrics = useMemo(() => getMetrics(matchedStudents), [matchedStudents])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-[467px] flex-col items-center gap-6 text-center">
          <img
            src="/students-illustration.png"
            alt=""
            className="size-[380px] object-cover"
          />
          <div className="flex flex-col gap-3">
            <h1 className="text-[23px] font-semibold text-slate-12">
              Students
            </h1>
            <p className="text-base text-slate-11">
              View your student profiles in one place. Sign in to see the
              complete list of your students and their details.{' '}
              <span className="font-semibold text-[#0797b9]">Learn more</span>
            </p>
          </div>
          <Button render={<Link to="/login" />}>
            Sign In to View Students
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Fixed content area */}
      <div className="shrink-0 space-y-6 pt-6">
        {/* Page Header */}
        <div className="px-6">
          <h1 className="text-2xl font-semibold">Students</h1>
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
          filters={filters}
          onFiltersChange={setFilters}
          columns={columns}
          onColumnsChange={setColumns}
          className="px-6 pb-4"
        />
      </div>

      {/* Student Table */}
      <StudentTable
        students={sortedStudents}
        columns={columns}
        pageSize={20}
        matchedIds={hasActiveFilters ? matchedIds : undefined}
        matchedCount={hasActiveFilters ? matchedIds.size : 0}
        sort={sort}
        activeFilterFields={activeFilterFields}
        onSort={handleSort}
        onClearSort={handleClearSort}
        onAddQuickFilter={handleAddQuickFilter}
        onClearFilter={handleClearFilter}
      />
    </div>
  )
}
