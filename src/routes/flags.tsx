import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

import type { FeatureFlagKey } from '@/lib/growthbook'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { useDevOverrides } from '@/lib/growthbook'

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
    description: 'Enable notification features (coming soon)',
  },
]

function FeatureFlagsPage() {
  const { setOverride, resetOverrides, getCurrentValue, hasOverrides } =
    useDevOverrides()

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags (Dev Overrides)</CardTitle>
          <CardDescription>
            Override feature flag values for local development. These settings
            are stored locally and will take precedence over GrowthBook values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasOverrides && (
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription>
                You have local overrides active. These will take precedence over
                remote GrowthBook values.
              </AlertDescription>
            </Alert>
          )}
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
                checked={getCurrentValue(config.key)}
                onCheckedChange={(checked) => setOverride(config.key, checked)}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={resetOverrides}>
            Clear All Overrides
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
