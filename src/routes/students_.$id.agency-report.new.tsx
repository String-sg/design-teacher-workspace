import { useState } from 'react'
import { Link, createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Lock,
  MessageSquare,
  PanelRight,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getStudentById } from '@/data/mock-students'
import {
  AGENCY_TEMPLATES,
  AI_DRAFTS,
  DATA_SOURCES,
  type AgencyTemplate,
  type DataSource,
  type ReportField,
  type ReportSection,
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

type WizardStep = 'templates' | 'sources' | 'form' | 'review' | 'p-review' | 'export' | 'done'

// ── Step bar ──────────────────────────────────────────────────

const STEP_LABELS = ['Template', 'Sources', 'Fill Report', 'P Review', 'Export']
const STEP_MAP: Record<WizardStep, number> = {
  templates: 0,
  sources: 1,
  form: 2,
  review: 2,
  'p-review': 3,
  export: 4,
  done: 4,
}

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
                i === cur ? 'font-semibold text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={cn('mx-2 h-0.5 w-6 shrink-0', i < cur ? 'bg-green-500' : 'bg-border')} />
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

// ── S2 Template Selection ─────────────────────────────────────

function TemplateSelection({
  studentName,
  studentClass,
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  studentName: string
  studentClass: string
  selected: string[]
  onToggle: (id: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="space-y-5">
      <StudentBar name={studentName} studentClass={studentClass} inProgress={1} />

      <div>
        <h2 className="text-xl font-semibold">Select Agency Template(s)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose one or more templates. Reports are completed sequentially — shared data carries across.
        </p>
      </div>

      <div className="space-y-3">
        {AGENCY_TEMPLATES.map((tpl) => {
          const on = selected.includes(tpl.id)
          const pct = Math.round((tpl.autoFilled / tpl.totalFields) * 100)
          return (
            <button
              key={tpl.id}
              onClick={() => onToggle(tpl.id)}
              className={cn(
                'w-full rounded-xl border-2 p-5 text-left transition-all',
                on ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/40',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
                    on ? 'border-primary bg-primary' : 'border-border bg-transparent',
                  )}
                >
                  {on && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: tpl.id === 'cps' ? '#dc2626' : '#2563eb' }}
                    />
                    <span className="font-semibold">{tpl.name}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{tpl.agency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{tpl.totalFields} fields</p>
                  <p className="text-xs text-green-600">~{tpl.autoFilled} auto-filled</p>
                </div>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tpl.pages} pages</span>
                <span>·</span>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Preview blank template
                </button>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} render={<Link to="/students/$id" params={{ id: '' }} />}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={onContinue} disabled={selected.length === 0}>
          Continue with {selected.length} template{selected.length !== 1 ? 's' : ''}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ── S3 Source Selection ───────────────────────────────────────

function SourceSelection({
  sources,
  onToggle,
  onBack,
  onContinue,
}: {
  sources: DataSource[]
  onToggle: (id: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select which data sources to pull from. Uncheck any you'd like to skip.
        </p>
      </div>

      <div className="space-y-2">
        {sources.map((src) => (
          <button
            key={src.id}
            onClick={() => onToggle(src.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all',
              src.checked ? 'border-green-400 bg-green-50' : 'border-border bg-white hover:border-border/60',
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2',
                src.checked ? 'border-green-500 bg-green-500' : 'border-border bg-transparent',
              )}
            >
              {src.checked && <Check className="h-3 w-3 text-white" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{src.name}</p>
              <p className="text-xs text-muted-foreground">{src.desc}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Last synced</p>
              <p>{src.lastSync}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center text-muted-foreground">
        <Upload className="h-5 w-5" />
        <p className="text-sm font-medium">Upload additional documents</p>
        <p className="text-xs">External assessments, parent correspondence, previous reports</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Housing data (School Cockpit) was last updated 14 months ago — please verify during review.</span>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onContinue}>
          Pull data & begin
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
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
            placeholder={field.aiDraftable ? "Click 'AI Draft' to generate, or write manually…" : 'Enter details…'}
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
              {aiFlag && (
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  View sources used
                </Button>
              )}
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
  onMarkComplete,
  isComplete,
}: {
  section: ReportSection
  fieldValues: Record<string, string>
  aiFlags: Record<string, boolean>
  onValueChange: (fieldId: string, v: string) => void
  onAiDraft: (fieldId: string) => void
  onMarkComplete: (sectionId: string) => void
  isComplete: boolean
}) {
  const locked = section.role !== 'yh'

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-lg font-semibold">{section.title}</h3>
        {locked && (
          <Badge
            className={cn(
              'gap-1',
              section.role === 'principal'
                ? 'bg-purple-50 text-purple-700 hover:bg-purple-50'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-50',
            )}
          >
            <Lock className="h-2.5 w-2.5" />
            To be completed by {section.role === 'principal' ? 'Principal' : 'School Counsellor'}
          </Badge>
        )}
      </div>

      {locked ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed py-10 text-center text-muted-foreground">
          <Lock className="h-5 w-5" />
          <p className="text-sm">
            This section will be available for the{' '}
            {section.role === 'principal' ? 'Principal' : 'School Counsellor'} during review.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {section.fields.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              value={fieldValues[field.id] ?? field.value ?? ''}
              aiFlag={!!aiFlags[field.id]}
              onValueChange={(v) => onValueChange(field.id, v)}
              onAiDraft={() => onAiDraft(field.id)}
            />
          ))}
          <div className="flex justify-end border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => onMarkComplete(section.id)} disabled={isComplete}>
              {isComplete ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
                  Completed
                </>
              ) : (
                <>
                  Mark complete
                  <Check className="ml-1.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function PdfPreview({ template, onClose }: { template: AgencyTemplate; onClose: () => void }) {
  return (
    <div className="flex h-full flex-col border-l bg-gray-50">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
        <span className="text-sm font-semibold">PDF Preview</span>
        <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {Array.from({ length: template.pages }).map((_, p) => (
          <div
            key={p}
            className="mb-3 flex flex-col rounded border bg-white p-2.5 shadow-sm"
            style={{ aspectRatio: '0.707' }}
          >
            <p className="mb-1 text-[6px] font-bold uppercase tracking-wide text-muted-foreground">
              {template.agency}
            </p>
            <p className="mb-2 text-[5px] text-muted-foreground">Page {p + 1}</p>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mb-1 flex gap-1">
                <div className="h-[3px] w-[30%] rounded-full bg-border/60" />
                <div
                  className={cn(
                    'h-[3px] flex-1 rounded-full',
                    p < 2 ? 'bg-indigo-200' : 'bg-border/60',
                  )}
                />
              </div>
            ))}
          </div>
        ))}
        <p className="text-center text-[10px] text-muted-foreground">Updates as you fill the form</p>
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
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [previewOpen, setPreviewOpen] = useState(true)

  const updateField = (id: string, v: string) => setFieldValues((p) => ({ ...p, [id]: v }))
  const aiDraft = (id: string) => {
    updateField(id, AI_DRAFTS[id] ?? 'Based on available case notes and TCI data, the student has shown consistent patterns…')
    setAiFlags((p) => ({ ...p, [id]: true }))
  }
  const markComplete = (sectionId: string) => {
    setCompletedSections((p) => new Set([...p, sectionId]))
    const idx = template.sections.findIndex((s) => s.id === sectionId)
    if (idx < template.sections.length - 1) setActiveSection(template.sections[idx + 1].id)
  }

  const currentSection = template.sections.find((s) => s.id === activeSection) ?? template.sections[0]

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-xl border bg-white">
      {/* Form header */}
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5">
        <button onClick={onBack} className="rounded p-1 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: template.id === 'cps' ? '#dc2626' : '#2563eb' }}
            />
            <span className="font-semibold">{template.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {studentName} · {studentClass}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPreviewOpen((p) => !p)}>
          <PanelRight className="mr-1.5 h-3.5 w-3.5" />
          {previewOpen ? 'Hide' : 'Show'} Preview
        </Button>
        <Button size="sm" onClick={onSubmitForReview}>
          Submit for P Review
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Section nav */}
        <div className="w-48 shrink-0 overflow-y-auto border-r bg-muted/30 py-2">
          {template.sections.map((s) => {
            const active = s.id === activeSection
            const locked = s.role !== 'yh'
            const done = completedSections.has(s.id)
            return (
              <button
                key={s.id}
                onClick={() => !locked && setActiveSection(s.id)}
                className={cn(
                  'flex w-full items-center gap-1.5 border-r-2 px-4 py-2 text-left text-sm transition-colors',
                  active ? 'border-primary bg-white font-medium text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                  locked ? 'cursor-default opacity-50' : 'cursor-pointer',
                )}
              >
                {done && <Check className="h-3 w-3 shrink-0 text-green-600" />}
                {locked && !done && <Lock className="h-3 w-3 shrink-0" />}
                <span className="flex-1 truncate">{s.title}</span>
                {s.role === 'principal' && (
                  <Badge className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-50 px-1">P</Badge>
                )}
                {s.role === 'counsellor' && (
                  <Badge className="text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-50 px-1">SC</Badge>
                )}
              </button>
            )
          })}
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto p-6">
          <SectionPanel
            section={currentSection}
            fieldValues={fieldValues}
            aiFlags={aiFlags}
            onValueChange={updateField}
            onAiDraft={aiDraft}
            onMarkComplete={markComplete}
            isComplete={completedSections.has(currentSection.id)}
          />
        </div>

        {/* PDF preview */}
        {previewOpen && (
          <div className="w-56 shrink-0">
            <PdfPreview template={template} onClose={() => setPreviewOpen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── S6/S7 Review & Submit ─────────────────────────────────────

const STATUS_ICONS: Record<string, React.ReactNode> = {
  complete: <Check className="h-3.5 w-3.5 text-green-600" />,
  locked: <Lock className="h-3.5 w-3.5 text-purple-500" />,
  locked_sc: <Lock className="h-3.5 w-3.5 text-blue-500" />,
}

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review & Submit</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {template.name} · {studentName}
        </p>
      </div>

      {/* Completion checklist */}
      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-3">
          <h3 className="font-semibold">Completion checklist</h3>
        </div>
        <div className="divide-y">
          {template.sections.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                {s.role === 'yh'
                  ? STATUS_ICONS.complete
                  : s.role === 'principal'
                    ? STATUS_ICONS.locked
                    : STATUS_ICONS.locked_sc}
              </div>
              <span className="flex-1 text-sm">{s.title}</span>
              {s.role === 'yh' && (
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>
              )}
              {s.role === 'principal' && (
                <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50">Awaiting Principal</Badge>
              )}
              {s.role === 'counsellor' && (
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">Awaiting Counsellor</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note to Principal */}
      <div className="rounded-xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold">Note to Principal (optional)</h3>
        <p className="text-sm text-muted-foreground">
          Flag anything specific for the Principal's attention before they review.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Counselling details needed in Section 5. Housing info may be outdated."
          className="w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px]"
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to form
        </Button>
        <Button onClick={onSubmit}>
          Submit for Principal Review
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ── S8 Principal Review ───────────────────────────────────────

function PrincipalReview({
  template,
  studentName,
  onRequestRevisions,
  onApprove,
}: {
  template: AgencyTemplate
  studentName: string
  onRequestRevisions: () => void
  onApprove: () => void
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Principal Review</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {template.name} · {studentName}
          </p>
        </div>
        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Pending Review</Badge>
      </div>

      <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <strong>Note from YH (Mrs. Tan Mei Lin):</strong> Counselling details needed in Section 5. Housing info may be outdated.
      </div>

      <div className="space-y-3">
        {template.sections.map((s) => (
          <div key={s.id} className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <h4 className="flex-1 font-semibold">{s.title}</h4>
              {s.role === 'yh' && (
                <Badge className="gap-1 bg-green-50 text-green-700 hover:bg-green-50">
                  <Check className="h-3 w-3" /> Completed by YH
                </Badge>
              )}
              {s.role === 'principal' && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Your input needed</Badge>
              )}
              {s.role === 'counsellor' && (
                <Badge className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <Lock className="h-3 w-3" /> Awaiting Counsellor
                </Badge>
              )}
            </div>

            {s.role === 'yh' && (
              <div className="space-y-0 opacity-80">
                {s.fields.slice(0, 3).map((f) => (
                  <div key={f.id} className="flex border-b py-2 text-sm last:border-0">
                    <span className="w-2/5 text-muted-foreground">{f.label}</span>
                    <span className="flex-1 font-medium">{f.value || '—'}</span>
                  </div>
                ))}
                {s.fields.length > 3 && (
                  <p className="pt-1 text-xs text-muted-foreground">+ {s.fields.length - 3} more fields</p>
                )}
                <div className="pt-3">
                  <Button variant="ghost" size="sm" className="h-7 text-muted-foreground">
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    Add comment
                  </Button>
                </div>
              </div>
            )}

            {s.role === 'principal' &&
              s.fields.map((f) => (
                <div key={f.id} className="mb-3 last:mb-0">
                  <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                  <textarea
                    placeholder="Enter your remarks…"
                    className="w-full min-h-[80px] resize-y rounded-lg border-2 border-primary bg-primary/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}

            {s.role === 'counsellor' && (
              <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed py-8 text-center text-muted-foreground">
                <Lock className="h-4 w-4" />
                <p className="text-sm">Awaiting School Counsellor input</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t pt-5">
        <Button
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-700"
          onClick={onRequestRevisions}
        >
          Request Revisions
        </Button>
        <div className="flex-1" />
        <Button className="bg-green-600 hover:bg-green-700" onClick={onApprove}>
          <Check className="mr-1.5 h-4 w-4" />
          Approve
        </Button>
      </div>
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
        <p className="text-sm text-muted-foreground">{template.pages} pages · Password protected</p>
      </div>

      {/* Password management */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Password Management</span>
          <Badge className="ml-1 gap-1 bg-purple-50 text-purple-700 hover:bg-purple-50 text-[11px]">
            <Lock className="h-2.5 w-2.5" />
            YH, DM &amp; SLs only
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-32 shrink-0 text-sm text-muted-foreground">Password on file:</span>
          <input
            type={showPw ? 'text' : 'password'}
            defaultValue="CPS2026Jun"
            className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Button variant="ghost" size="sm" onClick={() => setShowPw((p) => !p)}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPw ? 'Hide' : 'Show'}
          </Button>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" defaultChecked className="accent-primary" />
          Save for future reports to {template.agency}
        </label>
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
        <h2 className="text-2xl font-semibold">Report Exported &amp; Archived</h2>
        <p className="mt-1 text-sm text-muted-foreground">{template.name} for {studentName}</p>
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        After emailing to {template.agency}, mark this report as 'Sent' to update the status.
      </p>

      <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
        <Button onClick={onStartNext} className="w-full justify-center">
          Start next report (NUH Referral)
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
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [sources, setSources] = useState<DataSource[]>(DATA_SOURCES)

  useSetBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Profile', href: '/students' },
    { label: student.name, href: `/students/${student.id}` },
    { label: 'New Agency Report', href: `/students/${student.id}/agency-report/new` },
  ])

  const toggleTemplate = (id: string) =>
    setSelectedTemplates((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const toggleSource = (id: string) =>
    setSources((p) => p.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)))

  const activeTemplate =
    AGENCY_TEMPLATES.find((t) => t.id === selectedTemplates[0]) ?? AGENCY_TEMPLATES[0]

  const showStepBar = step !== 'done'

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Mini top bar */}
      <div className="flex items-center gap-2 border-b bg-white px-5 py-2.5">
        <span className="text-sm font-semibold text-primary">Teacher Workspace</span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">Beta</span>
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
          step === 'form' ? 'max-w-full px-6' : 'max-w-2xl px-5',
        )}
      >
        {step === 'templates' && (
          <TemplateSelection
            studentName={student.name}
            studentClass={student.class}
            selected={selectedTemplates}
            onToggle={toggleTemplate}
            onBack={() => navigate({ to: '/students/$id', params: { id: student.id } })}
            onContinue={() => setStep('sources')}
          />
        )}

        {step === 'sources' && (
          <SourceSelection
            sources={sources}
            onToggle={toggleSource}
            onBack={() => setStep('templates')}
            onContinue={() => setStep('form')}
          />
        )}

        {step === 'form' && (
          <ReportForm
            template={activeTemplate}
            studentName={student.name}
            studentClass={student.class}
            onBack={() => setStep('sources')}
            onSubmitForReview={() => setStep('review')}
          />
        )}

        {step === 'review' && (
          <ReviewSubmit
            template={activeTemplate}
            studentName={student.name}
            onBack={() => setStep('form')}
            onSubmit={() => setStep('p-review')}
          />
        )}

        {step === 'p-review' && (
          <PrincipalReview
            template={activeTemplate}
            studentName={student.name}
            onRequestRevisions={() => setStep('form')}
            onApprove={() => setStep('export')}
          />
        )}

        {step === 'export' && (
          <ExportPassword
            template={activeTemplate}
            studentName={student.name}
            onBack={() => setStep('p-review')}
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
