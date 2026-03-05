import { useState } from 'react'
import { MoreHorizontal, Search } from 'lucide-react'

import { MultiFilterPopover } from './multi-filter-popover'
import { ColumnVisibilityPopover } from './column-visibility-popover'
import { ExportCsvModal } from './export-csv-modal'
import type { ColumnConfig } from './column-visibility-popover'
import type { FilterCriterion } from '@/types/student'
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
  filters: Array<FilterCriterion>
  onFiltersChange: (filters: Array<FilterCriterion>) => void
  columns: Array<ColumnConfig>
  onColumnsChange: (columns: Array<ColumnConfig>) => void
  className?: string
}

export function StudentFilters({
  searchValue,
  onSearchChange,
  filters,
  onFiltersChange,
  columns,
  onColumnsChange,
  className,
}: StudentFiltersProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search name"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 md:w-[200px]"
              aria-label="Search students"
            />
          </div>
          <MultiFilterPopover
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
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
              <DropdownMenuItem onClick={() => setExportModalOpen(true)}>
                Export to CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ExportCsvModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={({ senFormat, dataRange }) => {
          // TODO: implement actual CSV export
          console.log('Exporting CSV', { senFormat, dataRange })
        }}
      />
    </>
  )
}
