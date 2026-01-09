import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Equal,
  EqualNot,
  Info,
  ListFilter,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'

import type {
  FilterCriterion,
  FilterField,
  FilterOperator,
} from '@/types/student'
import type { FilterFieldOption, OperatorOption } from '@/data/filter-config'
import {
  filterFieldConfigs,
  groupLabels,
  groupOrder,
  textOperators,
} from '@/data/filter-config'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Operator options with icons (defined here since they include React components)
const numericOperators: Array<OperatorOption> = [
  {
    value: 'gte',
    label: 'Greater than or equal',
    icon: <ChevronsRight className="h-4 w-4" />,
  },
  {
    value: 'gt',
    label: 'Greater than',
    icon: <ChevronRight className="h-4 w-4" />,
  },
  {
    value: 'lte',
    label: 'Less than or equal to',
    icon: <ChevronsLeft className="h-4 w-4" />,
  },
  {
    value: 'lt',
    label: 'Less than',
    icon: <ChevronLeft className="h-4 w-4" />,
  },
  {
    value: 'eq',
    label: 'Equal to',
    icon: <Equal className="h-4 w-4" />,
  },
]

const booleanOperators: Array<OperatorOption> = [
  { value: 'is', label: 'is', icon: <Equal className="h-4 w-4" /> },
  { value: 'is_not', label: 'is not', icon: <EqualNot className="h-4 w-4" /> },
]

// Build filterFieldOptions from config, adding operator arrays based on field type
const filterFieldOptions: Array<FilterFieldOption> = filterFieldConfigs.map(
  (config) => ({
    ...config,
    operators:
      config.type === 'numeric'
        ? numericOperators
        : config.type === 'boolean' || config.type === 'enum'
          ? booleanOperators
          : textOperators,
  }),
)

interface FilterPreset {
  id: string
  label: string
  description?: string
  filters: Array<FilterCriterion>
}

