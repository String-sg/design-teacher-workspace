import { Send, Users, Zap } from 'lucide-react'
import type { FormType, ResponseType } from '@/types/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface FormActivateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  formType: FormType
  responseType?: ResponseType
  dueDate?: string
  reminderType?: string
  reminderDate?: string
  recipientClasses: string[]
  totalRecipients: number
  onConfirm: () => void
}

function getFormTypeBadge(formType: FormType, responseType?: ResponseType) {
  if (formType === 'quick') {
    const label =
      responseType === 'yes-no'
        ? 'Quick · Yes or No'
        : responseType === 'acknowledge'
          ? 'Quick · Acknowledge'
          : 'Quick Form'
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        {label}
      </Badge>
    )
  }
  if (formType === 'allears') {
    return (
      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
        Custom · AllEars
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
      3rd-Party Link
    </Badge>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function FormActivateSheet({
  open,
  onOpenChange,
  title,
  formType,
  responseType,
  dueDate,
  reminderType,
  reminderDate,
  recipientClasses,
  totalRecipients,
  onConfirm,
}: FormActivateSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Activate form?</DialogTitle>
          <DialogDescription>
            Review the details below before sending to parents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Form title */}
          <div className="rounded-lg border bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-800">
              {title || 'Untitled Form'}
            </p>
          </div>

          {/* Form type */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Form type:</span>
            {getFormTypeBadge(formType, responseType)}
          </div>

          {/* Due date & reminder */}
          {dueDate && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">
                  Due date:
                </span>
                <span className="text-sm">{formatDate(dueDate)}</span>
              </div>
              {reminderType && reminderType !== 'none' && reminderDate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">
                    Reminder:
                  </span>
                  <span className="text-sm capitalize">
                    {reminderType === 'one-time' ? 'One Time' : 'Daily'} on{' '}
                    {formatDate(reminderDate)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Target audience */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                To parents of
              </p>
            </div>
            {recipientClasses.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {recipientClasses.map((cls) => (
                  <span
                    key={cls}
                    className="rounded-md bg-twblue-2 px-2 py-0.5 text-xs font-medium text-twblue-9"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {totalRecipients > 0
                ? `${totalRecipients} parent${totalRecipients !== 1 ? 's' : ''} will receive this form`
                : 'No recipients selected'}
            </p>
          </div>

          {/* Delivery */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Delivery
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Immediately via Parents Gateway
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Send className="mr-2 h-4 w-4" />
            Confirm & Activate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
