import { Trophy } from 'lucide-react'
import { AttendanceRing } from './attendance-ring'
import type { CCAInfo } from '@/types/report'

interface CCASectionProps {
  ccaList: Array<CCAInfo>
}

export function CCASection({ ccaList }: CCASectionProps) {
  return (
    <section className="border-border rounded-lg border p-5">
      <div className="flex items-center gap-2">
        <Trophy className="text-[#12b886]" size={20} />
        <h2 className="text-base font-semibold">
          Co-Curricular Activity (CCA)
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-6">
        {ccaList.map((cca) => {
          const attendancePercentage =
            cca.totalSessions > 0
              ? (cca.sessionsAttended / cca.totalSessions) * 100
              : 0

          return (
            <div key={cca.name} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#e8feea] px-3 py-1 text-xs font-semibold uppercase text-[#12b886]">
                  {cca.category}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#f26c47]">
                  {cca.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {cca.role} &middot; {cca.years}{' '}
                  {cca.years === 1 ? 'year' : 'years'}
                </p>
              </div>

              {cca.recognition.length > 0 && (
                <div>
                  <p className="text-xs font-medium">Recognition</p>
                  <ul className="text-muted-foreground mt-1 list-inside list-disc text-sm">
                    {cca.recognition.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4">
                <AttendanceRing percentage={attendancePercentage} size={80} />
                <div>
                  <p className="text-sm font-medium">Participation</p>
                  <p className="text-muted-foreground text-sm">
                    {cca.sessionsAttended} / {cca.totalSessions} sessions
                    attended
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
