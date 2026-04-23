import { useState } from 'react'

// ─── Constants & Mock Data ────────────────────────────────────
const STUDENT = {
  name: 'Chen Jun Kai',
  class: '3A',
  nric: 'S9101B',
  school: 'Bandung Secondary School',
  fas: 'MOE FAS',
  housing: 'HDB 3-room',
  housingOwnership: 'Rented',
  custody: 'Both Parents',
  citizenship: 'Singapore citizen',
  languages: 'English, Mandarin',
  age: '16 years old (4 Jan 2010)',
  formTeacher: 'Mrs. Tan Mei Lin',
  coFormTeacher: 'Mr. Wong Kai Ming',
  attendance: 83,
  daysPresent: 39,
  totalDays: 47,
  latecoming: 12,
  offences: 3,
  counsellingCases: 2,
  conduct: 'Poor',
  siblings: 2,
  fatherName: 'Mr Chen Wei Ming',
  motherName: 'Mdm Tan Siew Lan',
  monthlyIncome: '$1,800',
}

const TEMPLATES = [
  {
    id: 'cps',
    agency: 'Child Protective Service',
    name: 'CPS School Report',
    abbrev: 'CPS',
    color: '#dc2626',
    totalFields: 32,
    autoFilled: 22,
    pages: 4,
    sections: [
      {
        id: 'particulars',
        title: 'Student Particulars',
        role: 'yh',
        fields: [
          {
            id: 'name',
            label: 'Full Name of Student',
            type: 'text',
            source: 'EduHub',
            value: STUDENT.name,
          },
          {
            id: 'nric',
            label: 'NRIC / FIN',
            type: 'text',
            source: 'EduHub',
            value: STUDENT.nric,
          },
          {
            id: 'dob',
            label: 'Date of Birth',
            type: 'text',
            source: 'EduHub',
            value: '4 Jan 2010',
          },
          {
            id: 'age',
            label: 'Age',
            type: 'text',
            source: 'EduHub',
            value: '16',
          },
          {
            id: 'gender',
            label: 'Gender',
            type: 'text',
            source: 'EduHub',
            value: 'Male',
          },
          {
            id: 'school',
            label: 'Name of School',
            type: 'text',
            source: 'EduHub',
            value: STUDENT.school,
          },
          {
            id: 'class',
            label: 'Class',
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.class,
          },
          {
            id: 'citizenship',
            label: 'Citizenship',
            type: 'text',
            source: 'EduHub',
            value: STUDENT.citizenship,
          },
        ],
      },
      {
        id: 'family',
        title: 'Family Background',
        role: 'yh',
        fields: [
          {
            id: 'fatherName',
            label: "Father's Name",
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.fatherName,
          },
          {
            id: 'motherName',
            label: "Mother's Name",
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.motherName,
          },
          {
            id: 'custody',
            label: 'Custody Arrangement',
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.custody,
          },
          {
            id: 'housing',
            label: 'Housing Type',
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.housing,
            stale: true,
            staleMsg: 'Last updated 14 months ago',
          },
          {
            id: 'fas',
            label: 'Financial Assistance',
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.fas,
          },
          {
            id: 'income',
            label: 'Monthly Household Income',
            type: 'text',
            source: 'School Cockpit',
            value: STUDENT.monthlyIncome,
          },
          {
            id: 'occupation',
            label: 'Parent Occupation',
            type: 'text',
            source: null,
            value: '',
            restricted: true,
            restrictedMsg: 'Access-restricted in SC',
          },
        ],
      },
      {
        id: 'attendance',
        title: 'Attendance & Conduct',
        role: 'yh',
        fields: [
          {
            id: 'attendPct',
            label: 'Attendance Rate (%)',
            type: 'text',
            source: 'School Cockpit',
            value: '83%',
          },
          {
            id: 'daysPresent',
            label: 'Days Present / Total',
            type: 'text',
            source: 'School Cockpit',
            value: '39 / 47',
          },
          {
            id: 'late',
            label: 'Late-coming Instances',
            type: 'text',
            source: 'School Cockpit',
            value: '12',
          },
          {
            id: 'offences',
            label: 'Number of Offences',
            type: 'text',
            source: 'School Cockpit',
            value: '3',
          },
          {
            id: 'conduct',
            label: 'Overall Conduct Grade',
            type: 'text',
            source: 'School Cockpit',
            value: 'Poor',
          },
        ],
      },
      {
        id: 'observations',
        title: 'Behavioural Observations',
        role: 'yh',
        fields: [
          {
            id: 'behaviour',
            label: "School's Observations on Student's Behaviour",
            type: 'narrative',
            aiDraftable: true,
          },
          {
            id: 'triggers',
            label: 'Known Behavioural Triggers',
            type: 'narrative',
            aiDraftable: true,
          },
        ],
      },
      {
        id: 'counsellor',
        title: "Counsellor's Input",
        role: 'counsellor',
        fields: [
          {
            id: 'interventions',
            label: 'Intervention Plans',
            type: 'narrative',
          },
          {
            id: 'sessions',
            label: 'Number of Sessions',
            type: 'text',
            source: 'Case Sync',
            value: '8',
          },
        ],
      },
      {
        id: 'principal',
        title: "Principal's Remarks",
        role: 'principal',
        fields: [
          {
            id: 'pRemarks',
            label: "Principal's Assessment",
            type: 'narrative',
          },
          {
            id: 'confidential',
            label: 'Confidential Information (P-level only)',
            type: 'narrative',
          },
        ],
      },
    ],
  },
  {
    id: 'nuh',
    agency: 'National University Hospital',
    name: 'NUH Referral Form',
    abbrev: 'NUH',
    color: '#2563eb',
    totalFields: 24,
    autoFilled: 16,
    pages: 3,
    sections: [
      {
        id: 'nparticulars',
        title: 'Patient Particulars',
        role: 'yh',
        fields: [
          {
            id: 'nname',
            label: 'Patient Name',
            type: 'text',
            source: 'EduHub',
            value: STUDENT.name,
          },
          {
            id: 'nnric',
            label: 'NRIC',
            type: 'text',
            source: 'EduHub',
            value: STUDENT.nric,
          },
          {
            id: 'ndob',
            label: 'Date of Birth',
            type: 'text',
            source: 'EduHub',
            value: '4 Jan 2010',
          },
        ],
      },
      {
        id: 'nreferral',
        title: 'Reason for Referral',
        role: 'yh',
        fields: [
          {
            id: 'reason',
            label: 'Reason for Referral',
            type: 'narrative',
            aiDraftable: true,
          },
          {
            id: 'history',
            label: 'Relevant History',
            type: 'narrative',
            aiDraftable: true,
          },
        ],
      },
      {
        id: 'nprincipal',
        title: "School Leader's Endorsement",
        role: 'principal',
        fields: [
          {
            id: 'nendorse',
            label: "Principal's Endorsement",
            type: 'narrative',
          },
        ],
      },
    ],
  },
]

