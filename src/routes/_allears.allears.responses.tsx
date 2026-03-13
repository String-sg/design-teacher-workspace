import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Home, Inbox, Send } from 'lucide-react'

import { AllearsHeader } from '@/components/allears/allears-header'

export const Route = createFileRoute('/_allears/allears/responses')({
  component: ResponsesPage,
})

function ResponsesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AllearsHeader activeTab="RESPONSES" />

      <main className="flex flex-1 flex-col px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-600">Responses</span>
          </nav>
        </div>

        {/* Empty state */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-center">
            {/* Layered icon composition */}
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 shadow-sm">
                <Inbox className="h-9 w-9 text-blue-300" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-sm">
                <Send
                  className="h-3.5 w-3.5 -translate-x-px text-slate-400"
                  strokeWidth={2}
                />
              </div>
            </div>

            <h2 className="text-base font-semibold text-slate-800">
              Awaiting parent responses
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
              No responses yet. Once parents reply through Parents Gateway,
              their responses will appear here.
            </p>

            {/* Visual hint — progress dots */}
            <div className="mt-6 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-200" />
              <div className="h-1.5 w-1.5 rounded-full bg-blue-100" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-100" />
            </div>
            <span className="mt-2 text-[11px] font-medium tracking-wide text-slate-300">
              AWAITING RESPONSES
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
