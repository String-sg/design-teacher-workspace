import { Octokit } from 'octokit'

import type { PRData, PRFileChange, RepoConfig } from './types'
import { DEFAULT_REPO } from './types'

function createOctokit() {
  const token = process.env.GITHUB_TOKEN
  if (!token) return null
  return new Octokit({ auth: token })
}

interface ListPROptions {
  state?: 'open' | 'closed' | 'all'
  perPage?: number
  since?: string
}

export async function listPullRequests(
  repo: RepoConfig = DEFAULT_REPO,
  options: ListPROptions = {},
): Promise<PRData[]> {
  const octokit = createOctokit()
  if (!octokit) return []

  const { state = 'all', perPage = 30, since } = options

  const { data: pulls } = await octokit.rest.pulls.list({
    owner: repo.owner,
    repo: repo.repo,
    state,
    per_page: perPage,
    sort: 'updated',
    direction: 'desc',
  })

  const prs: PRData[] = await Promise.all(
    pulls
      .filter((pr) => !since || new Date(pr.updated_at) >= new Date(since))
      .map(async (pr) => {
        const files = await fetchPRFiles(octokit, repo, pr.number)
        return mapPullRequest(pr, files)
      }),
  )

  return prs
}

export async function getPullRequest(
  repo: RepoConfig = DEFAULT_REPO,
  prNumber: number,
): Promise<PRData | null> {
  const octokit = createOctokit()
  if (!octokit) return null

  const { data: pr } = await octokit.rest.pulls.get({
    owner: repo.owner,
    repo: repo.repo,
    pull_number: prNumber,
  })

  const files = await fetchPRFiles(octokit, repo, prNumber)
  return mapPullRequest(pr, files)
}

async function fetchPRFiles(
  octokit: Octokit,
  repo: RepoConfig,
  prNumber: number,
): Promise<PRFileChange[]> {
  try {
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: repo.owner,
      repo: repo.repo,
      pull_number: prNumber,
      per_page: 100,
    })
    return files.map((f) => ({
      filename: f.filename,
      status: f.status as PRFileChange['status'],
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
    }))
  } catch {
    return []
  }
}

function mapPullRequest(pr: any, files: PRFileChange[]): PRData {
  return {
    number: pr.number,
    title: pr.title,
    author: pr.user?.login ?? 'unknown',
    authorAvatar: pr.user?.avatar_url ?? '',
    state: pr.merged_at ? 'merged' : (pr.state as 'open' | 'closed'),
    isDraft: pr.draft ?? false,
    createdAt: pr.created_at,
    mergedAt: pr.merged_at ?? null,
    closedAt: pr.closed_at ?? null,
    additions: pr.additions ?? 0,
    deletions: pr.deletions ?? 0,
    changedFiles: pr.changed_files ?? files.length,
    labels: pr.labels?.map((l: any) => l.name) ?? [],
    reviewers:
      pr.requested_reviewers?.map((r: any) => r.login).filter(Boolean) ?? [],
    body: pr.body ?? null,
    headBranch: pr.head?.ref ?? '',
    baseBranch: pr.base?.ref ?? '',
    comments: pr.comments ?? 0,
    reviewComments: pr.review_comments ?? 0,
    files,
  }
}
