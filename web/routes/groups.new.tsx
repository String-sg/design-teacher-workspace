import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { MOCK_GROUPS } from '~/apps/pg/data/mock-groups';
import { CCA_GROUPS, CLASS_GROUPS, TEACHING_GROUPS } from '~/apps/pg/data/mock-student-groups';
import type { StudentGroup } from '~/apps/pg/types/student-group';
import { useSetBreadcrumbs } from '~/platform/hooks/use-breadcrumbs';
import { Button } from '~/shared/components/ui/button';
import { Checkbox } from '~/shared/components/ui/checkbox';
import { Input } from '~/shared/components/ui/input';
import { Label } from '~/shared/components/ui/label';
import { Textarea } from '~/shared/components/ui/textarea';
import { cn } from '~/shared/lib/utils';

export const Route = createFileRoute('/groups/new')({
  component: GroupsNew,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type BrowseTab = 'class' | 'level' | 'cca' | 'teaching';

interface PickerStudent {
  id: string;
  name: string;
  class: string;
  level: number;
  nric: string;
  indexNumber: number;
}

interface PickerGroup {
  id: string;
  label: string;
  students: PickerStudent[];
}

// ─── Build student registry ───────────────────────────────────────────────────

const ALL_STUDENTS: PickerStudent[] = CLASS_GROUPS.flatMap((group) =>
  (group.memberDetails ?? []).map((d, i) => ({
    id: `${group.label}::${i}::${d.name}`,
    name: d.name,
    class: group.label,
    level: Number(group.label.match(/^(\d+)/)?.[1] ?? 0),
    nric: d.badge ?? '',
    indexNumber: i + 1,
  })),
);

const studentsByName = new Map(ALL_STUDENTS.map((s) => [s.name, s]));

function parseClassLabel(label: string): [number, string] {
  const m = label.match(/^(\d+)\s+(.+)/);
  return m ? [Number(m[1]), m[2]] : [99, label];
}

// ─── Per-tab group lists ──────────────────────────────────────────────────────

const CLASS_TAB_GROUPS: PickerGroup[] = CLASS_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  students: (g.memberDetails ?? [])
    .map((d) => studentsByName.get(d.name))
    .filter((s): s is PickerStudent => s !== undefined)
    .sort((a, b) => a.indexNumber - b.indexNumber),
})).sort((a, b) => {
  const [al, an] = parseClassLabel(a.label);
  const [bl, bn] = parseClassLabel(b.label);
  return al !== bl ? al - bl : an.localeCompare(bn);
});

const LEVEL_TAB_GROUPS: PickerGroup[] = [1, 2, 3, 4]
  .map((lvl) => ({
    id: `level-${lvl}`,
    label: `Sec ${lvl}`,
    students: ALL_STUDENTS.filter((s) => s.level === lvl).sort(
      (a, b) => a.class.localeCompare(b.class) || a.indexNumber - b.indexNumber,
    ),
  }))
  .filter((g) => g.students.length > 0);

const CCA_TAB_GROUPS: PickerGroup[] = CCA_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  students: (g.memberNames ?? [])
    .map((name) => studentsByName.get(name))
    .filter((s): s is PickerStudent => s !== undefined),
}));

const TEACHING_TAB_GROUPS: PickerGroup[] = TEACHING_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  students: (g.memberDetails ?? [])
    .map((d) => studentsByName.get(d.name))
    .filter((s): s is PickerStudent => s !== undefined)
    .sort((a, b) => a.indexNumber - b.indexNumber),
}));

const BROWSE_TABS: { id: BrowseTab; label: string }[] = [
  { id: 'class', label: 'Class' },
  { id: 'level', label: 'Level' },
  { id: 'cca', label: 'CCA' },
  { id: 'teaching', label: 'Teaching Group' },
];

// ─── Component ────────────────────────────────────────────────────────────────

