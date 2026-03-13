import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { PGOwnership, PGStatus } from '@/types/pg-announcement'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface PGFilters {
  statuses: Array<PGStatus>
  ownerships: Array<PGOwnership>
  dateFrom: string
  dateTo: string
}

export const EMPTY_PG_FILTERS: PGFilters = {
  statuses: [],
  ownerships: [],
  dateFrom: '',
  dateTo: '',
}

function countActiveFilters(filters: PGFilters): number {
  return (
    filters.statuses.length +
    filters.ownerships.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0)
  )
}

interface PGFilterBarProps {
  filters: PGFilters
  onChange: (filters: PGFilters) => void
}

const STATUS_OPTIONS: Array<{ value: PGStatus; label: string }> = [
  { value: 'posted', label: 'Posted' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
]

const OWNERSHIP_OPTIONS: Array<{ value: PGOwnership; label: string }> = [
  { value: 'mine', label: 'Created by me' },
  { value: 'shared', label: 'Shared with me' },
]

export function PGFilterBar({ filters, onChange }: PGFilterBarProps) {
  const [open, setOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

  function toggleStatus(status: PGStatus) {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    onChange({ ...filters, statuses: next })
  }

  function toggleOwnership(ownership: PGOwnership) {
    const next = filters.ownerships.includes(ownership)
      ? filters.ownerships.filter((o) => o !== ownership)
      : [...filters.ownerships, ownership]
    onChange({ ...filters, ownerships: next })
  }

  function clearAll() {
    onChange(EMPTY_PG_FILTERS)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-72 gap-5">
        {/* Status */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleStatus(opt.value)}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  filters.statuses.includes(opt.value)
                    ? 'border-primary bg-twblue-2 text-twblue-9'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ownership */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ownership
          </p>
          <div className="flex flex-wrap gap-1.5">
            {OWNERSHIP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOwnership(opt.value)}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  filters.ownerships.includes(opt.value)
                    ? 'border-primary bg-twblue-2 text-twblue-9'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Date (posted / scheduled)
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="w-10 shrink-0 text-xs text-muted-foreground">
                From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  onChange({ ...filters, dateFrom: e.target.value })
                }
                className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-10 shrink-0 text-xs text-muted-foreground">
                To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  onChange({ ...filters, dateTo: e.target.value })
                }
                className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={clearAll}
            disabled={activeCount === 0}
          >
            Clear all
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
