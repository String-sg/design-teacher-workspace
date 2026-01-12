export interface Student {
  id: string
  name: string
  class: string
  attentionTags: Array<AttentionTag>
  // Academic Performance
  overallPercentage: number
  conduct: ConductGrade
  learningSupport: string | null
  postSecEligibility: string
  // Behaviour & Discipline
  offences: number
  absences: number
  lateComing: number
  ccaMissed: number
  // Wellbeing
  riskIndicators: number
  lowMoodFlagged: string | null
  socialLinks: number
  counsellingSessions: number
  sen: string | null
  fas: string | null
  // Family, Housing, Finance
  housing: string | null
  housingType: 'Owned' | 'Rented' | null
  custody: string | null
  custodyDetails: string | null
  siblings: number
  externalAgencies: string | null
  // Teacher & Action
  teacherObservations: string | null
  nextSteps: string | null
}

export type AttentionTag = 'FAS' | 'GEP' | 'LSM' | 'LSP' | 'SEN'

export type ConductGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor'

export interface ClassOption {
  value: string
  label: string
}

export type FilterField =
  // General
  | 'name'
  | 'class'
  // Academic Performance
  | 'overallPercentage'
  | 'conduct'
  | 'learningSupport'
  | 'postSecEligibility'
  // Behaviour and Discipline
  | 'offences'
  | 'absences'
  | 'lateComing'
  | 'ccaMissed'
  // Wellbeing
  | 'riskIndicators'
  | 'lowMoodFlagged'
  | 'socialLinks'
  | 'counsellingSessions'
  | 'sen'
  | 'fas'
  // Family, Housing, Finance
  | 'housing'
  | 'housingType'
  | 'custody'
  | 'siblings'
  | 'externalAgencies'

export type FilterOperator =
  // Numeric operators
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'eq'
  // Text operators
  | 'contains'
  | 'not_contains'
  | 'is'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty'

export interface FilterCriterion {
  id: string
  field: FilterField
  operator: FilterOperator
  value: string | number
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}
