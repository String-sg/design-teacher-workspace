import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, ChevronLeft, ChevronRight, Home } from 'lucide-react'

import { AllearsHeader } from '@/components/allears/allears-header'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_allears/allears/respond')({
  component: ChooseRespondentsPage,
})

interface RespondentCard {
  id: 'specific' | 'any'
  title: string
  description: string
  bgColor: string
}

const CARDS: RespondentCard[] = [
  {
    id: 'specific',
    title: 'Specific custodians only',
    description:
      'Only parents or legal guardians of selected MOE students can respond',
    bgColor: '#eef2fb',
  },
  {
    id: 'any',
    title: 'Any custodians',
    description:
      'Any parents or legal guardians of MOE students can log in with Singpass to respond',
    bgColor: '#edf8f4',
  },
]

function ChooseRespondentsPage() {
  const [selected, setSelected] = useState<'specific' | 'any'>('specific')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6fa]">
      <AllearsHeader activeTab="AUDIENCE" />

      <main className="flex flex-1 flex-col">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between px-8 pt-6">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Home className="h-4 w-4" />
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <Link
              to="/allears"
              className="hover:text-slate-700 hover:underline underline-offset-2"
            >
              Select audience type
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">
              Choose who can respond
            </span>
          </nav>

          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Saved</span>
          </div>
        </div>

        {/* Centered content */}
        <div className="flex flex-1 flex-col items-center px-8 pt-10">
          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-900">
            Choose who can respond
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-2xl text-center text-sm text-slate-500">
            *For school staff, please note that only responses{' '}
            <strong className="font-semibold text-slate-700">
              from your school
            </strong>{' '}
            will be visible to you.
            <br />
            To collaborate across schools,{' '}
            <a href="#" className="text-blue-600 underline underline-offset-2">
              learn more
            </a>
            .
          </p>

          {/* Cards */}
          <div className="mt-10 flex w-full max-w-2xl gap-5">
            {CARDS.map((card) => {
              const isSelected = selected === card.id
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelected(card.id)}
                  className={cn(
                    'group relative flex flex-1 flex-col overflow-hidden rounded-xl border-2 text-center transition-all',
                    isSelected
                      ? 'border-blue-600 shadow-lg'
                      : 'border-transparent hover:border-slate-300',
                  )}
                  style={{ backgroundColor: card.bgColor }}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute left-3 top-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex flex-col items-center px-6 pt-8">
                    <h3 className="text-lg font-bold text-blue-900">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {card.description}
                    </p>
                  </div>

                  {/* Illustration */}
                  <div className="mt-auto flex items-end justify-center px-4 pb-4 pt-4">
                    {card.id === 'specific' ? (
                      <SpecificCustodianBunny />
                    ) : (
                      <AnyCustodianBunny />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 pb-8 pt-6">
          <button
            type="button"
            onClick={() => navigate({ to: '/allears' })}
            className="flex items-center gap-2 rounded-md border border-blue-800 px-6 py-2.5 text-sm font-semibold tracking-wide text-blue-800 hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4" />
            BACK
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: '/allears/individuals' })}
            className="flex items-center gap-2 rounded-md bg-blue-800 px-6 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-blue-900"
          >
            NEXT: SELECT INDIVIDUALS OR GROUPS
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}

// Single bunny holding a stop-sign badge
function SpecificCustodianBunny() {
  const pink = '#f4a7b0'
  const light = '#f8c4ca'
  const cheek = '#f9b8bf'
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* Body */}
      <ellipse cx="80" cy="115" rx="32" ry="18" fill={pink} />
      <circle cx="80" cy="88" r="24" fill={pink} />
      {/* Ears */}
      <ellipse cx="63" cy="48" rx="9" ry="24" fill={pink} />
      <ellipse cx="63" cy="48" rx="5.5" ry="17" fill={light} />
      <ellipse cx="97" cy="48" rx="9" ry="24" fill={pink} />
      <ellipse cx="97" cy="48" rx="5.5" ry="17" fill={light} />
      {/* Eyes — closed/squinting */}
      <path d="M70 86 Q73 83 76 86" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M84 86 Q87 83 90 86" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <ellipse cx="63" cy="94" rx="5" ry="3" fill={cheek} opacity="0.6" />
      <ellipse cx="97" cy="94" rx="5" ry="3" fill={cheek} opacity="0.6" />
      {/* Mouth */}
      <path d="M77 98 Q80 101 83 98" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Arm holding stop sign */}
      <line x1="96" y1="100" x2="114" y2="88" stroke={pink} strokeWidth="7" strokeLinecap="round" />
      {/* Stop sign (red octagon) */}
      <polygon
        points="114,74 120,72 126,74 128,80 126,86 120,88 114,86 112,80"
        fill="#e53e3e"
      />
      <text x="114.5" y="84" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">STOP</text>
      {/* Left arm */}
      <ellipse cx="56" cy="108" rx="7" ry="4" fill={pink} transform="rotate(-40 56 108)" />
    </svg>
  )
}

// Two bunnies — adult + child
function AnyCustodianBunny() {
  const pink = '#f4a7b0'
  const light = '#f8c4ca'
  const cheek = '#f9b8bf'
  return (
    <svg width="180" height="130" viewBox="0 0 180 130" fill="none">
      {/* === Big bunny (left) === */}
      <ellipse cx="70" cy="115" rx="30" ry="17" fill={pink} />
      <circle cx="70" cy="88" r="22" fill={pink} />
      {/* Big ears */}
      <ellipse cx="54" cy="48" rx="8" ry="22" fill={pink} />
      <ellipse cx="54" cy="48" rx="5" ry="16" fill={light} />
      <ellipse cx="86" cy="48" rx="8" ry="22" fill={pink} />
      <ellipse cx="86" cy="48" rx="5" ry="16" fill={light} />
      {/* Big eyes */}
      <circle cx="63" cy="86" r="3.5" fill="#333" />
      <circle cx="77" cy="86" r="3.5" fill="#333" />
      <circle cx="64" cy="85" r="1" fill="white" />
      <circle cx="78" cy="85" r="1" fill="white" />
      {/* Big cheeks */}
      <ellipse cx="55" cy="93" rx="5" ry="3" fill={cheek} opacity="0.6" />
      <ellipse cx="85" cy="93" rx="5" ry="3" fill={cheek} opacity="0.6" />
      {/* Big mouth */}
      <path d="M67 97 Q70 100 73 97" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Big arm reaching toward child */}
      <ellipse cx="92" cy="103" rx="7" ry="4" fill={pink} transform="rotate(20 92 103)" />

      {/* === Small bunny (right, slightly lower) === */}
      <ellipse cx="130" cy="120" rx="20" ry="12" fill={light} />
      <circle cx="130" cy="103" r="16" fill={light} />
      {/* Small ears */}
      <ellipse cx="119" cy="78" rx="6" ry="16" fill={light} />
      <ellipse cx="119" cy="78" rx="3.5" ry="11" fill="#fde0e3" />
      <ellipse cx="141" cy="78" rx="6" ry="16" fill={light} />
      <ellipse cx="141" cy="78" rx="3.5" ry="11" fill="#fde0e3" />
      {/* Small eyes — squinting/happy */}
      <path d="M122 101 Q124.5 98 127 101" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M133 101 Q135.5 98 138 101" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Small cheeks */}
      <ellipse cx="116" cy="106" rx="4" ry="2.5" fill={cheek} opacity="0.6" />
      <ellipse cx="144" cy="106" rx="4" ry="2.5" fill={cheek} opacity="0.6" />
      {/* Small mouth */}
      <path d="M127 110 Q130 112 133 110" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
