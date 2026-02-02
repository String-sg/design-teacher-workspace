import { useEffect, useState } from 'react'

import { useGrowthBookClient, useGrowthBookSubscription } from './provider'
import { DEFAULT_FEATURE_VALUES } from './types'
import type { AppFeatures, FeatureFlagKey } from './types'

export function useFeatureIsOn(id: FeatureFlagKey): boolean {
  const gb = useGrowthBookClient()
  const { subscribe } = useGrowthBookSubscription()
  const defaultValue = DEFAULT_FEATURE_VALUES[id]

  const [value, setValue] = useState(() =>
    gb ? gb.getFeatureValue(id, defaultValue) : defaultValue,
  )

  useEffect(() => {
    const updateValue = () => {
      if (gb) {
        setValue(gb.getFeatureValue(id, defaultValue))
      }
    }

    updateValue()
    return subscribe(updateValue)
  }, [gb, id, defaultValue, subscribe])

  return value
}

export function useFeatureValue<TKey extends FeatureFlagKey>(
  id: TKey,
  fallback: AppFeatures[TKey],
): AppFeatures[TKey] {
  const gb = useGrowthBookClient()
  const { subscribe } = useGrowthBookSubscription()

  const [value, setValue] = useState(() =>
    gb ? gb.getFeatureValue(id, fallback) : fallback,
  )

  useEffect(() => {
    const updateValue = () => {
      if (gb) {
        setValue(gb.getFeatureValue(id, fallback))
      }
    }

    updateValue()
    return subscribe(updateValue)
  }, [gb, id, fallback, subscribe])

  return value
}