const AI_DRAFTS = {
  behaviour:
    'Jun Kai has shown fluctuating behaviour patterns this term. He is generally quiet in class but has had episodes of disruptive behaviour, particularly during unstructured periods. He responds well to one-on-one conversations with trusted adults but can be withdrawn in group settings. Teachers have noted improvement in class participation since the start of Term 2, though attendance remains a concern.',
  triggers:
    "Jun Kai's behavioural episodes tend to correlate with disruptions in his home environment. Teachers have observed heightened agitation on Mondays and after school holidays. Peer conflicts, particularly around group work, can also trigger withdrawal or outbursts.",
  reason:
    'Jun Kai is being referred for a comprehensive psychological assessment to better understand his social-emotional needs. He has been flagged for low mood across two consecutive terms via the Termly Check-In, and school counselling records indicate recurring themes around family stress and peer relationship difficulties.',
  history:
    'Jun Kai has been receiving fortnightly school-based counselling since January 2025. He has 2 active counselling cases (family and peer-related). He is on MOE FAS. Attendance has been declining (83% this term), with 12 late-coming instances and 3 recorded offences including truancy.',
}

const SOURCES = [
  {
    id: 'sc',
    name: 'School Cockpit',
    desc: 'Attendance, academics, family details, offences',
    lastSync: '19 Apr 2026',
    checked: true,
  },
  {
    id: 'eduhub',
    name: 'EduHub',
    desc: 'Student biodata, enrolment info',
    lastSync: '19 Apr 2026',
    checked: true,
  },
  {
    id: 'casesync',
    name: 'Case Sync',
    desc: 'Counselling case notes, intervention plans',
    lastSync: '17 Apr 2026',
    checked: true,
  },
  {
    id: 'tci',
    name: 'TCI',
    desc: 'Termly Check-In wellbeing data',
    lastSync: '15 Apr 2026',
    checked: true,
  },
]

