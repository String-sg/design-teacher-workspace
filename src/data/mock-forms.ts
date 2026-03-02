import type { Form } from '@/types/form'

export const mockForms: Array<Form> = [
  {
    id: 'form-1',
    title: 'Parent-Teacher Conference Preferences',
    description:
      'Collect preferred time slots for upcoming parent-teacher meetings',
    status: 'active',
    createdAt: '2026-02-20',
    recipientCount: 120,
    completedCount: 87,
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
  },
  {
    id: 'form-3',
    title: 'Co-Curricular Activity Selection',
    description: 'Students indicate their CCA preferences for Semester 2',
    status: 'active',
    createdAt: '2026-02-10',
    recipientCount: 200,
    completedCount: 145,
  },
  {
    id: 'form-4',
    title: 'Uniform Order Form',
    description: 'Annual uniform purchase for the new academic year',
    status: 'active',
    createdAt: '2026-02-05',
    recipientCount: 95,
    completedCount: 95,
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
  },
]

export function getFormById(id: string): Form | undefined {
  return mockForms.find((form) => form.id === id)
}
