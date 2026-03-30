import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import type { Student } from '~/apps/pg/types/student';
import { Card, CardContent } from '~/shared/components/ui/card';
import { cn } from '~/shared/lib/utils';

interface StudentOverviewCardsProps {
  student: Student;
}

export function StudentOverviewCards({ student }: StudentOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Attendance Card */}
      <Card size="sm">
        <CardContent className="relative space-y-1">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Attendance
            </span>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-3 w-3" />
              <span className="text-xs font-medium">Declining</span>
            </div>
          </div>
          <div className="text-3xl font-semibold">60%</div>
          <span className="text-sm text-muted-foreground">Current term</span>
        </CardContent>
      </Card>

      {/* Academics Card */}
      <Card size="sm">
        <CardContent className="relative space-y-1">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Academics
            </span>
            <div className="flex items-center gap-1 text-foreground">
              <Minus className="h-3 w-3" />
              <span className="text-xs font-medium">Stable</span>
            </div>
          </div>
          <div className="flex items-end gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-semibold">{student.overallPercentage}%</span>
              <span className="text-sm whitespace-nowrap text-muted-foreground">Overall score</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-semibold">32</span>
              <span className="text-sm whitespace-nowrap text-muted-foreground">Class rank</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wellbeing Card */}
      <Card size="sm">
        <CardContent className="relative space-y-1">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Wellbeing
            </span>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">Improving</span>
            </div>
          </div>
          <div className="text-3xl font-semibold">{student.riskIndicators}</div>
          <span className="text-sm text-muted-foreground">TCI risk indicators</span>
        </CardContent>
      </Card>
    </div>
  );
}
