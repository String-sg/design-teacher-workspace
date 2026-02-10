import { getSchoolLevel, mockStudents } from './mock-students'
import type {
  AcademicAggregate,
  CCAInfo,
  CoreValue,
  CoreValueLevel,
  ExamOverall,
  GradingTier,
  GradingTierDefinition,
  HolisticData,
  HolisticReport,
  LearningOutcome,
  LearningOutcomeStatus,
  NapfaAward,
  ParentStatus,
  PhysicalFitness,
  ReviewStatus,
  SecondaryAcademicData,
  SecondaryGrade,
  SecondarySubjectPerformance,
  SemesterResult,
  StudentStatus,
  SubjectPerformance,
  Term,
  VIAActivity,
} from '@/types/report'
import type { Student } from '@/types/student'

const TERMS: Array<Term> = ['Term 1', 'Term 2', 'Term 3', 'Term 4']
const CURRENT_ACADEMIC_YEAR = 2025

const REVIEW_STATUSES: Array<ReviewStatus> = [
  'pending',
  'in_review',
  'approved',
]
const PARENT_STATUSES: Array<ParentStatus> = [
  'not_sent',
  'sent',
  'viewed',
  'acknowledged',
]
const STUDENT_STATUSES: Array<StudentStatus> = [
  'not_sent',
  'sent',
  'viewed',
  'acknowledged',
  'sent_to_parents',
]

function getRandomStatus<T>(statuses: Array<T>, seed: number): T {
  return statuses[seed % statuses.length]
}

function seededPick<T>(arr: Array<T>, seed: number): T {
  return arr[Math.abs(seed) % arr.length]
}

// --- Academic data generators ---

const OUTCOME_STATUSES: Array<LearningOutcomeStatus> = [
  'Accomplished',
  'Competent',
  'Developing',
  'Beginning',
]

const SUBJECT_OUTCOMES: Record<
  string,
  Array<{ name: string; description: string }>
> = {
  English: [
    {
      name: 'Reading Comprehension',
      description: 'Understands and interprets a variety of texts',
    },
    {
      name: 'Writing & Composition',
      description: 'Expresses ideas clearly in written form',
    },
    {
      name: 'Grammar & Vocabulary',
      description: 'Uses accurate grammar and appropriate vocabulary',
    },
    {
      name: 'Oral Communication',
      description: 'Communicates effectively in spoken English',
    },
  ],
  Chinese: [
    {
      name: 'Reading Comprehension',
      description: 'Reads and comprehends Chinese passages',
    },
    {
      name: 'Writing',
      description: 'Writes coherent compositions in Chinese',
    },
    {
      name: 'Oral & Listening',
      description: 'Listens and responds appropriately in Chinese',
    },
  ],
  Mathematics: [
    {
      name: 'Number & Algebra',
      description: 'Applies number operations and algebraic concepts',
    },
    {
      name: 'Measurement & Geometry',
      description: 'Understands measurement units and geometric shapes',
    },
    {
      name: 'Statistics & Probability',
      description: 'Interprets data and understands basic probability',
    },
    {
      name: 'Problem Solving',
      description: 'Applies mathematical reasoning to solve problems',
    },
  ],
  Science: [
    {
      name: 'Scientific Inquiry',
      description: 'Conducts experiments and draws conclusions from data',
    },
    {
      name: 'Diversity of Living Things',
      description: 'Classifies and describes living organisms',
    },
    {
      name: 'Cycles & Systems',
      description: 'Understands natural cycles and systems',
    },
  ],
  Music: [
    {
      name: 'Performance Skills',
      description: 'Performs music with expression and technique',
    },
    {
      name: 'Music Appreciation',
      description: 'Listens to and appreciates various musical styles',
    },
  ],
  Art: [
    {
      name: 'Creative Expression',
      description: 'Creates original artwork using various media',
    },
    {
      name: 'Art Appreciation',
      description: 'Observes and discusses artworks with understanding',
    },
  ],
  'Physical Education': [
    {
      name: 'Motor Skills',
      description: 'Demonstrates proficiency in fundamental movement',
    },
    {
      name: 'Sportsmanship',
      description: 'Displays fair play and teamwork during activities',
    },
  ],
}

