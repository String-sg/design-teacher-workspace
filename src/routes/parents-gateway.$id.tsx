import { useMemo, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarClock,
  Lock,
  Mail,
  MessageSquare,
  Paperclip,
  Plus,
  User,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { getPGAnnouncementById } from '@/data/mock-pg-announcements'
import { getStudentById } from '@/data/mock-students'
import { CLASS_GROUPS } from '@/data/mock-student-groups'
import { PG_SHORTCUT_PRESETS } from '@/data/pg-shortcuts'
import { PGStatusBadge } from '@/components/parents-gateway/pg-status-badge'
import { PGReadRate } from '@/components/parents-gateway/pg-read-rate'

import { RecipientReadTable } from '@/components/parents-gateway/recipient-read-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/parents-gateway/$id')({
  loader: ({ params }) => {
    const announcement = getPGAnnouncementById(params.id)
    if (!announcement) throw notFound()
    return { announcement }
  },
  component: AnnouncementDetailPage,
})

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Strip HTML tags to produce plain text for textarea display */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

function AnnouncementDetailPage() {
  const { announcement: loadedAnnouncement } = Route.useLoaderData()

  // ---------------------------------------------------------------------------
  // Local shadow state — allows optimistic saves without a backend
  // ---------------------------------------------------------------------------
  const [savedData, setSavedData] = useState({
    title: loadedAnnouncement.title,
    description: loadedAnnouncement.description,
    staffInCharge: loadedAnnouncement.staffInCharge,
    enquiryEmail: loadedAnnouncement.enquiryEmail,
    recipients: loadedAnnouncement.recipients,
    scheduledAt: loadedAnnouncement.scheduledAt,
  })

  // Merge loaded (immutable) fields with local overrides
  const announcement = { ...loadedAnnouncement, ...savedData }

  // ---------------------------------------------------------------------------
  // Edit mode state
  // ---------------------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStaffInCharge, setEditStaffInCharge] = useState('')
  const [editEnquiryEmail, setEditEnquiryEmail] = useState('')
  const [editClasses, setEditClasses] = useState<Array<string>>([])

  // ---------------------------------------------------------------------------
  // Schedule edit state
  // ---------------------------------------------------------------------------
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [editScheduleDate, setEditScheduleDate] = useState('')
  const [editScheduleTime, setEditScheduleTime] = useState('')

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------
  const responseType = announcement.responseType ?? 'view-only'
  const totalCount = savedData.recipients.length
  const readCount = savedData.recipients.filter(
    (r) => r.readStatus === 'read',
  ).length
  const unreadCount = totalCount - readCount

  // Response-type-aware stats
  const acknowledgedCount = savedData.recipients.filter(
    (r) => r.respondedAt != null || r.acknowledgedAt != null,
  ).length
  const pendingAckCount = totalCount - acknowledgedCount
  const respondedCount = savedData.recipients.filter(
    (r) => r.respondedAt != null,
  ).length
  const yesCount = savedData.recipients.filter((r) => r.formResponse === 'yes').length
  const noCount = savedData.recipients.filter((r) => r.formResponse === 'no').length
  const pendingResponseCount = totalCount - respondedCount

  const uniqueClasses = useMemo(
    () => [...new Set(savedData.recipients.map((r) => r.classLabel))].sort(),
    [savedData.recipients],
  )

  // Class labels available to add (not already in current edit selection)
  const addableClasses = useMemo(
    () =>
      CLASS_GROUPS.map((g) => g.label).filter((l) => !editClasses.includes(l)),
    [editClasses],
  )

  const postedDate = announcement.postedAt
    ? formatDateTime(announcement.postedAt)
    : null
  const scheduledDate = savedData.scheduledAt
    ? formatDateTime(savedData.scheduledAt)
    : null

  const isViewer = announcement.role === 'viewer'
  const isShared = announcement.ownership === 'shared'

  // Posted announcements lock content; only metadata fields are editable
  const contentLocked = announcement.status === 'posted'

  useSetBreadcrumbs([
    { label: 'Announcements', href: '/parents-gateway' },
    { label: announcement.title, href: `/parents-gateway/${announcement.id}` },
  ])

  // ---------------------------------------------------------------------------
  // Edit handlers
  // ---------------------------------------------------------------------------
  function startEditing() {
    setEditTitle(savedData.title)
    setEditDescription(stripHtml(savedData.description))
    setEditStaffInCharge(savedData.staffInCharge)
    setEditEnquiryEmail(savedData.enquiryEmail)
    setEditClasses([...uniqueClasses])
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
  }

  function startEditingSchedule() {
    const current = savedData.scheduledAt
      ? new Date(savedData.scheduledAt)
      : new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setEditScheduleDate(
      `${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`,
    )
    setEditScheduleTime(
      `${pad(current.getHours())}:${pad(current.getMinutes())}`,
    )
    setIsEditingSchedule(true)
  }

  function cancelEditingSchedule() {
    setIsEditingSchedule(false)
  }

  function saveSchedule() {
    if (!editScheduleDate) return
    const newScheduledAt = new Date(
      `${editScheduleDate}T${editScheduleTime || '08:00'}:00`,
    ).toISOString()
    setSavedData((prev) => ({ ...prev, scheduledAt: newScheduledAt }))
    toast.success('Schedule updated')
    setIsEditingSchedule(false)
  }

  function saveEditing() {
    // For posted: only staff in charge, recipients, and enquiry email can change.
    // For draft/scheduled: additionally title and description.
    const updatedRecipients = savedData.recipients.filter((r) =>
      editClasses.includes(r.classLabel),
    )

    setSavedData((prev) => ({
      ...prev,
      ...(!contentLocked
        ? {
            title: editTitle.trim(),
            description: editDescription.trim()
              ? `<p>${editDescription.trim()}</p>`
              : prev.description,
          }
        : {}),
      staffInCharge: editStaffInCharge.trim(),
      enquiryEmail: editEnquiryEmail.trim(),
      recipients: updatedRecipients,
    }))
    toast.success('Changes saved')
    setIsEditing(false)
  }

  function removeClass(cls: string) {
    setEditClasses((prev) => prev.filter((c) => c !== cls))
  }

  function addClass(cls: string) {
    setEditClasses((prev) => [...prev, cls].sort())
  }

  return (
    <div className="flex flex-col gap-6 pt-6">
      {/* ── Header ── */}
      <div className="px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="mt-0.5 shrink-0"
              render={<Link to="/parents-gateway" />}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{announcement.title}</h1>
                <PGStatusBadge status={announcement.status} />
              </div>
              {postedDate && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Posted {postedDate}
                  {' · Daniel Tan'}
                  {isShared && isViewer && (
                    <span className="ml-2 inline-flex items-center gap-1 text-slate-400">
                      <Lock className="h-3 w-3" />
                      Viewer
                    </span>
                  )}
                </p>
              )}
              {announcement.status === 'scheduled' &&
                (isEditingSchedule ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <input
                      type="date"
                      value={editScheduleDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditScheduleDate(e.target.value)}
                      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                      type="time"
                      value={editScheduleTime}
                      onChange={(e) => setEditScheduleTime(e.target.value)}
                      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <Button
                      size="sm"
                      onClick={saveSchedule}
                      disabled={!editScheduleDate}
                    >
                      Save
                    </Button>
                    <button
                      type="button"
                      onClick={cancelEditingSchedule}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-amber-600">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Scheduled for {scheduledDate}
                    <span className="text-muted-foreground">· Daniel Tan</span>
                    {!isViewer && (
                      <button
                        type="button"
                        onClick={startEditingSchedule}
                        className="ml-1 text-xs font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </p>
                ))}
              {announcement.status === 'draft' && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Not yet sent
                  {isShared && (
                    <span className="ml-2 inline-flex items-center gap-1 text-slate-400">
                      <Users className="h-3 w-3" />
                      Shared
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Edit / Save / Cancel */}
          {isViewer ? (
            <Button variant="outline" size="sm" disabled>
              <Lock className="h-3.5 w-3.5" />
              View only
            </Button>
          ) : isEditing ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveEditing}>
                Save changes
              </Button>
            </div>
          ) : announcement.status === 'draft' ||
            announcement.status === 'scheduled' ? (
            <Button
              variant="default"
              size="sm"
              render={
                <Link
                  to="/parents-gateway/new"
                  search={{ edit: announcement.id }}
                />
              }
            >
              Edit
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startEditing}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 px-6 lg:grid-cols-3">
        {/* ── Left: read tracking (2/3) ── */}
        <div className="space-y-6 lg:col-span-2">
          {announcement.status === 'posted' && responseType === 'view-only' && (
            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Read by parents
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {readCount}
                    <span className="text-xl font-normal text-muted-foreground">
                      {' '}
                      / {totalCount}
                    </span>
                  </p>
                  {unreadCount > 0 ? (
                    <p className="mt-1 text-sm text-amber-600">
                      {unreadCount} unread
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-green-700">All read</p>
                  )}
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-twblue-2">
                  <Users className="h-7 w-7 text-twblue-9" />
                </div>
              </div>
              <div className="mt-4">
                <PGReadRate
                  readCount={readCount}
                  totalCount={totalCount}
                  className="w-full [&>div:first-child]:h-2 [&>div:first-child]:w-full"
                />
              </div>
            </div>
          )}

          {announcement.status === 'posted' && responseType === 'acknowledge' && (
            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Acknowledged by parents
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {acknowledgedCount}
                    <span className="text-xl font-normal text-muted-foreground">
                      {' '}
                      / {totalCount}
                    </span>
                  </p>
                  {pendingAckCount > 0 ? (
                    <p className="mt-1 text-sm text-amber-600">
                      {pendingAckCount} pending
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-green-700">All acknowledged</p>
                  )}
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-twblue-2">
                  <Users className="h-7 w-7 text-twblue-9" />
                </div>
              </div>
              <div className="mt-4">
                <PGReadRate
                  readCount={acknowledgedCount}
                  totalCount={totalCount}
                  className="w-full [&>div:first-child]:h-2 [&>div:first-child]:w-full"
                />
              </div>
            </div>
          )}

          {announcement.status === 'posted' && responseType === 'yes-no' && (
            <div className="rounded-lg border bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Responses received
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {respondedCount}
                    <span className="text-xl font-normal text-muted-foreground">
                      {' '}
                      / {totalCount}
                    </span>
                  </p>
                  {pendingResponseCount > 0 ? (
                    <p className="mt-1 text-sm text-amber-600">
                      {pendingResponseCount} no response
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-green-700">All responded</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-green-700">{yesCount}</p>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Yes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-rose-600">{noCount}</p>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">No</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <PGReadRate
                  readCount={respondedCount}
                  totalCount={totalCount}
                  className="w-full [&>div:first-child]:h-2 [&>div:first-child]:w-full"
                />
              </div>
            </div>
          )}

          {announcement.status === 'scheduled' && (
            <div className="flex h-40 items-center justify-center rounded-lg border bg-white">
              <div className="flex flex-col items-center gap-2 text-center">
                <CalendarClock className="h-8 w-8 text-blue-400" />
                <p className="text-sm text-muted-foreground">
                  Read tracking will be available after the announcement is
                  sent.
                </p>
              </div>
            </div>
          )}

          {announcement.status === 'posted' && totalCount > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {responseType === 'acknowledge'
                  ? 'Acknowledgement status'
                  : responseType === 'yes-no'
                    ? 'Response status'
                    : 'Recipient read status'}
              </h2>
              <RecipientReadTable
                recipients={savedData.recipients}
                announcementTitle={announcement.title}
                responseType={responseType}
                questions={announcement.questions}
              />
            </div>
          )}

          {announcement.status === 'draft' && (
            <div className="flex h-40 items-center justify-center rounded-lg border bg-white">
              <p className="text-sm text-muted-foreground">
                Send this announcement to start tracking read status.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: announcement content (1/3) ── */}
        <div className="space-y-4">
          {/* Announcement card */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Announcement
            </h2>
            <div className="space-y-3">
              {/* Title */}
              {isEditing && !contentLocked ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Title
                  </p>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-sm font-medium"
                  />
                </div>
              ) : (
                <p
                  className={cn(
                    'font-medium',
                    isEditing && contentLocked && 'text-muted-foreground',
                  )}
                >
                  {announcement.title}
                </p>
              )}

              {/* Description */}
              {isEditing && !contentLocked ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Description
                  </p>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={5}
                    className="resize-none text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Formatting is simplified here. Use the compose form for
                    rich-text editing.
                  </p>
                </div>
              ) : (
                announcement.description && (
                  <p
                    className={cn(
                      'text-sm leading-relaxed',
                      isEditing && contentLocked
                        ? 'text-muted-foreground/60'
                        : 'text-muted-foreground',
                    )}
                  >
                    {stripHtml(announcement.description)}
                  </p>
                )
              )}

              {/* Locked content notice */}
              {isEditing && contentLocked && (
                <p className="flex items-center gap-1.5 rounded-md bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3 shrink-0" />
                  Title, description, and shortcuts cannot be edited after
                  posting.
                </p>
              )}

              {/* Shortcuts — only shown when the announcement has relevant ones */}
              {announcement.shortcuts.length > 0 && (
                <div
                  className={cn(
                    'space-y-1.5 border-t pt-3',
                    isEditing && contentLocked && 'opacity-50',
                  )}
                >
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Shortcuts
                  </p>
                  {PG_SHORTCUT_PRESETS.filter((preset) =>
                    announcement.shortcuts.some((s) => s.url === preset.url),
                  ).map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-blue-600 bg-blue-600 text-white">
                        <svg
                          viewBox="0 0 10 8"
                          fill="none"
                          className="h-2.5 w-2.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 4l3 3 5-6" />
                        </svg>
                      </span>
                      <p className="text-sm font-medium text-blue-900">
                        {preset.composerLabel}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Attachments */}
              {announcement.attachments &&
                announcement.attachments.length > 0 && (
                  <div className="space-y-1.5 border-t pt-3">
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                      Attachments
                    </p>
                    {announcement.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 truncate text-sm">
                          {att.name}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {att.size}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Questions — shown for acknowledge / yes-no types */}
              {announcement.questions && announcement.questions.length > 0 && (
                <div className="space-y-2 border-t pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Questions asked
                  </p>
                  {announcement.questions.map((q, i) => (
                    <div key={q.id} className="rounded-md bg-slate-50 px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-snug text-foreground">
                            {q.text}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {q.type === 'mcq' && q.options ? (
                              q.options.map((opt) => (
                                <span
                                  key={opt}
                                  className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-muted-foreground"
                                >
                                  {opt}
                                </span>
                              ))
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                Open-ended
                              </span>
                            )}
                          </div>
                          {q.showAfter && q.showAfter !== 'both' && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Shown after:{' '}
                              <span className={cn(
                                'font-medium',
                                q.showAfter === 'yes' ? 'text-green-700' : 'text-rose-600',
                              )}>
                                {q.showAfter === 'yes' ? 'Yes' : 'No'}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enquiry email — above staff in charge */}
              {isEditing ? (
                <div className="space-y-1 border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Enquiry email
                  </p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={editEnquiryEmail}
                      onChange={(e) => setEditEnquiryEmail(e.target.value)}
                      placeholder="enquiry@school.edu.sg"
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              ) : (
                announcement.enquiryEmail && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground">
                      Enquiry contact
                    </p>
                    <a
                      href={`mailto:${announcement.enquiryEmail}`}
                      className="truncate text-sm font-medium hover:text-primary hover:underline"
                    >
                      {announcement.enquiryEmail}
                    </a>
                  </div>
                )
              )}

              {/* Staff in charge — always editable */}
              <div className="border-t pt-3">
                {isEditing ? (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Staff in charge
                    </p>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={editStaffInCharge}
                        onChange={(e) => setEditStaffInCharge(e.target.value)}
                        placeholder="Staff in charge…"
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  announcement.staffInCharge && (
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Staff in charge
                      </p>
                      <p className="truncate text-sm font-medium">
                        {announcement.staffInCharge}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
