import { MoreHorizontal, Search } from 'lucide-react'

import type { SortCriterion } from '@/types/student'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MultiSortPopover } from './multi-sort-popover'
import {
  ColumnVisibilityPopover,
  type ColumnConfig,
} from './column-visibility-popover'

interface StudentFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  sorts: SortCriterion[]
  onSortsChange: (sorts: SortCriterion[]) => void
  columns: ColumnConfig[]
  onColumnsChange: (columns: ColumnConfig[]) => void
  className?: string
}

export function StudentFilters({
  searchValue,
  onSearchChange,
  sorts,
  onSortsChange,
  columns,
  onColumnsChange,
  className,
}: StudentFiltersProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search name"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[200px] pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <MultiSortPopover sorts={sorts} onSortsChange={onSortsChange} />

        <ColumnVisibilityPopover
          columns={columns}
          onColumnsChange={onColumnsChange}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export to CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
