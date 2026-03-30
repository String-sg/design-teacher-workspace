import type {
  EntityItem,
  EntityScope,
} from '@/components/comms/entity-selector'
import { mockStudents } from '@/data/mock-students'
import { MOCK_GROUPS } from '@/data/mock-groups'

// ─── NRIC helpers ─────────────────────────────────────────────────────────────

/** Build a lookup: student name → { nric, index, class } from real mock data */
const studentByName = new Map(
  mockStudents
    .filter((s) => s.schoolName === 'Bandung Secondary School')
    .map((s) => [
      s.name,
      { nric: s.nric, index: s.indexNumber, class: s.class },
    ]),
)

/** Simple deterministic hash used by both fake generators. */
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
  const suffix = letters[h % letters.length]
  return `${prefix}${digits}${suffix}`
}

const ALL_CLASS_LABELS = [
  '1A',
  '1B',
  '1C',
  '2C',
  '2D',
  '3A',
  '3B',
  '3C',
  '3D',
  '4A',
  '4B',
]

function fakeClass(name: string): string {
  return ALL_CLASS_LABELS[nameHash(name) % ALL_CLASS_LABELS.length]
}

function memberDetail(
  name: string,
  _fallbackIndex: number,
  fallbackClass?: string,
) {
  const real = studentByName.get(name)
  return {
    name,
    sublabel: real?.class ?? fallbackClass ?? fakeClass(name),
    badge: real?.nric ?? fakeNric(name),
  }
}

// ─── Derive class groups (Sec 3 & 4 from real student data) ──────────────────

function deriveClassGroups(): Array<EntityItem> {
  const classMap = new Map<
    string,
    Array<{ name: string; nric: string; index: number; class: string }>
  >()
  for (const s of mockStudents) {
    if (s.schoolName !== 'Bandung Secondary School') continue
    if (!/^\d+ /.test(s.class)) continue
    if (!classMap.has(s.class)) classMap.set(s.class, [])
    classMap.get(s.class)!.push({
      name: s.name,
      nric: s.nric,
      index: s.indexNumber,
      class: s.class,
    })
  }
  for (const members of classMap.values())
    members.sort((a, b) => a.index - b.index)

  return [...classMap.entries()]
    .sort(([a], [b]) => {
      const parse = (label: string) => {
        const m = label.match(/^(\d+)\s+(.+)/)
        return m
          ? { level: Number(m[1]), name: m[2] }
          : { level: 99, name: label }
      }
      const pa = parse(a),
        pb = parse(b)
      if (pa.level !== pb.level) return pa.level - pb.level
      return pa.name.localeCompare(pb.name)
    })
    .map(([cls, members]) => ({
      id: `class:${cls}`,
      label: cls,
      type: 'group' as const,
      count: members.length,
      memberNames: members.map((m) => m.name),
      memberDetails: members.map((m) => ({
        name: m.name,
        sublabel: m.class,
        badge: m.nric,
      })),
      groupType: 'class' as const,
    }))
}

const bandungStudents = mockStudents.filter(
  (s) => s.schoolName === 'Bandung Secondary School',
)

// ─── Helper: build class/CCA EntityItem with auto-generated memberDetails ─────

function toClassGroup(
  id: string,
  label: string,
  names: Array<string>,
): EntityItem {
  const details = names.map((name, i) => memberDetail(name, i + 1, label))
  return {
    id,
    label,
    type: 'group',
    count: names.length,
    groupType: 'class',
    memberNames: names,
    memberDetails: details,
  }
}

function toCcaGroup(
  id: string,
  label: string,
  names: Array<string>,
): EntityItem {
  const details = names.map((name, i) => memberDetail(name, i + 1))
  return {
    id,
    label,
    type: 'group',
    count: names.length,
    groupType: 'cca',
    memberNames: names,
    memberDetails: details,
  }
}

// ─── Sec 1 & 2 classes (hardcoded) ───────────────────────────────────────────

