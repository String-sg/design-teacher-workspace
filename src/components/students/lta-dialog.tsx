import { useState } from 'react'
import {
  BookOpen,
  ExternalLink,
  FileText,
  Headphones,
  Home,
  MessageSquare,
  Phone,
  Send,
  User,
  Users,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Student } from '@/types/student'

type ResourceTab = 'resources' | 'learn-more'

interface GuidanceAction {
  icon: typeof Phone
  iconColor: string
  title: string
  description: string
  urgency: { label: string; dotColor: string; textColor: string }
  source: string
  contacts: string[]
  resources: { label: string; href: string; external?: boolean }[]
}

function getStudentInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getSeverityInfo(absences: number) {
  if (absences >= 40)
    return {
      label: 'Severe LTA (40+ days)',
      level: 'Tier 3 — severe concern',
      badgeClass: 'bg-red-100 text-red-700',
    }
  if (absences >= 20)
    return {
      label: 'LTA (20–39 days)',
      level: 'Tier 2 — emerging concern',
      badgeClass: 'bg-orange-100 text-orange-700',
    }
  return {
    label: 'At-risk attendance (10–19 days)',
    level: 'Tier 1 — watch',
    badgeClass: 'bg-amber-100 text-amber-700',
  }
}

const guidanceActions: GuidanceAction[] = [
  {
    icon: Phone,
    iconColor: 'bg-red-100 text-red-600',
    title: 'Attempt contact within 24–48 hours',
    description:
      'Call both caregivers, SMS/WhatsApp, and email. Log all attempts — even failed ones count for compliance and show pattern.',
    urgency: {
      label: 'Urgent',
      dotColor: 'bg-red-500',
      textColor: 'text-red-600',
    },
    source: 'Student Management Guide (MOE)',
    contacts: ['Form Teacher'],
    resources: [{ label: 'Contact log template', href: '#' }],
  },
  {
    icon: MessageSquare,
    iconColor: 'bg-orange-100 text-orange-600',
    title: 'Do a student check-in when reachable',
    description:
      "Explore barriers (sleep, anxiety, bullying, transport, caregiving) and agree on one small next step. Listen first — don't jump to solutions.",
    urgency: {
      label: 'This week',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
    source: 'Well-being Guide (MOE)',
    contacts: ['School Counsellor'],
    resources: [{ label: 'Check-in template', href: '#' }],
  },
  {
    icon: Users,
    iconColor: 'bg-orange-100 text-orange-600',
    title: 'Loop in the School Counsellor',
    description:
      'Before considering an FSC referral, assess the situation with the School Counsellor. Share your observations and get a read on whether formal support is needed.',
    urgency: {
      label: 'This week',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
    source: 'SwAN Support Framework (MOE)',
    contacts: ['School Counsellor', 'Year Head'],
    resources: [{ label: 'SC referral form', href: '#' }],
  },
  {
    icon: Home,
    iconColor: 'bg-green-100 text-green-600',
    title: 'Initiate home visit if uncontactable',
    description:
      'If uncontactable or persistent: initiate home visit per guidelines. Go with a colleague; verify address before visiting.',
    urgency: {
      label: 'Monitor',
      dotColor: 'bg-green-500',
      textColor: 'text-green-600',
    },
    source: 'Student Management Guide (MOE)',
    contacts: ['Year Head', 'Form Teacher'],
    resources: [{ label: 'Home visit checklist', href: '#' }],
  },
]

const caseResources = [
  { label: 'Contact log template', href: '#' },
  { label: 'Check-in template (LTA-adapted)', href: '#' },
  { label: 'Home visit checklist', href: '#' },
  { label: 'LTA guidelines', href: '#' },
  { label: 'Attendance monitoring protocol', href: '#' },
  { label: 'Case Management Guide', href: '#' },
  { label: 'Open CaseSync', href: '#', external: true },
]

const learnMoreItems = [
  {
    type: 'audio' as const,
    title: 'Why students go missing: patterns behind absenteeism',
    author: 'AST',
    duration: '8 min watch',
  },
  {
    type: 'article' as const,
    title: 'Having difficult conversations with parents about attendance',
    author: 'AST',
    duration: '5 min read',
  },
]

interface LtaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student
}

export function LtaDialog({ open, onOpenChange, student }: LtaDialogProps) {
  const [activeTab, setActiveTab] = useState<ResourceTab>('resources')

  if (!open) return null

  const severity = getSeverityInfo(student.absences)
  const initials = getStudentInitials(student.name)
  const firstName = student.name.split(' ')[0]

  const suggestedQuestions = [
    'What should I do if parents are uncontactable?',
    `How do I adjust my approach for ${firstName}'s situation?`,
    'When should I escalate to Year Head?',
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* ── Top bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
            G
          </span>
          <span className="text-sm font-medium">Glow · Student Support</span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      {/* ── 3-column layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel: Student context ── */}
        <aside className="w-[280px] shrink-0 overflow-y-auto border-r p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Student Profile · Attendance
          </p>

          {/* Student identity */}
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </span>
            <div>
              <p className="text-sm font-semibold">{student.name}</p>
              <p className="text-xs text-muted-foreground">
                Class {student.class} · {student.cca}
              </p>
            </div>
          </div>

          {/* Severity badge */}
          <div className="mt-3">
            <span
              className={cn(
                'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                severity.badgeClass,
              )}
            >
              {severity.label}
            </span>
          </div>

          {/* Context */}
          <h2 className="mt-6 text-base font-bold leading-snug">
            How to support a student with long-term absenteeism?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Persistent absence often signals barriers the student hasn't voiced
            — anxiety, caregiving, peer issues, or disengagement.
          </p>

          {/* Active triggers */}
          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Active Triggers
            </p>
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-orange-800">
                  {student.absences} non-VR absences
                </span>
              </div>
              {student.attentionTags.includes('SEN') && (
                <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium text-purple-800">
                    SEN profile
                  </span>
                </div>
              )}
              {student.attentionTags.includes('FAS') && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-amber-800">
                    FAS recipient
                  </span>
                </div>
              )}
              {student.lowMoodFlagged && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                  <span className="text-sm font-medium text-rose-800">
                    Low mood flagged
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Risk Level
              </p>
              <p className="mt-1 text-sm">{severity.level}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Case Manager
              </p>
              <p className="mt-1 text-sm">Not yet assigned</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Last SDT Review
              </p>
              <p className="mt-1 text-sm">&mdash;</p>
            </div>
          </div>
        </aside>

        {/* ── Middle panel: AI Chat ── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {/* AI response */}
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
                G
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed">
                  {student.name} is flagged at{' '}
                  <strong>{severity.label}</strong> because they have
                  accumulated {student.absences} non-VR absences this term.
                  Here's a sequenced approach, prioritised by urgency:
                </p>

                {/* Action cards */}
                <div className="mt-6 space-y-2">
                  {guidanceActions.map((action, i) => {
                    const Icon = action.icon
                    return (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                              action.iconColor,
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            {/* Title + urgency */}
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold">
                                {action.title}
                              </h4>
                              <span
                                className={cn(
                                  'flex shrink-0 items-center gap-1.5 text-xs font-medium',
                                  action.urgency.textColor,
                                )}
                              >
                                <span
                                  className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    action.urgency.dotColor,
                                  )}
                                />
                                {action.urgency.label}
                              </span>
                            </div>

                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {action.description}
                            </p>

                            {/* Source + Contact */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <span className="font-medium uppercase tracking-wide">
                                  Source
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                                  <BookOpen className="h-3 w-3" />
                                  {action.source}
                                </span>
                              </span>
                              <span className="text-border">|</span>
                              <span className="flex items-center gap-1.5">
                                <span className="font-medium uppercase tracking-wide">
                                  Contact
                                </span>
                                {action.contacts.map((c) => (
                                  <span
                                    key={c}
                                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"
                                  >
                                    <User className="h-3 w-3" />
                                    {c}
                                  </span>
                                ))}
                              </span>
                            </div>

                            {/* Resources */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs">
                              <span className="font-medium uppercase tracking-wide text-muted-foreground">
                                Resources
                              </span>
                              {action.resources.map((r) => (
                                <a
                                  key={r.label}
                                  href={r.href}
                                  className="text-blue-600 underline-offset-2 hover:underline"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {r.label}
                                  {r.external && (
                                    <ExternalLink className="ml-0.5 inline h-3 w-3" />
                                  )}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Sharpen prompt */}
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">
                    To sharpen this plan:
                  </strong>{' '}
                  it would help to know whether the absences are continuous (3+
                  days in a row) or intermittent, and whether there's been any
                  recent contact with the family. Share what you know in the chat
                  below.
                </p>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="mt-6 flex flex-wrap gap-2 pl-10">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  className="rounded-full border px-3.5 py-2 text-sm transition-colors hover:bg-muted"
                  onClick={(e) => e.preventDefault()}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div className="shrink-0 border-t px-10 py-4">
            <div className="flex items-center gap-2 rounded-full border px-4 py-2.5">
              <input
                type="text"
                placeholder={`Ask a follow-up about ${firstName}...`}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                readOnly
              />
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* ── Right panel: Resources ── */}
        <aside className="w-[280px] shrink-0 overflow-y-auto border-l">
          {/* Tab bar */}
          <div className="flex border-b">
            <button
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'resources'
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
            <button
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'learn-more'
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveTab('learn-more')}
            >
              Learn More
            </button>
          </div>

          <div className="p-5">
            {activeTab === 'resources' ? (
              <>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Relevant to this case
                </p>
                <ul className="mt-3 space-y-0.5">
                  {caseResources.map((r) => (
                    <li key={r.label}>
                      <a
                        href={r.href}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        <span className="flex-1">{r.label}</span>
                        {r.external && (
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Further learning
                </p>
                <ul className="mt-3 space-y-3">
                  {learnMoreItems.map((item) => (
                    <li
                      key={item.title}
                      className="cursor-default rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          {item.type === 'audio' ? (
                            <Headphones className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </span>
                        <div>
                          <p className="text-sm font-medium leading-snug">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            By {item.author} · {item.duration}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
