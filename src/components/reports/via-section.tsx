import { Heart } from 'lucide-react'
import type { VIAActivity } from '@/types/report'

interface VIASectionProps {
  activities: Array<VIAActivity>
}

export function VIASection({ activities }: VIASectionProps) {
  return (
    <section className="border-border rounded-lg border p-5">
      <div className="flex items-center gap-2">
        <Heart className="text-[#12b886]" size={20} />
        <h2 className="text-base font-semibold">Values in Action (VIA)</h2>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {activities.map((activity) => (
          <div key={activity.activityName} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#e8feea] px-3 py-1 text-xs font-semibold uppercase text-[#12b886]">
                {activity.category}
              </span>
              <span className="text-muted-foreground text-sm">
                {activity.hours} hours
              </span>
            </div>
            <p className="text-sm font-medium">{activity.activityName}</p>
            <p className="text-muted-foreground text-sm">
              Role: {activity.role}
            </p>
            <p className="text-muted-foreground text-sm">
              {activity.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
