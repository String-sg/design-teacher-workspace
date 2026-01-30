import { GrowthBook } from '@growthbook/growthbook-react'

import { DEFAULT_FEATURE_VALUES } from './types'
import type { AppFeatures } from './types'

export const DEV_OVERRIDES_STORAGE_KEY = 'growthbook_dev_overrides'

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

export function loadDevOverrides(): Partial<AppFeatures> | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(DEV_OVERRIDES_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Partial<AppFeatures>
    }
  } catch {
    // Invalid JSON
  }

  return null
}

export function saveDevOverrides(overrides: Partial<AppFeatures>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(DEV_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Storage full or unavailable
  }
}

export function clearDevOverrides(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(DEV_OVERRIDES_STORAGE_KEY)
  } catch {
    // Storage unavailable
  }
}

export function getFeatureValueWithOverrides(
  gb: GrowthBook<AppFeatures>,
  key: keyof AppFeatures,
): boolean {
  const overrides = loadDevOverrides()
  if (overrides && key in overrides) {
    return overrides[key] as boolean
  }

  return gb.getFeatureValue(key, DEFAULT_FEATURE_VALUES[key])
}
