import { SubjectAccordion } from './subject-accordion'
import { EvaluationGlossary } from './evaluation-glossary'
import { SecondaryAcademicTab } from './secondary-academic-tab'
import type {
  AcademicData,
  SchoolLevel,
  SecondaryAcademicData,
} from '@/types/report'

interface AcademicTabProps {
  data: AcademicData
  secondaryData?: SecondaryAcademicData
  schoolLevel?: SchoolLevel
}

export function AcademicTab({
  data,
  secondaryData,
  schoolLevel,
}: AcademicTabProps) {
  if (schoolLevel === 'secondary' && secondaryData) {
    return <SecondaryAcademicTab data={secondaryData} />
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SubjectAccordion subjects={data.subjects} />
      <EvaluationGlossary />
    </div>
  )
}
