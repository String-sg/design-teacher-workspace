import {
  BookOpen,
  GraduationCap,
  Heart,
  Home,
  MoreHorizontal,
  User,
} from 'lucide-react'

import type { Student } from '@/types/student'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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

export function StudentProfile({
  student,
  headerControls,
}: StudentProfileProps) {
  const sections = [
    { id: 'behaviour', label: 'Behaviour' },
    { id: 'wellbeing', label: 'Wellbeing' },
    { id: 'academic', label: 'Academic' },
    { id: 'family', label: 'Family' },
    { id: 'others', label: 'Others' },
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

        {/* Behaviour Section */}
        <Section
          id="behaviour"
          title="Behaviour"
          icon={<BookOpen className="h-5 w-5" />}
          iconClassName="bg-indigo-100 text-indigo-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Attendance(%)"
              value={`${100 - Math.round((student.absences / 200) * 100)}`}
            />
            <Field label="Late-coming(%)" value={student.lateComing} />
            <Field label="Non-VR absences(%)" value={student.absences} />
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
              value={
                <Badge
                  className={cn(
                    student.conduct === 'Poor' &&
                      'bg-red-100 text-red-700 hover:bg-red-100',
                    student.conduct === 'Fair' &&
                      'bg-amber-100 text-amber-700 hover:bg-amber-100',
                    student.conduct === 'Good' &&
                      'bg-slate-100 text-slate-700 hover:bg-slate-100',
                    student.conduct === 'Excellent' &&
                      'bg-green-100 text-green-700 hover:bg-green-100',
                  )}
                >
                  {student.conduct}
                </Badge>
              }
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
          iconClassName="bg-teal-100 text-teal-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Overall % across selected subjects"
              value={student.overallPercentage}
              tooltip="Average percentage across all subjects"
            />
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
          iconClassName="bg-amber-100 text-amber-600"
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
          </dl>
        </Section>

        {/* Others Section */}
        <Section
          id="others"
          title="Others"
          icon={<MoreHorizontal className="h-5 w-5" />}
          iconClassName="bg-slate-100 text-slate-600"
        >
          <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Field label="Custody" value={student.custody || '-'} />
            <Field label="Siblings" value={student.siblings} />
            <Field
              label="External agencies"
              value={student.externalAgencies || '-'}
            />
          </dl>
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
    </div>
  )
}
