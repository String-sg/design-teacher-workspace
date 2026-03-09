import { useState } from 'react'
import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  Home,
  MessageSquare,
  Play,
  Search,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Tab = 'recommended' | 'deep-dive'

const recommendedActions = [
  {
    icon: Search,
    text: 'Confirm the pattern',
    link: { label: 'LTA guidelines', href: '#' },
  },
  {
    icon: MessageSquare,
    text: 'Do a student check-in when reachable: explore barriers (sleep, anxiety, bullying, transport, caregiving) and agree on one small next step',
    link: { label: 'Check-in template', href: '#' },
  },
  {
    icon: ClipboardList,
    text: 'Reach out to both caregivers within 24–48 hours through a call, SMS/WhatsApp, and email, and document your attempts.',
    link: { label: 'See parents contact', href: '#' },
  },
  {
    icon: Home,
    text: 'If uncontactable or persistent: initiate home visit per guidelines',
    link: { label: 'Home visit checklist', href: '#' },
  },
  {
    icon: BookOpen,
    text: 'Hold a brief case discussion.',
    link: { label: 'Open CaseSync', href: '#', external: true },
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
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">
          How to support students with LTA
        </DialogTitle>

        <div className="flex min-h-[600px] max-h-[85vh]">
          {/* ── Left panel ── */}
          <div className="w-[42%] shrink-0 bg-white flex flex-col overflow-y-auto p-10">
            <img
              src="/lta-illustration.png"
              alt="Classroom with an empty red chair"
              className="w-full max-w-xs object-contain"
            />

            <div className="mt-8">
              <h2 className="text-3xl font-bold leading-tight text-foreground">
                How to support students with LTA?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Long-term absenteeism (LTA) can severely impact a student's
                academic growth and social skills.
              </p>

              <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
                <p className="text-sm text-foreground font-medium">
                  LTA occurs when students are:
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-foreground list-disc pl-4">
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

          {/* ── Right panel ── */}
          <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto p-10 pt-8">
            {/* Segmented toggle — full width */}
            <div className="flex w-full rounded-full bg-muted p-1 gap-0.5">
              <button
                className={cn(
                  'flex-1 rounded-full py-1.5 text-sm font-medium transition-colors',
                  activeTab === 'recommended'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveTab('recommended')}
              >
                Recommended actions
              </button>
              <button
                className={cn(
                  'flex-1 rounded-full py-1.5 text-sm font-medium transition-colors',
                  activeTab === 'deep-dive'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveTab('deep-dive')}
              >
                Deep dive
              </button>
            </div>

            {/* Content */}
            <div className="mt-6">
              {activeTab === 'recommended' ? (
                <ul className="-mx-3">
                  {recommendedActions.map((action, i) => {
                    const Icon = action.icon
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-4 rounded-xl px-3 py-3.5 hover:bg-white/70 transition-colors cursor-default"
                      >
                        {/* Category icon */}
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </span>

                        {/* Text + link */}
                        <div className="min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">
                            {action.text}
                          </p>
                          <a
                            href={action.link.href}
                            className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline underline-offset-2"
                            onClick={(e) => e.preventDefault()}
                          >
                            {action.link.label}
                            {'external' in action.link &&
                              action.link.external && (
                                <ExternalLink className="h-3.5 w-3.5" />
                              )}
                          </a>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <ul className="-mx-3 space-y-1">
                  {/* Item 1 — Play video */}
                  <li className="rounded-xl px-3 py-4 hover:bg-white/70 transition-colors cursor-default">
                    <p className="text-sm font-medium text-foreground leading-snug">
                      Why students go missing: patterns behind absenteeism
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      By AST · 8 min watch
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" className="gap-1.5">
                        <Play className="h-3.5 w-3.5" />
                        Play
                      </Button>
                      <Button variant="outline" size="sm">
                        Open Glow
                      </Button>
                    </div>
                  </li>

                  {/* Item 2 — Read article */}
                  <li className="rounded-xl px-3 py-4 hover:bg-white/70 transition-colors cursor-default">
                    <p className="text-sm font-medium text-foreground leading-snug">
                      Having difficult conversations with parents about
                      attendance
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      By AST · 5 min read
                    </p>
                    <div className="mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        Read more
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
