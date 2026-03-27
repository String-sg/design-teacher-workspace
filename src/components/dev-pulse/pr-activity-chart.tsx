import * as React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from 'date-fns'

import type { PRData } from '@/lib/dev-pulse/types'

interface PRActivityChartProps {
  prs: PRData[]
  days?: number
}

interface DayActivity {
  date: string
  label: string
  additions: number
  deletions: number
  prCount: number
}

function aggregateByDay(prs: PRData[], days: number): DayActivity[] {
  const now = new Date()
  const start = subDays(now, days)
  const interval = eachDayOfInterval({ start, end: now })

  const dayMap = new Map<string, DayActivity>()
  for (const day of interval) {
    const key = format(day, 'yyyy-MM-dd')
    dayMap.set(key, {
      date: key,
      label: format(day, 'MMM d'),
      additions: 0,
      deletions: 0,
      prCount: 0,
    })
  }

  for (const pr of prs) {
    const prDate = pr.mergedAt ?? pr.createdAt
    const key = format(startOfDay(parseISO(prDate)), 'yyyy-MM-dd')
    const entry = dayMap.get(key)
    if (entry) {
      entry.additions += pr.additions
      entry.deletions += pr.deletions
      entry.prCount += 1
    }
  }

  return Array.from(dayMap.values())
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <div className="mt-1 space-y-0.5">
        <p className="text-xs text-green-600">
          +{payload[0]?.value?.toLocaleString()} additions
        </p>
        <p className="text-xs text-red-500">
          -{payload[1]?.value?.toLocaleString()} deletions
        </p>
        <p className="text-xs text-muted-foreground">
          {payload[0]?.payload?.prCount} PRs
        </p>
      </div>
    </div>
  )
}

export function PRActivityChart({ prs, days = 14 }: PRActivityChartProps) {
  const data = React.useMemo(() => aggregateByDay(prs, days), [prs, days])

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--color-border)"
          opacity={0.5}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="additions"
          stackId="1"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.15}
          strokeWidth={1.5}
        />
        <Area
          type="monotone"
          dataKey="deletions"
          stackId="2"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.1}
          strokeWidth={1.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
