import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Copy,
  Edit2,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  Users,
} from 'lucide-react'

import type { StudentGroup } from '@/types/student-group'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { MOCK_GROUPS } from '@/data/mock-groups'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

function GroupsIndex() {
  useSetBreadcrumbs([{ label: 'Student Groups', href: '/groups' }])

  const [search, setSearch] = useState('')
  const [groups, setGroups] = useState<Array<StudentGroup>>(MOCK_GROUPS)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      groups.filter(
        (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [groups, search],
  )

  function confirmDelete() {
    if (deleteId) {
      setGroups((prev) => prev.filter((g) => g.id !== deleteId))
      setDeleteId(null)
    }
  }

  const deleteGroup = groups.find((g) => g.id === deleteId)

  return (
    <div className="flex flex-col">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 space-y-6 pt-6">
        <div className="px-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Student Groups</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create and manage reusable student lists for announcements,
                forms, and reporting.
              </p>
            </div>
            <Button
              render={<Link to="/groups/new" />}
              className="gap-2 shrink-0"
            >
              <Plus className="size-4" />
              New Group
            </Button>
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-6 pb-4">
          <div className="relative w-[200px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search groups…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <EmptyState
            title="No groups found"
            description={
              search
                ? 'Try adjusting your search.'
                : 'Create your first student group to get started.'
            }
          />
          {!search && (
            <Button className="mt-4 gap-2" render={<Link to="/groups/new" />}>
              <Plus className="size-4" />
              Create your first group
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader className="border-b bg-white">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="pl-6 min-w-[220px]">Group name</TableHead>
              <TableHead className="w-24">Members</TableHead>
              <TableHead className="min-w-[200px]">Classes</TableHead>
              <TableHead className="w-32">Last updated</TableHead>
              <TableHead className="min-w-[140px]">Created by</TableHead>
              <TableHead className="pr-6 w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((group) => {
              const classes = getUniqueClasses(group.members)
              const visibleClasses = classes.slice(0, 3)
              const hiddenCount = classes.length - 3

              return (
                <TableRow key={group.id}>
                  {/* Name */}
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

                  {/* Members */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="size-3.5 shrink-0" />
                      {group.members.length}
                    </div>
                  </TableCell>

                  {/* Classes */}
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {visibleClasses.map((cls) => (
                        <span
                          key={cls}
                          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {cls}
                        </span>
                      ))}
                      {hiddenCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          +{hiddenCount}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Last updated */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatRelativeDate(group.updatedAt)}
                  </TableCell>

                  {/* Created by */}
                  <TableCell className="text-sm text-muted-foreground">
                    {group.createdBy.name}
                  </TableCell>

                  {/* Actions */}
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
                              MOCK_GROUPS.push({
                                ...src,
                                id: `cg-${Date.now()}`,
                                name: `${src.name} (copy)`,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                lastUsedAt: undefined,
                              })
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
              )
            })}
          </TableBody>
        </Table>
      )}

      {/* ── Delete confirmation ────────────────────────────────────────────── */}
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
