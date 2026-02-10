import { statusColors } from './learning-outcome-row'
import type { LearningOutcomeStatus } from '@/types/report'
import { cn } from '@/lib/utils'

const glossaryItems: Array<{
  status: LearningOutcomeStatus
  description: string
}> = [
  {
    status: 'Accomplished',
    description:
      'Student has demonstrated thorough understanding and consistently applies concepts independently.',
  },
  {
    status: 'Competent',
    description:
      'Student has demonstrated good understanding and can apply concepts with minimal guidance.',
  },
  {
    status: 'Developing',
    description:
      'Student is building understanding and can apply concepts with some support and guidance.',
  },
  {
    status: 'Beginning',
    description:
      'Student is starting to develop understanding and requires significant support.',
  },
]

export function EvaluationGlossary() {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
        Evaluation Glossary
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {glossaryItems.map((item) => (
          <div
            key={item.status}
            className="border-border flex flex-col gap-2 rounded-lg border p-4"
          >
            <span
              className={cn(
                'w-fit rounded-full px-3 py-1 text-xs font-medium',
                statusColors[item.status],
              )}
            >
              {item.status}
            </span>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