function GroupsNew() {
  useSetBreadcrumbs([
    { label: 'Student Groups', href: '/groups' },
    { label: 'New Group', href: '/groups/new' },
  ]);

  const navigate = useNavigate();

  // Form state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Picker state
  const [activeTab, setActiveTab] = useState<BrowseTab>('class');
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Undo state
  const [undoIds, setUndoIds] = useState<string[]>([]);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSelected = selectedIds.size;
  const canSave = groupName.trim().length > 0 && totalSelected > 0;

  // Selected students sorted by class → index
  const selectedStudents = useMemo(
    () =>
      ALL_STUDENTS.filter((s) => selectedIds.has(s.id)).sort(
        (a, b) => a.class.localeCompare(b.class) || a.indexNumber - b.indexNumber,
      ),
    [selectedIds],
  );

  // Group selected students by class for the review panel
  const selectedByClass = useMemo(() => {
    const map = new Map<string, PickerStudent[]>();
    for (const s of selectedStudents) {
      if (!map.has(s.class)) map.set(s.class, []);
      map.get(s.class)!.push(s);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [selectedStudents]);

  // Current tab groups
  const tabGroups = useMemo((): PickerGroup[] => {
    switch (activeTab) {
      case 'class':
        return CLASS_TAB_GROUPS;
      case 'level':
        return LEVEL_TAB_GROUPS;
      case 'cca':
        return CCA_TAB_GROUPS;
      case 'teaching':
        return TEACHING_TAB_GROUPS;
    }
  }, [activeTab]);

  // Search filter — deduplicate students across groups so the same person
  // never appears more than once in results (relevant for Teaching / CCA tabs
  // where groups overlap heavily).
  const filteredGroups = useMemo((): PickerGroup[] => {
    if (!search.trim()) return tabGroups;
    const q = search.toLowerCase();
    const seenIds = new Set<string>();
    return tabGroups
      .map((g) => ({
        ...g,
        students: g.students.filter((s) => {
          const matches =
            s.name.toLowerCase().includes(q) ||
            s.nric.toLowerCase().includes(q) ||
            s.class.toLowerCase().includes(q);
          if (!matches || seenIds.has(s.id)) return false;
          seenIds.add(s.id);
          return true;
        }),
      }))
      .filter((g) => g.students.length > 0);
  }, [tabGroups, search]);

  // Auto-expand groups when searching
  const effectiveExpandedIds = useMemo(() => {
    if (search.trim()) return new Set(filteredGroups.map((g) => g.id));
    return expandedIds;
  }, [search, filteredGroups, expandedIds]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function triggerUndo(removedIds: string[]) {
    if (removedIds.length === 0) return;
    setUndoIds(removedIds);
    setShowUndo(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setShowUndo(false);
      setUndoIds([]);
    }, 6000);
  }

  function handleUndo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      undoIds.forEach((id) => next.add(id));
      return next;
    });
    setShowUndo(false);
    setUndoIds([]);
  }

  function getGroupState(group: PickerGroup): 'all' | 'some' | 'none' {
    if (group.students.length === 0) return 'none';
    const n = group.students.filter((s) => selectedIds.has(s.id)).length;
    if (n === 0) return 'none';
    return n === group.students.length ? 'all' : 'some';
  }

  function toggleGroup(group: PickerGroup) {
    const state = getGroupState(group);
    if (state === 'all') {
      const removed = group.students.map((s) => s.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        removed.forEach((id) => next.delete(id));
        return next;
      });
      triggerUndo(removed);
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        group.students.forEach((s) => next.add(s.id));
        return next;
      });
    }
  }

  function toggleStudent(id: string) {
    const wasSelected = selectedIds.has(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    if (wasSelected) triggerUndo([id]);
  }

  function removeFromPanel(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    triggerUndo([id]);
  }

  function toggleExpand(groupId: string) {
    if (search.trim()) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  }

  function handleSave() {
    if (!canSave) return;
    const newGroup: StudentGroup = {
      id: `cg-${Date.now()}`,
      kind: 'regular',
      name: groupName.trim(),
      description: groupDescription.trim() || undefined,
      members: selectedStudents.map((s) => ({
        id: s.id,
        name: s.name,
        class: s.class,
        nric: s.nric,
        indexNumber: s.indexNumber,
      })),
      staffInCharge: [],
      visibility: 'private',
      sharedWith: [],
      createdBy: { name: 'Mrs Tan Mei Lin', email: 'tanml@school.edu.sg' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_GROUPS.push(newGroup);
    toast.success('Group created');
    navigate({ to: '/groups/$groupId', params: { groupId: newGroup.id } });
  }

  const showClass = activeTab === 'level' || activeTab === 'cca' || activeTab === 'teaching';

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* ── Sticky header (mirrors announcements.new.tsx) ────────────────────── */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-3 border-b px-6 py-3">
          <Button variant="ghost" size="icon" className="shrink-0" render={<Link to="/groups" />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 text-base font-semibold">New Student Group</h1>
          <Button variant="ghost" size="sm" render={<Link to="/groups" />}>
            Cancel
          </Button>
          <Button size="sm" disabled={!canSave} onClick={handleSave}>
            Save Group
          </Button>
        </div>
      </div>

      {/* ── Body: two-column grid (mirrors announcements preview layout) ───────── */}
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* ── Left: form sections ────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Group details */}
            <section className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Group details
              </h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="group-name">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">{groupName.length}/60</span>
                  </div>
                  <Input
                    id="group-name"
                    placeholder="e.g. Drama Festival Cast"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value.slice(0, 60))}
                    maxLength={60}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="group-desc">
                      Description{' '}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {groupDescription.length}/200
                    </span>
                  </div>
                  <Textarea
                    id="group-desc"
                    placeholder="e.g. Students selected for the school Drama Festival 2025"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value.slice(0, 200))}
                    maxLength={200}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Select members */}
            <section className="overflow-hidden rounded-xl border bg-white">
              <div className="border-b px-6 py-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Select members
                </h2>
              </div>

              {/* Search */}
              <div className="border-b px-4 py-3">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, NRIC or class…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 w-full pl-8 text-sm"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto border-b">
                {BROWSE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch('');
                    }}
                    className={cn(
                      'shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                      activeTab === tab.id
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Group + student list */}
              <div className="max-h-[480px] divide-y overflow-y-auto">
                {filteredGroups.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No students match your search.
                  </p>
                ) : (
                  filteredGroups.map((group) => {
                    const state = getGroupState(group);
                    const isExpanded = effectiveExpandedIds.has(group.id);
                    const selectedInGroup = group.students.filter((s) =>
                      selectedIds.has(s.id),
                    ).length;

                    return (
                      <div key={group.id}>
                        {/* Group row */}
                        <div
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 transition-colors',
                            state !== 'none' ? 'bg-blue-50/50' : 'hover:bg-muted/30',
                          )}
                        >
                          <Checkbox
                            checked={state === 'all'}
                            indeterminate={state === 'some'}
                            onCheckedChange={() => toggleGroup(group)}
                          />
                          <button
                            type="button"
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            onClick={() => toggleExpand(group.id)}
                          >
                            <span className="flex-1 truncate text-sm font-medium">
                              {group.label}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {state === 'some' ? (
                                <>
                                  <span className="font-medium text-blue-600">
                                    {selectedInGroup}
                                  </span>
                                  /{group.students.length} students
                                </>
                              ) : (
                                <>
                                  {group.students.length}{' '}
                                  {group.students.length === 1 ? 'student' : 'students'}
                                </>
                              )}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                            )}
                          </button>
                        </div>

                        {/* Student rows */}
                        {isExpanded && (
                          <div className="border-b border-slate-100 bg-slate-50/60 px-4 pt-2.5 pb-3">
                            {/* Sub-header — mirrors entity-selector "N students" label */}
                            <p className="mb-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                              {group.students.length}{' '}
                              {group.students.length === 1 ? 'student' : 'students'}
                            </p>
                            <ol>
                              {group.students.map((student) => {
                                const isSelected = selectedIds.has(student.id);
                                return (
                                  <li key={student.id}>
                                    <label
                                      className={cn(
                                        'flex w-full cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors',
                                        isSelected
                                          ? 'text-slate-700 hover:bg-blue-50'
                                          : 'text-slate-700 hover:bg-slate-100',
                                      )}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleStudent(student.id)}
                                      />
                                      {/* Index — running number within group */}
                                      <span className="w-6 shrink-0 text-right text-[10px] text-slate-400 tabular-nums">
                                        #{student.indexNumber}
                                      </span>
                                      {/* Name + class pill for non-class tabs */}
                                      <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate">
                                        <span className="truncate">{student.name}</span>
                                        {showClass && (
                                          <span className="shrink-0 rounded bg-slate-200 px-1 py-px text-[9px] font-medium text-slate-500">
                                            {student.class}
                                          </span>
                                        )}
                                      </span>
                                      {/* NRIC — font-mono matching entity selector */}
                                      <span className="shrink-0 font-mono text-[10px] text-slate-400">
                                        {student.nric}
                                      </span>
                                    </label>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* ── Right: selected students review panel ──────────────────────── */}
          <div className="sticky top-[57px] overflow-hidden rounded-xl border bg-white">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-sm font-semibold">
                  {totalSelected === 0 ? 'No students selected' : `${totalSelected} selected`}
                </p>
                {totalSelected > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    across {selectedByClass.length} class
                    {selectedByClass.length !== 1 ? 'es' : ''}
                  </p>
                )}
              </div>
              {totalSelected > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const removed = [...selectedIds];
                    setSelectedIds(new Set());
                    triggerUndo(removed);
                  }}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Undo banner */}
            {showUndo && (
              <div className="flex items-center justify-between gap-2 border-b bg-amber-50 px-4 py-2.5">
                <span className="text-xs text-amber-800">
                  {undoIds.length === 1
                    ? '1 student removed'
                    : `${undoIds.length} students removed`}
                </span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="text-xs font-semibold text-amber-900 hover:underline"
                >
                  Undo
                </button>
              </div>
            )}

            {/* Student list */}
            <div className="max-h-[420px] overflow-y-auto">
              {totalSelected === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select students from the list on the left.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {selectedByClass.map(([cls, students]) => (
                    <div key={cls}>
                      <div className="flex items-center gap-1.5 bg-muted/30 px-4 py-2">
                        <span className="text-xs font-medium text-muted-foreground">{cls}</span>
                        <span className="text-xs text-muted-foreground/60">
                          · {students.length}
                        </span>
                      </div>
                      {students.map((s) => (
                        <div
                          key={s.id}
                          className="group flex items-center gap-2 px-4 py-1.5 hover:bg-muted/20"
                        >
                          <span className="flex-1 truncate text-sm">{s.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFromPanel(s.id)}
                            className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                            aria-label={`Remove ${s.name}`}
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save */}
            <div className="border-t px-4 py-3">
              <Button className="w-full" disabled={!canSave} onClick={handleSave}>
                Save Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
