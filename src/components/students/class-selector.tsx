import { useState, useMemo } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

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
        const matchingClasses = group.classes.filter(
          (c) =>
            c.label.toLowerCase().includes(query) ||
            c.value.toLowerCase().includes(query),
        )

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
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search class, level, school"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto border-t px-1 pb-2">
          <div className="px-3 py-2 text-sm font-semibold text-foreground">
            School
          </div>
          {filteredGroups.map((group) => (
            <div key={group.level}>
              <button
                type="button"
                onClick={() => handleSelect(group.level)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-sm font-semibold hover:bg-accent rounded-md',
                  value === group.level && 'bg-accent',
                )}
              >
                {group.level}
                {value === group.level && (
                  <Check className="h-4 w-4 text-foreground" />
                )}
              </button>
              {group.classes.map((classOption) => (
                <button
                  key={classOption.value}
                  type="button"
                  onClick={() => handleSelect(classOption.value)}
                  className={cn(
                    'flex w-full items-center justify-between py-2 pl-6 pr-3 text-sm hover:bg-accent rounded-md',
                    value === classOption.value && 'bg-accent',
                  )}
                >
                  {classOption.label}
                  {value === classOption.value && (
                    <Check className="h-4 w-4 text-foreground" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
