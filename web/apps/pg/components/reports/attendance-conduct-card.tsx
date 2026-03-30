import type { AttendanceData } from '~/apps/pg/types/report';
import type { ConductGrade } from '~/apps/pg/types/student';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/ui/card';
import { cn } from '~/shared/lib/utils';

import { AttendanceRing } from './attendance-ring';

interface AttendanceConductCardProps {
  attendance: AttendanceData;
  conduct: ConductGrade;
}

const CONDUCT_GRADES: ConductGrade[] = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

export function AttendanceConductCard({ attendance, conduct }: AttendanceConductCardProps) {
  const attendancePercentage =
    attendance.totalSchoolDays > 0
      ? (attendance.daysPresent / attendance.totalSchoolDays) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance &amp; Conduct</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <AttendanceRing percentage={attendancePercentage} size={80} />
          <div className="flex flex-1 items-start gap-4">
            <div className="flex-1 border-r border-border pr-4">
              <p className="text-xs font-medium text-muted-foreground">Attendance</p>
              <p className="text-lg font-semibold">
                {attendance.daysPresent} / {attendance.totalSchoolDays}
              </p>
              <p className="text-xs text-muted-foreground">Days Present</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Days Late</p>
              <p className="text-lg font-semibold">{attendance.daysLate}</p>
              <p className="text-xs text-muted-foreground">Total Instances</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Overall Conduct</span>
          <div className="flex flex-wrap gap-2">
            {CONDUCT_GRADES.map((grade) => {
              const isActive = grade === conduct;
              return (
                <span
                  key={grade}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    isActive ? 'bg-[#12b886] text-white' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {grade}
                </span>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
