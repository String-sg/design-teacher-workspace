export interface GroupMember {
  id: string
  name: string
  class: string
  nric?: string
  indexNumber?: number
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

export interface StudentGroup {
  id: string
  name: string
  description?: string
  members: Array<GroupMember>
  staffInCharge: Array<StaffInCharge>
  visibility: 'private' | 'school'
  sharedWith: Array<GroupSharedWith>
  createdBy: { name: string; email: string }
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
}
