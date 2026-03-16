import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  MoreHorizontal,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface PreviewQuestion {
  id: string
  type: 'multiple-choice' | 'checkbox' | 'free-text' | 'ranking'
  question: string
  options?: string[]
  required?: boolean
}

interface AllEarsPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  questions: PreviewQuestion[]
}

const GENERIC_BODY =
  'Dear Parents,\n\nThank you for taking the time to complete this form. Please answer all sections carefully so we can make the necessary arrangements.\n\nThank you.'

type PreviewScreen = 'main' | 'instructions' | number | 'submitted'

export function AllEarsPreviewDialog({
  open,
  onOpenChange,
  title,
  description,
  questions,
}: AllEarsPreviewDialogProps) {
  const [previewScreen, setPreviewScreen] = useState<PreviewScreen>('main')
  const [previewSelections, setPreviewSelections] = useState<
    Record<string, string | string[]>
  >({})

  // Reset to main screen whenever dialog opens
  useEffect(() => {
    if (open) {
      setPreviewScreen('main')
      setPreviewSelections({})
    }
  }, [open])

  const hasQuestions = questions.length > 0
  const isMainScreen = previewScreen === 'main'
  const isInstructionsScreen = previewScreen === 'instructions'
  const isQuestionScreen = typeof previewScreen === 'number'
  const isSubmittedScreen = previewScreen === 'submitted'
  const qIdx = isQuestionScreen ? (previewScreen as number) : 0
  const currentQ = isQuestionScreen ? questions[qIdx] : null
  const isLastQ = isQuestionScreen && qIdx === questions.length - 1
  const progressPct = isSubmittedScreen
    ? 100
    : isQuestionScreen
      ? ((qIdx + 1) / questions.length) * 100
      : 0

  function handleBack() {
    if (isInstructionsScreen) setPreviewScreen('main')
    else if (isQuestionScreen) {
      if (qIdx === 0) setPreviewScreen('instructions')
      else setPreviewScreen(qIdx - 1)
    }
  }

  function handleToggleRadio(qId: string, opt: string) {
    setPreviewSelections((prev) => ({ ...prev, [qId]: opt }))
  }

  function handleToggleCheckbox(qId: string, opt: string) {
    setPreviewSelections((prev) => {
      const current = (prev[qId] as string[] | undefined) ?? []
      return {
        ...prev,
        [qId]: current.includes(opt)
          ? current.filter((o) => o !== opt)
          : [...current, opt],
      }
    })
  }

  const canGoBack = isInstructionsScreen || isQuestionScreen

  const phoneNav = (
    <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-2.5">
      <ChevronLeft
        className={cn(
          'h-5 w-5 transition-colors',
          canGoBack
            ? 'cursor-pointer text-slate-600 hover:text-slate-900'
            : 'text-slate-300',
        )}
        onClick={() => {
          if (canGoBack) handleBack()
        }}
      />
      <div className="flex items-center gap-3 text-slate-300">
        <ArrowUp className="h-3.5 w-3.5" />
        <ArrowDown className="h-3.5 w-3.5" />
        <MoreHorizontal className="h-4 w-4" />
      </div>
    </div>
  )

  const mainScreenContent = (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 divide-y divide-slate-100 overflow-y-auto bg-white">
        {/* Form header */}
        <div className="px-4 py-4">
          {title ? (
            <h3 className="text-sm font-bold leading-snug text-slate-900">
              {title}
            </h3>
          ) : (
            <h3 className="text-sm font-bold leading-snug text-slate-300">
              Form Title
            </h3>
          )}
          <p className="mt-1 text-[10px] text-slate-400">
            TUE 24 MAR 2026, 9:41 AM · teacher@school.edu.sg
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-3 w-3 shrink-0 rounded-full bg-slate-300" />
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
          <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700">
            {GENERIC_BODY}
          </p>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0">
            <p className="text-[10px] text-slate-400">Please respond by</p>
            <p className="text-xs font-bold text-slate-700">DD Mmm YYYY</p>
          </div>
          <button
            type="button"
            disabled={!hasQuestions}
            onClick={() => setPreviewScreen('instructions')}
            title={
              !hasQuestions ? 'Add questions to preview the form' : undefined
            }
            className={cn(
              'whitespace-nowrap rounded-lg px-4 py-1.5 text-[11px] font-semibold text-white transition-opacity',
              hasQuestions
                ? 'bg-[#c47565] hover:opacity-90'
                : 'cursor-not-allowed bg-slate-300 opacity-60',
            )}
          >
            Start Form →
          </button>
        </div>
      </div>
    </div>
  )

  const instructionsScreenContent = (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Instructions
        </p>
        <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700">
          {description ?? GENERIC_BODY}
        </p>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setPreviewScreen(0)}
          className="w-full rounded-lg bg-slate-700 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
        >
          Begin →
        </button>
      </div>
    </div>
  )

  const questionScreenContent = currentQ ? (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Progress bar + label */}
      <div className="shrink-0 border-b border-slate-100 bg-white px-4 pb-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="mr-3 h-0.5 flex-1 rounded-full bg-slate-100">
            <div
              className="h-0.5 rounded-full bg-slate-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[10px] text-slate-400">
            Q{qIdx + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-4 text-[11px] font-medium leading-snug text-slate-800">
          {currentQ.required && <span className="text-red-500">* </span>}
          {currentQ.question}
        </p>

        {currentQ.type === 'multiple-choice' && (
          <div className="space-y-2">
            {(currentQ.options ?? []).map((opt, i) => {
              const selected = previewSelections[currentQ.id] === opt
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleToggleRadio(currentQ.id, opt)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all',
                    selected
                      ? 'border-primary bg-primary/5 font-medium text-primary'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  )}
                >
                  <div
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors',
                      selected
                        ? 'border-primary bg-primary'
                        : 'border-slate-300',
                    )}
                  />
                  <span className="text-[11px]">{opt}</span>
                </button>
              )
            })}
          </div>
        )}

        {currentQ.type === 'checkbox' && (
          <div className="space-y-2">
            {(currentQ.options ?? []).map((opt, i) => {
              const selections =
                (previewSelections[currentQ.id] as string[] | undefined) ?? []
              const checked = selections.includes(opt)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleToggleCheckbox(currentQ.id, opt)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all',
                    checked
                      ? 'border-primary bg-primary/5 font-medium text-primary'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                      checked ? 'border-primary bg-primary' : 'border-slate-300',
                    )}
                  >
                    {checked && (
                      <svg
                        viewBox="0 0 10 8"
                        className="h-2.5 w-2.5 fill-none stroke-white stroke-2"
                      >
                        <path
                          d="M1 4l2.5 2.5L9 1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px]">{opt}</span>
                </button>
              )
            })}
          </div>
        )}

        {currentQ.type === 'free-text' && (
          <div className="min-h-[72px] rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] text-slate-300">Type your answer here…</p>
          </div>
        )}

        {currentQ.type === 'ranking' && (
          <div className="space-y-2">
            {(currentQ.options ?? []).map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <span className="shrink-0 text-[10px] font-bold text-slate-400">
                  {i + 1}
                </span>
                <span className="text-[11px] text-slate-700">{opt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next / Submit footer */}
      <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => {
            if (isLastQ) setPreviewScreen('submitted')
            else setPreviewScreen(qIdx + 1)
          }}
          className="w-full rounded-lg bg-slate-700 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
        >
          {isLastQ ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  ) : null

  const submittedScreenContent = (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Progress bar (100%) */}
      <div className="shrink-0 border-b border-slate-100 bg-white px-4 pb-2 pt-2">
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
      <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => {
            setPreviewScreen('main')
            setPreviewSelections({})
          }}
          className="w-full rounded-lg border border-slate-200 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to start
        </button>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-4 p-6 sm:max-w-sm"
      >
        {/* Dialog header */}
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold">Preview</DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          As seen by parents on the Parents Gateway App.
        </p>

        {/* Phone mockup */}
        <div className="mx-auto w-full max-w-[272px]">
          <div className="flex h-[520px] flex-col overflow-hidden rounded-[28px] border-[7px] border-slate-900 bg-white shadow-md">
            {phoneNav}
            {isMainScreen && mainScreenContent}
            {isInstructionsScreen && instructionsScreenContent}
            {isQuestionScreen && questionScreenContent}
            {isSubmittedScreen && submittedScreenContent}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
