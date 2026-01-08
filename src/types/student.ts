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

export type SortField =
  | 'name'
  | 'class'
  | 'overall'
  | 'conduct'
  | 'offences'
  | 'riskIndicators'
  | 'absences'
  | 'lateComing'
  | 'ccaMissed'
  | 'learningSupport'
  | 'postSecEligibility'

export type SortDirection = 'asc' | 'desc'

export interface SortCriterion {
  field: SortField
  direction: SortDirection
}