const SEC1_CLASSES: Array<EntityItem> = [
  toClassGroup('class:1 Diligence', '1 Diligence', [
    'Adeline Foo Jia En',
    'Bryan Ng Wei Liang',
    'Charlene Tay Xin Yi',
    'Darren Lim Jun Kai',
    'Elaine Chan Mei Ling',
    'Farid Bin Ismail',
    'Grace Koh Shu Fen',
    'Hidayah Binte Yusof',
    'Isaac Tan Wei Ming',
    'Jasmine Wong Jun Hui',
    'Keith Chua Zhi Hao',
    'Liyana Binte Ramli',
    'Marcus Teo Jian Hao',
  ]),
  toClassGroup('class:1 Integrity', '1 Integrity', [
    'Amirah Binte Hassan',
    'Benjamin Ong Kai Xiang',
    'Crystal Lim Hui Min',
    'David Ng Jun Jie',
    'Erin Tan Shu Wen',
    'Firdaus Bin Ahmad',
    'Gavin Chew Wei Jie',
    'Hannah Lee Mei Xuan',
    'Ian Koh Jian Wei',
    'Joanne Wong Xin Hui',
    'Kevin Lim Zhi Wei',
    'Lisha Binte Rahmat',
  ]),
  toClassGroup('class:1 Loyalty', '1 Loyalty', [
    'Aaron Tan Jun Hao',
    'Beatrice Chua Jia Ling',
    'Carmen Lim Wei Xuan',
    'Desmond Ng Xin Yi',
    'Esther Tay Hui Ling',
    'Farhan Bin Osman',
    'Gloria Seah Mei Lin',
    'Heng Kai Wei',
    'Irene Chan Jia Yi',
    'Joel Foo Wei Hao',
    'Kathleen Ong Xin Ling',
  ]),
]

const SEC2_CLASSES: Array<EntityItem> = [
  toClassGroup('class:2 Courage', '2 Courage', [
    'Alicia Tan Jia Yi',
    'Brandon Lim Kai Ming',
    'Celine Wong Shu Xian',
    'Derek Ng Zhi Hao',
    'Elisa Koh Mei Ling',
    'Faris Bin Latif',
    'Giselle Teo Xin Yi',
    'Haziq Bin Sulaiman',
    'Irvin Chua Jun Wei',
    'Jolene Seah Hui Min',
    'Kenneth Tan Wei Jie',
    'Lina Binte Aziz',
    'Matthew Foo Jian Hao',
  ]),
  toClassGroup('class:2 Excellence', '2 Excellence', [
    'Amelia Lim Jia En',
    'Brendan Ong Wei Ming',
    'Clara Chan Xin Hui',
    'Darius Ng Jun Kai',
    'Evangeline Tay Shu Wen',
    'Fadzillah Binte Malik',
    'Gerald Koh Zhi Wei',
    'Hui Ting Lee',
    'Ivan Tan Jian Wei',
    'Janice Wong Mei Xuan',
    'Leon Chua Wei Hao',
    'Mei Shan Binte Rashid',
  ]),
  toClassGroup('class:2 Harmony', '2 Harmony', [
    'Aiden Teo Jia Le',
    'Brenda Lim Kai Xiang',
    'Clement Wong Jun Hao',
    'Diana Ng Hui Ling',
    'Ethan Koh Jian Wei',
    'Fatimah Binte Yahya',
    'Gabrielle Tan Wei Xuan',
    'Harris Bin Zainal',
    'Isabelle Chua Mei Lin',
    'Jarvis Ong Xin Yi',
    'Kimberley Seah Zhi Hao',
  ]),
]

export const CLASS_GROUPS: Array<EntityItem> = [
  ...SEC1_CLASSES,
  ...SEC2_CLASSES,
  ...deriveClassGroups(),
]

// ─── Level groups ─────────────────────────────────────────────────────────────

const sec1Names = SEC1_CLASSES.flatMap((c) => c.memberNames ?? [])
const sec2Names = SEC2_CLASSES.flatMap((c) => c.memberNames ?? [])
const sec3Students = bandungStudents.filter((s) => s.class.startsWith('3 '))
const sec4Students = bandungStudents.filter((s) => s.class.startsWith('4 '))
const sec3Names = sec3Students.map((s) => s.name)
const sec4Names = sec4Students.map((s) => s.name)
const allStudentNames = [...sec1Names, ...sec2Names, ...sec3Names, ...sec4Names]

const sec1Details = SEC1_CLASSES.flatMap((c) => c.memberDetails ?? [])
const sec2Details = SEC2_CLASSES.flatMap((c) => c.memberDetails ?? [])
const sec3DetailsFull = sec3Students
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .map((s) => ({
    name: s.name,
    nric: s.nric,
    index: s.indexNumber,
    class: s.class,
  }))
const sec4Details = sec4Students
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .map((s) => ({
    name: s.name,
    nric: s.nric,
    index: s.indexNumber,
    class: s.class,
  }))

