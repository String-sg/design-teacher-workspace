import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  Heart,
  Home,
  MoreHorizontal,
  Plus,
  User,
} from 'lucide-react'

import type { Student } from '@/types/student'
import type { HolisticReport, ReviewStatus, Term } from '@/types/report'
import { filterReports, TERMS } from '@/data/mock-reports'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GenerateHdpWizard } from '@/components/reports/generate-hdp-wizard'
import { StudentOverviewCards } from './student-overview-cards'

interface StudentProfileProps {
  student: Student
  headerControls?: React.ReactNode
}

interface SectionProps {
  id: string
  title: string
  icon: React.ReactNode
  iconClassName?: string
  children: React.ReactNode
}

function Section({ id, title, icon, iconClassName, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-lg border bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            iconClassName,
          )}
        >
          {icon}
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

interface FieldProps {
  label: string
  value: React.ReactNode
  tooltip?: string
  className?: string
}

function Field({ label, value, tooltip, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <dt className="flex items-center gap-1 text-sm text-muted-foreground">
        {label}
        {tooltip && (
          <span
            className="cursor-help text-xs text-muted-foreground/60"
            title={tooltip}
          >
            (?)
          </span>
        )}
      </dt>
      <dd className="text-sm font-medium">{value ?? '-'}</dd>
    </div>
  )
}

interface RemarksFieldProps {
  label: string
  value: string | null
  tooltip?: string
}

function RemarksField({ label, value, tooltip }: RemarksFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1 text-sm text-muted-foreground">
        {label}
        {tooltip && (
          <span
            className="cursor-help text-xs text-muted-foreground/60"
            title={tooltip}
          >
            (?)
          </span>
        )}
      </dt>
      <dd className="text-sm text-foreground">
        {value || (
          <span className="text-muted-foreground">No remarks available</span>
        )}
      </dd>
    </div>
  )
}

const REVIEW_STATUS_CONFIG: Record<
  ReviewStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
}

function ReportRow({ report }: { report: HolisticReport }) {
  const { label, className } = REVIEW_STATUS_CONFIG[report.reviewStatus]
  const generatedDate = report.generatedAt.toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      to="/reports/$id"
      params={{ id: report.id }}
      className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {report.term} — {report.academicYear}
          </p>
          <p className="text-xs text-muted-foreground">
            Generated {generatedDate}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={className}>{label}</Badge>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}

