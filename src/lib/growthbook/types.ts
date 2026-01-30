export type FeatureFlagKey = 'announcements' | 'notifications'

export type AppFeatures = {
  announcements: boolean
  notifications: boolean
}

export const DEFAULT_FEATURE_VALUES: AppFeatures = {
  announcements: false,
  notifications: true,
}
