import type { SecondaryAcademicData } from '~/apps/pg/types/report';

import { AcademicAggregatesSection } from './academic-aggregates-section';
import { ExamOverallSection } from './exam-overall-section';
import { SecondaryGradingGlossary } from './secondary-grading-glossary';
import { SecondarySubjectAccordion } from './secondary-subject-accordion';

interface SecondaryAcademicTabProps {
  data: SecondaryAcademicData;
}

export function SecondaryAcademicTab({ data }: SecondaryAcademicTabProps) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <AcademicAggregatesSection aggregates={data.aggregates} />
      <SecondarySubjectAccordion subjects={data.subjects} />
      <ExamOverallSection overall={data.overall} />
      <SecondaryGradingGlossary gradingSystem={data.gradingSystem} />
    </div>
  );
}
