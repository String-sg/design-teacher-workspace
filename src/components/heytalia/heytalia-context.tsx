import { createContext, useContext, useState } from 'react'

type HeyTaliaView = 'closed' | 'picker' | 'chat'

interface HeyTaliaContextValue {
  view: HeyTaliaView
  setView: (view: HeyTaliaView) => void
}

const HeyTaliaContext = createContext<HeyTaliaContextValue | null>(null)

export function HeyTaliaProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<HeyTaliaView>('closed')
  return <HeyTaliaContext value={{ view, setView }}>{children}</HeyTaliaContext>
}

export function useHeyTalia() {
  const ctx = useContext(HeyTaliaContext)
  if (!ctx) throw new Error('useHeyTalia must be used within HeyTaliaProvider')
  return ctx
}
