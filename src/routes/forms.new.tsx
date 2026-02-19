import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  GraduationCap,
  GripVertical,
  Heart,
  Plus,
  Users,
} from 'lucide-react'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import type { RecipientGroup } from '@/types/form'

export const Route = createFileRoute('/forms/new')({
  component: NewFormWizard,
})

type AudienceType = 'all' | 'students' | 'staff' | 'parents'

interface WizardData {
  audience: AudienceType | null
  selectedGroups: Array<RecipientGroup>
  formTitle: string
  deadline: string
  sendReminder: boolean
}

export const AVAILABLE_GROUPS: Array<RecipientGroup> = [
  { id: 'g-5a', name: '5A', type: 'class', parentCount: 28 },
  { id: 'g-5b', name: '5B', type: 'class', parentCount: 31 },
  { id: 'g-5c', name: '5C', type: 'class', parentCount: 29 },
  { id: 'g-basketball', name: 'Basketball CCA', type: 'cca', parentCount: 22 },
  { id: 'g-choir', name: 'Choir CCA', type: 'cca', parentCount: 18 },
]

const STEPS = ['Audience', 'Build Form', 'Recipients', 'Send']

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------

interface StepIndicatorProps {
  currentStep: number
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1
        const isDone = stepNumber < currentStep
        const isActive = stepNumber === currentStep
        const isFuture = stepNumber > currentStep

