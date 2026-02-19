import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Maximize2, X } from 'lucide-react'

// Mock data – replace with real data props as needed
const CURRENT_ATTENDANCE = {
  present: 10,
  total: 12,
  breakdown: [
    { name: 'Absent pending reason', value: 1, color: '#e03131' },
    { name: 'Absent (excl pending reason)', value: 1, color: '#f08c00' },
    { name: 'Late', value: 1, color: '#2f9e44' },
    { name: 'Present', value: 9, color: '#e9ecef' },
  ],
}

const WEEKLY_RATE = [
  { week: 'Week 1', rate: 100 },
  { week: 'Week 2', rate: 50 },
  { week: 'Week 3', rate: 100 },
  { week: 'Week 4', rate: 83 },
  { week: 'Week 5', rate: 93 },
]

// null = no occurrences that month (prevents empty bar slots)
const MONTHLY_DATA = [
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
    typeColor: '#e03131',
    subReason: '—',
    remarks: 'Follow-up required',
  },
  {
    date: 'Wednesday, 7 January 2026',
    type: 'Absent without valid reason',
    typeColor: '#e03131',
    subReason: '—',
    remarks: 'Follow-up required',
  },
  {
    date: 'Sunday, 11 January 2026',
    type: 'Late',
    typeColor: '#2f9e44',
    subReason: '—',
    remarks: 'Noted',
  },
  {
    date: 'Monday, 19 January 2026',
    type: 'Absent without valid reason',
    typeColor: '#e03131',
    subReason: '—',
    remarks: 'Parent informed',
  },
]

const BAR_CATEGORIES = [
  { key: 'latecoming', label: 'Latecoming', color: '#1971c2' },
  {
    key: 'absentNoValid',
    label: 'Absent without valid reason',
    color: '#74c0fc',
  },
  {
    key: 'absentValidPrivate',
    label: 'Absent with valid reason (Private)',
    color: '#69db7c',
  },
  {
    key: 'absentValidOfficial',
    label: 'Absent with valid reason (Official)',
    color: '#2f9e44',
  },
  { key: 'absentMC', label: 'Absent with MC', color: '#40c057' },
  { key: 'pendingReason', label: 'Absence pending reason', color: '#1a1a2e' },
]

const CHART_COMMON_PROPS = {
  data: MONTHLY_DATA,
  margin: { top: 20, right: 8, left: -20, bottom: 4 },
  barCategoryGap: '20%' as const,
  barGap: 0,
}

function AbsenceBarChart({ barSize }: { barSize?: number }) {
  return (
    <BarChart {...CHART_COMMON_PROPS} barSize={barSize}>
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
      {BAR_CATEGORIES.map((cat) => (
        <Bar
          key={cat.key}
          dataKey={cat.key}
          fill={cat.color}
          radius={[2, 2, 0, 0]}
        >
          <LabelList
            position="top"
            style={{ fontSize: 10, fill: '#495057' }}
            formatter={(v: unknown) => (Number(v) > 0 ? String(v) : '')}
          />
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

export function AttendanceAnalytics() {
  const [chartExpanded, setChartExpanded] = useState(false)

  const pieData = CURRENT_ATTENDANCE.breakdown.filter(
    (d) => d.name !== 'Present',
  )
  const presentSlice = {
    name: 'Present',
    value:
      CURRENT_ATTENDANCE.present - pieData.reduce((s, d) => s + d.value, 0),
    color: '#e9ecef',
  }
  const allPieData = [
    ...pieData,
    {
      ...presentSlice,
      value: Math.max(0, CURRENT_ATTENDANCE.present - pieData.length),
    },
  ]

  return (
    <div className="mt-6 space-y-8 border-t pt-6">
      {/* 1. Current Attendance */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Current Attendance
        </h3>
        <div className="flex items-center gap-8">
          <div className="relative shrink-0">
            <PieChart width={120} height={120}>
              <Pie
                data={allPieData}
                cx={55}
                cy={55}
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {allPieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold leading-none">
                {CURRENT_ATTENDANCE.present}
              </span>
              <span className="text-xs text-muted-foreground">
                /{CURRENT_ATTENDANCE.total}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.value}</span>
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
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
            title="Expand chart"
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
          />
          <div className="fixed inset-6 z-50 flex flex-col rounded-xl border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Absences / Late-coming by Month
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
