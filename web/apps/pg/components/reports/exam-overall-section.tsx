import type { ExamOverall } from '~/apps/pg/types/report';

interface ExamOverallSectionProps {
  overall: ExamOverall;
}

export function ExamOverallSection({ overall }: ExamOverallSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Overall</h2>
      <div className="rounded-lg border border-border p-5">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Exam Performance
            </p>
            <p className="mt-1 text-2xl font-bold text-[#f26c47]">{overall.examPerformance}</p>
            <p className="text-sm text-muted-foreground">{overall.semesterLabel}</p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Academic Year Overall
            </p>
            <p className="mt-1 text-2xl font-bold">{overall.academicYearOverall}</p>
            <p className="text-sm text-muted-foreground">{overall.cumulativeLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
