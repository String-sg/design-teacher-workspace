import { useState } from 'react'
import {
  CheckSquare,
  ChevronDown,
  Copy,
  Eye,
  Flag,
  GripHorizontal,
  GripVertical,
  Image,
  List,
  Maximize2,
  Minimize2,
  Plus,
  Text,
  Trash2,
  Trophy,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { AllEarsPreviewDialog } from '@/components/allears/allears-preview-dialog'

interface Question {
  id: string
  type: 'multiple-choice' | 'checkbox' | 'free-text' | 'ranking'
  question: string
  options?: string[]
  required: boolean
}

interface AllEarsBuilderSectionProps {
  title?: string
}

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'Q1. Is your child able to participate in the activity?',
    options: ['Yes, my child can attend.', 'No, my child cannot attend.'],
    required: true,
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question:
      'Q2. Does your child have any allergies, medical conditions, or dietary requirements?',
    options: ['Yes, I will provide details.', 'No, nothing to declare.'],
    required: true,
  },
]

const TYPE_LABELS: Record<Question['type'], string> = {
  'multiple-choice': 'Multiple Choice',
  checkbox: 'Checkbox',
  'free-text': 'Free Text Answer',
  ranking: 'Ranking',
}

const ADD_OPTIONS = [
  {
    group: 'Question',
    items: [
      { type: 'checkbox' as const, icon: CheckSquare, label: 'Checkbox' },
      { type: 'free-text' as const, icon: Text, label: 'Free Text Answer' },
      { type: 'multiple-choice' as const, icon: List, label: 'Multiple Choice' },
      { type: 'ranking' as const, icon: Trophy, label: 'Ranking' },
    ],
  },
  {
    group: 'Content',
    items: [
      { type: null, icon: Image, label: 'Image' },
      { type: null, icon: Flag, label: 'Section' },
    ],
  },
]

