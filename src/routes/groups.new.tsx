import { useMemo, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, FileUp, Search } from 'lucide-react'

import type { StudentGroup } from '@/types/student-group'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { MOCK_GROUPS } from '@/data/mock-groups'
import { CLASS_GROUPS } from '@/data/mock-student-groups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/groups/new')({
  component: GroupsNew,
})

// ─── Build a flat picker list from all 12 class groups ───────────────────────

type PickerStudent = {
  id: string
  name: string
  class: string
  level: number
  nric: string
  indexNumber: number
}

const ALL_SCHOOL_STUDENTS: Array<PickerStudent> = CLASS_GROUPS.flatMap(
  (group) =>
    (group.memberDetails ?? []).map((d) => ({
      id: `${group.label}:${d.index}:${d.name}`,
      name: d.name,
      class: group.label,
      level: Number(group.label.match(/^(\d+)/)?.[1] ?? 0),
      nric: d.nric ?? '',
      indexNumber: d.index ?? 0,
    })),
)

// ─── Level tabs ───────────────────────────────────────────────────────────────

const LEVEL_TABS = [
  { id: 'all', label: 'All' },
  { id: '1', label: 'Sec 1' },
  { id: '2', label: 'Sec 2' },
  { id: '3', label: 'Sec 3' },
  { id: '4', label: 'Sec 4' },
]

// ─── Component ────────────────────────────────────────────────────────────────