const c = {
  bg: '#f8f9fa',
  white: '#fff',
  border: '#e5e7eb',
  borderL: '#f0f0f0',
  text: '#111827',
  muted: '#6b7280',
  light: '#9ca3af',
  pri: '#f26c47',
  priBg: '#fef2f0',
  blue: '#2563eb',
  blueBg: '#eff6ff',
  green: '#16a34a',
  greenBg: '#f0fdf4',
  yellow: '#d97706',
  yellowBg: '#fffbeb',
  red: '#dc2626',
  redBg: '#fef2f2',
  purple: '#7c3aed',
  purpleBg: '#f5f3ff',
}

const Ico = {
  Back: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  ),
  Check: ({ s = 14 } = {}) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Right: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Down: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  File: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  ),
  Spark: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Warn: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  Upload: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  ),
  Dl: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Ext: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  ),
  Msg: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Panel: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18" />
    </svg>
  ),
  X: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
}

function Btn({ children, v = 'pri', sz = 'md', onClick, disabled, s: extra }) {
  const base = {
    border: 'none',
    borderRadius: 8,
    cursor: disabled ? 'default' : 'pointer',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all .15s',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'inherit',
    lineHeight: 1.4,
  }
  const szs = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '8px 16px', fontSize: 14 },
    lg: { padding: '10px 20px', fontSize: 14 },
  }
  const vs = {
    pri: { background: c.pri, color: '#fff' },
    out: {
      background: 'transparent',
      color: c.text,
      border: `1px solid ${c.border}`,
    },
    ghost: { background: 'transparent', color: c.muted },
    ok: { background: c.green, color: '#fff' },
    bad: { background: c.redBg, color: c.red },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...szs[sz], ...vs[v], ...extra }}
    >
      {children}
    </button>
  )
}

function Bdg({ children, col, bg }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        color: col || c.muted,
        background: bg || c.bg,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

function Card({ children, style: s, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: c.white,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: 20,
        ...s,
      }}
    >
      {children}
    </div>
  )
}

function Steps({ steps, cur }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '14px 0',
        justifyContent: 'center',
      }}
    >
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                background: i < cur ? c.green : i === cur ? c.pri : c.bg,
                color: i <= cur ? '#fff' : c.muted,
                border: i > cur ? `2px solid ${c.border}` : 'none',
              }}
            >
              {i < cur ? <Ico.Check s={12} /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: i === cur ? 600 : 400,
                color: i <= cur ? c.text : c.muted,
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 28,
                height: 2,
                background: i < cur ? c.green : c.border,
                margin: '0 6px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Avatar({ s = 40 }) {
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: '50%',
        background: c.priBg,
        color: c.pri,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: s * 0.35,
        flexShrink: 0,
      }}
    >
      CJ
    </div>
  )
}

// ─── Screens ─────────────────────────────────────────────────

