import { useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  Copy,
  Lock,
  MoreHorizontal,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import type { PGStatus } from '@/types/pg-announcement'
import type { AnnouncementFilters } from '@/components/comms/announcement-filter-bar'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { mockPGAnnouncements } from '@/data/mock-pg-announcements'
import { StatusBadge } from '@/components/comms/status-badge'
import { ReadRate } from '@/components/comms/read-rate'
import {
  EMPTY_ANNOUNCEMENT_FILTERS,
  AnnouncementFilterBar,
} from '@/components/comms/announcement-filter-bar'
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
import { EmptyState } from '@/components/empty-state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/announcements/')({
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
  const [filters, setFilters] = useState<AnnouncementFilters>(
    EMPTY_ANNOUNCEMENT_FILTERS,
  )

  useSetBreadcrumbs([{ label: 'Posts', href: '/announcements' }])
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    return mockPGAnnouncements
      .filter((a) => {
        // Response type filter
        if (filters.responseTypes.length > 0) {
          const effectiveType = a.responseType ?? 'view-only'
          if (!filters.responseTypes.includes(effectiveType)) return false
        }
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
      .sort((a, b) => {
        const dateA =
          getRelevantDate(a.status, a.postedAt, a.scheduledAt, a.createdAt) ??
          ''
        const dateB =
          getRelevantDate(b.status, b.postedAt, b.scheduledAt, b.createdAt) ??
          ''
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
  }, [searchQuery, filters])

  return (
    <div className="flex flex-col">
      {/* Tab buttons, Search & Filter */}
      <div className="mt-4 space-y-4">
        <div className="flex flex-col gap-4 px-6 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:w-[240px]"
                aria-label="Search announcements"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                className="h-9 bg-muted font-medium"
                render={<Link to="/announcements" />}
              >
                View-only posts
              </Button>
              <Button
                variant="ghost"
                className="h-9 text-muted-foreground"
                render={<Link to="/forms" />}
              >
                Posts with responses
              </Button>
            </div>
            <AnnouncementFilterBar filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto bg-white">
          {filtered.length === 0 ? (
            <EmptyState
              title="No announcements found"
              description="Try adjusting your search or filter, or create a new announcement."
            />
          ) : (
            <Table tableClassName="table-fixed w-full">
              <TableHeader className="border-b bg-white">
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="w-[500px] pl-6">Title</TableHead>
                  <TableHead className="w-[110px]">Date</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[90px]">Owner</TableHead>
                  <TableHead className="w-[150px]">Read / Response</TableHead>
                  <TableHead className="w-[48px] pr-2" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((announcement) => {
                  const totalCount = announcement.recipients.length
                  const readCount = announcement.recipients.filter(
                    (r) => r.readStatus === 'read',
                  ).length
                  const responseCount = announcement.recipients.filter(
                    (r) => r.respondedAt != null,
                  ).length
                  const yesCount = announcement.recipients.filter(
                    (r) => r.formResponse === 'yes',
                  ).length
                  const noCount = announcement.recipients.filter(
                    (r) => r.formResponse === 'no',
                  ).length
                  const hasResponseType =
                    announcement.responseType === 'acknowledge' ||
                    announcement.responseType === 'yes-no'
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
                          to: '/announcements/$id',
                          params: { id: announcement.id },
                        })
                      }
                    >
                      <TableCell className="overflow-hidden whitespace-normal pl-6">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-medium">
                                {announcement.title}
                              </span>
                              {announcement.responseType === 'acknowledge' && (
                                <span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-inset ring-blue-200">
                                  Acknowledge
                                </span>
                              )}
                              {announcement.responseType === 'yes-no' && (
                                <span className="shrink-0 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600 ring-1 ring-inset ring-violet-200">
                                  Yes/No
                                </span>
                              )}
                              {showUrgency && (
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                              )}
                            </div>
                            <div className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                              {announcement.description.replace(/<[^>]*>/g, '')}
                            </div>
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
                        <StatusBadge status={announcement.status} />
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
                      <TableCell className="pr-6">
                        {announcement.status !== 'posted' ? (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        ) : hasResponseType ? (
                          <div className="space-y-0.5">
                            <ReadRate
                              readCount={responseCount}
                              totalCount={totalCount}
                            />
                            {announcement.responseType === 'yes-no' &&
                              totalCount > 0 && (
                                <p className="text-[11px] text-muted-foreground">
                                  {yesCount} yes · {noCount} no
                                </p>
                              )}
                            {announcement.responseType === 'acknowledge' && (
                              <p className="text-[11px] text-muted-foreground">
                                Acknowledged
                              </p>
                            )}
                          </div>
                        ) : (
                          <ReadRate
                            readCount={readCount}
                            totalCount={totalCount}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        className="w-[48px] pr-2 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
