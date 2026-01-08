import type { AttentionTag, ClassOption, Student } from '@/types/student'

export const mockStudents: Array<Student> = [
  {
    id: '1',
    name: 'Chen Teo Jun Kai',
    class: '3A',
    attentionTags: ['FAS'],
    overallPercentage: 62,
    conduct: 'Poor',
    learningSupport: 'LSM',
    postSecEligibility: '572 ITE, 175 Poly',
  },
  {
    id: '2',
    name: 'Vincent Koh Xin Yi',
    class: '3A',
    attentionTags: [],
    overallPercentage: 55,
    conduct: 'Good',
    learningSupport: 'LSM',
    postSecEligibility: '530 ITE, 157 Poly',
  },
  {
    id: '3',
    name: 'Xiao Lam Wei Jie',
    class: '3A',
    attentionTags: ['FAS', 'GEP'],
    overallPercentage: 34,
    conduct: 'Excellent',
    learningSupport: null,
    postSecEligibility: '404 ITE, 105 Poly',
  },
  {
    id: '4',
    name: 'Sarah Chan Jun Kai',
    class: '3A',
    attentionTags: [],
    overallPercentage: 87,
    conduct: 'Poor',
    learningSupport: 'LSM',
    postSecEligibility: '722 ITE, 237 Poly',
  },
  {
    id: '5',
    name: 'Yusuf Koh Xin Yi',
    class: '3A',
    attentionTags: ['LSM', 'LSP'],
    overallPercentage: 35,
    conduct: 'Good',
    learningSupport: null,
    postSecEligibility: '410 ITE, 107 Poly',
  },
  {
    id: '6',
    name: 'Liang Lim Wei Jie',
    class: '3A',
    attentionTags: [],
    overallPercentage: 99,
    conduct: 'Good',
    learningSupport: 'LSM, LSP',
    postSecEligibility: '794 ITE, 267 Poly',
  },
  {
    id: '7',
    name: 'Sarah Tan Jun Kai',
    class: '3A',
    attentionTags: [],
    overallPercentage: 16,
    conduct: 'Fair',
    learningSupport: 'LSM',
    postSecEligibility: '296 ITE, 60 Poly',
  },
  {
    id: '8',
    name: 'Harish Cheng Xin Yi',
    class: '3A',
    attentionTags: [],
    overallPercentage: 45,
    conduct: 'Poor',
    learningSupport: null,
    postSecEligibility: '470 ITE, 132 Poly',
  },
  {
    id: '9',
    name: 'Tan Lam Wei Jie',
    class: '3A',
    attentionTags: ['SEN', 'FAS'],
    overallPercentage: 7,
    conduct: 'Good',
    learningSupport: null,
    postSecEligibility: '242 ITE, 37 Poly',
  },
  {
    id: '10',
    name: 'Jason Chua Jun Kai',
    class: '3A',
    attentionTags: ['GEP'],
    overallPercentage: 31,
    conduct: 'Fair',
    learningSupport: null,
    postSecEligibility: '386 ITE, 97 Poly',
  },
  {
    id: '11',
    name: 'Ahmad Bin Hassan',
    class: '3B',
    attentionTags: ['FAS'],
    overallPercentage: 72,
    conduct: 'Good',
    learningSupport: 'LSP',
    postSecEligibility: '620 ITE, 195 Poly',
  },
  {
    id: '12',
    name: 'Rachel Wong Mei Ling',
    class: '3B',
    attentionTags: [],
    overallPercentage: 91,
    conduct: 'Excellent',
    learningSupport: null,
    postSecEligibility: '780 ITE, 258 Poly',
  },
]

export const classOptions: Array<ClassOption> = [
  { value: 'all', label: 'All Classes' },
  { value: '3A', label: 'Secondary 3A' },
  { value: '3B', label: 'Secondary 3B' },
  { value: '3C', label: 'Secondary 3C' },
]

export interface DashboardMetrics {
  absenteeismRate: number
  lateComing: number
  tier2_3Students: number
}

export function getMetrics(students: Array<Student>): DashboardMetrics {
  const totalStudents = students.length

  const studentsWithAbsenteeism = students.filter(
    (s) => s.overallPercentage < 50,
  ).length

  const absenteeismRate =
    totalStudents > 0
      ? Math.round((studentsWithAbsenteeism / totalStudents) * 100)
      : 0

  const lateComing = students.filter((s) =>
    s.attentionTags.some((tag) => ['LSM', 'LSP'].includes(tag)),
  ).length

  const tier2_3Students = students.filter(
    (s) =>
      s.attentionTags.some((tag) => ['FAS', 'SEN'].includes(tag)) ||
      s.conduct === 'Poor' ||
      s.overallPercentage < 40,
  ).length

  return {
    absenteeismRate,
    lateComing,
    tier2_3Students,
  }
}

export const tagColors: Record<
  AttentionTag,
  'default' | 'secondary' | 'outline'
> = {
  FAS: 'default',
  GEP: 'default',
  LSM: 'secondary',
  LSP: 'secondary',
  SEN: 'outline',
}
