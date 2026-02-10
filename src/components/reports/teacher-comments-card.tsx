import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TeacherCommentsCardProps {
  observations: string | null
  nextSteps: string | null
}

export function TeacherCommentsCard({
  observations,
  nextSteps,
}: TeacherCommentsCardProps) {
  if (!observations && !nextSteps) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher's Comments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {observations && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Observations</span>
            <p>{observations}</p>
          </div>
        )}
        {nextSteps && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Next Steps</span>
            <p>{nextSteps}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
