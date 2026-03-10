import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  MessageSquare,
  Send,
  SquareIcon,
  User,
  X,
} from 'lucide-react'

import type { Student } from '@/types/student'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ResourceTab = 'resources' | 'learn-more'

interface GuidanceAction {
  icon: typeof AlertTriangle
  iconColor: string
  iconBg: string
  title: string
  description: string
  urgency: {
    label: string
    dotColor: string
    textColor: string
    badgeBg: string
  }
  contacts: Array<string>
  resources: Array<{ label: string; href: string; external?: boolean }>
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

const guidanceActions: Array<GuidanceAction> = [
  {
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    title: 'Do a 1-on-1 check-in within 48 hours',
    description:
      "Low mood is the most time-sensitive signal here — it could point to something deeper. Validate feelings first; don't address the bullying incident in the same conversation.",
    urgency: {
      label: 'Urgent',
      dotColor: 'bg-red-500',
      textColor: 'text-red-700',
      badgeBg: 'bg-red-50 border border-red-200',
    },
    contacts: ['School Counsellor', 'SEN Officer'],
    resources: [
      { label: 'Check-in guide (SwAN-adapted)', href: '#' },
      { label: 'Low mood red flags', href: '#' },
    ],
  },
  {
    icon: SquareIcon,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    title: 'Consult SEN Officer before setting expectations',
    description:
      'Before re-engaging CCA or setting behavioural targets, understand his specific profile. Generic interventions may not apply — adjust communication style, consequences, and support.',
    urgency: {
      label: 'This week',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-700',
      badgeBg: 'bg-orange-50 border border-orange-200',
    },
    contacts: ['SEN Officer'],
    resources: [{ label: 'SwAN differentiation guide', href: '#' }],
  },
  {
    icon: MessageSquare,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    title: 'Convene a 15-min SDT/CMT case discussion',
    description:
      'Pull RIOT data (attendance, discipline, teacher observations — past 4 weeks). Assign a single Case Manager to coordinate across all three concerns: YH, SC, and SEN Officer all looped in.',
    urgency: {
      label: 'This week',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-700',
      badgeBg: 'bg-orange-50 border border-orange-200',
    },
    contacts: ['Year Head', 'School Counsellor', 'SEN Officer'],
    resources: [
      { label: 'Case Management Guide', href: '#' },
      { label: 'Open CaseSync', href: '#', external: true },
    ],
  },
  {
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
    title: 'Re-engage CCA with a phased plan',
    description:
      'Once low mood and safety are stabilised, meet CCA TIC + student to agree on a 4-week plan — buddy system, reduced role, clear expectations. CCA can be protective if the environment is right.',
    urgency: {
      label: 'Monitor',
      dotColor: 'bg-green-500',
      textColor: 'text-green-700',
      badgeBg: 'bg-green-50 border border-green-200',
    },
    contacts: ['CCA Teacher-in-Charge', 'Form Teacher'],
    resources: [{ label: 'CCA re-engagement guide', href: '#' }],
  },
]

const caseResources = [
  { label: 'Check-in guide (SwAN-adapted)', href: '#' },
  { label: 'Low mood red flags', href: '#' },
  { label: 'Bullying response protocol', href: '#' },
  { label: 'Incident report template', href: '#' },
  { label: 'SwAN differentiation guide', href: '#' },
  { label: 'Case Management Guide', href: '#' },
  { label: 'CCA re-engagement guide', href: '#' },
  { label: 'Open CaseSync', href: '#', external: true },
]

const learnMoreItems = [
  {
    label: 'Understanding SwAN Profiles',
    meta: 'MOE Well-being Guide · 8 min read',
  },
  {
    label: 'Tier 2 Intervention Playbook',
    meta: 'Case Management Guide · 12 min read',
  },
  {
    label: 'Conducting Safe Check-ins',
    meta: 'School Counselling Handbook · 6 min read',
  },
]

interface GlowStudentSupportPageProps {
  student: Student
  onClose: () => void
}

export function GlowStudentSupportPage({
  student,
  onClose,
}: GlowStudentSupportPageProps) {
  const [activeTab, setActiveTab] = useState<ResourceTab>('resources')

  const initials = getStudentInitials(student.name)
  const firstName = student.name.split(' ')[0]

  const suggestedQuestions = [
    'Which issue should I tackle first?',
    `How do I adjust my approach for his SwAN profile?`,
    'When should I loop in the School Counsellor?',
  ]

  return (
    // Fills the full viewport — no fixed/z-index needed since this IS the page
    <div className="flex h-screen flex-col bg-[var(--background)]">
      {/* ── Top bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-[var(--twblue-9)] text-xs font-bold text-white">
            G
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Glow
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">·</span>
          <span className="text-sm text-[var(--muted-foreground)]">
            Student Support
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </header>

      {/* ── 3-column layout — gap creates the NotebookLM-style visible separation ── */}
      <div className="flex flex-1 gap-4 overflow-hidden p-3">
        {/* ── Left panel: Student context ── */}
        <aside className="flex w-[420px] shrink-0 flex-col overflow-hidden rounded-[var(--radius)] border bg-[var(--card)] shadow-[0px_1px_2px_0px_rgb(0_0_0/0.05)]">
          {/* Panel header */}
          <div className="shrink-0 border-b border-[var(--border)] px-5 py-3.5">
            <h2 className="text-sm font-medium text-[var(--foreground)]">
              Student context
            </h2>
          </div>

          <div className="overflow-y-auto p-5">
            {/* Section label */}
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Student Profile · Wellbeing
            </p>

            {/* Student identity */}
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--twblue-9)] text-xs font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{student.name}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  Class {student.class} · {student.cca}
                </p>
              </div>
            </div>