        return (
          <div key={label} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-150"
                style={
                  isDone
                    ? { backgroundColor: '#16a34a', color: 'white' }
                    : isActive
                      ? { backgroundColor: '#1a3a5c', color: 'white' }
                      : { backgroundColor: '#e2e8f0', color: '#94a3b8' }
                }
              >
                {isDone ? (
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className="text-xs font-medium transition-all duration-150"
                style={
                  isDone
                    ? { color: '#16a34a' }
                    : isActive
                      ? { color: '#1a3a5c' }
                      : { color: '#94a3b8' }
                }
              >
                {label}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < STEPS.length - 1 && (
              <div
                className="mx-3 mb-5 h-px w-16 transition-all duration-150"
                style={{
                  backgroundColor:
                    stepNumber < currentStep ? '#16a34a' : '#e2e8f0',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Audience card definitions
// ---------------------------------------------------------------------------

interface AudienceOption {
  id: AudienceType
  label: string
  description: string
  Icon: React.ElementType
  bgColor: string
  iconColor: string
  isNew?: boolean
}

const AUDIENCE_OPTIONS: Array<AudienceOption> = [
  {
    id: 'all',
    label: 'All',
    description: 'Anyone can respond without signing in. Responses are anonymous.',
    Icon: Users,
    bgColor: '#f8fafc', // slate-50
    iconColor: '#64748b',
  },
  {
    id: 'students',
    label: 'Students',
    description: 'All students in MOE can log in via MIMS to respond.',
    Icon: GraduationCap,
    bgColor: '#fff1f2', // rose/pink-50
    iconColor: '#e11d48',
  },
  {
    id: 'staff',
    label: 'Staff',
    description: 'All staff in MOE can log in via MIMS to respond.',
    Icon: Briefcase,
    bgColor: '#fefce8', // yellow-50
    iconColor: '#ca8a04',
  },
  {
    id: 'parents',
    label: 'Parents',
    description: 'Send to parents of your students via Parents Gateway.',
    Icon: Heart,
    bgColor: '#faf5ff', // purple-50
    iconColor: '#9333ea',
    isNew: true,
  },
]

// ---------------------------------------------------------------------------
// Step1Audience
// ---------------------------------------------------------------------------

interface Step1AudienceProps {
  selected: AudienceType | null
  onSelect: (audience: AudienceType) => void
  onNext: () => void
}

function Step1Audience({ selected, onSelect, onNext }: Step1AudienceProps) {
  const canProceed = selected !== null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: '#1a3a5c' }}>
          Who is this form for?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose the audience type. This determines how recipients access and
          complete the form.
        </p>
      </div>

      {/* 2x2 grid of audience cards */}
      <div className="grid grid-cols-2 gap-4">
        {AUDIENCE_OPTIONS.map(
          ({ id, label, description, Icon, bgColor, iconColor, isNew }) => {
            const isSelected = selected === id

            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="relative flex flex-col items-start gap-4 rounded-xl border-2 p-5 text-left transition-all duration-150 hover:shadow-md focus:outline-none"
                style={{
                  backgroundColor: bgColor,
                  borderColor: isSelected ? '#1a3a5c' : '#e2e8f0',
                  boxShadow: isSelected
                    ? '0 0 0 1px #1a3a5c, 0 4px 12px rgba(26,58,92,0.12)'
                    : undefined,
                }}
              >
                {/* "New" badge for Parents */}
                {isNew && (
                  <span
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: '#7c3aed' }}
                  >
                    New
                  </span>
                )}

                {/* Icon circle */}
                <div
                  className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm"
                  style={{ color: iconColor }}
                >
                  <Icon className="size-6" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1">
                  <span
                    className="text-base font-semibold"
                    style={{ color: '#1a3a5c' }}
                  >
                    {label}
                  </span>
                  <span className="text-sm leading-snug text-slate-500">
                    {description}
                  </span>
                </div>
              </button>
            )
          },
        )}
      </div>

      {/* Parents Gateway banner — shown when "parents" is selected */}
      {selected === 'parents' && (
        <div
          className="flex items-start gap-3 rounded-lg border p-4 text-sm transition-all duration-150"
          style={{
            backgroundColor: '#faf5ff',
            borderColor: '#c4b5fd',
            color: '#6d28d9',
          }}
        >
          <Heart className="mt-0.5 size-4 shrink-0" style={{ color: '#9333ea' }} />
          <p>
            <span className="font-medium">
              This form will be delivered to parents via Parents Gateway.
            </span>{' '}
            Parents will receive a notification in the PG app and can complete
            the form there.
          </p>
        </div>
      )}

      {/* CTA button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            backgroundColor: canProceed ? '#1a3a5c' : '#94a3b8',
          }}
        >
          Go to: Build Form
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2 — Form Builder constants
// ---------------------------------------------------------------------------

const DEMO_QUESTIONS = [
  {
    id: 'dq1',
    type: 'yes-no',
    text: 'Will your child be attending the field trip to Science Centre on 28 Feb 2026?',
    required: true,
    conditionalNote: null,
  },
  {
    id: 'dq2',
    type: 'mcq',
    text: "Please select your child's T-shirt size.",
    required: true,
    options: ['XS', 'S', 'M', 'L', 'XL'],
    conditionalNote: 'Shown if Q1 = Yes',
  },
  {
    id: 'dq3',
    type: 'mcq',
    text: 'How will your child travel to the venue?',
    required: true,
    options: ['School bus', 'Private transport', 'Public transport'],
    conditionalNote: 'Shown if Q1 = Yes',
  },
  {
    id: 'dq4',
    type: 'short-answer',
    text: 'Any medical conditions or dietary restrictions we should be aware of?',
    required: false,
    conditionalNote: 'Shown if Q1 = Yes',
  },
] as const

const QUESTION_TYPES = [
  { id: 'yes-no', label: 'Yes / No' },
  { id: 'mcq', label: 'Multiple Choice (single)' },
  { id: 'checkbox', label: 'Checkboxes (multi-select)' },
  { id: 'short-answer', label: 'Short Answer' },
  { id: 'file-upload', label: 'File Upload' },
] as const

// ---------------------------------------------------------------------------
// Step2FormBuilder — helper sub-components
// ---------------------------------------------------------------------------

function TypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    'yes-no': 'Yes / No',
    mcq: 'Multiple Choice',
    checkbox: 'Checkboxes',
    'short-answer': 'Short Answer',
    'file-upload': 'File Upload',
  }
  return <>{map[type] ?? type}</>
}

interface QuestionCardProps {
  index: number
  question: (typeof DEMO_QUESTIONS)[number]
}

function QuestionCard({ index, question }: QuestionCardProps) {
  const qNum = index + 1
  const options =
    'options' in question ? (question.options as readonly string[]) : []

  return (
    <div
      className="relative rounded-lg border-2 bg-white shadow-sm"
      style={{ borderColor: '#bfdbfe' /* blue-200 */ }}
    >
      {/* Blue left accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
        style={{ backgroundColor: '#3b82f6' }}
      />

      {/* Drag handle — top center */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2">
        <GripVertical className="size-4 text-slate-300" />
      </div>

      <div className="px-6 py-4 pl-7">
        {/* Top row: type label + required + conditional badge */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: '#64748b' }}
          >
            Q{qNum}.{' '}
            <TypeLabel type={question.type} />
          </span>

          <div className="flex items-center gap-2">
            {question.conditionalNote && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                {question.conditionalNote}
              </span>
            )}
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
              <input
                type="checkbox"
                defaultChecked={question.required}
                className="size-3.5 rounded accent-blue-600"
                readOnly
              />
              Required
            </label>
          </div>
        </div>

