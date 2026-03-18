export type FeatureFlagKey =
  | 'announcements'
  | 'forms'
  | 'notifications'
  | 'holistic-reports'
  | 'parents-gateway'
  | 'student-analytics'
  | 'lta-intervention'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
