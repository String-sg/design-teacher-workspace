import type { FeatureFlagKey } from '@/lib/feature-flags'
import { useFeatureFlags } from '@/lib/feature-flags'

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const { isEnabled } = useFeatureFlags()
  return isEnabled(key)
}