function generateSubjects(
  student: Student,
  seed: number,
): Array<SubjectPerformance> {
  const subjectNames = Object.keys(SUBJECT_OUTCOMES)
  return subjectNames.map((name, i) => {
    const outcomes = SUBJECT_OUTCOMES[name]
    const learningOutcomes: Array<LearningOutcome> = outcomes.map((o, j) => {
      const statusSeed = seed + i * 7 + j * 3 + student.overallPercentage
      let statusIdx: number
      if (student.overallPercentage >= 80) {
        statusIdx = statusSeed % 2 // Accomplished or Competent
      } else if (student.overallPercentage >= 60) {
        statusIdx = statusSeed % 3 // Accomplished, Competent, or Developing
      } else {
        statusIdx = 1 + (statusSeed % 3) // Competent, Developing, or Beginning
      }
      return {
        name: o.name,
        description: o.description,
        status: OUTCOME_STATUSES[statusIdx],
      }
    })
    return { name, learningOutcomes }
  })
}

// --- Secondary academic data generators ---

const SECONDARY_SUBJECTS: Array<{ name: string; tier: GradingTier }> = [
  { name: 'English Language', tier: 'G3' },
  { name: 'Chinese Language', tier: 'G3' },
  { name: 'Mathematics', tier: 'G3' },
  { name: 'Science', tier: 'G3' },
  { name: 'Music', tier: 'G2' },
  { name: 'D&T', tier: 'G3' },
  { name: 'FCE', tier: 'G3' },
  { name: 'Humanities', tier: 'G3' },
]

const GRADING_SYSTEM: Array<GradingTierDefinition> = [
  {
    tier: 'G3',
    grades: [
      { grade: 'A1', minScore: 90, maxScore: 100 },
      { grade: 'A2', minScore: 75, maxScore: 89 },
      { grade: 'B3', minScore: 65, maxScore: 74 },
      { grade: 'B4', minScore: 60, maxScore: 64 },
      { grade: 'C5', minScore: 55, maxScore: 59 },
      { grade: 'C6', minScore: 50, maxScore: 54 },
      { grade: 'D7', minScore: 45, maxScore: 49 },
      { grade: 'E8', minScore: 40, maxScore: 44 },
      { grade: 'F9', minScore: 0, maxScore: 39 },
    ],
  },
  {
    tier: 'G2',
    grades: [
      { grade: 'A1', minScore: 85, maxScore: 100 },
      { grade: 'A2', minScore: 70, maxScore: 84 },
      { grade: 'B3', minScore: 60, maxScore: 69 },
      { grade: 'B4', minScore: 55, maxScore: 59 },
      { grade: 'C5', minScore: 50, maxScore: 54 },
      { grade: 'C6', minScore: 45, maxScore: 49 },
      { grade: 'D7', minScore: 40, maxScore: 44 },
      { grade: 'E8', minScore: 35, maxScore: 39 },
      { grade: 'F9', minScore: 0, maxScore: 34 },
    ],
  },
  {
    tier: 'G1',
    grades: [
      { grade: 'A1', minScore: 80, maxScore: 100 },
      { grade: 'A2', minScore: 65, maxScore: 79 },
      { grade: 'B3', minScore: 55, maxScore: 64 },
      { grade: 'B4', minScore: 50, maxScore: 54 },
      { grade: 'C5', minScore: 45, maxScore: 49 },
      { grade: 'C6', minScore: 40, maxScore: 44 },
      { grade: 'D7', minScore: 35, maxScore: 39 },
      { grade: 'E8', minScore: 30, maxScore: 34 },
      { grade: 'F9', minScore: 0, maxScore: 29 },
    ],
  },
  {
    tier: 'CMH',
    grades: [
      { grade: 'A1', minScore: 85, maxScore: 100 },
      { grade: 'A2', minScore: 70, maxScore: 84 },
      { grade: 'B3', minScore: 60, maxScore: 69 },
      { grade: 'B4', minScore: 55, maxScore: 59 },
      { grade: 'C5', minScore: 50, maxScore: 54 },
      { grade: 'C6', minScore: 45, maxScore: 49 },
      { grade: 'D7', minScore: 40, maxScore: 44 },
      { grade: 'E8', minScore: 35, maxScore: 39 },
      { grade: 'F9', minScore: 0, maxScore: 34 },
    ],
  },
]

const NAPFA_AWARDS: Array<NapfaAward> = [
  'Gold',
  'Silver',
  'Silver',
  'Bronze',
  'Pass',
]

const NAPFA_DESCRIPTIONS: Record<NapfaAward, string> = {
  Gold: 'Outstanding performance across all fitness stations. Demonstrated exceptional strength, flexibility, and endurance during the assessment.',
  Silver:
    'Strong performance in agility and endurance tests. Showed exceptional stamina during the 2.4km run.',
  Bronze:
    'Solid fitness level with room for improvement. Performed well in sit-ups and standing broad jump stations.',
  Pass: 'Met minimum fitness requirements across all stations. Encouraged to continue regular physical activity.',
}