export function AllEarsBuilderSection({ title }: AllEarsBuilderSectionProps) {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
  const [editingId, setEditingId] = useState<string | null>('q2')
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  // Preview state
  const [showPreview, setShowPreview] = useState(false)

  function addQuestion(type: Question['type']) {
    const n = questions.length + 1
    const newQ: Question = {
      id: `q${Date.now()}`,
      type,
      question: `Q${n}. New question`,
      options:
        type === 'multiple-choice' || type === 'checkbox'
          ? ['Option 1', 'Option 2']
          : undefined,
      required: false,
    }
    setQuestions([...questions, newQ])
    setEditingId(newQ.id)
    setShowAddMenu(false)
  }

  function deleteQuestion(id: string) {
    setQuestions(questions.filter((q) => q.id !== id))
    if (editingId === id) setEditingId(null)
    setMoreMenuId(null)
  }

  function duplicateQuestion(id: string) {
    const q = questions.find((q) => q.id === id)
    if (!q) return
    const copy: Question = { ...q, id: `q${Date.now()}` }
    const idx = questions.findIndex((q) => q.id === id)
    const next = [...questions]
    next.splice(idx + 1, 0, copy)
    setQuestions(next)
    setMoreMenuId(null)
  }

  function updateOption(qId: string, idx: number, value: string) {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options?.map((o, i) => (i === idx ? value : o)) }
          : q,
      ),
    )
  }

  function addOption(qId: string) {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: [
                ...(q.options ?? []),
                `Option ${(q.options?.length ?? 0) + 1}`,
              ],
            }
          : q,
      ),
    )
  }

  function toggleRequired(qId: string) {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, required: !q.required } : q,
      ),
    )
  }

  // The question before q2 for the condition builder label
  const q1 = questions[0]

  const builderContent = (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f0f2f7]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
        <span className="text-sm font-semibold text-primary">
          Form content
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-green-500">✓</span>
            All changes saved
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowPreview(true) }}
              className="ml-1 flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
              title="Preview form"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Preview</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title={expanded ? 'Exit fullscreen' : 'Expand builder'}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </span>
        </div>

        <div className="p-4 space-y-2">
          {questions.map((q) => {
            const isEditing = editingId === q.id
            const showMore = moreMenuId === q.id

            return (
              <div
                key={q.id}
                onClick={() => {
                  setEditingId(q.id)
                  setMoreMenuId(null)
                }}
                className={cn(
                  'overflow-hidden rounded-xl border-2 bg-white cursor-pointer transition-colors',
                  isEditing ? 'border-primary' : 'border-transparent',
                )}
              >
                {/* Drag handle */}
                <div className="flex justify-center py-1 text-slate-300">
                  <GripHorizontal className="h-3.5 w-3.5" />
                </div>

                {isEditing ? (
                  /* ── Expanded editing state ── */
                  <div className="px-4 pb-4 space-y-3">
                    {/* Title row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Q{questions.indexOf(q) + 1}.{' '}
                        {TYPE_LABELS[q.type]} Question
                      </span>
                      <div className="flex items-center gap-2">
                        <label
                          className="flex items-center gap-1.5 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={() => toggleRequired(q.id)}
                            className="h-3.5 w-3.5 accent-primary"
                          />
                          <span className="text-xs font-medium text-slate-600">
                            Required
                          </span>
                        </label>
                        <div className="h-4 w-px bg-slate-200" />
                        {/* "..." more menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMoreMenuId(showMore ? null : q.id)
                            }}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {showMore && (
                            <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  duplicateQuestion(q.id)
                                }}
                                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Copy className="h-4 w-4 text-slate-500" />
                                Duplicate
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteQuestion(q.id)
                                }}
                                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-slate-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question text input */}
                    <div className="rounded-lg border-2 border-primary/40 bg-white px-3 py-2">
                      <p className="text-sm text-slate-800 mb-2">
                        {q.question}
                      </p>
                      {/* Formatting toolbar */}
                      <div className="flex items-center gap-3 border-t border-slate-100 pt-2">
                        {['B', 'I', 'U'].map((f) => (
                          <button
                            key={f}
                            type="button"
                            className="text-xs font-bold text-slate-400 hover:text-slate-700"
                          >
                            {f}
                          </button>
                        ))}
                        <div className="h-3 w-px bg-slate-200" />
                        <button
                          type="button"
                          className="text-xs text-slate-400"
                        >
                          ↩
                        </button>
                        <button
                          type="button"
                          className="text-xs text-slate-400"
                        >
                          ↪
                        </button>
                      </div>
                    </div>

                    {/* Options */}
                    {q.options && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-700">
                            <span className="text-red-500 mr-0.5">*</span>
                            Options
                          </p>
                          <button
                            type="button"
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            How to bulk paste?
                          </button>
                        </div>
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                updateOption(q.id, i, e.target.value)
                              }
                              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                              type="button"
                              className="text-slate-300 hover:text-slate-500"
                            >
                              <GripVertical className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="text-slate-300 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            addOption(q.id)
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add another option
                        </button>

                        {/* Toggles */}
                        <div className="space-y-2.5 border-t border-slate-100 pt-3">
                          {[
                            'Set a limit for each option',
                            'Show options as dropdown',
                          ].map((label) => (
                            <div
                              key={label}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-slate-600">
                                {label}
                              </span>
                              {/* Toggle pill */}
                              <div className="h-5 w-9 rounded-full bg-slate-200 relative">
                                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Display conditions */}
                        <div className="border-t border-slate-100 pt-3 space-y-2.5">
                          <div>
                            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                              <span className="text-slate-500">↳</span>
                              Display Conditions
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Set the conditions for when this field appears
                            </p>
                          </div>
                          {/* Condition row */}
                          {q1 && (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-600">
                                Show this field if{' '}
                                <span className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-medium">
                                  All
                                  <ChevronDown className="h-3 w-3" />
                                </span>{' '}
                                of the following conditions are met.
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-1 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600">
                                  <span className="truncate">
                                    {q1.question.length > 30
                                      ? q1.question.slice(0, 30) + '…'
                                      : q1.question}
                                  </span>
                                  <ChevronDown className="h-3 w-3 shrink-0 ml-auto" />
                                </div>
                                <span className="text-xs text-slate-500 shrink-0">
                                  is
                                </span>
                                <div className="flex flex-1 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600">
                                  <span className="truncate">
                                    {q1.options?.[0] ?? 'Any value'}
                                  </span>
                                  <ChevronDown className="h-3 w-3 shrink-0 ml-auto" />
                                </div>
                                <button
                                  type="button"
                                  className="shrink-0 text-slate-300 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300"
                            >
                              + Add another condition
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Collapsed view state ── */
                  <div className="px-4 pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        <List className="h-3 w-3" />
                        {TYPE_LABELS[q.type]}
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setMoreMenuId(showMore ? null : q.id)
                          }}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {showMore && (
                          <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                duplicateQuestion(q.id)
                              }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Copy className="h-4 w-4 text-slate-500" />
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteQuestion(q.id)
                              }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-slate-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-800">
                      {q.required && (
                        <span className="text-red-500 mr-1">*</span>
                      )}
                      {q.question}
                    </p>
                    {q.options && (
                      <div className="space-y-1">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-300" />
                            <span className="text-xs text-slate-500">
                              {opt}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Add content button + dropdown */}
          <div className="relative pt-1">
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add content
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  showAddMenu && 'rotate-180',
                )}
              />
            </button>

            {showAddMenu && (
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg z-10">
                {ADD_OPTIONS.map((group, gi) => (
                  <div key={group.group}>
                    <p className="px-4 py-1.5 text-xs font-bold text-slate-800">
                      {group.group}
                    </p>
                    {group.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() =>
                          item.type
                            ? addQuestion(item.type)
                            : setShowAddMenu(false)
                        }
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <item.icon className="h-4 w-4 text-slate-500" />
                        {item.label}
                      </button>
                    ))}
                    {gi < ADD_OPTIONS.length - 1 && (
                      <div className="my-1 border-t border-slate-100" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  )


  return (
    <section className="rounded-xl border bg-white p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Build your form
      </h2>

      {/* Inline builder (hidden when expanded Dialog is open) */}
      {!expanded && builderContent}

      {/* Expanded Dialog */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          className="max-w-5xl sm:max-w-5xl"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Build your form</DialogTitle>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto -mx-6 px-6">
            {builderContent}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <AllEarsPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        title={title}
        questions={questions}
      />
    </section>
  )
}
