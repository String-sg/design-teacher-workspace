import { createFileRoute } from '@tanstack/react-router';

import { appCategories, featuredApp } from '~/apps/pg/data/apps';
import { FeaturedAppCard } from '~/platform/components/app-card';
import { AppSection } from '~/platform/components/app-section';
import { Greeting } from '~/platform/components/greeting';
import { useSetBreadcrumbs } from '~/platform/hooks/use-breadcrumbs';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  useSetBreadcrumbs([{ label: 'Home', href: '/' }]);

  return (
    <main className="mx-auto flex max-w-[760px] flex-col gap-8 px-4 py-8">
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
  );
}
