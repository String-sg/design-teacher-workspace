import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Plus, Search, User, Users, X } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GroupType =
  | 'class'
  | 'level'
  | 'school'
  | 'cca'
  | 'teaching'
  | 'custom'
  | 'department'
  | 'staff-group'

export interface MemberDetail {
  name: string
  sublabel?: string // e.g. "3A · tanml@school.edu.sg" for staff
  nric?: string
  index?: number
  class?: string
}

export interface EntityItem {
  id: string
  label: string
  sublabel?: string
  badge?: string // right-aligned label on the name row (e.g. NRIC for students)
  type: 'group' | 'individual'
  count?: number
  memberNames?: Array<string> // plain names for chip tooltips
  memberDetails?: Array<MemberDetail> // richer per-member info for expanded list
  groupType?: GroupType
}

export interface SelectedEntity {
  id: string
  label: string
  type: 'group' | 'individual'
  count: number
  groupType?: GroupType
  memberNames?: Array<string>
}

export interface EntityScopeSection {
  label: string
  items: Array<EntityItem>
}

export interface EntityScope {
  id: string
  label: string
  items: Array<EntityItem>
  sections?: Array<EntityScopeSection>
  createHref?: string
  createLabel?: string
}

export interface SearchResults {
  groups: Array<EntityItem>
  individuals: Array<EntityItem>
}

export interface EntitySelectorProps {
  value: Array<SelectedEntity>
  onChange: (entities: Array<SelectedEntity>) => void
  scopes?: Array<EntityScope>
  searchFn: (query: string) => SearchResults
  multiSelect?: boolean
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  emptyTabText?: string
  maxScrollHeight?: string
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

// Returns the unit label for a group's member count.
// Student-oriented groups use "student(s)"; staff/generic groups use "member(s)".
function getCountUnit(groupType: GroupType | undefined, count: number): string {
  const studentTypes: Array<GroupType> = [
    'class',
    'level',
    'school',
    'cca',
    'teaching',
    'custom',
  ]
  if (groupType && studentTypes.includes(groupType)) {
    return count === 1 ? 'student' : 'students'
  }
  return count === 1 ? 'member' : 'members'
}

export function computeSummary(
  entities: Array<SelectedEntity>,
  summaryLabel: string,
  summaryLabelPlural: string,
): string {
  if (entities.length === 0) return ''

  const groups = entities.filter((e) => e.type === 'group')
  const individuals = entities.filter((e) => e.type === 'individual')
  const totalCount = entities.reduce((sum, e) => sum + e.count, 0)
  const hasGroups = groups.length > 0

  const byType = new Map<string, number>()
  for (const g of groups) {
    const key = g.groupType ?? 'staff-group'
    byType.set(key, (byType.get(key) ?? 0) + 1)
  }

  const typeOrder: Array<GroupType> = [
    'school',
    'level',
    'class',
    'cca',
    'teaching',
    'custom',
    'department',
    'staff-group',
  ]
  const typeLabels: Record<string, [string, string]> = {
    school: ['school', 'schools'],
    level: ['level', 'levels'],
    class: ['class', 'classes'],
    cca: ['CCA', 'CCAs'],
    teaching: ['teaching group', 'teaching groups'],
    custom: ['custom group', 'custom groups'],
    department: ['dept', 'depts'],
    'staff-group': ['group', 'groups'],
  }

  const parts: Array<string> = []

  for (const type of typeOrder) {
    const count = byType.get(type) ?? 0
    if (count === 0) continue
    const pair = typeLabels[type] ?? [type, `${type}s`]
    parts.push(`${count} ${count === 1 ? pair[0] : pair[1]}`)
  }

  if (individuals.length > 0) {
    parts.push(
      `${individuals.length} individual${individuals.length !== 1 ? 's' : ''}`,
    )
  }

  const countStr = `${hasGroups ? '~' : ''}${totalCount} ${totalCount === 1 ? summaryLabel : summaryLabelPlural}`
  return [...parts, countStr].join(' · ')
}

export function detectOverlaps(
  entities: Array<SelectedEntity>,
  overlapMap: Record<string, Array<string>>,
): Array<{ childLabel: string; parentLabel: string }> {
  const selectedIds = new Set(entities.map((e) => e.id))
  const warnings: Array<{ childLabel: string; parentLabel: string }> = []

  for (const [parentId, childIds] of Object.entries(overlapMap)) {
    if (!selectedIds.has(parentId)) continue
    const parent = entities.find((e) => e.id === parentId)
    if (!parent) continue
    for (const childId of childIds) {
      if (!selectedIds.has(childId)) continue
      const child = entities.find((e) => e.id === childId)
      if (!child) continue
      warnings.push({ childLabel: child.label, parentLabel: parent.label })
    }
  }

  return warnings
}

function toSelectedEntity(item: EntityItem): SelectedEntity {
  return {
    id: item.id,
    label: item.label,
    type: item.type,
    count: item.count ?? 1,
    groupType: item.groupType,
    memberNames: item.memberNames,
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ResultRowProps {
  item: EntityItem
  isSelected: boolean
  onToggle: () => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  selectedIndividualNames?: Set<string>
  // Exclusion props
  excludedNames?: Set<string>
  onToggleMember?: (name: string, detail: MemberDetail) => void
  onResetExclusions?: () => void
}

function ResultRow({
  item,
  isSelected,
  onToggle,
  isExpanded = false,
  onToggleExpand,
  selectedIndividualNames = new Set(),
  excludedNames = new Set(),
  onToggleMember,
  onResetExclusions,
}: ResultRowProps) {
  const hasMembers =
    item.type === 'group' &&
    ((item.memberDetails?.length ?? 0) > 0 ||
      (item.memberNames?.length ?? 0) > 0)

  const memberList: Array<MemberDetail> =
    item.memberDetails ?? item.memberNames?.map((name) => ({ name })) ?? []

  const activeCount = memberList.length - excludedNames.size
  const showExclusionCount = isSelected && excludedNames.size > 0

  // Whether to suppress class tag in Tier 2 rows
  const suppressClassTag = item.groupType === 'class'

  return (
    <>
      {/* Row: selection area + expand chevron as siblings inside a flex div */}
      <div
        className={cn(
          'flex w-full transition-colors',
          isSelected ? 'bg-twblue-1' : 'hover:bg-slate-50',
        )}
      >
        {/* Selection toggle — takes all available space */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggle}
          aria-pressed={isSelected}
          className="flex flex-1 items-center gap-3 px-3 py-2 text-left text-sm"
        >
          {/* Checkbox indicator on LEFT for all row types */}
          <span
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-slate-300 bg-white',
            )}
          >
            {isSelected && <Check className="h-2.5 w-2.5" />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.label}</p>
            {item.sublabel && (
              <p className="truncate text-xs text-muted-foreground">
                {item.sublabel}
              </p>
            )}
          </div>
          {item.type === 'group' && item.count !== undefined && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {showExclusionCount ? `${activeCount}/${item.count}` : item.count}{' '}
              {getCountUnit(
                item.groupType,
                showExclusionCount ? activeCount : item.count,
              )}
            </span>
          )}
          {item.badge && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {item.badge}
            </span>
          )}
        </button>

