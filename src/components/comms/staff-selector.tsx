import { EntitySelector } from './entity-selector'
import type {
  EntityItem,
  EntityScope,
  MemberDetail,
  SearchResults,
  SelectedEntity,
} from './entity-selector'
import { MOCK_STAFF, MOCK_STAFF_GROUPS } from '@/data/mock-staff'

// Backward-compatible type alias
export type { SelectedEntity as SelectedStaff }

interface StaffSelectorProps {
  value: Array<SelectedEntity>
  onChange: (staff: Array<SelectedEntity>) => void
}

function makeMemberNames(ids: Array<string>): Array<string> {
  return ids
    .map((id) => MOCK_STAFF.find((s) => s.id === id)?.name)
    .filter((n): n is string => Boolean(n))
}

function makeMemberDetails(ids: Array<string>): Array<MemberDetail> {
  return ids.flatMap((id) => {
    const s = MOCK_STAFF.find((m) => m.id === id)
    if (!s) return []
    return [
      {
        name: s.name,
        sublabel: [s.formClass, s.email].filter(Boolean).join(' · '),
      },
    ]
  })
}

// Individual staff — sublabel shows form class (if any) + email
const STAFF_INDIVIDUAL_ITEMS: Array<EntityItem> = MOCK_STAFF.map((s) => ({
  id: s.id,
  label: s.name,
  sublabel: [s.formClass, s.email].filter(Boolean).join(' · '),
  type: 'individual' as const,
  count: 1,
}))

// Level scope — level teams (e.g. Sec 3 Level Team)
// groupType is 'staff-group' (not 'level') so count reads "members" not "students"
const LEVEL_GROUP_ITEMS: Array<EntityItem> = MOCK_STAFF_GROUPS.filter(
  (g) => g.groupType === 'level',
).map((g) => ({
  id: g.id,
  label: g.label,
  type: 'group' as const,
  count: g.memberIds.length,
  memberNames: makeMemberNames(g.memberIds),
  memberDetails: makeMemberDetails(g.memberIds),
  groupType: 'staff-group' as const,
}))

// School scope — departments + school-wide groups
const SCHOOL_GROUP_ITEMS: Array<EntityItem> = MOCK_STAFF_GROUPS.filter(
  (g) => g.groupType === 'department' || g.groupType === 'staff-group',
).map((g) => ({
  id: g.id,
  label: g.label,
  type: 'group' as const,
  count: g.memberIds.length,
  memberNames: makeMemberNames(g.memberIds),
  memberDetails: makeMemberDetails(g.memberIds),
  groupType: (g.groupType ?? 'staff-group') as 'department' | 'staff-group',
}))

// All group items flat (for search)
const ALL_STAFF_GROUP_ITEMS: Array<EntityItem> = [
  ...LEVEL_GROUP_ITEMS,
  ...SCHOOL_GROUP_ITEMS,
]

// Scopes: Individual | Level | School — mirrors PG app's staff-in-charge picker
const STAFF_SCOPES: Array<EntityScope> = [
  { id: 'individual', label: 'Individual', items: STAFF_INDIVIDUAL_ITEMS },
  { id: 'level', label: 'Level', items: LEVEL_GROUP_ITEMS },
  { id: 'school', label: 'School', items: SCHOOL_GROUP_ITEMS },
]

function staffSearchFn(query: string): SearchResults {
  const q = query.toLowerCase()
  if (!q) {
    return {
      groups: ALL_STAFF_GROUP_ITEMS,
      individuals: STAFF_INDIVIDUAL_ITEMS,
    }
  }
  return {
    groups: ALL_STAFF_GROUP_ITEMS.filter((g) =>
      g.label.toLowerCase().includes(q),
    ),
    individuals: STAFF_INDIVIDUAL_ITEMS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        (s.sublabel?.toLowerCase().includes(q) ?? false),
    ),
  }
}

export function StaffSelector({ value, onChange }: StaffSelectorProps) {
  return (
    <EntitySelector
      value={value}
      onChange={onChange}
      scopes={STAFF_SCOPES}
      searchFn={staffSearchFn}
      placeholder="Search staff by name or group…"
      searchPlaceholder="Search staff…"
      noResultsText="No staff found"
    />
  )
}
