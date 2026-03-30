import { AcademicAggregatesSection } from './academic-aggregates-section'
import { SecondarySubjectAccordion } from './secondary-subject-accordion'
import { ExamOverallSection } from './exam-overall-section'
import { SecondaryGradingGlossary } from './secondary-grading-glossary'
import type { SecondaryAcademicData } from '@/types/report'

interface SecondaryAcademicTabProps {
  data: SecondaryAcademicData
}

export function SecondaryAcademicTab({ data }: SecondaryAcademicTabProps) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <AcademicAggregatesSection aggregates={data.aggregates} />
      <SecondarySubjectAccordion subjects={data.subjects} />
      <ExamOverallSection overall={data.overall} />
      <SecondaryGradingGlossary gradingSystem={data.gradingSystem} />
    </div>
  )
}
