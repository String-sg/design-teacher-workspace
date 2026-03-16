import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Lock, Plus, Search, Users } from 'lucide-react'

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
import { ResponseTypePicker } from '@/components/forms/response-type-picker'
import { PGReadRate } from '@/components/parents-gateway/pg-read-rate'
import { mockForms } from '@/data/mock-forms'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/forms/')({
  component: FormsPage,
})

function getStatusBadge(status: FormStatus) {
  const config = {
    active: {
      label: 'Active',
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

function getTargetClasses(classes: string[]): string {
  if (classes.length === 0) return '—'
  if (classes.length <= 3) return classes.join(', ')
  return `${classes.slice(0, 3).join(', ')} +${classes.length - 3}`
}

function FormsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FormsFilters>(EMPTY_FORMS_FILTERS)
  const [showPicker, setShowPicker] = useState(false)

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
  }, [searchQuery, filters])

  const metrics = useMemo(() => {
    const totalForms = mockForms.length
    const activeForms = mockForms.filter((f) => f.status === 'active').length
    const formsWithRecipients = mockForms.filter((f) => f.recipientCount > 0)
    const totalSent = formsWithRecipients.reduce(
      (sum, f) => sum + f.recipientCount,
      0,
    )
    const totalCompleted = formsWithRecipients.reduce(
      (sum, f) => sum + f.completedCount,
      0,
    )
    const completionRate =
      totalSent > 0 ? Math.round((totalCompleted / totalSent) * 100) : 0
    const pendingResponses = totalSent - totalCompleted

    return { totalForms, activeForms, completionRate, pendingResponses }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h1 className="text-2xl font-semibold">Forms</h1>
          <p className="text-muted-foreground">
            Create and manage forms for parents and students
          </p>
        </div>
        <Button onClick={() => setShowPicker(true)}>
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
          <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Total Forms</div>
              <div className="text-2xl font-semibold">{metrics.totalForms}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-semibold">
                {metrics.activeForms}
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
              <div className="text-2xl font-semibold">
                {metrics.completionRate}%
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">
                Pending Responses
              </div>
              <div className="text-2xl font-semibold">
                {metrics.pendingResponses}
              </div>
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
                className="w-full pl-9 md:w-[200px]"
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
                    <TableHead className="pl-6">Form Title</TableHead>
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[90px]">Owner</TableHead>
                    <TableHead className="w-[130px]">To Parents Of</TableHead>
                    <TableHead className="w-[150px] pr-6">Responded</TableHead>
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
                          form.formType === 'allears'
                            ? navigate({ to: '/allears/responses' })
                            : navigate({ to: '/forms/$id', params: { id: form.id } })
                        }
                      >
                        <TableCell className="overflow-hidden whitespace-normal pl-6">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="truncate">{form.title}</span>
                            {form.formType === 'allears' && (
                              <span className="inline-flex shrink-0 items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                                AllEars
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                            {form.description}
                          </div>
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
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {isShared ? (
                              <>
                                <Users className="h-3.5 w-3.5 shrink-0" />
                                <span>Shared</span>
                                <Lock className="h-3 w-3 shrink-0 text-slate-400" />
                              </>
                            ) : (
                              <span>Mine</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-0 text-sm text-muted-foreground">
                          {getTargetClasses(form.targetClasses)}
                        </TableCell>
                        <TableCell className="pr-6">
                          <PGReadRate
                            readCount={form.completedCount}
                            totalCount={form.recipientCount}
                          />
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

      <ResponseTypePicker
        open={showPicker}
        onOpenChange={setShowPicker}
        onSelect={(type) => {
          if (type === 'allears') {
            navigate({ to: '/allears/respond' })
          } else {
            navigate({ to: '/forms/new', search: { type } })
          }
        }}
      />
    </div>
  )
}