export const LEVEL_GROUPS: Array<EntityItem> = [
  {
    id: 'level:sec1',
    label: 'Secondary 1',
    type: 'group',
    count: sec1Names.length,
    groupType: 'level',
    memberNames: sec1Names,
    memberDetails: sec1Details,
  },
  {
    id: 'level:sec2',
    label: 'Secondary 2',
    type: 'group',
    count: sec2Names.length,
    groupType: 'level',
    memberNames: sec2Names,
    memberDetails: sec2Details,
  },
  {
    id: 'level:sec3',
    label: 'Secondary 3',
    type: 'group',
    count: sec3Names.length,
    groupType: 'level',
    memberNames: sec3Names,
    memberDetails: sec3DetailsFull,
  },
  {
    id: 'level:sec4',
    label: 'Secondary 4',
    type: 'group',
    count: sec4Names.length,
    groupType: 'level',
    memberNames: sec4Names,
    memberDetails: sec4Details,
  },
]

export const SCHOOL_GROUP: EntityItem = {
  id: 'school:bandung',
  label: 'Bandung Secondary School',
  type: 'group',
  count: allStudentNames.length,
  groupType: 'school',
  memberNames: allStudentNames,
  memberDetails: [
    ...sec1Details,
    ...sec2Details,
    ...sec3DetailsFull,
    ...sec4Details,
  ],
}

// ─── CCA groups ───────────────────────────────────────────────────────────────

export const CCA_GROUPS: Array<EntityItem> = [
  toCcaGroup('cca:basketball', 'Basketball', [
    'Chen Teo Jun Kai',
    'Yusuf Koh Xin Yi',
    'Bryan Tay Zhi Wei',
    'Ahmad Bin Hassan',
    'Kevin Ng Wei Ming',
    'Ryan Lim Zhi Hao',
    'Daniel Ong Jun Wei',
  ]),
  toCcaGroup('cca:choir', 'Choir', [
    'Sarah Chan Jun Kai',
    'Natalie Lim Jia Ying',
    'Sophie Wong Xin Hui',
    'Rachel Wong Mei Ling',
    'Priya Sharma',
    'Emily Tan Shu Wen',
    'Nurul Izzah Binte Kamal',
  ]),
  toCcaGroup('cca:drama', 'Drama', [
    'Vincent Koh Xin Yi',
    'Jason Chua Jun Kai',
    'Grace Tan Li Wen',
    'Muhammad Farhan',
    'Marcus Foo Jun Jie',
    'Joshua Lee Wei Xuan',
    'Cheryl Goh Hui Min',
  ]),
  toCcaGroup('cca:badminton', 'Badminton', [
    'Xiao Lam Wei Jie',
    'Harish Cheng Xin Yi',
    'Liang Lim Wei Jie',
    'Ethan Koh Ming Hao',
    'Darren Lim Kai Xiang',
    'Siti Aminah Binte Rahman',
    'Arjun Krishnan',
  ]),
  toCcaGroup('cca:robotics', 'Robotics Club', [
    'Sarah Tan Jun Kai',
    'Tan Lam Wei Jie',
    'Isabelle Chua Mei Xuan',
    'Aisha Binte Mohamed',
    'Michelle Teo Xin Yi',
    'Hafiz Bin Abdullah',
    'Lucas Ng Wei Jie',
  ]),
]

// ─── Teaching groups ──────────────────────────────────────────────────────────

const sec3Details = sec3Students
  .sort((a, b) => a.indexNumber - b.indexNumber)
  .map((s) => ({
    name: s.name,
    nric: s.nric,
    index: s.indexNumber,
    class: s.class,
  }))
const scienceDetails = sec3Details.filter((_, i) => i % 5 !== 4)

export const TEACHING_GROUPS: Array<EntityItem> = [
  {
    id: 'tg:sec3-math',
    label: 'Sec 3 Mathematics',
    type: 'group',
    count: sec3Details.length,
    groupType: 'teaching',
    memberNames: sec3Details.map((d) => d.name),
    memberDetails: sec3Details,
  },
  {
    id: 'tg:sec3-english',
    label: 'Sec 3 English',
    type: 'group',
    count: sec3Details.length,
    groupType: 'teaching',
    memberNames: sec3Details.map((d) => d.name),
    memberDetails: sec3Details,
  },
  {
    id: 'tg:sec3-science',
    label: 'Sec 3 Science',
    type: 'group',
    count: scienceDetails.length,
    groupType: 'teaching',
    memberNames: scienceDetails.map((d) => d.name),
    memberDetails: scienceDetails,
  },
  {
    id: 'tg:sec3-mother-tongue',
    label: 'Sec 3 Mother Tongue',
    type: 'group',
    count: sec3Details.length,
    groupType: 'teaching',
    memberNames: sec3Details.map((d) => d.name),
    memberDetails: sec3Details,
  },
]

