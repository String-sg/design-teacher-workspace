import type { Form } from '~/apps/pg/types/form';

export const mockForms: Form[] = [
  {
    id: 'form-1',
    title: 'Parent-Teacher Conference Preferences',
    description: 'Collect preferred time slots for upcoming parent-teacher meetings',
    status: 'active',
    createdAt: '2026-02-20',
    recipientCount: 8,
    completedCount: 5,
    ownership: 'mine',
    targetClasses: ['Sec 3A', 'Sec 3B'],
    formType: 'standard',
    source: 'custom',
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
        options: ['9:00 AM – 10:00 AM', '11:00 AM – 12:00 PM', '2:00 PM – 3:00 PM'],
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
];

export function getFormById(id: string): Form | undefined {
  return mockForms.find((form) => form.id === id);
}
