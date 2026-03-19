import type { Form } from '@/types/form'

export const mockForms: Array<Form> = [
  {
    id: 'form-1',
    title: 'Parent-Teacher Conference Preferences',
    description:
      'Collect preferred time slots for upcoming parent-teacher meetings',
    status: 'active',
    createdAt: '2026-02-20',
    recipientCount: 8,
    completedCount: 5,
    ownership: 'mine',
    targetClasses: ['Sec 3A', 'Sec 3B'],
    formType: 'standard',
    responseType: 'yes-no',
    dueDate: '2026-03-15',
    questions: [
      {
        id: 'q1',
        text: 'Are you able to attend the in-person session?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'q2',
        text: 'Please indicate your preferred time slot',
        type: 'mcq',
        options: [
          '9:00 AM – 10:00 AM',
          '11:00 AM – 12:00 PM',
          '2:00 PM – 3:00 PM',
        ],
        required: true,
      },
      {
        id: 'q3',
        text: 'Any special requests or notes for the teacher?',
        type: 'free-text',
        required: true,
      },
    ],
  },
  {
    id: 'form-2',
    title: 'School Trip Consent Form',
    description:
      'Permission slip for the Secondary 3 learning journey to Science Centre',
    status: 'active',
    createdAt: '2026-02-18',
    recipientCount: 38,
    completedCount: 30,
    ownership: 'shared',
    targetClasses: ['Sec 3A'],
  },
  {
    id: 'form-3',
    title: 'Mother Tongue Language Option',
    description:
      'Select Mother Tongue language variant for incoming Secondary 1 students',
    status: 'draft',
    createdAt: '2026-02-22',
    recipientCount: 0,
    completedCount: 0,
    ownership: 'mine',
    targetClasses: [],
  },

  // Announcement-response forms (linked to PG announcements with yes-no questions)
  {
    id: 'form-ann-1',
    title: 'Class Chalet 2026 – RSVP',
    description:
      'Responses from announcement: Will your child attend the class chalet?',
    status: 'active',
    createdAt: '2026-03-17',
    recipientCount: 5,
    completedCount: 4,
    ownership: 'mine',
    targetClasses: ['Sec 3A', 'Sec 3B'],
    source: 'announcement-response',
    linkedAnnouncementId: 'pg-11',
    responseType: 'yes-no',
    dueDate: '2026-03-25',
  },
  {
    id: 'form-ann-2',
    title: 'Sec 3 Cohort Camp 2026 – Attendance',
    description:
      'Responses from announcement: Will your child attend the cohort camp?',
    status: 'active',
    createdAt: '2026-03-17',
    recipientCount: 8,
    completedCount: 6,
    ownership: 'mine',
    targetClasses: ['Sec 3A', 'Sec 3B'],
    source: 'announcement-response',
    linkedAnnouncementId: 'pg-12',
    responseType: 'yes-no',
    dueDate: '2026-03-27',
  },
  {
    id: 'form-ann-3',
    title: 'Swimming Carnival 2026 – Participation',
    description:
      'Responses from announcement: Will your child participate in swimming events?',
    status: 'active',
    createdAt: '2026-03-14',
    recipientCount: 7,
    completedCount: 5,
    ownership: 'mine',
    targetClasses: ['Sec 3A', 'Sec 3B'],
    source: 'announcement-response',
    linkedAnnouncementId: 'pg-13',
    responseType: 'yes-no',
    dueDate: '2026-03-28',
  },
]

export function getFormById(id: string): Form | undefined {
  return mockForms.find((form) => form.id === id)
}
