import { overallPercentageThresholds } from '~/apps/pg/data/threshold-config';
import type { AcademicData } from '~/apps/pg/types/report';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/ui/card';
import { cn, getStatusColor } from '~/shared/lib/utils';

interface AcademicSectionProps {
  data: AcademicData;
}

export function AcademicSection({ data }: AcademicSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Overall Percentage</span>
            <span
              className={cn(
                'text-2xl font-semibold',
                getStatusColor(data.overallPercentage, overallPercentageThresholds),
              )}
            >
              {data.overallPercentage}%
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Learning Support</span>
            <span className="font-medium">{data.learningSupport || 'None'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Post-Sec Eligibility</span>
            <span className="font-medium">{data.postSecEligibility}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
