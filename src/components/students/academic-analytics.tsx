import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Check,
  ChevronDown,
  FileText,
  Maximize2,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipUI,
} from '@/components/ui/tooltip'
import { groupedClassOptions } from '@/data/mock-students'

// ---------------------------------------------------------------------------
// Data constants — Trends section
// ---------------------------------------------------------------------------

const SUBJECTS_BANDING = [
  { subject: 'Geography (G2)', grade: 'C5' },
  { subject: 'Mother Tongue (G2)', grade: 'C5' },
  { subject: 'English (G3)', grade: 'B4' },
  { subject: 'Mathematics (G3)', grade: 'A2' },
  { subject: 'Science (G3)', grade: 'C5' },
  { subject: 'History (G3)', grade: 'B3' },
]

const PERFORMANCE_DATA = [
  {
    subject: 'Geography',
    term1WA: 60,
    term2WA: 64,
    term3WA: 65,
    endOfYear: 64,
    overall: 63,
  },
  {
    subject: 'Mother Tongue',
    term1WA: 92,
    term2WA: 94,
    term3WA: 88,
    endOfYear: 88,
    overall: 85,
  },
  {
    subject: 'English',
    term1WA: 89,
    term2WA: 85,
    term3WA: 81,
    endOfYear: 79,
    overall: 80,
  },
  {
    subject: 'Mathematics',
    term1WA: 73,
    term2WA: 80,
    term3WA: 74,
    endOfYear: 70,
    overall: 70,
  },
  {
    subject: 'Science',
    term1WA: 92,
    term2WA: 92,
    term3WA: 87,
    endOfYear: 81,
    overall: 86,
  },
  {
    subject: 'History',
    term1WA: 76,
    term2WA: 75,
    term3WA: 68,
    endOfYear: 72,
    overall: 72,
  },
]

const G2_COUNT = 2
const G3_COUNT = 4
const TOTAL_SUBJECTS = G2_COUNT + G3_COUNT

const BAR_COLORS = {
  term1WA: '#228be6',
  term2WA: '#6366f1',
  term3WA: '#12b886',
  endOfYear: '#0891b2',
  overall: '#a7aab5',
}

const LEGEND_ITEMS = [
  { key: 'term1WA', label: 'Term 1 WA', color: BAR_COLORS.term1WA },
  { key: 'term2WA', label: 'Term 2 WA', color: BAR_COLORS.term2WA },
  { key: 'term3WA', label: 'Term 3 WA', color: BAR_COLORS.term3WA },
  { key: 'endOfYear', label: 'End-of-year Exam', color: BAR_COLORS.endOfYear },
  { key: 'overall', label: 'Overall', color: BAR_COLORS.overall },
]

const CHART_TOOLTIP_FORMATTER = (value: number, name: string) => {
  const labels: Record<string, string> = {
    term1WA: 'Term 1 WA',
    term2WA: 'Term 2 WA',
    term3WA: 'Term 3 WA',
    endOfYear: 'End-of-year Exam',
    overall: 'Overall',
  }
  return [`${value}%`, labels[name] ?? name]
}

// ---------------------------------------------------------------------------
// Data constants — Distribution section (Monitoring tab)
// ---------------------------------------------------------------------------