        {/* Expand chevron — only for groups with member names */}
        {hasMembers && (
          <button
            type="button"
            aria-label={isExpanded ? 'Hide members' : 'Show members'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onToggleExpand?.()}
            className={cn(
              'flex shrink-0 items-center px-2 transition-colors',
              isSelected ? 'hover:bg-twblue-3' : 'hover:bg-slate-100',
            )}
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform duration-150',
                isExpanded && 'rotate-180',
              )}
            />
          </button>
        )}
      </div>

      {/* Expanded member list — Tier 2 accordion with interactive checkboxes */}
      {isExpanded && hasMembers && (
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 pb-3 pt-2.5">
          {/* Header: member count + reset exclusions link */}
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {memberList.length}{' '}
              {item.count !== undefined && item.count > memberList.length
                ? `of ${item.count} `
                : ''}
              {getCountUnit(item.groupType, memberList.length)}
            </p>
            {isSelected && excludedNames.size > 0 && onResetExclusions && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onResetExclusions}
                className="text-[10px] text-twblue-7 hover:underline"
              >
                Reset ({excludedNames.size} excluded)
              </button>
            )}
          </div>

          {/* Scrollable interactive member list */}
          <ol
            className="max-h-[160px] overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {memberList.map((detail, index) => {
              const isAlsoSelectedIndividual = selectedIndividualNames.has(
                detail.name,
              )
              const isMemberExcluded =
                isSelected && excludedNames.has(detail.name)
              const isMemberIncluded =
                isSelected && !excludedNames.has(detail.name)

              return (
                <li key={detail.name}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onToggleMember?.(detail.name, detail)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors',
                      isMemberExcluded
                        ? 'opacity-40 hover:bg-slate-100'
                        : isAlsoSelectedIndividual
                          ? 'text-twblue-9 hover:bg-twblue-1'
                          : 'text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {/* Checkbox */}
                    <span
                      className={cn(
                        'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors',
                        isMemberIncluded
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-slate-300 bg-white',
                      )}
                    >
                      {isMemberIncluded && <Check className="h-2 w-2" />}
                    </span>

                    {/* Index number */}
                    <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-slate-400">
                      {detail.index !== undefined
                        ? `#${String(detail.index).padStart(2, '0')}`
                        : index + 1}
                    </span>

                    {/* Name + class tag */}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="truncate">{detail.name}</span>
                        {detail.class && !suppressClassTag && (
                          <span className="shrink-0 rounded bg-slate-200 px-1 py-px text-[9px] font-medium text-slate-500">
                            {detail.class}
                          </span>
                        )}
                      </span>
                      {detail.sublabel && (
                        <span className="block truncate text-[10px] font-normal text-muted-foreground">
                          {detail.sublabel}
                        </span>
                      )}
                    </span>

                    {/* NRIC */}
                    {detail.nric && (
                      <span className="shrink-0 font-mono text-[10px] text-slate-400">
                        {detail.nric}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Note when roster is incomplete */}
          {(() => {
            const shown = memberList.length
            return (
              item.count !== undefined &&
              item.count > shown && (
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Full roster not available in this preview (+
                  {item.count - shown} more)
                </p>
              )
            )
          })()}
        </div>
      )}
    </>
  )
}

