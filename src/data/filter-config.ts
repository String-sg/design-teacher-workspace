import type { ReactNode } from 'react'
import type { FilterField, FilterOperator } from '@/types/student'

export type FieldType = 'numeric' | 'text' | 'boolean' | 'enum'

export type FieldGroup =
  | 'general'
  | 'academic'
  | 'behaviour'
  | 'wellbeing'
  | 'family'

export interface OperatorOption {
  value: FilterOperator
  label: string
  icon?: ReactNode
}

export interface FilterFieldOption {
  field: FilterField
  label: string
  type: FieldType
  group: FieldGroup
  operators: Array<OperatorOption>
  defaultOperator: FilterOperator
  defaultValue: string | number
  enumValues?: Array<string>
}

export const groupLabels: Record<FieldGroup, string> = {
  general: 'General',
  academic: 'Academic Performance',
  behaviour: 'Behaviour and Discipline',
  wellbeing: 'Wellbeing',
  family: 'Family, Housing, Finance',
}

export const groupOrder: Array<FieldGroup> = [
  'general',
  'behaviour',
  'academic',
  'wellbeing',
  'family',
]

export const textOperators: Array<OperatorOption> = [
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
]

// Note: numericOperators and booleanOperators include icons that need to be
// rendered with React components, so they are defined in the component file
// to avoid importing React components in this data file.

export interface FilterFieldConfig {
  field: FilterField
  label: string
  type: FieldType
  group: FieldGroup
  defaultOperator: FilterOperator
  defaultValue: string | number
  enumValues?: Array<string>
}

export const filterFieldConfigs: Array<FilterFieldConfig> = [
  // General
  {
    field: 'class',
    label: 'Class',
    type: 'text',
    group: 'general',
    defaultOperator: 'contains',
    defaultValue: '',
  },
  {
    field: 'cca',
    label: 'CCA',
    type: 'text',
    group: 'general',
    defaultOperator: 'contains',
    defaultValue: '',
  },
  // Behaviour and Discipline
  {
    field: 'absences',
    label: 'Non-VR absences(%)',
    type: 'numeric',
    group: 'behaviour',
    defaultOperator: 'gte',
    defaultValue: 5,
  },
  {
    field: 'lateComing',
    label: 'Late-coming(%)',
    type: 'numeric',
    group: 'behaviour',
    defaultOperator: 'gte',
    defaultValue: 5,
  },
  {
    field: 'offences',
    label: 'Offences',
    type: 'numeric',
    group: 'behaviour',
    defaultOperator: 'gte',
    defaultValue: 1,
  },
  {
    field: 'ccaMissed',
    label: 'CCA attendance(%)',
    type: 'numeric',
    group: 'behaviour',
    defaultOperator: 'gte',
    defaultValue: 3,
  },
  // Academic Performance
  {
    field: 'overallPercentage',
    label: 'Overall % across selected subjects',
    type: 'numeric',
    group: 'academic',
    defaultOperator: 'lte',
    defaultValue: 50,
  },
  {
    field: 'conduct',
    label: 'Conduct grade',
    type: 'enum',
    group: 'academic',
    defaultOperator: 'is',
    defaultValue: 'Poor',
    enumValues: ['Excellent', 'Good', 'Fair', 'Poor'],
  },
  {
    field: 'approvedMtl',
    label: 'Approved MTL',
    type: 'text',
    group: 'academic',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'learningSupport',
    label: 'Learning support',
    type: 'text',
    group: 'academic',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'postSecEligibility',
    label: 'Post-Sec Eligibility',
    type: 'text',
    group: 'academic',
    defaultOperator: 'contains',
    defaultValue: '',
  },
  // Wellbeing
  {
    field: 'riskIndicators',
    label: 'Risk indicators',
    type: 'numeric',
    group: 'wellbeing',
    defaultOperator: 'gte',
    defaultValue: 3,
  },
  {
    field: 'lowMoodFlagged',
    label: 'Low mood flagged 2+ terms',
    type: 'boolean',
    group: 'wellbeing',
    defaultOperator: 'is',
    defaultValue: 'Yes',
    enumValues: ['Yes', 'No'],
  },
  {
    field: 'socialLinks',
    label: 'Social links',
    type: 'numeric',
    group: 'wellbeing',
    defaultOperator: 'lte',
    defaultValue: 2,
  },
  {
    field: 'counsellingSessions',
    label: 'Counselling',
    type: 'numeric',
    group: 'wellbeing',
    defaultOperator: 'gte',
    defaultValue: 1,
  },
  {
    field: 'sen',
    label: 'SEN',
    type: 'text',
    group: 'wellbeing',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'fas',
    label: 'FAS',
    type: 'boolean',
    group: 'wellbeing',
    defaultOperator: 'is',
    defaultValue: 'Yes',
    enumValues: ['Yes', 'No'],
  },
  // Family, Housing, Finance
  {
    field: 'housing',
    label: 'Housing',
    type: 'text',
    group: 'family',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'housingType',
    label: 'Housing ownership',
    type: 'enum',
    group: 'family',
    defaultOperator: 'is',
    defaultValue: 'Rented',
    enumValues: ['Owned', 'Rented'],
  },
  {
    field: 'custody',
    label: 'Custody',
    type: 'text',
    group: 'family',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'commuterStatus',
    label: 'Commuter status',
    type: 'text',
    group: 'family',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'afterSchoolArrangement',
    label: 'After-school arrangement',
    type: 'text',
    group: 'family',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
  {
    field: 'siblings',
    label: 'Siblings',
    type: 'numeric',
    group: 'family',
    defaultOperator: 'gte',
    defaultValue: 3,
  },
  {
    field: 'externalAgencies',
    label: 'External Agencies',
    type: 'text',
    group: 'family',
    defaultOperator: 'is_not_empty',
    defaultValue: '',
  },
]
