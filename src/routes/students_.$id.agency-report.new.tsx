import { useState } from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  ListChecks,
  Lock,
  PanelRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

import type {
  AgencyTemplate,
  ReportField,
  ReportSection,
} from '@/data/mock-agency-reports'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getStudentById } from '@/data/mock-students'
import {
  AGENCY_TEMPLATES,
  AI_DRAFTS,
  AI_DRAFT_CITATIONS,
  MOCK_COUNSELLOR,
  mockAgencyReports,
} from '@/data/mock-agency-reports'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/students_/$id/agency-report/new')({
  component: AgencyReportWizardPage,
  loader: ({ params }) => {
    const student = getStudentById(params.id)
    if (!student) throw notFound()
    return { student }
  },
})

// ── Types ──────────────────────────────────────────────────────

type WizardStep =
  | 'templates'
  | 'form'
  | 'review'
  | 'submitted'
  | 'export'
  | 'done'

// ── Step bar ──────────────────────────────────────────────────

const STEP_LABELS = ['Template', 'Fill Report', 'Export']
const STEP_MAP: Record<WizardStep, number> = {
  templates: 0,
  form: 1,
  review: 1,
  submitted: 2,
  export: 2,
  done: 2,
}

const PREVIEW_SCALES = [0.55, 0.68, 0.82, 1] as const
const PREVIEW_BG = '#E8E6E0'

