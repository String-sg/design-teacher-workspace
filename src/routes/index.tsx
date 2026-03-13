import { createFileRoute } from '@tanstack/react-router'

import { FeaturedAppCard } from '@/components/app-card'
import { AppSection } from '@/components/app-section'
import { Greeting } from '@/components/greeting'
import { appCategories, featuredApp } from '@/data/apps'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  useSetBreadcrumbs([{ label: 'Home', href: '/' }])

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      <Greeting />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Featured</h2>
        <FeaturedAppCard
          name={featuredApp.name}
          description={featuredApp.description}
          icon={featuredApp.icon}
          color={featuredApp.color}
          href={featuredApp.href}
          badge={featuredApp.badge}
        />
      </section>

      {appCategories.map((category) => (
        <AppSection
          key={category.id}
          title={category.title}
          description={category.description}
          apps={category.apps}
        />
      ))}
    </main>
  )
}
