export type FeatureFlagKey =
  | 'announcements'
  | 'notifications'
  | 'holistic-reports'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
