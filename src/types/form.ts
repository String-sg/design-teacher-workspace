export type FormStatus = 'draft' | 'active' | 'closed'
export type FormOwnership = 'mine' | 'shared'
export type FormType = 'quick' | 'allears' | 'link'
export type ResponseType = 'yes-no' | 'acknowledge'
export type ReminderType = 'none' | 'one-time' | 'daily'

export type QuestionType = 'open' | 'mcq'

export interface FormQuestion {
  id: string
  text: string
  type?: QuestionType       // 'open' | 'mcq' (default: 'open')
  options?: string[]        // MCQ only: custom answer choices (min 2, max 6)
  showAfter?: 'yes' | 'no' | 'both' // yes-no forms only (default: 'both')
}

export interface Form {
  id: string
  title: string
  description: string
  status: FormStatus
  createdAt: string
  recipientCount: number
  completedCount: number
  ownership: FormOwnership
  targetClasses: string[]
  formType?: FormType
  responseType?: ResponseType
  questions?: FormQuestion[]
  eventStart?: string
  eventEnd?: string
  venue?: string
  dueDate?: string
  reminderType?: ReminderType
  reminderDate?: string
  formLink?: string
  allEarsFormId?: string
  scheduledAt?: string
}

export interface FormRecipient {
  studentId: string
  studentName: string
  indexNo: string
  classLabel: string
  parentName: string
  parentRelationship: string
  parentContact: string
  pgStatus: 'onboarded' | 'not_onboarded'
  readStatus: 'read' | 'unread'
  readAt?: string
  responseStatus: 'responded' | 'pending'
  respondedAt?: string
  formResponse?: 'yes' | 'no'
  questionAnswers?: string[]
}
