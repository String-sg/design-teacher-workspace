import type { SecondarySubjectPerformance } from '~/apps/pg/types/report';
import { cn } from '~/shared/lib/utils';

interface SecondarySubjectDetailProps {
  subject: SecondarySubjectPerformance;
}

export function SecondarySubjectDetail({ subject }: SecondarySubjectDetailProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Performance History
      </p>
      <div className="divide-y divide-border">
        {subject.semesterHistory.map((sem) => (
          <div key={sem.semester} className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">{sem.semester}</span>
            <span className="flex items-center gap-2 text-sm">
              {sem.delta != null && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    sem.delta > 0 && 'text-emerald-600',
                    sem.delta < 0 && 'text-red-500',
                    sem.delta === 0 && 'text-muted-foreground',
                  )}
                >
                  {sem.delta > 0 ? '+' : ''}
                  {sem.delta}
                </span>
              )}
              <span className="font-semibold">{sem.score}</span>
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                {sem.grade}
              </span>
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between py-2 font-semibold">
          <span className="text-sm">Academic Year Overall</span>
          <span className="text-sm">{subject.academicYearOverall}</span>
        </div>
      </div>
    </div>
  );
}
