import { AttendanceRing } from './attendance-ring'
import type { ConductGrade } from '@/types/student'
import type { AttendanceData } from '@/types/report'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AttendanceConductCardProps {
  attendance: AttendanceData
  conduct: ConductGrade
}

const CONDUCT_GRADES: Array<ConductGrade> = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor',
]

export function AttendanceConductCard({
  attendance,
  conduct,
}: AttendanceConductCardProps) {
  const attendancePercentage =
    attendance.totalSchoolDays > 0
      ? (attendance.daysPresent / attendance.totalSchoolDays) * 100
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance & Conduct</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 md:flex-row md:gap-10">
        <div className="flex flex-col items-center gap-3">
          <AttendanceRing percentage={attendancePercentage} />
          <div className="text-center">
            <p className="text-sm font-medium">
              {attendance.daysPresent} / {attendance.totalSchoolDays} days
            </p>
            <p className="text-muted-foreground text-sm">Days Present</p>
          </div>
        </div>

        <div className="border-border hidden md:block md:border-l" />

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Days Late</span>
            <span className="text-lg font-medium">{attendance.daysLate}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm">
              Overall Conduct
            </span>
            <div className="flex flex-wrap gap-2">
              {CONDUCT_GRADES.map((grade) => {
                const isActive = grade === conduct
                return (
                  <span
                    key={grade}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      isActive
                        ? 'bg-[#12b886] text-white'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {grade}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
