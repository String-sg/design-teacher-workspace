import type { ConductGrade } from './student'

export type Term = 'Term 1' | 'Term 2' | 'Term 3' | 'Term 4'

export type ReviewStatus = 'pending' | 'in_review' | 'approved'
export type ParentStatus = 'not_sent' | 'sent' | 'viewed'

// Academic types
export type LearningOutcomeStatus =
  | 'Accomplished'
  | 'Competent'
  | 'Developing'
  | 'Beginning'

export interface LearningOutcome {
  name: string
  description: string
  status: LearningOutcomeStatus
}

export interface SubjectPerformance {
  name: string
  learningOutcomes: Array<LearningOutcome>
}

export interface AcademicData {
  overallPercentage: number
  learningSupport: string | null
  postSecEligibility: string
  subjects: Array<SubjectPerformance>
}

export interface CharacterData {
  conduct: ConductGrade
  offences: number
  absences: number
  lateComing: number
  ccaMissed: number
  riskIndicators: number
  lowMoodFlagged: string | null
  socialLinks: number
  counsellingSessions: number
}

export interface AttendanceData {
  daysPresent: number
  totalSchoolDays: number
  daysLate: number
}

// Holistic types
export type CoreValueLevel =
  | 'Demonstrates Very Strongly'
  | 'Demonstrates Strongly'
  | 'Demonstrates'
  | 'Regularly Shows'
  | 'Beginning'

export interface CoreValue {
  name: string
  description: string
  level: CoreValueLevel
  score: number
  supportedBy: Array<string>
}

export interface PhysicalFitness {
  bmiCategory: string
  percentile: number
  description: string
}

export interface VIAActivity {
  category: string
  activityName: string
  role: string
  hours: number
  description: string
}

export interface CCAInfo {
  category: string
  name: string
  role: string
  years: number
  recognition: Array<string>
  sessionsAttended: number
  totalSessions: number
}

export interface HolisticData {
  coreValues: Array<CoreValue>
  physicalFitness: PhysicalFitness
  via: Array<VIAActivity>
  cca: Array<CCAInfo>
}

export interface HolisticReport {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  term: Term
  academicYear: number
  generatedAt: Date
  academic: AcademicData
  character: CharacterData
  holistic: HolisticData
  teacherObservations: string | null
  nextSteps: string | null
  reviewStatus: ReviewStatus
  parentStatus: ParentStatus
  nric: string
  indexNumber: number
  formTeacher: string
  coFormTeacher: string | null
  promotionStatus: string | null
  attendance: AttendanceData
}