function S1Profile({ go }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
          color: c.muted,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        <Ico.Back /> Dashboard
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Avatar s={56} />
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            {STUDENT.name}{' '}
            <span style={{ color: c.muted, fontSize: 16, fontWeight: 400 }}>
              {STUDENT.class}
            </span>
          </h1>
          <span style={{ fontSize: 13, color: c.muted }}>{STUDENT.school}</span>
        </div>
      </div>
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: c.redBg,
              color: c.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ico.File />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Reports</h3>
        </div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: c.muted,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Holistic Development Reports
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['Term 1', 'Term 2'].map((t, i) => (
            <div
              key={t}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                background: c.bg,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t} — 2025</div>
              <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>
                Generated 15 {i === 0 ? 'Mar' : 'Jun'} 2025
              </div>
              <Bdg
                col={i === 0 ? c.green : c.yellow}
                bg={i === 0 ? c.greenBg : c.yellowBg}
              >
                {i === 0 ? 'Approved' : 'In Review'}
              </Bdg>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 16 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: c.muted,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Agency Reports
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              marginBottom: 8,
              background: c.bg,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: c.red,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                CPS School Report
              </div>
              <div style={{ fontSize: 11, color: c.muted }}>12 Feb 2026</div>
            </div>
            <Bdg col={c.green} bg={c.greenBg}>
              Sent
            </Bdg>
            <span
              style={{
                fontSize: 11,
                color: c.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Ico.Lock /> Password saved
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <Btn v="out" sz="sm" onClick={() => go('templates')}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Agency
              Report
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  )
}

function S2Templates({ go, sel, setSel }) {
  const toggle = (id) =>
    setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          padding: '12px 16px',
          background: c.bg,
          borderRadius: 10,
        }}
      >
        <Avatar s={36} />
        <div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{STUDENT.name}</span>
          <span style={{ color: c.muted, fontSize: 13, marginLeft: 8 }}>
            {STUDENT.class}
          </span>
        </div>
        <Bdg col={c.pri} bg={c.priBg}>
          1 report in progress
        </Bdg>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
        Select Agency Template(s)
      </h2>
      <p style={{ fontSize: 14, color: c.muted, marginBottom: 20 }}>
        Choose one or more templates. Reports are completed sequentially —
        shared data carries across.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TEMPLATES.map((t) => {
          const on = sel.includes(t.id)
          return (
            <div
              key={t.id}
              onClick={() => toggle(t.id)}
              style={{
                padding: 20,
                border: `2px solid ${on ? c.pri : c.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                background: on ? c.priBg : c.white,
                transition: 'all .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${on ? c.pri : c.border}`,
                    background: on ? c.pri : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on && <Ico.Check s={12} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: t.color,
                      }}
                    />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>
                      {t.name}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: c.muted, marginTop: 2 }}>
                    {t.agency}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {t.totalFields} fields
                  </div>
                  <div style={{ fontSize: 12, color: c.green }}>
                    ~{t.autoFilled} auto-filled
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  height: 6,
                  background: c.borderL,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(t.autoFilled / t.totalFields) * 100}%`,
                    background: c.green,
                    borderRadius: 3,
                  }}
                />
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: c.muted }}>
                {t.pages} pages ·{' '}
                <span style={{ color: c.blue, cursor: 'pointer' }}>
                  Preview blank template
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24,
        }}
      >
        <Btn v="out" onClick={() => go('profile')}>
          Cancel
        </Btn>
        <Btn v="pri" onClick={() => go('sources')} disabled={sel.length === 0}>
          Continue with {sel.length} template{sel.length !== 1 ? 's' : ''}{' '}
          <Ico.Right />
        </Btn>
      </div>
    </div>
  )
}

function S3Sources({ go, src, setSrc }) {
  const tog = (id) =>
    setSrc((p) =>
      p.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    )
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
        Data Sources
      </h2>
      <p style={{ fontSize: 14, color: c.muted, marginBottom: 20 }}>
        Select which data sources to pull from. Uncheck any you'd like to skip.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {src.map((s) => (
          <div
            key={s.id}
            onClick={() => tog(s.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              border: `1px solid ${s.checked ? c.green : c.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              background: s.checked ? c.greenBg : c.white,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: `2px solid ${s.checked ? c.green : c.border}`,
                background: s.checked ? c.green : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {s.checked && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: c.muted }}>{s.desc}</div>
            </div>
            <div style={{ fontSize: 11, color: c.muted, textAlign: 'right' }}>
              Last synced
              <br />
              {s.lastSync}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          padding: 16,
          border: `2px dashed ${c.border}`,
          borderRadius: 10,
          textAlign: 'center',
          color: c.muted,
        }}
      >
        <Ico.Upload />
        <p style={{ fontSize: 13, margin: '8px 0 4px' }}>
          Upload additional documents
        </p>
        <p style={{ fontSize: 11 }}>
          External assessments, parent correspondence, previous reports
        </p>
      </div>
      <div
        style={{
          marginTop: 12,
          padding: '10px 14px',
          background: c.yellowBg,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <span style={{ color: c.yellow, marginTop: 2 }}>
          <Ico.Warn />
        </span>
        <span style={{ fontSize: 12, color: c.yellow }}>
          Housing data (School Cockpit) was last updated 14 months ago — please
          verify during review.
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24,
        }}
      >
        <Btn v="out" onClick={() => go('templates')}>
          <Ico.Back /> Back
        </Btn>
        <Btn v="pri" onClick={() => go('form')}>
          Pull data & begin <Ico.Right />
        </Btn>
      </div>
    </div>
  )
}

