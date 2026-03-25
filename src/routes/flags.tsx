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
    key: 'allears',
    label: 'AllEars',
    description:
      'Enable AllEars standalone form builder (legacy). When disabled, forms use the native TW builder.',
  },
  {
    key: 'announcements',
    label: 'Announcements',
    description:
      'Show or hide the Announcements page in the sidebar navigation',
  },
  {
    key: 'forms',
    label: 'Forms',
    description: 'Show or hide the Forms page in the sidebar navigation',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Enable notification features',
  },
  {
    key: 'holistic-reports',
    label: 'Holistic Reports',
    description:
      'Enable holistic development reports showing student progress across academic and character development',
  },
  {
    key: 'student-analytics',
    label: 'Student Analytics (Research)',
    description:
      'Show Student Analytics and Insight Buddy in the sidebar — attendance cohort analytics, academic analytics, export CSV, and AI-powered student insights',
  },
  {
    key: 'lta-intervention',
    label: 'Contextual Intelligent',
    description:
      'Show the LTA (long-term absenteeism) tag in the student list and the intervention banner and guidance dialog on the student profile',
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
                <p className="text-sm text-muted-foreground">
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
