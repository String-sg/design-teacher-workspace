export type AgencyReportStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'sent'

export type FieldRole = 'yh' | 'principal' | 'counsellor'
export type FieldType = 'text' | 'narrative'

export interface ReportField {
  id: string
  label: string
  type: FieldType
  source?: string | null
  value?: string
  aiDraftable?: boolean
  stale?: boolean
  staleMsg?: string
  restricted?: boolean
  restrictedMsg?: string
}

export interface ReportSection {
  id: string
  title: string
  role: FieldRole
  fields: ReportField[]
}

export interface AgencyTemplate {
  id: string
  agency: string
  name: string
  abbrev: string
  totalFields: number
  autoFilled: number
  pages: number
  sections: ReportSection[]
}

export interface AgencyReport {
  id: string
  studentId: string
  templateId: string
  templateName: string
  agency: string
  status: AgencyReportStatus
  createdAt: Date
  passwordSaved: boolean
}

export interface DataSource {
  id: string
  name: string
  desc: string
  lastSync: string
  checked: boolean
}

export const AGENCY_TEMPLATES: AgencyTemplate[] = [
  {
    id: 'cps',
    agency: 'Child Protective Service',
    name: 'CPS School Report',
    abbrev: 'CPS',
    totalFields: 32,
    autoFilled: 22,
    pages: 4,
    sections: [
      {
        id: 'particulars',
        title: 'Student Particulars',
        role: 'yh',
        fields: [
          { id: 'name', label: 'Full Name of Student', type: 'text', source: 'EduHub', value: 'Chen Jun Kai' },
          { id: 'nric', label: 'NRIC / FIN', type: 'text', source: 'EduHub', value: 'S9101B' },
          { id: 'dob', label: 'Date of Birth', type: 'text', source: 'EduHub', value: '4 Jan 2010' },
          { id: 'age', label: 'Age', type: 'text', source: 'EduHub', value: '16' },
          { id: 'gender', label: 'Gender', type: 'text', source: 'EduHub', value: 'Male' },
          { id: 'school', label: 'Name of School', type: 'text', source: 'EduHub', value: 'Bandung Secondary School' },
          { id: 'class', label: 'Class', type: 'text', source: 'School Cockpit', value: '3A' },
          { id: 'citizenship', label: 'Citizenship', type: 'text', source: 'EduHub', value: 'Singapore citizen' },
        ],
      },
      {
        id: 'family',
        title: 'Family Background',
        role: 'yh',
        fields: [
          { id: 'fatherName', label: "Father's Name", type: 'text', source: 'School Cockpit', value: 'Mr Chen Wei Ming' },
          { id: 'motherName', label: "Mother's Name", type: 'text', source: 'School Cockpit', value: 'Mdm Tan Siew Lan' },
          { id: 'custody', label: 'Custody Arrangement', type: 'text', source: 'School Cockpit', value: 'Both Parents' },
          {
            id: 'housing', label: 'Housing Type', type: 'text', source: 'School Cockpit', value: 'HDB 3-room',
            stale: true, staleMsg: 'Last updated 14 months ago',
          },
          { id: 'fas', label: 'Financial Assistance', type: 'text', source: 'School Cockpit', value: 'MOE FAS' },
          { id: 'income', label: 'Monthly Household Income', type: 'text', source: 'School Cockpit', value: '$1,800' },
          {
            id: 'occupation', label: 'Parent Occupation', type: 'text', source: null, value: '',
            restricted: true, restrictedMsg: 'Access-restricted in SC',
          },
        ],
      },
      {
        id: 'attendance',
        title: 'Attendance & Conduct',
        role: 'yh',
        fields: [
          { id: 'attendPct', label: 'Attendance Rate (%)', type: 'text', source: 'School Cockpit', value: '83%' },
          { id: 'daysPresent', label: 'Days Present / Total', type: 'text', source: 'School Cockpit', value: '39 / 47' },
          { id: 'late', label: 'Late-coming Instances', type: 'text', source: 'School Cockpit', value: '12' },
          { id: 'offences', label: 'Number of Offences', type: 'text', source: 'School Cockpit', value: '3' },
          { id: 'conduct', label: 'Overall Conduct Grade', type: 'text', source: 'School Cockpit', value: 'Poor' },
        ],
      },
      {
        id: 'observations',
        title: 'Behavioural Observations',
        role: 'yh',
        fields: [
          { id: 'behaviour', label: "School's Observations on Student's Behaviour", type: 'narrative', aiDraftable: true },
          { id: 'triggers', label: 'Known Behavioural Triggers', type: 'narrative', aiDraftable: true },
        ],
      },
      {
        id: 'counsellor',
        title: "Counsellor's Input",
        role: 'counsellor',
        fields: [
          { id: 'interventions', label: 'Intervention Plans', type: 'narrative' },
          { id: 'sessions', label: 'Number of Sessions', type: 'text', source: 'Case Sync', value: '8' },
        ],
      },
      {
        id: 'principal',
        title: "Principal's Remarks",
        role: 'principal',
        fields: [
          { id: 'pRemarks', label: "Principal's Assessment", type: 'narrative' },
          { id: 'confidential', label: 'Confidential Information (P-level only)', type: 'narrative' },
        ],
      },
    ],
  },
  {
    id: 'nuh',
    agency: 'National University Hospital',
    name: 'NUH Referral Form',
    abbrev: 'NUH',
    totalFields: 24,
    autoFilled: 16,
    pages: 3,
    sections: [
      {
        id: 'nparticulars',
        title: 'Patient Particulars',
        role: 'yh',
        fields: [
          { id: 'nname', label: 'Patient Name', type: 'text', source: 'EduHub', value: 'Chen Jun Kai' },
          { id: 'nnric', label: 'NRIC', type: 'text', source: 'EduHub', value: 'S9101B' },
          { id: 'ndob', label: 'Date of Birth', type: 'text', source: 'EduHub', value: '4 Jan 2010' },
        ],
      },
      {
        id: 'nreferral',
        title: 'Reason for Referral',
        role: 'yh',
        fields: [
          { id: 'reason', label: 'Reason for Referral', type: 'narrative', aiDraftable: true },
          { id: 'history', label: 'Relevant History', type: 'narrative', aiDraftable: true },
        ],
      },
      {
        id: 'nprincipal',
        title: "School Leader's Endorsement",
        role: 'principal',
        fields: [
          { id: 'nendorse', label: "Principal's Endorsement", type: 'narrative' },
        ],
      },
    ],
  },
]

