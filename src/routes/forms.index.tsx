import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Search, Users } from 'lucide-react'

import type { FormStatus } from '@/types/form'
import { Badge } from '@/components/ui/badge'
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
import {
  EMPTY_FORMS_FILTERS,
  FormsFilterBar,
  type FormsFilters,
} from '@/components/forms/forms-filter-bar'
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

function FormsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FormsFilters>(EMPTY_FORMS_FILTERS)
  useSetBreadcrumbs([{ label: 'Forms', href: '/forms' }])

  const filteredForms = useMemo(() => {
    return mockForms.filter((form) => {
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
        if (new Date(form.createdAt) < new Date(filters.dateFrom)) return false
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
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [searchQuery, filters])

  const metrics = useMemo(() => {
    const total = mockForms.length
    const active = mockForms.filter((f) => f.status === 'active').length
    const draft = mockForms.filter((f) => f.status === 'draft').length
    const closed = mockForms.filter((f) => f.status === 'closed').length
    return { total, active, draft, closed }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h1 className="text-2xl font-semibold">Forms</h1>
          <p className="text-muted-foreground">
            Create and manage forms for parents
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/allears/respond' })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>

      <Tabs defaultValue="for-parents" className="mt-6 w-full">
        <TabsList variant="line" className="px-6">
          <TabsTrigger value="for-parents">For Parents</TabsTrigger>
        </TabsList>
        <TabsContent value="for-parents" className="space-y-6 pt-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total</div>
              <div className="text-3xl font-semibold">{metrics.total}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Open</div>
              <div className="text-3xl font-semibold">{metrics.active}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Draft</div>
              <div className="text-3xl font-semibold">{metrics.draft}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Closed</div>
              <div className="text-3xl font-semibold">{metrics.closed}</div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 px-6 pb-2">
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
          <div className="max-w-full overflow-x-auto bg-white">
            {filteredForms.length === 0 ? (
              <EmptyState
                title="No forms found"
                description="Try adjusting your search or filter, or create a new form."
              />
            ) : (
              <Table tableClassName="table-fixed w-full">
                <TableHeader className="border-b bg-white">
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="w-[500px] pl-6">Form Title</TableHead>
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[90px] pr-6">Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => {
                    const isShared = form.ownership === 'shared'
                    return (
                      <TableRow
                        key={form.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() =>
                          navigate({ to: '/allears/responses' })
                        }
                      >
                        <TableCell className="pl-6">
                          <span className="font-medium">{form.title}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(form.createdAt).toLocaleDateString(
                            'en-SG',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(form.status)}</TableCell>
                        <TableCell className="pr-6">
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