function EntityChip({
  entity,
  onRemove,
  excludedCount = 0,
}: {
  entity: SelectedEntity
  onRemove: () => void
  excludedCount?: number
}) {
  const names = entity.memberNames ?? []
  const tooltipTitle =
    names.length > 0
      ? names.length > 12
        ? `${names.slice(0, 12).join(', ')} and ${names.length - 12} more`
        : names.join(', ')
      : undefined

  const displayCount =
    excludedCount > 0
      ? `${entity.count - excludedCount}/${entity.count}`
      : entity.count

  return (
    <span
      title={tooltipTitle}
      className="inline-flex max-w-[180px] shrink-0 items-center gap-1 rounded-md bg-twblue-2 px-2 py-0.5 text-xs font-medium text-twblue-9"
    >
      {entity.type === 'group' ? (
        <Users className="h-3 w-3 shrink-0" />
      ) : (
        <User className="h-3 w-3 shrink-0" />
      )}
      <span className="truncate">{entity.label}</span>
      {entity.type === 'group' && (
        <span className="shrink-0 opacity-60">· {displayCount}</span>
      )}
      <button
        type="button"
        aria-label={`Remove ${entity.label}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onRemove}
        className="ml-0.5 shrink-0 rounded-full p-0.5 hover:bg-twblue-4 hover:text-twblue-9"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EntitySelector({
  value,
  onChange,
  scopes,
  searchFn,
  multiSelect = true,
  placeholder = 'Search…',
  searchPlaceholder = 'Search…',
  noResultsText = 'No results found',
  emptyTabText = 'No items in this category',
  maxScrollHeight = '360px',
}: EntitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeScope, setActiveScope] = useState(scopes?.[0]?.id ?? '')
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)
  // Per-group exclusion map: groupId → Set of excluded member names
  const [excludedMembers, setExcludedMembers] = useState<
    Map<string, Set<string>>
  >(new Map())

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  // Derived: names of individually-selected entities (for member expansion highlights)
  const selectedIndividualNames = useMemo(
    () =>
      new Set(value.filter((e) => e.type === 'individual').map((e) => e.label)),
    [value],
  )

  // Sync activeScope when scopes change
  useEffect(() => {
    if (
      scopes &&
      scopes.length > 0 &&
      !scopes.find((s) => s.id === activeScope)
    ) {
      setActiveScope(scopes[0].id)
    }
  }, [scopes, activeScope])

  // Collapse expanded group when query changes (group may disappear from results)
  useEffect(() => {
    setExpandedGroupId(null)
  }, [query])

  // Collapse expanded group when tab switches
  useEffect(() => {
    setExpandedGroupId(null)
  }, [activeScope])

  // Outside-click to close (desktop only — Sheet handles its own dismissal)
  useEffect(() => {
    if (isMobile) return
    function handleMouseDown(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isMobile])

  function handleToggle(item: EntityItem) {
    const isSelected = value.some((e) => e.id === item.id)
    if (isSelected) {
      onChange(value.filter((e) => e.id !== item.id))
      // Clear exclusions when deselecting
      setExcludedMembers((prev) => {
        const next = new Map(prev)
        next.delete(item.id)
        return next
      })
    } else if (multiSelect) {
      onChange([...value, toSelectedEntity(item)])
      // Auto-expand Tier 2 when a group is selected
      if (item.type === 'group') {
        setExpandedGroupId(item.id)
      }
    } else {
      onChange([toSelectedEntity(item)])
      setIsOpen(false)
      setQuery('')
    }
  }

  function handleToggleMember(
    groupId: string,
    groupItem: EntityItem,
    memberName: string,
  ) {
    const isGroupSelected = value.some((e) => e.id === groupId)

    // If the group isn't selected yet, auto-select it first
    if (!isGroupSelected) {
      onChange([...value, toSelectedEntity(groupItem)])
      // Don't exclude — just selecting the group includes everyone
      return
    }

    // Toggle exclusion for this member
    setExcludedMembers((prev) => {
      const next = new Map(prev)
      const current = new Set(next.get(groupId) ?? [])
      if (current.has(memberName)) {
        current.delete(memberName)
      } else {
        current.add(memberName)
      }
      next.set(groupId, current)
      return next
    })
  }

  function handleResetExclusions(groupId: string) {
    setExcludedMembers((prev) => {
      const next = new Map(prev)
      next.delete(groupId)
      return next
    })
  }

  function handleRemove(entity: SelectedEntity) {
    onChange(value.filter((e) => e.id !== entity.id))
    setExcludedMembers((prev) => {
      const next = new Map(prev)
      next.delete(entity.id)
      return next
    })
  }

  function closePanel() {
    setIsOpen(false)
    setQuery('')
  }

  // When no scopes (staff/search-only mode): always call searchFn so staff panel
  // shows all groups + individuals immediately on open (searchFn('') returns all).
  // When scopes exist: only call searchFn when there's a query; browse tabs handle
  // the empty-query state.
  const searchResults =
    !scopes || query ? searchFn(query) : { groups: [], individuals: [] }

  function renderSectionHeader(title: string) {
    return (
      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
        {title}
      </div>
    )
  }

  function renderResultRow(item: EntityItem) {
    const groupExcluded = excludedMembers.get(item.id) ?? new Set<string>()
    return (
      <ResultRow
        key={item.id}
        item={item}
        isSelected={value.some((e) => e.id === item.id)}
        onToggle={() => handleToggle(item)}
        isExpanded={expandedGroupId === item.id}
        onToggleExpand={() =>
          setExpandedGroupId((prev) => (prev === item.id ? null : item.id))
        }
        selectedIndividualNames={selectedIndividualNames}
        excludedNames={groupExcluded}
        onToggleMember={(name, detail) =>
          handleToggleMember(item.id, item, name)
        }
        onResetExclusions={() => handleResetExclusions(item.id)}
      />
    )
  }

  function renderCreateCta(scope: EntityScope) {
    if (!scope.createHref) return null
    return (
      <div className="border-t px-3 py-2">
        <a
          href={scope.createHref}
          onMouseDown={(e) => e.preventDefault()}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-slate-50 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          <span>{scope.createLabel ?? 'Create new'}</span>
        </a>
      </div>
    )
  }

  function renderBrowseTab() {
    const scope = scopes?.find((s) => s.id === activeScope)
    if (!scope || scope.items.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {emptyTabText}
        </p>
      )
    }

    // If scope has sections, render with section headers and dividers
    if (scope.sections && scope.sections.length > 0) {
      return (
        <>
          {scope.sections.map((section, sectionIndex) => (
            <div key={section.label}>
              {sectionIndex > 0 && <div className="mx-3 my-0.5 border-t" />}
              {renderSectionHeader(section.label)}
              {section.items.map((item) => renderResultRow(item))}
            </div>
          ))}
          {renderCreateCta(scope)}
        </>
      )
    }

    // Flat list
    return (
      <>
        {scope.items.map((item) => renderResultRow(item))}
        {renderCreateCta(scope)}
      </>
    )
  }

  function renderSearchResults() {
    const { groups, individuals } = searchResults
    if (groups.length === 0 && individuals.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {noResultsText}
        </p>
      )
    }
    return (
      <>
        {groups.length > 0 && (
          <>
            {renderSectionHeader('Groups')}
            {groups.map((item) => renderResultRow(item))}
          </>
        )}
        {groups.length > 0 && individuals.length > 0 && (
          <div className="mx-3 my-0.5 border-t" />
        )}
        {individuals.length > 0 && (
          <>
            {renderSectionHeader('Individuals')}
            {individuals.map((item) => renderResultRow(item))}
          </>
        )}
      </>
    )
  }

  // Scope tab bar — rendered above the field on desktop, inside the Sheet on mobile
  const scopeTabs = scopes && scopes.length > 0 && (
    <div className="flex gap-1 overflow-x-auto scrollbar-none">
      {scopes.map((scope) => (
        <button
          key={scope.id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setActiveScope(scope.id)
            setQuery('')
            if (!isMobile) {
              setIsOpen(true)
              inputRef.current?.focus()
            }
          }}
          className={cn(
            'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            activeScope === scope.id
              ? 'bg-twblue-2 text-twblue-9'
              : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
          )}
        >
          {scope.label}
        </button>
      ))}
    </div>
  )

  // Panel content — shared between desktop dropdown and mobile Sheet
  // (does NOT contain a search input — desktop search is inline in the token
  //  container; mobile Sheet adds its own search input above this)
  const panelBody = (
    <>
      {/* Browse tabs — top of the dropdown panel, visible when scopes exist and not searching */}
      {scopes && scopes.length > 0 && !query && (
        <div className="border-b px-2 py-1.5">{scopeTabs}</div>
      )}

      {/* Results */}
      <div style={{ maxHeight: maxScrollHeight, overflowY: 'auto' }}>
        {!scopes || query ? renderSearchResults() : renderBrowseTab()}
      </div>
    </>
  )

  // Token input container — replaces the old single-line trigger button.
  // Selected chips are always visible here; desktop search input lives here too.
  const tokenContainer = (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      onClick={() => {
        if (!isMobile) {
          inputRef.current?.focus()
        } else {
          setIsOpen(true)
        }
      }}
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-input)] border border-input bg-background px-2.5 py-1.5 transition-colors',
        'cursor-text hover:border-ring',
        isOpen && 'border-ring ring-[3px] ring-ring/50',
      )}
    >
      {/* Selected chips */}
      {value.map((entity) => (
        <EntityChip
          key={entity.id}
          entity={entity}
          onRemove={() => handleRemove(entity)}
          excludedCount={excludedMembers.get(entity.id)?.size ?? 0}
        />
      ))}

      {/* Desktop: inline search input (always present, flex-1 expands to fill row) */}
      {!isMobile && (
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={value.length === 0 ? placeholder : undefined}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (query) setQuery('')
              else closePanel()
            }
            // Backspace on empty input removes the last chip
            if (e.key === 'Backspace' && !query && value.length > 0) {
              handleRemove(value[value.length - 1])
            }
          }}
          className="min-w-[100px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      )}

      {/* Clear all — visible when ≥1 chip is selected */}
      {value.length > 0 && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onChange([])
            setExcludedMembers(new Map())
          }}
          className="ml-auto shrink-0 text-xs text-muted-foreground transition-colors hover:text-rose-500"
        >
          Clear all
        </button>
      )}

      {/* Mobile: placeholder text + chevron (input is inside the Sheet) */}
      {isMobile && (
        <>
          {value.length === 0 && (
            <span className="flex-1 text-sm text-muted-foreground">
              {placeholder}
            </span>
          )}
          <ChevronDown
            className={cn(
              'ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </>
      )}
    </div>
  )

  return (
    <div ref={wrapperRef} className="relative">
      {tokenContainer}

      {/* Desktop: inline dropdown panel */}
      {!isMobile && isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-md">
          {panelBody}
        </div>
      )}

      {/* Mobile: bottom Sheet */}
      {isMobile && (
        <Sheet
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) setQuery('')
          }}
        >
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="max-h-[85vh] rounded-t-xl px-0 pt-0"
          >
            {/* Drag handle + title bar */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex flex-col gap-1">
                <div className="mx-auto h-1 w-12 rounded-full bg-slate-200" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {placeholder}
              </span>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-md p-1 hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search input inside Sheet */}
            <div className="relative border-b">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (query) setQuery('')
                    else closePanel()
                  }
                }}
                autoFocus
                className="w-full border-0 bg-transparent py-2.5 pl-9 pr-8 text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-slate-100"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Panel body (tabs + results) */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: 'calc(85vh - 108px)' }}
            >
              {panelBody}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
