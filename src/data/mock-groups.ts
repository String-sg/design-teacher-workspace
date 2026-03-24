import type { StudentGroup } from '@/types/student-group'
import { mockStudents } from '@/data/mock-students'

export function getMockStudentById(id: string) {
  const s = mockStudents.find((student) => student.id === id)
  if (!s) return undefined
  return {
    name: s.name,
    class: s.class,
    nric: s.nric,
    indexNumber: s.indexNumber,
  }
}

// Learning Support Students — students from Bandung Secondary where learningSupport is not null
const lsStudents = mockStudents
  .filter(
    (s) =>
      s.schoolName === 'Bandung Secondary School' && s.learningSupport !== null,
  )
  .sort((a, b) => a.indexNumber - b.indexNumber)

// Drama Festival Cast — 6 from 3 Aspiration, 6 from 3 Creativity
const aspirationStudents = mockStudents
  .filter(
    (s) =>
      s.schoolName === 'Bandung Secondary School' && s.class === '3 Aspiration',
  )
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .slice(0, 6)

const creativityStudents = mockStudents
  .filter(
    (s) =>
      s.schoolName === 'Bandung Secondary School' && s.class === '3 Creativity',
  )
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .slice(0, 6)

// Science Olympiad Team — 4 from 4 Dedication, 4 from 4 Endeavour
const dedicationStudents = mockStudents
  .filter(
    (s) =>
      s.schoolName === 'Bandung Secondary School' && s.class === '4 Dedication',
  )
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .slice(0, 4)

const endeavourStudents = mockStudents
  .filter(
    (s) =>
      s.schoolName === 'Bandung Secondary School' && s.class === '4 Endeavour',
  )
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .slice(0, 4)

export const MOCK_GROUPS: Array<StudentGroup> = [
  {
    id: 'cg-learning-support',
    name: 'Learning Support Students',
    description:
      'Students enrolled in the Learning Support Programme (LSP) or Learning Support for Mathematics (LSM) across all classes.',
    members: lsStudents.map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      nric: s.nric,
      indexNumber: s.indexNumber,
    })),
    staffInCharge: [
      { id: 'tan-ml', name: 'Mrs Tan Mei Lin', type: 'individual' },
    ],
    visibility: 'private',
    sharedWith: [
      {
        staffId: 'tan-ml',
        name: 'Mrs Tan Mei Lin',
        email: 'tanml@school.edu.sg',
        role: 'viewer',
      },
      {
        staffId: 'lim-bh',
        name: 'Mr Lim Beng Huat',
        email: 'limbh@school.edu.sg',
        role: 'editor',
      },
      {
        staffId: 'priya-n',
        name: 'Ms Priya Nair',
        email: 'priyan@school.edu.sg',
        role: 'viewer',
      },
    ],
    createdBy: { name: 'Mrs Tan Mei Lin', email: 'tanml@school.edu.sg' },
    createdAt: '2025-01-15T08:30:00.000Z',
    updatedAt: '2025-09-10T14:22:00.000Z',
    lastUsedAt: '2025-09-10T14:22:00.000Z',
  },
  {
    id: 'cg-drama-festival',
    name: 'Drama Festival Cast',
    description:
      'Selected students from Sec 3 Aspiration and Creativity classes performing in the school Drama Festival 2025.',
    members: [...aspirationStudents, ...creativityStudents].map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      nric: s.nric,
      indexNumber: s.indexNumber,
    })),
    staffInCharge: [
      { id: 'wong-km', name: 'Mr Wong Kai Ming', type: 'individual' },
    ],
    visibility: 'private',
    sharedWith: [
      {
        staffId: 'wong-km',
        name: 'Mr Wong Kai Ming',
        email: 'wongkm@school.edu.sg',
        role: 'editor',
      },
      {
        staffId: 'chan-hl',
        name: 'Ms Chan Hui Ling',
        email: 'chanhl@school.edu.sg',
        role: 'viewer',
      },
    ],
    createdBy: { name: 'Mrs Tan Mei Lin', email: 'tanml@school.edu.sg' },
    createdAt: '2025-03-05T10:00:00.000Z',
    updatedAt: '2025-11-20T09:45:00.000Z',
    lastUsedAt: '2025-11-20T09:45:00.000Z',
  },
  {
    id: 'cg-science-olympiad',
    name: 'Science Olympiad Team',
    description:
      'Top Sec 4 Science students from Dedication and Endeavour classes selected for the National Science Olympiad 2025.',
    members: [...dedicationStudents, ...endeavourStudents].map((s) => ({
      id: s.id,
      name: s.name,
      class: s.class,
      nric: s.nric,
      indexNumber: s.indexNumber,
    })),
    staffInCharge: [
      { id: 'rajan-s', name: 'Mr Rajan Subramaniam', type: 'individual' },
    ],
    visibility: 'private',
    sharedWith: [
      {
        staffId: 'rajan-s',
        name: 'Mr Rajan Subramaniam',
        email: 'rajans@school.edu.sg',
        role: 'editor',
      },
      {
        staffId: 'ng-xh',
        name: 'Ms Ng Xiu Han',
        email: 'ngxh@school.edu.sg',
        role: 'viewer',
      },
    ],
    createdBy: { name: 'Mrs Tan Mei Lin', email: 'tanml@school.edu.sg' },
    createdAt: '2025-04-18T11:15:00.000Z',
    updatedAt: '2025-10-30T16:00:00.000Z',
    lastUsedAt: '2025-10-30T16:00:00.000Z',
  },
]

export function getGroupById(id: string): StudentGroup | undefined {
  return MOCK_GROUPS.find((g) => g.id === id)
}
