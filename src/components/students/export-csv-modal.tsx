import { useState } from 'react'
import { Download } from 'lucide-react'

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
  const [senFormat, setSenFormat] = useState<SenFormat>('sen-norm')
  const [dataRange, setDataRange] = useState<DataRange>('all')

  function handleExport() {
    onExport({ senFormat, dataRange })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export to CSV</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Sensitivity format */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Sensitivity</p>
            <div className="flex flex-col gap-2">
              <RadioCard
                label="Current view"
                description="Includes Sensitive-High data (e.g. Counselling, SEN, Offences)"
                selected={senFormat === 'sen-high'}
                onClick={() => setSenFormat('sen-high')}
              />
              <RadioCard
                label="Redacted view"
                description="Masks Sensitive-High data, converting to Sensitive Normal"
                selected={senFormat === 'sen-norm'}
                onClick={() => setSenFormat('sen-norm')}
              />
            </div>
          </div>

          {/* Data range */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Data range</p>
            <div className="flex flex-col gap-2">
              <RadioCard
                label="All available data"
                description="Export all student data across all terms"
                selected={dataRange === 'all'}
                onClick={() => setDataRange('all')}
              />
              <RadioCard
                label="Current view"
                description="Export only what is currently displayed on screen"
                selected={dataRange === 'current'}
                onClick={() => setDataRange('current')}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-1.5 size-4" />
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
