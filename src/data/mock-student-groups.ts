import type {
  EntityItem,
  EntityScope,
} from '@/components/parents-gateway/entity-selector'
import { mockStudents } from '@/data/mock-students'

// Derive class groups dynamically from live mock data (Bandung Secondary only).
// Sorted by level then stream: Sec 1A, Sec 1B … Sec 2A, Sec 2B … etc.
function deriveClassGroups(): Array<EntityItem> {
  const classMap = new Map<string, { names: Array<string> }>()
  for (const s of mockStudents) {
    if (s.schoolName !== 'Bandung Secondary School') continue
    if (!classMap.has(s.class)) classMap.set(s.class, { names: [] })
    classMap.get(s.class)!.names.push(s.name)
  }
  return [...classMap.entries()]
    .sort(([a], [b]) => {
      // Parse "Sec 1A" → level=1, stream="A" for correct numeric ordering
      const parse = (label: string) => {
        const m = label.match(/Sec (\d+)([A-Z]*)/)
        return m
          ? { level: Number(m[1]), stream: m[2] }
          : { level: 99, stream: label }
      }
      const pa = parse(a)
      const pb = parse(b)
      if (pa.level !== pb.level) return pa.level - pb.level
      return pa.stream.localeCompare(pb.stream)
    })
    .map(([cls, { names }]) => ({
      id: `class:${cls}`,
      label: cls,
      type: 'group' as const,
      count: names.length,
      memberNames: names,
      groupType: 'class' as const,
    }))
}

const bandungStudents = mockStudents.filter(
  (s) => s.schoolName === 'Bandung Secondary School',
)

export const CLASS_GROUPS: Array<EntityItem> = deriveClassGroups()

export const LEVEL_GROUPS: Array<EntityItem> = [
  {
    id: 'level:sec1',
    label: 'Secondary 1',
    type: 'group',
    count: bandungStudents.filter((s) => s.class.startsWith('Sec 1')).length,
    groupType: 'level',
  },
  {
    id: 'level:sec2',
    label: 'Secondary 2',
    type: 'group',
    count: bandungStudents.filter((s) => s.class.startsWith('Sec 2')).length,
    groupType: 'level',
  },
  {
    id: 'level:sec3',
    label: 'Secondary 3',
    type: 'group',
    count: bandungStudents.filter((s) => s.class.startsWith('Sec 3')).length,
    groupType: 'level',
  },
  {
    id: 'level:sec4',
    label: 'Secondary 4',
    type: 'group',
    count: bandungStudents.filter((s) => s.class.startsWith('Sec 4')).length,
    groupType: 'level',
  },
]

export const SCHOOL_GROUP: EntityItem = {
  id: 'school:bandung',
  label: 'Bandung Secondary School',
  type: 'group',
  count: bandungStudents.length,
  groupType: 'school',
}

// CCA membership is derived from the actual Bandung Secondary student list.
// Each student belongs to exactly one CCA (7 members per CCA = 35 total).
export const CCA_GROUPS: Array<EntityItem> = [
  {
    id: 'cca:basketball',
    label: 'Basketball',
    type: 'group',
    count: 7,
    groupType: 'cca',
    memberNames: [
      'Chen Teo Jun Kai',
      'Yusuf Koh Xin Yi',
      'Bryan Tay Zhi Wei',
      'Ahmad Bin Hassan',
      'Kevin Ng Wei Ming',
      'Ryan Lim Zhi Hao',
      'Daniel Ong Jun Wei',
    ],
  },
  {
    id: 'cca:choir',
    label: 'Choir',
    type: 'group',
    count: 7,
    groupType: 'cca',
    memberNames: [
      'Sarah Chan Jun Kai',
      'Natalie Lim Jia Ying',
      'Sophie Wong Xin Hui',
      'Rachel Wong Mei Ling',
      'Priya Sharma',
      'Emily Tan Shu Wen',
      'Nurul Izzah Binte Kamal',
    ],
  },
  {
    id: 'cca:drama',
    label: 'Drama',
    type: 'group',
    count: 7,
    groupType: 'cca',
    memberNames: [
      'Vincent Koh Xin Yi',
      'Jason Chua Jun Kai',
      'Grace Tan Li Wen',
      'Muhammad Farhan',
      'Marcus Foo Jun Jie',
      'Joshua Lee Wei Xuan',
      'Cheryl Goh Hui Min',
    ],
  },
  {
    id: 'cca:badminton',
    label: 'Badminton',
    type: 'group',
    count: 7,
    groupType: 'cca',
    memberNames: [
      'Xiao Lam Wei Jie',
      'Harish Cheng Xin Yi',
      'Liang Lim Wei Jie',
      'Ethan Koh Ming Hao',
      'Darren Lim Kai Xiang',
      'Siti Aminah Binte Rahman',
      'Arjun Krishnan',
    ],
  },
  {
    id: 'cca:robotics',
    label: 'Robotics Club',
    type: 'group',
    count: 7,
    groupType: 'cca',
    memberNames: [
      'Sarah Tan Jun Kai',
      'Tan Lam Wei Jie',
      'Isabelle Chua Mei Xuan',
      'Aisha Binte Mohamed',
      'Michelle Teo Xin Yi',
      'Hafiz Bin Abdullah',
      'Lucas Ng Wei Jie',
    ],
  },
]

