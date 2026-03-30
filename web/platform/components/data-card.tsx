import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '~/shared/components/ui/card';
import { cn } from '~/shared/lib/utils';

type Trend = 'improving' | 'declining' | 'stable';

interface DataCardProps {
  label: string;
  value: string | number;
  description: string;
  trend?: Trend;
  className?: string;
}

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend === 'declining') {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="h-3 w-3" />
        <span className="text-xs font-medium">Declining</span>
      </div>
    );
  }
  if (trend === 'improving') {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingUp className="h-3 w-3" />
        <span className="text-xs font-medium">Improving</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-foreground">
      <Minus className="h-3 w-3" />
      <span className="text-xs font-medium">Stable</span>
    </div>
  );
}

export function DataCard({ label, value, description, trend, className }: DataCardProps) {
  return (
    <Card size="sm" className={cn('', className)}>
      <CardContent className="space-y-1">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          {trend && <TrendBadge trend={trend} />}
        </div>
        <div className="text-3xl font-semibold">{value}</div>
        <span className="text-sm text-muted-foreground">{description}</span>
      </CardContent>
    </Card>
  );
}
