import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Lock, Plus, Search, Users } from 'lucide-react'
import type { PGStatus } from '@/types/pg-announcement'
import type { PGFilters } from '@/components/parents-gateway/pg-filter-bar'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { mockPGAnnouncements } from '@/data/mock-pg-announcements'
import { PGStatusBadge } from '@/components/parents-gateway/pg-status-badge'
import { PGReadRate } from '@/components/parents-gateway/pg-read-rate'
import {
  EMPTY_PG_FILTERS,
  PGFilterBar,
} from '@/components/parents-gateway/pg-filter-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'

export const Route = createFileRoute('/parents-gateway/')({
  component: ParentsGatewayPage,
})

function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function isLowReadRate(
  postedAt: string | undefined,
  readCount: number,
  total: number,
): boolean {
  if (!postedAt || total === 0) return false
  const hoursElapsed = (Date.now() - new Date(postedAt).getTime()) / 3600000
  return hoursElapsed >= 48 && readCount / total < 0.5
}

function getUniqueClasses(recipients: Array<{ classLabel: string }>): string {
  const classes = [...new Set(recipients.map((r) => r.classLabel))].sort()
  if (classes.length === 0) return '—'
  if (classes.length <= 3) return classes.join(', ')
  return `${classes.slice(0, 3).join(', ')} +${classes.length - 3}`
}

function getRelevantDate(
  status: PGStatus,
  postedAt?: string,
  scheduledAt?: string,
  createdAt?: string,
): string | undefined {
  if (status === 'posted') return postedAt
  if (status === 'scheduled') return scheduledAt
  return createdAt
}

function ParentsGatewayPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<PGFilters>(EMPTY_PG_FILTERS)

  useSetBreadcrumbs([{ label: 'Announcement', href: '/parents-gateway' }])
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    return mockPGAnnouncements.filter((a) => {
      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(a.status))
        return false

      // Ownership filter
      if (
        filters.ownerships.length > 0 &&
        !filters.ownerships.includes(a.ownership)
      )
        return false

      // Date range filter — compare against the relevant date for this status
      const relevantDate = getRelevantDate(
        a.status,
        a.postedAt,
        a.scheduledAt,
        a.createdAt,
      )
      if (filters.dateFrom && relevantDate) {
        if (new Date(relevantDate) < new Date(filters.dateFrom)) return false
      }
      if (filters.dateTo && relevantDate) {
        // dateTo is inclusive — compare to end of day
        const toEnd = new Date(filters.dateTo)
        toEnd.setHours(23, 59, 59, 999)
        if (new Date(relevantDate) > toEnd) return false
      }

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [searchQuery, filters])

  const metrics = useMemo(() => {
    const total = mockPGAnnouncements.length
    const drafts = mockPGAnnouncements.filter(
      (a) => a.status === 'draft',
    ).length
    const posted = mockPGAnnouncements.filter(
      (a) => a.status === 'posted',
    ).length
    const scheduled = mockPGAnnouncements.filter(
      (a) => a.status === 'scheduled',
    ).length
    const postedAnnouncements = mockPGAnnouncements.filter(
      (a) => a.status === 'posted' && a.recipients.length > 0,
    )
    const totalSent = postedAnnouncements.reduce(
      (s, a) => s + a.recipients.length,
      0,
    )
    const totalRead = postedAnnouncements.reduce(
      (s, a) => s + a.recipients.filter((r) => r.readStatus === 'read').length,
      0,
    )
    const avgReadRate =
      totalSent > 0 ? Math.round((totalRead / totalSent) * 100) : 0
    return { total, drafts, posted, scheduled, avgReadRate }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white p-1.5">
            <img
              src="/logos/parentsgateway.webp"
              alt="Parents Gateway"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Announcement</h1>
            <p className="text-muted-foreground">
              Send announcements to parents and track who has read them
            </p>
          </div>
        </div>
        <Button render={<Link to="/parents-gateway/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <Tabs defaultValue="for-parents" className="mt-6 w-full">
        <TabsList variant="line" className="px-6">
          <TabsTrigger value="for-parents">For Parents</TabsTrigger>
        </TabsList>
        <TabsContent value="for-parents" className="space-y-6 pt-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-5">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-semibold">{metrics.total}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Draft</div>
              <div className="text-2xl font-semibold">{metrics.drafts}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Posted</div>
              <div className="text-2xl font-semibold">{metrics.posted}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Scheduled</div>
              <div className="text-2xl font-semibold">{metrics.scheduled}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Avg Read Rate</div>
              <div className="text-2xl font-semibold">{metrics.avgReadRate}%</div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 px-6 pb-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search announcements"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:w-[240px]"
                aria-label="Search announcements"
              />
            </div>
            <PGFilterBar filters={filters} onChange={setFilters} />
          </div>

          {/* Table */}
          <div className="max-w-full overflow-x-auto bg-white">
        {filtered.length === 0 ? (
          <EmptyState
            title="No announcements found"
            description="Try adjusting your search or filter, or create a new announcement."
          />
        ) : (
          <Table className="table-fixed w-full">
            <TableHeader className="border-b bg-white">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[40%] pl-6">Title</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[90px]">Owner</TableHead>
                <TableHead className="w-[130px]">To Parents Of</TableHead>
                <TableHead className="w-[150px] pr-6">Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((announcement) => {
                const totalCount = announcement.recipients.length
                const readCount = announcement.recipients.filter(
                  (r) => r.readStatus === 'read',
                ).length
                const showUrgency = isLowReadRate(
                  announcement.postedAt,
                  readCount,
                  totalCount,
                )
                const relevantDate = getRelevantDate(
                  announcement.status,
                  announcement.postedAt,
                  announcement.scheduledAt,
                  announcement.createdAt,
                )
                const isViewer = announcement.role === 'viewer'
                const isShared = announcement.ownership === 'shared'

                return (
                  <TableRow
                    key={announcement.id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: '/parents-gateway/$id',
                        params: { id: announcement.id },
                      })
                    }
                  >
                    <TableCell className="pl-6 overflow-hidden whitespace-normal">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium">
                            {announcement.title}
                          </span>
                          {showUrgency && (
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          )}
                        </div>
                        <div className="mt-0.5 truncate text-sm text-muted-foreground">
                          {announcement.description.replace(/<[^>]*>/g, '')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span
                        className={
                          announcement.status === 'scheduled'
                            ? 'text-amber-600'
                            : undefined
                        }
                      >
                        {formatDate(relevantDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <PGStatusBadge status={announcement.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {isShared ? (
                          <>
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <span>Shared</span>
                            {isViewer && (
                              <Lock className="h-3 w-3 shrink-0 text-slate-400" />
                            )}
                          </>
                        ) : (
                          <span>Mine</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {announcement.status === 'draft' ||
                      announcement.status === 'scheduled'
                        ? '—'
                        : getUniqueClasses(announcement.recipients)}
                    </TableCell>
                    <TableCell className="pr-6">
                      {announcement.status === 'posted' ? (
                        <PGReadRate
                          readCount={readCount}
                          totalCount={totalCount}
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
