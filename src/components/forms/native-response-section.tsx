import type { ResponseType } from '@/types/form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface NativeResponseSectionProps {
  value: ResponseType
  onChange: (value: ResponseType) => void
}

function YesNoMockup() {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      <div className="h-1.5 w-3/4 rounded bg-slate-200" />
      <div className="h-1 w-full rounded bg-slate-100" />
      <div className="mt-1.5 flex gap-1.5">
        <div className="flex h-6 flex-1 items-center justify-center rounded bg-green-100 text-[8px] font-semibold text-green-700">
          Yes
        </div>
        <div className="flex h-6 flex-1 items-center justify-center rounded bg-red-100 text-[8px] font-semibold text-red-700">
          No
        </div>
      </div>
    </div>
  )
}

function AcknowledgeMockup() {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      <div className="h-1.5 w-3/4 rounded bg-slate-200" />
      <div className="h-1 w-full rounded bg-slate-100" />
      <div className="h-1 w-5/6 rounded bg-slate-100" />
      <div className="mt-1.5 h-6 rounded bg-primary/80 flex items-center justify-center">
        <div className="h-1.5 w-14 rounded bg-white/70" />
      </div>
    </div>
  )
}

const OPTIONS: Array<{
  value: ResponseType
  label: string
  hint: string
  mockup: React.ReactNode
}> = [
  {
    value: 'acknowledge',
    label: 'Acknowledge',
    hint: 'Parent taps a button to acknowledge.',
    mockup: <AcknowledgeMockup />,
  },
  {
    value: 'yes-no',
    label: 'Yes or No',
    hint: 'Parent taps Yes or No to respond. Supports custom follow-up questions.',
    mockup: <YesNoMockup />,
  },
]

export function NativeResponseSection({
  value,
  onChange,
}: NativeResponseSectionProps) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Response
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        How parents respond to this form on Parents Gateway.
      </p>

      <div className="space-y-2">
        <Label>
          Response type <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex flex-col gap-2 rounded-lg border-2 p-3 text-left transition-all flex-1',
                value === opt.value
                  ? 'border-primary bg-twblue-2'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <div className="rounded border border-slate-200 bg-white w-full">
                {opt.mockup}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {opt.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {opt.hint}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
