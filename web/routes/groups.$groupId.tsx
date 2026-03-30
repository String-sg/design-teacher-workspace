import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit2,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  UserMinus,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { EmptyState } from '~/apps/pg/components/empty-state';
import { getGroupById, MOCK_GROUPS } from '~/apps/pg/data/mock-groups';
import { MOCK_STAFF } from '~/apps/pg/data/mock-staff';
import type { GroupSharedWith, StudentGroup } from '~/apps/pg/types/student-group';
import { useSetBreadcrumbs } from '~/platform/hooks/use-breadcrumbs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/shared/components/ui/alert-dialog';
import { Badge } from '~/shared/components/ui/badge';
import { Button } from '~/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/components/ui/dropdown-menu';
import { Input } from '~/shared/components/ui/input';
import { Label } from '~/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/components/ui/select';
import { Separator } from '~/shared/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/shared/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/components/ui/table';
import { cn } from '~/shared/lib/utils';

const CURRENT_USER_EMAIL = 'tanml@school.edu.sg';

export const Route = createFileRoute('/groups/$groupId')({
  component: GroupDetailPage,
  loader: ({ params }) => {
    const group = getGroupById(params.groupId);
    if (!group) throw notFound();
    return { group };
  },
});

const PAGE_SIZE = 10;

