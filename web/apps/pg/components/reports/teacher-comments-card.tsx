import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/ui/card';

interface TeacherCommentsCardProps {
  comments: string | null;
}

export function TeacherCommentsCard({ comments }: TeacherCommentsCardProps) {
  if (!comments) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher&apos;s Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{comments}</p>
      </CardContent>
    </Card>
  );
}
