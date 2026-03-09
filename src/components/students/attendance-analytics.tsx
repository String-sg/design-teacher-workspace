import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipUI,
} from '@/components/ui/tooltip'
import { mockStudents } from '@/data/mock-students'
import { LevelDropdown } from '@/components/students/academic-analytics'
import { AttendanceRing } from '@/components/reports/attendance-ring'

const studentIdByName = new Map(mockStudents.map((s) => [s.name, s.id]))

// Mock data – replace with real data props as needed
const CURRENT_ATTENDANCE = {
  present: 10,
  total: 12,
}

const RING_SIZE = 140
const RING_STROKE = 22
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_C = 2 * Math.PI * RING_RADIUS

const RING_SEGMENTS = (() => {
  const total = CURRENT_ATTENDANCE.total
  let acc = 0
  return [
    { name: 'Present', value: 9, color: '#12b886' },
    { name: 'Late', value: 1, color: '#fd7e14' },
    { name: 'Absent pending reason', value: 1, color: '#fa5252' },
    { name: 'Absent (excl pending reason)', value: 1, color: '#ffa94d' },
  ].map((seg) => {
    const len = (seg.value / total) * RING_C
    const dashoffset = acc === 0 ? 0 : RING_C - acc
    acc += len
    return { ...seg, len, dashoffset }
  })
})()

const RING_LEGEND = RING_SEGMENTS.filter((s) => s.name !== 'Present')

const WEEKLY_RATE = [
  { week: 'Week 1', rate: 100 },
  { week: 'Week 2', rate: 50 },
  { week: 'Week 3', rate: 100 },
  { week: 'Week 4', rate: 83 },
  { week: 'Week 5', rate: 93 },
]

interface MonthlyEntry {
  month: string
  latecoming: number | null
  absentNoValid: number | null
  absentValidPrivate: number | null
  absentValidOfficial: number | null
  absentMC: number | null
  pendingReason: number | null
}

// null = no occurrences that month (prevents empty bar slots)
const MONTHLY_DATA: Array<MonthlyEntry> = [
  {
    month: 'Jan',
    latecoming: 1,
    absentNoValid: 2,
    absentValidPrivate: 1,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 2,
  },
  {
    month: 'Feb',
    latecoming: 1,
    absentNoValid: 3,
    absentValidPrivate: 1,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 1,
  },
  {
    month: 'Mar',
    latecoming: null,
    absentNoValid: 1,
    absentValidPrivate: null,
    absentValidOfficial: 1,
    absentMC: null,
    pendingReason: 1,
  },
  {
    month: 'Apr',
    latecoming: 2,
    absentNoValid: 4,
    absentValidPrivate: 2,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 2,
  },
  {
    month: 'May',
    latecoming: 1,
    absentNoValid: 2,
    absentValidPrivate: 3,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 2,
  },
  {
    month: 'Jun',
    latecoming: 2,
    absentNoValid: 3,
    absentValidPrivate: 2,
    absentValidOfficial: 2,
    absentMC: 1,
    pendingReason: 1,
  },
  {
    month: 'Jul',
    latecoming: 1,
    absentNoValid: 1,
    absentValidPrivate: 1,
    absentValidOfficial: 1,
    absentMC: null,
    pendingReason: 1,
  },
  {
    month: 'Aug',
    latecoming: 1,
    absentNoValid: 2,
    absentValidPrivate: 2,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 1,
  },
  {
    month: 'Sep',
    latecoming: 2,
    absentNoValid: 4,
    absentValidPrivate: 2,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 2,
  },
  {
    month: 'Oct',
    latecoming: 1,
    absentNoValid: 3,
    absentValidPrivate: 1,
    absentValidOfficial: 1,
    absentMC: 1,
    pendingReason: 1,
  },
]

const ABSENCE_DETAILS = [
  {
    date: 'Tuesday, 6 January 2026',
    type: 'Absent without valid reason',
    typeColor: '#fa5252',
    subReason: '—',
    remarks: 'Follow-up required',
  },
  {
    date: 'Wednesday, 7 January 2026',
    type: 'Absent without valid reason',
    typeColor: '#fa5252',
    subReason: '—',
    remarks: 'Follow-up required',
  },
  {
    date: 'Sunday, 11 January 2026',
    type: 'Late',
    typeColor: '#fd7e14',
    subReason: '—',
    remarks: 'Noted',
  },
  {
    date: 'Monday, 19 January 2026',
    type: 'Absent without valid reason',
    typeColor: '#fa5252',
    subReason: '—',
    remarks: 'Parent informed',
  },
]

