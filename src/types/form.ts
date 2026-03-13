export type FormStatus = 'draft' | 'active' | 'closed'

export interface Form {
  id: string
  title: string
  description: string
  status: FormStatus
  createdAt: string
  recipientCount: number
  completedCount: number
}
