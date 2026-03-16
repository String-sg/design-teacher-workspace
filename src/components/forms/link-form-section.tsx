import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LinkFormSectionProps {
  value: string
  onChange: (value: string) => void
}

export function LinkFormSection({ value, onChange }: LinkFormSectionProps) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Form Link
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Paste your form link below. Parents will be sent this link via Parents
        Gateway.
      </p>

      <div className="space-y-2">
        <Label htmlFor="form-link">
          Form URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="form-link"
          type="url"
          placeholder="https://forms.google.com/…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        <p className="text-xs text-muted-foreground">
          Response tracking is not available for 3rd-party forms. Teacher
          Workspace will only track who was sent the link.
        </p>
      </div>
    </section>
  )
}
