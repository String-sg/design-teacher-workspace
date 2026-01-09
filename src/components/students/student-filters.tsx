import { MoreHorizontal, Search } from 'lucide-react'

import { MultiSortPopover } from './multi-sort-popover'
import {
  
  ColumnVisibilityPopover
} from './column-visibility-popover'
import type {ColumnConfig} from './column-visibility-popover';
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

interface StudentFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  sorts: Array<SortCriterion>
  onSortsChange: (sorts: Array<SortCriterion>) => void
  columns: Array<ColumnConfig>
  onColumnsChange: (columns: Array<ColumnConfig>) => void
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
      <div className="flex items-center gap-2">
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
        <MultiSortPopover sorts={sorts} onSortsChange={onSortsChange} />
      </div>

      <div className="flex items-center gap-2">
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
