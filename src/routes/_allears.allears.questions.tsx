import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  GripVertical,
  Home,
  List,
  RefreshCw,
  Send,
  Trash2,
  Type,
  Flag,
} from 'lucide-react'
import { toast } from 'sonner'

import { AllearsHeader } from '@/components/allears/allears-header'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_allears/allears/questions')({
  component: QuestionsPage,
})

function QuestionsPage() {
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
              className="border-slate-300 text-xs font-semibold tracking-wide text-slate-600"
            >
              PREVIEW
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-red-500 text-xs font-semibold tracking-wide text-white hover:bg-red-600"
              onClick={() => {
                toast.success('Sent to PG', {
                  description: 'The form has been successfully sent to PG.',
                })
              }}
            >
              <Send className="h-3.5 w-3.5" />
              SEND TO PG
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
                Join Teacher&apos;s Workspace Beta Program
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Published
              </span>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>Help DXD build the future of teacher productivity!</p>
              <p>
                We&apos;re creating a unified workspace that brings all your
                teaching tools together.
              </p>
              <p>
                Share your interest in being an early adopter and help shape how
                Teacher&apos;s Workspace works.
              </p>
            </div>
          </div>

          {/* Section 1 */}
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
                Section 1
              </h2>
              <p className="text-sm text-slate-500">Teacher Profile</p>
            </div>

            {/* Q1: Free Text - Email Address */}
            <div className="mx-4 my-4 rounded-lg border border-blue-100 bg-blue-50/30 p-5">
              <div className="mb-2 flex justify-center">
                <GripVertical className="h-4 w-4 rotate-90 text-slate-300" />
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                  <Type className="h-3 w-3" />
                  Free Text
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

              <p className="mb-3 text-sm font-medium text-slate-800">
                <span className="text-red-500">*</span> Q1. Email Address
              </p>

              <textarea
                readOnly
                placeholder="Enter your answer here"
                className="w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 placeholder:text-slate-400"
                rows={3}
              />
              <div className="mt-1 text-right text-xs text-slate-400">
                0/10000
              </div>
            </div>

            {/* Q2: Multiple Choice (partially visible) */}
            <div className="mx-4 mb-4 rounded-lg border border-blue-100 bg-blue-50/30 p-5">
              <div className="mb-2 flex justify-center">
                <GripVertical className="h-4 w-4 rotate-90 text-slate-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                  <List className="h-3 w-3" />
                  Multiple Choice
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

              <p className="mt-3 text-sm font-medium text-slate-800">
                <span className="text-red-500">*</span> Q2. What is your role?
              </p>

              <div className="mt-3 space-y-2">
                {['Teacher', 'Head of Department', 'Vice Principal', 'Other'].map(
                  (option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2.5 text-sm text-slate-600"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-300" />
                      {option}
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
