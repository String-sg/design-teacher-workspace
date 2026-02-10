import type { AcademicAggregate } from '@/types/report'

interface AcademicAggregatesSectionProps {
  aggregates: Array<AcademicAggregate>
}

const AGGREGATE_COLORS = [
  { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
]

export function AcademicAggregatesSection({
  aggregates,
}: AcademicAggregatesSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Academic Aggregates</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {aggregates.map((agg, i) => {
          const color = AGGREGATE_COLORS[i % AGGREGATE_COLORS.length]
          return (
            <div
              key={agg.label}
              className={`flex flex-col items-center rounded-lg border p-3 ${color.bg} ${color.border}`}
            >
              <p className="text-muted-foreground text-[10px] uppercase">
                {agg.label}
              </p>
              <p className={`text-2xl font-bold ${color.text}`}>{agg.value}</p>
              <p className="text-muted-foreground text-center text-[10px]">
                {agg.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
