import { createFileRoute } from '@tanstack/react-router'

import type { FeatureFlagKey } from '@/lib/feature-flags'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useFeatureFlags } from '@/lib/feature-flags'

export const Route = createFileRoute('/feature-flags')({
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
    description: 'Enable notification features (coming soon)',
  },
]

function FeatureFlagsPage() {
  const { flags, setFlag, resetFlags } = useFeatureFlags()

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Toggle features on or off. Changes are saved automatically.
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
        <CardFooter>
          <Button variant="outline" onClick={resetFlags}>
            Reset All to Defaults
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
