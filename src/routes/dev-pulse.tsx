import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import {
  DEFAULT_FEATURE_FLAGS,
  FEATURE_FLAGS_STORAGE_KEY,
} from '@/lib/feature-flags'

export const Route = createFileRoute('/dev-pulse')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY)
    const flags = stored
      ? { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(stored) }
      : DEFAULT_FEATURE_FLAGS
    if (!flags['dev-pulse']) throw redirect({ to: '/' })
  },
  component: DevPulseLayout,
})

function DevPulseLayout() {
  return <Outlet />
}
