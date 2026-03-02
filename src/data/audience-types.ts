export interface AudienceType {
  id: string
  title: string
  description: string
  bgColor: string
  enabled: boolean
  defaultSelected?: boolean
}

export const audienceTypes: Array<AudienceType> = [
  {
    id: 'all',
    title: 'All',
    description:
      'Anyone can respond without signing in. Responses are anonymous',
    bgColor: '#eef1f8',
    enabled: true,
    defaultSelected: true,
  },
  {
    id: 'students',
    title: 'Students',
    description: 'All students in MOE can log in via MIMS to respond',
    bgColor: '#fce8e8',
    enabled: true,
  },
  {
    id: 'custodians',
    title: 'Custodians',
    description:
      'All parents or legal guardians of MOE students can log in with Singpass to respond',
    bgColor: '#f0f0f0',
    enabled: true,
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'All staff in MOE can log in via MIMS to respond',
    bgColor: '#fef9e7',
    enabled: true,
  },
]
