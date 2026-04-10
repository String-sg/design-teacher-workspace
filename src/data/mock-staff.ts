export interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  formClass?: string // e.g. "3A" — undefined for non-form teachers (HODs, etc.)
}

export interface StaffGroup {
  id: string
  label: string
  memberIds: Array<string>
  groupType?: 'level' | 'department' | 'staff-group'
}

export const MOCK_STAFF: Array<StaffMember> = [
  {
    id: 'tan-ml',
    name: 'Mrs Tan Mei Lin',
    email: 'tanml@school.edu.sg',
    role: 'Form Teacher',
    formClass: '3A',
  },
  {
    id: 'wong-km',
    name: 'Mr Wong Kai Ming',
    email: 'wongkm@school.edu.sg',
    role: 'Co-Form Teacher',
    formClass: '3A',
  },
  {
    id: 'priya-n',
    name: 'Ms Priya Nair',
    email: 'priyan@school.edu.sg',
    role: 'Form Teacher',
    formClass: '3B',
  },
  {
    id: 'chan-hl',
    name: 'Ms Chan Hui Ling',
    email: 'chanhl@school.edu.sg',
    role: 'Co-Form Teacher',
    formClass: '3B',
  },
  {
    id: 'ng-xh',
    name: 'Ms Ng Xiu Han',
    email: 'ngxh@school.edu.sg',
    role: 'Form Teacher',
    formClass: '3C',
  },
  {
    id: 'lim-bh',
    name: 'Mr Lim Beng Huat',
    email: 'limbh@school.edu.sg',
    role: 'HOD English',
  },
  {
    id: 'rajan-s',
    name: 'Mr Rajan Subramaniam',
    email: 'rajans@school.edu.sg',
    role: 'HOD Mathematics',
  },
]

export const MOCK_STAFF_GROUPS: Array<StaffGroup> = [
  // Level groups — form and co-form teachers grouped by secondary level
  {
    id: 'level:sec3-team',
    label: 'Sec 3 Level Team',
    memberIds: ['tan-ml', 'wong-km', 'priya-n', 'chan-hl', 'ng-xh'],
    groupType: 'level',
  },

  // Department / school-wide groups
  {
    id: 'dept:english',
    label: 'English Department',
    memberIds: ['lim-bh', 'chan-hl'],
    groupType: 'department',
  },
  {
    id: 'dept:math',
    label: 'Mathematics Department',
    memberIds: ['rajan-s'],
    groupType: 'department',
  },
  {
    id: 'school:all-staff',
    label: 'All Teaching Staff',
    memberIds: [
      'tan-ml',
      'wong-km',
      'priya-n',
      'chan-hl',
      'ng-xh',
      'lim-bh',
      'rajan-s',
    ],
    groupType: 'staff-group',
  },
]

// Saved favourite enquiry emails shown in the quick-select picker
export const SAVED_ENQUIRY_EMAILS: Array<string> = [
  'tanml@school.edu.sg',
  'hod@school.edu.sg',
  'admin@school.edu.sg',
]
