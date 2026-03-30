import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/ui/card';

interface StudentInfoCardProps {
  name: string;
  studentClass: string;
  nric: string;
  indexNumber: number;
  formTeacher: string;
  coFormTeacher: string | null;
  promotionStatus: string | null;
  schoolName?: string;
}

export function StudentInfoCard({
  name,
  studentClass,
  nric,
  indexNumber,
  formTeacher,
  coFormTeacher,
  schoolName,
}: StudentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {name} ({studentClass})
        </CardTitle>
        <p className="text-sm text-muted-foreground">{nric}</p>
        {schoolName && <p className="text-sm text-muted-foreground">{schoolName}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Class
            </span>
            <span className="text-lg font-semibold">{studentClass}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Index
            </span>
            <span className="text-lg font-semibold">{indexNumber}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Form Teacher
            </span>
            <span className="font-medium text-[#f26c47]">{formTeacher}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Co-Form Teacher
            </span>
            <span className="font-medium text-[#12b886]">{coFormTeacher || '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
