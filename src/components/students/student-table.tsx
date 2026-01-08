import type { AttentionTag, Student } from '@/types/student'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { tagColors } from '@/data/mock-students'

interface StudentTableProps {
  students: Array<Student>
  className?: string
}

const tagVariantMap: Record<AttentionTag, 'default' | 'secondary' | 'outline'> =
  tagColors

export function StudentTable({ students, className }: StudentTableProps) {
  return (
    <div className={cn('', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Attention tag</TableHead>
            <TableHead>Overall %</TableHead>
            <TableHead>Conduct</TableHead>
            <TableHead>Learning Support</TableHead>
            <TableHead>Post-Sec Eligibility</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell className="text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>
                {student.attentionTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {student.attentionTags.map((tag) => (
                      <Badge key={tag} variant={tagVariantMap[tag]}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    student.overallPercentage < 40 && 'text-red-600',
                    student.overallPercentage >= 40 &&
                      student.overallPercentage < 60 &&
                      'text-amber-600',
                    student.overallPercentage >= 60 && 'text-foreground',
                  )}
                >
                  {student.overallPercentage}%
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    student.conduct === 'Poor' && 'text-red-600',
                    student.conduct === 'Fair' && 'text-amber-600',
                    student.conduct === 'Good' && 'text-foreground',
                    student.conduct === 'Excellent' && 'text-green-600',
                  )}
                >
                  {student.conduct}
                </span>
              </TableCell>
              <TableCell>
                {student.learningSupport || (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {student.postSecEligibility}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
