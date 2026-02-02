import { createFileRoute } from '@tanstack/react-router'

import {
  featureFlagConfigs,
  setFeatureFlag,
  useFeatureFlags,
} from '@/lib/feature-flags'
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

function FeatureFlagsPage() {
  const flags = useFeatureFlags()

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Manage feature flags for this application. Changes are saved to your
            browser and take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureFlagConfigs.map((config) => {
            const isEnabled = flags[config.key]

            return (
              <div
                key={config.key}
                className="flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <Label htmlFor={config.key} className="text-sm font-medium">
                    {config.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </div>
                <Switch
                  id={config.key}
                  checked={isEnabled}
                  onCheckedChange={(checked) =>
                    setFeatureFlag(config.key, checked)
                  }
                />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