            {/* SwAN badge */}
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                SwAN — SEN Profile
              </span>
            </div>

            {/* Context question */}
            <h2 className="mt-5 text-sm font-semibold leading-snug text-[var(--foreground)]">
              How to support a SwAN student with multiple concerns?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Co-occurring behavioural, social-emotional, and engagement
              challenges require a sequenced, differentiated approach.
            </p>

            {/* Divider */}
            <div className="my-5 border-t border-[var(--border)]" />

            {/* Active triggers */}
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Active Triggers
            </p>
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center gap-2 rounded-[var(--radius)] bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                Bullying offence
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius)] bg-orange-50 px-3 py-2 text-sm font-medium text-orange-800">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {student.ccaMissed} missed CCA sessions
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius)] bg-orange-50 px-3 py-2 text-sm font-medium text-orange-800">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                Low mood in class
              </div>
            </div>

            <div className="my-5 border-t border-[var(--border)]" />

            {/* Metadata */}
            <div className="space-y-4">
              <MetaField
                label="SwAN Need Area"
                value="Social-emotional / behavioural"
              />
              <MetaField label="Risk Level" value="Tier 2 — emerging concern" />
              <MetaField label="Case Manager" value="Not yet assigned" />
              <MetaField label="Last SDT Review" value="—" />
            </div>
          </div>
        </aside>

        {/* ── Middle panel: AI Chat ── */}
        <main className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius)] border bg-[var(--card)] shadow-[0px_1px_2px_0px_rgb(0_0_0/0.05)]">
          {/* Panel header */}
          <div className="shrink-0 border-b border-[var(--border)] px-8 py-3.5">
            <h2 className="text-sm font-medium text-[var(--foreground)]">
              Chat
            </h2>
          </div>

          {/* Scrollable messages area */}
          <div className="flex-1 overflow-y-auto px-8 py-7">
            {/* AI response */}
            <div className="flex gap-3">
              {/* Glow avatar */}
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--twblue-9)] text-xs font-bold text-white">
                G
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-[var(--foreground)]">
                  {firstName} is flagged at <strong>Tier 2 risk</strong> because
                  three concerns are presenting at the same time — a bullying
                  offence, disengagement from CCA, and observed low mood. Each
                  alone may be manageable; together, they suggest an emerging
                  pattern that warrants coordinated support before it escalates
                  to Tier 3. Here's a sequenced approach, prioritised by
                  urgency:
                </p>

                {/* Action cards */}
                <div className="mt-5 space-y-2.5">
                  {guidanceActions.map((action, i) => {
                    const Icon = action.icon
                    return (
                      <div
                        key={i}
                        className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--muted)]"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <span
                            className={cn(
                              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)]',
                              action.iconBg,
                            )}
                          >
                            <Icon className={cn('h-4 w-4', action.iconColor)} />
                          </span>

                          <div className="min-w-0 flex-1">
                            {/* Title + urgency badge */}
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-sm font-semibold leading-snug">
                                {action.title}
                              </h4>
                              <span
                                className={cn(
                                  'flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                                  action.urgency.badgeBg,
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

                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                              {action.description}
                            </p>

                            {/* Contact chips */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                                  Contact
                                </span>
                                {action.contacts.map((c) => (
                                  <span
                                    key={c}
                                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--foreground)]"
                                  >
                                    <User className="h-3 w-3 shrink-0 text-[var(--muted-foreground)]" />
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Resources */}
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                                Resources
                              </span>
                              {action.resources.map((r) => (
                                <a
                                  key={r.label}
                                  href={r.href}
                                  className="inline-flex items-center gap-0.5 text-xs text-[var(--twblue-11)] underline-offset-2 hover:underline"
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
                <p className="mt-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  <strong className="text-[var(--foreground)]">
                    To sharpen this plan:
                  </strong>{' '}
                  it would help to know how long the low mood has been observed,
                  whether the bullying was physical/verbal/cyber and if the
                  victim is safe, and what {firstName}'s specific SwAN diagnosis
                  or support needs are. Share what you know in the chat below.
                </p>
              </div>
            </div>

            {/* Suggested follow-up questions */}
            <div className="mt-6 flex flex-wrap gap-2 pl-10">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                  onClick={(e) => e.preventDefault()}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input — pinned to bottom */}
          <div className="shrink-0 border-t border-[var(--border)] px-8 py-4">
            <div className="flex items-center gap-2 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 transition-colors focus-within:border-[var(--ring)] focus-within:ring-2 focus-within:ring-[var(--ring)]/20">
              <input
                type="text"
                placeholder={`Ask a follow-up about ${firstName}…`}
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                readOnly
              />
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* ── Right panel: Resources ── */}
        <aside className="flex w-[400px] shrink-0 flex-col overflow-hidden rounded-[var(--radius)] border bg-[var(--card)] shadow-[0px_1px_2px_0px_rgb(0_0_0/0.05)]">
          {/* Panel header */}
          <div className="shrink-0 border-b border-[var(--border)] px-4 py-3.5">
            <h2 className="text-sm font-medium text-[var(--foreground)]">
              Learn more
            </h2>
          </div>

          {/* Segmented tab control */}
          <div className="shrink-0 px-4 py-3">
            <div className="flex rounded-full bg-muted p-1 gap-1">
              <TabButton
                active={activeTab === 'resources'}
                onClick={() => setActiveTab('resources')}
              >
                Resources
              </TabButton>
              <TabButton
                active={activeTab === 'learn-more'}
                onClick={() => setActiveTab('learn-more')}
              >
                Learn More
              </TabButton>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'resources' ? (
              <>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Relevant to this case
                </p>
                <ul className="space-y-0.5">
                  {caseResources.map((r) => (
                    <li key={r.label}>
                      <a
                        href={r.href}
                        className="group flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)] group-hover:text-[var(--twblue-9)]" />
                        <span className="flex-1 leading-snug">{r.label}</span>
                        {r.external ? (
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Professional learning
                </p>
                <ul className="space-y-1.5">
                  {learnMoreItems.map((item) => (
                    <li key={item.label}>
                      <a
                        href="#"
                        className="group flex flex-col gap-0.5 rounded-[var(--radius)] px-2.5 py-2 transition-colors hover:bg-[var(--muted)]"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--twblue-9)]">
                          {item.label}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {item.meta}
                        </span>
                      </a>
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

// ── Sub-components ──────────────────────────────────────────

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--foreground)]">{value}</p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={cn(
        'flex-1 rounded-full py-1.5 text-sm font-medium transition-all',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
