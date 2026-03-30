import {
  absencesThresholds,
  ccaMissedThresholds,
  lateComingThresholds,
  offencesThresholds,
  riskIndicatorsThresholds,
} from '~/apps/pg/data/threshold-config';
import type { CharacterData } from '~/apps/pg/types/report';
import { Badge } from '~/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/ui/card';
import { cn, getStatusColor } from '~/shared/lib/utils';

interface CharacterSectionProps {
  data: CharacterData;
}

export function CharacterSection({ data }: CharacterSectionProps) {
  const conductColors: Record<string, string> = {
    Excellent: 'bg-green-100 text-green-700 hover:bg-green-100',
    'Very Good': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
    Good: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    Fair: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    Poor: 'bg-red-100 text-red-700 hover:bg-red-100',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character Development</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">Behaviour & Discipline</h4>
          <div className="grid gap-4 lg:grid-cols-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Conduct</span>
              <Badge className={cn('w-fit', conductColors[data.conduct])}>{data.conduct}</Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Offences</span>
              <span
                className={cn('font-medium', getStatusColor(data.offences, offencesThresholds))}
              >
                {data.offences}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Absences</span>
              <span
                className={cn('font-medium', getStatusColor(data.absences, absencesThresholds))}
              >
                {data.absences}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Late Coming</span>
              <span
                className={cn('font-medium', getStatusColor(data.lateComing, lateComingThresholds))}
              >
                {data.lateComing}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">CCA Missed</span>
              <span
                className={cn('font-medium', getStatusColor(data.ccaMissed, ccaMissedThresholds))}
              >
                {data.ccaMissed}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">Wellbeing</h4>
          <div className="grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Risk Indicators</span>
              <span
                className={cn(
                  'font-medium',
                  getStatusColor(data.riskIndicators, riskIndicatorsThresholds),
                )}
              >
                {data.riskIndicators}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Low Mood Flagged</span>
              <span className="font-medium">{data.lowMoodFlagged || 'No'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Social Links</span>
              <span className="font-medium">{data.socialLinks}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Counselling Sessions</span>
              <span className="font-medium">{data.counsellingSessions}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