const MOE_SUBJECT_GROUPS = [
  {
    group: 'Languages',
    subjects: [
      { value: 'el-g1', label: 'EL - G1' },
      { value: 'el-g2', label: 'EL - G2' },
      { value: 'el-g3', label: 'EL - G3' },
      { value: 'mt-g1', label: 'MT - G1' },
      { value: 'mt-g2', label: 'MT - G2' },
      { value: 'mt-g3', label: 'MT - G3' },
    ],
  },
  {
    group: 'Mathematics',
    subjects: [
      { value: 'math-g1', label: 'Math - G1' },
      { value: 'math-g2', label: 'Math - G2' },
      { value: 'math-g3', label: 'Math - G3' },
      { value: 'amath-g3', label: 'A Math - G3' },
    ],
  },
  {
    group: 'Sciences',
    subjects: [
      { value: 'sci-g2', label: 'Sci - G2' },
      { value: 'sci-g3', label: 'Sci - G3' },
      { value: 'bio-g2', label: 'Biology - G2' },
      { value: 'bio-g3', label: 'Biology - G3' },
      { value: 'chem-g2', label: 'Chemistry - G2' },
      { value: 'chem-g3', label: 'Chemistry - G3' },
      { value: 'phy-g2', label: 'Physics - G2' },
      { value: 'phy-g3', label: 'Physics - G3' },
    ],
  },
  {
    group: 'Humanities',
    subjects: [
      { value: 'geog-g2', label: 'Geography - G2' },
      { value: 'geog-g3', label: 'Geography - G3' },
      { value: 'hist-g2', label: 'History - G2' },
      { value: 'hist-g3', label: 'History - G3' },
      { value: 'lit-g2', label: 'Literature - G2' },
      { value: 'lit-g3', label: 'Literature - G3' },
    ],
  },
  {
    group: 'Others',
    subjects: [
      { value: 'art-g2', label: 'Art - G2' },
      { value: 'art-g3', label: 'Art - G3' },
      { value: 'dt-g2', label: 'D&T - G2' },
      { value: 'dt-g3', label: 'D&T - G3' },
      { value: 'fce-g2', label: 'FCE - G2' },
      { value: 'fce-g3', label: 'FCE - G3' },
      { value: 'music-g2', label: 'Music - G2' },
      { value: 'music-g3', label: 'Music - G3' },
      { value: 'poa-g2', label: 'Principles of Acc - G2' },
      { value: 'poa-g3', label: 'Principles of Acc - G3' },
      { value: 'comp-g2', label: 'Computing - G2' },
      { value: 'comp-g3', label: 'Computing - G3' },
    ],
  },
]

const ASSESSMENT_OPTIONS = [
  { value: 'term1wa', label: 'Term 1 WA' },
  { value: 'term2wa', label: 'Term 2 WA' },
  { value: 'term3wa', label: 'Term 3 WA' },
  { value: 'eoy', label: 'End-of-year Exam' },
  { value: 'overall', label: 'Overall' },
]

const INDICATOR_OPTIONS = ['Distinction', 'Pass'] as const

// Mock results data — Secondary 4, EL-G3, Term 1 WA
const QUICK_STATS = { total: 120, distinction: 42, pass: 68 }

const GRADE_DATA = [
  { grade: 'A1', count: 15 },
  { grade: 'A2', count: 27 },
  { grade: 'B3', count: 22 },
  { grade: 'B4', count: 18 },
  { grade: 'C5', count: 16 },
  { grade: 'C6', count: 12 },
  { grade: 'D7', count: 7 },
  { grade: 'VR', count: 3 },
]

const GRADE_FILL: Record<string, string> = {
  A1: '#228be6',
  A2: '#74c0fc',
  B3: '#12b886',
  B4: '#63e6be',
  C5: '#fd7e14',
  C6: '#ffa94d',
  D7: '#fa5252',
  VR: '#adb5bd',
}

const GRADE_BADGE: Record<string, string> = {
  A1: 'bg-blue-100 text-blue-800',
  A2: 'bg-blue-50 text-blue-700',
  B3: 'bg-teal-100 text-teal-800',
  B4: 'bg-teal-50 text-teal-700',
  C5: 'bg-orange-100 text-orange-800',
  C6: 'bg-orange-50 text-orange-700',
  D7: 'bg-red-100 text-red-800',
  VR: 'bg-gray-100 text-gray-600',
}

const BOX_PLOT_DATA = [
  { class: '4A', min: 52, q1: 65, median: 74, q3: 85, max: 97 },
  { class: '4B', min: 45, q1: 58, median: 68, q3: 78, max: 94 },
  { class: '4C', min: 40, q1: 52, median: 62, q3: 73, max: 90 },
  { class: '4D', min: 35, q1: 48, median: 57, q3: 68, max: 85 },
]

// ---------------------------------------------------------------------------
// Helpers — derive breakdown data from filter selection
// ---------------------------------------------------------------------------

