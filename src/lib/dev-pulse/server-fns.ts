import { createServerFn } from '@tanstack/react-start'

import type { DashboardData, PRAnalysis, PRData } from './types'
import { DEFAULT_REPO } from './types'

export const fetchDashboardData = createServerFn({ method: 'GET' })
  .inputValidator(
    (input: { state?: 'open' | 'closed' | 'all'; days?: number }) => input,
  )
  .handler(async ({ data }): Promise<DashboardData> => {
    const hasToken = !!process.env.GITHUB_TOKEN

    if (!hasToken) {
      const { getMockDashboardData } = await import('./mock-data')
      return getMockDashboardData()
    }

    const { listPullRequests } = await import('./github-client')
    const days = data?.days ?? 30
    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    ).toISOString()

    const prs = await listPullRequests(DEFAULT_REPO, {
      state: data?.state ?? 'all',
      perPage: 50,
      since,
    })

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const mergedThisWeek = prs.filter(
      (pr) => pr.state === 'merged' && pr.mergedAt && new Date(pr.mergedAt) >= weekAgo,
    )
    const openPRs = prs.filter(
      (pr) => pr.state === 'open',
    )

    return {
      prs,
      stats: {
        openPRs: openPRs.length,
        mergedThisWeek: mergedThisWeek.length,
        avgQualityScore: 0, // populated after AI analysis
        totalLinesChanged: prs.reduce(
          (sum, pr) => sum + pr.additions + pr.deletions,
          0,
        ),
      },
    }
  })

export const fetchPRAnalysis = createServerFn({ method: 'GET' })
  .inputValidator((input: { prNumber: number }) => input)
  .handler(async ({ data }): Promise<PRAnalysis | null> => {
    const hasToken = !!process.env.GITHUB_TOKEN

    if (!hasToken) {
      const { MOCK_ANALYSES } = await import('./mock-data')
      return MOCK_ANALYSES.get(data.prNumber) ?? null
    }

    const { getPullRequest } = await import('./github-client')
    const pr = await getPullRequest(DEFAULT_REPO, data.prNumber)
    if (!pr) return null

    const { analyzePR } = await import('./ai-analyzer')
    return analyzePR(pr)
  })

export const fetchAllAnalyses = createServerFn({ method: 'GET' })
  .inputValidator((input: { prs: PRData[] }) => input)
  .handler(async ({ data }): Promise<Record<number, PRAnalysis>> => {
    const hasToken = !!process.env.GITHUB_TOKEN

    if (!hasToken) {
      const { MOCK_ANALYSES } = await import('./mock-data')
      const result: Record<number, PRAnalysis> = {}
      for (const pr of data.prs) {
        const analysis = MOCK_ANALYSES.get(pr.number)
        if (analysis) result[pr.number] = analysis
      }
      return result
    }

    const { analyzeMultiplePRs } = await import('./ai-analyzer')
    const analysisMap = await analyzeMultiplePRs(data.prs)
    const result: Record<number, PRAnalysis> = {}
    for (const [key, value] of analysisMap) {
      result[key] = value
    }
    return result
  })
