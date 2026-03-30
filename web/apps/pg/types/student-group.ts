export interface GroupMember {
  id: string
  name: string
  class: string
  nric?: string
  indexNumber?: number
  cca?: string
}

export interface GroupSharedWith {
  staffId: string
  name: string
  email: string
  role: 'editor' | 'viewer'
}

export interface StaffInCharge {
  id: string
  name: string
  type: 'individual' | 'group'
}

export type StructuredGroupType = 'class' | 'level' | 'cca' | 'teaching'
export type GroupTypeFilterOption =
  | 'regular'
  | 'class'
  | 'level'
  | 'cca'
  | 'teaching'

export interface StudentGroup {
  id: string
  name: string
  description?: string
  kind: 'regular'
  source?: 'created' | 'saved-from-sdt'
  members: Array<GroupMember>
  staffInCharge: Array<StaffInCharge>
  visibility: 'private' | 'school'
  sharedWith: Array<GroupSharedWith>
  createdBy: { name: string; email: string }
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
}

export interface StructuredGroup {
  id: string
  kind: 'structured'
  structuredType: StructuredGroupType
  name: string
  members: Array<GroupMember>
  syncedAt: string
}

export type UnifiedGroup = StudentGroup | StructuredGroup

export function getStructuredTypeLabel(type: StructuredGroupType): string {
  return {
    class: 'Class',
    level: 'Level',
    cca: 'CCA',
    teaching: 'Teaching Group',
  }[type]
}
