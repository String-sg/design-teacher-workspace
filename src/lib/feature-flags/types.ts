export type FeatureFlagKey =
  | 'announcements'
  | 'forms'
  | 'notifications'
  | 'holistic-reports'
  | 'parents-gateway'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
