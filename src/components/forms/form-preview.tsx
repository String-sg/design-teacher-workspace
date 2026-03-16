import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  MoreHorizontal,
  User,
} from 'lucide-react'
import type { FormQuestion, FormType, ResponseType } from '@/types/form'

interface FormPreviewProps {
  formType: FormType
  title: string
  description: string
  responseType?: ResponseType
  dueDate?: string
  questions?: FormQuestion[]
  activeEditingQuestionId?: string | null
}

type PreviewScreen =
  | 'main'
  | 'submitted'
  | { questionId: string; responseChoice: 'yes' | 'no' }

export function FormPreview({
  formType,
  title,
  description,
  responseType,
  dueDate,
  questions = [],
  activeEditingQuestionId,
}: FormPreviewProps) {
  const [screen, setScreen] = useState<PreviewScreen>('main')

  const displayDue = dueDate
    ? new Date(dueDate).toLocaleDateString('en-SG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  const previewDate = new Date()
    .toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()
  const previewTime = new Date()
    .toLocaleTimeString('en-SG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase()
  const timestamp = `${previewDate}, ${previewTime}`

  // Reset to main screen when response type changes
  useEffect(() => {
    setScreen('main')
  }, [responseType])

  // Auto-navigate to the question being edited
  useEffect(() => {
    if (activeEditingQuestionId) {
      setScreen({ questionId: activeEditingQuestionId, responseChoice: 'yes' })
    }
  }, [activeEditingQuestionId])

  function getRelevantQuestions(choice: 'yes' | 'no'): FormQuestion[] {
    return questions.filter((q) => {
      const after = q.showAfter ?? 'both'
      return choice === 'yes'
        ? after === 'yes' || after === 'both'
        : after === 'no' || after === 'both'
    })
  }

  const isSubmittedScreen = screen === 'submitted'
  const isQuestionScreen = screen !== 'main' && screen !== 'submitted'
  const screenChoice = isQuestionScreen
    ? (screen as { questionId: string; responseChoice: 'yes' | 'no' }).responseChoice
    : 'yes'
  const relevantQuestions = isQuestionScreen
    ? getRelevantQuestions(screenChoice)
    : []
  const currentQIndex = isQuestionScreen
    ? relevantQuestions.findIndex(
        (q) => q.id === (screen as { questionId: string }).questionId,
      )
    : -1
  const currentQ = relevantQuestions[currentQIndex] ?? null
  const isLastQ = currentQIndex === relevantQuestions.length - 1

  function handleYesClick() {
    const qs = getRelevantQuestions('yes')
    if (qs.length > 0) setScreen({ questionId: qs[0].id, responseChoice: 'yes' })
  }

  function handleNoClick() {
    const qs = getRelevantQuestions('no')
    if (qs.length > 0) setScreen({ questionId: qs[0].id, responseChoice: 'no' })
  }

  function handleNextQuestion() {
    if (!isQuestionScreen) return
    const next = relevantQuestions[currentQIndex + 1]
    if (next) setScreen({ questionId: next.id, responseChoice: screenChoice })
    else setScreen('submitted')
  }

  function handleNavBack() {
    if (isQuestionScreen || isSubmittedScreen) setScreen('main')
  }

  // ---------------------------------------------------------------------------
  // Main screen
  // ---------------------------------------------------------------------------
  const mainContent = (
    <>
      <div className="flex-1 divide-y divide-slate-100 overflow-y-auto bg-white">
        {/* Form header */}
        <div className="px-4 py-4">
          {title ? (
            <h3 className="text-sm font-bold leading-snug text-slate-900">
              {title}
            </h3>
          ) : (
            <h3 className="text-sm font-bold leading-snug text-slate-300">
              Form title
            </h3>
          )}
          <p className="mt-1 text-[10px] text-slate-400">
            {timestamp} · SENDER NAME
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <User className="h-3 w-3 shrink-0 text-slate-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              STUDENT NAME
            </p>
          </div>
        </div>

        {/* Details section */}
        <div className="px-4 py-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Details
          </p>
          {description ? (
            <p className="line-clamp-6 text-xs leading-relaxed text-slate-700">
              {description}
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-slate-300">
              Your form details will appear here.
            </p>
          )}
        </div>
      </div>

      {/* Sticky response footer */}
      <div className="border-t border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0">
            <p className="text-[10px] text-slate-400">
              {responseType === 'acknowledge'
                ? 'Please acknowledge by'
                : 'Please respond by'}
            </p>
            <p className="text-xs font-bold text-slate-700">
              {displayDue || 'DD Mmm YYYY'}
            </p>
          </div>

          {formType === 'quick' && responseType === 'yes-no' && (
            <div className="flex gap-1.5">
              <div
                onClick={handleYesClick}
                className="cursor-pointer rounded-lg bg-[#c47565] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:opacity-90"
              >
                Yes
              </div>
              <div
                onClick={handleNoClick}
                className="cursor-pointer rounded-lg border border-[#c47565] bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#c47565] hover:bg-[#c47565]/5"
              >
                No
              </div>
            </div>
          )}
          {formType === 'quick' && responseType === 'acknowledge' && (
            <div className="whitespace-nowrap rounded-lg bg-[#c47565] px-4 py-1.5 text-[11px] font-semibold text-white opacity-80">
              Acknowledge
            </div>
          )}
          {(formType === 'allears' || formType === 'link') && (
            <div className="whitespace-nowrap rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary">
              Open Form →
            </div>
          )}
          {formType === 'quick' && !responseType && (
            <div className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] text-slate-400">
              —
            </div>
          )}
        </div>
      </div>
    </>
  )

  // ---------------------------------------------------------------------------
  // Question screen
  // ---------------------------------------------------------------------------
  const questionContent = currentQ ? (
    <>
      {/* "Your response" + progress bar */}
      <div className="border-b border-slate-100 bg-white px-4 pb-2 pt-2">
        <p className="text-[10px] text-slate-400">
          Your response:{' '}
          <span className="font-semibold capitalize text-slate-700">
            {screenChoice}
          </span>
        </p>
        <div className="mt-1.5 h-0.5 rounded-full bg-slate-100">
          <div
            className="h-0.5 rounded-full bg-slate-500 transition-all"
            style={{
              width: `${((currentQIndex + 1) / relevantQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-4 text-[11px] font-medium leading-snug text-slate-800">
          <span className="text-red-500">* </span>
          Q{currentQIndex + 1}. {currentQ.text || 'Question text…'}
        </p>

        {(!currentQ.type || currentQ.type === 'open') && (
          <div className="min-h-[72px] rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] text-slate-300">
              Type your answer here…
            </p>
          </div>
        )}

        {currentQ.type === 'mcq' && (
          <div className="space-y-2">
            {(currentQ.options && currentQ.options.length >= 2
              ? currentQ.options
              : ['Option 1', 'Option 2']
            ).map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-slate-300" />
                <span className="text-[11px] text-slate-700">
                  {opt || `Option ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next / Submit footer */}
      <div className="border-t border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={handleNextQuestion}
          className="w-full rounded-lg bg-slate-700 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
        >
          {isLastQ ? 'Submit' : 'Next'}
        </button>
      </div>
    </>
  ) : null

  // ---------------------------------------------------------------------------
  // Submitted screen
  // ---------------------------------------------------------------------------
  const submittedContent = (
    <>
      {/* Progress bar (100%) */}
      <div className="border-b border-slate-100 bg-white px-4 pb-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="mr-3 h-0.5 flex-1 rounded-full bg-slate-100">
            <div className="h-0.5 w-full rounded-full bg-slate-500" />
          </div>
          <span className="shrink-0 text-[10px] text-slate-400">Done</span>
        </div>
      </div>

      {/* Success body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="text-center text-sm font-semibold text-slate-800">
          Response submitted
        </p>
        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          This is a preview —<br />no data was sent.
        </p>
      </div>

      {/* Back to start footer */}
      <div className="border-t border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setScreen('main')}
          className="w-full rounded-lg border border-slate-200 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to start
        </button>
      </div>
    </>
  )

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* Card header */}
      <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
        <span className="text-sm font-semibold">Preview</span>
        <span className="text-xs text-muted-foreground">As seen by parents</span>
      </div>

      <div className="p-4">
        <p className="mb-3 text-xs text-muted-foreground">
          This is how parents will see your form on the Parents Gateway App.
        </p>

        {/* Phone mockup */}
        <div className="mx-auto max-w-[272px]">
          <div className="flex h-[520px] flex-col overflow-hidden rounded-[28px] border-[7px] border-slate-900 bg-white shadow-md">
            {/* Nav bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-2.5">
              <ChevronLeft
                className={`h-5 w-5 ${isQuestionScreen || isSubmittedScreen ? 'cursor-pointer text-slate-600 hover:text-slate-900' : 'text-slate-400'}`}
                onClick={handleNavBack}
              />
              <div className="flex items-center gap-3 text-slate-400">
                <ArrowUp className="h-3.5 w-3.5" />
                <ArrowDown className="h-3.5 w-3.5" />
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </div>

            {isSubmittedScreen ? submittedContent : isQuestionScreen ? questionContent : mainContent}
          </div>
        </div>
      </div>
    </div>
  )
}
