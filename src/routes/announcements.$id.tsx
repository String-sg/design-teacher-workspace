import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getAnnouncementById } from '@/data/mock-announcements'

export const Route = createFileRoute('/announcements/$id')({
  component: AnnouncementDetailPage,
  loader: ({ params }) => {
    const announcement = getAnnouncementById(params.id)
    if (!announcement) {
      throw notFound()
    }
    return { announcement }
  },
})

function AnnouncementDetailPage() {
  const { announcement } = Route.useLoaderData()

  const formattedDate = announcement.createdAt.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          render={<Link to="/announcements" />}
        >
          <ArrowLeft className="mr-1 size-4" />
          Back to Announcements
        </Button>
      </div>

      {/* Article content */}
      <article>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold leading-tight">
            {announcement.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">{formattedDate}</p>
        </header>

        <div className="prose prose-sm max-w-none">
          {announcement.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-foreground mb-4 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  )
}
