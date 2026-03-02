import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus, Search } from 'lucide-react'

import type { FormStatus } from '@/types/form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

function FormsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<FormStatus | ''>('')

  useSetBreadcrumbs([{ label: 'Forms', href: '/forms' }])

  const filteredForms = useMemo(() => {
    return mockForms.filter((form) => {
      if (selectedStatus && form.status !== selectedStatus) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          form.title.toLowerCase().includes(query) ||
          form.description.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [searchQuery, selectedStatus])

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
      <div className="shrink-0 space-y-6 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-semibold">Forms</h1>
            <p className="text-muted-foreground">
              Create and manage forms for parents and students
            </p>
          </div>
          <Button render={<Link to="/allears" />}>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Total Forms</div>
            <div className="text-2xl font-semibold">{metrics.totalForms}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-semibold">{metrics.activeForms}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Completion Rate</div>
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
        <div className="flex items-center gap-3 px-6 pb-4">
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
          <Select
            value={selectedStatus || 'all'}
            onValueChange={(val) =>
              setSelectedStatus(val === 'all' ? '' : (val as FormStatus))
            }
          >
            <SelectTrigger className="w-[140px]">
              {selectedStatus
                ? { active: 'Active', draft: 'Draft', closed: 'Closed' }[
                    selectedStatus
                  ]
                : 'All status'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Forms Table */}
      <div className="px-6">
        <Table>
          <TableHeader className="border-b bg-white">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="min-w-[250px]">Form Title</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[80px]">Sent</TableHead>
              <TableHead className="min-w-[100px]">Completed</TableHead>
              <TableHead className="min-w-[100px]">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="text-muted-foreground">
                    No forms found. Try adjusting your search or filter.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredForms.map((form) => (
                <TableRow key={form.id} className="cursor-pointer">
                  <TableCell>
                    <div className="font-medium">{form.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {form.description}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(form.status)}</TableCell>
                  <TableCell>{form.recipientCount}</TableCell>
                  <TableCell>{form.completedCount}</TableCell>
                  <TableCell>
                    {new Date(form.createdAt).toLocaleDateString('en-SG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
