import { mockStudents } from './mock-students'
import type {
  HolisticReport,
  ParentStatus,
  ReviewStatus,
  Term,
} from '@/types/report'
import type { Student } from '@/types/student'

const TERMS: Array<Term> = ['Term 1', 'Term 2', 'Term 3', 'Term 4']
const CURRENT_ACADEMIC_YEAR = 2025

const REVIEW_STATUSES: Array<ReviewStatus> = [
  'pending',
  'in_review',
  'approved',
]
const PARENT_STATUSES: Array<ParentStatus> = ['not_sent', 'sent', 'viewed']

function getRandomStatus<T>(statuses: Array<T>, seed: number): T {
  return statuses[seed % statuses.length]
}

export function generateReportFromStudent(
  student: Student,
  term: Term,
  academicYear: number,
): HolisticReport {
  const termIndex = TERMS.indexOf(term)
  const reportId = `${student.id}-${academicYear}-${termIndex + 1}`

  // Use a simple hash from student id and term for deterministic random statuses
  const seed = student.id.charCodeAt(0) + termIndex

  return {
    id: reportId,
    studentId: student.id,
    studentName: student.name,
    studentClass: student.class,
    term,
    academicYear,
    generatedAt: new Date(academicYear, termIndex * 3 + 2, 15),
    academic: {
      overallPercentage: student.overallPercentage,
      learningSupport: student.learningSupport,
      postSecEligibility: student.postSecEligibility,
    },
    character: {
      conduct: student.conduct,
      offences: student.offences,
      absences: student.absences,
      lateComing: student.lateComing,
      ccaMissed: student.ccaMissed,
      riskIndicators: student.riskIndicators,
      lowMoodFlagged: student.lowMoodFlagged,
      socialLinks: student.socialLinks,
      counsellingSessions: student.counsellingSessions,
    },
    teacherObservations: student.teacherObservations,
    nextSteps: student.nextSteps,
    reviewStatus: getRandomStatus(REVIEW_STATUSES, seed),
    parentStatus: getRandomStatus(PARENT_STATUSES, seed + 1),
  }
}

function generateAllReports(): Array<HolisticReport> {
  const reports: Array<HolisticReport> = []

  for (const student of mockStudents) {
    for (const term of TERMS) {
      reports.push(
        generateReportFromStudent(student, term, CURRENT_ACADEMIC_YEAR),
      )
    }
  }

  return reports
}

export const mockReports: Array<HolisticReport> = generateAllReports()

export function getReportById(id: string): HolisticReport | undefined {
  return mockReports.find((report) => report.id === id)
}

export interface ReportFilters {
  studentId?: string
  term?: Term
  academicYear?: number
}

export function filterReports(filters: ReportFilters): Array<HolisticReport> {
  return mockReports.filter((report) => {
    if (filters.studentId && report.studentId !== filters.studentId) {
      return false
    }
    if (filters.term && report.term !== filters.term) {
      return false
    }
    if (filters.academicYear && report.academicYear !== filters.academicYear) {
      return false
    }
    return true
  })
}

export function getUniqueStudents(): Array<{ id: string; name: string }> {
  const seen = new Set<string>()
  const students: Array<{ id: string; name: string }> = []

  for (const report of mockReports) {
    if (!seen.has(report.studentId)) {
      seen.add(report.studentId)
      students.push({
        id: report.studentId,
        name: report.studentName,
      })
    }
  }

  return students.sort((a, b) => a.name.localeCompare(b.name))
}

export { TERMS, CURRENT_ACADEMIC_YEAR }
