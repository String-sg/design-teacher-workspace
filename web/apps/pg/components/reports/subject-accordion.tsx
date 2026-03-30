import type { SubjectPerformance } from '~/apps/pg/types/report';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/shared/components/ui/accordion';

import { LearningOutcomeRow } from './learning-outcome-row';

interface SubjectAccordionProps {
  subjects: SubjectPerformance[];
}

export function SubjectAccordion({ subjects }: SubjectAccordionProps) {
  return (
    <Accordion defaultValue={[0]}>
      {subjects.map((subject, index) => (
        <AccordionItem key={subject.name} value={index}>
          <AccordionTrigger className="text-base font-semibold">{subject.name}</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Learning Outcome
            </p>
            <div className="divide-y divide-border">
              {subject.learningOutcomes.map((outcome) => (
                <LearningOutcomeRow key={outcome.name} outcome={outcome} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