// ─── Custom groups ────────────────────────────────────────────────────────────

const lsStudents = bandungStudents
  .filter((s) => s.learningSupport !== null)
  .sort((a, b) => a.indexNumber - b.indexNumber)
const dramaNames = [
  'Jordan Tan Jia Le',
  'Natasha Lee Wei Ling',
  'Jayden Wong Zhi Hao',
  'Priya Sundaram',
]

// Derived from MOCK_GROUPS so the student selector always reflects the Groups page
function groupToEntityItem(g: (typeof MOCK_GROUPS)[number]): EntityItem {
  return {
    id: `cg:${g.id}`,
    label: g.name,
    type: 'group',
    count: g.members.length,
    groupType: 'custom',
    memberNames: g.members.map((m) => m.name),
    memberDetails: g.members.map((m) => ({
      name: m.name,
      sublabel: m.class,
      badge: m.nric,
    })),
  }
}

/** @deprecated Use getStudentScopes() for live MOCK_GROUPS data */
export const CUSTOM_GROUPS: Array<EntityItem> =
  MOCK_GROUPS.map(groupToEntityItem)

// ─── Flat array ───────────────────────────────────────────────────────────────

export const ALL_STUDENT_GROUP_ITEMS: Array<EntityItem> = [
  ...CLASS_GROUPS,
  ...LEVEL_GROUPS,
  SCHOOL_GROUP,
  ...CCA_GROUPS,
  ...TEACHING_GROUPS,
  ...CUSTOM_GROUPS,
]

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

// ─── Teacher profile (simulated) ─────────────────────────────────────────────
const MY_CLASS_ID = 'class:2 Courage'
const MY_CCA_ID = 'cca:badminton'

const myClass = CLASS_GROUPS.find((g) => g.id === MY_CLASS_ID)!
const otherClasses = CLASS_GROUPS.filter((g) => g.id !== MY_CLASS_ID)
const myCCA = CCA_GROUPS.find((g) => g.id === MY_CCA_ID)!
const otherCCAs = CCA_GROUPS.filter((g) => g.id !== MY_CCA_ID)

// ─── Browse scopes ────────────────────────────────────────────────────────────
// 5 tabs: Class · Level/School · CCA · Teaching Group · Custom Group

/** Returns scopes with live MOCK_GROUPS data for the Custom Group tab. */
export function getStudentScopes(): Array<EntityScope> {
  return [
    {
      id: 'classes',
      label: 'Class',
      items: CLASS_GROUPS,
      sections: [
        { label: 'My class', items: [myClass] },
        { label: 'Other classes', items: otherClasses },
      ],
    },
    {
      id: 'levels',
      label: 'Level/School',
      items: [SCHOOL_GROUP, ...LEVEL_GROUPS],
    },
    {
      id: 'ccas',
      label: 'CCA',
      items: CCA_GROUPS,
      sections: [
        { label: 'My CCA', items: [myCCA] },
        { label: 'Other CCAs', items: otherCCAs },
      ],
    },
    { id: 'teaching-groups', label: 'Teaching Group', items: TEACHING_GROUPS },
    {
      id: 'my-groups',
      label: 'My Groups',
      items: MOCK_GROUPS.map(groupToEntityItem),
      createHref: '/groups/new',
      createLabel: 'Create custom group',
    },
  ]
}

/** @deprecated Use getStudentScopes() */
export const STUDENT_SCOPES: Array<EntityScope> = getStudentScopes()

// ─── Overlap map ──────────────────────────────────────────────────────────────

const classByLevel = (prefix: string) =>
  CLASS_GROUPS.filter((g) => g.label.startsWith(prefix)).map((g) => g.id)

export const STUDENT_OVERLAP_MAP: Record<string, Array<string>> = {
  'level:sec1': classByLevel('1 '),
  'level:sec2': classByLevel('2 '),
  'level:sec3': classByLevel('3 '),
  'level:sec4': classByLevel('4 '),
  'school:bandung': [
    ...CLASS_GROUPS.map((g) => g.id),
    'level:sec1',
    'level:sec2',
    'level:sec3',
    'level:sec4',
  ],
}
