import { createFileRoute } from '@tanstack/react-router'

import type { FeatureFlagKey } from '@/lib/feature-flags'
import { useFeatureFlags } from '@/lib/feature-flags'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export const Route = createFileRoute('/flags')({
  component: FeatureFlagsPage,
})

interface FeatureFlagConfig {
  key: FeatureFlagKey
  label: string
  description: string
}

const featureFlagConfigs: Array<FeatureFlagConfig> = [
  {
    key: 'announcements',
    label: 'Announcements',
    description:
      'Show or hide the Announcements page in the sidebar navigation',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Enable notification features',
  },
  {
    key: 'holistic-reports',
    label: 'Holistic Reports',
    description: 'Enable the holistic development reports table view',
  },
]

function FeatureFlagsPage() {
  const { flags, setFlag } = useFeatureFlags()

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Manage feature flags for this application. Changes are stored
            locally and persist across sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureFlagConfigs.map((config) => (
            <div
              key={config.key}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor={config.key} className="text-sm font-medium">
                  {config.label}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {config.description}
                </p>
              </div>
              <Switch
                id={config.key}
                checked={flags[config.key]}
                onCheckedChange={(checked) => setFlag(config.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
