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
    formType: 'quick',
    responseType: 'yes-no',
    dueDate: '2026-03-15',
    questions: [
      {
        id: 'q1',
        text: 'Are you able to attend the in-person session?',
        type: 'yes-no' as never,
        showAfter: 'both',
      },
      {
        id: 'q2',
        text: 'Please indicate your preferred time slot',
        type: 'mcq',
        options: ['9:00 AM – 10:00 AM', '11:00 AM – 12:00 PM', '2:00 PM – 3:00 PM'],
        showAfter: 'yes',
      },
      {
        id: 'q3',
        text: 'Any special requests or notes for the teacher?',
        type: 'open',
        showAfter: 'both',
      },
    ],
  },
  {
    id: 'form-allears-1',
    title: 'Science Centre Learning Journey — Consent & Medical',
    description:
      'Multi-section consent form covering trip permission, medical declarations, and dietary requirements for the Sec 3 Science Centre trip',
    status: 'active',
    createdAt: '2026-03-05',
    recipientCount: 38,
    completedCount: 22,
    ownership: 'mine',
    targetClasses: ['Sec 3A', 'Sec 3B'],
    formType: 'allears',
  },
  {
    id: 'form-allears-2',
    title: 'CCA Interest & Annual Medical Declaration',
    description:
      'Annual CCA interest survey with medical background and emergency contact declaration for all Sec 1 students',
    status: 'active',
    createdAt: '2026-02-28',
    recipientCount: 200,
    completedCount: 134,
    ownership: 'shared',
    targetClasses: ['Sec 1A', 'Sec 1B', 'Sec 1C'],
    formType: 'allears',
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
    title: 'Co-Curricular Activity Selection',
    description: 'Students indicate their CCA preferences for Semester 2',
    status: 'active',
    createdAt: '2026-02-10',
    recipientCount: 200,
    completedCount: 145,
    ownership: 'shared',
    targetClasses: ['Sec 1A', 'Sec 1B', 'Sec 1C', 'Sec 1D'],
  },
  {
    id: 'form-4',
    title: 'Uniform Order Form',
    description: 'Annual uniform purchase for the new academic year',
    status: 'active',
    createdAt: '2026-02-05',
    recipientCount: 95,
    completedCount: 95,
    ownership: 'mine',
    targetClasses: ['Sec 2A', 'Sec 2B'],
  },
  {
    id: 'form-5',
    title: 'End-of-Year Feedback Survey',
    description:
      'Gather parent feedback on school programmes and communication',
    status: 'closed',
    createdAt: '2025-11-15',
    recipientCount: 150,
    completedCount: 112,
    ownership: 'mine',
    targetClasses: ['Sec 4A', 'Sec 4B', 'Sec 4C'],
  },
  {
    id: 'form-6',
    title: 'Mother Tongue Language Option',
    description:
      'Select Mother Tongue language variant for incoming Primary 1 students',
    status: 'draft',
    createdAt: '2026-02-22',
    recipientCount: 0,
    completedCount: 0,
    ownership: 'mine',
    targetClasses: [],
  },
  {
    id: 'form-7',
    title: 'Health & Dietary Requirements',
    description:
      'Update student health information and dietary restrictions for camp',
    status: 'draft',
    createdAt: '2026-02-24',
    recipientCount: 0,
    completedCount: 0,
    ownership: 'shared',
    targetClasses: [],
  },
]

export function getFormById(id: string): Form | undefined {
  return mockForms.find((form) => form.id === id)
}
