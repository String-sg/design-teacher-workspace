import { useMemo, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

import type { SchoolLevel } from '@/types/report'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { groupedClassOptions } from '@/data/mock-students'

interface ClassSelectorProps {
  value: string
  onValueChange: (value: string) => void
  schoolLevel?: SchoolLevel
  onSchoolLevelChange?: (level: SchoolLevel) => void
  className?: string
}

function getClassLabel(level: string, classValue: string) {
  // Primary classes already have descriptive values (P6-B, P5-A, etc.)
  if (classValue.startsWith('P')) return classValue
  // Secondary: "Secondary 3" + "3A" → strip leading digit → "Secondary 3A"
  return `${level} ${classValue.replace(/^\d+/, '')}`
}

export function ClassSelector({
  value,
  onValueChange,
  schoolLevel,
  onSchoolLevelChange,
  className,
}: ClassSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedLevel = useMemo(() => {
    if (value === 'all') return 'School'
    for (const group of groupedClassOptions) {
      if (group.classes.some((c) => c.value === value)) {
        return group.level
      }
      if (group.level === value) {
        return group.level
      }
    }
    return value
  }, [value])

  const filteredByLevel = useMemo(() => {
    if (!schoolLevel) return groupedClassOptions
    const prefix = schoolLevel === 'primary' ? 'Primary' : 'Secondary'
    return groupedClassOptions.filter((g) => g.level.startsWith(prefix))
  }, [schoolLevel])

  const filteredGroups = useMemo(() => {
    if (!search) return filteredByLevel

    const query = search.toLowerCase()
    return filteredByLevel
      .map((group) => {
        const levelMatches = group.level.toLowerCase().includes(query)
        const matchingClasses = group.classes.filter((c) => {
          const fullLabel = getClassLabel(group.level, c.value).toLowerCase()
          return (
            c.label.toLowerCase().includes(query) ||
            c.value.toLowerCase().includes(query) ||
            fullLabel.includes(query)
          )
        })

        if (levelMatches) {
          return group
        }
        if (matchingClasses.length > 0) {
          return { ...group, classes: matchingClasses }
        }
        return null
      })
      .filter(Boolean) as typeof groupedClassOptions
  }, [search, filteredByLevel])

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              'h-auto gap-2 p-0 text-2xl font-semibold hover:bg-transparent',
              className,
            )}
          />
        }
      >
        {selectedLevel}
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        className="w-64 gap-0 overflow-hidden rounded-2xl p-0"
        align="start"
      >
        {/* School level toggle */}
        {schoolLevel && onSchoolLevelChange && (
          <div className="mx-2 mt-2 flex rounded-full bg-muted p-[3px]">
            <button
              type="button"
              onClick={() => onSchoolLevelChange('primary')}
              className={cn(
                'flex-1 rounded-full px-3 py-1 text-sm font-medium transition-all',
                schoolLevel === 'primary'
                  ? 'bg-background/90 text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground/80',
              )}
            >
              Primary
            </button>
            <button
              type="button"
              onClick={() => onSchoolLevelChange('secondary')}
              className={cn(
                'flex-1 rounded-full px-3 py-1 text-sm font-medium transition-all',
                schoolLevel === 'secondary'
                  ? 'bg-background/90 text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground/80',
              )}
            >
              Secondary
            </button>
          </div>
        )}


        {/* Search input */}
        <div className="p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search filters"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="max-h-72 overflow-y-auto p-1">
          {/* School group header */}
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className={cn(
              'inline-flex w-full items-center gap-2 rounded-lg p-2 text-base font-medium leading-6 text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground',
              value === 'all' && 'bg-accent text-accent-foreground',
            )}
          >
            <span className="line-clamp-1 flex-1 text-left">School</span>
            {value === 'all' && <Check className="ml-auto h-4 w-4 shrink-0" />}
          </button>

          {filteredGroups.map((group, index) => (
            <div key={group.level}>
              {index > 0 && <div className="my-1 h-px bg-border/50" />}

              {/* Level row */}
              <button
                type="button"
                onClick={() => handleSelect(group.level)}
                className={cn(
                  'inline-flex w-full items-center gap-2 rounded-lg p-2 text-base font-normal leading-6 outline-none hover:bg-accent',
                  value === group.level && 'bg-accent font-semibold',
                )}
              >
                <span className="line-clamp-1 flex-1 text-left">
                  {group.level}
                </span>
                {value === group.level && (
                  <Check className="ml-auto h-4 w-4 shrink-0" />
                )}
              </button>

              {/* Class rows */}
              {group.classes.map((classOption) => {
                const isSelected = value === classOption.value
                return (
                  <button
                    key={classOption.value}
                    type="button"
                    onClick={() => handleSelect(classOption.value)}
                    className={cn(
                      'inline-flex w-full items-center gap-2 rounded-lg p-2 text-base font-normal leading-6 outline-none hover:bg-accent',
                      isSelected && 'bg-accent font-semibold',
                    )}
                  >
                    <span className="line-clamp-1 flex-1 text-left">
                      {getClassLabel(group.level, classOption.value)}
                    </span>
                    {isSelected && (
                      <Check className="ml-auto h-4 w-4 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
