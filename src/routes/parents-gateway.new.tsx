import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  MoreHorizontal,
  Paperclip,
  Send,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ChangeEvent } from 'react'
import type {
  PGAnnouncement,
  PGRecipient,
  Shortcut,
} from '@/types/pg-announcement'
import type { SelectedEntity } from '@/components/parents-gateway/entity-selector'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { StudentRecipientSelector } from '@/components/parents-gateway/student-recipient-selector'
import { SendConfirmationSheet } from '@/components/parents-gateway/send-confirmation-sheet'
import { RichTextArea } from '@/components/parents-gateway/rich-text-area'
import { PGShortcutsSelector } from '@/components/parents-gateway/pg-shortcuts-selector'
import { StaffSelector } from '@/components/parents-gateway/staff-selector'
import { EnquiryEmailSelector } from '@/components/parents-gateway/enquiry-email-selector'
import { mockStudents } from '@/data/mock-students'
import {
  getPGAnnouncementById,
  mockPGAnnouncements,
} from '@/data/mock-pg-announcements'
import { MOCK_STAFF } from '@/data/mock-staff'
import { PG_SHORTCUT_PRESETS } from '@/data/pg-shortcuts'
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

export const Route = createFileRoute('/parents-gateway/new')({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === 'string' ? search.edit : undefined,
  }),
  component: NewAnnouncementPage,
})