function hashFilters(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i)
  }
  return Math.abs(h)
}

const BASE_GRADE_COUNTS = [15, 27, 22, 18, 16, 12, 7, 3]

type BreakdownData = {
  quickStats: { total: number; distinction: number; pass: number }
  gradeData: Array<{ grade: string; count: number }>
  boxPlotData: typeof BOX_PLOT_DATA
}

function computeBreakdownData(
  level: string,
  subject: string,
  assessment: string,
): BreakdownData {
  const h = hashFilters(`${level}:${subject}:${assessment}`)

  const gradeData = GRADE_DATA.map((g, i) => ({
    grade: g.grade,
    count: Math.max(1, BASE_GRADE_COUNTS[i] + (((h >> (i * 4)) & 0xf) - 7)),
  }))

  const total = gradeData.reduce((sum, g) => sum + g.count, 0)
  const distinction = gradeData[0].count + gradeData[1].count
  const pass = gradeData.slice(0, 6).reduce((sum, g) => sum + g.count, 0)

  const offset = (h & 0x1f) - 15
  const boxPlotData = BOX_PLOT_DATA.map((d) => ({
    class: d.class,
    min: Math.max(0, d.min + offset),
    q1: Math.max(0, d.q1 + offset),
    median: Math.max(0, d.median + offset),
    q3: Math.min(100, d.q3 + offset),
    max: Math.min(100, d.max + offset),
  }))

  return { quickStats: { total, distinction, pass }, gradeData, boxPlotData }
}

const MOCK_CANDIDATES = [
  { id: '1', name: 'Chen Teo Jun Kai', class: '4A', score: 92, grade: 'A1' },
  { id: '2', name: 'Vincent Koh Xin Yi', class: '4A', score: 88, grade: 'A2' },
  { id: '3', name: 'Xiao Lam Wei Jie', class: '4B', score: 85, grade: 'A2' },
  { id: '4', name: 'Sarah Chan Jun Kai', class: '4A', score: 83, grade: 'A2' },
  { id: '5', name: 'Yusuf Koh Xin Yi', class: '4C', score: 79, grade: 'B3' },
  { id: '6', name: 'Liang Lim Wei Jie', class: '4B', score: 77, grade: 'B3' },
  { id: '7', name: 'Sarah Tan Jun Kai', class: '4A', score: 75, grade: 'B3' },
  { id: '8', name: 'Harish Cheng Xin Yi', class: '4D', score: 73, grade: 'B3' },
  {
    id: '9',
    name: 'Tan Lam Wei Jie',
    class: '4B',
    score: 71,
    grade: 'B4',
  },
  {
    id: '10',
    name: 'Jason Chua Jun Kai',
    class: '4C',
    score: 68,
    grade: 'B4',
  },
  {
    id: '11',
    name: 'Ahmad Bin Hassan',
    class: '4A',
    score: 66,
    grade: 'B4',
  },
  {
    id: '12',
    name: 'Rachel Wong Mei Ling',
    class: '4D',
    score: 64,
    grade: 'C5',
  },
  { id: '13', name: 'Kevin Ng Wei Ming', class: '4B', score: 62, grade: 'C5' },
  {
    id: '14',
    name: 'Priya Sharma',
    class: '4C',
    score: 60,
    grade: 'C5',
  },
  {
    id: '15',
    name: 'Muhammad Farhan',
    class: '4D',
    score: 58,
    grade: 'C5',
  },
  {
    id: '16',
    name: 'Emily Tan Shu Wen',
    class: '4A',
    score: 55,
    grade: 'C6',
  },
  {
    id: '17',
    name: 'Ryan Lim Zhi Hao',
    class: '4B',
    score: 53,
    grade: 'C6',
  },
  {
    id: '18',
    name: 'Nurul Izzah Binte Kamal',
    class: '4C',
    score: 50,
    grade: 'C6',
  },
  {
    id: '19',
    name: 'Joshua Lee Wei Xuan',
    class: '4D',
    score: 47,
    grade: 'D7',
  },
  {
    id: '20',
    name: 'Siti Aminah Binte Rahman',
    class: '4A',
    score: 44,
    grade: 'D7',
  },
]

