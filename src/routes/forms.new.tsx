import { type ChangeEvent, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  Paperclip,
  Send,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { FormQuestion, FormType, ReminderType, ResponseType } from '@/types/form'
import type { SelectedEntity } from '@/components/parents-gateway/entity-selector'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { StudentRecipientSelector } from '@/components/parents-gateway/student-recipient-selector'
import { StaffSelector } from '@/components/parents-gateway/staff-selector'
import { EnquiryEmailSelector } from '@/components/parents-gateway/enquiry-email-selector'
import { RichTextArea } from '@/components/parents-gateway/rich-text-area'
import { PGShortcutsSelector } from '@/components/parents-gateway/pg-shortcuts-selector'
import { NativeResponseSection } from '@/components/forms/native-response-section'
import { QuestionBuilder } from '@/components/forms/question-builder'
import { AllEarsBuilderSection } from '@/components/forms/allears-builder-section'
import { LinkFormSection } from '@/components/forms/link-form-section'
import { FormPreview } from '@/components/forms/form-preview'
import { FormActivateSheet } from '@/components/forms/form-activate-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const Route = createFileRoute('/forms/new')({
  validateSearch: (search: Record<string, unknown>) => ({
    type: (
      ['quick', 'allears', 'link'].includes(search.type as string)
        ? search.type
        : 'quick'
    ) as FormType,
  }),
  component: NewFormPage,
})

