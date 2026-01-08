export interface Student {
  id: string
  name: string
  class: string
  attentionTags: Array<AttentionTag>
  overallPercentage: number
  conduct: ConductGrade
  learningSupport: string | null
  postSecEligibility: string
}

export type AttentionTag = 'FAS' | 'GEP' | 'LSM' | 'LSP' | 'SEN'

export type ConductGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor'

export interface ClassOption {
  value: string
  label: string
}

export type SortField = 'name' | 'class' | 'overall' | 'conduct'
export type SortDirection = 'asc' | 'desc'
