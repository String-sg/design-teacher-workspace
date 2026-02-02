import * as React from 'react'

import { createGrowthBookClient } from './client'
import type { GrowthBook } from '@growthbook/growthbook-react'
import type { AppFeatures } from './types'

interface GrowthBookProviderProps {
  children: React.ReactNode
}

interface GrowthBookContextValue {
  client: GrowthBook<AppFeatures> | null
  refreshFeatures: () => Promise<void>
  subscribe: (callback: () => void) => () => void
}

const GrowthBookClientContext = React.createContext<GrowthBookContextValue>({
  client: null,
  refreshFeatures: async () => {},
  subscribe: () => () => {},
})

export function useGrowthBookClient(): GrowthBook<AppFeatures> | null {
  return React.useContext(GrowthBookClientContext).client
}

export function useRefreshFeatures(): () => Promise<void> {
  return React.useContext(GrowthBookClientContext).refreshFeatures
}

export function useGrowthBookSubscription(): {
  subscribe: (callback: () => void) => () => void
} {
  const { subscribe } = React.useContext(GrowthBookClientContext)
  return { subscribe }
}

export function GrowthBookProvider({
  children,
}: GrowthBookProviderProps): React.ReactNode {
  const [gb, setGb] = React.useState<GrowthBook<AppFeatures> | null>(null)
  const subscribersRef = React.useRef(new Set<() => void>())

  React.useEffect(() => {
    const client = createGrowthBookClient()
    setGb(client)

    client.setRenderer(() => {
      subscribersRef.current.forEach((callback) => callback())
    })

    client.init({ streaming: true }).catch((error) => {
      console.warn('GrowthBook init failed:', error)
    })

    return () => {
      client.destroy()
    }
  }, [])

  const refreshFeatures = React.useCallback(async () => {
    if (gb) {
      await gb.refreshFeatures({ skipCache: true })
    }
  }, [gb])

  const subscribe = React.useCallback((callback: () => void) => {
    subscribersRef.current.add(callback)
    return () => {
      subscribersRef.current.delete(callback)
    }
  }, [])

  const contextValue = React.useMemo(
    () => ({ client: gb, refreshFeatures, subscribe }),
    [gb, refreshFeatures, subscribe],
  )

  return (
    <GrowthBookClientContext.Provider value={contextValue}>
      {children}
    </GrowthBookClientContext.Provider>
  )
}
