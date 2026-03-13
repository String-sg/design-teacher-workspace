import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

const tabs = [
  { label: 'AUDIENCE', href: '/allears' },
  { label: 'QUESTIONS', href: '/allears/questions' },
  { label: 'RESPONSES', href: '/allears/responses' },
  { label: 'COLLABORATORS', href: undefined },
] as const

interface AllearsHeaderProps {
  activeTab?: string
}

export function AllearsHeader({ activeTab = 'AUDIENCE' }: AllearsHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-8">
        <Link
          to="/forms"
          className="mr-4 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>

        {/* Logo */}
        <div className="mr-auto">
          <img
            src="/logos/ae-logo.png"
            alt="All Ears Form Builder"
            className="h-10 w-auto"
          />
        </div>

        {/* Tabs - centered */}
        <nav className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = tab.label === activeTab

            if (tab.href) {
              return (
                <Link
                  key={tab.label}
                  to={tab.href}
                  className={cn(
                    'relative pb-1 text-sm font-semibold tracking-wide transition-colors',
                    isActive
                      ? 'text-blue-600 after:absolute after:-bottom-[1.125rem] after:left-0 after:right-0 after:h-[2px] after:bg-blue-600'
                      : 'text-slate-400 hover:text-slate-600',
                  )}
                >
                  {tab.label}
                </Link>
              )
            }

            return (
              <span
                key={tab.label}
                className="pb-1 text-sm font-semibold tracking-wide text-slate-400"
              >
                {tab.label}
              </span>
            )
          })}
        </nav>

        {/* Welcome - right */}
        <div className="ml-auto flex flex-col items-end text-xs">
          <span className="font-medium tracking-wider text-slate-400">
            WELCOME
          </span>
          <span className="font-semibold text-slate-800">Reza Ilmi</span>
        </div>
      </div>
    </header>
  )
}
