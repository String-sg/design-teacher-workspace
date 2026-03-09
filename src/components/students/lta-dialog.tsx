import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

type Tab = 'recommended' | 'deep-dive'

const recommendedActions = [
  {
    text: 'Confirm the pattern',
    link: { label: 'LTA guidelines', href: '#' },
  },
  {
    text: 'Do a student check-in when reachable: explore barriers (sleep, anxiety, bullying, transport, caregiving) and agree on one small next step',
    link: { label: 'Check-in template', href: '#' },
  },
  {
    text: 'Reach out to both caregivers within 24–48 hours through a call, SMS/WhatsApp, and email, and document your attempts.',
    link: { label: 'See parents contact', href: '#' },
  },
  {
    text: 'If uncontactable or persistent: initiate home visit per guidelines',
    link: { label: 'Home visit checklist', href: '#' },
  },
  {
    text: 'Hold a brief case discussion.',
    link: { label: 'Open CaseSync', href: '#', external: true },
  },
]

const deepDiveResources = [
  {
    text: 'Why students go missing: patterns behind absenteeism',
    link: { label: 'Check', href: '#' },
  },
  {
    text: 'Having difficult conversations with parents about attendance',
    link: { label: 'Check', href: '#' },
  },
]

interface LtaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LtaDialog({ open, onOpenChange }: LtaDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>('recommended')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 gap-0 overflow-hidden rounded-2xl"
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">
          How to support students with LTA
        </DialogTitle>

        <div className="flex min-h-[520px]">
          {/* Left panel */}
          <div className="w-[45%] shrink-0 bg-white p-8 flex flex-col">
            {/* Illustration */}
            <div className="flex-1 flex items-start">
              <img
                src="/lta-illustration.png"
                alt="Classroom with an empty red chair"
                className="w-full max-w-[280px] object-contain"
              />
            </div>

            {/* Text content */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold leading-tight text-foreground">
                How to support students with LTA?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Long-term absenteeism (LTA) can severely impact a student's
                academic growth and social skills.
              </p>

              {/* Definition box */}
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
                <p className="text-sm text-foreground">
                  LTA occurs when students are:
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-foreground list-disc pl-4">
                  <li>Continuously absent for more than 3 days, or</li>
                  <li>
                    Persistently absent for over 10 days in a term without
                    valid reasons.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-border shrink-0" />

          {/* Right panel */}
          <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
            {/* Segmented toggle */}
            <div className="inline-flex rounded-full bg-muted p-1 gap-0.5">
              <button
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === 'recommended'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('recommended')}
              >
                Recommended actions
              </button>
              <button
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === 'deep-dive'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('deep-dive')}
              >
                Deep dive
              </button>
            </div>

            {/* Content */}
            <div className="mt-6 space-y-6">
              {activeTab === 'recommended'
                ? recommendedActions.map((action, i) => (
                    <div key={i}>
                      <p className="text-sm text-foreground leading-relaxed">
                        {action.text}
                      </p>
                      <a
                        href={action.link.href}
                        className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline underline-offset-2"
                        onClick={(e) => e.preventDefault()}
                      >
                        {action.link.label}
                        {'external' in action.link && action.link.external && (
                          <span className="text-xs">↗</span>
                        )}
                      </a>
                    </div>
                  ))
                : deepDiveResources.map((resource, i) => (
                    <div key={i}>
                      <p className="text-sm text-foreground leading-relaxed">
                        {resource.text}
                      </p>
                      <a
                        href={resource.link.href}
                        className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline underline-offset-2"
                        onClick={(e) => e.preventDefault()}
                      >
                        {resource.link.label}
                      </a>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
