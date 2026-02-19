// src/routes/forms.$id.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Bell, ChevronLeft, Download, X } from 'lucide-react'
import { mockForms } from '@/data/mock-forms'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/forms/$id')({
  component: FormResponsePage,
})

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-sm font-semibold tabular-nums text-slate-500">
        {pct}%
      </span>
    </div>
  )
}

function QuestionBreakdown({ form }: { form: (typeof mockForms)[0] }) {
  if (form.questions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <p className="text-sm italic text-slate-400">No questions in this form.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {form.questions.map((q, i) => {
        const respondedAnswers = form.responses
          .filter((r) => r.responded && r.answers?.[q.id])
          .map((r) => r.answers![q.id] as string)

        const tally: Record<string, number> = {}
        respondedAnswers.forEach((ans) => {
          if (ans) tally[ans] = (tally[ans] ?? 0) + 1
        })

        const options =
          q.type === 'yes-no'
            ? ['Yes', 'No']
            : q.type === 'mcq'
              ? (q.options ?? Object.keys(tally))
              : Object.keys(tally)

        const typeLabel =
          q.type === 'yes-no'
            ? 'Yes / No'
            : q.type === 'mcq'
              ? 'Multiple Choice'
              : 'Short Answer'

        const totalAnswered = respondedAnswers.length

        return (
          <div
            key={q.id}
            className="rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Question header */}
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Q{i + 1} · {typeLabel}
              </span>
              {q.conditionalOn && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Conditional
                </span>
              )}
            </div>

            <p className="mb-4 text-sm font-medium leading-relaxed text-slate-700">{q.text}</p>

            {/* Response count chip */}
            <p className="mb-3 text-xs text-slate-400">
              {totalAnswered} response{totalAnswered !== 1 ? 's' : ''}
            </p>

            {/* Answer breakdown */}
            {q.type === 'short-answer' ? (
              <div className="flex flex-col gap-1.5">
                {Object.entries(tally)
                  .filter(([k]) => k)
                  .sort(([, a], [, b]) => b - a)
                  .map(([answer, count]) => (
                    <div
                      key={answer}
                      className="flex items-start justify-between gap-2 rounded-md bg-slate-50 px-3 py-2"
                    >
                      <p className="text-sm text-slate-700">"{answer}"</p>
                      <span className="shrink-0 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                        {count}
                      </span>
                    </div>
                  ))}
                {Object.keys(tally).filter((k) => k).length === 0 && (
                  <p className="text-sm italic text-slate-400">No text responses yet.</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {options.map((opt) => {
                  const count = tally[opt] ?? 0
                  const pct = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0
                  return (
                    <div key={opt} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-right text-xs leading-tight text-slate-500">
                        {opt}
                      </span>
                      <div className="flex flex-1 items-center gap-2">
                        <div className="h-5 flex-1 overflow-hidden rounded-sm bg-slate-100">
                          <div
                            className="h-full rounded-sm transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: '#1a3a5c',
                            }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs font-semibold tabular-nums text-slate-600">
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function FormResponsePage() {
  const { id } = Route.useParams()
  const form = mockForms.find((f) => f.id === id) ?? mockForms[0]
  const [showNonRespondents, setShowNonRespondents] = useState(false)

  useSetBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Parent Forms', href: '/forms' },
    { label: form.title, href: `/forms/${id}` },
  ])

  const displayed = showNonRespondents
    ? form.responses.filter((r) => !r.responded)
    : form.responses

  const daysLeft = Math.ceil(
    (form.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )

  const statusDotColor =
    form.status === 'active'
      ? '#16a34a'
      : form.status === 'draft'
        ? '#f59e0b'
        : '#94a3b8'

  const statusLabel =
    form.status.charAt(0).toUpperCase() + form.status.slice(1)

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
      {/* Back link */}
      <Link
        to="/forms"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to forms
      </Link>

      {/* Title row + action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-800">{form.title}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
            {/* Status dot */}
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: statusDotColor }}
              />
              {statusLabel}
            </span>

            {form.groups.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>Sent to {form.groups.map((g) => g.name).join(', ')}</span>
              </>
            )}

            <span aria-hidden="true">·</span>
            <span>
              Due{' '}
              {form.deadline.toLocaleDateString('en-SG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              {daysLeft > 0 ? (
                <span className="ml-1 text-amber-500">({daysLeft}d left)</span>
              ) : (
                <span className="ml-1 text-slate-400">(closed)</span>
              )}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-wrap gap-2">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100">
            <Bell className="size-4" />
            Send Reminder
          </button>
          <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100">
            <Download className="size-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 active:bg-red-100">
            <X className="size-4" />
            Close Form
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Numerics */}
          <div className="shrink-0">
            <p
              className="text-4xl font-bold tabular-nums leading-none"
              style={{ color: '#1a3a5c' }}
            >
              {form.responseCount}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              of {form.totalRecipients} parents responded
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex-1">
            <ProgressBar value={form.responseCount} total={form.totalRecipients} />
          </div>

          {/* Pending badge */}
          {form.totalRecipients - form.responseCount > 0 && (
            <div className="shrink-0 rounded-lg bg-amber-50 px-3 py-2 text-center">
              <p className="text-lg font-bold tabular-nums text-amber-600">
                {form.totalRecipients - form.responseCount}
              </p>
              <p className="text-xs text-amber-500">pending</p>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* ---- Left: per-question breakdown ---- */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Response Breakdown</h2>
          <QuestionBreakdown form={form} />
        </section>

        {/* ---- Right: respondent table ---- */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Respondents</h2>
            <button
              onClick={() => setShowNonRespondents(!showNonRespondents)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: showNonRespondents ? '#fef2f2' : 'transparent',
                color: showNonRespondents ? '#dc2626' : '#64748b',
                border: `1px solid ${showNonRespondents ? '#fecaca' : '#e2e8f0'}`,
              }}
            >
              {showNonRespondents ? 'Show all' : 'Non-respondents only'}
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 text-left font-medium text-slate-500">Student</th>
                  <th className="px-3 py-2.5 text-left font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayed.map((r) => (
                  <tr key={r.studentName} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-700">{r.studentName}</td>
                    <td className="px-3 py-2.5">
                      {r.responded ? (
                        <span className="flex items-center gap-1 font-medium text-green-600">
                          ✓{' '}
                          <span>
                            Responded
                            {r.submittedAt && (
                              <span className="ml-1 font-normal text-slate-400">
                                {r.submittedAt.toLocaleDateString('en-SG', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            )}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-6 text-center text-sm italic text-slate-400"
                    >
                      All parents have responded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Legend counts */}
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <span>
              <span className="font-semibold text-green-600">{form.responseCount}</span> responded
            </span>
            <span>
              <span className="font-semibold text-amber-500">
                {form.totalRecipients - form.responseCount}
              </span>{' '}
              pending
            </span>
            <span>
              <span className="font-semibold text-slate-700">{form.totalRecipients}</span> total
            </span>
          </div>
        </section>
      </div>
    </main>
  )
}
