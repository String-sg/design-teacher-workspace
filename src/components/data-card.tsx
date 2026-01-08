import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface DataCardProps {
  label: string
  value: string | number
  description: string
  className?: string
}

export function DataCard({
  label,
  value,
  description,
  className,
}: DataCardProps) {
  return (
    <Card size="sm" className={cn('', className)}>
      <CardContent className="space-y-1">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
        <div className="text-3xl font-semibold">{value}</div>
        <span className="text-muted-foreground text-sm">{description}</span>
      </CardContent>
    </Card>
  )
}