function SharingSheet({
  group,
  open,
  onOpenChange,
  onSave,
}: {
  group: StudentGroup;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (visibility: 'private' | 'school', sharedWith: GroupSharedWith[]) => void;
}) {
  const [visibility, setVisibility] = useState<'private' | 'school'>(group.visibility);
  const [sharedWith, setSharedWith] = useState<GroupSharedWith[]>(group.sharedWith);
  const [addSearch, setAddSearch] = useState('');
  const [drawerWidth, setDrawerWidth] = useState(480);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startWidth: drawerWidth };

      function onMouseMove(ev: MouseEvent) {
        if (!dragRef.current) return;
        const delta = dragRef.current.startX - ev.clientX;
        setDrawerWidth(Math.min(Math.max(dragRef.current.startWidth + delta, 360), 800));
      }
      function onMouseUp() {
        dragRef.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [drawerWidth],
  );

  const staffResults = useMemo(() => {
    if (!addSearch) return [];
    const q = addSearch.toLowerCase().trim();
    // Match "sec 3" / "level 3" / "3" to formClass like "3A"
    const levelMatch = q.match(/(?:sec\s*|level\s*)?^(\d)$|(?:sec\s*|level\s*)(\d)/i);
    const levelDigit = levelMatch?.[1] ?? levelMatch?.[2];
    return MOCK_STAFF.filter((s) => {
      if (sharedWith.some((sw) => sw.staffId === s.id)) return false;
      const fc = (s.formClass ?? '').toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        fc.includes(q) ||
        (levelDigit !== undefined && fc.startsWith(levelDigit))
      );
    });
  }, [addSearch, sharedWith]);

  function addStaff(staffId: string) {
    const staff = MOCK_STAFF.find((s) => s.id === staffId);
    if (!staff) return;
    setSharedWith((prev) => [
      ...prev,
      {
        staffId: staff.id,
        name: staff.name,
        email: staff.email,
        role: 'viewer',
      },
    ]);
    setAddSearch('');
  }

  function updateRole(staffId: string, role: 'viewer' | 'editor') {
    setSharedWith((prev) => prev.map((sw) => (sw.staffId === staffId ? { ...sw, role } : sw)));
  }

  function removeStaff(staffId: string) {
    setSharedWith((prev) => prev.filter((sw) => sw.staffId !== staffId));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0"
        style={{ width: drawerWidth, maxWidth: 'none' }}
      >
        {/* Resize handle */}
        <div
          className="absolute top-0 left-0 z-10 h-full w-1.5 cursor-col-resize transition-colors hover:bg-border/60"
          onMouseDown={onDragStart}
        />
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Share this group</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pt-4 pb-6">
          {/* Visibility toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <div className="inline-flex overflow-hidden rounded-md border">
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium transition-colors',
                  visibility === 'private'
                    ? 'bg-foreground text-background'
                    : 'bg-background text-muted-foreground hover:bg-muted',
                )}
              >
                Private
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={() => setVisibility('school')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium transition-colors',
                  visibility === 'school'
                    ? 'bg-foreground text-background'
                    : 'bg-background text-muted-foreground hover:bg-muted',
                )}
              >
                School-wide
              </button>
            </div>
          </div>

          <Separator />

          {/* People with access */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">People with access</Label>
            {sharedWith.length === 0 ? (
              <p className="text-sm text-muted-foreground">No one else has access.</p>
            ) : (
              <div className="space-y-2">
                {sharedWith.map((sw) => {
                  const staffMeta = MOCK_STAFF.find((s) => s.id === sw.staffId);
                  const sublabel = [staffMeta?.formClass && `Form ${staffMeta.formClass}`, sw.email]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <div
                      key={sw.staffId}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {sw.name
                          .split(' ')
                          .slice(-2)
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{sw.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{sublabel}</p>
                      </div>
                      <Select
                        value={sw.role}
                        onValueChange={(val) => updateRole(sw.staffId, val as 'viewer' | 'editor')}
                      >
                        <SelectTrigger className="h-7 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeStaff(sw.staffId)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add people */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Add people</Label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or class…"
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {staffResults.length > 0 && (
              <div className="divide-y rounded-lg border">
                {staffResults.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addStaff(s.id)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {s.name
                        .split(' ')
                        .slice(-2)
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[s.formClass && `Form ${s.formClass}`, s.email]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-t p-6">
          <Button
            className="flex-1"
            onClick={() => {
              onSave(visibility, sharedWith);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function GroupDetailPage() {
  const { group: initialGroup } = Route.useLoaderData();
  const navigate = useNavigate();

  const [group, setGroup] = useState<StudentGroup>(initialGroup);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(group.name);

  const currentRole: 'owner' | 'editor' | 'viewer' =
    group.createdBy.email === CURRENT_USER_EMAIL
      ? 'owner'
      : group.sharedWith.find((s) => s.email === CURRENT_USER_EMAIL)?.role === 'editor'
        ? 'editor'
        : 'viewer';
  const canEdit = currentRole === 'owner' || currentRole === 'editor';

  useSetBreadcrumbs([
    { label: 'Student Groups', href: '/groups' },
    { label: group.name, href: `/groups/${group.id}` },
  ]);

  const filteredMembers = useMemo(() => {
    if (!memberSearch) return group.members;
    const q = memberSearch.toLowerCase();
    return group.members.filter((m) => m.name.toLowerCase().includes(q));
  }, [group.members, memberSearch]);

  const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE);
  const pagedMembers = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleRemoveMember(id: string) {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleSaveSharing(visibility: 'private' | 'school', sharedWith: GroupSharedWith[]) {
    setGroup((prev) => ({
      ...prev,
      visibility,
      sharedWith,
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleDelete() {
    const idx = MOCK_GROUPS.findIndex((g) => g.id === group.id);
    if (idx !== -1) MOCK_GROUPS.splice(idx, 1);
    navigate({ to: '/groups' });
  }

  function handleSaveName() {
    if (nameInput.trim()) {
      setGroup((prev) => ({
        ...prev,
        name: nameInput.trim(),
        updatedAt: new Date().toISOString(),
      }));
    }
    setEditingName(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-3 -ml-2" render={<Link to="/groups" />}>
          <ArrowLeft className="mr-1 size-4" />
          Student Groups
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="h-auto px-2 py-1 text-2xl font-semibold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setEditingName(false);
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveName}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="truncate text-2xl font-semibold">{group.name}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setNameInput(group.name);
                      setEditingName(true);
                    }}
                  >
                    <Edit2 className="size-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{group.members.length} students</Badge>
              <Badge
                variant="outline"
                className={cn(
                  group.visibility === 'school'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600',
                )}
              >
                {group.visibility === 'school' ? 'School-wide' : 'Private'}
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="size-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link to="/groups/new" />}>
                  Duplicate group
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}

      <Separator />

      {/* Members section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Members{' '}
            <span className="font-normal text-muted-foreground">({group.members.length})</span>
          </h2>
          <div className="relative w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={memberSearch}
              onChange={(e) => {
                setMemberSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <EmptyState title="No members found" description="Try a different search term." />
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>NRIC</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedMembers.map((member, i) => (
                    <TableRow key={member.id} className="group/row">
                      <TableCell className="text-xs text-muted-foreground">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          to="/students/$id"
                          params={{ id: member.id }}
                          className="hover:underline"
                        >
                          {member.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {member.class}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {member.nric ?? '—'}
                      </TableCell>
                      <TableCell>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-destructive"
                            onClick={() => {
                              if (currentRole === 'owner') {
                                handleRemoveMember(member.id);
                              } else {
                                setPendingRemoveId(member.id);
                              }
                            }}
                          >
                            <UserMinus className="size-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filteredMembers.length)} of {filteredMembers.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="px-2 text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sharing sheet */}
      <SharingSheet
        group={group}
        open={shareOpen}
        onOpenChange={setShareOpen}
        onSave={handleSaveSharing}
      />

      {/* Editor remove confirmation */}
      <AlertDialog
        open={!!pendingRemoveId}
        onOpenChange={(open) => !open && setPendingRemoveId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from shared group?</AlertDialogTitle>
            <AlertDialogDescription>
              Removing <strong>{group.members.find((m) => m.id === pendingRemoveId)?.name}</strong>{' '}
              will affect {group.sharedWith.length} other collaborator
              {group.sharedWith.length !== 1 ? 's' : ''} with access to this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRemoveId) {
                  handleRemoveMember(pendingRemoveId);
                  setPendingRemoveId(null);
                }
              }}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{group.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