function scoreToGrade(score: number, tier: GradingTier): SecondaryGrade {
  const tierDef = GRADING_SYSTEM.find((t) => t.tier === tier)
  if (!tierDef) return 'F9'
  for (const g of tierDef.grades) {
    if (score >= g.minScore && score <= g.maxScore) return g.grade
  }
  return 'F9'
}

function gradeToPoints(grade: SecondaryGrade): number {
  const map: Record<SecondaryGrade, number> = {
    A1: 1,
    A2: 2,
    B3: 3,
    B4: 4,
    C5: 5,
    C6: 6,
    D7: 7,
    E8: 8,
    F9: 9,
  }
  return map[grade]
}

function generateSecondarySubjects(
  student: Student,
  seed: number,
): Array<SecondarySubjectPerformance> {
  return SECONDARY_SUBJECTS.map((subj, i) => {
    const baseSeed = seed + i * 7 + student.overallPercentage
    const currentScore = Math.max(
      20,
      Math.min(100, student.overallPercentage + ((baseSeed % 30) - 15)),
    )
    const currentGrade = scoreToGrade(currentScore, subj.tier)

    const semesterHistory: Array<SemesterResult> = []
    for (let sem = 1; sem <= 3; sem++) {
      const semScore = Math.max(
        20,
        Math.min(100, currentScore + (((baseSeed + sem * 5) % 20) - 10)),
      )
      const delta =
        sem > 1 ? semScore - semesterHistory[sem - 2].score : undefined
      semesterHistory.push({
        semester: `Semester ${sem}`,
        score: semScore,
        grade: scoreToGrade(semScore, subj.tier),
        delta,
      })
    }

    const academicYearOverall = Math.round(
      semesterHistory.reduce((sum, s) => sum + s.score, 0) /
        semesterHistory.length,
    )

    return {
      name: subj.name,
      currentScore,
      currentGrade,
      gradingTier: subj.tier,
      semesterHistory,
      academicYearOverall,
    }
  })
}

function generateAcademicAggregates(
  subjects: Array<SecondarySubjectPerformance>,
): Array<AcademicAggregate> {
  const points = subjects.map((s) => ({
    name: s.name,
    points: gradeToPoints(s.currentGrade),
  }))

  const english = points.find((p) => p.name === 'English Language')
  const math = points.find((p) => p.name === 'Mathematics')
  const others = points
    .filter((p) => p.name !== 'English Language')
    .sort((a, b) => a.points - b.points)

  const engPts = english?.points ?? 9
  const mathPts = math?.points ?? 9
  const othersNoMath = others.filter((p) => p.name !== 'Mathematics')

  const l1r5 = engPts + others.slice(0, 5).reduce((s, p) => s + p.points, 0)
  const l1r4 = engPts + others.slice(0, 4).reduce((s, p) => s + p.points, 0)
  const l1b4 =
    engPts + othersNoMath.slice(0, 4).reduce((s, p) => s + p.points, 0)
  const elr2b2 = engPts + others.slice(0, 2).reduce((s, p) => s + p.points, 0)
  const elmab3 =
    engPts +
    mathPts +
    othersNoMath.slice(0, 3).reduce((s, p) => s + p.points, 0)

  return [
    { label: 'L1R5', value: l1r5, description: 'English + 5 subjects' },
    { label: 'L1R4', value: l1r4, description: 'English + 4 subjects' },
    {
      label: 'L1B4',
      value: l1b4,
      description: 'Eng + best 4 sub',
    },
    {
      label: 'ELR2B2',
      value: `${elr2b2}+`,
      description: 'English + best 2 subjects',
    },
    {
      label: 'ELMAB3',
      value: elmab3,
      description: 'Eng + Math + best 3',
    },
  ]
}

function generateExamOverall(
  subjects: Array<SecondarySubjectPerformance>,
  termIndex: number,
): ExamOverall {
  const avgScore =
    subjects.reduce((sum, s) => sum + s.currentScore, 0) / subjects.length
  const cumulativeAvg =
    subjects.reduce((sum, s) => sum + s.academicYearOverall, 0) /
    subjects.length
  return {
    examPerformance: Math.round(avgScore * 10) / 10,
    semesterLabel: `Semester ${termIndex + 1} Average`,
    academicYearOverall: Math.round(cumulativeAvg * 10) / 10,
    cumulativeLabel: 'Cumulative Percentage',
  }
}

