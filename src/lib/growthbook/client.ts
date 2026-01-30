import { GrowthBook } from '@growthbook/growthbook-react'

import type { AppFeatures } from './types'

export function createGrowthBookClient(): GrowthBook<AppFeatures> {
  const apiHost = import.meta.env.VITE_GROWTHBOOK_API_HOST
  const clientKey = import.meta.env.VITE_GROWTHBOOK_CLIENT_KEY

  const gb = new GrowthBook<AppFeatures>({
    apiHost,
    clientKey,
    enableDevMode: import.meta.env.DEV,
  })

  return gb
}
