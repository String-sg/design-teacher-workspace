import {
  GrowthBookProvider as GBProvider,
} from '@growthbook/growthbook-react'
import * as React from 'react'

import { createGrowthBookClient } from './client'
import type {
  GrowthBook} from '@growthbook/growthbook-react';
import type { AppFeatures } from './types'

interface GrowthBookProviderProps {
  children: React.ReactNode
}

// Context for tracking if we have a GrowthBook instance ready
type GrowthBookContextValue = GrowthBook<AppFeatures> | null
const GrowthBookClientContext =
  React.createContext<GrowthBookContextValue>(null)

export function useGrowthBookClient() {
  return React.useContext(GrowthBookClientContext)
}

export function GrowthBookProvider({ children }: GrowthBookProviderProps) {
  const [gb, setGb] = React.useState<GrowthBook<AppFeatures> | null>(null)

  React.useEffect(() => {
    const client = createGrowthBookClient()
    setGb(client)

    client.init({ streaming: true }).catch((error) => {
      console.warn('GrowthBook init failed:', error)
    })

    return () => {
      client.destroy()
    }
  }, [])

  // During SSR or before client init, render children without GrowthBook provider
  // Our hooks will use fallback values in this case
  if (!gb) {
    return (
      <GrowthBookClientContext.Provider value={null}>
        {children}
      </GrowthBookClientContext.Provider>
    )
  }

  return (
    <GrowthBookClientContext.Provider value={gb}>
      <GBProvider growthbook={gb}>{children}</GBProvider>
    </GrowthBookClientContext.Provider>
  )
}