type SendOption = 'now' | 'scheduled'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wrap bare URLs in <a> tags, leaving existing <a> blocks and HTML tags untouched. */
function linkifyHtml(html: string): string {
  return html.replace(
    /(<a\b[^>]*>[\s\S]*?<\/a>)|(<[^>]+>)|(https?:\/\/[^\s<>"']+)/g,
    (match, aBlock, tag, url) => {
      if (aBlock ?? tag) return match
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    },
  )
}

// ---------------------------------------------------------------------------
// Upload helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Preview pane — mirrors the Parents Gateway app layout as seen by parents
// ---------------------------------------------------------------------------
interface AnnouncementPreviewProps {
  title: string
  description: string
  shortcuts: Array<Shortcut>
  staffInCharge: string
  enquiryEmail: string
  recipients: Array<SelectedEntity>
}

function AnnouncementPreview({
  title,
  description,
  shortcuts,
  staffInCharge,
  enquiryEmail,
  recipients,
}: AnnouncementPreviewProps) {
  const totalCount = recipients.reduce((s, r) => s + r.count, 0)

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

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* Card header */}
      <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
        <span className="text-sm font-semibold">Preview</span>
        <span className="text-xs text-muted-foreground">
          As seen by parents
        </span>
      </div>

      <div className="p-4">
        <p className="mb-3 text-xs text-muted-foreground">
          This is how parents will see your announcement on the Parents Gateway
          App.
        </p>

        {/* Phone mockup */}
        <div className="mx-auto max-w-[272px]">
          <div className="overflow-hidden rounded-[28px] border-[7px] border-slate-900 bg-white shadow-md">
            {/* Phone nav bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-2.5">
              <ChevronLeft className="h-5 w-5 text-slate-400" />
              <div className="flex items-center gap-3 text-slate-400">
                <ArrowUp className="h-3.5 w-3.5" />
                <ArrowDown className="h-3.5 w-3.5" />
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </div>

            {/* Scrollable content */}
            <div className="max-h-[460px] divide-y divide-slate-100 overflow-y-auto bg-white">
              {/* Announcement header */}
              <div className="px-4 py-4">
                {title ? (
                  <h3 className="text-sm font-bold leading-snug text-slate-900">
                    {title}
                  </h3>
                ) : (
                  <h3 className="text-sm font-bold leading-snug text-slate-300">
                    Announcement title
                  </h3>
                )}
                <p className="mt-1 text-[10px] text-slate-400">
                  {timestamp}
                  {' · DANIEL TAN'}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <User className="h-3 w-3 shrink-0 text-slate-400" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    STUDENT NAME
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="px-4 py-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Details
                </p>
                {description ? (
                  <div
                    className="text-xs leading-relaxed text-slate-700 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-2 [&_blockquote]:italic [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-semibold [&_h3]:text-xs [&_h3]:font-semibold [&_mark]:bg-yellow-100 [&_ol]:ml-4 [&_ol]:list-decimal [&_ul]:ml-4 [&_ul]:list-disc"
                    dangerouslySetInnerHTML={{
                      __html: linkifyHtml(description),
                    }}
                  />
                ) : (
                  <p className="text-xs leading-relaxed text-slate-300">
                    Your announcement details will appear here.
                  </p>
                )}
              </div>

              {/* Shortcuts */}
              {shortcuts.length > 0 && (
                <div className="px-4 py-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Shortcuts
                  </p>
                  <div className="space-y-2">
                    {shortcuts.map((s, i) => {
                      const preset = PG_SHORTCUT_PRESETS.find(
                        (p) => p.url === s.url,
                      )
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                        >
                          {preset ? (
                            <span className="text-base leading-none">
                              {preset.emoji}
                            </span>
                          ) : (
                            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                          )}
                          <span className="text-xs font-semibold text-slate-800">
                            {s.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Enquiry footer */}
              <div className="px-4 py-5">
                <p className="text-center text-[10px] italic text-slate-500">
                  For enquiries on this post, please contact{' '}
                  {enquiryEmail ? (
                    <span className="not-italic text-primary">
                      {enquiryEmail}
                    </span>
                  ) : (
                    <span className="not-italic text-slate-300">
                      enquiry@school.edu.sg
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient count */}
        {totalCount > 0 && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Sending to {totalCount} parent{totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Validation helper
// ---------------------------------------------------------------------------
function getValidationHint(
  sendOption: SendOption,
  title: string,
  recipients: Array<SelectedEntity>,
  scheduledDate: string,
): string | null {
  const noTitle = !title.trim()
  const noRecipients = recipients.length === 0
  if (noTitle && noRecipients)
    return 'Add a title and select recipients to continue'
  if (noTitle) return 'Add a title to continue'
  if (noRecipients) return 'Select recipients to continue'
  if (sendOption === 'scheduled' && !scheduledDate)
    return 'Select a send date to continue'
  return null
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
function NewAnnouncementPage() {
  const { edit: editId } = Route.useSearch()
  const isEditing = Boolean(editId)
  const existingAnnouncement = editId
    ? getPGAnnouncementById(editId)
    : undefined

  useSetBreadcrumbs([
    { label: 'Announcements', href: '/parents-gateway' },
    {
      label: isEditing ? 'Edit Announcement' : 'New Announcement',
      href: '/parents-gateway/new',
    },
  ])

  const navigate = useNavigate()

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [shortcuts, setShortcuts] = useState<Array<Shortcut>>([])
  const [recipients, setRecipients] = useState<Array<SelectedEntity>>([])
  const [staffInCharge, setStaffInCharge] = useState<Array<SelectedEntity>>([])
  const [enquiryEmail, setEnquiryEmail] = useState('')

  // Attachment state
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([])
  const [uploadedPhotos, setUploadedPhotos] = useState<
    Array<{ file: File; url: string }>
  >([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Send options
  const [sendOption, setSendOption] = useState<SendOption>('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('08:00')

  // UI state
  const [showConfirmSheet, setShowConfirmSheet] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep a ref so triggerAutosave doesn't need to close over title
  // (avoids recreating the function — and the Tiptap onBlur prop — on every keystroke)
  const titleRef = useRef(title)
  useEffect(() => {
    titleRef.current = title
  }, [title])

  // Autosave simulation — stable (no title dependency)
  const triggerAutosave = useCallback(() => {
    if (!titleRef.current.trim()) return
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSavedAt(new Date())
    }, 600)
  }, [])

  useEffect(() => {
    autosaveTimer.current = setInterval(triggerAutosave, 30000)
    return () => {
      if (autosaveTimer.current) clearInterval(autosaveTimer.current)
    }
  }, [triggerAutosave])

  // Pre-fill form from existing announcement when editing
  useEffect(() => {
    if (!existingAnnouncement) return
    setTitle(existingAnnouncement.title)
    setDescription(existingAnnouncement.description)
    setShortcuts(existingAnnouncement.shortcuts)
    setEnquiryEmail(existingAnnouncement.enquiryEmail)

    // Re-hydrate staffInCharge: match names back to MOCK_STAFF entries
    if (existingAnnouncement.staffInCharge) {
      const names = existingAnnouncement.staffInCharge
        .split(', ')
        .filter(Boolean)
      const staffEntities: Array<SelectedEntity> = names.flatMap((name) => {
        const found = MOCK_STAFF.find((s) => s.name === name)
        if (!found) return []
        return [
          {
            id: found.id,
            label: found.name,
            count: 1,
            type: 'individual' as const,
          },
        ]
      })
      setStaffInCharge(staffEntities)
    }

    // Re-hydrate recipients: group PGRecipients by classLabel
    if (existingAnnouncement.recipients.length > 0) {
      const byClass = new Map<string, number>()
      for (const r of existingAnnouncement.recipients) {
        byClass.set(r.classLabel, (byClass.get(r.classLabel) ?? 0) + 1)
      }
      const recipientEntities: Array<SelectedEntity> = Array.from(
        byClass.entries(),
      ).map(([cls, count]) => ({
        id: `class:${cls}`,
        label: cls,
        count,
        groupType: 'class' as const,
      }))
      setRecipients(recipientEntities)
    }

    // Restore scheduled date/time if applicable
    if (existingAnnouncement.scheduledAt) {
      const dt = new Date(existingAnnouncement.scheduledAt)
      const pad = (n: number) => String(n).padStart(2, '0')
      setScheduledDate(
        `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`,
      )
      setScheduledTime(`${pad(dt.getHours())}:${pad(dt.getMinutes())}`)
      setSendOption('scheduled')
    }
  }, [])

  // Attachment handlers
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? [])
    setUploadedFiles((prev) => [...prev, ...incoming].slice(0, 3))
    e.target.value = '' // reset so same file can be re-selected after removal
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

  // Strip HTML tags to get plain-text character count for description
  const descriptionCharCount = description.replace(/<[^>]*>/g, '').length

  // Validation
  const totalRecipientCount = recipients.reduce((s, r) => s + r.count, 0)
  const canPost = title.trim().length > 0 && recipients.length > 0
  const canSchedule =
    canPost && scheduledDate.length > 0 && scheduledTime.length > 0
  const canSubmit = sendOption === 'scheduled' ? canSchedule : canPost
  const validationHint = getValidationHint(
    sendOption,
    title,
    recipients,
    scheduledDate,
  )

  // Show a toast when user clicks the disabled submit button
  function handlePostClick() {
    if (!canSubmit) {
      toast.error(
        validationHint ?? 'Complete the required fields to continue',
        {
          duration: 3000,
        },
      )
      return
    }
    setShowConfirmSheet(true)
  }

  function getScheduledAt(): string | undefined {
    if (sendOption !== 'scheduled' || !scheduledDate) return undefined
    return new Date(
      `${scheduledDate}T${scheduledTime || '08:00'}:00`,
    ).toISOString()
  }

  function handleConfirmPost() {
    const scheduledAt = getScheduledAt()
    const isScheduled = sendOption === 'scheduled' && Boolean(scheduledAt)

    const builtRecipients: Array<PGRecipient> = recipients.flatMap((entity) => {
      if (entity.groupType === 'class') {
        const cls = entity.id.replace('class:', '')
        return mockStudents
          .filter(
            (s) =>
              s.class === cls && s.schoolName === 'Bandung Secondary School',
          )
          .map((s) => ({
            studentId: s.id,
            studentName: s.name,
            classLabel: s.class,
            parentName: `Parent of ${s.name.split(' ')[0]}`,
            readStatus: 'unread' as const,
          }))
      }
      if (entity.type === 'individual') {
        const studentId = entity.id.replace('student:', '')
        const student = mockStudents.find((s) => s.id === studentId)
        if (!student) return []
        return [
          {
            studentId: student.id,
            studentName: student.name,
            classLabel: student.class,
            parentName: `Parent of ${student.name.split(' ')[0]}`,
            readStatus: 'unread' as const,
          },
        ]
      }
      // For level / school / CCA / teaching / custom groups:
      // Expand into placeholder recipients by count (real data would come from API)
      return Array.from({ length: entity.count }, (_, i) => ({
        studentId: `mock-${entity.id}-${i}`,
        studentName: `Recipient ${i + 1} (${entity.label})`,
        classLabel: entity.label,
        parentName: `Parent ${i + 1}`,
        readStatus: 'unread' as const,
      }))
    })

    const staffLabel = staffInCharge.map((s) => s.label).join(', ')

    const newAnnouncement: PGAnnouncement = {
      id: `pg-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      shortcuts: shortcuts.filter((s) => s.label || s.url),
      websiteLinks: [],
      status: isScheduled ? 'scheduled' : 'posted',
      recipients: isScheduled ? [] : builtRecipients,
      staffInCharge: staffLabel,
      enquiryEmail: enquiryEmail.trim(),
      ownership: 'mine',
      role: 'editor',
      createdAt: new Date().toISOString(),
      postedAt: isScheduled ? undefined : new Date().toISOString(),
      scheduledAt: isScheduled ? scheduledAt : undefined,
    }

    if (isEditing && editId) {
      // Update the existing announcement in place
      const idx = mockPGAnnouncements.findIndex((a) => a.id === editId)
      if (idx !== -1) {
        mockPGAnnouncements[idx] = {
          ...mockPGAnnouncements[idx],
          title: newAnnouncement.title,
          description: newAnnouncement.description,
          shortcuts: newAnnouncement.shortcuts,
          staffInCharge: newAnnouncement.staffInCharge,
          enquiryEmail: newAnnouncement.enquiryEmail,
          status: newAnnouncement.status,
          recipients: newAnnouncement.recipients,
          postedAt: newAnnouncement.postedAt,
          scheduledAt: newAnnouncement.scheduledAt,
        }
      }
      setShowConfirmSheet(false)
      toast.success(
        isScheduled ? 'Schedule updated' : 'Announcement sent to parents',
      )
      navigate({ to: '/parents-gateway/$id', params: { id: editId } })
    } else {
      mockPGAnnouncements.unshift(newAnnouncement)
      setShowConfirmSheet(false)
      toast.success(
        isScheduled ? 'Announcement scheduled' : 'Announcement sent to parents',
      )
      navigate({
        to: '/parents-gateway/$id',
        params: { id: newAnnouncement.id },
      })
    }
  }

  const recipientClasses = [
    ...new Set(
      recipients.flatMap((r) =>
        r.groupType === 'class' ? [r.id.replace('class:', '')] : [],
      ),
    ),
  ]

  // Formatted save time
  const savedTimeLabel = savedAt
    ? savedAt.toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            render={<Link to="/parents-gateway" />}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 text-base font-semibold">
            {isEditing ? 'Edit Announcement' : 'New Announcement'}
          </h1>

          {/* Autosave status — replaces Save Draft button */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isSaving ? (
              <span>Saving…</span>
            ) : savedAt ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Saved · {savedTimeLabel}</span>
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

          {/* Split button + validation hint */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex overflow-hidden rounded-md">
              <Button
                size="sm"
                className={cn(
                  'rounded-r-none',
                  !canSubmit && 'cursor-not-allowed opacity-50',
                )}
                onClick={handlePostClick}
              >
                {sendOption === 'scheduled' ? (
                  <>
                    <CalendarClock className="mr-2 h-3.5 w-3.5" />
                    Schedule
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-3.5 w-3.5" />
                    Post Announcement
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size="sm"
                      className={cn(
                        'rounded-l-none border-l border-primary-foreground/25 px-2',
                        !canSubmit && 'cursor-not-allowed opacity-50',
                      )}
                      aria-label="Choose send option"
                    />
                  }
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSendOption('now')}>
                    <Send className="h-4 w-4" />
                    Post now
                    {sendOption === 'now' && (
                      <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSendOption('scheduled')}>
                    <CalendarClock className="h-4 w-4" />
                    Schedule for later
                    {sendOption === 'scheduled' && (
                      <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Scheduling strip */}
        {sendOption === 'scheduled' && (
          <div className="flex items-center gap-3 border-b bg-blue-50 px-6 py-2">
            <CalendarClock className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Send on</span>
            <input
              type="date"
              value={scheduledDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-300"
            />
            <span className="text-sm text-blue-600">at</span>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="ml-auto flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => setShowConfirmSheet(true)}
                disabled={!canSchedule}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                Schedule
              </Button>
              <button
                type="button"
                onClick={() => setSendOption('now')}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          </div>
        )}
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
          {/* Form sections */}
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
                    placeholder="e.g. Term 3 School Camp Consent & Payment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={triggerAutosave}
                    maxLength={120}
                  />
                </div>

                {/* Description — Tiptap rich text */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label>Description</Label>
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        descriptionCharCount > 2000
                          ? 'text-destructive'
                          : 'text-muted-foreground',
                      )}
                    >
                      {descriptionCharCount}/2000
                    </span>
                  </div>
                  <RichTextArea
                    value={description}
                    onChange={setDescription}
                    placeholder="Write your announcement here. Use the toolbar to format text and insert inline links."
                    onBlur={triggerAutosave}
                    minHeight="160px"
                  />
                </div>

                {/* Shortcuts */}
                <div className="space-y-2">
                  <Label>Shortcuts</Label>
                  <p className="text-xs text-muted-foreground">
                    To direct parents to existing features within Parents
                    Gateway app.
                  </p>
                  <PGShortcutsSelector
                    value={shortcuts}
                    onChange={setShortcuts}
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-3.5">
                  <Label>Attachments</Label>

                  {/* ── Files ── */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-600">
                        Files
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {uploadedFiles.length}/3
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add up to 3 files, less than 5 MB each.
                    </p>

                    {/* Uploaded file rows */}
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

                    {/* Add files trigger */}
                    {uploadedFiles.length < 3 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-foreground"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        {uploadedFiles.length > 0
                          ? 'Add more files'
                          : 'Add files'}
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

                  {/* ── Photos ── */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-600">
                        Photos
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {uploadedPhotos.length}/12
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add up to 12 photos, less than 5 MB each.
                    </p>

                    {/* Uploaded photo thumbnails */}
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

                    {/* Add photos trigger */}
                    {uploadedPhotos.length < 12 && (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-foreground"
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        {uploadedPhotos.length > 0
                          ? 'Add more photos'
                          : 'Add photos'}
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
              </div>
            </section>

            {/* RECIPIENTS */}
            <section className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Recipients
              </h2>
              <div className="space-y-5">
                {/* Students */}
                <div className="space-y-1.5">
                  <Label>
                    Students <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Parents of the selected students will receive this
                    announcement via Parents Gateway.
                  </p>
                  <StudentRecipientSelector
                    value={recipients}
                    onChange={setRecipients}
                  />
                </div>

                {/* Staff in charge */}
                <div className="space-y-1.5">
                  <Label>Staff in charge</Label>
                  <p className="text-xs text-muted-foreground">
                    These staff will be able to view read status, and delete the
                    announcement.
                  </p>
                  <StaffSelector
                    value={staffInCharge}
                    onChange={setStaffInCharge}
                  />
                </div>

                {/* Enquiry email */}
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

          {/* Preview pane — sticky alongside form on lg screens */}
          {showPreview && (
            <div className="lg:sticky lg:top-[60px]">
              <AnnouncementPreview
                title={title}
                description={description}
                shortcuts={shortcuts}
                staffInCharge={staffInCharge.map((s) => s.label).join(', ')}
                enquiryEmail={enquiryEmail}
                recipients={recipients}
              />
            </div>
          )}
        </div>
      </div>

      <SendConfirmationSheet
        open={showConfirmSheet}
        onOpenChange={setShowConfirmSheet}
        title={title}
        recipientClasses={recipientClasses}
        totalRecipients={totalRecipientCount}
        scheduledAt={getScheduledAt()}
        onConfirm={handleConfirmPost}
      />
    </div>
  )
}
