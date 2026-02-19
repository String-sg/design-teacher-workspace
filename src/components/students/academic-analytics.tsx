import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Maximize2, X } from 'lucide-react'

// Mock data for subjects taken with banding
const SUBJECTS_BANDING = [
  { subject: 'Geography', banding: 'G2 / 5' },
  { subject: 'Mother Tongue', banding: 'G2 / 5' },
  { subject: 'English', banding: 'G3 / B4' },
  { subject: 'Mathematics', banding: 'G3 / A2' },
  { subject: 'Science', banding: 'G3 / C5' },
  { subject: 'History', banding: 'G3 / B3' },
]

// Mock data for performance per subject grouped by semester
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
  term2WA: '#495057',
  term3WA: '#74b816',
  endOfYear: '#868e96',
  overall: '#343a40',
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
      <span className="text-muted-foreground">Term</span>
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

export function AcademicAnalytics() {
  const [chartExpanded, setChartExpanded] = useState(false)

  return (
    <div className="mt-6 space-y-8 border-t pt-6">
      {/* 1. Subjects Taken with Banding */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Subjects Taken with Banding
        </h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Subject
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  B/G
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
                    {row.banding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Performance per Subject */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Performance per Subject
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
        {/* G2 / G3 segmentation labels */}
        <div className="flex" style={{ paddingLeft: 28, paddingRight: 8 }}>
          <div
            className="flex items-center justify-center border-t border-r border-muted-foreground/30 py-1.5"
            style={{ width: `${(G2_COUNT / TOTAL_SUBJECTS) * 100}%` }}
          >
            <span className="text-xs font-semibold text-foreground">G2</span>
          </div>
          <div
            className="flex items-center justify-center border-t border-muted-foreground/30 py-1.5"
            style={{ width: `${(G3_COUNT / TOTAL_SUBJECTS) * 100}%` }}
          >
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
                Performance per Subject
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
            {/* G2 / G3 segmentation labels in overlay */}
            <div className="flex" style={{ paddingLeft: 28, paddingRight: 8 }}>
              <div
                className="flex items-center justify-center border-t border-r border-muted-foreground/30 py-1.5"
                style={{ width: `${(G2_COUNT / TOTAL_SUBJECTS) * 100}%` }}
              >
                <span className="text-xs font-semibold text-foreground">
                  G2
                </span>
              </div>
              <div
                className="flex items-center justify-center border-t border-muted-foreground/30 py-1.5"
                style={{ width: `${(G3_COUNT / TOTAL_SUBJECTS) * 100}%` }}
              >
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
