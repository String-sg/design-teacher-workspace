import { LearningOutcomeRow } from './learning-outcome-row'
import type { SubjectPerformance } from '@/types/report'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface SubjectAccordionProps {
  subjects: Array<SubjectPerformance>
}

export function SubjectAccordion({ subjects }: SubjectAccordionProps) {
  return (
    <Accordion defaultValue={[0]}>
      {subjects.map((subject, index) => (
        <AccordionItem key={subject.name} value={index}>
          <AccordionTrigger className="text-base font-semibold">
            {subject.name}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
              Learning Outcome
            </p>
            <div className="divide-border divide-y">
              {subject.learningOutcomes.map((outcome) => (
                <LearningOutcomeRow key={outcome.name} outcome={outcome} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
