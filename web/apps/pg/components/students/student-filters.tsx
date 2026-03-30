import { Clock, Download, MoreHorizontal, Search, Upload, X } from 'lucide-react';
import { useState } from 'react';

import type { FilterCriterion } from '~/apps/pg/types/student';
import { Button } from '~/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/shared/components/ui/dropdown-menu';
import { Input } from '~/shared/components/ui/input';
import { cn } from '~/shared/lib/utils';

import type { ColumnConfig } from './column-visibility-popover';
import { ColumnVisibilityPopover } from './column-visibility-popover';
import { ExportCsvModal } from './export-csv-modal';
import { MultiFilterPopover } from './multi-filter-popover';

interface StudentFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterCriterion[];
  onFiltersChange: (filters: FilterCriterion[]) => void;
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
  matchedCount?: number;
  totalCount?: number;
  className?: string;
}

export function StudentFilters({
  searchValue,
  onSearchChange,
  filters,
  onFiltersChange,
  columns,
  onColumnsChange,
  matchedCount,
  totalCount,
  className,
}: StudentFiltersProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
            matchedCount={matchedCount}
            totalCount={totalCount}
          />
        </div>

        <div className="flex items-center gap-2">
          <ColumnVisibilityPopover columns={columns} onColumnsChange={onColumnsChange} />

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
                <Download className="mr-2 size-4" />
                Export view
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                <Upload className="mr-2 size-4" />
                Import data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {importDialogOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
            <h1 className="text-base font-semibold">Import data</h1>
            <Button variant="ghost" size="icon-sm" onClick={() => setImportDialogOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-16 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Clock className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-4 text-xl font-medium text-foreground">Coming soon</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Field import is being prepared. It'll be available here once ready.
              </p>
            </div>
          </div>
        </div>
      )}

      <ExportCsvModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={({ senFormats }) => {
          // TODO: implement actual CSV export
          console.log('Exporting CSV', { senFormats });
        }}
      />
    </>
  );
}