const BAR_CATEGORIES = [
  { key: 'latecoming', label: 'Latecoming', color: '#228be6' }, // blue
  {
    key: 'absentNoValid',
    label: 'Absent without valid reason',
    color: '#a7aab5', // gray
  },
  {
    key: 'absentValidPrivate',
    label: 'Absent with valid reason (Private)',
    color: '#7c3aed', // violet
  },
  {
    key: 'absentValidOfficial',
    label: 'Absent with valid reason (Official)',
    color: '#12b886', // teal
  },
  { key: 'absentMC', label: 'Absent with MC', color: '#0891b2' }, // cyan
  { key: 'pendingReason', label: 'Absence pending reason', color: '#6366f1' }, // indigo
]

const CHART_COMMON_PROPS = {
  margin: { top: 20, right: 8, left: -20, bottom: 4 },
  barCategoryGap: '20%' as const,
  barGap: 0,
}

function AbsenceBarChart({
  barSize,
  data = MONTHLY_DATA,
}: {
  barSize?: number
  data?: Array<MonthlyEntry>
}) {
  const reversedCategories = [...BAR_CATEGORIES].reverse()
  return (
    <BarChart {...CHART_COMMON_PROPS} data={data} barSize={barSize}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
      <XAxis
        dataKey="month"
        tick={{ fontSize: 12, fill: '#868e96' }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 12, fill: '#868e96' }}
        axisLine={false}
        tickLine={false}
        allowDecimals={false}
      />
      <Tooltip
        formatter={(value: number, name: string) => {
          const cat = BAR_CATEGORIES.find((c) => c.key === name)
          return [value, cat?.label ?? name]
        }}
        contentStyle={{
          fontSize: 12,
          borderRadius: 6,
          border: '1px solid #dee2e6',
        }}
      />
      {reversedCategories.map((cat, i) => (
        <Bar key={cat.key} dataKey={cat.key} fill={cat.color} stackId="a">
          <LabelList
            dataKey={cat.key}
            content={({
              x,
              y,
              width,
              height,
              index,
            }: {
              x?: number
              y?: number
              width?: number
              height?: number
              index?: number
            }) => {
              if (index === undefined) return null
              const entry = data[index]
              const value = Number(entry[cat.key as keyof MonthlyEntry]) || 0
              if (value <= 0) return null
              return (
                <text
                  x={Number(x) + Number(width) / 2}
                  y={Number(y) + Number(height) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill="#fff"
                >
                  {value}
                </text>
              )
            }}
          />
          {i === reversedCategories.length - 1 && (
            <LabelList
              position="top"
              content={({
                x,
                y,
                width,
                index,
              }: {
                x?: number
                y?: number
                width?: number
                index?: number
              }) => {
                if (index === undefined) return null
                const entry = data[index]
                const total = BAR_CATEGORIES.reduce(
                  (sum, c) =>
                    sum + (Number(entry[c.key as keyof MonthlyEntry]) || 0),
                  0,
                )
                if (total === 0) return null
                return (
                  <text
                    x={Number(x) + Number(width) / 2}
                    y={Number(y) - 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill="#495057"
                  >
                    {total}
                  </text>
                )
              }}
            />
          )}
        </Bar>
      ))}
    </BarChart>
  )
}

function AbsenceLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
      {BAR_CATEGORIES.map((cat) => (
        <div key={cat.key} className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: cat.color }}
          />
          <span className="text-muted-foreground">{cat.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Level-based attendance mock data ────────────────────────────────────────

interface LevelAttendance {
  present: number
  lta: number
  total: number
}

const LEVEL_ATTENDANCE_DATA: Record<string, LevelAttendance> = {
  'Secondary 5': { present: 52, lta: 2, total: 55 },
  'Secondary 4': { present: 118, lta: 3, total: 122 },
  'Secondary 3': { present: 95, lta: 4, total: 101 },
  'Secondary 2': { present: 102, lta: 5, total: 109 },
  'Secondary 1': { present: 88, lta: 6, total: 96 },
  'Primary 6': { present: 38, lta: 1, total: 40 },
  'Primary 5': { present: 34, lta: 2, total: 36 },
  'Primary 4': { present: 30, lta: 1, total: 32 },
  'Primary 3': { present: 27, lta: 2, total: 30 },
}

function makeLevelMonthlyData(scale: number) {
  return MONTHLY_DATA.map((m) => ({
    ...m,
    latecoming:
      m.latecoming != null ? Math.round(m.latecoming * scale) || 1 : null,
    absentNoValid:
      m.absentNoValid != null ? Math.round(m.absentNoValid * scale) || 1 : null,
    absentValidPrivate:
      m.absentValidPrivate != null
        ? Math.round(m.absentValidPrivate * scale)
        : null,
    absentValidOfficial:
      m.absentValidOfficial != null
        ? Math.round(m.absentValidOfficial * scale) || 1
        : null,
    absentMC: m.absentMC != null ? Math.round(m.absentMC * scale) : null,
    pendingReason:
      m.pendingReason != null ? Math.round(m.pendingReason * scale) || 1 : null,
  }))
}

const LEVEL_MONTHLY: Record<string, typeof MONTHLY_DATA> = {
  'Secondary 5': makeLevelMonthlyData(1.2),
  'Secondary 4': makeLevelMonthlyData(2.5),
  'Secondary 3': makeLevelMonthlyData(2.1),
  'Secondary 2': makeLevelMonthlyData(2.3),
  'Secondary 1': makeLevelMonthlyData(1.9),
  'Primary 6': makeLevelMonthlyData(0.9),
  'Primary 5': makeLevelMonthlyData(0.8),
  'Primary 4': makeLevelMonthlyData(0.7),
  'Primary 3': makeLevelMonthlyData(0.6),
}

// ─── Level ring helpers ───────────────────────────────────────────────────────

function buildLevelRingSegments(att: LevelAttendance) {
  const absent = att.total - att.present - att.lta
  const segments = [
    { name: 'Present', value: att.present, color: '#12b886' },
    { name: 'LTA', value: att.lta, color: '#fd7e14' },
    { name: 'Absent', value: Math.max(absent, 0), color: '#fa5252' },
  ]
  let acc = 0
  return segments.map((seg) => {
    const len = (seg.value / att.total) * RING_C
    const dashoffset = acc === 0 ? 0 : RING_C - acc
    acc += len
    return { ...seg, len, dashoffset }
  })
}

// ─── Attendance Students Table ────────────────────────────────────────────────

const ATT_PAGE_SIZE = 10
const ATT_ALL_CLASSES = ['4A', '4B', '4C', '4D']

interface AttendanceStudent {
  id: string
  name: string
  class: string
  absent: number
  late: number
  mc: number
  absentPendingReason: number
  nonVRAbsences: number
}

// Pre-sorted by (absent + late) descending
const ATTENDANCE_STUDENTS: Array<AttendanceStudent> = [
  {
    id: '1',
    name: 'Chen Teo Jun Kai',
    class: '4A',
    absent: 15,
    late: 8,
    mc: 3,
    absentPendingReason: 4,
    nonVRAbsences: 8,
  },
  {
    id: '2',
    name: 'Xiao Lam Wei Jie',
    class: '4B',
    absent: 12,
    late: 10,
    mc: 2,
    absentPendingReason: 3,
    nonVRAbsences: 7,
  },
  {
    id: '3',
    name: 'Darren Ong Wei Sheng',
    class: '4C',
    absent: 14,
    late: 6,
    mc: 4,
    absentPendingReason: 3,
    nonVRAbsences: 7,
  },
  {
    id: '4',
    name: 'Aisha Binte Yusof',
    class: '4B',
    absent: 13,
    late: 5,
    mc: 2,
    absentPendingReason: 4,
    nonVRAbsences: 7,
  },
  {
    id: '5',
    name: 'Muhammad Rizwan',
    class: '4D',
    absent: 10,
    late: 7,
    mc: 1,
    absentPendingReason: 3,
    nonVRAbsences: 6,
  },
  {
    id: '6',
    name: 'Tariq Bin Anwar',
    class: '4C',
    absent: 11,
    late: 5,
    mc: 3,
    absentPendingReason: 2,
    nonVRAbsences: 6,
  },
  {
    id: '7',
    name: 'Priya Sharma',
    class: '4C',
    absent: 9,
    late: 6,
    mc: 2,
    absentPendingReason: 2,
    nonVRAbsences: 5,
  },
  {
    id: '8',
    name: 'Farhan Bin Osman',
    class: '4C',
    absent: 10,
    late: 4,
    mc: 2,
    absentPendingReason: 3,
    nonVRAbsences: 5,
  },
  {
    id: '9',
    name: 'Ahmad Bin Hassan',
    class: '4A',
    absent: 8,
    late: 6,
    mc: 1,
    absentPendingReason: 2,
    nonVRAbsences: 5,
  },
  {
    id: '10',
    name: 'Nur Ain Binte Azhar',
    class: '4C',
    absent: 9,
    late: 4,
    mc: 2,
    absentPendingReason: 2,
    nonVRAbsences: 5,
  },
  {
    id: '11',
    name: 'Azlan Bin Mustafa',
    class: '4D',
    absent: 8,
    late: 5,
    mc: 2,
    absentPendingReason: 1,
    nonVRAbsences: 5,
  },
  {
    id: '12',
    name: 'Farrukh Bin Rashid',
    class: '4A',
    absent: 7,
    late: 5,
    mc: 1,
    absentPendingReason: 2,
    nonVRAbsences: 4,
  },
  {
    id: '13',
    name: 'Rizky Bin Ahmad',
    class: '4B',
    absent: 8,
    late: 4,
    mc: 2,
    absentPendingReason: 1,
    nonVRAbsences: 5,
  },
  {
    id: '14',
    name: 'Humaira Binte Salleh',
    class: '4D',
    absent: 7,
    late: 4,
    mc: 1,
    absentPendingReason: 2,
    nonVRAbsences: 4,
  },
  {
    id: '15',
    name: 'Ryan Seah Kok Wee',
    class: '4A',
    absent: 6,
    late: 5,
    mc: 1,
    absentPendingReason: 1,
    nonVRAbsences: 4,
  },
  {
    id: '16',
    name: 'Marcus Loh Jian Hao',
    class: '4D',
    absent: 7,
    late: 3,
    mc: 2,
    absentPendingReason: 1,
    nonVRAbsences: 4,
  },
  {
    id: '17',
    name: 'Kevin Ng Wei Ming',
    class: '4B',
    absent: 6,
    late: 4,
    mc: 1,
    absentPendingReason: 2,
    nonVRAbsences: 3,
  },
  {
    id: '18',
    name: 'Malcolm Lee Zheng Yi',
    class: '4D',
    absent: 6,
    late: 3,
    mc: 1,
    absentPendingReason: 1,
    nonVRAbsences: 4,
  },
  {
    id: '19',
    name: 'Samantha Quek Hui Ping',
    class: '4A',
    absent: 5,
    late: 3,
    mc: 1,
    absentPendingReason: 1,
    nonVRAbsences: 3,
  },
  {
    id: '20',
    name: 'Timothy Goh Kai Hong',
    class: '4C',
    absent: 5,
    late: 2,
    mc: 1,
    absentPendingReason: 1,
    nonVRAbsences: 3,
  },
  {
    id: '21',
    name: 'Rachel Wong Mei Ling',
    class: '4D',
    absent: 4,
    late: 2,
    mc: 1,
    absentPendingReason: 1,
    nonVRAbsences: 2,
  },
  {
    id: '22',
    name: 'Sarah Chan Jun Kai',
    class: '4A',
    absent: 3,
    late: 2,
    mc: 1,
    absentPendingReason: 0,
    nonVRAbsences: 2,
  },
  {
    id: '23',
    name: 'Lena Chua Shu Min',
    class: '4A',
    absent: 3,
    late: 1,
    mc: 1,
    absentPendingReason: 0,
    nonVRAbsences: 2,
  },
  {
    id: '24',
    name: 'Vincent Koh Xin Yi',
    class: '4A',
    absent: 2,
    late: 2,
    mc: 0,
    absentPendingReason: 1,
    nonVRAbsences: 1,
  },
  {
    id: '25',
    name: 'Natasha Sim Jing Yi',
    class: '4A',
    absent: 2,
    late: 1,
    mc: 1,
    absentPendingReason: 0,
    nonVRAbsences: 1,
  },
]

function AttendanceStudentsTable() {
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [filterAbsentMin, setFilterAbsentMin] = useState('')
  const [filterAbsentMax, setFilterAbsentMax] = useState('')
  const [filterLateMin, setFilterLateMin] = useState('')
  const [filterLateMax, setFilterLateMax] = useState('')
  const [filterMcMin, setFilterMcMin] = useState('')
  const [filterMcMax, setFilterMcMax] = useState('')
  const [filterPendMin, setFilterPendMin] = useState('')
  const [filterPendMax, setFilterPendMax] = useState('')
  const [filterNonVRMin, setFilterNonVRMin] = useState('')
  const [filterNonVRMax, setFilterNonVRMax] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  const hasActiveFilters =
    filterClass !== 'all' ||
    filterAbsentMin !== '' ||
    filterAbsentMax !== '' ||
    filterLateMin !== '' ||
    filterLateMax !== '' ||
    filterMcMin !== '' ||
    filterMcMax !== '' ||
    filterPendMin !== '' ||
    filterPendMax !== '' ||
    filterNonVRMin !== '' ||
    filterNonVRMax !== ''

  const activeFilterCount = [
    filterClass !== 'all',
    filterAbsentMin !== '' || filterAbsentMax !== '',
    filterLateMin !== '' || filterLateMax !== '',
    filterMcMin !== '' || filterMcMax !== '',
    filterPendMin !== '' || filterPendMax !== '',
    filterNonVRMin !== '' || filterNonVRMax !== '',
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilterClass('all')
    setFilterAbsentMin('')
    setFilterAbsentMax('')
    setFilterLateMin('')
    setFilterLateMax('')
    setFilterMcMin('')
    setFilterMcMax('')
    setFilterPendMin('')
    setFilterPendMax('')
    setFilterNonVRMin('')
    setFilterNonVRMax('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ATTENDANCE_STUDENTS.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false
      if (filterClass !== 'all' && s.class !== filterClass) return false
      if (filterAbsentMin !== '' && s.absent < Number(filterAbsentMin))
        return false
      if (filterAbsentMax !== '' && s.absent > Number(filterAbsentMax))
        return false
      if (filterLateMin !== '' && s.late < Number(filterLateMin)) return false
      if (filterLateMax !== '' && s.late > Number(filterLateMax)) return false
      if (filterMcMin !== '' && s.mc < Number(filterMcMin)) return false
      if (filterMcMax !== '' && s.mc > Number(filterMcMax)) return false
      if (filterPendMin !== '' && s.absentPendingReason < Number(filterPendMin))
        return false
      if (filterPendMax !== '' && s.absentPendingReason > Number(filterPendMax))
        return false
      if (filterNonVRMin !== '' && s.nonVRAbsences < Number(filterNonVRMin))
        return false
      if (filterNonVRMax !== '' && s.nonVRAbsences > Number(filterNonVRMax))
        return false
      return true
    })
  }, [
    search,
    filterClass,
    filterAbsentMin,
    filterAbsentMax,
    filterLateMin,
    filterLateMax,
    filterMcMin,
    filterMcMax,
    filterPendMin,
    filterPendMax,
    filterNonVRMin,
    filterNonVRMax,
  ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ATT_PAGE_SIZE))
  const paged = filtered.slice((page - 1) * ATT_PAGE_SIZE, page * ATT_PAGE_SIZE)

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">
        Students sorted by absences / late-coming
      </p>

      {/* Search + filter bar */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="h-8 pl-9 text-sm"
          />
        </div>

        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                className={cn(
                  'border-border flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  hasActiveFilters
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'bg-white hover:bg-muted',
                )}
              />
            }
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
            {hasActiveFilters && (
              <span className="ml-0.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white">
                {activeFilterCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-4">
              <p className="text-sm font-semibold">Filter students</p>

              {/* Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Class
                </label>
                <Select
                  value={filterClass}
                  onValueChange={(v) => {
                    setFilterClass(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger size="sm" className="h-8 w-full">
                    <SelectValue>
                      {filterClass === 'all' ? 'All classes' : filterClass}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All classes</SelectItem>
                    {ATT_ALL_CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Absent range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Absent
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    value={filterAbsentMin}
                    onChange={(e) => {
                      setFilterAbsentMin(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <Input
                    placeholder="Max"
                    value={filterAbsentMax}
                    onChange={(e) => {
                      setFilterAbsentMax(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              {/* Late range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Late
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    value={filterLateMin}
                    onChange={(e) => {
                      setFilterLateMin(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <Input
                    placeholder="Max"
                    value={filterLateMax}
                    onChange={(e) => {
                      setFilterLateMax(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              {/* MC range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  MC
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    value={filterMcMin}
                    onChange={(e) => {
                      setFilterMcMin(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <Input
                    placeholder="Max"
                    value={filterMcMax}
                    onChange={(e) => {
                      setFilterMcMax(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              {/* Absent pending reason range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Absent pending reason
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    value={filterPendMin}
                    onChange={(e) => {
                      setFilterPendMin(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <Input
                    placeholder="Max"
                    value={filterPendMax}
                    onChange={(e) => {
                      setFilterPendMax(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              {/* Non-VR absences range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Non-VR absences
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    value={filterNonVRMin}
                    onChange={(e) => {
                      setFilterNonVRMin(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <Input
                    placeholder="Max"
                    value={filterNonVRMax}
                    onChange={(e) => {
                      setFilterNonVRMax(e.target.value)
                      setPage(1)
                    }}
                    className="h-8 text-sm"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full text-xs text-muted-foreground"
                  onClick={() => {
                    clearFilters()
                    setFilterOpen(false)
                  }}
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear all filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-[24%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </th>
              <th className="w-[9%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Class
              </th>
              <th className="w-[9%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Absent
              </th>
              <th className="w-[9%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Late
              </th>
              <th className="w-[7%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                MC
              </th>
              <th className="w-[20%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Absent pending reason
              </th>
              <th className="w-[12%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Non-VR absences
              </th>
              <th className="w-[10%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                View profile
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paged.map((s) => (
              <tr
                key={s.id}
                className="bg-white transition-colors hover:bg-muted/30"
              >
                <td className="w-[24%] px-4 py-2.5 font-medium text-foreground">
                  {s.name}
                </td>
                <td className="w-[9%] px-4 py-2.5 text-muted-foreground">
                  {s.class}
                </td>
                <td className="w-[9%] px-4 py-2.5 text-right tabular-nums">
                  {s.absent}
                </td>
                <td className="w-[9%] px-4 py-2.5 text-right tabular-nums">
                  {s.late}
                </td>
                <td className="w-[7%] px-4 py-2.5 text-right tabular-nums">
                  {s.mc}
                </td>
                <td className="w-[20%] px-4 py-2.5 text-right tabular-nums">
                  {s.absentPendingReason}
                </td>
                <td className="w-[12%] px-4 py-2.5 text-right tabular-nums">
                  {s.nonVRAbsences}
                </td>
                <td className="w-[10%] px-4 py-2.5">
                  {(() => {
                    const realId = studentIdByName.get(s.name)
                    return (
                      <TooltipUI>
                        <TooltipTrigger>
                          {realId ? (
                            <Link
                              to="/students/$id"
                              params={{ id: realId }}
                              className="flex items-center justify-center rounded p-0.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FileText className="h-4 w-4" />
                            </Link>
                          ) : (
                            <span className="flex items-center justify-center rounded p-0.5 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                            </span>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {realId
                            ? 'View student profile'
                            : 'Profile not available'}
                        </TooltipContent>
                      </TooltipUI>
                    )
                  })()}
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No students match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-xs text-muted-foreground">
            {filtered.length} students · Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<Array<number | '…'>>((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="icon"
                    className="h-7 w-7 text-xs"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Level Attendance Analytics (for Student Analytics page) ─────────────────

export function AttendanceLevelAnalytics() {
  const [level, setLevel] = useState('Secondary 4')
  const [chartExpanded, setChartExpanded] = useState(false)

  const attendance = LEVEL_ATTENDANCE_DATA[level] ?? {
    present: 100,
    lta: 2,
    total: 105,
  }
  const monthlyData = LEVEL_MONTHLY[level] ?? MONTHLY_DATA
  const ringSegments = buildLevelRingSegments(attendance)
  const presentPct = Math.round((attendance.present / attendance.total) * 100)
  const ltaPct = ((attendance.lta / attendance.total) * 100).toFixed(1)

  return (
    <div className="mt-6 space-y-10">
      <div>
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <LevelDropdown value={level} onValueChange={setLevel} />
        </div>

        {/* Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Current Attendance card */}
          <div className="rounded-lg border bg-white p-4">
            <p className="mb-4 text-sm font-semibold text-foreground">
              Current Attendance
            </p>
            <div className="flex items-center gap-6">
              <AttendanceRing
                percentage={presentPct}
                size={100}
                color="#228be6"
              />
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-xs text-muted-foreground">Term 4</p>
                  <p className="text-2xl font-semibold">
                    {attendance.present} / {attendance.total}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Students present
                  </p>
                </div>
                <div className="space-y-1.5 border-l pl-5 text-xs">
                  <p className="flex items-baseline gap-2">
                    <span className="w-8 text-right font-semibold tabular-nums text-foreground">
                      {attendance.present}
                    </span>
                    <span className="text-muted-foreground">
                      Present ({presentPct}%)
                    </span>
                  </p>
                  <p className="flex items-baseline gap-2">
                    <span className="w-8 text-right font-semibold tabular-nums text-foreground">
                      {attendance.lta}
                    </span>
                    <span className="text-muted-foreground">
                      LTA ({ltaPct}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Absences / Late-coming by Month card */}
          <div className="rounded-lg border bg-white p-4 [&_svg:focus]:outline-none [&_svg]:outline-none">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                Absences / Late-coming by Month
              </p>
              <button
                onClick={() => setChartExpanded(true)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Expand chart"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AbsenceBarChart data={monthlyData} />
            </ResponsiveContainer>
            <AbsenceLegend />
          </div>
        </div>
      </div>

      {/* Students sorted by absences / late-coming */}
      <AttendanceStudentsTable />

      {/* Expanded overlay */}
      {chartExpanded && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setChartExpanded(false)}
            role="presentation"
          />
          <div
            className="fixed inset-6 z-50 flex flex-col rounded-xl border bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Absences / Late-coming by Month"
            tabIndex={-1}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') setChartExpanded(false)
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Absences / Late-coming by Month
              </h3>
              <button
                onClick={() => setChartExpanded(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close chart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AbsenceBarChart data={monthlyData} barSize={16} />
              </ResponsiveContainer>
            </div>
            <AbsenceLegend />
          </div>
        </>
      )}
    </div>
  )
}

// ─── Individual Student Attendance Analytics ──────────────────────────────────

export function AttendanceAnalytics() {
  const [chartExpanded, setChartExpanded] = useState(false)

  return (
    <div className="mt-6 space-y-8 border-t pt-6">
      {/* 1. Current term */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Current attendance
        </h3>
        <div className="flex items-center gap-6">
          <AttendanceRing
            percentage={
              (CURRENT_ATTENDANCE.present / CURRENT_ATTENDANCE.total) * 100
            }
            size={100}
            color="#228be6"
          />
          <div className="flex items-center gap-5">
            <div>
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="text-2xl font-semibold">
                {CURRENT_ATTENDANCE.present} / {CURRENT_ATTENDANCE.total}
              </p>
              <p className="text-xs text-muted-foreground">Days present</p>
            </div>
            <div className="space-y-1 border-l pl-5 text-xs text-muted-foreground">
              {RING_SEGMENTS.filter((s) => s.name !== 'Present').map((s) => (
                <p key={s.name} className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground">
                    {s.value}
                  </span>
                  {s.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Weekly Attendance Rate */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Weekly Attendance Rate
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={WEEKLY_RATE}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e9ecef"
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: '#868e96' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 12, fill: '#868e96' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Attendance rate']}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid #dee2e6',
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#228be6"
              strokeWidth={2}
              dot={{ fill: '#228be6', r: 4, strokeWidth: 0 }}
              label={{
                position: 'top',
                fontSize: 11,
                fill: '#495057',
                formatter: (v: number) => (v < 100 ? `${v}%` : ''),
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Absences / Late-coming by Month */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Absences / Late-coming by Month
          </h3>
          <button
            onClick={() => setChartExpanded(true)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Expand chart"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AbsenceBarChart />
        </ResponsiveContainer>
        <AbsenceLegend />
      </div>

      {/* Expanded overlay */}
      {chartExpanded && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setChartExpanded(false)}
            role="presentation"
          />
          <div
            className="fixed inset-6 z-50 flex flex-col rounded-xl border bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Absences / Late-coming by Month"
            tabIndex={-1}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') setChartExpanded(false)
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Absences / Late-coming by Month
              </h3>
              <button
                onClick={() => setChartExpanded(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close chart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AbsenceBarChart barSize={16} />
              </ResponsiveContainer>
            </div>
            <AbsenceLegend />
          </div>
        </>
      )}

      {/* 4. Absences / Late-coming Details */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Absences / Late-coming Details
        </h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Absences / Latecoming
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Sub-reason
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ABSENCE_DETAILS.map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.date}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: row.typeColor }}
                  >
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {row.subReason}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
