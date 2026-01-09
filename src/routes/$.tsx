import { Link, createFileRoute } from '@tanstack/react-router'
import { Construction } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/$')({
  component: ComingSoonPage,
})

function ComingSoonPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <Construction className="size-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Coming Soon
          </h1>
          <p className="max-w-md text-muted-foreground">
            This feature is currently under development. Check back later for
            updates.
          </p>
        </div>
        <Button variant="outline" render={<Link to="/" />}>
          Back to Home
        </Button>
      </div>
    </main>
  )
}
