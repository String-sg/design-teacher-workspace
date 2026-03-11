import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type SenFormat = 'sen-high' | 'sen-norm'
type DataRange = 'all' | 'current'

interface ExportCsvModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (options: { senFormat: SenFormat; dataRange: DataRange }) => void
}

interface RadioCardProps {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}

function RadioCard({ label, description, selected, onClick }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border hover:bg-muted/50',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
          selected ? 'border-primary' : 'border-muted-foreground/40',
        )}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </span>
    </button>
  )
}

export function ExportCsvModal({
  open,
  onOpenChange,
  onExport,
}: ExportCsvModalProps) {
  const [senFormat, setSenFormat] = useState<SenFormat>('sen-high')
  const [dataRange, setDataRange] = useState<DataRange>('current')

  function handleExport() {
    onExport({ senFormat, dataRange })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export view</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* What to export */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">What to export</p>
            <div className="flex flex-col gap-2">
              <RadioCard
                label="Visible columns"
                selected={dataRange === 'current'}
                onClick={() => setDataRange('current')}
              />
              <RadioCard
                label="All columns"
                selected={dataRange === 'all'}
                onClick={() => setDataRange('all')}
              />
            </div>
          </div>

          {/* Export format */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Export format</p>
            <div className="flex flex-col gap-2">
              <RadioCard
                label="As shown"
                description="Export data as shown in the table"
                selected={senFormat === 'sen-high'}
                onClick={() => setSenFormat('sen-high')}
              />
              <RadioCard
                label="Redacted"
                description="Export with sensitive-high data masked"
                selected={senFormat === 'sen-norm'}
                onClick={() => setSenFormat('sen-norm')}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleExport}>
            Export view
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
