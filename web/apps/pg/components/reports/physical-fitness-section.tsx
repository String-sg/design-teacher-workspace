import { Activity, Award } from 'lucide-react';

import type { PhysicalFitness } from '~/apps/pg/types/report';

interface PhysicalFitnessSectionProps {
  fitness: PhysicalFitness;
}

export function PhysicalFitnessSection({ fitness }: PhysicalFitnessSectionProps) {
  return (
    <section className="rounded-lg border border-border p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#e8feea]">
          <Activity className="text-[#12b886]" size={18} />
        </div>
        <h2 className="text-base font-semibold">Physical Fitness</h2>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-full bg-[#e8feea] px-3 py-1 text-xs font-semibold text-[#12b886] uppercase">
          Health Metric
        </span>
        <span className="text-sm text-muted-foreground">{fitness.percentile}th Percentile</span>
      </div>

      <p className="mt-3 text-sm font-medium">BMI Category: {fitness.bmiCategory}</p>
      <p className="mt-1 text-sm text-muted-foreground">{fitness.description}</p>

      {fitness.napfaAward && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#fef9ee] px-3 py-1 text-xs font-semibold text-[#f59f00]">
              Fitness Achievement
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-[#f59f00]">
              <Award size={14} />
              {fitness.napfaAward} Award
            </span>
          </div>
          <p className="mt-2 text-sm font-medium">NAPFA award: {fitness.napfaAward}</p>
          {fitness.napfaDescription && (
            <p className="mt-1 text-sm text-muted-foreground">{fitness.napfaDescription}</p>
          )}
        </div>
      )}
    </section>
  );
}
