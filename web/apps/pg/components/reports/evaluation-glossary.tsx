import type { LearningOutcomeStatus } from '~/apps/pg/types/report';
import { cn } from '~/shared/lib/utils';

import { statusColors } from './learning-outcome-row';

const glossaryItems: {
  status: LearningOutcomeStatus;
  description: string;
}[] = [
  {
    status: 'Accomplished',
    description:
      'Student consistently demonstrates a high level of understanding and independently applies skills in various contexts.',
  },
  {
    status: 'Competent',
    description:
      'Student demonstrates a good understanding and is able to apply skills independently in most situations.',
  },
  {
    status: 'Developing',
    description:
      'Student is beginning to understand and apply skills with some guidance and support.',
  },
  {
    status: 'Beginning',
    description:
      'Student is starting to develop understanding of basic concepts and requires significant support.',
  },
];

export function EvaluationGlossary() {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold">Evaluation Glossary</h3>
      <div className="flex flex-col gap-3">
        {glossaryItems.map((item) => (
          <div
            key={item.status}
            className="flex flex-col gap-2 rounded-lg border border-border p-4"
          >
            <span
              className={cn(
                'w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase',
                statusColors[item.status],
              )}
            >
              {item.status}
            </span>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
