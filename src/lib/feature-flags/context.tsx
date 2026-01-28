import * as React from 'react'

import { DEFAULT_FEATURE_FLAGS, FEATURE_FLAGS_STORAGE_KEY } from './constants'
import type { FeatureFlagKey, FeatureFlags } from './types'

interface FeatureFlagContextValue {
  flags: FeatureFlags
  isEnabled: (key: FeatureFlagKey) => boolean
  setFlag: (key: FeatureFlagKey, value: boolean) => void
  resetFlags: () => void
}

const FeatureFlagContext = React.createContext<FeatureFlagContextValue | null>(
  null,
)

export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagContext)
  if (!context) {
    throw new Error(
      'useFeatureFlags must be used within a FeatureFlagProvider.',
    )
  }
  return context
}

function loadFlagsFromStorage(): FeatureFlags {
  if (typeof window === 'undefined') {
    return DEFAULT_FEATURE_FLAGS
  }

  try {
    const stored = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<FeatureFlags>
      return { ...DEFAULT_FEATURE_FLAGS, ...parsed }
    }
  } catch {
    // Invalid JSON, use defaults
  }

  return DEFAULT_FEATURE_FLAGS
}

function saveFlagsToStorage(flags: FeatureFlags): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(flags))
  } catch {
    // Storage full or unavailable
  }
}

export function FeatureFlagProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [flags, setFlags] = React.useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setFlags(loadFlagsFromStorage())
    setIsHydrated(true)
  }, [])

  React.useEffect(() => {
    if (isHydrated) {
      saveFlagsToStorage(flags)
    }
  }, [flags, isHydrated])

  const isEnabled = React.useCallback(
    (key: FeatureFlagKey): boolean => {
      return flags[key]
    },
    [flags],
  )

  const setFlag = React.useCallback(
    (key: FeatureFlagKey, value: boolean): void => {
      setFlags((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFlags = React.useCallback((): void => {
    setFlags(DEFAULT_FEATURE_FLAGS)
  }, [])

  const contextValue = React.useMemo<FeatureFlagContextValue>(
    () => ({
      flags,
      isEnabled,
      setFlag,
      resetFlags,
    }),
    [flags, isEnabled, setFlag, resetFlags],
  )

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  )
}
