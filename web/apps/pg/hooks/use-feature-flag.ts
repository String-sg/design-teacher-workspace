import type { FeatureFlagKey } from '~/platform/lib/feature-flags';
import { useFeatureFlags } from '~/platform/lib/feature-flags';

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(key);
}
