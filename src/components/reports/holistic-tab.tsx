import { CoreValuesSection } from './core-values-section'
import { PhysicalFitnessSection } from './physical-fitness-section'
import { VIASection } from './via-section'
import { CCASection } from './cca-section'
import type { HolisticData } from '@/types/report'

interface HolisticTabProps {
  data: HolisticData
  studentFirstName: string
}

export function HolisticTab({ data, studentFirstName }: HolisticTabProps) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <CoreValuesSection
        coreValues={data.coreValues}
        studentFirstName={studentFirstName}
      />
      <PhysicalFitnessSection fitness={data.physicalFitness} />
      <VIASection activities={data.via} />
      <CCASection ccaList={data.cca} />
    </div>
  )
}