export const AI_DRAFTS: Record<string, string> = {
  behaviour:
    "Jun Kai has shown fluctuating behaviour patterns this term. He is generally quiet in class but has had episodes of disruptive behaviour, particularly during unstructured periods. He responds well to one-on-one conversations with trusted adults but can be withdrawn in group settings. Teachers have noted improvement in class participation since the start of Term 2, though attendance remains a concern.",
  triggers:
    "Jun Kai's behavioural episodes tend to correlate with disruptions in his home environment. Teachers have observed heightened agitation on Mondays and after school holidays. Peer conflicts, particularly around group work, can also trigger withdrawal or outbursts.",
  reason:
    "Jun Kai is being referred for a comprehensive psychological assessment to better understand his social-emotional needs. He has been flagged for low mood across two consecutive terms via the Termly Check-In, and school counselling records indicate recurring themes around family stress and peer relationship difficulties.",
  history:
    "Jun Kai has been receiving fortnightly school-based counselling since January 2025. He has 2 active counselling cases (family and peer-related). He is on MOE FAS. Attendance has been declining (83% this term), with 12 late-coming instances and 3 recorded offences including truancy.",
}

export const DATA_SOURCES: DataSource[] = [
  { id: 'sc', name: 'School Cockpit', desc: 'Attendance, academics, family details, offences', lastSync: '19 Apr 2026', checked: true },
  { id: 'eduhub', name: 'EduHub', desc: 'Student biodata, enrolment info', lastSync: '19 Apr 2026', checked: true },
  { id: 'casesync', name: 'Case Sync', desc: 'Counselling case notes, intervention plans', lastSync: '17 Apr 2026', checked: true },
  { id: 'tci', name: 'TCI', desc: 'Termly Check-In wellbeing data', lastSync: '15 Apr 2026', checked: true },
]

export const mockAgencyReports: AgencyReport[] = [
  {
    id: 'ar-001',
    studentId: '1',
    templateId: 'cps',
    templateName: 'CPS School Report',
    agency: 'Child Protective Service',
    status: 'sent',
    createdAt: new Date('2026-02-12'),
    passwordSaved: true,
  },
]

export function getAgencyReportsByStudent(studentId: string): AgencyReport[] {
  return mockAgencyReports.filter((r) => r.studentId === studentId)
}
