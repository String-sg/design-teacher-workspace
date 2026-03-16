import { useState } from 'react'
import type { FormType } from '@/types/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ResponseTypePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (type: FormType) => void
}

interface TypeCard {
  type: FormType
  label: string
  description: string
  subtext: string
  phoneMockup: React.ReactNode
}

function QuickPhoneMockup() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-2 w-3/4 rounded bg-slate-200" />
      <div className="h-1.5 w-full rounded bg-slate-100" />
      <div className="h-1.5 w-5/6 rounded bg-slate-100" />
      <div className="mt-2 flex gap-2">
        <div className="flex h-7 flex-1 items-center justify-center rounded-md bg-green-100 text-[9px] font-semibold text-green-700">
          Yes
        </div>
        <div className="flex h-7 flex-1 items-center justify-center rounded-md bg-red-100 text-[9px] font-semibold text-red-700">
          No
        </div>
      </div>
    </div>
  )
}

function AllEarsPhoneMockup() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2 w-3/4 rounded bg-slate-200" />
      <div className="h-1.5 w-full rounded bg-slate-100" />
      <div className="space-y-1 mt-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm border border-slate-300" />
          <div className="h-1.5 w-16 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm border border-slate-300" />
          <div className="h-1.5 w-12 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm border border-slate-300" />
          <div className="h-1.5 w-20 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-1 h-6 rounded-md bg-primary/80 flex items-center justify-center">
        <div className="h-1.5 w-12 rounded bg-white/70" />
      </div>
    </div>
  )
}

function LinkPhoneMockup() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2 w-3/4 rounded bg-slate-200" />
      <div className="h-1.5 w-full rounded bg-slate-100" />
      <div className="h-1.5 w-5/6 rounded bg-slate-100" />
      <div className="mt-2 h-7 rounded-md border border-slate-300 bg-slate-50 flex items-center gap-1.5 px-2">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        <div className="h-1.5 flex-1 rounded bg-slate-200" />
        <div className="text-[8px] font-medium text-primary">Open →</div>
      </div>
    </div>
  )
}

const CARDS: TypeCard[] = [
  {
    type: 'quick',
    label: 'Quick Form',
    description: 'Yes/No (with up to 5 questions) or Acknowledge.',
    subtext: 'Simple forms created directly in Teacher Workspace.',
    phoneMockup: <QuickPhoneMockup />,
  },
  {
    type: 'allears',
    label: 'Custom Form',
    description: 'Build with AllEars for full control.',
    subtext: 'Multi-section forms with logic and varied question types.',
    phoneMockup: <AllEarsPhoneMockup />,
  },
]

export function ResponseTypePicker({
  open,
  onOpenChange,
  onSelect,
}: ResponseTypePickerProps) {
  const [selected, setSelected] = useState<FormType | null>(null)

  function handleContinue() {
    if (selected) {
      onSelect(selected)
      onOpenChange(false)
      setSelected(null)
    }
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v)
    if (!v) setSelected(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a Form</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          {CARDS.map((card) => (
            <button
              key={card.type}
              type="button"
              onClick={() => setSelected(card.type)}
              className={cn(
                'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all',
                selected === card.type
                  ? 'border-primary bg-twblue-2'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              {/* Phone mockup — fixed width */}
              <div className="w-28 shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-3">
                {card.phoneMockup}
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {card.label}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {card.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  {card.subtext}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!selected} onClick={handleContinue}>
            Continue →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
