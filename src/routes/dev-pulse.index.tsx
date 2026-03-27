import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  CircleHelp,
  GitPullRequestArrow,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from 'recharts'

import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataCard } from '@/components/data-card'
import { PRCard } from '@/components/dev-pulse/pr-card'
import { PRActivityChart } from '@/components/dev-pulse/pr-activity-chart'
import { FileImpactChart } from '@/components/dev-pulse/file-impact-chart'
import type { DashboardData, PRAnalysis } from '@/lib/dev-pulse/types'
import { SKILLS_USED } from '@/lib/dev-pulse/types'
import { fetchDashboardData, fetchAllAnalyses } from '@/lib/dev-pulse/server-fns'

export const Route = createFileRoute('/dev-pulse/')({
  component: DevPulseDashboard,
})

type FilterState = 'all' | 'open' | 'merged' | 'closed'

function DevPulseDashboard() {
  useSetBreadcrumbs([{ label: 'Dev Pulse', href: '/dev-pulse' }])

  const [data, setData] = useState<DashboardData | null>(null)
  const [analyses, setAnalyses] = useState<Record<number, PRAnalysis>>({})
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [filter, setFilter] = useState<FilterState>('all')
  const [authorFilter, setAuthorFilter] = useState<string>('all')

  async function loadData() {
    setLoading(true)
    try {
      const result = await fetchDashboardData({ data: { state: 'all', days: 30 } })
      setData(result)

      // Auto-load analyses (mock data returns instantly)
      setAnalyzing(true)
      const analysisResult = await fetchAllAnalyses({ data: { prs: result.prs } })
      setAnalyses(analysisResult)

      // Update avg quality score with real data
      const scores = Object.values(analysisResult).map((a) => a.qualityScore)
      if (scores.length > 0 && result) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                stats: {
                  ...prev.stats,
                  avgQualityScore: Math.round(
                    scores.reduce((s, v) => s + v, 0) / scores.length,
                  ),
                },
              }
            : prev,
        )
      }
    } catch (error) {
      console.error('Failed to load Dev Pulse data:', error)
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading PR data...</p>
        </div>
      </div>
    )
  }

  const authors = useMemo(
    () => [...new Set(data.prs.map((pr) => pr.author))],
    [data.prs],
  )

  const filteredPRs = useMemo(() => {
    return data.prs.filter((pr) => {
      if (filter !== 'all' && pr.state !== filter) return false
      if (authorFilter !== 'all' && pr.author !== authorFilter) return false
      return true
    })
  }, [data.prs, filter, authorFilter])

  const analysisValues = useMemo(() => Object.values(analyses), [analyses])

  const qualityDistribution = useMemo(
    () =>
      [
        {
          name: 'Excellent (80+)',
          value: analysisValues.filter((a) => a.qualityScore >= 80).length,
          color: '#22c55e',
        },
        {
          name: 'Good (50-79)',
          value: analysisValues.filter(
            (a) => a.qualityScore >= 50 && a.qualityScore < 80,
          ).length,
          color: '#eab308',
        },
        {
          name: 'Needs Work (<50)',
          value: analysisValues.filter((a) => a.qualityScore < 50).length,
          color: '#ef4444',
        },
      ].filter((d) => d.value > 0),
    [analysisValues],
  )

  const contributorStats = useMemo(() => {
    return authors
      .map((author) => {
        const authorPRs = data.prs.filter((pr) => pr.author === author)
        return {
          author,
          count: authorPRs.length,
          additions: authorPRs.reduce((s, pr) => s + pr.additions, 0),
        }
      })
      .sort((a, b) => b.count - a.count)
  }, [authors, data.prs])

  const allHighlights = useMemo(
    () => analysisValues.flatMap((a) => a.keyHighlights),
    [analysisValues],
  )

  const topRiskFlags = useMemo(
    () =>
      analysisValues
        .flatMap((a) => a.riskFlags)
        .reduce(
          (acc, flag) => {
            acc[flag] = (acc[flag] ?? 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
    [analysisValues],
  )

  return (
    <div className="flex flex-col p-6">
      <div className="w-full max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Dev Pulse</h1>
            <Badge
              variant="outline"
              className="border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300"
            >
              Experiment
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw
                className={`size-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="sm">
                    <Sparkles className="size-3.5" />
                    How this works
                  </Button>
                }
              />
              <SheetContent className="sm:max-w-md">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle>How Dev Pulse Works</SheetTitle>
                  <SheetDescription>
                    Multiple analysis techniques combine for a holistic view of
                    PR activity and code quality.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="space-y-5">
                    {SKILLS_USED.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex gap-3"
                      >
                        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Sparkles className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium leading-none">
                              {skill.name}
                            </span>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {skill.role}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor PR activity and design contributions
          {analyzing && (
            <span className="ml-2 inline-flex items-center gap-1 text-blue-600">
              <Loader2 className="size-3 animate-spin" />
              Analyzing PRs...
            </span>
          )}
        </p>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DataCard
            label="Open PRs"
            value={data.stats.openPRs}
            description="Awaiting review or merge"
          />
          <DataCard
            label="Merged This Week"
            value={data.stats.mergedThisWeek}
            description="Shipped to production"
          />
          <DataCard
            label="Avg Quality"
            value={
              data.stats.avgQualityScore > 0
                ? data.stats.avgQualityScore
                : '—'
            }
            description="AI code + design score"
          />
          <DataCard
            label="Lines Changed"
            value={data.stats.totalLinesChanged.toLocaleString()}
            description="Total additions + deletions"
          />
        </div>

        {/* Main tabs */}
        <Tabs defaultValue="pull-requests" className="mt-6">
          <TabsList variant="line">
            <TabsTrigger
              value="pull-requests"
              className="after:bg-blue-600! data-active:text-blue-600"
            >
              <GitPullRequestArrow className="size-4" />
              Pull Requests
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="after:bg-blue-600! data-active:text-blue-600"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="after:bg-blue-600! data-active:text-blue-600"
            >
              <Sparkles className="size-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Pull Requests tab */}
          <TabsContent value="pull-requests">
            {/* Filters */}
            <div className="mt-4 flex items-center gap-3">
              <Select
                value={filter}
                onValueChange={(v) => setFilter(v as FilterState)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All PRs</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="merged">Merged</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={authorFilter}
                onValueChange={setAuthorFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {filteredPRs.length} of {data.prs.length} PRs
              </span>
            </div>

            {/* PR list */}
            <div className="mt-4 space-y-3">
              {filteredPRs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                  <GitPullRequestArrow className="size-8 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No pull requests match the current filters
                  </p>
                </div>
              ) : (
                filteredPRs.map((pr) => (
                  <PRCard
                    key={pr.number}
                    pr={pr}
                    analysis={analyses[pr.number] ?? null}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Activity tab */}
          <TabsContent value="activity">
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Daily Activity (Last 14 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PRActivityChart prs={data.prs} days={14} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Most Changed Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileImpactChart prs={data.prs} limit={8} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights tab */}
          <TabsContent value="insights">
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {/* Quality distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Quality Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {qualityDistribution.length > 0 ? (
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie
                            data={qualityDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {qualityDistribution.map((entry) => (
                              <Cell
                                key={entry.name}
                                fill={entry.color}
                                fillOpacity={0.8}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [
                              `${value} PRs`,
                              '',
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {qualityDistribution.map((d) => (
                          <div
                            key={d.name}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="size-3 rounded-full"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="text-sm">
                              {d.name}: {d.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No analysis data yet
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Top contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    <Users className="mb-0.5 mr-1.5 inline size-4" />
                    Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contributorStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart
                        data={contributorStats}
                        margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="author"
                          tick={{
                            fontSize: 11,
                            fill: 'var(--color-muted-foreground)',
                          }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: 'var(--color-muted-foreground)',
                          }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value} PRs`,
                            'Count',
                          ]}
                        />
                        <Bar
                          dataKey="count"
                          fill="#6366f1"
                          fillOpacity={0.7}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No contributor data
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Key highlights */}
              {allHighlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      <Sparkles className="mb-0.5 mr-1.5 inline size-4" />
                      Key Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {allHighlights.slice(0, 8).map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Risk flags summary */}
              {Object.keys(topRiskFlags).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Risk Flags Across PRs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(topRiskFlags)
                        .sort(([, a], [, b]) => b - a)
                        .map(([flag, count]) => (
                          <div
                            key={flag}
                            className="flex items-center justify-between"
                          >
                            <Badge
                              variant="outline"
                              className="border-yellow-200 bg-yellow-50/50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400"
                            >
                              {flag}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {count} PRs
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
