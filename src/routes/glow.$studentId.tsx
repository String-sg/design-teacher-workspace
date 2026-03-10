import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'

import { GlowStudentSupportPage } from '@/components/students/lta-dialog'
import { getStudentById } from '@/data/mock-students'

export const Route = createFileRoute('/glow/$studentId')({
  component: GlowPage,
  loader: ({ params }) => {
    const student = getStudentById(params.studentId)
    if (!student) throw notFound()
    return { student }
  },
})

function GlowPage() {
  const { student } = Route.useLoaderData()
  const navigate = useNavigate()

  return (
    <GlowStudentSupportPage
      student={student}
      onClose={() =>
        navigate({ to: '/students/$id', params: { id: student.id } })
      }
    />
  )
}
