export type FeatureFlagKey =
  | 'announcements'
  | 'notifications'
  | 'holistic-reports'
  | 'parents-gateway'
  | 'student-analytics'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
