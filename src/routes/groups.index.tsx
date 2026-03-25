import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Copy,
  Edit2,
  Filter,
  Info,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  Users,
} from 'lucide-react'

import type {
  GroupTypeFilterOption,
  StudentGroup,
  StructuredGroup,
} from '@/types/student-group'
import { getStructuredTypeLabel } from '@/types/student-group'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { MOCK_GROUPS, MOCK_SHARED_GROUPS } from '@/data/mock-groups'
import { TEACHER_STRUCTURED_GROUPS } from '@/data/mock-structured-groups'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/empty-state'

export const Route = createFileRoute('/groups/')({
  component: GroupsIndex,
})

const CURRENT_USER_EMAIL = 'tanml@school.edu.sg'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUniqueClasses(members: StudentGroup['members']): string[] {
  const seen = new Set<string>()
  for (const m of members) seen.add(m.class)
  return [...seen].sort()
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

// ─── Type filter popover (Assigned Groups tab) ─────────────────────────────────

const STRUCTURED_FILTER_OPTIONS: Array<{
  value: Exclude<GroupTypeFilterOption, 'regular'>
  label: string
}> = [
  { value: 'class', label: 'Class' },
  { value: 'level', label: 'Level' },
  { value: 'cca', label: 'CCA' },
  { value: 'teaching', label: 'Teaching Group' },
]

interface TypeFilterPopoverProps {
  value: Set<Exclude<GroupTypeFilterOption, 'regular'>>
  onChange: (v: Set<Exclude<GroupTypeFilterOption, 'regular'>>) => void
}

function TypeFilterPopover({ value, onChange }: TypeFilterPopoverProps) {
  function toggle(opt: Exclude<GroupTypeFilterOption, 'regular'>) {
    const next = new Set(value)
    if (next.has(opt)) next.delete(opt)
    else next.add(opt)
    onChange(next)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-4" />
            Filter
            {value.size > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {value.size}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-44 p-2">
        <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Group type
        </p>
        {STRUCTURED_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors',
              value.has(opt.value)
                ? 'bg-primary/10 font-medium text-primary'
                : 'hover:bg-muted',
            )}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded border',
                value.has(opt.value)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input',
              )}
            >
              {value.has(opt.value) && (
                <svg
                  viewBox="0 0 10 10"
                  className="size-2.5"
                  fill="currentColor"
                >
                  <path
                    d="M1.5 5L4 7.5L8.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {opt.label}
          </button>
        ))}
        {value.size > 0 && (
          <button
            type="button"
            onClick={() => onChange(new Set())}
            className="mt-1.5 w-full rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filter
          </button>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ─── Classes pill list ─────────────────────────────────────────────────────────

function ClassPills({
  members,
}: {
  members: StudentGroup['members'] | StructuredGroup['members']
}) {
  const classes = getUniqueClasses(members as StudentGroup['members'])
  const visible = classes.slice(0, 3)
  const hidden = classes.length - 3
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((cls) => (
        <span
          key={cls}
          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {cls}
        </span>
      ))}
      {hidden > 0 && (
        <span className="text-xs text-muted-foreground">+{hidden}</span>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

function GroupsIndex() {
  useSetBreadcrumbs([{ label: 'Groups', href: '/groups' }])

  const [groups, setGroups] = useState<Array<StudentGroup>>(MOCK_GROUPS)
  const [mySearch, setMySearch] = useState('')
  const [chipFilter, setChipFilter] = useState<'all' | 'mine' | 'shared'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [assignedSearch, setAssignedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    Set<Exclude<GroupTypeFilterOption, 'regular'>>
  >(new Set())

  const filteredCombinedGroups = useMemo(() => {
    const mine = groups
      .filter((g) => g.createdBy.email === CURRENT_USER_EMAIL)
      .map((g) => ({ ...g, _source: 'mine' as const }))
    const shared = MOCK_SHARED_GROUPS.map((g) => ({
      ...g,
      _source: 'shared' as const,
    }))
    const combined =
      chipFilter === 'mine'
        ? mine
        : chipFilter === 'shared'
          ? shared
          : [...mine, ...shared]
    if (!mySearch) return combined
    const q = mySearch.toLowerCase()
    return combined.filter((g) => g.name.toLowerCase().includes(q))
  }, [groups, mySearch, chipFilter])

  const filteredAssignedGroups = useMemo(
    () =>
      TEACHER_STRUCTURED_GROUPS.filter((g) => {
        const matchesSearch =
          !assignedSearch ||
          g.name.toLowerCase().includes(assignedSearch.toLowerCase())
        const matchesType =
          typeFilter.size === 0 || typeFilter.has(g.structuredType)
        return matchesSearch && matchesType
      }),
    [assignedSearch, typeFilter],
  )

  function confirmDelete() {
    if (deleteId) {
      setGroups((prev) => prev.filter((g) => g.id !== deleteId))
      const idx = MOCK_GROUPS.findIndex((g) => g.id === deleteId)
      if (idx !== -1) MOCK_GROUPS.splice(idx, 1)
      setDeleteId(null)
    }
  }

  const deleteGroup = groups.find((g) => g.id === deleteId)

  return (
    <div className="flex flex-col">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Groups</h1>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-900">
              Concept illustration
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Organise students into reusable groups for announcements, forms, and
            reports.
          </p>
        </div>
        <Button render={<Link to="/groups/new" />} className="gap-2 shrink-0">
          <Plus className="size-4" />
          New Group
        </Button>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="my-groups" className="flex flex-col flex-1">
        <div className="px-6">
          <TabsList variant="line">
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Groups</TabsTrigger>
          </TabsList>
        </div>
        <Separator />

        {/* ── My Groups tab ───────────────────────────────────────────────── */}
        <TabsContent value="my-groups">
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="relative w-[240px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search groups…"
                value={mySearch}
                onChange={(e) => setMySearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 px-6 pb-4">
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'mine', label: 'Created by me' },
                { value: 'shared', label: 'Shared with me' },
              ] as const
            ).map((chip) => (
              <button
                key={chip.value}
                type="button"
                onClick={() => setChipFilter(chip.value)}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  chipFilter === chip.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-muted-foreground hover:bg-muted',
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {filteredCombinedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <EmptyState
                title={
                  mySearch || chipFilter !== 'all'
                    ? 'No groups match your search'
                    : 'No groups yet'
                }
                description={
                  mySearch || chipFilter !== 'all'
                    ? 'Try a different name or filter.'
                    : 'Create a group to reuse student lists across announcements, forms, and reports.'
                }
              />
              {!mySearch && chipFilter === 'all' && (
                <Button
                  className="mt-4 gap-2"
                  render={<Link to="/groups/new" />}
                >
                  <Plus className="size-4" />
                  Create your first group
                </Button>
              )}
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <Table tableClassName="table-fixed w-full">
                <TableHeader className="border-b bg-white">
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead className="w-24">Members</TableHead>
                    <TableHead className="w-[160px]">Classes</TableHead>
                    <TableHead className="w-32">Last updated</TableHead>
                    <TableHead className="w-36">Created by</TableHead>
                    <TableHead className="pr-6 w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCombinedGroups.map((group) => {
                    const isShared = group._source === 'shared'
                    const sharedRole = isShared
                      ? group.sharedWith.find(
                          (s) => s.email === CURRENT_USER_EMAIL,
                        )?.role
                      : undefined
                    return (
                      <TableRow key={group.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2 min-w-0">
                            <Link
                              to="/groups/$groupId"
                              params={{ groupId: group.id }}
                              className="font-medium hover:underline truncate"
                            >
                              {group.name}
                            </Link>
                            {isShared && (
                              <Badge
                                variant="outline"
                                className="text-xs py-0 text-muted-foreground shrink-0"
                              >
                                {sharedRole === 'editor' ? 'Editor' : 'Viewer'}
                              </Badge>
                            )}
                            {!isShared && group.visibility === 'school' && (
                              <Badge
                                variant="outline"
                                className="text-xs py-0 shrink-0"
                              >
                                School-wide
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="size-3.5 shrink-0" />
                            {group.members.length}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ClassPills members={group.members} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatRelativeDate(group.updatedAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground truncate">
                          {group.createdBy.name}
                        </TableCell>
                        <TableCell className="pr-6">
                          {!isShared ? (
                            // Owner: full dropdown
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Actions</span>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  render={
                                    <Link
                                      to="/groups/$groupId"
                                      params={{ groupId: group.id }}
                                    />
                                  }
                                >
                                  <Edit2 className="size-3.5" />
                                  Edit group
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  render={
                                    <Link
                                      to="/groups/$groupId"
                                      params={{ groupId: group.id }}
                                    />
                                  }
                                >
                                  <Share2 className="size-3.5" />
                                  Share group
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    const src = MOCK_GROUPS.find(
                                      (g) => g.id === group.id,
                                    )
                                    if (src) {
                                      const copy = {
                                        ...src,
                                        id: `cg-${Date.now()}`,
                                        name: `${src.name} (copy)`,
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                        lastUsedAt: undefined,
                                      }
                                      MOCK_GROUPS.push(copy)
                                      setGroups([...MOCK_GROUPS])
                                    }
                                  }}
                                >
                                  <Copy className="size-3.5" />
                                  Make a copy
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteId(group.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                  Delete group
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : sharedRole === 'editor' ? (
                            // Shared editor: Edit + Make a copy
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Actions</span>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  render={
                                    <Link
                                      to="/groups/$groupId"
                                      params={{ groupId: group.id }}
                                    />
                                  }
                                >
                                  <Edit2 className="size-3.5" />
                                  Edit group
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const { _source, ...groupData } = group
                                    const copy = {
                                      ...groupData,
                                      id: `cg-${Date.now()}`,
                                      name: `${group.name} (copy)`,
                                      createdBy: {
                                        name: 'Mrs Tan Mei Lin',
                                        email: CURRENT_USER_EMAIL,
                                      },
                                      sharedWith: [],
                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString(),
                                      lastUsedAt: undefined,
                                    }
                                    MOCK_GROUPS.push(copy)
                                    setGroups([...MOCK_GROUPS])
                                  }}
                                >
                                  <Copy className="size-3.5" />
                                  Make a copy
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            // Shared viewer: copy icon only
                            <button
                              type="button"
                              title="Make a copy"
                              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
                              onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                const { _source, ...groupData } = group
                                const copy = {
                                  ...groupData,
                                  id: `cg-${Date.now()}`,
                                  name: `${group.name} (copy)`,
                                  createdBy: {
                                    name: 'Mrs Tan Mei Lin',
                                    email: CURRENT_USER_EMAIL,
                                  },
                                  sharedWith: [],
                                  createdAt: new Date().toISOString(),
                                  updatedAt: new Date().toISOString(),
                                  lastUsedAt: undefined,
                                }
                                MOCK_GROUPS.push(copy)
                                setGroups([...MOCK_GROUPS])
                              }}
                            >
                              <Copy className="size-4" />
                              <span className="sr-only">Make a copy</span>
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Assigned Groups tab ─────────────────────────────────────────── */}
        <TabsContent value="assigned">
          <div className="px-6 pt-4 pb-3">
            <Alert className="bg-blue-50/60 border-blue-200 text-blue-900">
              <Info className="size-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                These groups are managed in School Cockpit. Changes to
                membership must be made by your school administrator.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex items-center gap-3 px-6 pb-4">
            <div className="relative w-[240px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search groups…"
                value={assignedSearch}
                onChange={(e) => setAssignedSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <TypeFilterPopover value={typeFilter} onChange={setTypeFilter} />
          </div>

          {filteredAssignedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <EmptyState
                title={
                  assignedSearch || typeFilter.size > 0
                    ? 'No groups match your search'
                    : 'No groups assigned'
                }
                description={
                  assignedSearch || typeFilter.size > 0
                    ? 'Try adjusting your search or filters.'
                    : 'Your school administrator assigns groups in School Cockpit.'
                }
              />
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <Table tableClassName="table-fixed w-full">
                <TableHeader className="border-b bg-white">
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead className="w-24">Members</TableHead>
                    <TableHead className="w-[160px]">Classes</TableHead>
                    <TableHead className="w-28">Type</TableHead>
                    <TableHead className="w-28">Last synced</TableHead>
                    <TableHead className="pr-6 w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignedGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="pl-6">
                        <Link
                          to="/groups/structured/$groupId"
                          params={{ groupId: group.id }}
                          className="font-medium hover:underline truncate block"
                        >
                          {group.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="size-3.5 shrink-0" />
                          {group.members.length}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ClassPills members={group.members} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs py-0">
                          {getStructuredTypeLabel(group.structuredType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatRelativeDate(group.syncedAt)}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Button
                          variant="outline"
                          size="sm"
                          render={
                            <Link
                              to="/groups/structured/$groupId"
                              params={{ groupId: group.id }}
                            />
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Delete confirmation ──────────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{deleteGroup?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
