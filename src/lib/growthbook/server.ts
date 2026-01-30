import { createServerFn } from '@tanstack/react-start'

import type { FeatureFlagKey } from './types'

const GROWTHBOOK_API_URL = 'https://api.growthbook.io/api/v1'

export interface GrowthBookFeature {
  id: string
  defaultValue?: boolean
  environments?: Record<
    string,
    { enabled?: boolean; defaultValue?: boolean } | undefined
  >
}

interface GrowthBookFeaturesResponse {
  features: Array<GrowthBookFeature>
}

export const getFeatureFlags = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apiSecret = process.env.GROWTHBOOK_API_SECRET

    if (!apiSecret) {
      console.warn('GROWTHBOOK_API_SECRET not configured')
      return { features: [] }
    }

    const response = await fetch(`${GROWTHBOOK_API_URL}/features`, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch features:', response.status)
      return { features: [] }
    }

    const data = (await response.json()) as GrowthBookFeaturesResponse
    return data
  },
)

export const toggleFeatureFlag = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { featureId: FeatureFlagKey; enabled: boolean }) => data,
  )
  .handler(async ({ data }) => {
    const apiSecret = process.env.GROWTHBOOK_API_SECRET

    if (!apiSecret) {
      throw new Error('GROWTHBOOK_API_SECRET not configured')
    }

    const { featureId, enabled } = data

    // Use the toggle endpoint to enable/disable in production environment
    const response = await fetch(
      `${GROWTHBOOK_API_URL}/features/${featureId}/toggle`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environments: {
            production: enabled,
          },
          reason: 'Toggled via admin UI',
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to toggle feature:', response.status, errorText)
      throw new Error(`Failed to toggle feature: ${response.status}`)
    }

    return { success: true }
  })
