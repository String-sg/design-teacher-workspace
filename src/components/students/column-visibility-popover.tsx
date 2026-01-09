import { useState } from 'react'
import { Columns3, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
}

export const defaultColumns: Array<ColumnConfig> = [
  { id: 'index', label: '#', visible: true },
  { id: 'name', label: 'Name', visible: true },
  { id: 'class', label: 'Class', visible: true },
  { id: 'attentionTags', label: 'Attention tag', visible: true },
  { id: 'overallPercentage', label: 'Overall %', visible: true },
  { id: 'conduct', label: 'Conduct', visible: true },
  { id: 'learningSupport', label: 'Learning Support', visible: true },
  { id: 'postSecEligibility', label: 'Post-Sec Eligibility', visible: true },
  { id: 'offences', label: 'Offences', visible: true },
  { id: 'absences', label: 'Absences', visible: true },
  { id: 'lateComing', label: 'Late-coming', visible: true },
  { id: 'ccaMissed', label: 'CCA Missed', visible: true },
  { id: 'riskIndicators', label: 'Risk (TCI)', visible: true },
  { id: 'lowMoodFlagged', label: 'Low Mood', visible: true },
  { id: 'socialLinks', label: 'Social Links', visible: true },
  { id: 'counsellingSessions', label: 'Counselling', visible: true },
  { id: 'sen', label: 'SEN', visible: true },
  { id: 'housing', label: 'Housing', visible: true },
  { id: 'housingType', label: 'Ownership', visible: true },
  { id: 'custody', label: 'Custody', visible: true },
  { id: 'siblings', label: 'Siblings', visible: true },
  { id: 'externalAgencies', label: 'Ext. Agencies', visible: true },
  { id: 'fas', label: 'FAS', visible: true },
]

interface ColumnVisibilityPopoverProps {
  columns: Array<ColumnConfig>
  onColumnsChange: (columns: Array<ColumnConfig>) => void
  className?: string
}

export function ColumnVisibilityPopover({
  columns,
  onColumnsChange,
  className,
}: ColumnVisibilityPopoverProps) {
  const [open, setOpen] = useState(false)

  const visibleCount = columns.filter((c) => c.visible).length

  const handleToggle = (id: string) => {
    onColumnsChange(
      columns.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col,
      ),
    )
  }

  const handleReset = () => {
    onColumnsChange(defaultColumns)
  }

  const handleShowAll = () => {
    onColumnsChange(columns.map((col) => ({ ...col, visible: true })))
  }

  const handleHideAll = () => {
    // Keep at least name and index visible
    onColumnsChange(
      columns.map((col) => ({
        ...col,
        visible: col.id === 'name' || col.id === 'index',
      })),
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(className)}
                />
              }
            >
              <Columns3 className="h-4 w-4" />
            </PopoverTrigger>
          }
        />
        <TooltipContent>Show/hide columns</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[280px] p-0" align="end">
        {/* Quick actions */}
        <div className="flex items-center gap-2 border-b p-3">
          <Button variant="outline" size="sm" onClick={handleShowAll}>
            Show all
          </Button>
          <Button variant="outline" size="sm" onClick={handleHideAll}>
            Hide all
          </Button>
        </div>

        {/* Column list */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {columns.map((column) => (
            <label
              key={column.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
            >
              <Checkbox
                checked={column.visible}
                onCheckedChange={() => handleToggle(column.id)}
                disabled={
                  column.visible &&
                  visibleCount <= 2 &&
                  (column.id === 'name' || column.id === 'index')
                }
              />
              <span className="text-sm">{column.label}</span>
            </label>
          ))}
        </div>

        {/* Reset button */}
        <div className="border-t p-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to default
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
