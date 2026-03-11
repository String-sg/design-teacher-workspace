import { createFileRoute, Link } from '@tanstack/react-router'
import { Palette, Layers } from 'lucide-react'

import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

export const Route = createFileRoute('/ds/')({
  component: DsIndexPage,
})

const DS_PAGES = [
  {
    to: '/ds/tw-theme' as const,
    title: 'TW Theme',
    description:
      'Teacher Workspace design tokens, color palette, and Shadcn component reference.',
    icon: Palette,
  },
  {
    to: '/ds/flow-tokens' as const,
    title: 'Flow DS Tokens',
    description:
      'Flow Design System token reference — color scales, typography, spacing, and semantic mappings.',
    icon: Layers,
  },
]

function DsIndexPage() {
  useSetBreadcrumbs([{ label: 'Design System', href: '/ds' }])

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Design System</h1>
      <p className="mt-1 text-muted-foreground">
        Token references and component documentation.
      </p>
      <div className="mt-8 grid gap-4">
        {DS_PAGES.map((page) => (
          <Link
            key={page.to}
            to={page.to}
            className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <page.icon className="size-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{page.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {page.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