// ---------------------------------------------------------------------------
// Shared sub-components — Trends charts
// ---------------------------------------------------------------------------

function PerformanceBarChart({ barSize }: { barSize?: number }) {
  return (
    <BarChart
      data={PERFORMANCE_DATA}
      margin={{ top: 20, right: 8, left: -20, bottom: 4 }}
      barCategoryGap="20%"
      barGap={0}
      barSize={barSize}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
      <XAxis
        dataKey="subject"
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
        formatter={CHART_TOOLTIP_FORMATTER}
        contentStyle={{
          fontSize: 12,
          borderRadius: 6,
          border: '1px solid #dee2e6',
        }}
      />
      <Bar dataKey="term1WA" fill={BAR_COLORS.term1WA} radius={[2, 2, 0, 0]}>
        <LabelList position="top" style={{ fontSize: 10, fill: '#495057' }} />
      </Bar>
      <Bar dataKey="term2WA" fill={BAR_COLORS.term2WA} radius={[2, 2, 0, 0]}>
        <LabelList position="top" style={{ fontSize: 10, fill: '#495057' }} />
      </Bar>
      <Bar dataKey="term3WA" fill={BAR_COLORS.term3WA} radius={[2, 2, 0, 0]}>
        <LabelList position="top" style={{ fontSize: 10, fill: '#495057' }} />
      </Bar>
      <Bar
        dataKey="endOfYear"
        fill={BAR_COLORS.endOfYear}
        radius={[2, 2, 0, 0]}
      >
        <LabelList position="top" style={{ fontSize: 10, fill: '#495057' }} />
      </Bar>
      <Bar dataKey="overall" fill={BAR_COLORS.overall} radius={[2, 2, 0, 0]}>
        <LabelList position="top" style={{ fontSize: 10, fill: '#495057' }} />
      </Bar>
    </BarChart>
  )
}

function PerformanceLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.key} className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Distribution section sub-components
// ---------------------------------------------------------------------------

// Level dropdown — mirrors ClassSelector style but compact
interface LevelDropdownProps {
  value: string
  onValueChange: (v: string) => void
}

