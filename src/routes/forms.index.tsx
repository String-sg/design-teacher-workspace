import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, MoreHorizontal, Circle } from 'lucide-react'
import { mockForms } from '@/data/mock-forms'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import type { FormStatus } from '@/types/form'

export const Route = createFileRoute('/forms/')({
  component: FormsPage,
})

function statusLabel(status: FormStatus) {
  const map: Record<FormStatus, { label: string; color: string }> = {
    active: { label: 'Active', color: 'text-green-600' },
    draft: { label: 'Draft', color: 'text-slate-400' },
    closed: { label: 'Closed', color: 'text-slate-400' },
  }
  return map[status]
}

function FormsPage() {
  useSetBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Parent Forms', href: '/forms' },
  ])

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Parent Forms</h1>
          <p className="text-sm text-muted-foreground">
            Create and track forms sent to parents via Parents Gateway
          </p>
        </div>
        <Link
          to="/forms/new"
          className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: '#1a3a5c' }}
        >
          <Plus className="size-4" />
          New Parent Form
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#1a3a5c' }} className="text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Form Title</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Sent To</th>
              <th className="px-4 py-3 text-left font-medium">Responses</th>
              <th className="px-4 py-3 text-left font-medium">Last Modified</th>
              <th className="px-4 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockForms.map((form) => {
              const s = statusLabel(form.status)
              return (
                <tr key={form.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <Link
                      to="/forms/$id"
                      params={{ id: form.id }}
                      className="font-medium text-blue-700 hover:underline"
                    >
                      {form.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1.5 ${s.color}`}>
                      <Circle className="size-2 fill-current" />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {form.groups.length > 0
                      ? form.groups.map((g) => g.name).join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-4">
                    {form.totalRecipients > 0
                      ? `${form.responseCount} / ${form.totalRecipients}`
                      : '—'}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {form.lastModified.toLocaleDateString('en-SG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <button className="rounded p-1 hover:bg-slate-100">
                      <MoreHorizontal className="size-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}
