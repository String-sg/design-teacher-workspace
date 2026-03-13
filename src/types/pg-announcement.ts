export type PGStatus = 'draft' | 'posted' | 'scheduled'
export type ReadStatus = 'read' | 'unread'
export type PGOwnership = 'mine' | 'shared'
export type PGRole = 'editor' | 'viewer'

export interface Shortcut {
  label: string
  url: string
}

export interface PGWebsiteLink {
  label: string
  url: string
}

export interface PGRecipient {
  studentId: string
  studentName: string
  indexNo?: string // class index number e.g. "01"
  classLabel: string
  parentName: string
  parentRelationship?: string // e.g. 'Father', 'Mother', 'Guardian'
  parentContact?: string // mobile number e.g. '9123 4567'
  pgStatus: 'onboarded' | 'not_onboarded' // whether parent has PG account
  readStatus: ReadStatus
  readAt?: string // ISO timestamp if read
}

export interface PGAttachment {
  name: string
  size: string // e.g. "320 KB"
}

export interface PGAnnouncement {
  id: string
  title: string
  description: string // stores HTML for rich text
  shortcuts: Array<Shortcut>
  websiteLinks: Array<PGWebsiteLink> // replaces websiteLink?: string
  attachments?: Array<PGAttachment>
  status: PGStatus
  recipients: Array<PGRecipient> // empty [] for drafts/scheduled
  staffInCharge: string
  enquiryEmail: string
  ownership: PGOwnership
  role: PGRole
  createdAt: string
  postedAt?: string
  scheduledAt?: string // set when status === 'scheduled'
}