function NewFormPage() {
  const { type: formType } = Route.useSearch()
  const navigate = useNavigate()

  useSetBreadcrumbs([
    { label: 'Forms', href: '/forms' },
    { label: 'New Form', href: '/forms/new' },
  ])

  // Content
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [shortcuts, setShortcuts] = useState<Array<{ label: string; url: string }>>([])

  // Attachments (quick forms only)
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([])
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ file: File; url: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? [])
    setUploadedFiles((prev) => [...prev, ...incoming].slice(0, 3))
    e.target.value = ''
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? [])
    setUploadedPhotos((prev) => {
      const remaining = 12 - prev.length
      const toAdd = incoming.slice(0, remaining).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      return [...prev, ...toAdd]
    })
    e.target.value = ''
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function removePhoto(index: number) {
    setUploadedPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  // Response (quick only)
  const [responseType, setResponseType] = useState<ResponseType>('yes-no')

  // Questions (quick only)
  const [questions, setQuestions] = useState<FormQuestion[]>([])
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

  // Link (link only)
  const [formLink, setFormLink] = useState('')

  // Event details
  const [eventStart, setEventStart] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEnd, setEventEnd] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')
  const [venue, setVenue] = useState('')

  // Settings
  const [dueDate, setDueDate] = useState('')
  const [reminderType, setReminderType] = useState<ReminderType>('none')
  const [reminderDate, setReminderDate] = useState('')

  // Recipients
  const [recipients, setRecipients] = useState<SelectedEntity[]>([])
  const [staffInCharge, setStaffInCharge] = useState<Array<{ label: string; value: string }>>([])
  const [enquiryEmail, setEnquiryEmail] = useState('')

  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [showActivateSheet, setShowActivateSheet] = useState(false)
  const [savedAt] = useState<Date | null>(null)

  const totalRecipientCount = recipients.reduce((s, r) => s + r.count, 0)
  const recipientClasses = [
    ...new Set(
      recipients.flatMap((r) =>
        r.groupType === 'class' ? [r.id.replace('class:', '')] : [],
      ),
    ),
  ]

  const canActivate =
    title.trim().length > 0 &&
    recipients.length > 0 &&
    dueDate.length > 0 &&
    (formType !== 'link' || formLink.trim().length > 0)

  function handleSwitchToAllEars() {
    navigate({ to: '/forms/new', search: { type: 'allears' } })
  }

  function handleActivateClick() {
    if (!canActivate) return
    setShowActivateSheet(true)
  }

  function handleConfirmActivate() {
    setShowActivateSheet(false)
    toast.success('Form activated and sent to parents via Parents Gateway.')
    navigate({ to: '/forms' })
  }

  const formTypeLabel =
    formType === 'quick'
      ? 'New Quick Form'
      : formType === 'allears'
        ? 'New Custom Form'
        : 'New 3rd-Party Form'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-3 border-b px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            render={<Link to="/forms" />}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="flex-1 text-base font-semibold">{formTypeLabel}</h1>

          {/* Autosave status */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {savedAt ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Saved</span>
              </>
            ) : title ? (
              <span className="text-slate-400">Draft</span>
            ) : null}
          </div>

          {/* Preview toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            className="gap-1.5"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>

          {/* Activate split button */}
          <div className="flex overflow-hidden rounded-md">
            <Button
              size="sm"
              className={cn(
                'rounded-r-none',
                !canActivate && 'cursor-not-allowed opacity-50',
              )}
              onClick={handleActivateClick}
            >
              <Send className="mr-2 h-3.5 w-3.5" />
              Activate Form
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="sm"
                    className={cn(
                      'rounded-l-none border-l border-primary-foreground/25 px-2',
                      !canActivate && 'cursor-not-allowed opacity-50',
                    )}
                    aria-label="More options"
                  />
                }
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => toast.info('Draft saved.')}>
                  Save as Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div
        className={cn(
          'mx-auto w-full px-6 py-8',
          showPreview ? 'max-w-5xl' : 'max-w-2xl',
        )}
      >
        <div
          className={cn(
            showPreview
              ? 'grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start'
              : 'space-y-6',
          )}
        >
          {/* Left: form sections */}
          <div className="space-y-6">
            {/* CONTENT */}
            <section className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Content
              </h2>
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        title.length > 120
                          ? 'text-destructive'
                          : 'text-muted-foreground',
                      )}
                    >
                      {title.length}/120
                    </span>
                  </div>
                  <Input
                    id="title"
                    placeholder="e.g. School Camp Consent Form"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                  />
                </div>

                {/* Instructions / Description */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label>Instructions</Label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {description.replace(/<[^>]*>/g, '').length}/2000
                    </span>
                  </div>
                  <RichTextArea
                    value={description}
                    onChange={setDescription}
                    placeholder="Write instructions or context for parents filling out this form."
                    minHeight="120px"
                  />
                </div>

                {/* Shortcuts */}
                <div className="space-y-2">
                  <Label>Shortcuts</Label>
                  <p className="text-xs text-muted-foreground">
                    To direct parents to existing features within Parents
                    Gateway app.
                  </p>
                  <PGShortcutsSelector value={shortcuts} onChange={setShortcuts} />
                </div>

                {/* Attachments — quick forms only */}
                {formType === 'quick' && (
                  <div className="space-y-3.5">
                    <Label>Attachments</Label>

                    {/* Files */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-600">Files</span>
                        <span className="text-xs text-muted-foreground">
                          {uploadedFiles.length}/3
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add up to 3 files, less than 5 MB each.
                      </p>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-1.5">
                          {uploadedFiles.map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-slate-700">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                              <button
                                type="button"
                                aria-label={`Remove ${file.name}`}
                                onClick={() => removeFile(i)}
                                className="shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {uploadedFiles.length < 3 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-foreground"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          {uploadedFiles.length > 0 ? 'Add more files' : 'Add files'}
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* Photos */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-600">Photos</span>
                        <span className="text-xs text-muted-foreground">
                          {uploadedPhotos.length}/12
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add up to 12 photos, less than 5 MB each.
                      </p>

                      {uploadedPhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {uploadedPhotos.map((photo, i) => (
                            <div
                              key={i}
                              className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-slate-200"
                            >
                              <img
                                src={photo.url}
                                alt={photo.file.name}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                aria-label={`Remove ${photo.file.name}`}
                                onClick={() => removePhoto(i)}
                                className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-900/65 text-white transition-colors hover:bg-slate-900/90"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {uploadedPhotos.length < 12 && (
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-foreground"
                        >
                          <ImagePlus className="h-3.5 w-3.5" />
                          {uploadedPhotos.length > 0 ? 'Add more photos' : 'Add photos'}
                        </button>
                      )}
                      <input
                        ref={photoInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* RESPONSE / BUILDER / LINK — depends on formType */}
            {formType === 'quick' && (
              <>
                <NativeResponseSection
                  value={responseType}
                  onChange={setResponseType}
                />
                {responseType === 'yes-no' && (
                  <QuestionBuilder
                    questions={questions}
                    onChange={setQuestions}
                    responseType={responseType}
                    onEditQuestion={setEditingQuestionId}
                    onSwitchToAllEars={handleSwitchToAllEars}
                  />
                )}
              </>
            )}

            {formType === 'allears' && <AllEarsBuilderSection title={title} />}

            {formType === 'link' && (
              <LinkFormSection value={formLink} onChange={setFormLink} />
            )}

            {/* EVENT DETAILS */}
            <section className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Event Details
              </h2>
              <div className="space-y-4">
                {/* Start / End */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Event start (optional)</Label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={eventStart}
                        onChange={(e) => setEventStart(e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                      />
                      <input
                        type="time"
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        className="w-24 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Event end (optional)</Label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={eventEnd}
                        onChange={(e) => setEventEnd(e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                      />
                      <input
                        type="time"
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        className="w-24 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>

                {/* Venue */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label>Venue (optional)</Label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {venue.length}/100
                    </span>
                  </div>
                  <Input
                    placeholder="e.g. School hall, Pasir Ris Park"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>
            </section>

            {/* SETTINGS */}
            <section className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Settings
              </h2>
              <div className="space-y-5">
                {/* Due date */}
                <div className="space-y-1.5">
                  <Label>
                    Due date to respond by{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <input
                    type="date"
                    value={dueDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                  {dueDate && (
                    <p className="text-xs text-muted-foreground">
                      Default reminder will be sent on:{' '}
                      {new Date(dueDate).toLocaleDateString('en-SG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Additional reminders */}
                <div className="space-y-2">
                  <Label>Send additional reminder(s) to parents</Label>
                  <div className="space-y-2">
                    {(
                      [
                        { value: 'none', label: 'None' },
                        { value: 'one-time', label: 'One Time' },
                        { value: 'daily', label: 'Daily' },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="reminder"
                          value={opt.value}
                          checked={reminderType === opt.value}
                          onChange={() => setReminderType(opt.value)}
                          className="h-3.5 w-3.5 accent-primary"
                        />
                        <span className="text-sm">{opt.label}</span>
                        {reminderType === opt.value &&
                          opt.value !== 'none' && (
                            <div className="flex items-center gap-2 ml-2">
                              <span className="text-xs text-muted-foreground">
                                {opt.value === 'one-time' ? 'on' : 'from'}
                              </span>
                              <input
                                type="date"
                                value={reminderDate}
                                onChange={(e) =>
                                  setReminderDate(e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                              />
                            </div>
                          )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* RECIPIENTS */}
            <section className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Recipients
              </h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>
                    Students <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Parents of the selected students will receive this form via
                    Parents Gateway.
                  </p>
                  <StudentRecipientSelector
                    value={recipients}
                    onChange={setRecipients}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Staff in charge</Label>
                  <p className="text-xs text-muted-foreground">
                    These staff will be able to view responses and manage this
                    form.
                  </p>
                  <StaffSelector
                    value={staffInCharge}
                    onChange={setStaffInCharge}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Enquiry email</Label>
                  <p className="text-xs text-muted-foreground">
                    Select the preferred email address to receive enquiries from
                    parents.
                  </p>
                  <EnquiryEmailSelector
                    value={enquiryEmail}
                    onChange={setEnquiryEmail}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right: preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-[60px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Preview</span>
                <span className="text-xs text-muted-foreground">
                  As seen by parents
                </span>
              </div>
              <FormPreview
                formType={formType}
                title={title}
                description={description.replace(/<[^>]*>/g, '')}
                responseType={formType === 'quick' ? responseType : undefined}
                dueDate={dueDate}
                questions={formType === 'quick' ? questions : []}
                activeEditingQuestionId={editingQuestionId}
              />
            </div>
          )}
        </div>
      </div>

      <FormActivateSheet
        open={showActivateSheet}
        onOpenChange={setShowActivateSheet}
        title={title}
        formType={formType}
        responseType={formType === 'quick' ? responseType : undefined}
        dueDate={dueDate}
        reminderType={reminderType}
        reminderDate={reminderDate}
        recipientClasses={recipientClasses}
        totalRecipients={totalRecipientCount}
        onConfirm={handleConfirmActivate}
      />
    </div>
  )
}
