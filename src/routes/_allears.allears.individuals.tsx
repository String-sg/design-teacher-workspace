import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
} from 'lucide-react'

import { AllearsHeader } from '@/components/allears/allears-header'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_allears/allears/individuals')({
  component: SelectIndividualsPage,
})

interface ClassItem {
  id: string
  label: string
  count: number
}

const CLASSES: ClassItem[] = [
  { id: 'sec1a', label: 'Sec 1A', count: 32 },
  { id: 'sec1b', label: 'Sec 1B', count: 31 },
  { id: 'sec2a', label: 'Sec 2A', count: 33 },
  { id: 'sec2b', label: 'Sec 2B', count: 30 },
  { id: 'sec3a', label: 'Sec 3A', count: 29 },
  { id: 'sec3b', label: 'Sec 3B', count: 32 },
  { id: 'sec4a', label: 'Sec 4A', count: 28 },
  { id: 'sec4b', label: 'Sec 4B', count: 31 },
]

// Pre-seeded for demo realism
const DEFAULT_SELECTED = new Set(['sec3a', 'sec3b'])

function SelectIndividualsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(DEFAULT_SELECTED)
  const [activeTab, setActiveTab] = useState<'class' | 'individual'>('class')

  const filteredClasses = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return q
      ? CLASSES.filter((c) => c.label.toLowerCase().includes(q))
      : CLASSES
  }, [searchQuery])

  function toggleClass(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedClasses = CLASSES.filter((c) => selected.has(c.id))
  const totalStudents = selectedClasses.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6fa]">
      <AllearsHeader activeTab="AUDIENCE" />

      <main className="flex flex-1 flex-col">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between px-8 pt-6">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Home className="h-4 w-4" />
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <Link
              to="/allears"
              className="hover:text-slate-700 hover:underline underline-offset-2"
            >
              Select audience type
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              to="/allears/respond"
              className="hover:text-slate-700 hover:underline underline-offset-2"
            >
              Choose who can respond
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">
              Select individuals or groups
            </span>
          </nav>

          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Saved</span>
          </div>
        </div>

        {/* Centered content */}
        <div className="flex flex-1 flex-col items-center px-8 pt-10">
          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-900">
            Select individuals or groups
          </h1>

          <div className="mt-8 w-full max-w-2xl space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for students or classes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Tab row */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('class')}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === 'class'
                    ? 'bg-blue-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                )}
              >
                By Class
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === 'individual'
                    ? 'bg-blue-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                )}
              >
                By Individual
              </button>
            </div>

            {/* Class list */}
            {activeTab === 'class' && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {filteredClasses.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">
                    No classes match your search.
                  </div>
                ) : (
                  filteredClasses.map((cls, i) => (
                    <label
                      key={cls.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50',
                        i < filteredClasses.length - 1 && 'border-b border-slate-100',
                        selected.has(cls.id) && 'bg-blue-50 hover:bg-blue-50',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(cls.id)}
                        onChange={() => toggleClass(cls.id)}
                        className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                      />
                      <span className="flex-1 text-sm font-medium text-slate-800">
                        {cls.label}
                      </span>
                      <span className="text-sm text-slate-400">
                        {cls.count} students
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}

            {/* Individual tab placeholder */}
            {activeTab === 'individual' && (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
                <p className="text-sm text-slate-400">
                  Individual search coming soon.
                </p>
              </div>
            )}

            {/* Selected summary */}
            {selected.size > 0 && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-800">
                Selected:{' '}
                <strong>
                  {selected.size} class{selected.size !== 1 ? 'es' : ''}
                </strong>
                {' · '}
                <strong>
                  {totalStudents} student
                  {totalStudents !== 1 ? 's' : ''} / custodians
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 pb-8 pt-6">
          <button
            type="button"
            onClick={() => navigate({ to: '/allears/respond' })}
            className="flex items-center gap-2 rounded-md border border-blue-800 px-6 py-2.5 text-sm font-semibold tracking-wide text-blue-800 hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4" />
            BACK
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: '/allears/questions' })}
            className="flex items-center gap-2 rounded-md bg-blue-800 px-6 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-blue-900"
          >
            NEXT: BUILD YOUR FORM
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}