function GroupsNew() {
  useSetBreadcrumbs([
    { label: 'Student Groups', href: '/groups' },
    { label: 'New Group', href: '/groups/new' },
  ])

  const navigate = useNavigate()
  const listRef = useRef<HTMLDivElement>(null)

  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [levelTab, setLevelTab] = useState('all')
  const [search, setSearch] = useState('')

  // Filter students by level + search
  const visibleStudents = useMemo(() => {
    let list = ALL_SCHOOL_STUDENTS
    if (levelTab !== 'all') {
      list = list.filter((s) => String(s.level) === levelTab)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nric.toLowerCase().includes(q),
      )
    }
    return list
  }, [levelTab, search])

  // Group visible students by class
  const groupedByClass = useMemo(() => {
    const map = new Map<string, Array<PickerStudent>>()
    for (const s of visibleStudents) {
      if (!map.has(s.class)) map.set(s.class, [])
      map.get(s.class)!.push(s)
    }
    // Sort within each class by index number
    for (const arr of map.values()) arr.sort((a, b) => a.indexNumber - b.indexNumber)
    // Return as sorted array of [className, students]
    return [...map.entries()].sort(([a], [b]) => {
      const parse = (l: string) => {
        const m = l.match(/^(\d+)\s+(.+)/)
        return m ? [Number(m[1]), m[2]] as [number, string] : [99, l] as [number, string]
      }
      const [al, an] = parse(a)
      const [bl, bn] = parse(b)
      return al !== bl ? al - bl : an.localeCompare(bn)
    })
  }, [visibleStudents])

  const totalVisible = visibleStudents.length
  const totalSelected = selectedIds.size
  const canSave = groupName.trim().length > 0 && totalSelected > 0

  function toggleStudent(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAllInClass(students: Array<PickerStudent>) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      students.forEach((s) => next.add(s.id))
      return next
    })
  }

  function deselectAllInClass(students: Array<PickerStudent>) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      students.forEach((s) => next.delete(s.id))
      return next
    })
  }

  function selectAllVisible() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      visibleStudents.forEach((s) => next.add(s.id))
      return next
    })
  }

  function handleSave() {
    if (!canSave) return

    const selectedStudents = ALL_SCHOOL_STUDENTS.filter((s) =>
      selectedIds.has(s.id),
    )
    const newGroup: StudentGroup = {
      id: `cg:${Date.now()}`,
      name: groupName.trim(),
      description: description.trim() || undefined,
      members: selectedStudents.map((s) => ({
        id: s.id,
        name: s.name,
        class: s.class,
        nric: s.nric,
        indexNumber: s.indexNumber,
      })),
      visibility: 'private',
      sharedWith: [],
      createdBy: { name: 'Mrs Tan Mei Lin', email: 'tanml@school.edu.sg' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    MOCK_GROUPS.push(newGroup)
    navigate({ to: '/groups/$groupId', params: { groupId: newGroup.id } })
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-6 space-y-5">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            render={<Link to="/groups" />}
          >
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">New Student Group</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" render={<Link to="/groups" />}>
            Cancel
          </Button>
          <Button size="sm" disabled={!canSave} onClick={handleSave}>
            Save Group
          </Button>
        </div>
      </div>

      {/* ── Card 1: Group details ─────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div>
          <h2 className="font-medium">Group details</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Give your group a name so it's easy to find when selecting recipients.
          </p>
        </div>
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="group-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="group-name"
              placeholder="e.g. Drama Festival Cast"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value.slice(0, 60))}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {groupName.length}/60
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="group-description">
              Description{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="group-description"
              placeholder="Briefly describe who's in this group..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/200
            </p>
          </div>
        </div>
      </div>

      {/* ── Card 2: Member selection ──────────────────────────────────────── */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <div>
            <h2 className="font-medium">Select members</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ALL_SCHOOL_STUDENTS.length} students across{' '}
              {CLASS_GROUPS.length} classes
            </p>
          </div>
          {totalSelected > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-600">
                {totalSelected} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 text-xs"
                onClick={() => setSelectedIds(new Set())}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Filter toolbar */}
        <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b bg-muted/30">
          {/* Level tabs */}
          <div className="flex items-center gap-1">
            {LEVEL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLevelTab(tab.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  levelTab === tab.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-5" />

          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or NRIC…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>

          {/* Select all visible */}
          {totalVisible > 0 && (
            <button
              type="button"
              onClick={selectAllVisible}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
            >
              Select all ({totalVisible})
            </button>
          )}
        </div>

        {/* Student list */}
        <div ref={listRef} className="max-h-[480px] overflow-y-auto">
          {groupedByClass.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No students match your filter.
            </p>
          ) : (
            groupedByClass.map(([className, students]) => {
              const allClassSelected = students.every((s) =>
                selectedIds.has(s.id),
              )
              const someClassSelected = students.some((s) =>
                selectedIds.has(s.id),
              )

              return (
                <div key={className}>
                  {/* Class section header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between bg-muted/60 px-6 py-2 backdrop-blur-sm border-b">
                    <span className="text-xs font-semibold text-foreground">
                      {className}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {students.length} students
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          allClassSelected
                            ? deselectAllInClass(students)
                            : selectAllInClass(students)
                        }
                        className={cn(
                          'text-xs font-medium',
                          allClassSelected || someClassSelected
                            ? 'text-blue-600 hover:text-blue-700'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {allClassSelected ? 'Deselect all' : 'Select all'}
                      </button>
                    </div>
                  </div>

                  {/* Students in this class */}
                  <div className="divide-y">
                    {students.map((student) => {
                      const isSelected = selectedIds.has(student.id)
                      return (
                        <label
                          key={student.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-4 px-6 py-2.5 transition-colors hover:bg-muted/40',
                            isSelected && 'bg-blue-50/60',
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />
                          <span className="w-9 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                            #{String(student.indexNumber).padStart(2, '0')}
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {student.name}
                          </span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {student.nric}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Card footer: selection summary */}
        <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-3">
          <span className="text-sm text-muted-foreground">
            {totalSelected === 0
              ? 'No students selected yet'
              : `${totalSelected} student${totalSelected !== 1 ? 's' : ''} selected`}
          </span>
          <Button
            size="sm"
            disabled={!canSave}
            onClick={handleSave}
          >
            Save Group
          </Button>
        </div>
      </div>

      {/* Coming soon: template import */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <FileUp className="size-3.5 shrink-0" />
        <span>
          Import from Excel or CSV template —{' '}
          <span className="font-medium">coming soon</span>
        </span>
      </div>
    </div>
  )
}
