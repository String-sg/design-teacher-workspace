import { createContext, useContext, useState } from 'react'

type HeyTaliaView = 'closed' | 'picker' | 'chat'

interface HeyTaliaContextValue {
  view: HeyTaliaView
  setView: (view: HeyTaliaView) => void
  activeAgent: string
  setActiveAgent: (id: string) => void
}

const HeyTaliaContext = createContext<HeyTaliaContextValue | null>(null)

export function HeyTaliaProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<HeyTaliaView>('closed')
  const [activeAgent, setActiveAgent] = useState('heytalia')
  return (
    <HeyTaliaContext value={{ view, setView, activeAgent, setActiveAgent }}>
      {children}
    </HeyTaliaContext>
  )
}

export function useHeyTalia() {
  const ctx = useContext(HeyTaliaContext)
  if (!ctx) throw new Error('useHeyTalia must be used within HeyTaliaProvider')
  return ctx
}
