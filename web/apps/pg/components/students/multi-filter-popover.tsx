import { Check, ChevronDown, ChevronUp, Filter, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { FilterFieldOption } from '~/apps/pg/data/filter-config';
import { filterFieldConfigs, isFilterComplete } from '~/apps/pg/data/filter-config';
import type {
  FilterCriterion,
  FilterField,
  FilterOperator,
  FilterRangeValue,
} from '~/apps/pg/types/student';
import { Button } from '~/shared/components/ui/button';
import { Input } from '~/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/components/ui/popover';
import { ScrollArea } from '~/shared/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/components/ui/select';
import { cn } from '~/shared/lib/utils';

// Plain-text operator labels matching the screenshot
const numericOperatorOptions = [
  { value: 'eq' as FilterOperator, label: 'equals' },
  { value: 'neq' as FilterOperator, label: 'not equal to' },
  { value: 'gt' as FilterOperator, label: 'greater than' },
  { value: 'lt' as FilterOperator, label: 'less than' },
  { value: 'gte' as FilterOperator, label: 'greater than or equal to' },
  { value: 'lte' as FilterOperator, label: 'less than or equal to' },
  { value: 'between' as FilterOperator, label: 'between' },
  { value: 'not_between' as FilterOperator, label: 'not between' },
];

const booleanOperatorOptions = [
  { value: 'is' as FilterOperator, label: 'is' },
  { value: 'is_not' as FilterOperator, label: 'is not' },
];

const multiselectOperatorOptions = [{ value: 'is' as FilterOperator, label: 'is' }];

const textOperatorOptions = [
  { value: 'contains' as FilterOperator, label: 'contains' },
  { value: 'not_contains' as FilterOperator, label: 'does not contain' },
  { value: 'is' as FilterOperator, label: 'is' },
  { value: 'is_not' as FilterOperator, label: 'is not' },
  { value: 'is_empty' as FilterOperator, label: 'is empty' },
  { value: 'is_not_empty' as FilterOperator, label: 'is not empty' },
];

interface FilterFieldOption2 extends Omit<FilterFieldOption, 'operators'> {
  operators: { value: FilterOperator; label: string }[];
}

const filterFieldOptions: FilterFieldOption2[] = filterFieldConfigs.map((config) => ({
  ...config,
  operators:
    config.type === 'numeric'
      ? numericOperatorOptions
      : config.type === 'multiselect'
        ? multiselectOperatorOptions
        : config.type === 'boolean' || config.type === 'enum'
          ? booleanOperatorOptions
          : textOperatorOptions,
}));

interface MultiFilterPopoverProps {
  filters: FilterCriterion[];
  onFiltersChange: (filters: FilterCriterion[]) => void;
  matchedCount?: number;
  totalCount?: number;
  className?: string;
}

let filterIdCounter = 0;
const generateId = () => `filter-${++filterIdCounter}`;

export function MultiFilterPopover({
  filters,
  onFiltersChange,
  matchedCount,
  totalCount,
  className,
}: MultiFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Per-row field selector combobox state
  const [openFieldSelectorIndex, setOpenFieldSelectorIndex] = useState<number | null>(null);
  const [fieldSelectorQuery, setFieldSelectorQuery] = useState('');
  const fieldSelectorSearchRef = useRef<HTMLInputElement>(null);

  // Per-row multiselect value dropdown state
  const [openMultiselectIndex, setOpenMultiselectIndex] = useState<number | null>(null);
  const [multiselectQuery, setMultiselectQuery] = useState('');
  const multiselectSearchRef = useRef<HTMLInputElement>(null);

  // Auto-open selector when popover opens (only if no filters yet)
  useEffect(() => {
    if (open) {
      if (filters.length === 0) setSelectorOpen(true);
    } else {
      setSelectorOpen(false);
      setSearchQuery('');
      setOpenFieldSelectorIndex(null);
      setFieldSelectorQuery('');
      setOpenMultiselectIndex(null);
      setMultiselectQuery('');
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus search when "Select filter" selector opens
  useEffect(() => {
    if (selectorOpen) {
      const t = setTimeout(() => searchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [selectorOpen]);

  // Focus search when per-row field selector opens
  useEffect(() => {
    if (openFieldSelectorIndex !== null) {
      const t = setTimeout(() => fieldSelectorSearchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [openFieldSelectorIndex]);

  // Focus search when multiselect dropdown opens
  useEffect(() => {
    if (openMultiselectIndex !== null) {
      const t = setTimeout(() => multiselectSearchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [openMultiselectIndex]);

  const activeFields = useMemo(() => new Set(filters.map((f) => f.field)), [filters]);
  const availableFields = useMemo(
    () => filterFieldOptions.filter((opt) => !activeFields.has(opt.field)),
    [activeFields],
  );

  const filteredFields = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableFields;
    return availableFields.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [availableFields, searchQuery]);

  const groupedFields = useMemo(() => {
    return [{ group: '_all', label: '', fields: filteredFields }];
  }, [filteredFields]);

  const handleAddFilter = (field: FilterField) => {
    const fieldOption = filterFieldOptions.find((opt) => opt.field === field);
    if (!fieldOption) return;
    const operator = fieldOption.defaultOperator;
    const value =
      fieldOption.type === 'numeric'
        ? ''
        : fieldOption.type === 'multiselect'
          ? []
          : fieldOption.defaultValue;
    onFiltersChange([
      ...filters,
      {
        id: generateId(),
        field,
        operator,
        value,
      },
    ]);
    setSelectorOpen(false);
    setSearchQuery('');
  };

  const handleRemoveFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: FilterField) => {
    const fieldOption = filterFieldOptions.find((opt) => opt.field === field);
    if (!fieldOption) return;
    const operator = fieldOption.defaultOperator;
    const value =
      fieldOption.type === 'numeric'
        ? ''
        : fieldOption.type === 'multiselect'
          ? []
          : fieldOption.defaultValue;
    const newFilters = [...filters];
    newFilters[index] = {
      ...newFilters[index],
      field,
      operator,
      value,
    };
    onFiltersChange(newFilters);
  };

  const handleOperatorChange = (index: number, operator: FilterOperator) => {
    const newFilters = [...filters];
    const prev = newFilters[index];
    let value = prev.value;
    if (operator === 'between' || operator === 'not_between') {
      // switching to range — seed from current single value if possible
      const num = typeof value === 'number' ? value : 0;
      value = { min: num, max: num };
    } else if (prev.operator === 'between' || prev.operator === 'not_between') {
      // switching away from range — use min as the single value
      value = typeof value === 'object' && !Array.isArray(value) ? value.min : '';
    } else if (operator === 'is_empty' || operator === 'is_not_empty') {
      value = '';
    }
    newFilters[index] = { ...prev, operator, value };
    onFiltersChange(newFilters);
  };

  const handleValueChange = (index: number, value: string | number | FilterRangeValue) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], value };
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onFiltersChange([]);
    setSelectorOpen(true);
    setSearchQuery('');
  };

  const getFieldOption = (field: FilterField) =>
    filterFieldOptions.find((opt) => opt.field === field);

  const needsValueInput = (operator: FilterOperator) =>
    !['is_empty', 'is_not_empty'].includes(operator);

  const isRangeOperator = (operator: FilterOperator) =>
    operator === 'between' || operator === 'not_between';

  const showCount =
    filters.filter(isFilterComplete).length > 0 &&
    matchedCount !== undefined &&
    totalCount !== undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn('gap-2 aria-expanded:bg-white', className)}
            aria-label="Filter students"
            aria-expanded={open}
          />
        }
      >
        <Filter className="h-4 w-4" />
        Filter
        {filters.filter(isFilterComplete).length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {filters.filter(isFilterComplete).length}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[660px] gap-0 p-0" align="start">
        {/* Header */}
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold">
            Show records
            {showCount && (
              <span className="ml-1.5 font-normal text-muted-foreground">
                ({matchedCount} of {totalCount} found)
              </span>
            )}
          </h3>
        </div>

        {/* Active filter rows */}
        {filters.length > 0 && (
          <div className="space-y-2 px-5 pb-3">
            {filters.map((filter, index) => {
              const fieldOption = getFieldOption(filter.field);
              return (
                <div key={filter.id} className="flex items-center gap-2">
                  {/* Where / and label */}
                  <span className="w-12 shrink-0 text-sm text-muted-foreground">
                    {index === 0 ? 'Where' : 'and'}
                  </span>

                  {/* Field selector – same combobox as "Select filter" */}
                  {(() => {
                    const isOpen = openFieldSelectorIndex === index;
                    const rowFields = filterFieldOptions.filter(
                      (opt) => opt.field === filter.field || !activeFields.has(opt.field),
                    );
                    const q = fieldSelectorQuery.trim().toLowerCase();
                    const visibleFields = q
                      ? rowFields.filter((opt) => opt.label.toLowerCase().includes(q))
                      : rowFields;
                    return (
                      <Popover
                        open={isOpen}
                        onOpenChange={(v) => {
                          setOpenFieldSelectorIndex(v ? index : null);
                          if (!v) setFieldSelectorQuery('');
                        }}
                      >
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              className="flex h-9 w-[152px] shrink-0 items-center justify-between gap-1.5 rounded-[14px] border border-input bg-white px-3 text-sm outline-none"
                            />
                          }
                        >
                          <span className="flex-1 truncate text-left">{fieldOption?.label}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </PopoverTrigger>
                        <PopoverContent className="w-[480px] gap-0 p-3" align="start">
                          <div className="mb-1 flex items-center gap-2 rounded-lg border border-blue-400 px-3 py-2 focus-within:border-blue-500">
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <input
                              ref={fieldSelectorSearchRef}
                              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                              placeholder="Search options"
                              value={fieldSelectorQuery}
                              onChange={(e) => setFieldSelectorQuery(e.target.value)}
                            />
                          </div>
                          <ScrollArea className="h-[220px]">
                            <div className="py-1">
                              {visibleFields.map((opt) => (
                                <button
                                  key={opt.field}
                                  type="button"
                                  onClick={() => {
                                    handleFieldChange(index, opt.field);
                                    setOpenFieldSelectorIndex(null);
                                    setFieldSelectorQuery('');
                                  }}
                                  className={cn(
                                    'w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent',
                                    opt.field === filter.field && 'font-medium',
                                  )}
                                >
                                  {opt.label}
                                </button>
                              ))}
                              {visibleFields.length === 0 && (
                                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                  No filters found
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}

                  {/* Operator selector */}
                  <Select
                    value={filter.operator}
                    onValueChange={(value) => handleOperatorChange(index, value as FilterOperator)}
                  >
                    <SelectTrigger className="w-[104px] shrink-0 rounded-[14px] bg-white">
                      <SelectValue>
                        {fieldOption?.operators.find((o) => o.value === filter.operator)?.label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="min-w-max" align="start" alignItemWithTrigger={false}>
                      {fieldOption?.operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value input */}
                  <div className="w-[240px] shrink-0">
                    {needsValueInput(filter.operator) && (
                      <>
                        {fieldOption?.type === 'multiselect' ? (
                          // Multi-select dropdown
                          (() => {
                            const isOpen = openMultiselectIndex === index;
                            const selectedValues = Array.isArray(filter.value) ? filter.value : [];
                            const q = multiselectQuery.trim().toLowerCase();
                            const sortedEnumValues = [
                              ...((fieldOption.enumValues ?? []).includes('-') ? ['-'] : []),
                              ...(fieldOption.enumValues ?? []).filter((v) => v !== '-'),
                            ];
                            const visibleOptions = q
                              ? sortedEnumValues.filter((v) => v.toLowerCase().includes(q))
                              : sortedEnumValues;
                            const allSelected =
                              visibleOptions.length > 0 &&
                              visibleOptions.every((v) => selectedValues.includes(v));
                            const toggleValue = (v: string) => {
                              const next = selectedValues.includes(v)
                                ? selectedValues.filter((s) => s !== v)
                                : [...selectedValues, v];
                              handleValueChange(index, next);
                            };
                            const toggleAll = () => {
                              if (allSelected) {
                                handleValueChange(
                                  index,
                                  selectedValues.filter((v) => !visibleOptions.includes(v)),
                                );
                              } else {
                                const next = [...new Set([...selectedValues, ...visibleOptions])];
                                handleValueChange(index, next);
                              }
                            };
                            return (
                              <Popover
                                open={isOpen}
                                onOpenChange={(v) => {
                                  setOpenMultiselectIndex(v ? index : null);
                                  if (!v) setMultiselectQuery('');
                                }}
                              >
                                <PopoverTrigger
                                  render={
                                    <button
                                      type="button"
                                      className={cn(
                                        'flex h-9 w-full items-center justify-between gap-1.5 rounded-[14px] border border-input bg-white px-3 text-sm outline-none',
                                        selectedValues.length === 0 && 'text-muted-foreground',
                                      )}
                                    />
                                  }
                                >
                                  <span className="flex-1 truncate text-left">
                                    {selectedValues.length === 0
                                      ? 'Select option'
                                      : selectedValues.length === 1
                                        ? selectedValues[0]
                                        : `${selectedValues.length} selected`}
                                  </span>
                                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </PopoverTrigger>
                                <PopoverContent className="w-[260px] gap-0 p-0" align="start">
                                  {/* Header */}
                                  <div className="flex items-center justify-between border-b px-3 py-2.5">
                                    <span className="text-sm font-semibold">
                                      {fieldOption.label}
                                    </span>
                                    {visibleOptions.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={toggleAll}
                                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                      >
                                        <div
                                          className={cn(
                                            'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border',
                                            allSelected
                                              ? 'border-primary bg-primary text-primary-foreground'
                                              : 'border-input',
                                          )}
                                        >
                                          {allSelected && <Check className="h-2.5 w-2.5" />}
                                        </div>
                                        Select all
                                      </button>
                                    )}
                                  </div>
                                  {/* Search */}
                                  <div className="flex items-center gap-2 border-b px-3 py-2">
                                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <input
                                      ref={multiselectSearchRef}
                                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                      placeholder="Search options"
                                      value={multiselectQuery}
                                      onChange={(e) => setMultiselectQuery(e.target.value)}
                                    />
                                  </div>
                                  <ScrollArea className="max-h-[220px]">
                                    <div className="py-1">
                                      {visibleOptions.map((v) => {
                                        const checked = selectedValues.includes(v);
                                        return (
                                          <button
                                            key={v}
                                            type="button"
                                            onClick={() => toggleValue(v)}
                                            className={cn(
                                              'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent',
                                              checked && 'bg-accent/50',
                                            )}
                                          >
                                            <div
                                              className={cn(
                                                'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                                                checked
                                                  ? 'border-primary bg-primary text-primary-foreground'
                                                  : 'border-input',
                                              )}
                                            >
                                              {checked && <Check className="h-3 w-3" />}
                                            </div>
                                            {v}
                                          </button>
                                        );
                                      })}
                                      {visibleOptions.length === 0 && (
                                        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                          No options found
                                        </div>
                                      )}
                                    </div>
                                  </ScrollArea>
                                </PopoverContent>
                              </Popover>
                            );
                          })()
                        ) : fieldOption?.type === 'numeric' ? (
                          isRangeOperator(filter.operator) ? (
                            // Numerical - range
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="number"
                                value={
                                  typeof filter.value === 'object' && !Array.isArray(filter.value)
                                    ? filter.value.min
                                    : 0
                                }
                                onChange={(e) =>
                                  handleValueChange(index, {
                                    ...(typeof filter.value === 'object' &&
                                    !Array.isArray(filter.value)
                                      ? filter.value
                                      : { min: 0, max: 0 }),
                                    min: Number(e.target.value),
                                  })
                                }
                                placeholder="Enter number"
                                className="w-full rounded-[14px]"
                              />
                              <span className="shrink-0 text-sm text-muted-foreground">–</span>
                              <Input
                                type="number"
                                value={
                                  typeof filter.value === 'object' && !Array.isArray(filter.value)
                                    ? filter.value.max
                                    : 0
                                }
                                onChange={(e) =>
                                  handleValueChange(index, {
                                    ...(typeof filter.value === 'object' &&
                                    !Array.isArray(filter.value)
                                      ? filter.value
                                      : { min: 0, max: 0 }),
                                    max: Number(e.target.value),
                                  })
                                }
                                placeholder="Enter number"
                                className="w-full rounded-[14px]"
                              />
                            </div>
                          ) : (
                            // Numerical - not range
                            <Input
                              type="number"
                              value={typeof filter.value === 'number' ? filter.value : ''}
                              onChange={(e) =>
                                handleValueChange(
                                  index,
                                  e.target.value === '' ? '' : Number(e.target.value),
                                )
                              }
                              placeholder="Enter number"
                              className="w-full rounded-[14px]"
                            />
                          )
                        ) : fieldOption?.type === 'boolean' || fieldOption?.type === 'enum' ? (
                          // Fixed option dropdown
                          <Select
                            value={String(filter.value)}
                            onValueChange={(value) => handleValueChange(index, value)}
                          >
                            <SelectTrigger className="w-full rounded-[14px] bg-white">
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
                          // Free text
                          <Input
                            type="text"
                            value={String(filter.value)}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            placeholder="Enter value"
                            className="w-full rounded-[14px]"
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(index)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Select filter row – shown when no filters or when adding */}
        {(filters.length === 0 || selectorOpen) && (
          <div className={cn('px-5 pb-3', filters.length > 0 && 'pt-1')}>
            <div className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-sm text-muted-foreground">
                {filters.length === 0 ? 'Where' : 'and'}
              </span>
              <div className="w-[152px] shrink-0">
                <Popover
                  open={selectorOpen}
                  onOpenChange={(v) => {
                    setSelectorOpen(v);
                    if (!v) setSearchQuery('');
                  }}
                >
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-[14px] border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
                      />
                    }
                  >
                    Select filter
                    {selectorOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-[582px] gap-0 p-3" align="start">
                    {/* Search */}
                    <div className="mb-1 flex items-center gap-2 rounded-lg border border-blue-400 px-3 py-2 focus-within:border-blue-500">
                      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <input
                        ref={searchRef}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="Search options"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* List */}
                    <ScrollArea className="h-[220px]">
                      <div className="py-1">
                        {groupedFields.map(({ group, label, fields }) => (
                          <div key={group}>
                            {label && (
                              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                                {label}
                              </div>
                            )}
                            {fields.map((opt) => (
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
                        ))}
                        {filteredFields.length === 0 && (
                          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                            No filters found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3">
          {availableFields.length > 0 && !selectorOpen ? (
            <Button
              variant="secondary"
              size="sm"
              className="-ml-2 gap-1.5 font-semibold"
              onClick={() => setSelectorOpen(true)}
            >
              <Plus className="h-4 w-4 text-[var(--slate-11)]" />
              Add filter
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={filters.length === 0}
            className="gap-2 text-sm font-medium text-[var(--slate-12)]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
