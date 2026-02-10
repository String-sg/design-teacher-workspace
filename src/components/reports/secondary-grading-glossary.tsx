import type { GradingTierDefinition } from '@/types/report'

interface SecondaryGradingGlossaryProps {
  gradingSystem: Array<GradingTierDefinition>
}

export function SecondaryGradingGlossary({
  gradingSystem,
}: SecondaryGradingGlossaryProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Grading System</h2>
      <div className="flex flex-col gap-4">
        {gradingSystem.map((tier) => (
          <div key={tier.tier}>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              {tier.tier}
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                Overall
              </span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {tier.grades.map((g) => (
                <div
                  key={`${tier.tier}-${g.grade}`}
                  className="border-border flex items-center justify-between rounded border px-3 py-2"
                >
                  <span className="text-sm font-semibold">{g.grade}</span>
                  <span className="text-muted-foreground text-xs">
                    {g.minScore}–{g.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
