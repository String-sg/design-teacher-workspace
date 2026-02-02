import { AcademicSection } from './academic-section'
import { CharacterSection } from './character-section'
import type { HolisticReport } from '@/types/report'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReportDetailProps {
  report: HolisticReport
}

export function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <AcademicSection data={report.academic} />
      <CharacterSection data={report.character} />

      {(report.teacherObservations || report.nextSteps) && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher Notes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {report.teacherObservations && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">
                  Observations
                </span>
                <p>{report.teacherObservations}</p>
              </div>
            )}
            {report.nextSteps && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">
                  Next Steps
                </span>
                <p>{report.nextSteps}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-muted-foreground text-center text-sm">
        Report generated on{' '}
        {report.generatedAt.toLocaleDateString('en-SG', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
    </div>
  )
}
