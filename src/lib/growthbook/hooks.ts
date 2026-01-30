import { useGrowthBookClient } from './provider'
import { DEFAULT_FEATURE_VALUES } from './types'
import type { AppFeatures, FeatureFlagKey } from './types'

export function useFeatureIsOn(id: FeatureFlagKey): boolean {
  const gb = useGrowthBookClient()

  // During SSR or before GrowthBook is ready, return default values
  if (!gb) {
    return DEFAULT_FEATURE_VALUES[id]
  }

  return gb.getFeatureValue(id, DEFAULT_FEATURE_VALUES[id])
}

export function useFeatureValue<TKey extends FeatureFlagKey>(
  id: TKey,
  fallback: AppFeatures[TKey],
): AppFeatures[TKey] {
  const gb = useGrowthBookClient()

  // During SSR or before GrowthBook is ready, return fallback
  if (!gb) {
    return fallback
  }

  return gb.getFeatureValue(id, fallback)
}
