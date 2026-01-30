import * as React from 'react'

import {
  clearDevOverrides,
  getFeatureValueWithOverrides,
  loadDevOverrides,
  saveDevOverrides,
} from './client'
import { useGrowthBookClient } from './provider'
import { DEFAULT_FEATURE_VALUES } from './types'
import type { AppFeatures, FeatureFlagKey } from './types'

export function useFeatureIsOn(id: FeatureFlagKey): boolean {
  const gb = useGrowthBookClient()
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'growthbook_dev_overrides') {
        forceUpdate()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // During SSR or before GrowthBook is ready, return default values
  if (!gb) {
    return DEFAULT_FEATURE_VALUES[id]
  }

  return getFeatureValueWithOverrides(gb, id)
}

export function useFeatureValue<TKey extends FeatureFlagKey>(
  id: TKey,
  fallback: AppFeatures[TKey],
): AppFeatures[TKey] {
  const gb = useGrowthBookClient()
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'growthbook_dev_overrides') {
        forceUpdate()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // During SSR or before GrowthBook is ready, return fallback
  if (!gb) {
    return fallback
  }

  const overrides = loadDevOverrides()
  if (overrides && id in overrides) {
    return overrides[id] as AppFeatures[TKey]
  }

  return gb.getFeatureValue(id, fallback)
}

export function useDevOverrides() {
  const [overrides, setOverrides] = React.useState<Partial<AppFeatures>>({})

  React.useEffect(() => {
    setOverrides(loadDevOverrides() ?? {})
  }, [])

  const setOverride = React.useCallback(
    (key: FeatureFlagKey, value: boolean) => {
      const newOverrides = { ...overrides, [key]: value }
      setOverrides(newOverrides)
      saveDevOverrides(newOverrides)
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'growthbook_dev_overrides' }),
      )
    },
    [overrides],
  )

  const resetOverrides = React.useCallback(() => {
    setOverrides({})
    clearDevOverrides()
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'growthbook_dev_overrides' }),
    )
  }, [])

  const getCurrentValue = React.useCallback(
    (key: FeatureFlagKey): boolean => {
      if (key in overrides) {
        return overrides[key] as boolean
      }
      return DEFAULT_FEATURE_VALUES[key]
    },
    [overrides],
  )

  return {
    overrides,
    setOverride,
    resetOverrides,
    getCurrentValue,
    hasOverrides: Object.keys(overrides).length > 0,
  }
}
