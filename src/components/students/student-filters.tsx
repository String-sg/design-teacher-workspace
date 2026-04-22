import { useState } from 'react'
import { Check, Download, LayoutGrid, MoreHorizontal, Search, Upload, X } from 'lucide-react'

import { MultiFilterPopover } from './multi-filter-popover'
import { ColumnVisibilityPopover } from './column-visibility-popover'
import { ExportCsvModal } from './export-csv-modal'
import { ImportWizard } from './import-wizard'
import type { ColumnConfig } from './column-visibility-popover'
import type { FilterCriterion } from '@/types/student'
import { useFeatureFlags } from '@/lib/feature-flags'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface StudentFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters: Array<FilterCriterion>
  onFiltersChange: (filters: Array<FilterCriterion>) => void
  columns: Array<ColumnConfig>
  onColumnsChange: (columns: Array<ColumnConfig>) => void
  onImportComplete?: (importedColumns: Array<ColumnConfig>) => void
  importedColumns?: Array<{ id: string; label: string }>
  groupBy?: string | null
  onGroupChange?: (field: string | null) => void
  matchedCount?: number
  totalCount?: number
  className?: string
}

const BUILT_IN_GROUP_FIELDS = [
  { id: 'class', label: 'Class' },
  { id: 'cca', label: 'CCA' },
]

export function StudentFilters({
  searchValue,
  onSearchChange,
  filters,
  onFiltersChange,
  columns,
  onColumnsChange,
  onImportComplete,
  importedColumns = [],
  groupBy,
  onGroupChange,
  matchedCount,
  totalCount,
  className,
}: StudentFiltersProps) {
  const { flags } = useFeatureFlags()
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false)

  const groupFields = [
    ...BUILT_IN_GROUP_FIELDS,
    ...importedColumns.filter((c) => !BUILT_IN_GROUP_FIELDS.some((b) => b.id === c.id)),
  ]

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
            importedFields={importedColumns}
            matchedCount={matchedCount}
            totalCount={totalCount}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Group button — only shown when grouping is supported */}
          {onGroupChange && <Popover open={groupPopoverOpen} onOpenChange={setGroupPopoverOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant={groupBy ? 'secondary' : 'outline'}
                  size="sm"
                  className="gap-2"
                />
              }
            >
              <LayoutGrid className="h-4 w-4" />
              Group
              {groupBy && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
                  aria-label="Group active"
                >
                  1
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 gap-1 p-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Group by
              </p>
              {groupFields.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onGroupChange?.(groupBy === f.id ? null : f.id)
                    setGroupPopoverOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                    groupBy === f.id && 'bg-accent',
                  )}
                >
                  {groupBy === f.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                  <span className={cn(groupBy !== f.id && 'ml-[1.375rem]')}>{f.label}</span>
                </button>
              ))}
              {groupBy && (
                <>
                  <div className="my-1 h-px bg-border" />
                  <button
                    type="button"
                    onClick={() => {
                      onGroupChange?.(null)
                      setGroupPopoverOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear grouping
                  </button>
                </>
              )}
            </PopoverContent>
          </Popover>}

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
            <DropdownMenuContent align="end" className="p-3">
              <DropdownMenuItem onClick={() => setExportModalOpen(true)}>
                <Download className="mr-2 size-4" />
                Export data
              </DropdownMenuItem>
              {flags['import-data'] && (
                <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                  <Upload className="mr-2 size-4" />
                  Import data
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {flags['import-data'] && importDialogOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <ImportWizard
            onClose={() => setImportDialogOpen(false)}
            onImportComplete={onImportComplete}
          />
        </div>
      )}

      <ExportCsvModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={({ senFormats }) => {
          console.log('Exporting CSV', { senFormats })
        }}
      />
    </>
  )
}
