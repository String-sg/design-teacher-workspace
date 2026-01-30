import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import type { FeatureFlagKey } from '@/lib/growthbook'
import type { GrowthBookFeature } from '@/lib/growthbook/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getFeatureFlags, toggleFeatureFlag } from '@/lib/growthbook/server'

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
  const queryClient = useQueryClient()

  const {
    data: featuresData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['growthbook-features'],
    queryFn: () => getFeatureFlags(),
  })

  const toggleMutation = useMutation({
    mutationFn: ({
      featureId,
      enabled,
    }: {
      featureId: FeatureFlagKey
      enabled: boolean
    }) => toggleFeatureFlag({ data: { featureId, enabled } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growthbook-features'] })
    },
  })

  const getFeatureValue = (key: FeatureFlagKey): boolean => {
    if (!featuresData) return false
    const feature: GrowthBookFeature | undefined = featuresData.features.find(
      (f) => f.id === key,
    )
    if (!feature) return false
    // Check production environment, fallback to defaultValue
    const prodEnv = feature.environments?.production
    return prodEnv?.enabled ?? feature.defaultValue ?? false
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl items-center justify-center p-6">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription className="text-destructive">
              Failed to load feature flags. Please check your GrowthBook
              configuration.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Manage feature flags via GrowthBook. Changes are applied to the
            production environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureFlagConfigs.map((config) => {
            const isEnabled = getFeatureValue(config.key)
            const isPending =
              toggleMutation.isPending &&
              toggleMutation.variables.featureId === config.key

            return (
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
                <div className="flex items-center gap-2">
                  {isPending && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                  <Switch
                    id={config.key}
                    checked={isEnabled}
                    disabled={isPending}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({
                        featureId: config.key,
                        enabled: checked,
                      })
                    }
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
