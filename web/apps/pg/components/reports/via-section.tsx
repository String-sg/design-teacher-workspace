import { Heart } from 'lucide-react';

import type { VIAActivity } from '~/apps/pg/types/report';

interface VIASectionProps {
  activities: VIAActivity[];
}

export function VIASection({ activities }: VIASectionProps) {
  return (
    <section className="rounded-lg border border-border p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#e8feea]">
          <Heart className="text-[#12b886]" size={18} />
        </div>
        <h2 className="text-base font-semibold">Values in Action (VIA)</h2>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {activities.map((activity) => (
          <div key={activity.activityName} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#e8feea] px-3 py-1 text-xs font-semibold text-[#12b886] uppercase">
                {activity.category}
              </span>
              <span className="text-sm text-muted-foreground">{activity.hours} Hours</span>
            </div>
            <p className="text-sm font-semibold">{activity.activityName}</p>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Role: {activity.role}
            </p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
