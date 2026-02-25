import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, ChevronRight, Home } from 'lucide-react'

import { AllearsHeader } from '@/components/allears/allears-header'
import { AudienceTypeCard } from '@/components/allears/audience-type-card'
import { Button } from '@/components/ui/button'
import { audienceTypes } from '@/data/audience-types'

export const Route = createFileRoute('/_allears/allears/')({
  component: SelectAudiencePage,
})

function SelectAudiencePage() {
  const [selectedId, setSelectedId] = useState('all')
  const navigate = useNavigate()

  function handleSelect(id: string) {
    setSelectedId(id)
    navigate({ to: '/allears/questions' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6fa]">
      <AllearsHeader activeTab="AUDIENCE" />

      <main className="flex flex-1 flex-col">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between px-8 pt-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Home className="h-4 w-4" />
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">Select Audience Type</span>
          </nav>

          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Saved</span>
          </div>
        </div>

        {/* Centered content */}
        <div className="flex flex-1 flex-col items-center px-8 pt-10">
          {/* Title */}
          <h1 className="text-2xl font-bold text-blue-900">
            Select your audience type
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-xl text-center text-sm text-slate-500">
            *For school staff, please note that only responses{' '}
            <strong className="text-slate-700">from your school</strong> will be
            visible to you.
          </p>
          <p className="mt-1 text-center text-sm text-slate-500">
            To collaborate across schools,{' '}
            <a href="#" className="text-blue-600 underline">
              learn more
            </a>
            .
          </p>

          {/* Audience Cards */}
          <div className="mt-10 grid w-full max-w-4xl grid-cols-4 gap-5">
            {audienceTypes.map((audience) => (
              <AudienceTypeCard
                key={audience.id}
                audience={audience}
                selected={selectedId === audience.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-8 pb-8 pt-4">
          <Button
            className="gap-2 rounded-md bg-blue-800 px-6 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-blue-900"
            render={<Link to="/allears/questions" />}
          >
            GO TO: QUESTIONS
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
