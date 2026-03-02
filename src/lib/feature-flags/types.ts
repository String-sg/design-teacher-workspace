export type FeatureFlagKey =
  | 'announcements'
  | 'notifications'
  | 'holistic-reports'
  | 'parents-gateway'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
