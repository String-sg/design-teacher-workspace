import type { LearningOutcome, LearningOutcomeStatus } from '@/types/report'
import { cn } from '@/lib/utils'

const statusColors: Record<LearningOutcomeStatus, string> = {
  Accomplished: 'bg-[#e8feea] text-[#12b886]',
  Competent: 'bg-[rgba(34,139,230,0.1)] text-[#228be6]',
  Developing: 'bg-[#fef9ee] text-[#fac53e]',
  Beginning: 'bg-[#f6f7f8] text-[#a7aab5]',
}

export function LearningOutcomeRow({ outcome }: { outcome: LearningOutcome }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium">{outcome.name}</p>
        <p className="text-muted-foreground text-sm">{outcome.description}</p>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
          statusColors[outcome.status],
        )}
      >
        {outcome.status}
      </span>
    </div>
  )
}

export { statusColors }