const defaultPresets: Array<FilterPreset> = [
  {
    id: 'support',
    label: 'Support',
    description: 'Identify students for support',
    filters: [
      { id: '1', field: 'riskIndicators', operator: 'gte', value: 3 },
      { id: '2', field: 'absences', operator: 'gte', value: 5 },
      { id: '3', field: 'conduct', operator: 'is', value: 'Poor' },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    description: 'Find potential leaders',
    filters: [
      { id: '1', field: 'conduct', operator: 'is', value: 'Excellent' },
      { id: '2', field: 'overallPercentage', operator: 'gte', value: 70 },
      { id: '3', field: 'offences', operator: 'eq', value: 0 },
    ],
  },
]

const customPresetOption = {
  id: 'custom',
  label: 'Custom',
  description: 'Build your own criteria from scratch',
}

let presetIdCounter = 0
const generatePresetId = () => `preset-${++presetIdCounter}`

interface MultiFilterPopoverProps {
  filters: Array<FilterCriterion>
  onFiltersChange: (filters: Array<FilterCriterion>) => void
  className?: string
}

let filterIdCounter = 0
const generateId = () => `filter-${++filterIdCounter}`

export function MultiFilterPopover({
  filters,
  onFiltersChange,
  className,
}: MultiFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [customPresets, setCustomPresets] = useState<Array<FilterPreset>>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null)
  const [activePresetId, setActivePresetId] = useState<string | null>(null)

  const filterPresets = [...defaultPresets, ...customPresets]

  const activeFields = useMemo(
    () => new Set(filters.map((f) => f.field)),
    [filters],
  )
  const availableFields = useMemo(
    () => filterFieldOptions.filter((opt) => !activeFields.has(opt.field)),
    [activeFields],
  )

  // Get selected preset from active ID
  const selectedPreset = activePresetId
    ? filterPresets.find((p) => p.id === activePresetId)
    : null

  const handleAddFilter = (field: FilterField) => {
    const fieldOption = filterFieldOptions.find((opt) => opt.field === field)
    if (!fieldOption) return
    onFiltersChange([
      ...filters,
      {
        id: generateId(),
        field,
        operator: fieldOption.defaultOperator,
        value: fieldOption.defaultValue,
      },
    ])
  }

  const handleRemoveFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index))
  }

  const handleFieldChange = (index: number, field: FilterField) => {
    const fieldOption = filterFieldOptions.find((opt) => opt.field === field)
    if (!fieldOption) return
    const newFilters = [...filters]
    newFilters[index] = {
      ...newFilters[index],
      field,
      operator: fieldOption.defaultOperator,
      value: fieldOption.defaultValue,
    }
    onFiltersChange(newFilters)
  }

  const handleOperatorChange = (index: number, operator: FilterOperator) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], operator }
    // Clear value for empty operators
    if (operator === 'is_empty' || operator === 'is_not_empty') {
      newFilters[index].value = ''
    }
    onFiltersChange(newFilters)
  }

  const handleValueChange = (index: number, value: string | number) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], value }
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    onFiltersChange([])
    setActivePresetId(null)
  }

  const handleSavePreset = () => {
    if (!presetName.trim() || filters.length === 0) return
    const savedFilters = filters.map((f) => ({
      field: f.field,
      operator: f.operator,
      value: f.value,
    }))

    let savedPresetId: string

    if (editingPresetId) {
      // Update existing preset
      savedPresetId = editingPresetId
      setCustomPresets(
        customPresets.map((p) =>
          p.id === editingPresetId
            ? { ...p, label: presetName.trim(), filters: savedFilters }
            : p,
        ),
      )
      toast.success(`Preset "${presetName.trim()}" updated`)
    } else {
      // Create new preset
      savedPresetId = generatePresetId()
      const newPreset: FilterPreset = {
        id: savedPresetId,
        label: presetName.trim(),
        filters: savedFilters,
      }
      setCustomPresets([...customPresets, newPreset])
      toast.success(`Preset "${newPreset.label}" saved`)
    }

    // Update current filters to match saved preset exactly
    onFiltersChange(savedFilters.map((f) => ({ ...f, id: generateId() })))
    setActivePresetId(savedPresetId)
    setPresetName('')
    setEditingPresetId(null)
    setSaveDialogOpen(false)
  }

  const handleEditPreset = (presetId: string) => {
    const preset = customPresets.find((p) => p.id === presetId)
    if (preset) {
      setPresetName(preset.label)
      setEditingPresetId(presetId)
      setActivePresetId(presetId)
      // Load the preset's filters into the current view
      onFiltersChange(preset.filters.map((f) => ({ ...f, id: generateId() })))
      setSaveDialogOpen(true)
    }
  }

  const handleDeletePreset = (presetId: string) => {
    const preset = customPresets.find((p) => p.id === presetId)
    setCustomPresets(customPresets.filter((p) => p.id !== presetId))
    if (activePresetId === presetId) {
      setActivePresetId(null)
    }
    if (preset) {
      toast.success(`Preset "${preset.label}" deleted`)
    }
  }

  const getFieldOption = (field: FilterField) =>
    filterFieldOptions.find((opt) => opt.field === field)

  const needsValueInput = (operator: FilterOperator) =>
    !['is_empty', 'is_not_empty'].includes(operator)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn('gap-2', className)}
              aria-label="Filter students"
              aria-expanded={open}
            />
          }
        >
          <ListFilter className="h-4 w-4" />
          Filter
          {filters.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {filters.length}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[600px] gap-0 p-0" align="start">
          {/* Preset Selector */}
          <div className="border-b px-6 py-6">
            <div className="mb-2 flex items-center gap-1.5">
              <label className="text-sm font-medium">
                Select filter preset
              </label>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  }
                />
                <TooltipContent side="right">
                  Quickly filter students using preset criteria
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={activePresetId ?? 'custom'}
              onValueChange={(presetId) => {
                if (presetId === 'custom') {
                  setActivePresetId(null)
                  return
                }
                const preset = filterPresets.find((p) => p.id === presetId)
                if (preset) {
                  setActivePresetId(presetId)
                  onFiltersChange(
                    preset.filters.map((f) => ({ ...f, id: generateId() })),
                  )
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{selectedPreset?.label ?? 'Custom'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {defaultPresets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div className="flex flex-col">
                      <span>{preset.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {preset.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  <div className="flex flex-col">
                    <span>{customPresetOption.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {customPresetOption.description}
                    </span>
                  </div>
                </SelectItem>
                {customPresets.length > 0 && (
                  <>
                    <div className="my-1 h-px bg-border" />
                    {customPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between gap-1 pr-2"
                      >
                        <SelectItem value={preset.id} className="flex-1">
                          {preset.label}
                        </SelectItem>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditPreset(preset.id)
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePreset(preset.id)
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="px-6 py-6">
              <div className="max-h-[280px] space-y-2 overflow-y-auto">
                {filters.map((filter, index) => {
                  const fieldOption = getFieldOption(filter.field)
                  return (
                    <div key={filter.id} className="flex items-center gap-2">
                      {/* Field Selector */}
                      <Select
                        value={filter.field}
                        onValueChange={(value) =>
                          handleFieldChange(index, value as FilterField)
                        }
                      >
                        <SelectTrigger className="min-w-0 flex-1">
                          <SelectValue>{fieldOption?.label}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="min-w-max">
                          <SelectItem value={filter.field}>
                            {fieldOption?.label}
                          </SelectItem>
                          {availableFields.map((opt) => (
                            <SelectItem key={opt.field} value={opt.field}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Operator Selector */}
                      <Select
                        value={filter.operator}
                        onValueChange={(value) =>
                          handleOperatorChange(index, value as FilterOperator)
                        }
                      >
                        <SelectTrigger className="min-w-0 flex-1">
                          <SelectValue>
                            {(() => {
                              const selectedOp = fieldOption?.operators.find(
                                (o) => o.value === filter.operator,
                              )
                              return (
                                <span className="flex items-center gap-2">
                                  {selectedOp?.icon}
                                  {selectedOp?.label}
                                </span>
                              )
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="min-w-max">
                          {fieldOption?.operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              <span className="flex items-center gap-2">
                                {op.icon}
                                {op.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Value Input */}
                      <div className="min-w-0 flex-1">
                        {needsValueInput(filter.operator) && (
                          <>
                            {fieldOption?.type === 'numeric' ? (
                              <Input
                                type="number"
                                value={filter.value}
                                onChange={(e) =>
                                  handleValueChange(
                                    index,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full"
                              />
                            ) : fieldOption?.type === 'boolean' ||
                              fieldOption?.type === 'enum' ? (
                              <Select
                                value={String(filter.value)}
                                onValueChange={(value) =>
                                  handleValueChange(index, value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldOption.enumValues?.map((v) => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type="text"
                                value={String(filter.value)}
                                onChange={(e) =>
                                  handleValueChange(index, e.target.value)
                                }
                                placeholder="Enter value"
                                className="w-full"
                              />
                            )}
                          </>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleRemoveFilter(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Available Fields - Grouped by Section */}
          {availableFields.length > 0 && (
            <div className={filters.length > 0 ? 'border-t' : ''}>
              <div className="bg-muted/50 px-6 py-2 text-sm font-medium text-muted-foreground">
                Add filter criteria
              </div>
              <ScrollArea className="h-[300px]">
                <div className="px-3 py-3">
                  {groupOrder.map((group) => {
                    const groupFields = availableFields.filter(
                      (opt) => opt.group === group,
                    )
                    if (groupFields.length === 0) return null
                    return (
                      <div key={group} className="mb-4 last:mb-0">
                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                          {groupLabels[group]}
                        </div>
                        {groupFields.map((opt) => (
                          <button
                            key={opt.field}
                            type="button"
                            onClick={() => handleAddFilter(opt.field)}
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={filters.length === 0}
              className="-ml-2 gap-2 text-destructive hover:text-destructive disabled:text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => {
                  const isCustomPreset = customPresets.some(
                    (p) => p.id === selectedPreset?.id,
                  )
                  if (isCustomPreset && selectedPreset) {
                    setEditingPresetId(selectedPreset.id)
                    setPresetName(selectedPreset.label)
                  }
                  setSaveDialogOpen(true)
                }}
                disabled={filters.length === 0}
              >
                <Save className="h-4 w-4" />
                {selectedPreset &&
                customPresets.some((p) => p.id === selectedPreset.id)
                  ? 'Update preset'
                  : 'Save as preset'}
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Save/Edit Preset Dialog */}
      <Dialog
        open={saveDialogOpen}
        onOpenChange={(isOpen) => {
          setSaveDialogOpen(isOpen)
          if (!isOpen) {
            setEditingPresetId(null)
            setPresetName('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPresetId ? 'Edit filter preset' : 'Save filter preset'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSavePreset()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSaveDialogOpen(false)
                setEditingPresetId(null)
                setPresetName('')
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
              {editingPresetId ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
