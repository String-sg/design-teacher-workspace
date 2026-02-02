import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { StudentProfile } from '@/components/students/student-profile'
import { getStudentById } from '@/data/mock-students'

export const Route = createFileRoute('/students/$id')({
  component: StudentProfilePage,
  loader: ({ params }) => {
    const student = getStudentById(params.id)
    if (!student) {
      throw notFound()
    }
    return { student }
  },
})

function StudentProfilePage() {
  const { student } = Route.useLoaderData()

  return (
    <main className="flex flex-col gap-6 p-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          render={<Link to="/students" />}
        >
          <ArrowLeft className="mr-1 size-4" />
          Dashboard
        </Button>
      </div>

      <StudentProfile student={student} />
    </main>
  )
}
