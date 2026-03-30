import type { HolisticData } from '~/apps/pg/types/report';

import { CCASection } from './cca-section';
import { CoreValuesSection } from './core-values-section';
import { PhysicalFitnessSection } from './physical-fitness-section';
import { VIASection } from './via-section';

interface HolisticTabProps {
  data: HolisticData;
  studentFirstName: string;
}

export function HolisticTab({ data, studentFirstName }: HolisticTabProps) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <CoreValuesSection coreValues={data.coreValues} studentFirstName={studentFirstName} />
      <PhysicalFitnessSection fitness={data.physicalFitness} />
      <VIASection activities={data.via} />
      <CCASection ccaList={data.cca} />
    </div>
  );
}