        {/* Question text */}
        <p className="mb-3 text-sm font-medium text-slate-800">{question.text}</p>

        {/* Answer area */}
        {question.type === 'yes-no' && (
          <div className="flex flex-col gap-1.5">
            {['Yes', 'No'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="radio" name={`q-${question.id}`} className="accent-blue-600" readOnly />
                {opt}
              </label>
            ))}
          </div>
        )}

        {question.type === 'mcq' && options.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="radio" name={`q-${question.id}`} className="accent-blue-600" readOnly />
                {opt}
              </label>
            ))}
          </div>
        )}

        {question.type === 'short-answer' && (
          <div
            className="rounded border border-dashed px-3 py-2 text-sm text-slate-400"
            style={{ borderColor: '#cbd5e1' }}
          >
            Short answer text…
          </div>
        )}

        {/* file-upload type is available via + Add content but not in demo questions */}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step2FormBuilder
// ---------------------------------------------------------------------------

interface Step2Props {
  data: WizardData
  onUpdate: (patch: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

function Step2FormBuilder({ data, onUpdate, onNext, onBack }: Step2Props) {
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  return (
    <div className="flex flex-col gap-0">
      {/* ── Top bar ── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: '#1a3a5c' }}>
          Form content
        </h2>
        <div className="flex items-center gap-3">
          {/* Saved badge */}
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            All changes saved
          </span>
          {/* Preview button */}
          <button
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-150"
            style={{ borderColor: '#e2e8f0' }}
          >
            <Eye className="size-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="mb-5 h-px bg-slate-100" />

      {/* ── Form title block ── */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Form title
          </label>
          <input
            type="text"
            value={data.formTitle}
            onChange={(e) => onUpdate({ formTitle: e.target.value })}
            className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2"
            style={{
              borderColor: '#e2e8f0',
            }}
            placeholder="Form title…"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Instructions (optional)
          </label>
          <input
            type="text"
            className="w-full rounded-lg border px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2"
            style={{ borderColor: '#e2e8f0' }}
            placeholder="Add instructions for parents…"
          />
        </div>
      </div>

      {/* ── Question cards ── */}
      <div className="mb-4 flex flex-col gap-3">
        {DEMO_QUESTIONS.map((q, i) => (
          <QuestionCard key={q.id} index={i} question={q} />
        ))}
      </div>

      {/* ── + Add content button ── */}
      <div className="relative mb-6">
        <button
          onClick={() => setAddMenuOpen((prev) => !prev)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors duration-150"
          style={{ borderColor: '#cbd5e1' }}
        >
          <Plus className="size-4" />
          Add content
          <ChevronDown
            className="size-4 transition-transform duration-150"
            style={{ transform: addMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {addMenuOpen && (
          <div
            className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border bg-white shadow-lg"
            style={{ borderColor: '#e2e8f0' }}
          >
            {QUESTION_TYPES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setAddMenuOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-100"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Back / Next navigation ── */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150"
          style={{ backgroundColor: '#1a3a5c' }}
        >
          Go to: Recipients
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step3Recipients
// ---------------------------------------------------------------------------

interface Step3Props {
  data: WizardData
  onUpdate: (patch: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

function Step3Recipients({ data, onUpdate, onNext, onBack }: Step3Props) {
  function toggleGroup(group: RecipientGroup) {
    const exists = data.selectedGroups.find((g) => g.id === group.id)
    if (exists) {
      onUpdate({ selectedGroups: data.selectedGroups.filter((g) => g.id !== group.id) })
    } else {
      onUpdate({ selectedGroups: [...data.selectedGroups, group] })
    }
  }

  const totalParents = data.selectedGroups.reduce((sum, g) => sum + g.parentCount, 0)
  const canProceed = data.selectedGroups.length > 0

  const classGroups = AVAILABLE_GROUPS.filter((g) => g.type === 'class')
  const ccaGroups = AVAILABLE_GROUPS.filter((g) => g.type === 'cca')

  function renderGroupCard(group: RecipientGroup) {
    const isSelected = Boolean(data.selectedGroups.find((g) => g.id === group.id))

    return (
      <button
        key={group.id}
        onClick={() => toggleGroup(group)}
        className="relative flex flex-col gap-1 rounded-lg border-2 p-4 text-left transition-all duration-150 focus:outline-none hover:border-blue-300"
        style={{
          backgroundColor: isSelected ? 'rgba(26,58,92,0.05)' : 'white',
          borderColor: isSelected ? '#1a3a5c' : '#e2e8f0',
        }}
      >
        {/* Checkmark circle — top-right, shown when selected */}
        {isSelected && (
          <div
            className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full"
            style={{ backgroundColor: '#1a3a5c' }}
          >
            <svg
              className="size-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        <span className="text-sm font-semibold" style={{ color: '#1a3a5c' }}>
          {group.name}
        </span>
        <span className="text-xs text-slate-500">{group.parentCount} parents</span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold" style={{ color: '#1a3a5c' }}>
          Select recipients
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose which groups of parents will receive this form via Parents Gateway.
        </p>
      </div>

      {/* Group sections */}
      <div className="flex flex-col gap-6">
        {/* Class Groups */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Class Groups
          </span>
          <div className="grid grid-cols-3 gap-3">
            {classGroups.map(renderGroupCard)}
          </div>
        </div>

        {/* CCA Groups */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            CCA Groups
          </span>
          <div className="grid grid-cols-3 gap-3">
            {ccaGroups.map(renderGroupCard)}
          </div>
        </div>
      </div>

      {/* Summary banner — shown when ≥1 group selected */}
      {canProceed && (
        <div
          className="rounded-lg border px-4 py-3 text-sm transition-all duration-150"
          style={{
            backgroundColor: 'rgba(26,58,92,0.04)',
            borderColor: 'rgba(26,58,92,0.25)',
            color: '#1a3a5c',
          }}
        >
          <span className="font-medium">
            {data.selectedGroups.map((g) => `${g.name} (${g.parentCount} parents)`).join(', ')}
          </span>
          {' '}—{' '}
          <span className="font-semibold">{totalParents} parents total</span>
        </div>
      )}

      {/* Back / Next navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: canProceed ? '#1a3a5c' : '#94a3b8' }}
        >
          Go to: Send
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// NewFormWizard (main component)
// ---------------------------------------------------------------------------

export function NewFormWizard() {
  useSetBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Parent Forms', href: '/forms' },
    { label: 'New Form', href: '/forms/new' },
  ])

  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>({
    audience: null,
    selectedGroups: [],
    formTitle: 'P5 Science Centre Field Trip — Consent & T-shirt Size',
    deadline: '2026-02-21',
    sendReminder: true,
  })

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8">
      {/* Back link */}
      <div>
        <Link
          to="/forms"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors duration-150"
        >
          <ChevronLeft className="size-4" />
          Back to Parent Forms
        </Link>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1a3a5c' }}>
          New Parent Form
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Powered by{' '}
          <span className="font-medium text-slate-500">All Ears</span>
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Step content panel */}
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        {step === 1 && (
          <Step1Audience
            selected={data.audience}
            onSelect={(audience) => update({ audience })}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2FormBuilder
            data={data}
            onUpdate={update}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3Recipients
            data={data}
            onUpdate={update}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a3a5c' }}>
              Step 4: Send
            </h2>
            <p className="text-sm text-slate-500">
              This step will be implemented in a future task.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
              <button
                onClick={() => navigate({ to: '/forms' })}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150"
                style={{ backgroundColor: '#16a34a' }}
              >
                Done — View Forms
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
