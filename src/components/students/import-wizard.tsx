import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  List,
  MessageSquareText,
  Plus,
  Settings2,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// ─── Mock data ──────────────────────────────────────────────────────────────

const INCOMING_FIELDS = [
  { id: 'via_missed', name: 'VIA missed' },
  { id: 'next_steps', name: 'Next steps' },
  { id: 'teacher_remarks', name: "Teacher's remarks" },
]

const MOCK_REVIEW_ROWS = [
  { row: 1, name: 'Chan Jun Kai', class: '3A', viaMissed: '2', nextSteps: 'Schedule a one-on-one session', teacherRemarks: 'Absent for 3 consecutive VIA sessions without valid reason' },
  { row: 2, name: 'Vincent Koh Kin Yi', class: '3A', viaMissed: '3', nextSteps: 'Watch the recorded session', teacherRemarks: 'No visible effort to make up missed sessions' },
  { row: 3, name: 'Lam Wei Jie', class: '3A', viaMissed: '7', nextSteps: 'Join the upcoming cohort', teacherRemarks: 'Missing most sessions, needs immediate intervention' },
  { row: 4, name: 'Sarah Chan Jun Kai', class: '3A', viaMissed: '5', nextSteps: 'Review the VIA schedule', teacherRemarks: 'Absent without prior notice on multiple occasions' },
  { row: 5, name: 'Kenneth Koh Kin Yi', class: '3A', viaMissed: '6', nextSteps: 'Attend the supplementary class', teacherRemarks: 'No sign of engagement in VIA activities this term' },
  { row: 6, name: 'Liang Mei Jie', class: '3A', viaMissed: '1', nextSteps: 'Complete an online module', teacherRemarks: 'Medical leave accounted for; follow up on make-up session' },
  { row: 7, name: 'Diana Tan Hui Lin', class: '3A', viaMissed: '5', nextSteps: 'Arrange a peer tutoring session', teacherRemarks: 'No valid reasons provided for absences' },
  { row: 8, name: 'Samuel Tan Jun Kai', class: '3A', viaMissed: '3', nextSteps: 'Participate in a future cohort', teacherRemarks: 'Missing sessions due to CCA clashes; monitor closely' },
  { row: 9, name: 'Priya Nair', class: '3A', viaMissed: '2', nextSteps: 'Submit a set of reflection notes', teacherRemarks: 'Absent on days with no prior communication' },
  { row: 10, name: 'Ethan Ong Wei Ming', class: '3A', viaMissed: '1', nextSteps: 'Access additional resources', teacherRemarks: 'Absent once; parent informed and acknowledged' },
]

const REVIEW_ISSUES = [
  {
    id: 'not-found',
    title: 'Names not found in MOE records',
    description: 'Check names match the School Cockpit format.',
    ref: 'Row 5, 6, 8',
    highlightRows: [5, 6, 8],
  },
  {
    id: 'duplicate',
    title: 'Duplicate records',
    description: 'Remove repeated records',
    ref: 'Row 3 and 100, 5 and 8',
    highlightRows: [3, 5, 8],
  },
  {
    id: 'same-name-class',
    title: 'Same name and class',
    description: 'If these are different students, add their NRIC in a separate column',
    ref: 'Row 2 and 3',
    highlightRows: [2, 3],
  },
  {
    id: 'dup-cols',
    title: 'Duplicate columns',
    description: 'Remove or rename repeated columns',
    ref: 'Column 0 and H, I and J',
    highlightRows: [],
  },
  {
    id: 'col-exists',
    title: 'Column header already exist',
    description: 'Rename the column',
    ref: 'Column F',
    highlightRows: [],
  },
]

const DEFAULT_CATEGORIES = [
  'Academics',
  'Attendance',
  'Behaviour',
  'Wellbeing',
  'Family',
  'Personal',
]

const EXISTING_FIELDS_MAP: Record<string, Array<string>> = {
  Academics: [
    'Overall % across selected subjects',
    'No. of subjects',
    'Learning support',
  ],
  Attendance: ['Attendance(%)', 'Late-coming(%)', 'Non-VR absences(%)'],
  Behaviour: ['Offences', 'Counselling cases', 'Conduct grade'],
  Wellbeing: ['Social links', 'Risk indicators', 'Low mood flagged 2+ terms'],
  Family: ['FAS', 'Housing', 'Custody'],
  Personal: ['Health alerts', 'Citizenship', 'Language spoken'],
}

