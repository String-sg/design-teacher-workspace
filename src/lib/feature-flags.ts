import { useSyncExternalStore } from 'react'

export type FeatureFlagKey = 'announcements' | 'notifications' | 'holistic-reports'

export interface FeatureFlagConfig {
  key: FeatureFlagKey
  label: string
  description: string
  defaultValue: boolean
}

export const featureFlagConfigs: Array<FeatureFlagConfig> = [
  {
    key: 'announcements',
    label: 'Announcements',
    description: 'Show or hide the Announcements page in the sidebar navigation',
    defaultValue: false,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Enable notification features (coming soon)',
    defaultValue: true,
  },
  {
    key: 'holistic-reports',
    label: 'Holistic Reports',
    description: 'Enable the holistic development reports table view for students',
    defaultValue: false,
  },
]

const STORAGE_KEY = 'feature-flags'

type FeatureFlagsState = Record<FeatureFlagKey, boolean>

function getDefaultState(): FeatureFlagsState {
  return featureFlagConfigs.reduce(
    (acc, config) => {
      acc[config.key] = config.defaultValue
      return acc
    },
    {} as FeatureFlagsState,
  )
}

function loadState(): FeatureFlagsState {
  if (typeof window === 'undefined') {
    return getDefaultState()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<FeatureFlagsState>
      // Merge with defaults to handle new flags
      return { ...getDefaultState(), ...parsed }
    }
  } catch {
    // Ignore parse errors
  }

  return getDefaultState()
}

function saveState(state: FeatureFlagsState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Simple store for feature flags
let state = loadState()
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): FeatureFlagsState {
  return state
}

function getServerSnapshot(): FeatureFlagsState {
  return getDefaultState()
}

export function setFeatureFlag(key: FeatureFlagKey, enabled: boolean): void {
  state = { ...state, [key]: enabled }
  saveState(state)
  listeners.forEach((listener) => listener())
}

export function useFeatureFlags(): FeatureFlagsState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useFeatureIsOn(key: FeatureFlagKey): boolean {
  const flags = useFeatureFlags()
  return flags[key]
}
