import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface QualityBadgeProps {
  score: number
  label?: string
  className?: string
}

export function QualityBadge({ score, label, className }: QualityBadgeProps) {
  const color =
    score >= 80
      ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300'
      : score >= 50
        ? 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
        : 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300'

  return (
    <Badge variant="outline" className={cn(color, className)}>
      {label ? `${label}: ${score}` : score}
    </Badge>
  )
}

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high'
  className?: string
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles = {
    low: 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300',
    medium:
      'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    high: 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300',
  }

  return (
    <Badge variant="outline" className={cn(styles[level], className)}>
      {level} risk
    </Badge>
  )
}

interface PRStatusBadgeProps {
  state: 'open' | 'closed' | 'merged'
  isDraft?: boolean
  className?: string
}

export function PRStatusBadge({
  state,
  isDraft,
  className,
}: PRStatusBadgeProps) {
  if (isDraft) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400',
          className,
        )}
      >
        Draft
      </Badge>
    )
  }

  const styles = {
    open: 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300',
    merged:
      'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300',
    closed:
      'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300',
  }

  return (
    <Badge variant="outline" className={cn(styles[state], className)}>
      {state === 'merged' ? 'Merged' : state === 'open' ? 'Open' : 'Closed'}
    </Badge>
  )
}

interface ImpactBadgeProps {
  impact: 'high' | 'medium' | 'low'
  className?: string
}

export function ImpactBadge({ impact, className }: ImpactBadgeProps) {
  const styles = {
    high: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300',
    medium:
      'border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400',
    low: 'border-zinc-200 bg-zinc-50/50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-500',
  }

  return (
    <Badge variant="outline" className={cn(styles[impact], className)}>
      {impact} impact
    </Badge>
  )
}