const STEP1_UPLOAD_ERRORS = [
  'File cannot be processed for security reasons',
  'Unsupported file format. Upload a .xlsx, .xls, or .xls file',
  'File has more than 1,000 columns',
  'First row must contain headers',
  'File must include a "Name" column matching the format used in School Cockpit',
  'Missing headers for column 0 and V',
]

// ─── Types ──────────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4

interface FieldState {
  // 'unset' | 'selected' | 'skipped' | 'creating'
  mode: 'unset' | 'selected' | 'skipped' | 'creating'
  selected: string | null
  newValue: string
  newError: string
}

function makeFieldState(): FieldState {
  return { mode: 'unset', selected: null, newValue: '', newError: '' }
}

// ─── Wizard stepper ──────────────────────────────────────────────────────────

const WIZARD_STEPS = ['Upload', 'Review', 'Organise'] as const

function WizardStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {WIZARD_STEPS.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === current
        const isCompleted = stepNum < current
        const isDimmed = stepNum > current

        return (
          <div key={label} className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                  (isActive || isCompleted) &&
                    'bg-primary text-primary-foreground',
                  isDimmed && 'border border-slate-300 text-slate-400',
                )}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={cn(
                  'text-sm',
                  isActive && 'font-medium text-slate-700',
                  isCompleted && 'font-medium text-slate-500',
                  isDimmed && 'text-slate-400',
                )}
              >
                {label}
              </span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div className="h-px w-6 bg-slate-200" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── DropZone ───────────────────────────────────────────────────────────────

function DropZone({
  onFileAccepted,
}: {
  onFileAccepted: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileAccepted(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex h-full min-h-[320px] w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed transition-colors',
        isDragging
          ? 'border-blue-400 bg-blue-100/60'
          : 'border-blue-300 bg-blue-50/60 hover:border-blue-400 hover:bg-blue-50',
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Upload className="h-5 w-5 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-800">
          Drop your files here or{' '}
          <span className="text-primary underline underline-offset-2">
            browse
          </span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Supported file types: .csv, .xls, .xlsx
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileAccepted(file)
        }}
      />
    </div>
  )
}

// ─── Step 1 ─────────────────────────────────────────────────────────────────

