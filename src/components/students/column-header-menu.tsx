import { useState } from 'react'
import { ArrowDown, ArrowUp, Check, ChevronDown, Filter, X } from 'lucide-react'

import type { FilterField, SortConfig, SortDirection } from '@/types/student'
import type { ColumnConfig } from './column-visibility-popover'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TableHead } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ColumnHeaderMenuProps {
  column: ColumnConfig
  currentSort: SortConfig | null
  activeFilterFields: Set<FilterField>
  onSort: (field: string, direction: SortDirection) => void
  onClearSort: () => void
  onAddQuickFilter: (field: FilterField) => void
  onClearFilter: (field: FilterField) => void
  className?: string
  isSticky?: boolean
  stickyLeft?: string
  /** Show shadow on right edge (for last sticky column) */
  showStickyShadow?: boolean
}

export function ColumnHeaderMenu({
  column,
  currentSort,
  activeFilterFields,
  onSort,
  onClearSort,
  onAddQuickFilter,
  onClearFilter,
  className,
  isSticky,
  stickyLeft,
  showStickyShadow,
}: ColumnHeaderMenuProps) {
  const [open, setOpen] = useState(false)

  const isSortedBy = currentSort?.field === column.id
  const sortDirection = isSortedBy ? currentSort.direction : null
  const hasActiveFilter =
    column.filterField && activeFilterFields.has(column.filterField)

  // All column headers need border shadows (thead has none). Last sticky column also gets drop shadow.
  const stickyShadow = showStickyShadow
    ? 'shadow-[inset_0_1px_0_var(--color-border),inset_0_-1px_0_var(--color-border),2px_0_5px_-2px_rgba(0,0,0,0.1)]'
    : 'shadow-[inset_0_1px_0_var(--color-border),inset_0_-1px_0_var(--color-border)]'

  // Non-interactive columns render as plain TableHead
  if (!column.sortable && !column.filterable) {
    return (
      <TableHead
        className={cn(
          className,
          isSticky && 'sticky z-20 bg-white',
          stickyShadow,
        )}
        style={stickyLeft ? { left: stickyLeft } : undefined}
      >
        {column.label}
      </TableHead>
    )
  }

  return (
    <TableHead
      className={cn(
        className,
        isSticky && 'sticky z-20 bg-white',
        stickyShadow,
      )}
      style={stickyLeft ? { left: stickyLeft } : undefined}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      'flex items-center gap-1 rounded-md px-2 py-1 -ml-2 transition-colors whitespace-nowrap',
                      'hover:bg-accent hover:text-accent-foreground cursor-pointer',
                      (isSortedBy || hasActiveFilter) && 'text-primary',
                    )}
                  >
                    <span>{column.label}</span>
                    <span className="shrink-0">
                      {isSortedBy ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : hasActiveFilter ? (
                        <Filter className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  </button>
                }
              />
            }
          />
          <TooltipContent>{column.label}</TooltipContent>
        </Tooltip>
        <PopoverContent align="start" className="w-48 gap-1 p-1">
          {/* Sort options */}
          {column.sortable && (
            <>
              <button
                type="button"
                onClick={() => {
                  onSort(column.id, 'asc')
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
                  sortDirection === 'asc' && 'bg-accent',
                )}
              >
                <ArrowUp className="h-4 w-4" />
                Sort ascending
                {sortDirection === 'asc' && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSort(column.id, 'desc')
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
                  sortDirection === 'desc' && 'bg-accent',
                )}
              >
                <ArrowDown className="h-4 w-4" />
                Sort descending
                {sortDirection === 'desc' && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </button>
              {isSortedBy && (
                <button
                  type="button"
                  onClick={() => {
                    onClearSort()
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                  Clear sort
                </button>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>
    </TableHead>
  )
}
