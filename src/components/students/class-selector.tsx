import { useMemo, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

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
  className,
}: ClassSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedLevel = useMemo(() => {
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

  const filteredGroups = useMemo(() => {
    if (!search) return groupedClassOptions

    const query = search.toLowerCase()
    return groupedClassOptions
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
  }, [search])

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
      <PopoverContent className="w-64 overflow-hidden rounded-2xl p-0" align="start">
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
          <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
            School
          </div>

          {filteredGroups.map((group, index) => (
            <div key={group.level}>
              {index > 0 && <div className="my-1 h-px bg-border/50" />}

              {/* Level row */}
              <button
                type="button"
                onClick={() => handleSelect(group.level)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent',
                  value === group.level && 'bg-accent font-semibold',
                )}
              >
                {group.level}
                {value === group.level && (
                  <Check className="h-4 w-4 shrink-0" />
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
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent',
                      isSelected && 'bg-accent font-semibold',
                    )}
                  >
                    {getClassLabel(group.level, classOption.value)}
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
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
