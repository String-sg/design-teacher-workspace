export type FormStatus = 'draft' | 'active' | 'closed'

export type QuestionType =
  | 'mcq'
  | 'checkbox'
  | 'short-answer'
  | 'file-upload'
  | 'yes-no'

export interface Question {
  id: string
  type: QuestionType
  text: string
  required: boolean
  options?: Array<string>
  conditionalOn?: { questionId: string; answer: string }
}

export interface RecipientGroup {
  id: string
  name: string
  type: 'class' | 'cca' | 'custom'
  parentCount: number
}

export interface FormResponse {
  studentName: string
  responded: boolean
  submittedAt?: Date
  answers?: Record<string, string | Array<string>>
}

export interface ParentForm {
  id: string
  title: string
  status: FormStatus
  groups: Array<RecipientGroup>
  totalRecipients: number
  responseCount: number
  questions: Array<Question>
  responses: Array<FormResponse>
  deadline: Date
  createdAt: Date
  lastModified: Date
}
