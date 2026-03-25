import type { PGAnnouncement } from '@/types/pg-announcement'

const now = new Date()
const daysAgo = (d: number) =>
  new Date(now.getTime() - d * 86400000).toISOString()
const hoursAgo = (h: number) =>
  new Date(now.getTime() - h * 3600000).toISOString()
const daysFromNow = (d: number) =>
  new Date(now.getTime() + d * 86400000).toISOString()

// Parent contact details per student (relationship + mobile)
const parentContactMap: Record<
  string,
  { parentRelationship: string; parentContact: string }
> = {
  '1': { parentRelationship: 'Father', parentContact: '9123 4567' },
  '2': { parentRelationship: 'Father', parentContact: '8234 5678' },
  '4': { parentRelationship: 'Father', parentContact: '8456 7890' },
}

// pgStatus key by studentId
const pgStatusMap: Record<string, 'onboarded' | 'not_onboarded'> = {
  '1': 'onboarded',
  '2': 'onboarded',
  '4': 'onboarded',
}

// Class index numbers per student
const classIndexMap: Record<string, string> = {
  '1': '01',
  '2': '02',
  '4': '04',
}

export const mockPGAnnouncements: Array<PGAnnouncement> = [
  // 1. View-only post
  {
    id: 'pg-1',
    title: 'Term 4 Letter to Parents',
    description:
      "<p>Please find attached the Term 4 Letter to Parents, which outlines key dates, school expectations, and upcoming events for the final term of the year.</p><p>We encourage all parents to read through the letter carefully. Please contact your child's Form Teacher should you have any questions.</p>",
    shortcuts: [],
    websiteLinks: [],
    attachments: [{ name: 'Term 4 Parent Letter 2026.pdf', size: '318 KB' }],
    status: 'posted',
    ownership: 'mine',
    role: 'editor',
    staffInCharge: 'Mrs Tan Mei Lin',
    enquiryEmail: 'tanml@bandungsec.edu.sg',
    createdAt: daysAgo(5),
    postedAt: daysAgo(4),
    recipients: [
      {
        studentId: '1',
        studentName: 'Chen Teo Jun Kai',
        indexNo: classIndexMap['1'],
        classLabel: 'Sec 3A',
        parentName: 'Chen Wei Liang',
        ...parentContactMap['1'],
        pgStatus: pgStatusMap['1'],
        readStatus: 'read',
        readAt: daysAgo(3),
      },
      {
        studentId: '2',
        studentName: 'Vincent Koh Xin Yi',
        indexNo: classIndexMap['2'],
        classLabel: 'Sec 3A',
        parentName: 'Koh Beng Huat',
        ...parentContactMap['2'],
        pgStatus: pgStatusMap['2'],
        readStatus: 'read',
        readAt: daysAgo(3),
      },
      {
        studentId: '4',
        studentName: 'Priya Nair',
        indexNo: classIndexMap['4'],
        classLabel: 'Sec 3A',
        parentName: 'Nair Ramesh',
        ...parentContactMap['4'],
        pgStatus: pgStatusMap['4'],
        readStatus: 'unread',
      },
    ],
  },

  // 2. Post with yes/no response
  {
    id: 'pg-11',
    title: 'Class Chalet 2026 – RSVP',
    description:
      '<p>Dear Parent/Guardian,</p><p>We are planning a <strong>Class Chalet</strong> at <strong>Downtown East</strong> on <strong>18–19 April 2026</strong> as part of our class bonding activities. The chalet will be supervised by teachers.</p><p>Please indicate whether your child <strong>will be attending</strong> the chalet.</p>',
    shortcuts: [],
    websiteLinks: [],
    status: 'posted',
    ownership: 'mine',
    role: 'editor',
    staffInCharge: 'Mrs Tan Mei Lin',
    enquiryEmail: 'tanml@bandungsec.edu.sg',
    responseType: 'yes-no',
    dueDate: daysFromNow(7),
    createdAt: daysAgo(2),
    postedAt: daysAgo(1),
    recipients: [
      {
        studentId: '1',
        studentName: 'Chen Teo Jun Kai',
        indexNo: classIndexMap['1'],
        classLabel: 'Sec 3A',
        parentName: 'Chen Wei Liang',
        ...parentContactMap['1'],
        pgStatus: pgStatusMap['1'],
        readStatus: 'read',
        readAt: hoursAgo(20),
        formResponse: 'yes',
        respondedAt: hoursAgo(20),
      },
      {
        studentId: '2',
        studentName: 'Vincent Koh Xin Yi',
        indexNo: classIndexMap['2'],
        classLabel: 'Sec 3A',
        parentName: 'Koh Beng Huat',
        ...parentContactMap['2'],
        pgStatus: pgStatusMap['2'],
        readStatus: 'read',
        readAt: hoursAgo(18),
        formResponse: 'no',
        respondedAt: hoursAgo(18),
      },
      {
        studentId: '4',
        studentName: 'Priya Nair',
        indexNo: classIndexMap['4'],
        classLabel: 'Sec 3A',
        parentName: 'Nair Ramesh',
        ...parentContactMap['4'],
        pgStatus: pgStatusMap['4'],
        readStatus: 'unread',
      },
    ],
  },

  // 3. Post with acknowledge response
  {
    id: 'pg-10',
    title: 'Science Centre Learning Journey – Consent',
    description:
      '<p>Dear Parent/Guardian,</p><p>We are organising a <strong>Learning Journey to the Science Centre Singapore</strong> on <strong>28 March 2026</strong> for Secondary 3 students.</p><p>Please acknowledge this announcement to confirm that you have read and understood the details.</p>',
    shortcuts: [],
    websiteLinks: [],
    status: 'posted',
    ownership: 'mine',
    role: 'editor',
    staffInCharge: 'Mrs Tan Mei Lin',
    enquiryEmail: 'tanml@bandungsec.edu.sg',
    responseType: 'acknowledge',
    dueDate: daysFromNow(5),
    createdAt: daysAgo(3),
    postedAt: daysAgo(2),
    recipients: [
      {
        studentId: '1',
        studentName: 'Chen Teo Jun Kai',
        indexNo: classIndexMap['1'],
        classLabel: 'Sec 3A',
        parentName: 'Chen Wei Liang',
        ...parentContactMap['1'],
        pgStatus: pgStatusMap['1'],
        readStatus: 'read',
        readAt: daysAgo(1),
        acknowledgedAt: daysAgo(1),
        respondedAt: daysAgo(1),
      },
      {
        studentId: '2',
        studentName: 'Vincent Koh Xin Yi',
        indexNo: classIndexMap['2'],
        classLabel: 'Sec 3A',
        parentName: 'Koh Beng Huat',
        ...parentContactMap['2'],
        pgStatus: pgStatusMap['2'],
        readStatus: 'read',
        readAt: daysAgo(1),
        acknowledgedAt: daysAgo(1),
        respondedAt: daysAgo(1),
      },
      {
        studentId: '4',
        studentName: 'Priya Nair',
        indexNo: classIndexMap['4'],
        classLabel: 'Sec 3A',
        parentName: 'Nair Ramesh',
        ...parentContactMap['4'],
        pgStatus: pgStatusMap['4'],
        readStatus: 'read',
        readAt: hoursAgo(20),
        // not yet acknowledged
      },
    ],
  },
]

export function getPGAnnouncementById(id: string): PGAnnouncement | undefined {
  return mockPGAnnouncements.find((a) => a.id === id)
}
