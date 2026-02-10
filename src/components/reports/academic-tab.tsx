import { SubjectAccordion } from './subject-accordion'
import { EvaluationGlossary } from './evaluation-glossary'
import type { AcademicData } from '@/types/report'

interface AcademicTabProps {
  data: AcademicData
}

export function AcademicTab({ data }: AcademicTabProps) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <SubjectAccordion subjects={data.subjects} />
      <EvaluationGlossary />
    </div>
  )
}