export function StudentProfile({
  student,
  headerControls,
}: StudentProfileProps) {
  const [wizardOpen, setWizardOpen] = useState(false)

  const studentReports = filterReports({ studentId: student.id })
  const existingTerms = new Set(studentReports.map((r) => r.term))
  const missingTerms = TERMS.filter(
    (t): t is Term => !existingTerms.has(t),
  )

  const sections = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'behaviour', label: 'Behaviour' },
    { id: 'wellbeing', label: 'Wellbeing' },
    { id: 'academic', label: 'Academic' },
    { id: 'family', label: 'Family' },
    { id: 'reports', label: 'Reports' },
  ]

  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-6">
        {/* Header Controls */}
        {headerControls}

        {/* Student Header Card */}
        <div className="flex items-center gap-4 rounded-lg border bg-white p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{student.name}</h1>
            <p className="text-muted-foreground">Class {student.class}</p>
          </div>
        </div>

        {/* Overview Cards */}
        <StudentOverviewCards student={student} />

        {/* Attendance Section */}
        <Section
          id="attendance"
          title="Attendance"
          icon={<Calendar className="h-5 w-5" />}
          iconClassName="bg-yellow-100 text-yellow-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Attendance(%)"
              value={
                student.totalSchoolDays > 0
                  ? Math.round(
                      (student.daysPresent / student.totalSchoolDays) * 100,
                    )
                  : 0
              }
            />
            <Field label="Late-coming(%)" value={student.lateComing} />
            <Field label="Non-VR absences(%)" value={student.absences} />
          </dl>
        </Section>

        {/* Behaviour Section */}
        <Section
          id="behaviour"
          title="Behaviour"
          icon={<BookOpen className="h-5 w-5" />}
          iconClassName="bg-indigo-100 text-indigo-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Offences"
              value={student.offences}
              tooltip="Total disciplinary offences"
            />
            <Field
              label="CCA attendance(%)"
              value={`${100 - student.ccaMissed * 5}`}
            />
            <Field
              label="Conduct grade"
              value={student.conduct}
              tooltip="Current term conduct grade"
            />
          </dl>

          <div className="mt-6 space-y-4 border-t pt-4">
            <RemarksField
              label="Teacher's remarks"
              value={student.teacherObservations}
              tooltip="Form teacher observations"
            />
            <RemarksField label="Next steps" value={student.nextSteps} />
          </div>
        </Section>

        {/* Wellbeing Section */}
        <Section
          id="wellbeing"
          title="Wellbeing"
          icon={<Heart className="h-5 w-5" />}
          iconClassName="bg-pink-100 text-pink-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Counselling"
              value={student.counsellingSessions}
              tooltip="Number of counselling sessions"
            />
            <Field label="SEN" value={student.sen || '-'} />
            <Field
              label="Social links"
              value={student.socialLinks}
              tooltip="Number of positive peer connections"
            />
            <Field
              label="Risk indicators"
              value={student.riskIndicators}
              tooltip="Number of risk factors identified"
            />
            <Field
              label="Low mood flagged 2+ terms"
              value={student.lowMoodFlagged || 'No'}
              tooltip="Flagged for persistent low mood"
            />
          </dl>

          <div className="mt-6 space-y-4 border-t pt-4">
            <RemarksField
              label="SEN Officer's remarks"
              value={null}
              tooltip="Special Educational Needs officer notes"
            />
            <RemarksField
              label="Counsellor's remarks"
              value={null}
              tooltip="School counsellor notes"
            />
          </div>
        </Section>

        {/* Academic Section */}
        <Section
          id="academic"
          title="Academic"
          icon={<GraduationCap className="h-5 w-5" />}
          iconClassName="bg-blue-100 text-blue-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Overall % across selected subjects"
              value={`${student.overallPercentage}%`}
              tooltip="Average percentage across all subjects"
            />
            <Field label="Class rank" value="32/40" />
            <Field label="Class percentile" value="77%" />
            <Field label="No. of subjects taken" value="8" />
            <Field label="Distinctions" value="5" />
            <Field label="Pass" value="3" />
            <Field
              label="Learning support"
              value={student.learningSupport || '-'}
            />
          </dl>
        </Section>

        {/* Family Section */}
        <Section
          id="family"
          title="Family"
          icon={<Home className="h-5 w-5" />}
          iconClassName="bg-green-100 text-green-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field label="FAS" value={student.fas || '-'} />
            <Field label="Housing" value={student.housing || '-'} />
            <Field
              label="Housing ownership"
              value={
                student.housingType === 'Rented'
                  ? 'Rented'
                  : student.housingType === 'Owned'
                    ? 'Owned'
                    : '-'
              }
            />
            <Field label="Custody" value={student.custody || '-'} />
            <Field label="Siblings" value={student.siblings} />
            <Field
              label="External agencies"
              value={student.externalAgencies || '-'}
            />
          </dl>
        </Section>

        {/* Reports Section */}
        <Section
          id="reports"
          title="Reports"
          icon={<FileText className="h-5 w-5" />}
          iconClassName="bg-red-100 text-red-600"
        >
          {studentReports.length > 0 ? (
            <div className="space-y-2">
              {studentReports
                .sort(
                  (a, b) =>
                    TERMS.indexOf(a.term) - TERMS.indexOf(b.term),
                )
                .map((report) => (
                  <ReportRow key={report.id} report={report} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No reports generated</p>
                <p className="text-xs text-muted-foreground">
                  Generate a Holistic Development Report for this student
                </p>
              </div>
            </div>
          )}

          {missingTerms.length > 0 && (
            <div className="mt-4 flex items-center gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWizardOpen(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Generate HDP
              </Button>
              <span className="text-xs text-muted-foreground">
                {missingTerms.length === TERMS.length
                  ? 'All terms'
                  : missingTerms.join(', ')}{' '}
                not yet generated
              </span>
            </div>
          )}

          {studentReports.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                render={
                  <Link
                    to="/reports"
                    search={{ studentId: student.id, groupBy: 'student' }}
                  />
                }
              >
                <Eye className="mr-1 h-4 w-4" />
                View all in Reports
              </Button>
            </div>
          )}
        </Section>
      </div>

      {/* Jump to Navigation */}
      <aside className="hidden w-40 shrink-0 lg:block">
        <div className="sticky top-24">
          <p className="mb-2 text-sm text-muted-foreground">Jump to</p>
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full bg-muted px-3 py-1.5 text-sm hover:bg-muted/80"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <GenerateHdpWizard
        student={student}
        missingTerms={missingTerms}
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />
    </div>
  )
}
