import { Activity, Award } from 'lucide-react'
import type { PhysicalFitness } from '@/types/report'

interface PhysicalFitnessSectionProps {
  fitness: PhysicalFitness
}

export function PhysicalFitnessSection({
  fitness,
}: PhysicalFitnessSectionProps) {
  return (
    <section className="border-border rounded-lg border p-5">
      <div className="flex items-center gap-2">
        <Activity className="text-[#12b886]" size={20} />
        <h2 className="text-base font-semibold">Physical Fitness</h2>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-full bg-[#e8feea] px-3 py-1 text-xs font-semibold text-[#12b886]">
          Health Metric
        </span>
        <span className="text-muted-foreground text-sm">
          {fitness.percentile}th percentile
        </span>
      </div>

      <p className="mt-3 text-sm font-medium">
        BMI Category: {fitness.bmiCategory}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">
        {fitness.description}
      </p>

      {fitness.napfaAward && (
        <div className="border-border mt-4 border-t pt-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#fef9ee] px-3 py-1 text-xs font-semibold text-[#f59f00]">
              Fitness Achievement
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-[#f59f00]">
              <Award size={14} />
              {fitness.napfaAward} Award
            </span>
          </div>
          <p className="mt-2 text-sm font-medium">
            NAPFA award: {fitness.napfaAward}
          </p>
          {fitness.napfaDescription && (
            <p className="text-muted-foreground mt-1 text-sm">
              {fitness.napfaDescription}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
