import { StudentInfoCard } from './student-info-card'
import { AttendanceConductCard } from './attendance-conduct-card'
import { TeacherCommentsCard } from './teacher-comments-card'
import type { HolisticReport } from '@/types/report'

interface ReportOverviewTabProps {
  report: HolisticReport
}

export function ReportOverviewTab({ report }: ReportOverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <StudentInfoCard
        name={report.studentName}
        studentClass={report.studentClass}
        nric={report.nric}
        indexNumber={report.indexNumber}
        formTeacher={report.formTeacher}
        coFormTeacher={report.coFormTeacher}
        promotionStatus={report.promotionStatus}
      />
      <AttendanceConductCard
        attendance={report.attendance}
        conduct={report.character.conduct}
      />
      <TeacherCommentsCard
        observations={report.teacherObservations}
        nextSteps={report.nextSteps}
      />
    </div>
  )
}
