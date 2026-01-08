import { useState } from 'react'
import { ArrowUpDown, X, GripVertical, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortCriterion, SortField, SortDirection } from '@/types/student'

interface SortFieldOption {
  field: SortField
  label: string
  ascLabel: string
  descLabel: string
}

const sortFieldOptions: SortFieldOption[] = [
  { field: 'name', label: 'Names', ascLabel: 'A → Z', descLabel: 'Z → A' },
  {
    field: 'class',
    label: 'Class',
    ascLabel: 'First → Last',
    descLabel: 'Last → First',
  },
  { field: 'overall', label: 'Overall %', ascLabel: '1 → 9', descLabel: '9 → 1' },
  {
    field: 'conduct',
    label: 'Conduct',
    ascLabel: 'First → Last',
    descLabel: 'Last → First',
  },
  { field: 'offences', label: 'Offences', ascLabel: '1 → 9', descLabel: '9 → 1' },
  {
    field: 'riskIndicators',
    label: 'Risk Indicators',
    ascLabel: '1 → 9',
    descLabel: '9 → 1',
  },
  { field: 'absences', label: 'Absences', ascLabel: '1 → 9', descLabel: '9 → 1' },
  {
    field: 'lateComing',
    label: 'Late Coming',
    ascLabel: '1 → 9',
    descLabel: '9 → 1',
  },
  {
    field: 'ccaMissed',
    label: 'CCA Missed',
    ascLabel: '1 → 9',
    descLabel: '9 → 1',
  },
  {
    field: 'learningSupport',
    label: 'Learning Support',
    ascLabel: 'A → Z',
    descLabel: 'Z → A',
  },
  {
    field: 'postSecEligibility',
    label: 'Post-Sec Eligibility',
    ascLabel: 'A → Z',
    descLabel: 'Z → A',
  },
]

interface MultiSortPopoverProps {
  sorts: SortCriterion[]
  onSortsChange: (sorts: SortCriterion[]) => void
  className?: string
}

export function MultiSortPopover({
  sorts,
  onSortsChange,
  className,
}: MultiSortPopoverProps) {
  const [open, setOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const activeFields = new Set(sorts.map((s) => s.field))
  const availableFields = sortFieldOptions.filter(
    (opt) => !activeFields.has(opt.field),
  )

  const handleAddSort = (field: SortField) => {
    onSortsChange([...sorts, { field, direction: 'asc' }])
  }

  const handleRemoveSort = (index: number) => {
    onSortsChange(sorts.filter((_, i) => i !== index))
  }

  const handleFieldChange = (index: number, field: SortField) => {
    const newSorts = [...sorts]
    newSorts[index] = { ...newSorts[index], field }
    onSortsChange(newSorts)
  }

  const handleDirectionChange = (index: number, direction: SortDirection) => {
    const newSorts = [...sorts]
    newSorts[index] = { ...newSorts[index], direction }
    onSortsChange(newSorts)
  }

  const handleReset = () => {
    onSortsChange([])
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newSorts = [...sorts]
      const [removed] = newSorts.splice(draggedIndex, 1)
      newSorts.splice(dragOverIndex, 0, removed)
      onSortsChange(newSorts)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const getFieldOption = (field: SortField) =>
    sortFieldOptions.find((opt) => opt.field === field)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn('gap-2', className)} />
        }
      >
        <ArrowUpDown className="h-4 w-4" />
        Sort
        {sorts.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {sorts.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="end">
        {/* Active Sorts */}
        {sorts.length > 0 && (
          <div className="border-b p-3">
            <div className="space-y-2">
              {sorts.map((sort, index) => {
                const fieldOption = getFieldOption(sort.field)
                return (
                  <div
                    key={`${sort.field}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'flex items-center gap-2',
                      dragOverIndex === index && draggedIndex !== index && 'opacity-50',
                    )}
                  >
                    {/* Field Selector */}
                    <Select
                      value={sort.field}
                      onValueChange={(value) =>
                        handleFieldChange(index, value as SortField)
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Current field always available */}
                        <SelectItem value={sort.field}>
                          {fieldOption?.label}
                        </SelectItem>
                        {/* Plus available fields */}
                        {availableFields.map((opt) => (
                          <SelectItem key={opt.field} value={opt.field}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Direction Selector */}
                    <Select
                      value={sort.direction}
                      onValueChange={(value) =>
                        handleDirectionChange(index, value as SortDirection)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          {sort.direction === 'asc'
                            ? fieldOption?.ascLabel
                            : fieldOption?.descLabel}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">{fieldOption?.ascLabel}</SelectItem>
                        <SelectItem value="desc">{fieldOption?.descLabel}</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleRemoveSort(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {/* Drag Handle */}
                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available Fields */}
        {availableFields.length > 0 && (
          <div className="p-2">
            {availableFields.map((opt) => (
              <button
                key={opt.field}
                type="button"
                onClick={() => handleAddSort(opt.field)}
                className="w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Reset Button */}
        {sorts.length > 0 && (
          <div className="border-t p-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
