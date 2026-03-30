import { ArrowDown, ArrowUp, Check, ChevronDown, Filter, Settings2, X } from 'lucide-react';
import { useState } from 'react';

import type { FilterField, SortConfig, SortDirection } from '~/apps/pg/types/student';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/components/ui/popover';
import { TableHead } from '~/shared/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/shared/components/ui/tooltip';
import { cn } from '~/shared/lib/utils';

import type { ColumnConfig } from './column-visibility-popover';

interface ColumnHeaderMenuProps {
  column: ColumnConfig;
  currentSort: SortConfig | null;
  activeFilterFields: Set<FilterField>;
  onSort: (field: string, direction: SortDirection) => void;
  onClearSort: () => void;
  onAddQuickFilter: (field: FilterField) => void;
  onClearFilter: (field: FilterField) => void;
  className?: string;
  isSticky?: boolean;
  stickyLeft?: string;
  /** Show shadow on right edge (for last sticky column) */
  showStickyShadow?: boolean;
  /** When provided, adds a "Select subjects..." item below sort options */
  onConfigureSubjects?: () => void;
  /** Whether a custom subject selection is currently active */
  hasCustomSubjects?: boolean;
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
  onConfigureSubjects,
  hasCustomSubjects,
}: ColumnHeaderMenuProps) {
  const [open, setOpen] = useState(false);

  const isSortedBy = currentSort?.field === column.id;
  const sortDirection = isSortedBy ? currentSort.direction : null;
  const hasActiveFilter = column.filterField && activeFilterFields.has(column.filterField);

  // All column headers need border shadows (thead has none). Last sticky column also gets drop shadow.
  const stickyShadow = showStickyShadow
    ? 'shadow-[inset_0_1px_0_var(--color-border),inset_0_-1px_0_var(--color-border),2px_0_5px_-2px_rgba(0,0,0,0.1)]'
    : 'shadow-[inset_0_1px_0_var(--color-border),inset_0_-1px_0_var(--color-border)]';

  // Non-interactive columns render as plain TableHead
  if (!column.sortable && !column.filterable) {
    return (
      <TableHead
        className={cn(className, isSticky && 'sticky z-20 bg-white', stickyShadow)}
        style={stickyLeft ? { left: stickyLeft } : undefined}
      >
        {column.label}
      </TableHead>
    );
  }

  return (
    <TableHead
      className={cn(className, isSticky && 'sticky z-20 bg-white', stickyShadow)}
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
                      '-ml-2 flex items-center gap-1 rounded-md px-2 py-1 whitespace-nowrap transition-colors',
                      'cursor-pointer hover:bg-accent hover:text-accent-foreground',
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
        <PopoverContent align="start" className="w-52 gap-1 p-3">
          {/* Sort options */}
          {column.sortable && (
            <>
              <button
                type="button"
                onClick={() => {
                  onSort(column.id, 'asc');
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--slate-5)]',
                  sortDirection === 'asc' && 'bg-[var(--slate-5)]',
                )}
              >
                <ArrowUp className="h-4 w-4 text-[var(--slate-11)]" />
                Sort ascending
                {sortDirection === 'asc' && (
                  <Check className="ml-auto h-4 w-4 text-[var(--slate-11)]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSort(column.id, 'desc');
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--slate-5)]',
                  sortDirection === 'desc' && 'bg-[var(--slate-5)]',
                )}
              >
                <ArrowDown className="h-4 w-4 text-[var(--slate-11)]" />
                Sort descending
                {sortDirection === 'desc' && (
                  <Check className="ml-auto h-4 w-4 text-[var(--slate-11)]" />
                )}
              </button>
              {isSortedBy && (
                <button
                  type="button"
                  onClick={() => {
                    onClearSort();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--slate-5)]"
                >
                  <X className="h-4 w-4 text-[var(--slate-11)]" />
                  Clear sort
                </button>
              )}
            </>
          )}
          {/* Configure subjects (only for overallPercentage column) */}
          {onConfigureSubjects && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  onConfigureSubjects();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--slate-5)]"
              >
                <Settings2 className="h-4 w-4 text-[var(--slate-11)]" />
                Select subjects...
              </button>
            </>
          )}
          {/* Source / last updated footer */}
          {(column.source || column.lastUpdated) && (
            <>
              <div className="my-1 h-px bg-border" />
              <div className="space-y-1.5 px-3 py-1">
                {column.source && (
                  <div>
                    <p className="text-xs font-medium text-foreground">Source:</p>
                    <p className="text-xs text-muted-foreground">{column.source}</p>
                  </div>
                )}
                {column.lastUpdated && (
                  <div>
                    <p className="text-xs font-medium text-foreground">Last updated:</p>
                    <p className="text-xs text-muted-foreground">{column.lastUpdated}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </TableHead>
  );
}
