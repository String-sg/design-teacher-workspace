import { ArrowUpDown, MoreHorizontal, Search } from 'lucide-react'

import type { SortDirection, SortField } from '@/types/student'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StudentFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField, direction: SortDirection) => void
  className?: string
}

const sortOptions: Array<{ field: SortField; label: string }> = [
  { field: 'name', label: 'Name' },
  { field: 'class', label: 'Class' },
  { field: 'overall', label: 'Overall %' },
  { field: 'conduct', label: 'Conduct' },
]

export function StudentFilters({
  searchValue,
  onSearchChange,
  sortField,
  sortDirection,
  onSortChange,
  className,
}: StudentFiltersProps) {
  const currentSortLabel =
    sortOptions.find((opt) => opt.field === sortField)?.label || 'Sort'

  const handleSortSelect = (field: SortField) => {
    if (field === sortField) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(field, 'asc')
    }
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                <ArrowUpDown data-icon="inline-start" className="h-4 w-4" />
                {currentSortLabel}
                {sortDirection === 'desc' && ' (Z-A)'}
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.field}
                onClick={() => handleSortSelect(option.field)}
              >
                {option.label}
                {sortField === option.field && (
                  <span className="text-muted-foreground ml-auto text-xs">
                    {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
            <DropdownMenuItem>Print view</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