function S4Form({ tpl, go }) {
  const [data, setData] = useState({})
  const [aiFlags, setAiFlags] = useState({})
  const [sec, setSec] = useState(tpl.sections[0].id)
  const [preview, setPreview] = useState(true)
  const [done, setDone] = useState(new Set())
  const role = 'yh'
  const upd = (id, v) => setData((p) => ({ ...p, [id]: v }))
  const draft = (id) => {
    upd(
      id,
      AI_DRAFTS[id] ||
        'Based on available case notes and TCI data, the student has shown consistent patterns of...',
    )
    setAiFlags((p) => ({ ...p, [id]: true }))
  }
  const markDone = (sid) => {
    setDone((p) => new Set([...p, sid]))
    const idx = tpl.sections.findIndex((s) => s.id === sid)
    if (idx < tpl.sections.length - 1) setSec(tpl.sections[idx + 1].id)
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        height: 'calc(100vh - 100px)',
        margin: '-20px -24px',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            borderBottom: `1px solid ${c.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: c.white,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => go('sources')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              color: c.muted,
            }}
          >
            <Ico.Back />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: tpl.color,
                }}
              />
              <span style={{ fontWeight: 600, fontSize: 15 }}>{tpl.name}</span>
            </div>
            <span style={{ fontSize: 12, color: c.muted }}>
              {STUDENT.name} · {STUDENT.class}
            </span>
          </div>
          <Btn v="out" sz="sm" onClick={() => setPreview(!preview)}>
            <Ico.Panel /> {preview ? 'Hide' : 'Show'} Preview
          </Btn>
          <Btn v="pri" sz="sm" onClick={() => go('review')}>
            Submit for P Review
          </Btn>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              width: 200,
              borderRight: `1px solid ${c.border}`,
              padding: '12px 0',
              overflowY: 'auto',
              flexShrink: 0,
              background: c.bg,
            }}
          >
            {tpl.sections.map((s) => {
              const act = s.id === sec
              const locked = s.role !== role
              return (
                <div
                  key={s.id}
                  onClick={() => !locked && setSec(s.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    cursor: locked ? 'default' : 'pointer',
                    background: act ? c.white : 'transparent',
                    borderRight: act
                      ? `2px solid ${c.pri}`
                      : '2px solid transparent',
                    color: locked ? c.light : act ? c.text : c.muted,
                    fontWeight: act ? 500 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: locked ? 0.6 : 1,
                  }}
                >
                  {done.has(s.id) && (
                    <span style={{ color: c.green }}>
                      <Ico.Check s={12} />
                    </span>
                  )}
                  {locked && <Ico.Lock />}
                  <span style={{ flex: 1 }}>{s.title}</span>
                  {s.role === 'principal' && (
                    <Bdg col={c.purple} bg={c.purpleBg}>
                      P
                    </Bdg>
                  )}
                  {s.role === 'counsellor' && (
                    <Bdg col={c.blue} bg={c.blueBg}>
                      SC
                    </Bdg>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {tpl.sections
              .filter((s) => s.id === sec)
              .map((section) => {
                const locked = section.role !== role
                return (
                  <div key={section.id}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 20,
                      }}
                    >
                      <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                        {section.title}
                      </h3>
                      {locked && (
                        <Bdg
                          col={section.role === 'principal' ? c.purple : c.blue}
                          bg={
                            section.role === 'principal' ? c.purpleBg : c.blueBg
                          }
                        >
                          <Ico.Lock /> To be completed by{' '}
                          {section.role === 'principal'
                            ? 'Principal'
                            : 'School Counsellor'}
                        </Bdg>
                      )}
                    </div>
                    {locked ? (
                      <div
                        style={{
                          padding: 32,
                          textAlign: 'center',
                          background: c.bg,
                          borderRadius: 10,
                          border: `2px dashed ${c.border}`,
                        }}
                      >
                        <Ico.Lock />
                        <p
                          style={{ fontSize: 14, color: c.muted, marginTop: 8 }}
                        >
                          This section will be available for the{' '}
                          {section.role === 'principal'
                            ? 'Principal'
                            : 'School Counsellor'}{' '}
                          during review.
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 16,
                        }}
                      >
                        {section.fields.map((f) => (
                          <div key={f.id}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                marginBottom: 6,
                                flexWrap: 'wrap',
                              }}
                            >
                              <label style={{ fontSize: 13, fontWeight: 500 }}>
                                {f.label}
                              </label>
                              {f.source && (
                                <Bdg col={c.blue} bg={c.blueBg}>
                                  From {f.source}
                                </Bdg>
                              )}
                              {f.stale && (
                                <Bdg col={c.yellow} bg={c.yellowBg}>
                                  <Ico.Warn /> {f.staleMsg}
                                </Bdg>
                              )}
                              {f.restricted && (
                                <Bdg col={c.red} bg={c.redBg}>
                                  <Ico.Lock /> {f.restrictedMsg}
                                </Bdg>
                              )}
                              {aiFlags[f.id] && (
                                <Bdg col={c.purple} bg={c.purpleBg}>
                                  <Ico.Spark /> AI-assisted
                                </Bdg>
                              )}
                            </div>
                            {f.type === 'narrative' ? (
                              <div>
                                <textarea
                                  value={data[f.id] ?? ''}
                                  onChange={(e) => upd(f.id, e.target.value)}
                                  placeholder={
                                    f.aiDraftable
                                      ? "Click 'AI Draft' to generate, or write manually..."
                                      : 'Enter details...'
                                  }
                                  style={{
                                    width: '100%',
                                    minHeight: 120,
                                    padding: '10px 14px',
                                    border: `1px solid ${c.border}`,
                                    borderRadius: 8,
                                    fontSize: 14,
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    lineHeight: 1.6,
                                    boxSizing: 'border-box',
                                  }}
                                />
                                {f.aiDraftable && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: 8,
                                      marginTop: 8,
                                    }}
                                  >
                                    <Btn
                                      v="out"
                                      sz="sm"
                                      onClick={() => draft(f.id)}
                                    >
                                      <Ico.Spark />{' '}
                                      {aiFlags[f.id] ? 'Redraft' : 'AI Draft'}
                                    </Btn>
                                    {aiFlags[f.id] && (
                                      <Btn v="ghost" sz="sm">
                                        <Ico.Down /> View sources used
                                      </Btn>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={data[f.id] ?? f.value ?? ''}
                                onChange={(e) => upd(f.id, e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 14px',
                                  border: `1px solid ${f.stale ? c.yellow : c.border}`,
                                  borderRadius: 8,
                                  fontSize: 14,
                                  fontFamily: 'inherit',
                                  boxSizing: 'border-box',
                                  background: f.stale ? c.yellowBg : c.white,
                                }}
                              />
                            )}
                          </div>
                        ))}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            paddingTop: 8,
                          }}
                        >
                          <Btn
                            v="out"
                            sz="sm"
                            onClick={() => markDone(section.id)}
                          >
                            Mark complete <Ico.Check s={12} />
                          </Btn>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </div>
      {preview && (
        <div
          style={{
            width: 260,
            borderLeft: `1px solid ${c.border}`,
            background: '#f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${c.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>PDF Preview</span>
            <button
              onClick={() => setPreview(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
              }}
            >
              <Ico.X />
            </button>
          </div>
          <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
            {Array.from({ length: tpl.pages }).map((_, p) => (
              <div
                key={p}
                style={{
                  background: c.white,
                  border: `1px solid ${c.border}`,
                  borderRadius: 4,
                  padding: 10,
                  marginBottom: 10,
                  aspectRatio: '0.707',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                }}
              >
                <div
                  style={{
                    fontSize: 6,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: c.muted,
                    marginBottom: 3,
                  }}
                >
                  {tpl.agency}
                </div>
                <div style={{ fontSize: 5, color: c.muted, marginBottom: 6 }}>
                  Page {p + 1}
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', gap: 3, marginBottom: 2 }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: 3,
                        background: c.borderL,
                        borderRadius: 2,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 3,
                        background: p < 2 ? '#c7d2fe' : c.borderL,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
            <p style={{ fontSize: 10, color: c.muted, textAlign: 'center' }}>
              Updates as you fill the form
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function S8Review({ tpl, go }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => go('form')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Ico.Back />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            Principal Review
          </h2>
          <span style={{ fontSize: 13, color: c.muted }}>
            {tpl.name} · {STUDENT.name}
          </span>
        </div>
        <Bdg col={c.yellow} bg={c.yellowBg}>
          Pending Review
        </Bdg>
      </div>
      <div
        style={{
          padding: '12px 16px',
          background: c.blueBg,
          borderRadius: 10,
          marginBottom: 20,
          fontSize: 13,
        }}
      >
        <strong>Note from YH (Mrs. Tan Mei Lin):</strong> Counselling details
        needed in Section 5. Housing info may be outdated.
      </div>
      {tpl.sections.map((s) => (
        <Card key={s.id} style={{ marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <h4 style={{ fontSize: 15, fontWeight: 600, margin: 0, flex: 1 }}>
              {s.title}
            </h4>
            {s.role === 'yh' && (
              <Bdg col={c.green} bg={c.greenBg}>
                <Ico.Check s={10} /> Completed by YH
              </Bdg>
            )}
            {s.role === 'principal' && (
              <Bdg col={c.pri} bg={c.priBg}>
                Your input needed
              </Bdg>
            )}
            {s.role === 'counsellor' && (
              <Bdg col={c.blue} bg={c.blueBg}>
                <Ico.Lock /> Awaiting Counsellor
              </Bdg>
            )}
          </div>
          {s.role === 'yh' && (
            <div style={{ opacity: 0.85 }}>
              {s.fields.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    padding: '6px 0',
                    borderBottom: `1px solid ${c.borderL}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ width: '40%', color: c.muted }}>
                    {f.label}
                  </span>
                  <span style={{ flex: 1, fontWeight: 500 }}>
                    {f.value || '—'}
                  </span>
                </div>
              ))}
              {s.fields.length > 3 && (
                <span style={{ fontSize: 12, color: c.muted }}>
                  + {s.fields.length - 3} more fields
                </span>
              )}
              <div style={{ marginTop: 8 }}>
                <Btn v="ghost" sz="sm">
                  <Ico.Msg /> Add comment
                </Btn>
              </div>
            </div>
          )}
          {s.role === 'principal' &&
            s.fields.map((f) => (
              <div key={f.id} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  {f.label}
                </label>
                <textarea
                  placeholder="Enter your remarks..."
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: '10px 14px',
                    border: `2px solid ${c.pri}`,
                    borderRadius: 8,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    background: c.priBg,
                  }}
                />
              </div>
            ))}
          {s.role === 'counsellor' && (
            <div
              style={{
                padding: 20,
                textAlign: 'center',
                background: c.bg,
                borderRadius: 8,
                border: `2px dashed ${c.border}`,
              }}
            >
              <Ico.Lock />
              <p style={{ fontSize: 13, color: c.muted, margin: '4px 0 0' }}>
                Awaiting School Counsellor input
              </p>
            </div>
          )}
        </Card>
      ))}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 20,
          padding: '16px 0',
          borderTop: `1px solid ${c.border}`,
        }}
      >
        <Btn v="bad" onClick={() => go('form')}>
          Request Revisions
        </Btn>
        <div style={{ flex: 1 }} />
        <Btn v="ok" onClick={() => go('export')}>
          <Ico.Check s={14} /> Approve
        </Btn>
      </div>
    </div>
  )
}

