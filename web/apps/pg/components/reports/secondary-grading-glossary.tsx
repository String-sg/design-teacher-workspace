import type { GradingTierDefinition } from '~/apps/pg/types/report';

interface SecondaryGradingGlossaryProps {
  gradingSystem: GradingTierDefinition[];
}

export function SecondaryGradingGlossary({ gradingSystem }: SecondaryGradingGlossaryProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Grading System</h2>
      <div className="flex flex-col gap-4">
        {gradingSystem.map((tier) => (
          <div key={tier.tier}>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">
              {tier.tier}
              <span className="ml-1 text-xs font-normal text-muted-foreground">Overall</span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {tier.grades.map((g) => (
                <div
                  key={`${tier.tier}-${g.grade}`}
                  className="flex items-center justify-between rounded border border-border px-3 py-2"
                >
                  <span className="text-sm font-semibold">{g.grade}</span>
                  <span className="text-xs text-muted-foreground">
                    {g.minScore}–{g.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
