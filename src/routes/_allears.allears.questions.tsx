import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Flag,
  GripVertical,
  Home,
  RefreshCw,
  Send,
  ToggleLeft,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { AllearsHeader } from '@/components/allears/allears-header'
import { AllEarsPreviewDialog } from '@/components/allears/allears-preview-dialog'
import type { PreviewQuestion } from '@/components/allears/allears-preview-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const Route = createFileRoute('/_allears/allears/questions')({
  component: QuestionsPage,
})

const SHARE_LINK = 'https://form.allears.gov.sg/abc1234'

const questions = [
  {
    id: 1,
    question:
      'Is your child able to participate in the Science Centre learning journey on 15 Mar 2026?',
    yesLabel: 'Yes, my child can attend',
    noLabel: 'No, my child cannot attend',
  },
  {
    id: 2,
    question:
      'Does your child have any allergies, medical conditions, or dietary requirements we should know about for this trip?',
    yesLabel: 'Yes, I will provide details',
    noLabel: 'No, nothing to declare',
  },
  {
    id: 3,
    question:
      'Are you comfortable with your child being photographed during the learning journey for school use?',
    yesLabel: 'Yes, I consent',
    noLabel: 'No, I do not consent',
  },
]

function YesNoQuestionCard({
  index,
  question,
  yesLabel,
  noLabel,
}: {
  index: number
  question: string
  yesLabel: string
  noLabel: string
}) {
  return (
    <div className="mx-4 my-4 rounded-lg border border-blue-100 bg-blue-50/30 p-5">
      <div className="mb-2 flex justify-center">
        <GripVertical className="h-4 w-4 rotate-90 text-slate-300" />
      </div>
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600">
          <ToggleLeft className="h-3 w-3" />
          Yes / No
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm font-medium text-slate-800">
        <span className="text-red-500">*</span> Q{index}. {question}
      </p>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col items-stretch gap-1.5">
          <button
            type="button"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            {yesLabel}
          </button>
          <input
            type="text"
            defaultValue={yesLabel}
            className="rounded border border-dashed border-slate-300 bg-white px-2.5 py-1 text-center text-xs text-slate-500 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 flex-col items-stretch gap-1.5">
          <button
            type="button"
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
          >
            {noLabel}
          </button>
          <input
            type="text"
            defaultValue={noLabel}
            className="rounded border border-dashed border-slate-300 bg-white px-2.5 py-1 text-center text-xs text-slate-500 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

function PublishShareDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  function handleCopyLink() {
    navigator.clipboard
      .writeText(SHARE_LINK)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Failed to copy link'))
  }

  function handleConfirmPublish() {
    onOpenChange(false)
    toast.success('Form published!', {
      description:
        'The form has been sent to Parents Gateway.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Publish and share</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Form title */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Form title
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-sm text-slate-800">
                Asking Parents — Sec 3 Science Centre Learning Journey
              </p>
            </div>
          </div>

          {/* Share link */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Share link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="truncate text-sm text-slate-700">{SHARE_LINK}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={handleCopyLink}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy link
              </Button>
            </div>
          </div>

          {/* Audience */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Audience
            </p>
            <p className="text-sm text-slate-800">
              Specific custodians · Sec 3A, Sec 3B
            </p>
          </div>

          {/* Due date */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Due date
            </p>
            <p className="text-sm text-slate-800">15 Mar 2026</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmPublish}>
            Confirm and publish →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function QuestionsPage() {
  const [showPublish, setShowPublish] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const previewQuestions: PreviewQuestion[] = questions.map((q) => ({
    id: String(q.id),
    type: 'multiple-choice' as const,
    question: q.question,
    options: [q.yesLabel, q.noLabel],
    required: true,
  }))

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AllearsHeader activeTab="QUESTIONS" />

      <main className="flex flex-1 flex-col px-8 py-6">
        {/* Top bar: breadcrumb + actions */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-600">Questions</span>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-slate-300 text-xs font-semibold tracking-wide text-slate-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              SWITCH TO OLD VERSION
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="border-slate-300 text-xs font-semibold tracking-wide text-slate-600"
            >
              PREVIEW
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-red-500 text-xs font-semibold tracking-wide text-white hover:bg-red-600"
              onClick={() => setShowPublish(true)}
            >
              <Send className="h-3.5 w-3.5" />
              PUBLISH AND SHARE
            </Button>
          </div>
        </div>

        {/* Form content container */}
        <div className="mx-auto w-full max-w-3xl">
          {/* Form content header */}
          <div className="flex items-center justify-between rounded-t-lg border border-slate-200 bg-white px-5 py-3">
            <span className="text-sm font-semibold text-slate-700">
              Form content
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
              All changes saved
            </div>
          </div>

          {/* Form title + description card */}
          <div className="border-x border-b border-slate-200 bg-white px-8 py-6">
            <div className="mb-4 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                Asking Parents — Sec 3 Science Centre Learning Journey
              </h1>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Published
              </span>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Dear Parent / Guardian, we are planning a learning journey to
                the Science Centre on 15 Mar 2026 for Secondary 3 students.
              </p>
              <p>
                Please answer the following questions so we can make the
                necessary arrangements for your child.
              </p>
            </div>
          </div>

          {/* Consent Questions Section */}
          <div className="mt-4 rounded-lg border border-blue-100 bg-white">
            {/* Section header */}
            <div className="relative border-b border-blue-100 px-5 pb-3 pt-2">
              <div className="mb-2 flex justify-center">
                <GripVertical className="h-4 w-4 rotate-90 text-slate-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">
                  <Flag className="h-3 w-3" />
                  Section
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                Questions for Parents
              </h2>
              <p className="text-sm text-slate-500">
                Trip Participation & Arrangements
              </p>
            </div>

            {/* Yes/No Question Cards */}
            {questions.map((q) => (
              <YesNoQuestionCard
                key={q.id}
                index={q.id}
                question={q.question}
                yesLabel={q.yesLabel}
                noLabel={q.noLabel}
              />
            ))}
          </div>
        </div>
      </main>

      <PublishShareDialog open={showPublish} onOpenChange={setShowPublish} />
      <AllEarsPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        title="Asking Parents — Sec 3 Science Centre Learning Journey"
        questions={previewQuestions}
      />
    </div>
  )
}
