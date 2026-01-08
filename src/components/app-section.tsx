import type { App } from '@/data/apps'
import { AppCard } from '@/components/app-card'

interface AppSectionProps {
  title: string
  apps: Array<App>
}

export function AppSection({ title, apps }: AppSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            name={app.name}
            description={app.description}
            icon={app.icon}
            color={app.color}
            href={app.href}
          />
        ))}
      </div>
    </section>
  )
}
