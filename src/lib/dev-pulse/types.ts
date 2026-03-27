export interface RepoConfig {
  owner: string
  repo: string
  displayName: string
}

export const DEFAULT_REPO: RepoConfig = {
  owner: 'rezailmi',
  repo: 'moe-teacher-workspace-v0',
  displayName: 'Teacher Workspace',
}

export interface PRFileChange {
  filename: string
  status: 'added' | 'removed' | 'modified' | 'renamed'
  additions: number
  deletions: number
  changes: number
}

export interface PRData {
  number: number
  title: string
  author: string
  authorAvatar: string
  state: 'open' | 'closed' | 'merged'
  isDraft: boolean
  createdAt: string
  mergedAt: string | null
  closedAt: string | null
  additions: number
  deletions: number
  changedFiles: number
  labels: string[]
  reviewers: string[]
  body: string | null
  headBranch: string
  baseBranch: string
  comments: number
  reviewComments: number
  files: PRFileChange[]
}

export interface PRAnalysis {
  summary: string
  qualityScore: number
  designScore: number
  businessImpact: 'high' | 'medium' | 'low'
  riskLevel: 'low' | 'medium' | 'high'
  categories: string[]
  riskFlags: string[]
  visualChangeDescription: string
  keyHighlights: string[]
}

export interface PRWithAnalysis {
  pr: PRData
  analysis: PRAnalysis | null
}

export interface DashboardStats {
  openPRs: number
  mergedThisWeek: number
  avgQualityScore: number
  totalLinesChanged: number
}

export interface DashboardData {
  prs: PRData[]
  stats: DashboardStats
}

export interface SkillInfo {
  name: string
  role: string
  description: string
}

export const SKILLS_USED: SkillInfo[] = [
  {
    name: 'AI SDK + AI Gateway',
    role: 'Analysis Engine',
    description:
      'Powers the structured PR analysis — generates summaries, quality scores, risk flags, and design assessments using Claude via the Vercel AI Gateway.',
  },
  {
    name: 'Design Review Rubric',
    role: 'UX Quality Lens',
    description:
      'Informs the design quality dimension of scoring — evaluates visual consistency with the design system, accessibility, and visual hierarchy.',
  },
  {
    name: 'CEO Review Rubric',
    role: 'Business Impact Lens',
    description:
      'Assesses product value and business impact of each PR — is this change additive to the product or just noise?',
  },
  {
    name: 'Retro Patterns',
    role: 'Contributor Analysis',
    description:
      'Drives the contributor breakdown, work pattern analysis, and velocity trends across the team.',
  },
  {
    name: 'GitHub API (Octokit)',
    role: 'Data Source',
    description:
      'Fetches live PR data including files changed, review status, comments, labels, and deployment status.',
  },
  {
    name: 'recharts',
    role: 'Data Visualization',
    description:
      'Renders the activity charts, file impact bars, quality distribution, and contributor breakdowns.',
  },
  {
    name: 'Frontend Design',
    role: 'Dashboard UI',
    description:
      'The dashboard itself — built with production-grade design patterns using the Flow Design System and Shadcn UI.',
  },
  {
    name: 'Vercel Previews',
    role: 'Visual Evidence',
    description:
      'Links to deployed preview URLs for each PR branch so you can see the actual UI changes live.',
  },
]
