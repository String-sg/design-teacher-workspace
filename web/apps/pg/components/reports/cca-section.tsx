import { Award, Star } from 'lucide-react';

import type { CCAInfo } from '~/apps/pg/types/report';

import { AttendanceRing } from './attendance-ring';

interface CCASectionProps {
  ccaList: CCAInfo[];
}

export function CCASection({ ccaList }: CCASectionProps) {
  return (
    <section className="rounded-lg border border-border p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#eef0ff]">
          <Star className="text-[#6366f1]" size={18} />
        </div>
        <h2 className="text-base font-semibold">Co-Curricular Activity (CCA)</h2>
      </div>

      <div className="mt-4 flex flex-col gap-6">
        {ccaList.map((cca) => {
          const attendancePercentage =
            cca.totalSessions > 0 ? (cca.sessionsAttended / cca.totalSessions) * 100 : 0;

          return (
            <div key={cca.name} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Award className="text-[#6366f1]" size={14} />
                <span className="text-xs font-semibold tracking-wider text-[#6366f1] uppercase">
                  CCA: {cca.category}
                </span>
              </div>

              <div>
                <p className="text-base font-semibold">{cca.name}</p>
                <p className="text-sm font-medium text-[#12b886]">
                  {cca.role} &middot; {cca.years} {cca.years === 1 ? 'year' : 'years'}
                </p>
              </div>

              {cca.recognition.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold tracking-wider uppercase">Recognition</p>
                  {cca.recognition.map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <Award className="size-4 shrink-0 text-muted-foreground" />
                      {r}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-wider uppercase">Participation</p>
                <div className="flex items-center gap-4">
                  <AttendanceRing percentage={attendancePercentage} size={80} />
                  <div>
                    <p className="text-sm font-medium">Overall Attendance</p>
                    <p className="text-sm text-muted-foreground">
                      {cca.sessionsAttended} / {cca.totalSessions} Sessions Attended
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