function generateSecondaryAcademic(
  student: Student,
  seed: number,
  termIndex: number,
): SecondaryAcademicData {
  const subjects = generateSecondarySubjects(student, seed)
  return {
    overallPercentage: student.overallPercentage,
    learningSupport: student.learningSupport,
    postSecEligibility: student.postSecEligibility,
    aggregates: generateAcademicAggregates(subjects),
    subjects,
    overall: generateExamOverall(subjects, termIndex),
    gradingSystem: GRADING_SYSTEM,
  }
}

// --- Holistic data generators ---

const CORE_VALUE_LEVELS: Array<CoreValueLevel> = [
  'Demonstrates Very Strongly',
  'Demonstrates Strongly',
  'Demonstrates',
  'Regularly Shows',
  'Beginning',
]

const CORE_VALUE_DEFS: Array<{
  name: string
  description: string
  supportPool: Array<string>
}> = [
  {
    name: 'Appreciation',
    description:
      'Shows gratitude and values contributions of others to the community',
    supportPool: [
      'Teacher feedback on gratitude',
      'Peer recognition programme',
      'Community service reflection',
    ],
  },
  {
    name: 'Collaboration',
    description: 'Works well with others and contributes to group efforts',
    supportPool: [
      'Group project assessment',
      'CCA teamwork evaluation',
      'Peer feedback survey',
    ],
  },
  {
    name: 'Excellence',
    description: 'Strives for high standards and continuous improvement',
    supportPool: [
      'Academic achievement records',
      'Self-improvement portfolio',
      'CCA achievement records',
    ],
  },
  {
    name: 'Graciousness',
    description: 'Treats others with kindness, respect, and consideration',
    supportPool: [
      'Conduct observation records',
      'Peer nomination for kindness',
      'Teacher observation notes',
    ],
  },
  {
    name: 'Resilience',
    description: 'Perseveres through challenges and bounces back from setbacks',
    supportPool: [
      'Challenge completion records',
      'Teacher observation on perseverance',
      'Self-reflection journal entries',
    ],
  },
]

function generateCoreValues(student: Student, seed: number): Array<CoreValue> {
  return CORE_VALUE_DEFS.map((def, i) => {
    const scoreSeed = seed + i * 5 + student.overallPercentage
    const score = Math.max(1, Math.min(5, 3 + (scoreSeed % 3) - 1))
    const levelIdx = 5 - score
    const numSupports = 1 + ((seed + i) % 2)
    const supportBy = def.supportPool.slice(0, numSupports)
    return {
      name: def.name,
      description: def.description,
      level: CORE_VALUE_LEVELS[levelIdx],
      score,
      supportedBy: supportBy,
    }
  })
}

const BMI_CATEGORIES = [
  'Healthy Weight',
  'Healthy Weight',
  'Healthy Weight',
  'Overweight',
  'Underweight',
]

function generatePhysicalFitness(
  seed: number,
  isSecondary: boolean = false,
): PhysicalFitness {
  const category = seededPick(BMI_CATEGORIES, seed)
  const percentile = 40 + (seed % 50)
  const descriptions: Record<string, string> = {
    'Healthy Weight':
      'Maintains a healthy body weight appropriate for age and height. Continue with regular physical activity and balanced nutrition.',
    Overweight:
      'BMI is slightly above the healthy range. Encouraged to participate in more physical activities and maintain a balanced diet.',
    Underweight:
      'BMI is slightly below the healthy range. Encouraged to ensure adequate nutrition and regular meals.',
  }
  const base: PhysicalFitness = {
    bmiCategory: category,
    percentile,
    description: descriptions[category],
  }
  if (isSecondary) {
    const award = seededPick(NAPFA_AWARDS, seed + 3)
    base.napfaAward = award
    base.napfaDescription = NAPFA_DESCRIPTIONS[award]
  }
  return base
}

const VIA_POOL: Array<Omit<VIAActivity, 'hours'>> = [
  {
    category: 'Community Service',
    activityName: 'Clean Plate Campaign',
    role: 'Student Volunteer',
    description:
      'Participated in the school-wide campaign to reduce food waste by educating peers and monitoring meal portions.',
  },
  {
    category: 'Community Service',
    activityName: 'Reading Buddy Programme',
    role: 'Reading Buddy',
    description:
      'Paired with younger students to improve their reading skills through weekly one-on-one sessions.',
  },
  {
    category: 'Environmental',
    activityName: 'Green Schools Programme',
    role: 'Eco Ambassador',
    description:
      'Led recycling drives and participated in school garden maintenance as part of the sustainability initiative.',
  },
  {
    category: 'Community Outreach',
    activityName: 'Visit to Elderly Home',
    role: 'Student Volunteer',
    description:
      'Engaged with elderly residents through interactive activities and performances during community visits.',
  },
]

