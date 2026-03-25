import type { StructuredGroup } from '@/types/student-group'
import { mockStudents } from '@/data/mock-students'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nameHash(name: string): number {
  let h = 0
  for (const c of name) h = Math.imul(31, h) + c.charCodeAt(0)
  return Math.abs(h)
}

function fakeNric(name: string): string {
  const h = nameHash(name)
  const prefix = h % 2 === 0 ? 'S' : 'T'
  const digits = String(h % 10_000_000).padStart(7, '0')
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  return `${prefix}${digits}${letters[h % letters.length]}`
}

const bandung = mockStudents.filter(
  (s) => s.schoolName === 'Bandung Secondary School',
)

// ─── Teacher's School Cockpit assignment ──────────────────────────────────────
// Mock: this teacher is assigned 2 classes (3 Aspiration, 3 Creativity) and
//       2 CCAs (Basketball, Choir) in School Cockpit.

const SYNC_DATE = '2026-03-20T08:00:00.000Z'

// Class: 3 Aspiration
const aspirationStudents = bandung
  .filter((s) => s.class === '3 Aspiration')
  .sort((a, b) => a.indexNumber - b.indexNumber)

// Class: 3 Creativity
const creativityStudents = bandung
  .filter((s) => s.class === '3 Creativity')
  .sort((a, b) => a.indexNumber - b.indexNumber)

// CCA member names
const BASKETBALL_NAMES = [
  'Chen Teo Jun Kai',
  'Yusuf Koh Xin Yi',
  'Bryan Tay Zhi Wei',
  'Ahmad Bin Hassan',
  'Kevin Ng Wei Ming',
  'Ryan Lim Zhi Hao',
  'Daniel Ong Jun Wei',
]

const CHOIR_NAMES = [
  'Sarah Chan Jun Kai',
  'Natalie Lim Jia Ying',
  'Sophie Wong Xin Hui',
  'Rachel Wong Mei Ling',
  'Priya Sharma',
  'Emily Tan Shu Wen',
  'Nurul Izzah Binte Kamal',
]

// Derive a fake class label for CCA members (spread across levels)
const CCA_CLASSES = [
  '1 Diligence',
  '1 Integrity',
  '2 Courage',
  '2 Excellence',
  '3 Aspiration',
  '3 Creativity',
  '4 Dedication',
]

function ccaMemberClass(name: string): string {
  return CCA_CLASSES[nameHash(name) % CCA_CLASSES.length]
}

// Level: Secondary 3 (all Sec 3 students assigned to this teacher's level)
const sec3Students = bandung
  .filter((s) => s.class.startsWith('3 '))
  .sort(
    (a, b) => a.class.localeCompare(b.class) || a.indexNumber - b.indexNumber,
  )

// Teaching Group: English Remedial Sec 3 (subset of Sec 3 students)
const englishRemedialNames = [
  'Ahmad Bin Hassan',
  'Bryan Tay Zhi Wei',
  'Chen Teo Jun Kai',
  'Daniel Ong Jun Wei',
  'Farah Binte Noor',
  'Grace Lim Shu Wen',
  'Hassan Bin Yusof',
  'Isabel Tan Xin Yi',
]

const TEACHING_CLASSES = ['3 Aspiration', '3 Creativity']

function teachingMemberClass(name: string): string {
  return TEACHING_CLASSES[nameHash(name) % TEACHING_CLASSES.length]
}

// ─── Exported structured groups ───────────────────────────────────────────────

export const TEACHER_STRUCTURED_GROUPS: Array<StructuredGroup> = [
  {
    id: 'structured:class:3-aspiration',
    kind: 'structured',
    structuredType: 'class',
    name: '3 Aspiration',
    syncedAt: SYNC_DATE,
    members: aspirationStudents.map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      nric: s.nric,
      indexNumber: s.indexNumber,
    })),
  },
  {
    id: 'structured:class:3-creativity',
    kind: 'structured',
    structuredType: 'class',
    name: '3 Creativity',
    syncedAt: SYNC_DATE,
    members: creativityStudents.map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      nric: s.nric,
      indexNumber: s.indexNumber,
    })),
  },
  {
    id: 'structured:cca:basketball',
    kind: 'structured',
    structuredType: 'cca',
    name: 'Basketball',
    syncedAt: SYNC_DATE,
    members: BASKETBALL_NAMES.map((name, i) => ({
      id: `cca-bball-${i}`,
      name,
      class: ccaMemberClass(name),
      nric: fakeNric(name),
    })),
  },
  {
    id: 'structured:cca:choir',
    kind: 'structured',
    structuredType: 'cca',
    name: 'Choir',
    syncedAt: SYNC_DATE,
    members: CHOIR_NAMES.map((name, i) => ({
      id: `cca-choir-${i}`,
      name,
      class: ccaMemberClass(name),
      nric: fakeNric(name),
    })),
  },
  {
    id: 'structured:level:sec-3',
    kind: 'structured',
    structuredType: 'level',
    name: 'Secondary 3',
    syncedAt: SYNC_DATE,
    members: sec3Students.map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      nric: s.nric,
      indexNumber: s.indexNumber,
    })),
  },
  {
    id: 'structured:teaching:english-remedial-3',
    kind: 'structured',
    structuredType: 'teaching',
    name: 'English Remedial (Sec 3)',
    syncedAt: SYNC_DATE,
    members: englishRemedialNames.map((name, i) => ({
      id: `teaching-eng-rem-${i}`,
      name,
      class: teachingMemberClass(name),
      nric: fakeNric(name),
    })),
  },
]

export function getStructuredGroupById(
  id: string,
): StructuredGroup | undefined {
  return TEACHER_STRUCTURED_GROUPS.find((g) => g.id === id)
}
