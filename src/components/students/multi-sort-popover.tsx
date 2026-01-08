import { useState } from 'react'
import { ListFilter, X, RotateCcw, Save, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import type { SortCriterion, SortField, SortOperator } from '@/types/student'

type FieldType = 'numeric' | 'text' | 'boolean' | 'enum'

type FieldGroup = 'general' | 'academic' | 'behaviour' | 'wellbeing' | 'family'

interface OperatorOption {
  value: SortOperator
  label: string
}

interface SortFieldOption {
  field: SortField
  label: string
  type: FieldType
  group: FieldGroup
  operators: OperatorOption[]
  defaultOperator: SortOperator
  defaultValue: string | number
  enumValues?: string[]
}

const groupLabels: Record<FieldGroup, string> = {
  general: 'General',
  academic: 'Academic Performance',
  behaviour: 'Behaviour and Discipline',
  wellbeing: 'Wellbeing',
  family: 'Family, Housing, Finance',
}

const groupOrder: FieldGroup[] = ['general', 'behaviour', 'academic', 'wellbeing', 'family']

const numericOperators: OperatorOption[] = [
  { value: 'gte', label: 'Greater than or equal' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lte', label: 'Less than or equal to' },
  { value: 'lt', label: 'Less than' },
  { value: 'eq', label: 'Equal to' },
]

const textOperators: OperatorOption[] = [
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
]

const booleanOperators: OperatorOption[] = [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
]

const sortFieldOptions: SortFieldOption[] = [
  // General
  {
    field: 'name',
    label: 'Name',
    type: 'text',
    group: 'general',
    operators: textOperators,
    defaultOperator: 'contains',
    defaultValue: '',
  },
  {
    field: 'class',
    label: 'Class',
    type: 'text',
    group: 'general',
    operators: textOperators,
    defaultOperator: 'contains',
    defaultValue: '',
  },
  // Behaviour and Discipline
  {
    field: 'absences',
    label: 'Non-valid Absenteeism',
    type: 'numeric',
    group: 'behaviour',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 5,
  },
  {
    field: 'lateComing',
    label: 'Late-coming',
    type: 'numeric',
    group: 'behaviour',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 5,
  },
  {
    field: 'offences',
    label: 'Offences',
    type: 'numeric',
    group: 'behaviour',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 1,
  },
  {
    field: 'ccaMissed',
    label: 'CCA Sessions Missed',
    type: 'numeric',
    group: 'behaviour',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 3,
  },
  // Academic Performance
  {
    field: 'overallPercentage',
    label: 'Overall %',
    type: 'numeric',
    group: 'academic',
    operators: numericOperators,
    defaultOperator: 'lte',
    defaultValue: 50,
  },
  {
    field: 'conduct',
    label: 'Conduct',
    type: 'enum',
    group: 'academic',
    operators: booleanOperators,
    defaultOperator: 'is',
    defaultValue: 'Poor',
    enumValues: ['Excellent', 'Good', 'Fair', 'Poor'],
  },
  {
    field: 'learningSupport',
    label: 'Learning Support',
    type: 'text',
    group: 'academic',
    operators: textOperators,
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'postSecEligibility',
    label: 'Post-Sec Eligibility',
    type: 'text',
    group: 'academic',
    operators: textOperators,
    defaultOperator: 'contains',
    defaultValue: '',
  },
  // Wellbeing
  {
    field: 'riskIndicators',
    label: 'Risk Indicators (TCI)',
    type: 'numeric',
    group: 'wellbeing',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 3,
  },
  {
    field: 'lowMoodFlagged',
    label: 'Low Mood',
    type: 'boolean',
    group: 'wellbeing',
    operators: booleanOperators,
    defaultOperator: 'is',
    defaultValue: 'Yes',
    enumValues: ['Yes', 'No'],
  },
  {
    field: 'socialLinks',
    label: 'Social Links',
    type: 'numeric',
    group: 'wellbeing',
    operators: numericOperators,
    defaultOperator: 'lte',
    defaultValue: 2,
  },
  {
    field: 'counsellingSessions',
    label: 'Counselling Sessions',
    type: 'numeric',
    group: 'wellbeing',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 1,
  },
  {
    field: 'sen',
    label: 'SEN',
    type: 'text',
    group: 'wellbeing',
    operators: textOperators,
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'fas',
    label: 'FAS',
    type: 'boolean',
    group: 'wellbeing',
    operators: booleanOperators,
    defaultOperator: 'is',
    defaultValue: 'Yes',
    enumValues: ['Yes', 'No'],
  },
  // Family, Housing, Finance
  {
    field: 'housing',
    label: 'Housing',
    type: 'text',
    group: 'family',
    operators: textOperators,
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'housingType',
    label: 'Ownership',
    type: 'enum',
    group: 'family',
    operators: booleanOperators,
    defaultOperator: 'is',
    defaultValue: 'Rented',
    enumValues: ['Owned', 'Rented'],
  },
  {
    field: 'custody',
    label: 'Custody',
    type: 'text',
    group: 'family',
    operators: textOperators,
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'siblings',
    label: 'Siblings',
    type: 'numeric',
    group: 'family',
    operators: numericOperators,
    defaultOperator: 'gte',
    defaultValue: 3,
  },
  {
    field: 'externalAgencies',
    label: 'External Agencies',
    type: 'text',
    group: 'family',
    operators: textOperators,
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
]

interface SortPreset {
  id: string
  label: string
  sorts: SortCriterion[]
}

const defaultPresets: SortPreset[] = [
  {
    id: 'support',
    label: 'Support',
    sorts: [
      { id: '1', field: 'riskIndicators', operator: 'gte', value: 3 },
      { id: '2', field: 'absences', operator: 'gte', value: 5 },
      { id: '3', field: 'conduct', operator: 'is', value: 'Poor' },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    sorts: [
      { id: '1', field: 'conduct', operator: 'is', value: 'Excellent' },
      { id: '2', field: 'overallPercentage', operator: 'gte', value: 70 },
      { id: '3', field: 'offences', operator: 'eq', value: 0 },
    ],
  },
]

let presetIdCounter = 0
const generatePresetId = () => `preset-${++presetIdCounter}`

interface MultiSortPopoverProps {
  sorts: SortCriterion[]
  onSortsChange: (sorts: SortCriterion[]) => void
  className?: string
}

let sortIdCounter = 0
const generateId = () => `sort-${++sortIdCounter}`

export function MultiSortPopover({
  sorts,
  onSortsChange,
  className,
}: MultiSortPopoverProps) {
  const [open, setOpen] = useState(false)
  const [customPresets, setCustomPresets] = useState<SortPreset[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null)
  const [activePresetId, setActivePresetId] = useState<string | null>(null)

  const sortPresets = [...defaultPresets, ...customPresets]

  const activeFields = new Set(sorts.map((s) => s.field))
  const availableFields = sortFieldOptions.filter(
    (opt) => !activeFields.has(opt.field),
  )

  // Get selected preset from active ID
  const selectedPreset = activePresetId
    ? sortPresets.find((p) => p.id === activePresetId)
    : null

  const handleAddSort = (field: SortField) => {
    const fieldOption = sortFieldOptions.find((opt) => opt.field === field)
    if (!fieldOption) return
    onSortsChange([
      ...sorts,
      {
        id: generateId(),
        field,
        operator: fieldOption.defaultOperator,
        value: fieldOption.defaultValue,
      },
    ])
  }

  const handleRemoveSort = (index: number) => {
    onSortsChange(sorts.filter((_, i) => i !== index))
  }

  const handleFieldChange = (index: number, field: SortField) => {
    const fieldOption = sortFieldOptions.find((opt) => opt.field === field)
    if (!fieldOption) return
    const newSorts = [...sorts]
    newSorts[index] = {
      ...newSorts[index],
      field,
      operator: fieldOption.defaultOperator,
      value: fieldOption.defaultValue,
    }
    onSortsChange(newSorts)
  }

  const handleOperatorChange = (index: number, operator: SortOperator) => {
    const newSorts = [...sorts]
    newSorts[index] = { ...newSorts[index], operator }
    // Clear value for empty operators
    if (operator === 'is_empty' || operator === 'is_not_empty') {
      newSorts[index].value = ''
    }
    onSortsChange(newSorts)
  }

  const handleValueChange = (index: number, value: string | number) => {
    const newSorts = [...sorts]
    newSorts[index] = { ...newSorts[index], value }
    onSortsChange(newSorts)
  }

  const handleReset = () => {
    onSortsChange([])
    setActivePresetId(null)
  }

  const handleSavePreset = () => {
    if (!presetName.trim() || sorts.length === 0) return
    const savedSorts = sorts.map((s) => ({
      field: s.field,
      operator: s.operator,
      value: s.value,
    }))

    let savedPresetId: string

    if (editingPresetId) {
      // Update existing preset
      savedPresetId = editingPresetId
      setCustomPresets(
        customPresets.map((p) =>
          p.id === editingPresetId
            ? { ...p, label: presetName.trim(), sorts: savedSorts }
            : p
        )
      )
      toast.success(`Preset "${presetName.trim()}" updated`)
    } else {
      // Create new preset
      savedPresetId = generatePresetId()
      const newPreset: SortPreset = {
        id: savedPresetId,
        label: presetName.trim(),
        sorts: savedSorts,
      }
      setCustomPresets([...customPresets, newPreset])
      toast.success(`Preset "${newPreset.label}" saved`)
    }

    // Update current sorts to match saved preset exactly
    onSortsChange(savedSorts.map((s) => ({ ...s, id: generateId() })))
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
      onSortsChange(preset.sorts.map((s) => ({ ...s, id: generateId() })))
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

  const getFieldOption = (field: SortField) =>
    sortFieldOptions.find((opt) => opt.field === field)

  const needsValueInput = (operator: SortOperator) =>
    !['is_empty', 'is_not_empty'].includes(operator)

  return (
    <>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn('gap-2', className)} />
        }
      >
        <ListFilter className="h-4 w-4" />
        Filter
        {sorts.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {sorts.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[600px] gap-0 p-0" align="start">
        {/* Preset Selector */}
        <div className="border-b p-3">
          <label className="mb-2 block text-sm font-medium">Select filter preset</label>
          <Select
            value={activePresetId ?? 'custom'}
            onValueChange={(presetId) => {
              if (presetId === 'custom') {
                setActivePresetId(null)
                return
              }
              const preset = sortPresets.find((p) => p.id === presetId)
              if (preset) {
                setActivePresetId(presetId)
                onSortsChange(preset.sorts.map((s) => ({ ...s, id: generateId() })))
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedPreset?.label ?? 'Custom'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              {defaultPresets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.label}
                </SelectItem>
              ))}
              {customPresets.length > 0 && (
                <>
                  <div className="my-1 h-px bg-border" />
                  {customPresets.map((preset) => (
                    <div key={preset.id} className="flex items-center justify-between gap-1 pr-2">
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

        {/* Active Sorts */}
        {sorts.length > 0 && (
          <div className="p-3">
            <div className="max-h-[280px] space-y-2 overflow-y-auto">
              {sorts.map((sort, index) => {
                const fieldOption = getFieldOption(sort.field)
                return (
                  <div
                    key={sort.id}
                    className="flex items-center gap-2"
                  >
                    {/* Field Selector */}
                    <Select
                      value={sort.field}
                      onValueChange={(value) =>
                        handleFieldChange(index, value as SortField)
                      }
                    >
                      <SelectTrigger className="w-[180px] shrink-0">
                        <SelectValue>{fieldOption?.label}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={sort.field}>
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
                      value={sort.operator}
                      onValueChange={(value) =>
                        handleOperatorChange(index, value as SortOperator)
                      }
                    >
                      <SelectTrigger className="w-[200px] shrink-0">
                        <SelectValue>
                          {fieldOption?.operators.find(
                            (op) => op.value === sort.operator
                          )?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOption?.operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Value Input */}
                    <div className="w-[140px] shrink-0">
                      {needsValueInput(sort.operator) && (
                        <>
                          {fieldOption?.type === 'numeric' ? (
                            <Input
                              type="number"
                              value={sort.value}
                              onChange={(e) =>
                                handleValueChange(index, Number(e.target.value))
                              }
                              className="w-full"
                            />
                          ) : fieldOption?.type === 'boolean' ||
                            fieldOption?.type === 'enum' ? (
                            <Select
                              value={String(sort.value)}
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
                              value={String(sort.value)}
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
                      onClick={() => handleRemoveSort(index)}
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
          <div className={sorts.length > 0 ? 'border-t' : ''}>
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Add filter criteria</div>
            <ScrollArea className="h-[300px]">
              <div>
                {groupOrder.map((group) => {
                  const groupFields = availableFields.filter((opt) => opt.group === group)
                  if (groupFields.length === 0) return null
                  return (
                    <div key={group} className="mb-2 last:mb-0">
                      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        {groupLabels[group]}
                      </div>
                      {groupFields.map((opt) => (
                        <button
                          key={opt.field}
                          type="button"
                          onClick={() => handleAddSort(opt.field)}
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
        <div className="flex items-center justify-between border-t px-3 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={sorts.length === 0}
            className="gap-2 text-destructive hover:text-destructive disabled:text-muted-foreground"
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
                const isCustomPreset = selectedPreset && customPresets.some((p) => p.id === selectedPreset.id)
                if (isCustomPreset && selectedPreset) {
                  setEditingPresetId(selectedPreset.id)
                  setPresetName(selectedPreset.label)
                }
                setSaveDialogOpen(true)
              }}
              disabled={sorts.length === 0}
            >
              <Save className="h-4 w-4" />
              {selectedPreset && customPresets.some((p) => p.id === selectedPreset.id)
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
        onOpenChange={(open) => {
          setSaveDialogOpen(open)
          if (!open) {
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
