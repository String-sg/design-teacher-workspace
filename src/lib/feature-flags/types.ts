export type FeatureFlagKey = 'announcements' | 'notifications'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
