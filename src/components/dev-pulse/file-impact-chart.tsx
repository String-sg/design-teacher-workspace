import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { PRData } from '@/lib/dev-pulse/types'

interface FileImpactChartProps {
  prs: PRData[]
  limit?: number
}

interface FileImpact {
  name: string
  shortName: string
  additions: number
  deletions: number
  total: number
}

function aggregateFileImpact(prs: PRData[], limit: number): FileImpact[] {
  const fileMap = new Map<string, { additions: number; deletions: number }>()

  for (const pr of prs) {
    for (const file of pr.files) {
      const existing = fileMap.get(file.filename) ?? {
        additions: 0,
        deletions: 0,
      }
      existing.additions += file.additions
      existing.deletions += file.deletions
      fileMap.set(file.filename, existing)
    }
  }

  return Array.from(fileMap.entries())
    .map(([name, stats]) => ({
      name,
      shortName: name.split('/').slice(-2).join('/'),
      additions: stats.additions,
      deletions: stats.deletions,
      total: stats.additions + stats.deletions,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload as FileImpact
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
      <p className="max-w-[250px] truncate text-xs font-medium text-foreground font-mono">
        {data.name}
      </p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-xs text-green-600">+{data.additions}</span>
        <span className="text-xs text-red-500">-{data.deletions}</span>
      </div>
    </div>
  )
}

export function FileImpactChart({
  prs,
  limit = 10,
}: FileImpactChartProps) {
  const data = aggregateFileImpact(prs, limit)

  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No file data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(260, data.length * 32)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          width={160}
          tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="additions"
          stackId="a"
          fill="#22c55e"
          fillOpacity={0.7}
          radius={0}
        />
        <Bar
          dataKey="deletions"
          stackId="a"
          fill="#ef4444"
          fillOpacity={0.7}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
