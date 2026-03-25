export type FeatureFlagKey =
  | 'posts'
  | 'forms'
  | 'notifications'
  | 'holistic-reports'
  | 'parents-gateway'
  | 'student-analytics'
  | 'lta-intervention'

export type FeatureFlags = {
  [K in FeatureFlagKey]: boolean
}
