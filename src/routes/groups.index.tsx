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
import { MOCK_GROUPS } from '@/data/mock-groups'
import { TEACHER_STRUCTURED_GROUPS } from '@/data/mock-structured-groups'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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

// ─── Type filter popover (School Cockpit tab) ──────────────────────────────────

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
      <PopoverTrigger className="relative inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
        <Filter className="size-3.5" />
        Type
        {value.size > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {value.size}
          </span>
        )}
      </PopoverTrigger>
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

  // My Groups state
  const [groups, setGroups] = useState<Array<StudentGroup>>(MOCK_GROUPS)
  const [mySearch, setMySearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // School Cockpit Groups state
  const [schoolSearch, setSchoolSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    Set<Exclude<GroupTypeFilterOption, 'regular'>>
  >(new Set())

  // Filtered my groups
  const filteredMyGroups = useMemo(
    () =>
      groups.filter(
        (g) =>
          !mySearch || g.name.toLowerCase().includes(mySearch.toLowerCase()),
      ),
    [groups, mySearch],
  )

  // Filtered school groups
  const filteredSchoolGroups = useMemo(() => {
    return TEACHER_STRUCTURED_GROUPS.filter((g) => {
      const matchesSearch =
        !schoolSearch ||
        g.name.toLowerCase().includes(schoolSearch.toLowerCase())
      const matchesType =
        typeFilter.size === 0 || typeFilter.has(g.structuredType)
      return matchesSearch && matchesType
    })
  }, [schoolSearch, typeFilter])

  function confirmDelete() {
    if (deleteId) {
      setGroups((prev) => prev.filter((g) => g.id !== deleteId))
      // also remove from MOCK_GROUPS array so selector reflects the change
      const idx = MOCK_GROUPS.findIndex((g) => g.id === deleteId)
      if (idx !== -1) MOCK_GROUPS.splice(idx, 1)
      setDeleteId(null)
    }
  }

  const deleteGroup = groups.find((g) => g.id === deleteId)

  return (
    <div className="flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="shrink-0 pt-6">
        <div className="px-6 mb-4">
          <h1 className="text-2xl font-semibold">Groups</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your groups and view school-assigned groups.
          </p>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <Tabs defaultValue="my-groups" className="flex flex-col flex-1">
          <div className="px-6">
            <TabsList variant="line">
              <TabsTrigger value="my-groups">My Groups</TabsTrigger>
              <TabsTrigger value="school-cockpit">
                School Cockpit Groups
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── My Groups tab ─────────────────────────────────────────────── */}
          <TabsContent value="my-groups">
            <div className="flex items-center justify-between gap-2 px-6 py-4">
              <div className="relative w-[200px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search groups…"
                  value={mySearch}
                  onChange={(e) => setMySearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                render={<Link to="/groups/new" />}
                className="gap-2 shrink-0"
              >
                <Plus className="size-4" />
                New Group
              </Button>
            </div>

            {filteredMyGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <EmptyState
                  title={
                    mySearch ? 'No groups match your search' : 'No groups yet'
                  }
                  description={
                    mySearch
                      ? 'Try a different name.'
                      : 'Create a group to reuse student lists across announcements, forms, and reports.'
                  }
                />
                {!mySearch && (
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
              <Table>
                <TableHeader className="border-b bg-white">
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="pl-6 min-w-[220px]">
                      Group name
                    </TableHead>
                    <TableHead className="w-24">Members</TableHead>
                    <TableHead className="min-w-[200px]">Classes</TableHead>
                    <TableHead className="w-32">Last updated</TableHead>
                    <TableHead className="min-w-[140px]">Created by</TableHead>
                    <TableHead className="pr-6 w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMyGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <Link
                            to="/groups/$groupId"
                            params={{ groupId: group.id }}
                            className="font-medium hover:underline"
                          >
                            {group.name}
                          </Link>
                          {group.visibility === 'school' && (
                            <Badge variant="outline" className="text-xs py-0">
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
                      <TableCell className="text-sm text-muted-foreground">
                        {group.createdBy.name}
                      </TableCell>
                      <TableCell className="pr-6">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          {/* ── School Cockpit Groups tab ──────────────────────────────────── */}
          <TabsContent value="school-cockpit">
            <div className="px-6 pt-4 pb-3">
              <Alert className="bg-blue-50/60 border-blue-200 text-blue-900">
                <Info className="size-4 text-blue-500" />
                <AlertDescription className="text-blue-800">
                  These groups are managed in School Cockpit. Changes to
                  membership must be made by your school administrator.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex items-center gap-2 px-6 pb-4">
              <div className="relative w-[200px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search groups…"
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <TypeFilterPopover value={typeFilter} onChange={setTypeFilter} />
            </div>

            {filteredSchoolGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <EmptyState
                  title={
                    schoolSearch || typeFilter.size > 0
                      ? 'No groups match your search'
                      : 'No school groups assigned'
                  }
                  description={
                    schoolSearch || typeFilter.size > 0
                      ? 'Try adjusting your search or filters.'
                      : 'Your school administrator assigns groups in School Cockpit.'
                  }
                />
              </div>
            ) : (
              <Table>
                <TableHeader className="border-b bg-white">
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="pl-6 min-w-[220px]">
                      Group name
                    </TableHead>
                    <TableHead className="w-24">Members</TableHead>
                    <TableHead className="min-w-[200px]">Classes</TableHead>
                    <TableHead className="w-32">Type</TableHead>
                    <TableHead className="w-36">Last synced</TableHead>
                    <TableHead className="pr-6 w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchoolGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="pl-6">
                        <Link
                          to="/groups/structured/$groupId"
                          params={{ groupId: group.id }}
                          className="font-medium hover:underline"
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
                        <Link
                          to="/groups/structured/$groupId"
                          params={{ groupId: group.id }}
                          className="text-sm text-primary hover:underline"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Delete confirmation (outside tabs to avoid remount) ──────────────── */}
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
