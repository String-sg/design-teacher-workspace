import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
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
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a3a5c' }}>
              Step 2: Build Form
            </h2>
            <p className="text-sm text-slate-500">
              This step will be implemented in a future task.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150"
                style={{ backgroundColor: '#1a3a5c' }}
              >
                Go to: Recipients
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a3a5c' }}>
              Step 3: Recipients
            </h2>
            <p className="text-sm text-slate-500">
              This step will be implemented in a future task.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150"
                style={{ backgroundColor: '#1a3a5c' }}
              >
                Go to: Send
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
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
