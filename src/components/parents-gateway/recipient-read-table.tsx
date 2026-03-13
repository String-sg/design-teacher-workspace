import { useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  Columns2,
  Download,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { PGRecipient } from '@/types/pg-announcement'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecipientReadTableProps {
  recipients: Array<PGRecipient>
  announcementTitle: string
}

// Parent/Guardian removed; pgStatus is the last toggleable column
type ColumnKey = 'indexNo' | 'readAt' | 'readBy' | 'pgStatus'

const COLUMN_LABELS: Record<ColumnKey, string> = {
  indexNo: 'Index No.',
  readAt: 'Read At',
  readBy: 'Parent / Guardian',
  pgStatus: 'PG Status',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatReadAt(iso: string): string {
  return new Date(iso).toLocaleString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function exportCSV(rows: Array<PGRecipient>, title: string) {
  const headers = [
    'Student',
    'Index No.',
    'Class',
    'PG Status',
    'Read Status',
    'Read At',
    'Parent / Guardian',
    'Relationship',
    'Contact',
  ]
  const data = rows.map((r) => [
    r.studentName,
    r.indexNo ?? '',
    r.classLabel,
    r.pgStatus === 'onboarded' ? 'Onboarded' : 'Not Onboarded',
    r.readStatus === 'read' ? 'Read' : 'Unread',
    r.readAt ? formatReadAt(r.readAt) : '',
    r.parentName,
    r.parentRelationship ?? '',
    r.parentContact ?? '',
  ])
  const csv = [headers, ...data]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
    )
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-read-status.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RecipientReadTable({
  recipients,
  announcementTitle,
}: RecipientReadTableProps) {
  // Filter state
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>(
    'all',
  )
  const [pgFilter, setPgFilter] = useState<
    'all' | 'onboarded' | 'not_onboarded'
  >('all')

  // Column visibility — all on by default
  const [visibleCols, setVisibleCols] = useState<Set<ColumnKey>>(
    new Set(['indexNo', 'readAt', 'readBy', 'pgStatus']),
  )

  // Derived: unique class list for filter popover
  const uniqueClasses = useMemo(
    () => [...new Set(recipients.map((r) => r.classLabel))].sort(),
    [recipients],
  )

  // Filtered + sorted rows
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return [...recipients]
      .filter((r) => {
        if (
          q &&
          !r.studentName.toLowerCase().includes(q) &&
          !r.parentName.toLowerCase().includes(q) &&
          !r.classLabel.toLowerCase().includes(q)
        )
          return false
        if (classFilter !== 'all' && r.classLabel !== classFilter) return false
        if (statusFilter !== 'all' && r.readStatus !== statusFilter)
          return false
        if (pgFilter !== 'all' && r.pgStatus !== pgFilter) return false
        return true
      })
      .sort((a, b) => {
        // Unread first, then alphabetical by name
        if (a.readStatus !== b.readStatus)
          return a.readStatus === 'unread' ? -1 : 1
        return a.studentName.localeCompare(b.studentName)
      })
  }, [recipients, search, classFilter, statusFilter, pgFilter])

  function toggleCol(col: ColumnKey) {
    setVisibleCols((prev) => {
      const next = new Set(prev)
      if (next.has(col)) next.delete(col)
      else next.add(col)
      return next
    })
  }

  function show(col: ColumnKey) {
    return visibleCols.has(col)
  }

  const activeFilterCount = [
    classFilter !== 'all',
    statusFilter !== 'all',
    pgFilter !== 'all',
  ].filter(Boolean).length

  const activeFilters = [
    classFilter !== 'all' && classFilter,
    statusFilter !== 'all' && (statusFilter === 'read' ? 'Read' : 'Unread'),
    pgFilter !== 'all' &&
      (pgFilter === 'onboarded' ? 'Onboarded' : 'Not Onboarded'),
  ].filter(Boolean) as Array<string>

  function resetFilters() {
    setClassFilter('all')
    setStatusFilter('all')
    setPgFilter('all')
  }

  return (
    <div className="space-y-3">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student or parent…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* ── Consolidated Filter popover ── */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'gap-1.5',
                activeFilterCount > 0 && 'border-twblue-9 text-twblue-9',
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-twblue-9 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-0">
            <div className="px-3 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Filters
              </p>
            </div>

            {/* Class */}
            <div className="p-3">
              <p className="mb-2 text-xs font-medium">Class</p>
              <div className="space-y-0.5">
                {(['all', ...uniqueClasses] as const).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassFilter(cls)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-slate-100"
                  >
                    <span
                      className={cn(
                        'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                        classFilter === cls
                          ? 'border-twblue-9 bg-twblue-9'
                          : 'border-slate-300',
                      )}
                    >
                      {classFilter === cls && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    {cls === 'all' ? 'All classes' : `Class ${cls}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Read Status */}
            <div className="border-t p-3">
              <p className="mb-2 text-xs font-medium">Read status</p>
              <div className="space-y-0.5">
                {(
                  [
                    ['all', 'All'],
                    ['read', 'Read'],
                    ['unread', 'Unread'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStatusFilter(val)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-slate-100"
                  >
                    <span
                      className={cn(
                        'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                        statusFilter === val
                          ? 'border-twblue-9 bg-twblue-9'
                          : 'border-slate-300',
                      )}
                    >
                      {statusFilter === val && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* PG Status */}
            <div className="border-t p-3">
              <p className="mb-2 text-xs font-medium">PG status</p>
              <div className="space-y-0.5">
                {(
                  [
                    ['all', 'All'],
                    ['onboarded', 'Onboarded'],
                    ['not_onboarded', 'Not Onboarded'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPgFilter(val)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-slate-100"
                  >
                    <span
                      className={cn(
                        'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                        pgFilter === val
                          ? 'border-twblue-9 bg-twblue-9'
                          : 'border-slate-300',
                      )}
                    >
                      {pgFilter === val && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <div className="border-t p-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full rounded-md px-2 py-1.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Column visibility */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Columns2 className="h-3.5 w-3.5" />
              Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-2">
            <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Show / hide columns
            </p>
            {(Object.keys(COLUMN_LABELS) as Array<ColumnKey>).map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => toggleCol(col)}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-slate-100"
              >
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    show(col)
                      ? 'border-twblue-9 bg-twblue-9 text-white'
                      : 'border-input',
                  )}
                >
                  {show(col) && <Check className="h-2.5 w-2.5" />}
                </span>
                {COLUMN_LABELS[col]}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => exportCSV(filtered, announcementTitle)}
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Filtered by:</span>
          {classFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-twblue-2 px-2.5 py-0.5 text-xs font-medium text-twblue-9">
              Class {classFilter}
              <button
                type="button"
                onClick={() => setClassFilter('all')}
                className="ml-0.5 hover:text-twblue-12"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-twblue-2 px-2.5 py-0.5 text-xs font-medium text-twblue-9">
              {statusFilter === 'read' ? 'Read' : 'Unread'}
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className="ml-0.5 hover:text-twblue-12"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {pgFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-twblue-2 px-2.5 py-0.5 text-xs font-medium text-twblue-9">
              {pgFilter === 'onboarded' ? 'Onboarded' : 'Not Onboarded'}
              <button
                type="button"
                onClick={() => setPgFilter('all')}
                className="ml-0.5 hover:text-twblue-12"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length === recipients.length
          ? `${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}`
          : `${filtered.length} of ${recipients.length} recipients`}
      </p>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Student</TableHead>
              {show('indexNo') && (
                <TableHead className="w-20">Index No.</TableHead>
              )}
              <TableHead className="w-16">Class</TableHead>
              <TableHead>Read Status</TableHead>
              {show('readAt') && <TableHead>Read At</TableHead>}
              {show('readBy') && <TableHead>Parent / Guardian</TableHead>}
              {show('pgStatus') && <TableHead>PG Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={
                    4 +
                    [
                      show('indexNo'),
                      show('readAt'),
                      show('readBy'),
                      show('pgStatus'),
                    ].filter(Boolean).length
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  No recipients found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.studentId}>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  {show('indexNo') && (
                    <TableCell className="text-muted-foreground">
                      {r.indexNo ?? '—'}
                    </TableCell>
                  )}
                  <TableCell className="text-muted-foreground">
                    {r.classLabel}
                  </TableCell>
                  <TableCell>
                    {r.readStatus === 'read' ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        Unread
                      </span>
                    )}
                  </TableCell>
                  {show('readAt') && (
                    <TableCell className="text-sm text-muted-foreground">
                      {r.readAt ? formatReadAt(r.readAt) : '—'}
                    </TableCell>
                  )}
                  {show('readBy') && (
                    <TableCell className="text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={
                            r.readStatus === 'read'
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {r.parentRelationship
                            ? `${r.parentRelationship} · ${r.parentName}`
                            : r.parentName}
                        </span>
                        {r.parentContact && (
                          <span className="text-xs text-muted-foreground">
                            {r.parentContact}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {show('pgStatus') && (
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                          r.pgStatus === 'onboarded'
                            ? 'bg-twblue-2 text-twblue-9'
                            : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {r.pgStatus === 'onboarded'
                          ? 'Onboarded'
                          : 'Not Onboarded'}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
