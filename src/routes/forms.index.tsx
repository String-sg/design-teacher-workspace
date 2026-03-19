import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search, Users } from 'lucide-react'

import type { FormSource, FormStatus } from '@/types/form'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import {
  EMPTY_FORMS_FILTERS,
  FormsFilterBar,
  type FormsFilters,
} from '@/components/forms/forms-filter-bar'
import { ReadRate } from '@/components/comms/read-rate'
import { mockForms } from '@/data/mock-forms'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/forms/')({
  component: FormsPage,
})

function getStatusBadge(status: FormStatus) {
  const config = {
    active: {
      label: 'Open',
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
    },
    draft: {
      label: 'Draft',
      className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    },
    closed: {
      label: 'Closed',
      className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    },
  }
  const { label, className } = config[status]
  return <Badge className={className}>{label}</Badge>
}

type SourceFilter = 'all' | FormSource

function FormsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FormsFilters>(EMPTY_FORMS_FILTERS)
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  useSetBreadcrumbs([
    { label: 'Announcements & Forms', href: '/announcements' },
  ])

  const filteredForms = useMemo(() => {
    return mockForms
      .filter((form) => {
        // Source quick filter
        if (sourceFilter !== 'all') {
          const formSource = form.source ?? 'custom'
          if (formSource !== sourceFilter) return false
        }

        if (
          filters.statuses.length > 0 &&
          !filters.statuses.includes(form.status)
        )
          return false

        if (
          filters.ownerships.length > 0 &&
          !filters.ownerships.includes(form.ownership)
        )
          return false

        if (filters.dateFrom) {
          if (new Date(form.createdAt) < new Date(filters.dateFrom))
            return false
        }
        if (filters.dateTo) {
          const end = new Date(filters.dateTo)
          end.setHours(23, 59, 59, 999)
          if (new Date(form.createdAt) > end) return false
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            form.title.toLowerCase().includes(query) ||
            form.description.toLowerCase().includes(query)
          )
        }
        return true
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [searchQuery, filters, sourceFilter])

  const sourceCounts = useMemo(() => {
    const custom = mockForms.filter(
      (f) => (f.source ?? 'custom') === 'custom',
    ).length
    const announcement = mockForms.filter(
      (f) => f.source === 'announcement-response',
    ).length
    return { all: mockForms.length, custom, announcement }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Quick filter, Search & Filter */}
      <div className="mt-4 flex items-center gap-3 px-6">
        <Tabs
          value={sourceFilter}
          onValueChange={(val) => setSourceFilter(val as SourceFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All ({sourceCounts.all})</TabsTrigger>
            <TabsTrigger value="custom">
              Custom Forms ({sourceCounts.custom})
            </TabsTrigger>
            <TabsTrigger value="announcement-response">
              Announcement Responses ({sourceCounts.announcement})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search forms"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 md:w-[240px]"
            aria-label="Search forms"
          />
        </div>
        <FormsFilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Forms Table */}
      <div className="mt-4 max-w-full overflow-x-auto bg-white">
        {filteredForms.length === 0 ? (
          <EmptyState
            title="No forms found"
            description="Try adjusting your search or filter, or create a new form."
          />
        ) : (
          <Table tableClassName="table-fixed w-full">
            <TableHeader className="border-b bg-white">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[40%] pl-6">Form Title</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[90px]">Owner</TableHead>
                <TableHead className="w-[150px] pr-6">Responses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => {
                const isShared = form.ownership === 'shared'
                return (
                  <TableRow
                    key={form.id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: '/forms/$id',
                        params: { id: form.id },
                      })
                    }
                  >
                    <TableCell className="overflow-hidden whitespace-normal pl-6">
                      <div className="min-w-0">
                        <span className="font-medium">{form.title}</span>
                        <div className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          {form.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(form.createdAt).toLocaleDateString('en-SG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {isShared ? (
                          <>
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <span>Shared</span>
                          </>
                        ) : (
                          <span>Mine</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      {form.status === 'draft' ? (
                        <span className="text-sm text-muted-foreground">—</span>
                      ) : (
                        <ReadRate
                          readCount={form.completedCount}
                          totalCount={form.recipientCount}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
