import type { AcademicData, SchoolLevel, SecondaryAcademicData } from '~/apps/pg/types/report';

import { EvaluationGlossary } from './evaluation-glossary';
import { SecondaryAcademicTab } from './secondary-academic-tab';
import { SubjectAccordion } from './subject-accordion';

interface AcademicTabProps {
  data: AcademicData;
  secondaryData?: SecondaryAcademicData;
  schoolLevel?: SchoolLevel;
}

export function AcademicTab({ data, secondaryData, schoolLevel }: AcademicTabProps) {
  if (schoolLevel === 'secondary' && secondaryData) {
    return <SecondaryAcademicTab data={secondaryData} />;
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <h2 className="text-lg font-semibold">Subject Performance</h2>
      <SubjectAccordion subjects={data.subjects} />
      <EvaluationGlossary />
    </div>
  );
}