function LevelDropdown({ value, onValueChange }: LevelDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const displayLabel = (() => {
    for (const group of groupedClassOptions) {
      if (group.level === value) return group.level
      const match = group.classes.find((c) => c.value === value)
      if (match) return match.label
    }
    return value
  })()

  const filteredGroups = useMemo(() => {
    if (!search) return groupedClassOptions
    const query = search.toLowerCase()
    return groupedClassOptions
      .map((group) => {
        const levelMatches = group.level.toLowerCase().includes(query)
        const matchingClasses = group.classes.filter(
          (c) =>
            c.label.toLowerCase().includes(query) ||
            c.value.toLowerCase().includes(query),
        )
        if (levelMatches) return group
        if (matchingClasses.length > 0)
          return { ...group, classes: matchingClasses }
        return null
      })
      .filter(Boolean) as typeof groupedClassOptions
  }, [search])

  const handleSelect = (v: string) => {
    onValueChange(v)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="border-border bg-white hover:bg-muted flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors outline-none"
          />
        }
      >
        <span className="text-muted-foreground">Level:</span>
        <span>{displayLabel}</span>
        <ChevronDown className="text-muted-foreground ml-0.5 h-4 w-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        className="w-64 overflow-hidden rounded-2xl p-0"
        align="start"
      >
        <div className="p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search filters"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {filteredGroups.map((group, index) => (
            <div key={group.level}>
              {index > 0 && <div className="my-1 h-px bg-border/50" />}
              <button
                type="button"
                onClick={() => handleSelect(group.level)}
                className={cn(
                  'inline-flex w-full items-center gap-2 rounded-lg p-2 text-base font-normal leading-6 outline-none hover:bg-accent',
                  value === group.level && 'bg-accent font-semibold',
                )}
              >
                <span className="line-clamp-1 flex-1 text-left">
                  {group.level}
                </span>
                {value === group.level && (
                  <Check className="ml-auto h-4 w-4 shrink-0" />
                )}
              </button>
              {group.classes.map((cls) => (
                <button
                  key={cls.value}
                  type="button"
                  onClick={() => handleSelect(cls.value)}
                  className={cn(
                    'inline-flex w-full items-center gap-2 rounded-lg p-2 text-base font-normal leading-6 outline-none hover:bg-accent',
                    value === cls.value && 'bg-accent font-semibold',
                  )}
                >
                  <span className="line-clamp-1 flex-1 text-left">
                    {cls.label}
                  </span>
                  {value === cls.value && (
                    <Check className="ml-auto h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Indicator multi-select
interface IndicatorDropdownProps {
  value: Array<string>
  onValueChange: (v: Array<string>) => void
}

function IndicatorDropdown({ value, onValueChange }: IndicatorDropdownProps) {
  const [open, setOpen] = useState(false)

  const label =
    value.length === 0
      ? 'Indicator'
      : value.length === INDICATOR_OPTIONS.length
        ? 'All indicators'
        : value.join(', ')

  const toggle = (option: string) => {
    onValueChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="border-border bg-white hover:bg-muted flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors outline-none"
          />
        }
      >
        <span className="text-muted-foreground">Indicator:</span>
        <span className={cn(value.length === 0 && 'text-muted-foreground')}>
          {label}
        </span>
        <ChevronDown className="text-muted-foreground ml-0.5 h-4 w-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="w-44 gap-0 p-2" align="start">
        {INDICATOR_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-accent"
          >
            <Checkbox
              checked={value.includes(option)}
              className="pointer-events-none"
            />
            {option}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// Grade distribution bar chart
function GradeDistChart({ data }: { data: BreakdownData['gradeData'] }) {
  return (
    <BarChart
      data={data}
      margin={{ top: 20, right: 8, left: -20, bottom: 4 }}
      barCategoryGap="25%"
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
      <XAxis
        dataKey="grade"
        tick={{ fontSize: 12, fill: '#868e96' }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: '#868e96' }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip
        formatter={(v: number) => [v, 'Students']}
        contentStyle={{
          fontSize: 12,
          borderRadius: 6,
          border: '1px solid #dee2e6',
        }}
      />
      <Bar dataKey="count" radius={[3, 3, 0, 0]} isAnimationActive={false}>
        {data.map((entry) => (
          <Cell key={entry.grade} fill={GRADE_FILL[entry.grade] ?? '#adb5bd'} />
        ))}
        <LabelList
          dataKey="count"
          position="top"
          style={{ fontSize: 11, fill: '#495057', fontWeight: 500 }}
        />
      </Bar>
    </BarChart>
  )
}

// Box plot — horizontal, pure SVG rendered via ResponsiveContainer
function BoxPlotSVGInner({
  width = 400,
  height = 280,
  data = BOX_PLOT_DATA,
}: {
  width?: number
  height?: number
  data?: BreakdownData['boxPlotData']
}) {
  const ml = 48,
    mr = 20,
    mt = 16,
    mb = 32
  const innerW = width - ml - mr
  const innerH = height - mt - mb
  const toX = (v: number) => ml + (v / 100) * innerW

  const rowH = innerH / data.length
  const bh = Math.max(rowH * 0.58, 16)
  const capH = 5
  const ticks = [0, 20, 40, 60, 80, 100]

  return (
    <svg width={width} height={height}>
      {/* Vertical grid lines */}
      {ticks.map((t) => (
        <line
          key={t}
          x1={toX(t)}
          y1={mt}
          x2={toX(t)}
          y2={height - mb}
          stroke="#e9ecef"
          strokeDasharray="3 3"
        />
      ))}
      {/* X axis labels */}
      {ticks.map((t) => (
        <text
          key={t}
          x={toX(t)}
          y={height - mb + 16}
          textAnchor="middle"
          fontSize={11}
          fill="#868e96"
        >
          {t}
        </text>
      ))}
      {/* Horizontal box plots */}
      {data.map((d, i) => {
        const cy = mt + rowH * i + rowH / 2
        const xMin = toX(d.min)
        const xQ1 = toX(d.q1)
        const xMed = toX(d.median)
        const xQ3 = toX(d.q3)
        const xMax = toX(d.max)

        return (
          <g key={d.class}>
            {/* Left whisker */}
            <line
              x1={xMin}
              y1={cy}
              x2={xQ1}
              y2={cy}
              stroke="#868e96"
              strokeWidth={1.5}
            />
            <line
              x1={xMin}
              y1={cy - capH}
              x2={xMin}
              y2={cy + capH}
              stroke="#868e96"
              strokeWidth={1.5}
            />
            {/* IQR box */}
            <rect
              x={xQ1}
              y={cy - bh / 2}
              width={xQ3 - xQ1}
              height={bh}
              fill="rgba(34,139,230,0.1)"
              stroke="#228be6"
              strokeWidth={1.5}
              rx={2}
            />
            {/* Median line */}
            <line
              x1={xMed}
              y1={cy - bh / 2}
              x2={xMed}
              y2={cy + bh / 2}
              stroke="#228be6"
              strokeWidth={2.5}
            />
            {/* Right whisker */}
            <line
              x1={xQ3}
              y1={cy}
              x2={xMax}
              y2={cy}
              stroke="#868e96"
              strokeWidth={1.5}
            />
            <line
              x1={xMax}
              y1={cy - capH}
              x2={xMax}
              y2={cy + capH}
              stroke="#868e96"
              strokeWidth={1.5}
            />
            {/* Class label */}
            <text
              x={ml - 8}
              y={cy + 4}
              textAnchor="end"
              fontSize={12}
              fill="#868e96"
            >
              {d.class}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// AcademicAnalytics — Student 360 student profile (unchanged)
// ---------------------------------------------------------------------------

export function AcademicAnalytics() {
  const [chartExpanded, setChartExpanded] = useState(false)

  return (
    <div className="mt-6 space-y-8 border-t pt-6">
      {/* 1. Subjects taken and current grades */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Subjects taken and current grades
        </h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Subject
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current grades
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {SUBJECTS_BANDING.map((row) => (
                <tr key={row.subject} className="bg-white">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.subject}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Results over time */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Results over time
          </h3>
          <button
            onClick={() => setChartExpanded(true)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Expand chart"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PerformanceBarChart />
        </ResponsiveContainer>
        <div
          className="flex gap-2"
          style={{ paddingLeft: 28, paddingRight: 8 }}
        >
          <div className="flex flex-1 items-center justify-center border-t border-muted-foreground/30 py-1.5">
            <span className="text-xs font-semibold text-foreground">G2</span>
          </div>
          <div className="flex flex-[2] items-center justify-center border-t border-muted-foreground/30 py-1.5">
            <span className="text-xs font-semibold text-foreground">G3</span>
          </div>
        </div>
        <PerformanceLegend />
      </div>

      {/* Expanded overlay */}
      {chartExpanded && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setChartExpanded(false)}
          />
          <div className="fixed inset-6 z-50 flex flex-col rounded-xl border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Results over time
              </h3>
              <button
                onClick={() => setChartExpanded(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PerformanceBarChart barSize={16} />
              </ResponsiveContainer>
            </div>
            <div
              className="flex gap-2"
              style={{ paddingLeft: 28, paddingRight: 8 }}
            >
              <div className="flex flex-1 items-center justify-center border-t border-muted-foreground/30 py-1.5">
                <span className="text-xs font-semibold text-foreground">
                  G2
                </span>
              </div>
              <div className="flex flex-[2] items-center justify-center border-t border-muted-foreground/30 py-1.5">
                <span className="text-xs font-semibold text-foreground">
                  G3
                </span>
              </div>
            </div>
            <PerformanceLegend />
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MonitoringAcademicAnalytics — Student Analytics monitoring tab
// ---------------------------------------------------------------------------

export function MonitoringAcademicAnalytics() {
  // Distribution filters
  const [level, setLevel] = useState('Secondary 4')
  const [subject, setSubject] = useState('el-g3')
  const [assessment, setAssessment] = useState('term1wa')
  const [indicators, setIndicators] = useState<Array<string>>([
    'Distinction',
    'Pass',
  ])

  // Trends filters
  const [trendsLevel, setTrendsLevel] = useState('Secondary 4')
  const [trendsSubject, setTrendsSubject] = useState('el-g3')

  // Derived breakdown data — recomputes when filters change
  const breakdown = useMemo(
    () => computeBreakdownData(level, subject, assessment),
    [level, subject, assessment],
  )

  // Trend data — recomputes when trends filters change
  const trendData = useMemo(
    () =>
      ASSESSMENT_OPTIONS.map(({ value: assessKey, label }) => {
        const { quickStats } = computeBreakdownData(
          trendsLevel,
          trendsSubject,
          assessKey,
        )
        return {
          assessment: label,
          distinction: Math.round(
            (quickStats.distinction / quickStats.total) * 100,
          ),
          pass: Math.round((quickStats.pass / quickStats.total) * 100),
        }
      }),
    [trendsLevel, trendsSubject],
  )

  // Box plot container width
  const boxPlotContainerRef = useRef<HTMLDivElement>(null)
  const [boxPlotWidth, setBoxPlotWidth] = useState(400)
  useEffect(() => {
    const el = boxPlotContainerRef.current
    if (!el) return
    setBoxPlotWidth(el.offsetWidth)
    const observer = new ResizeObserver(([entry]) => {
      setBoxPlotWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Candidates table search
  const [candidateSearch, setCandidateSearch] = useState('')

  const filteredCandidates = useMemo(() => {
    const q = candidateSearch.toLowerCase()
    return q
      ? MOCK_CANDIDATES.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.class.toLowerCase().includes(q),
        )
      : MOCK_CANDIDATES
  }, [candidateSearch])

  return (
    <div className="mt-6 space-y-10 border-t pt-6">
      {/* ================================================================
          Section 1 — Distribution of subject performance
          ================================================================ */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Breakdown of subject performance
        </h3>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <LevelDropdown value={level} onValueChange={setLevel} />

          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger
              size="sm"
              className="h-8 w-auto gap-1.5 rounded-full border-border bg-white"
            >
              <span className="text-muted-foreground text-sm">Subject:</span>
              <SelectValue>
                {MOE_SUBJECT_GROUPS.flatMap((g) => g.subjects).find(
                  (s) => s.value === subject,
                )?.label ?? subject}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {MOE_SUBJECT_GROUPS.map((grp) => (
                <SelectGroup key={grp.group}>
                  <SelectLabel>{grp.group}</SelectLabel>
                  {grp.subjects.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Select value={assessment} onValueChange={setAssessment}>
            <SelectTrigger
              size="sm"
              className="h-8 w-auto gap-1.5 rounded-full border-border bg-white"
            >
              <span className="text-muted-foreground text-sm">Assessment:</span>
              <SelectValue>
                {ASSESSMENT_OPTIONS.find((o) => o.value === assessment)
                  ?.label ?? assessment}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {ASSESSMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <IndicatorDropdown value={indicators} onValueChange={setIndicators} />
        </div>

        {/* ── Quick stats ─────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs text-muted-foreground">No. of students sat</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {breakdown.quickStats.total}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs text-muted-foreground">
              Students with distinction
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {Math.round(
                (breakdown.quickStats.distinction /
                  breakdown.quickStats.total) *
                  100,
              )}
              %
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs text-muted-foreground">Students with pass</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {Math.round(
                (breakdown.quickStats.pass / breakdown.quickStats.total) * 100,
              )}
              %
            </p>
          </div>
        </div>

        {/* ── Charts row ──────────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* No. of students in each grade */}
          <div className="rounded-lg border bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              No. of students in each grade
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <GradeDistChart data={breakdown.gradeData} />
            </ResponsiveContainer>
          </div>

          {/* Scores by class */}
          <div className="rounded-lg border bg-white overflow-hidden">
            <p className="px-4 pt-4 pb-3 text-sm font-semibold text-foreground">
              Scores by class
            </p>
            <div ref={boxPlotContainerRef} className="w-full">
              <BoxPlotSVGInner
                width={boxPlotWidth}
                height={280}
                data={breakdown.boxPlotData}
              />
            </div>
            <div className="px-4 pb-4 mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded-sm border border-blue-400 bg-blue-400/10" />
                IQR (Q1–Q3)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-[2px] w-4 bg-blue-500" />
                Median
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-px bg-gray-400" />
                Min / Max
              </div>
            </div>
          </div>
        </div>

        {/* ── Students sorted by results ──────────────────────────────── */}
        <div className="mt-4 rounded-lg border bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Students sorted by results
          </p>

          {/* Search + filter bar */}
          <div className="mb-3 flex items-center gap-2">
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name or class…"
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="h-8 pl-9 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="w-2/5 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Name
                  </th>
                  <th className="w-[15%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Class
                  </th>
                  <th className="w-[15%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Score
                  </th>
                  <th className="w-[15%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Grade
                  </th>
                  <th className="w-[15%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    View profile
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCandidates.map((c) => (
                  <tr
                    key={c.id}
                    className="bg-white transition-colors hover:bg-muted/30"
                  >
                    <td className="w-2/5 px-4 py-2.5 font-medium text-foreground">
                      {c.name}
                    </td>
                    <td className="w-[15%] px-4 py-2.5 text-muted-foreground">
                      {c.class}
                    </td>
                    <td className="w-[15%] px-4 py-2.5 text-right tabular-nums">
                      {c.score}
                    </td>
                    <td className="w-[15%] px-4 py-2.5 text-right text-muted-foreground">
                      {c.grade}
                    </td>
                    <td className="w-[15%] px-4 py-2.5">
                      <TooltipUI>
                        <TooltipTrigger>
                          <Link
                            to="/students/$id"
                            params={{ id: c.id }}
                            className="flex items-center justify-center rounded p-0.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>View student profile</TooltipContent>
                      </TooltipUI>
                    </td>
                  </tr>
                ))}
                {filteredCandidates.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No candidates match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-border" />

      {/* ================================================================
          Section 2 — Trends of subject performance
          ================================================================ */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Trends of subject performance
        </h3>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <LevelDropdown value={trendsLevel} onValueChange={setTrendsLevel} />

          <Select value={trendsSubject} onValueChange={setTrendsSubject}>
            <SelectTrigger
              size="sm"
              className="h-8 w-auto gap-1.5 rounded-full border-border bg-white"
            >
              <span className="text-muted-foreground text-sm">Subject:</span>
              <SelectValue>
                {MOE_SUBJECT_GROUPS.flatMap((g) => g.subjects).find(
                  (s) => s.value === trendsSubject,
                )?.label ?? trendsSubject}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {MOE_SUBJECT_GROUPS.map((grp) => (
                <SelectGroup key={grp.group}>
                  <SelectLabel>{grp.group}</SelectLabel>
                  {grp.subjects.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject performance over time */}
        <div className="mt-4 rounded-lg border bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Subject performance over time
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={trendData}
              margin={{ top: 20, right: 8, left: -10, bottom: 4 }}
              barCategoryGap="30%"
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e9ecef"
              />
              <XAxis
                dataKey="assessment"
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
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === 'distinction' ? '% with distinction' : '% with pass',
                ]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid #dee2e6',
                }}
              />
              <Bar dataKey="distinction" fill="#228be6" radius={[2, 2, 0, 0]}>
                <LabelList
                  position="top"
                  formatter={(v: number) => `${v}%`}
                  style={{ fontSize: 10, fill: '#495057' }}
                />
              </Bar>
              <Bar dataKey="pass" fill="#12b886" radius={[2, 2, 0, 0]}>
                <LabelList
                  position="top"
                  formatter={(v: number) => `${v}%`}
                  style={{ fontSize: 10, fill: '#495057' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: '#228be6' }}
              />
              <span className="text-muted-foreground">% with distinction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: '#12b886' }}
              />
              <span className="text-muted-foreground">% with pass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