function S10Export({ tpl, go }) {
  const [showPw, setShowPw] = useState(false)
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => go('review')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Ico.Back />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            Export Report
          </h2>
          <span style={{ fontSize: 13, color: c.muted }}>
            {tpl.name} · {STUDENT.name}
          </span>
        </div>
        <Bdg col={c.green} bg={c.greenBg}>
          <Ico.Check s={10} /> Approved
        </Bdg>
      </div>
      <Card
        style={{
          marginBottom: 16,
          textAlign: 'center',
          padding: 32,
          background: c.bg,
        }}
      >
        <div
          style={{
            width: 100,
            height: 140,
            background: c.white,
            border: `1px solid ${c.border}`,
            borderRadius: 4,
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}
        >
          <Ico.File />
        </div>
        <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
          {tpl.name}.pdf
        </p>
        <p style={{ fontSize: 12, color: c.muted, margin: 0 }}>
          {tpl.pages} pages · Password protected
        </p>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Ico.Lock />
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            Password Management
          </span>
          <Bdg col={c.purple} bg={c.purpleBg}>
            <Ico.Lock /> YH, DM & SLs only
          </Bdg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: c.muted, width: 120 }}>
            Password on file:
          </span>
          <input
            type={showPw ? 'text' : 'password'}
            defaultValue="CPS2026Jun"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'monospace',
              boxSizing: 'border-box',
            }}
          />
          <Btn v="ghost" sz="sm" onClick={() => setShowPw(!showPw)}>
            <Ico.Eye /> {showPw ? 'Hide' : 'Show'}
          </Btn>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
          }}
        >
          <input
            type="checkbox"
            defaultChecked
            style={{ accentColor: c.pri }}
          />
          <span style={{ fontSize: 12, color: c.muted }}>
            Save for future reports to {tpl.agency}
          </span>
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 12 }}>
        <Btn v="out" s={{ flex: 1 }} onClick={() => go('review')}>
          <Ico.Back /> Back
        </Btn>
        <Btn v="pri" s={{ flex: 1 }} onClick={() => go('done')}>
          <Ico.Dl /> Download PDF
        </Btn>
      </div>
    </div>
  )
}

