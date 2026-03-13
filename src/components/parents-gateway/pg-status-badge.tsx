import type { PGStatus } from '@/types/pg-announcement'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PGStatusBadgeProps {
  status: PGStatus
  className?: string
}

export function PGStatusBadge({ status, className }: PGStatusBadgeProps) {
  if (status === 'posted') {
    return (
      <Badge
        className={cn(
          'bg-green-100 text-green-700 hover:bg-green-100',
          className,
        )}
      >
        Posted
      </Badge>
    )
  }
  if (status === 'scheduled') {
    return (
      <Badge
        className={cn('bg-blue-100 text-blue-700 hover:bg-blue-100', className)}
      >
        Scheduled
      </Badge>
    )
  }
  return (
    <Badge
      className={cn(
        'bg-slate-100 text-slate-600 hover:bg-slate-100',
        className,
      )}
    >
      Draft
    </Badge>
  )
}
