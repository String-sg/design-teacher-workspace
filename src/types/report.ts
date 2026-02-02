import type { ConductGrade } from './student'

export type Term = 'Term 1' | 'Term 2' | 'Term 3' | 'Term 4'

export interface AcademicData {
  overallPercentage: number
  learningSupport: string | null
  postSecEligibility: string
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
  teacherObservations: string | null
  nextSteps: string | null
}