// Teaching group rosters: all Sec 3 students are in every core subject group.
// Science is ~80% of students (not all take the same science combination).
const sec3Students = bandungStudents.filter((s) => s.class.startsWith('Sec 3'))
const sec3Names = sec3Students.map((s) => s.name)
// Sec 3 Science: exclude a few students who take a different track
const scienceNames = sec3Names.filter((_, i) => i % 5 !== 4) // ~80% (drop every 5th)

export const TEACHING_GROUPS: Array<EntityItem> = [
  {
    id: 'tg:sec3-math',
    label: 'Sec 3 Mathematics',
    type: 'group',
    count: sec3Students.length,
    groupType: 'teaching',
    memberNames: sec3Names,
  },
  {
    id: 'tg:sec3-english',
    label: 'Sec 3 English',
    type: 'group',
    count: sec3Students.length,
    groupType: 'teaching',
    memberNames: sec3Names,
  },
  {
    id: 'tg:sec3-science',
    label: 'Sec 3 Science',
    type: 'group',
    count: scienceNames.length,
    groupType: 'teaching',
    memberNames: scienceNames,
  },
  {
    id: 'tg:sec3-mother-tongue',
    label: 'Sec 3 Mother Tongue',
    type: 'group',
    count: sec3Students.length,
    groupType: 'teaching',
    memberNames: sec3Names,
  },
]

export const CUSTOM_GROUPS: Array<EntityItem> = [
  {
    id: 'cg:learning-support',
    label: 'Learning Support Students',
    type: 'group',
    count: bandungStudents.filter((s) => s.learningSupport !== null).length,
    groupType: 'custom',
    // Full list: all students with a learning support tier assigned
    memberNames: bandungStudents
      .filter((s) => s.learningSupport !== null)
      .map((s) => s.name),
  },
  {
    id: 'cg:drama-festival',
    label: 'Drama Festival Cast',
    type: 'group',
    count: 12,
    groupType: 'custom',
    memberNames: [
      'Jordan Tan Jia Le',
      'Natasha Lee Wei Ling',
      'Jayden Wong Zhi Hao',
      'Priya Sundaram',
    ],
  },
]

// Flat array of all group items (used for cross-scope search)
export const ALL_STUDENT_GROUP_ITEMS: Array<EntityItem> = [
  ...CLASS_GROUPS,
  ...LEVEL_GROUPS,
  SCHOOL_GROUP,
  ...CCA_GROUPS,
  ...TEACHING_GROUPS,
  ...CUSTOM_GROUPS,
]

// All individual students as EntityItems
export const STUDENT_INDIVIDUAL_ITEMS: Array<EntityItem> = bandungStudents.map(
  (s) => ({
    id: `student:${s.id}`,
    label: s.name,
    sublabel: `${s.class} · #${String(s.indexNumber).padStart(2, '0')}`,
    badge: s.nric,
    type: 'individual' as const,
    count: 1,
  }),
)

// Browse scopes for StudentRecipientSelector.
// Tab order matches the real PG app: All · Class · Level · CCA · School · Group · Student
export const STUDENT_SCOPES: Array<EntityScope> = [
  // "All" shows every group type (no individuals — use the Student tab for those)
  { id: 'all', label: 'All', items: ALL_STUDENT_GROUP_ITEMS },
  { id: 'classes', label: 'Class', items: CLASS_GROUPS },
  { id: 'levels', label: 'Level', items: LEVEL_GROUPS },
  { id: 'ccas', label: 'CCA', items: CCA_GROUPS },
  { id: 'school', label: 'School', items: [SCHOOL_GROUP] },
  // "Group" combines teaching groups and custom groups (same as PG's generic Group bucket)
  {
    id: 'groups',
    label: 'Group',
    items: [...TEACHING_GROUPS, ...CUSTOM_GROUPS],
  },
  // "Student" shows individual students for one-off targeting
  { id: 'students', label: 'Student', items: STUDENT_INDIVIDUAL_ITEMS },
]

// Overlap map: parent ID → list of child IDs it contains
// Used by detectOverlaps to surface warnings when overlapping selections are made
const classByLevel = (prefix: string) =>
  CLASS_GROUPS.filter((g) => g.label.startsWith(prefix)).map((g) => g.id)

export const STUDENT_OVERLAP_MAP: Record<string, Array<string>> = {
  'level:sec1': classByLevel('Sec 1'),
  'level:sec2': classByLevel('Sec 2'),
  'level:sec3': classByLevel('Sec 3'),
  'level:sec4': classByLevel('Sec 4'),
  'school:bandung': [
    ...CLASS_GROUPS.map((g) => g.id),
    'level:sec1',
    'level:sec2',
    'level:sec3',
    'level:sec4',
  ],
}
