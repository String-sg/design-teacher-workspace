import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StudentInfoCardProps {
  name: string
  studentClass: string
  nric: string
  indexNumber: number
  formTeacher: string
  coFormTeacher: string | null
  promotionStatus: string | null
}

export function StudentInfoCard({
  name,
  studentClass,
  nric,
  indexNumber,
  formTeacher,
  coFormTeacher,
  promotionStatus,
}: StudentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {name}
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {studentClass}
          </span>
        </CardTitle>
        <p className="text-muted-foreground text-sm">NRIC: {nric}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Class</span>
            <span className="font-medium">{studentClass}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Index Number</span>
            <span className="font-medium">{indexNumber}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Form Teacher</span>
            <span className="font-medium">{formTeacher}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">
              Co-form Teacher
            </span>
            <span className="font-medium">{coFormTeacher || '-'}</span>
          </div>
        </div>
        {promotionStatus && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Promotion Status
            </span>
            <Badge
              className={
                promotionStatus === 'Promoted'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
              }
            >
              {promotionStatus}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
