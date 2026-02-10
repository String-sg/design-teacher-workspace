import { RadarChart } from './radar-chart'
import type { CoreValue, CoreValueLevel } from '@/types/report'
import { cn } from '@/lib/utils'

const levelColors: Record<CoreValueLevel, string> = {
  'Demonstrates Very Strongly': 'bg-[#e8feea] text-[#12b886]',
  'Demonstrates Strongly': 'bg-[#e8feea] text-[#12b886]',
  Demonstrates: 'bg-[rgba(34,139,230,0.1)] text-[#228be6]',
  'Regularly Shows': 'bg-[#fef9ee] text-[#fac53e]',
  Beginning: 'bg-[#f6f7f8] text-[#a7aab5]',
}

interface CoreValuesSectionProps {
  coreValues: Array<CoreValue>
  studentFirstName: string
}

export function CoreValuesSection({
  coreValues,
  studentFirstName,
}: CoreValuesSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <span className="inline-block rounded-full bg-[#e8feea] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#12b886]">
          Core Values Journey
        </span>
        <h2 className="mt-3 text-xl font-semibold">
          Celebrating {studentFirstName}&apos;s Personal Growth
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Character development is a key part of holistic education. This
          section reflects how {studentFirstName} embodies our school&apos;s
          core values through daily interactions and school activities.
        </p>
      </div>

      <div className="flex justify-center">
        <RadarChart values={coreValues} />
      </div>

      <div className="flex flex-col gap-4">
        {coreValues.map((value) => (
          <div key={value.name} className="border-border rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{value.name}</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {value.description}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
                  levelColors[value.level],
                )}
              >
                {value.level}
              </span>
            </div>
            {value.supportedBy.length > 0 && (
              <div className="mt-3">
                <p className="text-muted-foreground text-xs font-medium">
                  Supported by:
                </p>
                <ul className="text-muted-foreground mt-1 list-inside list-disc text-xs">
                  {value.supportedBy.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