function Step1({
  hasError,
  onFileAccepted,
}: {
  hasError: boolean
  onFileAccepted: (file: File) => void
}) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-8 pb-6 pt-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Upload student data
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add your own data for a more complete student view
        </p>
      </div>

      <div className="flex flex-1 gap-6 px-8 pb-8">
        {/* Left panel */}
        <div className="flex w-[340px] shrink-0 flex-col gap-4">
          {hasError && (
            <Alert className="rounded-3xl border-[var(--slate-6)] bg-white [&>svg]:text-[var(--crimson-11)]">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold text-[var(--crimson-11)]">
                File upload failed
              </AlertTitle>
              <AlertDescription className="text-[var(--slate-12)]">
                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                  {STEP1_UPLOAD_ERRORS.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {/* Prepare your file */}
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4">
            <p className="mb-3 text-base font-semibold text-slate-600">
              Prepare your file
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="h-4 w-4 shrink-0 text-slate-400" />
                <span>
                  Use our{' '}
                  <a className="cursor-pointer text-twblue-9 underline underline-offset-2">
                    template
                  </a>
                  , or check your{' '}
                  <a className="cursor-pointer text-twblue-9 underline underline-offset-2">
                    file is ready
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="h-4 w-4 shrink-0 text-slate-400" />
                File is a spreadsheet (.csv, .xls, .xlsx)
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="h-4 w-4 shrink-0 text-slate-400" />
                File is not password-protected
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-slate-4)] pt-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />
              <p className="text-sm text-slate-400">
                We'll check your file before importing
              </p>
            </div>
          </div>

          {/* Required columns */}
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4">
            <p className="mb-3 text-base font-semibold text-slate-600">
              Required columns
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-600">Name and Class</p>
                  <p className="text-xs text-slate-500">
                    As shown in School Cockpit
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-600">Or NRIC</p>
                  <p className="text-xs text-slate-500">
                    As shown in School Cockpit
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently uploaded */}
          <div className="px-2">
            <p className="mb-3 text-sm text-slate-500">Frequently uploaded</p>
            <ul className="space-y-2">
              {[
                {
                  icon: MessageSquareText,
                  label: "Teacher's remarks",
                  desc: 'Observations and interactions',
                },
                {
                  icon: List,
                  label: 'Follow-up notes',
                  desc: 'Next steps and actions',
                },
                {
                  icon: Award,
                  label: 'Awards and enrichment',
                  desc: 'Programmes, enrichment activities, awards',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      {label}
                    </p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col">
          <DropZone onFileAccepted={onFileAccepted} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 2 ─────────────────────────────────────────────────────────────────

function Step2({
  hasIssues,
  onBack,
  onNext,
}: {
  hasIssues: boolean
  onBack: () => void
  onNext: () => void
}) {
  const issueRows = new Set(REVIEW_ISSUES.flatMap((i) => i.highlightRows))

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 pb-2 pt-8">
          <h1 className="text-2xl font-semibold text-slate-900">Review</h1>
          <Badge variant="outline" className="mt-6 border-transparent bg-[var(--color-slate-3)] text-[var(--color-slate-11)] text-sm">1023 records, 5 columns</Badge>
        </div>

        <div className="flex items-start gap-4 px-8 pb-6">
          {/* Table — horizontal scroll only, shows all 10 rows */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="overflow-hidden rounded-2xl border bg-white">
              <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:border-t [&::-webkit-scrollbar]:border-[var(--color-slate-6)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-slate-5)] [&::-webkit-scrollbar-track]:ml-4 [&::-webkit-scrollbar-track]:mr-4 [&::-webkit-scrollbar-track]:rounded-full">
                <Table>
                  <TableHeader className="bg-[var(--color-slate-2)]">
                    <TableRow className="hover:bg-[var(--color-slate-2)]">
                      <TableHead className="w-10 text-center text-base font-semibold text-[var(--color-slate-11)]">#</TableHead>
                      <TableHead className="text-base font-semibold text-[var(--color-slate-11)]">Name</TableHead>
                      <TableHead className="text-base font-semibold text-[var(--color-slate-11)]">Class</TableHead>
                      <TableHead className="text-base font-semibold text-[var(--color-slate-11)]">VIA missed</TableHead>
                      <TableHead className="text-base font-semibold text-[var(--color-slate-11)]">Next steps</TableHead>
                      <TableHead className="text-base font-semibold text-[var(--color-slate-11)]">Teacher's remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_REVIEW_ROWS.map((r) => (
                      <TableRow key={r.row} className="hover:bg-transparent">
                        <TableCell className="text-center text-base tabular-nums text-slate-400">
                          {r.row}
                        </TableCell>
                        <TableCell
                          className="text-base text-slate-700"
                        >
                          {r.name}
                        </TableCell>
                        <TableCell className="text-base text-slate-500">
                          {r.class}
                        </TableCell>
                        <TableCell className="text-base text-slate-500">
                          {r.viaMissed}
                        </TableCell>
                        <TableCell className="max-w-0 text-base text-slate-500">
                          <span className="block truncate">{r.nextSteps}</span>
                        </TableCell>
                        <TableCell className="max-w-0 text-base text-slate-500">
                          <span className="block truncate">{r.teacherRemarks}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <p className="text-sm text-[var(--color-slate-11)]">Preview of first 10 rows</p>
          </div>

          {/* Validation panel */}
          <div className="w-[412px] shrink-0">
            {hasIssues ? (
              <div className="flex min-h-[620px] flex-col rounded-2xl border bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-lg font-semibold text-[var(--color-slate-11)]">
                  Few issues found
                </p>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={onBack}
                >
                  Upload again
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </div>
              <ul className="flex flex-col gap-3">
                {REVIEW_ISSUES.map((iss) => (
                  <li
                    key={iss.id}
                    className="flex items-start gap-3 rounded-xl border border-[var(--color-slate-3)] bg-slate-50 p-3"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--crimson-11)]" />
                    <div className="flex min-w-0 flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-semibold text-[var(--crimson-11)]">
                          {iss.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {iss.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-transparent bg-[var(--color-slate-3)] text-[var(--color-slate-11)] text-sm">{iss.ref}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-[var(--radius-3xl,24px)] border border-[var(--color-slate-6)] bg-white px-6 py-5">
              <div className="flex flex-col items-center">
                <img
                  src="/no-issues-illustration.png"
                  alt="No issues found"
                  className="size-[200px] object-cover"
                />
                <div className="mt-3 flex flex-col items-center gap-3 text-center">
                  <p className="text-[23px] font-semibold leading-7 text-[var(--color-slate-12)]">
                    No issues found
                  </p>
                  <p className="text-base text-[var(--color-slate-11)]">
                    Your file is good to go!
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between border-t bg-white px-8 py-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={hasIssues} className="gap-2">
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Category select row ─────────────────────────────────────────────────────

function CategorySelectRow({
  fieldName,
  state,
  categories,
  onChange,
  onCreateCategory,
}: {
  fieldName: string
  state: FieldState
  categories: Array<string>
  onChange: (next: Partial<FieldState>) => void
  onCreateCategory: (name: string) => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  const existingFields =
    state.selected && state.mode === 'selected'
      ? (EXISTING_FIELDS_MAP[state.selected] ?? [])
      : []

  function handleSelectCategory(cat: string) {
    setDropdownOpen(false)
    onChange({ mode: 'selected', selected: cat, newValue: '', newError: '' })
  }

  function handleSkipForNow() {
    setDropdownOpen(false)
    onChange({ mode: 'skipped', selected: null })
  }

  function handleCreateCategory() {
    setDropdownOpen(false)
    onChange({ mode: 'creating', newValue: '', newError: '' })
  }

  function handleConfirmNewCategory() {
    const trimmed = state.newValue.trim()
    if (trimmed.toLowerCase() === 'others') {
      onChange({ newError: 'Please select "Skip for now" instead' })
      return
    }
    if (!trimmed) return
    onCreateCategory(trimmed)
    onChange({
      mode: 'selected',
      selected: trimmed,
      newValue: '',
      newError: '',
    })
  }

  function handleCancelNew() {
    onChange({ mode: 'unset', newValue: '', newError: '' })
  }

  // ── Render the "CATEGORISE UNDER" cell content
  function renderSelectCell() {
    if (state.mode === 'creating') {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              value={state.newValue}
              onChange={(e) =>
                onChange({ newValue: e.target.value, newError: '' })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmNewCategory()
                if (e.key === 'Escape') handleCancelNew()
              }}
              placeholder="New category"
              className={cn(
                'h-8 text-sm',
                state.newError && 'border-red-400 focus-visible:ring-red-300',
              )}
            />
            <Button
              size="icon"
              className="h-8 w-8 shrink-0 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleConfirmNewCategory}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={handleCancelNew}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          {state.newError && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {state.newError}
            </p>
          )}
        </div>
      )
    }

    const label =
      state.mode === 'selected'
        ? (state.selected ?? '')
        : state.mode === 'skipped'
          ? 'Skip for now'
          : 'Select'

    const isPlaceholder = state.mode === 'unset'
    const isSkipped = state.mode === 'skipped'

    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left text-sm transition-colors hover:bg-slate-50',
            dropdownOpen && 'border-primary ring-1 ring-primary/30',
            isPlaceholder && 'text-slate-400',
            isSkipped && 'text-slate-500 italic',
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-slate-400 transition-transform',
              dropdownOpen && 'rotate-180',
            )}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-[220px] overflow-hidden rounded-lg border bg-white py-1 shadow-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={cn(
                  'flex w-full items-center px-3 py-2 text-left text-sm hover:bg-slate-50',
                  state.selected === cat && 'font-medium text-primary',
                )}
              >
                {cat}
              </button>
            ))}
            <div className="my-1 border-t" />
            <button
              type="button"
              onClick={handleCreateCategory}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Create new category
            </button>
            <button
              type="button"
              onClick={handleSkipForNow}
              className="flex w-full items-center gap-1 px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              Skip for now
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Render the "EXISTING FIELDS PREVIEW" cell
  function renderPreviewCell() {
    if (state.mode !== 'selected' || existingFields.length === 0) {
      return <span className="text-sm text-slate-400">–</span>
    }
    return (
      <ul className="space-y-1">
        {existingFields.slice(0, 3).map((f) => (
          <li
            key={f}
            className="flex items-center gap-1.5 text-sm text-slate-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <TableRow>
      <TableCell className="py-4 pl-5 text-sm font-medium text-slate-800">
        {fieldName}
      </TableCell>
      <TableCell className="py-4 pr-4">{renderSelectCell()}</TableCell>
      <TableCell className="py-4 pl-2 pr-5">{renderPreviewCell()}</TableCell>
    </TableRow>
  )
}

// ─── Step 3 ─────────────────────────────────────────────────────────────────

function Step3({
  onBack,
  onComplete,
  onSkipAll,
}: {
  onBack: () => void
  onComplete: (mappings: Record<string, string>) => void
  onSkipAll: (mappings: Record<string, string>) => void
}) {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(
    () =>
      Object.fromEntries(INCOMING_FIELDS.map((f) => [f.id, makeFieldState()])),
  )
  const [categories, setCategories] =
    useState<Array<string>>(DEFAULT_CATEGORIES)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  function updateField(id: string, patch: Partial<FieldState>) {
    setFieldStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }))
  }

  function addCategory(name: string) {
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name])
    }
  }

  const allResolved = INCOMING_FIELDS.every(
    (f) =>
      fieldStates[f.id].mode === 'selected' ||
      fieldStates[f.id].mode === 'skipped',
  )

  function buildMappings(): Record<string, string> {
    return Object.fromEntries(
      INCOMING_FIELDS.map((f) => {
        const s = fieldStates[f.id]
        return [
          f.id,
          s.mode === 'selected' && s.selected ? s.selected : 'Others',
        ]
      }),
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 pt-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Organise your new fields
          </h1>
        </div>

        {/* Banner */}
        {!bannerDismissed && (
          <div className="mx-8 mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-900">
                Keep your student view tidy
              </p>
              <p className="text-xs text-emerald-700">
                Categorise each field to bring related details together. Make
                patterns clearer and decisions easier.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
              onClick={() => onSkipAll(buildMappings())}
            >
              Skip for now
            </Button>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="ml-1 text-emerald-500 hover:text-emerald-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="mx-8 mt-4 mb-6 rounded-xl border bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="pl-5 text-xs uppercase tracking-wide text-slate-400">
                  Incoming fields
                  <span className="mx-2 text-slate-300">→</span>
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-slate-400">
                  Categorise under
                </TableHead>
                <TableHead className="pl-2 pr-5 text-xs uppercase tracking-wide text-slate-400">
                  Existing fields preview
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INCOMING_FIELDS.map((field) => (
                <CategorySelectRow
                  key={field.id}
                  fieldName={field.name}
                  state={fieldStates[field.id]}
                  categories={categories}
                  onChange={(patch) => updateField(field.id, patch)}
                  onCreateCategory={addCategory}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex shrink-0 items-center justify-between border-t bg-white px-8 py-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => onComplete(buildMappings())}
          disabled={!allResolved}
          className="gap-2"
        >
          Complete
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Confirmation page ───────────────────────────────────────────────────────

function ConfirmationPage({
  fieldsByCategory,
  onExplore,
}: {
  fieldsByCategory: Record<string, Array<string>>
  onExplore: () => void
}) {
  const [accordionOpen, setAccordionOpen] = useState(true)
  const categories = Object.keys(fieldsByCategory)
  const totalFields = Object.values(fieldsByCategory).flat().length
  const isSingleCategory = categories.length === 1

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Center content */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-8 py-12">
        {/* Success icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Import done! 🎉
        </h1>
        <p className="mt-1 text-sm text-slate-500">Custom fields added</p>

        {/* Stats */}
        <div className="mt-6 w-full max-w-xl">
          <div className="grid grid-cols-2 divide-x overflow-hidden rounded-xl border bg-white">
            <div className="px-8 py-5 text-center">
              <p className="text-3xl font-bold text-primary">1023</p>
              <p className="mt-1 text-sm text-slate-500">Student records</p>
            </div>
            <div className="px-8 py-5 text-center">
              <p className="text-3xl font-bold text-primary">{totalFields}</p>
              <p className="mt-1 text-sm text-slate-500">Data fields</p>
            </div>
          </div>
        </div>

        {/* Data fields accordion */}
        <div className="mt-4 w-full max-w-xl overflow-hidden rounded-xl border bg-white">
          <button
            type="button"
            onClick={() => setAccordionOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">
                Data fields imported
              </span>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-slate-400 transition-transform',
                accordionOpen && 'rotate-180',
              )}
            />
          </button>

          {accordionOpen && (
            <div className="border-t px-4 pb-4 pt-3">
              <div
                className={cn(
                  'grid gap-3',
                  isSingleCategory ? 'grid-cols-1' : 'grid-cols-2',
                )}
              >
                {categories.map((cat) => (
                  <div key={cat} className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-800">
                      {cat}
                    </p>
                    <ul className="space-y-1.5">
                      {fieldsByCategory[cat].map((fieldName, i) => (
                        <li
                          key={`${fieldName}-${i}`}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {fieldName}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 border-t bg-white px-8 py-4 text-center">
        <Button onClick={onExplore} size="lg" className="gap-2 px-8">
          Explore your holistic view
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Wizard root ─────────────────────────────────────────────────────────────

export function ImportWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<WizardStep>(1)
  const [uploadError, setUploadError] = useState(false)
  const [hasIssues, setHasIssues] = useState(true)
  const [fieldsByCategory, setFieldsByCategory] = useState<
    Record<string, Array<string>>
  >({})

  function handleFileAccepted(file: File) {
    setUploadError(false)
    const toastId = toast.loading('Processing file…')
    setTimeout(() => {
      toast.dismiss(toastId)
      const willError = file.name.includes('bad')
      if (willError) {
        setUploadError(true)
      } else {
        setStep(2)
      }
    }, 1800)
  }

  function buildFieldsByCategory(
    mappings: Record<string, string>,
  ): Record<string, Array<string>> {
    const result: Record<string, Array<string>> = {}
    for (const field of INCOMING_FIELDS) {
      const category = mappings[field.id] ?? 'Others'
      if (!result[category]) result[category] = []
      result[category].push(field.name)
    }
    return result
  }

  function handleComplete(mappings: Record<string, string>) {
    const toastId = toast.loading('Merging data…')
    setTimeout(() => {
      toast.dismiss(toastId)
      setFieldsByCategory(buildFieldsByCategory(mappings))
      setStep(4)
    }, 2000)
  }

  function handleSkipAll(mappings: Record<string, string>) {
    // All fields go to "Others"
    const allOthers = Object.fromEntries(
      INCOMING_FIELDS.map((f) => [f.id, 'Others']),
    )
    const toastId = toast.loading('Merging data…')
    setTimeout(() => {
      toast.dismiss(toastId)
      setFieldsByCategory(buildFieldsByCategory({ ...mappings, ...allOthers }))
      setStep(4)
    }, 2000)
  }

  const isConfirmation = step === 4

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="text-base font-semibold text-slate-900">
            {isConfirmation ? 'Add custom fields' : 'Import data'}
          </span>
          {!isConfirmation && (
            <>
              <div className="h-4 w-px bg-slate-200" />
              <WizardStepper current={step} />
            </>
          )}
        </div>
        {!isConfirmation && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Step content */}
      {step === 1 && (
        <Step1 hasError={uploadError} onFileAccepted={handleFileAccepted} />
      )}
      {step === 2 && (
        <Step2
          hasIssues={hasIssues}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          onBack={() => setStep(2)}
          onComplete={handleComplete}
          onSkipAll={handleSkipAll}
        />
      )}
      {step === 4 && (
        <ConfirmationPage
          fieldsByCategory={fieldsByCategory}
          onExplore={onClose}
        />
      )}

      {/* Floating design tools — dev only */}
      {!isConfirmation && (
        <Popover>
          <PopoverTrigger
            render={
              <button className="fixed bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-lg transition-shadow hover:shadow-xl">
                <Settings2 className="h-4 w-4 text-slate-500" />
              </button>
            }
          />
          <PopoverContent
            side="top"
            sideOffset={8}
            align="end"
            className="w-64"
          >
            <PopoverHeader>
              <PopoverTitle>Design Tools</PopoverTitle>
            </PopoverHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-500">
                  Step 1 — Upload state
                </label>
                <Select
                  value={uploadError ? 'error' : 'idle'}
                  onValueChange={(val) => setUploadError(val === 'error')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="error">Upload error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-500">
                  Step 2 — Review state
                </label>
                <Select
                  value={hasIssues ? 'issues' : 'clean'}
                  onValueChange={(val) => setHasIssues(val === 'issues')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">No issues</SelectItem>
                    <SelectItem value="issues">Few issues found</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