function StepBar({ step }: { step: WizardStep }) {
  const cur = STEP_MAP[step]
  return (
    <div className="flex items-center justify-center gap-0 border-b bg-white px-4 py-3">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                i < cur
                  ? 'bg-green-500 text-white'
                  : i === cur
                    ? 'bg-primary text-white'
                    : 'border-2 border-border bg-muted text-muted-foreground',
              )}
            >
              {i < cur ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={cn(
                'hidden text-xs sm:block',
                i === cur
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className={cn(
                'mx-2 h-0.5 w-6 shrink-0',
                i < cur ? 'bg-green-500' : 'bg-border',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Student context bar ───────────────────────────────────────

function StudentBar({
  name,
  studentClass,
  inProgress,
}: {
  name: string
  studentClass: string
  inProgress: number
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {name
          .split(' ')
          .slice(-2)
          .map((w) => w[0])
          .join('')}
      </div>
      <span className="font-semibold">{name}</span>
      <span className="text-sm text-muted-foreground">{studentClass}</span>
      {inProgress > 0 && (
        <Badge className="ml-auto bg-primary/10 text-primary hover:bg-primary/10">
          {inProgress} report{inProgress !== 1 ? 's' : ''} in progress
        </Badge>
      )}
    </div>
  )
}

// ── Agency icon badge ─────────────────────────────────────────

function AgencyIcon({ abbrev, color }: { abbrev: string; color: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[10px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {abbrev.length > 4 ? abbrev.slice(0, 4) : abbrev}
    </div>
  )
}

// ── S2 Template Selection ─────────────────────────────────────

const TEMPLATE_CATEGORIES = [
  {
    id: 'child-welfare',
    label: 'Child Welfare',
    ids: ['cps', 'children-home'],
  },
  {
    id: 'social-services',
    label: 'Social Services',
    ids: ['msf', 'msf-probation', 'msf-psv', 'sc-swo-a', 'sc-swo-b', 'intake'],
  },
  {
    id: 'law-enforcement',
    label: 'Law Enforcement & Corrections',
    ids: ['spf', 'cnb', 'sps'],
  },
  {
    id: 'mental-health',
    label: 'Mental Health & Wellbeing',
    ids: ['imh-cgc', 'reach', 'navh', 'nuh'],
  },
  { id: 'assessment', label: 'Assessment Tools', ids: ['assq'] },
  { id: 'general', label: 'General', ids: ['nric-report'] },
]

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  return d
}

function formatDueDate(date: Date): string {
  return date.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
}

function templatePreviewImg(template: AgencyTemplate): string | null {
  if (!template.templateFile) return null
  const filename = template.templateFile.split('/').pop() ?? ''
  const base = filename.replace(/\.(docx?|pdf)$/i, '')
  return `/report-previews/${base}-thumb.png`
}

function TemplateThumbnail({ template }: { template: AgencyTemplate }) {
  const src = templatePreviewImg(template)
  return (
    <div className="h-[120px] w-full overflow-hidden rounded-t-lg bg-white">
      {src && (
        <img
          src={src}
          alt={`${template.name} first page`}
          className="h-full w-full object-cover object-top"
        />
      )}
    </div>
  )
}

function TemplateSelection({
  studentName,
  studentClass,
  studentId,
  selected,
  onToggle,
  onSelectAndContinue,
  onBack,
  onContinue,
}: {
  studentName: string
  studentClass: string
  studentId: string
  selected: Array<string>
  onToggle: (id: string) => void
  onSelectAndContinue: (id: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [multiSelect, setMultiSelect] = useState(false)

  const inProgressReports = mockAgencyReports.filter(
    (r) =>
      r.studentId === studentId &&
      (r.status === 'draft' || r.status === 'pending_review'),
  )

  return (
    <div className="space-y-5">
      <StudentBar
        name={studentName}
        studentClass={studentClass}
        inProgress={inProgressReports.length}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Select a template</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Choose the agency report to generate for this student.
          </p>
        </div>
        <Button
          variant={multiSelect ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMultiSelect((m) => !m)}
          className="gap-1.5 text-xs"
        >
          <ListChecks className="h-3.5 w-3.5" />
          {multiSelect ? 'Cancel multi-select' : 'Select multiple'}
        </Button>
      </div>

      {TEMPLATE_CATEGORIES.map((cat) => {
        const catTemplates = cat.ids
          .map((id) => AGENCY_TEMPLATES.find((t) => t.id === id))
          .filter(Boolean) as Array<AgencyTemplate>
        if (catTemplates.length === 0) return null
        return (
          <div key={cat.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.label}
            </p>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
              {catTemplates.map((tpl) => {
                const on = selected.includes(tpl.id)
                const inProgress = inProgressReports.find(
                  (r) => r.templateId === tpl.id,
                )
                const dueDate = inProgress?.startedAt
                  ? formatDueDate(
                      addBusinessDays(inProgress.startedAt, tpl.turnaroundDays),
                    )
                  : null
                const isHovered = hoveredId === tpl.id

                return (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      if (multiSelect) {
                        onToggle(tpl.id)
                      } else {
                        onSelectAndContinue(tpl.id)
                      }
                    }}
                    onMouseEnter={() => setHoveredId(tpl.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      'relative overflow-hidden rounded-xl border-2 text-left transition-all',
                      on && multiSelect
                        ? 'border-primary shadow-md'
                        : 'border-border bg-white hover:border-primary/40 hover:shadow-sm',
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden">
                      <TemplateThumbnail template={tpl} />

                      {/* Hover overlay — clock + days */}
                      <div
                        className={cn(
                          'absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-black/65 px-2.5 py-1.5 transition-opacity duration-150',
                          isHovered || inProgress ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        <Clock className="h-3 w-3 shrink-0 text-white/80" />
                        <p className="text-[11px] text-white/90">
                          {dueDate ? (
                            <span className="font-semibold text-amber-300">
                              Due {dueDate}
                            </span>
                          ) : (
                            `${tpl.turnaroundDays} days`
                          )}
                        </p>
                      </div>

                      {/* Multi-select checkmark */}
                      {multiSelect && on && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {/* Multi-select empty checkbox */}
                      {multiSelect && !on && (
                        <div className="absolute right-2 top-2 h-5 w-5 rounded-full border-2 border-white/80 bg-black/20" />
                      )}
                    </div>

                    {/* Card footer */}
                    <div
                      className={cn(
                        'px-2.5 py-2 border-t',
                        on && multiSelect ? 'bg-primary/5' : 'bg-white',
                      )}
                    >
                      <p className="text-[11px] font-semibold leading-tight truncate">
                        {tpl.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {tpl.agency}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Footer — only visible in multi-select mode */}
      {multiSelect && (
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => setMultiSelect(false)}>
            Cancel
          </Button>
          <Button onClick={onContinue} disabled={selected.length === 0}>
            {selected.length === 0
              ? 'Select templates'
              : `Continue with ${selected.length} template${selected.length !== 1 ? 's' : ''}`}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// ── S4/S5 Report Form ─────────────────────────────────────────

function FieldRow({
  field,
  value,
  aiFlag,
  onValueChange,
  onAiDraft,
}: {
  field: ReportField
  value: string
  aiFlag: boolean
  onValueChange: (v: string) => void
  onAiDraft: () => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <label className="text-sm font-medium">{field.label}</label>
        {field.source && (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-[11px]">
            From {field.source}
          </Badge>
        )}
        {field.stale && (
          <Badge className="gap-1 bg-amber-50 text-amber-700 hover:bg-amber-50 text-[11px]">
            <AlertTriangle className="h-2.5 w-2.5" />
            {field.staleMsg}
          </Badge>
        )}
        {field.restricted && (
          <Badge className="gap-1 bg-red-50 text-red-700 hover:bg-red-50 text-[11px]">
            <Lock className="h-2.5 w-2.5" />
            {field.restrictedMsg}
          </Badge>
        )}
        {aiFlag && (
          <Badge className="gap-1 bg-purple-50 text-purple-700 hover:bg-purple-50 text-[11px]">
            <Sparkles className="h-2.5 w-2.5" />
            AI-assisted
          </Badge>
        )}
      </div>

      {field.type === 'narrative' ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={
              field.aiDraftable
                ? "Click 'AI Draft' to generate, or write manually…"
                : 'Enter details…'
            }
            className={cn(
              'w-full resize-y rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-colors',
              'focus:border-primary focus:ring-1 focus:ring-primary',
              'min-h-[120px]',
            )}
          />
          {field.aiDraftable && (
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={onAiDraft}>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {aiFlag ? 'Redraft' : 'AI Draft'}
              </Button>
            </div>
          )}
          {aiFlag &&
            (
              AI_DRAFT_CITATIONS as Record<
                string,
                | Array<{ num: number; source: string; detail: string }>
                | undefined
              >
            )[field.id] && (
              <div className="mt-2 rounded-lg border bg-muted/30 px-3 py-2.5">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Sources
                </p>
                <div className="space-y-1">
                  {(
                    AI_DRAFT_CITATIONS as Record<
                      string,
                      | Array<{ num: number; source: string; detail: string }>
                      | undefined
                    >
                  )[field.id]!.map((c) => (
                    <div
                      key={c.num}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <sup className="mt-0.5 font-semibold text-primary">
                        {c.num}
                      </sup>
                      <span>
                        <span className="font-medium text-foreground">
                          {c.source}
                        </span>{' '}
                        —{' '}
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                        >
                          {c.detail}
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn(
            'w-full rounded-lg border px-3.5 py-2 text-sm outline-none transition-colors',
            'focus:border-primary focus:ring-1 focus:ring-primary',
            field.stale ? 'border-amber-300 bg-amber-50' : '',
          )}
        />
      )}
    </div>
  )
}

function SectionPanel({
  section,
  fieldValues,
  aiFlags,
  onValueChange,
  onAiDraft,
  onToggleReviewed,
  isReviewed,
}: {
  section: ReportSection
  fieldValues: Record<string, string>
  aiFlags: Record<string, boolean>
  onValueChange: (fieldId: string, v: string) => void
  onAiDraft: (fieldId: string) => void
  onToggleReviewed: (sectionId: string) => void
  isReviewed: boolean
}) {
  const isCounsellorSection = section.role === 'counsellor'
  const isPrincipalSection = section.role === 'principal'
  const isEditable = section.role === 'yh'

  const counsellorHasData =
    MOCK_COUNSELLOR.fields &&
    Object.keys(MOCK_COUNSELLOR.fields as Record<string, string>).length > 0

  const reviewToggle = (
    <Button
      variant={isReviewed ? 'secondary' : 'outline'}
      size="sm"
      onClick={() => onToggleReviewed(section.id)}
      className={cn(isReviewed && 'text-green-700')}
    >
      {isReviewed ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
          Verified
        </>
      ) : (
        <>Mark as verified</>
      )}
    </Button>
  )

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-lg font-semibold">{section.title}</h3>
        {isPrincipalSection && (
          <Badge className="gap-1 bg-purple-50 text-purple-700 hover:bg-purple-50">
            <Lock className="h-2.5 w-2.5" />
            To be completed by Principal
          </Badge>
        )}
        {isCounsellorSection && counsellorHasData && (
          <Badge className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-50">
            <Check className="h-2.5 w-2.5" />
            Completed by School Counsellor
          </Badge>
        )}
        {isCounsellorSection && !counsellorHasData && (
          <Badge className="gap-1 bg-amber-50 text-amber-700 hover:bg-amber-50">
            <Clock className="h-2.5 w-2.5" />
            Awaiting Counsellor
          </Badge>
        )}
      </div>

      {isPrincipalSection ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed py-10 text-center text-muted-foreground">
          <Lock className="h-5 w-5" />
          <p className="text-sm">
            This section will be available for the Principal during review.
          </p>
        </div>
      ) : isCounsellorSection ? (
        counsellorHasData ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                  <Check className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Completed by {MOCK_COUNSELLOR.name} ·{' '}
                    {MOCK_COUNSELLOR.completedAt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Read-only — submitted by School Counsellor
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {section.fields.map((f) => (
                  <div key={f.id}>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      {f.label}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {(MOCK_COUNSELLOR.fields as Record<string, string>)[
                        f.id
                      ] ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end border-t pt-4">{reviewToggle}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-amber-50/40 py-10 text-center">
            <Clock className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium">
              Awaiting input from School Counsellor
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* mock: send reminder */
              }}
            >
              Send reminder
            </Button>
          </div>
        )
      ) : isEditable ? (
        <div className="space-y-5">
          {section.fields.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              value={
                (fieldValues as Record<string, string | undefined>)[field.id] ??
                field.value ??
                ''
              }
              aiFlag={!!aiFlags[field.id]}
              onValueChange={(v) => onValueChange(field.id, v)}
              onAiDraft={() => onAiDraft(field.id)}
            />
          ))}
          <div className="flex justify-end border-t pt-4">{reviewToggle}</div>
        </div>
      ) : null}
    </div>
  )
}

function templateReferenceAsset(template: AgencyTemplate): {
  kind: 'pdf' | 'image'
  src: string
} | null {
  if (template.templateFile?.toLowerCase().endsWith('.pdf')) {
    return { kind: 'pdf', src: template.templateFile }
  }
  const img = templatePreviewImg(template)
  return img ? { kind: 'image', src: img } : null
}


function TemplateReferenceBody({
  template,
  scale,
}: {
  template: AgencyTemplate
  scale: number
}) {
  const asset = templateReferenceAsset(template)
  if (!asset) {
    return (
      <div
        style={{
          background: '#fff',
          width: 680,
          margin: '0 auto',
          padding: '80px 40px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#888',
          fontSize: 14,
        }}
      >
        No template preview available for {template.name}.
      </div>
    )
  }

  if (asset.kind === 'pdf') {
    return (
      <iframe
        src={`${asset.src}#toolbar=0&navpanes=0&view=FitH`}
        title={`${template.name} blank template`}
        style={{
          width: 720,
          height: 1000,
          border: 'none',
          margin: '0 auto',
          display: 'block',
          background: '#fff',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        }}
      />
    )
  }

  return (
    <img
      src={asset.src}
      alt={`${template.name} blank template`}
      style={{
        width: 720,
        maxWidth: '100%',
        display: 'block',
        margin: '0 auto',
        background: '#fff',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      }}
    />
  )
}

function DocumentPreview({
  template,
  scale,
  onScaleChange,
}: {
  template: AgencyTemplate
  scale: number
  onScaleChange: (s: number) => void
}) {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        background: PREVIEW_BG,
        padding: 20,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '0 4px',
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 650,
            color: '#555',
            letterSpacing: 0.5,
          }}
        >
          TEMPLATE REFERENCE — {template.name}
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 9.5, color: '#888' }}>Zoom</span>
          {PREVIEW_SCALES.map((s) => (
            <button
              key={s}
              onClick={() => onScaleChange(s)}
              style={{
                width: 32,
                height: 22,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'ui-monospace, monospace',
                background: scale === s ? '#1f2937' : '#fff',
                color: scale === s ? '#fff' : '#555',
              }}
            >
              {Math.round(s * 100)}%
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
        }}
      >
        <TemplateReferenceBody template={template} scale={scale} />
      </div>
    </div>
  )
}

function ReportForm({
  template,
  studentName,
  studentClass,
  onBack,
  onSubmitForReview,
}: {
  template: AgencyTemplate
  studentName: string
  studentClass: string
  onBack: () => void
  onSubmitForReview: () => void
}) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [aiFlags, setAiFlags] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState(template.sections[0].id)
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(),
  )
  const [previewOpen, setPreviewOpen] = useState(true)
  const [previewScale, setPreviewScale] = useState<number>(0.68)
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving'>('saved')

  const updateField = (id: string, v: string) => {
    setFieldValues((p) => ({ ...p, [id]: v }))
    setSavedStatus('saving')
    setTimeout(() => setSavedStatus('saved'), 800)
  }
  const aiDraft = (id: string) => {
    updateField(
      id,
      AI_DRAFTS[id] ??
        'Based on available case notes and TCI data, the student has shown consistent patterns…',
    )
    setAiFlags((p) => ({ ...p, [id]: true }))
  }
  const toggleReviewed = (sectionId: string) => {
    setCompletedSections((p) => {
      const next = new Set(p)
      if (next.has(sectionId)) {
        next.delete(sectionId)
        return next
      }
      next.add(sectionId)
      return next
    })
    if (!completedSections.has(sectionId)) {
      const idx = template.sections.findIndex((s) => s.id === sectionId)
      if (idx < template.sections.length - 1)
        setActiveSection(template.sections[idx + 1].id)
    }
  }
  const saveDraft = () => {
    setSavedStatus('saving')
    setTimeout(() => setSavedStatus('saved'), 500)
  }

  const currentSection =
    template.sections.find((s) => s.id === activeSection) ??
    template.sections[0]

  // Merged values: field defaults + counsellor mock + user edits
  const mergedValues: Record<string, string> = {}
  for (const section of template.sections) {
    for (const f of section.fields) {
      if (f.value) mergedValues[f.id] = f.value
    }
  }
  for (const [k, val] of Object.entries(
    (MOCK_COUNSELLOR.fields as Record<string, string>) ?? {},
  )) {
    mergedValues[k] = val
  }
  for (const [k, val] of Object.entries(fieldValues)) {
    if (val !== undefined && val !== '') mergedValues[k] = val
    else if (val === '') delete mergedValues[k]
  }

  // Completion %: fraction of non-principal fields with a non-empty value
  const allFields = template.sections
    .filter((s) => s.role !== 'principal')
    .flatMap((s) => s.fields)
  const filledCount = allFields.filter((f) => !!mergedValues[f.id]).length
  const completionPct = allFields.length
    ? Math.round((filledCount / allFields.length) * 100)
    : 0

  const reviewableSections = template.sections.filter(
    (s) => s.role !== 'principal',
  )
  const reviewedCount = reviewableSections.filter((s) =>
    completedSections.has(s.id),
  ).length

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border bg-white">
      {/* Form header */}
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5">
        <button
          onClick={onBack}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <AgencyIcon abbrev={template.abbrev} color={template.color} />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">{template.name}</span>
          <p className="text-xs text-muted-foreground truncate">
            {studentName} · {studentClass}
          </p>
        </div>

        {/* Completion % indicator */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-mono font-semibold tabular-nums',
              completionPct === 100 ? 'text-green-600' : 'text-foreground',
            )}
          >
            {completionPct}%
          </span>
          <div className="h-1 w-14 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full transition-all',
                completionPct === 100 ? 'bg-green-500' : 'bg-amber-500',
              )}
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {savedStatus === 'saving' ? (
            <>
              <RefreshCw className="h-3 w-3 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Check className="h-3 w-3 text-green-600" />
              Saved
            </>
          )}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={saveDraft}
          className="text-muted-foreground"
        >
          Save as draft
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewOpen((p) => !p)}
        >
          <PanelRight className="mr-1.5 h-3.5 w-3.5" />
          {previewOpen ? 'Hide' : 'Show'} Preview
        </Button>
        <Button size="sm" onClick={onSubmitForReview}>
          Submit for P Review
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left form panel: ~40% */}
        <div
          className="flex min-w-0 shrink-0 flex-col border-r"
          style={{ width: previewOpen ? '40%' : '100%', minWidth: 360 }}
        >
          {/* Progress chip */}
          <div className="flex shrink-0 items-center gap-2 border-b bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            <ListChecks className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">
              {reviewedCount} of {reviewableSections.length} sections verified
            </span>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Section nav */}
            <div className="w-44 shrink-0 overflow-y-auto border-r bg-muted/30 py-2">
              {template.sections.map((s) => {
                const active = s.id === activeSection
                const isPrincipal = s.role === 'principal'
                const isCounsellor = s.role === 'counsellor'
                const done = completedSections.has(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => !isPrincipal && setActiveSection(s.id)}
                    className={cn(
                      'flex w-full items-center gap-1.5 border-r-2 px-3 py-2 text-left text-sm transition-colors',
                      active
                        ? 'border-primary bg-white font-medium text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                      isPrincipal
                        ? 'cursor-default opacity-50'
                        : 'cursor-pointer',
                    )}
                  >
                    {done && (
                      <Check className="h-3 w-3 shrink-0 text-green-600" />
                    )}
                    {isCounsellor && !done && (
                      <Check className="h-3 w-3 shrink-0 text-blue-500" />
                    )}
                    {isPrincipal && !done && (
                      <Lock className="h-3 w-3 shrink-0" />
                    )}
                    <span className="flex-1 truncate">{s.title}</span>
                    {isPrincipal && (
                      <Badge className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-50 px-1">
                        P
                      </Badge>
                    )}
                    {isCounsellor && (
                      <Badge className="text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-50 px-1">
                        SC
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Form body */}
            <div className="flex-1 overflow-y-auto p-5">
              <SectionPanel
                section={currentSection}
                fieldValues={fieldValues}
                aiFlags={aiFlags}
                onValueChange={updateField}
                onAiDraft={aiDraft}
                onToggleReviewed={toggleReviewed}
                isReviewed={completedSections.has(currentSection.id)}
              />
            </div>
          </div>
        </div>

        {/* Right: static template reference */}
        {previewOpen && (
          <DocumentPreview
            template={template}
            scale={previewScale}
            onScaleChange={setPreviewScale}
          />
        )}
      </div>
    </div>
  )
}

// ── S6/S7 Review & Submit ─────────────────────────────────────

function ReviewSubmit({
  template,
  studentName,
  onBack,
  onSubmit,
}: {
  template: AgencyTemplate
  studentName: string
  onBack: () => void
  onSubmit: () => void
}) {
  const [note, setNote] = useState('')
  const asset = templateReferenceAsset(template)

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border bg-white">
      <div className="flex shrink-0 items-center gap-3 border-b px-5 py-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate">Review &amp; Submit</h2>
          <p className="text-xs text-muted-foreground truncate">
            {template.name} · {studentName}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to form
        </Button>
        <Button size="sm" onClick={onSubmit}>
          Submit for Principal Review
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Full-width document preview */}
        <div
          className="flex-1 overflow-auto"
          style={{ background: PREVIEW_BG, padding: 24 }}
        >
          {asset?.kind === 'pdf' ? (
            <iframe
              src={`${asset.src}#toolbar=0&navpanes=0&view=FitH`}
              title={`${template.name} blank template`}
              style={{
                width: '100%',
                maxWidth: 820,
                height: '100%',
                minHeight: 900,
                border: 'none',
                margin: '0 auto',
                display: 'block',
                background: '#fff',
                boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
              }}
            />
          ) : asset?.kind === 'image' ? (
            <img
              src={asset.src}
              alt={`${template.name} blank template`}
              style={{
                width: '100%',
                maxWidth: 820,
                display: 'block',
                margin: '0 auto',
                background: '#fff',
                boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
              }}
            />
          ) : (
            <div className="rounded-lg bg-white p-10 text-center text-sm text-muted-foreground">
              No template preview available.
            </div>
          )}
        </div>

        {/* Sidebar: compact checklist + Note to Principal */}
        <aside className="w-80 shrink-0 overflow-y-auto border-l bg-white">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Completion checklist</h3>
          </div>
          <div className="divide-y">
            {template.sections.map((s) => (
              <div key={s.id} className="flex items-center gap-2 px-4 py-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                  {s.role === 'yh' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : s.role === 'principal' ? (
                    <Lock className="h-3 w-3 text-purple-500" />
                  ) : (
                    <Check className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                <span className="flex-1 truncate text-xs">{s.title}</span>
                {s.role === 'yh' && (
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-50 text-[10px] px-1.5">
                    Done
                  </Badge>
                )}
                {s.role === 'principal' && (
                  <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 text-[10px] px-1.5">
                    P
                  </Badge>
                )}
                {s.role === 'counsellor' && (
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-[10px] px-1.5">
                    SC
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t p-4">
            <label
              htmlFor="note-to-principal"
              className="block text-sm font-semibold"
            >
              Note to Principal{' '}
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <p className="text-xs text-muted-foreground">
              Flag anything specific before they review.
            </p>
            <textarea
              id="note-to-principal"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Counselling details needed in Section 5. Housing info may be outdated."
              className="min-h-[100px] w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

// ── S8 Submitted Status (replaces PrincipalReview) ────────────

function SubmittedStatus({
  template,
  studentName,
  onDownload,
}: {
  template: AgencyTemplate
  studentName: string
  onDownload: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
        <Clock className="h-7 w-7 text-amber-600" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">
          Submitted for Principal Review
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {template.name} · {studentName}
        </p>
      </div>
      <div className="w-full max-w-sm rounded-xl border bg-white p-5 text-left">
        <div className="flex items-center gap-3">
          <AgencyIcon abbrev={template.abbrev} color={template.color} />
          <div className="flex-1">
            <Badge className="gap-1 bg-amber-50 text-amber-700 hover:bg-amber-50">
              <Clock className="h-3 w-3" />
              Pending Principal Review
            </Badge>
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted 20 Apr 2026. You'll be notified once approved.
            </p>
          </div>
        </div>
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        Once the Principal has reviewed and approved the report, you can
        download and send it.
      </p>
      <Button onClick={onDownload}>
        Continue to Export
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}

// ── S10 Export & Password ─────────────────────────────────────

function ExportPassword({
  template,
  studentName,
  onBack,
  onDownload,
}: {
  template: AgencyTemplate
  studentName: string
  onBack: () => void
  onDownload: () => void
}) {
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Export Report</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {template.name} · {studentName}
          </p>
        </div>
        <Badge className="gap-1 bg-green-50 text-green-700 hover:bg-green-50">
          <Check className="h-3 w-3" /> Approved
        </Badge>
      </div>

      {/* PDF thumbnail */}
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 py-8">
        <div className="flex h-28 w-20 items-center justify-center rounded border bg-white shadow">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium">{template.name}.pdf</p>
        <p className="text-sm text-muted-foreground">
          {template.pages} pages · Password protected
        </p>
      </div>

      {/* Password protect this report */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Password protect this report</span>
          <Badge className="ml-1 gap-1 bg-purple-50 text-purple-700 hover:bg-purple-50 text-[11px]">
            <Lock className="h-2.5 w-2.5" />
            YH, DM &amp; SLs only
          </Badge>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="report-password"
            className="block text-sm font-medium"
          >
            Enter a password for this PDF.
          </label>
          <div className="flex items-center gap-2">
            <input
              id="report-password"
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter password"
              className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPw((p) => !p)}
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showPw ? 'Hide' : 'Show'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            TW will remember this password for future reference.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button className="flex-1" onClick={onDownload}>
          <Download className="mr-1.5 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}

// ── S11 Confirmation ──────────────────────────────────────────

function Confirmation({
  template,
  studentName,
  studentId,
  onStartNext,
}: {
  template: AgencyTemplate
  studentName: string
  studentId: string
  onStartNext: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold">
          Report Exported &amp; Archived
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {template.name} for {studentName}
        </p>
      </div>
      <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
        <Button onClick={onStartNext} className="w-full justify-center">
          Start next report
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button variant="outline" className="w-full justify-center" asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Open case in Case Sync
          </a>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center text-muted-foreground"
          render={<Link to="/students/$id" params={{ id: studentId }} />}
        >
          Return to student profile
        </Button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

function AgencyReportWizardPage() {
  const { student } = Route.useLoaderData()
  const navigate = useNavigate()

  const [step, setStep] = useState<WizardStep>('templates')
  const [selectedTemplates, setSelectedTemplates] = useState<Array<string>>([])

  useSetBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Profile', href: '/students' },
    { label: student.name, href: `/students/${student.id}` },
    {
      label: 'New Agency Report',
      href: `/students/${student.id}/agency-report/new`,
    },
  ])

  const toggleTemplate = (id: string) =>
    setSelectedTemplates((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    )

  const activeTemplate =
    AGENCY_TEMPLATES.find((t) => t.id === selectedTemplates[0]) ??
    AGENCY_TEMPLATES[0]

  const showStepBar = step !== 'done'

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Mini top bar */}
      <div className="flex items-center gap-2 border-b bg-white px-5 py-2.5">
        <span className="text-sm font-semibold text-primary">
          Teacher Workspace
        </span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
          Beta
        </span>
        <div className="flex-1" />
        <span className="text-sm text-muted-foreground">Student Insights</span>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">{student.name}</span>
        {step !== 'templates' && (
          <>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">Agency Report</span>
          </>
        )}
      </div>

      {showStepBar && <StepBar step={step} />}

      <main
        className={cn(
          'mx-auto w-full flex-1 py-6',
          step === 'form' || step === 'review'
            ? 'max-w-full px-6'
            : step === 'templates'
              ? 'max-w-5xl px-6'
              : 'max-w-2xl px-5',
        )}
      >
        {step === 'templates' && (
          <TemplateSelection
            studentName={student.name}
            studentClass={student.class}
            studentId={student.id}
            selected={selectedTemplates}
            onToggle={toggleTemplate}
            onSelectAndContinue={(id) => {
              setSelectedTemplates([id])
              setStep('form')
            }}
            onBack={() =>
              navigate({ to: '/students/$id', params: { id: student.id } })
            }
            onContinue={() => setStep('form')}
          />
        )}

        {step === 'form' && (
          <ReportForm
            template={activeTemplate}
            studentName={student.name}
            studentClass={student.class}
            onBack={() => setStep('templates')}
            onSubmitForReview={() => setStep('review')}
          />
        )}

        {step === 'review' && (
          <ReviewSubmit
            template={activeTemplate}
            studentName={student.name}
            onBack={() => setStep('form')}
            onSubmit={() => setStep('submitted')}
          />
        )}

        {step === 'submitted' && (
          <SubmittedStatus
            template={activeTemplate}
            studentName={student.name}
            onDownload={() => setStep('export')}
          />
        )}

        {step === 'export' && (
          <ExportPassword
            template={activeTemplate}
            studentName={student.name}
            onBack={() => setStep('submitted')}
            onDownload={() => setStep('done')}
          />
        )}

        {step === 'done' && (
          <Confirmation
            template={activeTemplate}
            studentName={student.name}
            studentId={student.id}
            onStartNext={() => {
              setSelectedTemplates(['nuh'])
              setStep('form')
            }}
          />
        )}
      </main>
    </div>
  )
}
