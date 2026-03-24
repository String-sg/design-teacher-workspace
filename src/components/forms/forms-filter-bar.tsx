import { useState } from 'react'
import { Filter, RotateCcw } from 'lucide-react'
import type { FormOwnership, FormStatus } from '@/types/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface FormsFilters {
  statuses: Array<FormStatus>
  ownerships: Array<FormOwnership>
  dateFrom: string
  dateTo: string
}

export const EMPTY_FORMS_FILTERS: FormsFilters = {
  statuses: [],
  ownerships: [],
  dateFrom: '',
  dateTo: '',
}

function countActiveFilters(filters: FormsFilters): number {
  return (
    filters.statuses.length +
    filters.ownerships.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0)
  )
}

interface FormsFilterBarProps {
  filters: FormsFilters
  onChange: (filters: FormsFilters) => void
}

const STATUS_OPTIONS: Array<{ value: FormStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'closed', label: 'Closed' },
]

const OWNERSHIP_OPTIONS: Array<{ value: FormOwnership; label: string }> = [
  { value: 'mine', label: 'Created by me' },
  { value: 'shared', label: 'Shared with me' },
]

export function FormsFilterBar({ filters, onChange }: FormsFilterBarProps) {
  const [open, setOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

  function toggleStatus(status: FormStatus) {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    onChange({ ...filters, statuses: next })
  }

  function toggleOwnership(ownership: FormOwnership) {
    const next = filters.ownerships.includes(ownership)
      ? filters.ownerships.filter((o) => o !== ownership)
      : [...filters.ownerships, ownership]
    onChange({ ...filters, ownerships: next })
  }

  function handleReset() {
    onChange(EMPTY_FORMS_FILTERS)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-9 gap-2 aria-expanded:bg-white"
          />
        }
      >
        <Filter className="h-4 w-4" />
        Filter
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[460px] gap-0 p-0" align="start">
        {/* Header */}
        <div className="px-5 pb-3 pt-4">
          <h3 className="text-sm font-semibold">Show records</h3>
        </div>

        {/* Filter rows */}
        <div className="space-y-3 px-5 pb-4">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm font-medium">Status</span>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleStatus(opt.value)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                    filters.statuses.includes(opt.value)
                      ? 'border-primary bg-twblue-2 text-twblue-9'
                      : 'border-border bg-card text-foreground hover:border-primary hover:text-primary',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ownership */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm font-medium">
              Ownership
            </span>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {OWNERSHIP_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOwnership(opt.value)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                    filters.ownerships.includes(opt.value)
                      ? 'border-primary bg-twblue-2 text-twblue-9'
                      : 'border-border bg-card text-foreground hover:border-primary hover:text-primary',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm font-medium">Date</span>
            <div className="flex flex-1 items-center gap-1.5">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  onChange({ ...filters, dateFrom: e.target.value })
                }
                className="h-9 flex-1 rounded-[14px] border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
              <span className="shrink-0 text-sm text-muted-foreground">–</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  onChange({ ...filters, dateTo: e.target.value })
                }
                className="h-9 flex-1 rounded-[14px] border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={activeCount === 0}
            className="gap-2 text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