function S11Done({ tpl, go }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 48 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: c.greenBg,
          color: c.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <Ico.Check s={28} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px' }}>
        Report Exported & Archived
      </h2>
      <p style={{ fontSize: 14, color: c.muted, marginBottom: 8 }}>
        {tpl.name} for {STUDENT.name}
      </p>
      <p style={{ fontSize: 13, color: c.muted, marginBottom: 32 }}>
        After emailing to {tpl.agency}, mark this report as 'Sent' to update the
        status.
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxWidth: 360,
          margin: '0 auto',
        }}
      >
        <Btn
          v="pri"
          onClick={() => go('form')}
          s={{ width: '100%', justifyContent: 'center' }}
        >
          Start next report (NUH Referral) <Ico.Right />
        </Btn>
        <Btn
          v="out"
          onClick={() => alert('Opening Case Sync... (dummy)')}
          s={{ width: '100%', justifyContent: 'center' }}
        >
          <Ico.Ext /> Open case in Case Sync
        </Btn>
        <Btn
          v="ghost"
          onClick={() => go('profile')}
          s={{ width: '100%', justifyContent: 'center' }}
        >
          Return to student profile
        </Btn>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function App() {
  const [scr, setScr] = useState('profile')
  const [sel, setSel] = useState([])
  const [src, setSrc] = useState(SOURCES)
  const tpl = TEMPLATES.find((t) => t.id === (sel[0] || 'cps')) || TEMPLATES[0]
  const steps = ['Template', 'Sources', 'Fill Report', 'P Review', 'Export']
  const stepMap = { templates: 0, sources: 1, form: 2, review: 3, export: 4 }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: c.text,
        background: c.bg,
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          background: c.white,
          borderBottom: `1px solid ${c.border}`,
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: c.pri }}>
          Teacher Workspace
        </span>
        <span
          style={{
            fontSize: 11,
            padding: '2px 6px',
            background: c.priBg,
            color: c.pri,
            borderRadius: 4,
            fontWeight: 500,
          }}
        >
          Beta
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: c.muted }}>Student Insights</span>
        <span style={{ fontSize: 13, color: c.muted, margin: '0 4px' }}>/</span>
        <span style={{ fontSize: 13, color: c.muted }}>{STUDENT.name}</span>
        {scr !== 'profile' && (
          <>
            <span style={{ fontSize: 13, color: c.muted, margin: '0 4px' }}>
              /
            </span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Agency Report</span>
          </>
        )}
      </div>
      {scr !== 'profile' && scr !== 'done' && stepMap[scr] !== undefined && (
        <div
          style={{
            background: c.white,
            borderBottom: `1px solid ${c.border}`,
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Steps steps={steps} cur={stepMap[scr]} />
        </div>
      )}
      <div
        style={{
          maxWidth: scr === 'form' ? '100%' : 720,
          margin: '0 auto',
          padding: scr === 'form' ? '20px 24px' : '24px 20px',
        }}
      >
        {scr === 'profile' && <S1Profile go={setScr} />}
        {scr === 'templates' && (
          <S2Templates go={setScr} sel={sel} setSel={setSel} />
        )}
        {scr === 'sources' && (
          <S3Sources go={setScr} src={src} setSrc={setSrc} />
        )}
        {scr === 'form' && <S4Form tpl={tpl} go={setScr} />}
        {scr === 'review' && <S8Review tpl={tpl} go={setScr} />}
        {scr === 'export' && <S10Export tpl={tpl} go={setScr} />}
        {scr === 'done' && <S11Done tpl={tpl} go={setScr} />}
      </div>
    </div>
  )
}
