import { useState } from 'react'
import { Check, ChevronDown, Mail, Plus, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SAVED_ENQUIRY_EMAILS } from '@/data/mock-staff'

interface EnquiryEmailSelectorProps {
  value: string // selected email or ''
  onChange: (email: string) => void
}

export function EnquiryEmailSelector({
  value,
  onChange,
}: EnquiryEmailSelectorProps) {
  const [savedEmails, setSavedEmails] =
    useState<Array<string>>(SAVED_ENQUIRY_EMAILS)
  const [showAddNew, setShowAddNew] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [addError, setAddError] = useState('')

  function selectEmail(email: string) {
    onChange(email)
    setShowAddNew(false)
    setNewEmail('')
    setAddError('')
  }

  function clearEmail(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

  function handleAddNew() {
    const email = newEmail.trim()
    if (!email) return
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValid) {
      setAddError('Please enter a valid email address.')
      return
    }
    if (!savedEmails.includes(email)) {
      setSavedEmails((prev) => [...prev, email])
    }
    selectEmail(email)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 rounded-md border border-input bg-background text-sm transition-colors hover:bg-slate-50',
                value
                  ? 'px-3 py-1.5 text-slate-700'
                  : 'h-9 w-full px-3 py-2 text-muted-foreground',
              )}
            />
          }
        >
          <Mail
            className={cn(
              'shrink-0 text-slate-400',
              value ? 'h-3.5 w-3.5' : 'h-4 w-4',
            )}
          />
          {value ? (
            <span>{value}</span>
          ) : (
            <>
              <span className="flex-1 text-left">Select or add an email…</span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </>
          )}
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={4} className="w-72 gap-0 p-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-3 py-2.5">
            <p className="text-sm font-medium">Enquiry email</p>
            <span className="text-xs text-muted-foreground">1 max</span>
          </div>

          {/* Saved email list */}
          <div className="py-1">
            {savedEmails.map((email) => {
              const isSelected = value === email
              return (
                <button
                  key={email}
                  type="button"
                  onClick={() => selectEmail(email)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  {/* Radio indicator */}
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-slate-300',
                    )}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span className="flex-1 truncate text-slate-700">
                    {email}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Add new email */}
          {showAddNew ? (
            <div className="space-y-2 p-3">
              <Input
                type="email"
                placeholder="you@school.edu.sg"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  setAddError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddNew()
                  }
                }}
                autoFocus
                className="h-8 text-sm"
              />
              {addError && (
                <p className="text-xs text-destructive">{addError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddNew}
                  className="h-7 flex-1 text-xs"
                >
                  Add &amp; select
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddNew(false)
                    setNewEmail('')
                    setAddError('')
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddNew(true)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:bg-slate-50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add new email
            </button>
          )}
        </PopoverContent>
      </Popover>

      {/* Clear selection — lives outside the Popover trigger */}
      {value && (
        <button
          type="button"
          onClick={clearEmail}
          className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-slate-100 hover:text-foreground"
          aria-label="Clear email"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