function generateVIA(seed: number): Array<VIAActivity> {
  const count = 1 + (seed % 2)
  const result: Array<VIAActivity> = []
  for (let i = 0; i < count; i++) {
    const activity = VIA_POOL[(seed + i) % VIA_POOL.length]
    result.push({
      ...activity,
      hours: 4 + ((seed + i * 3) % 12),
    })
  }
  return result
}

const CCA_POOL: Array<{
  category: string
  name: string
  roles: Array<string>
  recognitionPool: Array<string>
}> = [
  {
    category: 'Sports & Games',
    name: 'Basketball',
    roles: ['Member', 'Vice-Captain', 'Captain'],
    recognitionPool: [
      'National Inter-School Championship Participant',
      'Best Sportsmanship Award',
    ],
  },
  {
    category: 'Performing Arts',
    name: 'Choir',
    roles: ['Member', 'Section Leader', 'Student Conductor'],
    recognitionPool: [
      'SYF Arts Presentation — Certificate of Distinction',
      'School Concert Performer',
    ],
  },
  {
    category: 'Clubs & Societies',
    name: 'Robotics Club',
    roles: ['Member', 'Technical Lead', 'President'],
    recognitionPool: [
      'National Robotics Competition — Silver Award',
      'Maker Faire Presenter',
    ],
  },
  {
    category: 'Uniformed Groups',
    name: 'Scouts',
    roles: ['Scout', 'Patrol Leader', 'Troop Leader'],
    recognitionPool: [
      'Frank Cooper Sands Award — Gold',
      'Chief Commissioner Award',
    ],
  },
]

function generateCCA(student: Student, seed: number): Array<CCAInfo> {
  const ccaDef = CCA_POOL[seed % CCA_POOL.length]
  const roleIdx = seed % ccaDef.roles.length
  const years = 1 + (seed % 3)
  const numRecognitions = seed % 2
  const totalSessions = 30 + (seed % 10)
  const sessionsAttended = totalSessions - (seed % 5)
  return [
    {
      category: ccaDef.category,
      name: ccaDef.name,
      role: ccaDef.roles[roleIdx],
      years,
      recognition: ccaDef.recognitionPool.slice(0, numRecognitions),
      sessionsAttended,
      totalSessions,
    },
  ]
}

function generateHolisticData(
  student: Student,
  seed: number,
  isSecondary: boolean = false,
): HolisticData {
  return {
    coreValues: generateCoreValues(student, seed),
    physicalFitness: generatePhysicalFitness(seed, isSecondary),
    via: generateVIA(seed),
    cca: generateCCA(student, seed),
  }
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
  const schoolLevel = getSchoolLevel(student.class)
  const isSecondary = schoolLevel === 'secondary'

  return {
    id: reportId,
    studentId: student.id,
    studentName: student.name,
    studentClass: student.class,
    term,
    academicYear,
    generatedAt: new Date(academicYear, termIndex * 3 + 2, 15),
    schoolLevel,
    academic: {
      overallPercentage: student.overallPercentage,
      learningSupport: student.learningSupport,
      postSecEligibility: student.postSecEligibility,
      subjects: generateSubjects(student, seed),
    },
    secondaryAcademic: isSecondary
      ? generateSecondaryAcademic(student, seed, termIndex)
      : undefined,
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
    holistic: generateHolisticData(student, seed, isSecondary),
    teacherObservations: student.teacherObservations,
    nextSteps: student.nextSteps,
    reviewStatus: getRandomStatus(REVIEW_STATUSES, seed),
    parentStatus: getRandomStatus(PARENT_STATUSES, seed + 1),
    studentStatus: isSecondary
      ? getRandomStatus(STUDENT_STATUSES, seed + 2)
      : ('not_sent' as StudentStatus),
    nric: student.nric,
    indexNumber: student.indexNumber,
    formTeacher: student.formTeacher,
    coFormTeacher: student.coFormTeacher,
    promotionStatus: student.promotionStatus,
    attendance: {
      daysPresent: student.daysPresent,
      totalSchoolDays: student.totalSchoolDays,
      daysLate: student.lateComing,
    },
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
