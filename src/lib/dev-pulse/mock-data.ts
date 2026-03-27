import type {
  DashboardData,
  PRAnalysis,
  PRData,
  PRFileChange,
} from './types'

const mockFiles: PRFileChange[] = [
  {
    filename: 'src/components/reports/report-table.tsx',
    status: 'modified',
    additions: 45,
    deletions: 12,
    changes: 57,
  },
  {
    filename: 'src/components/reports/report-detail.tsx',
    status: 'modified',
    additions: 120,
    deletions: 30,
    changes: 150,
  },
  {
    filename: 'src/components/ui/badge.tsx',
    status: 'modified',
    additions: 8,
    deletions: 3,
    changes: 11,
  },
  {
    filename: 'src/routes/reports.index.tsx',
    status: 'modified',
    additions: 22,
    deletions: 8,
    changes: 30,
  },
]

export const MOCK_PRS: PRData[] = [
  {
    number: 81,
    title: 'refactor: consolidate Posts and Forms into unified tabbed UI',
    author: 'designerA',
    authorAvatar: '',
    state: 'merged',
    isDraft: false,
    createdAt: '2025-03-20T10:00:00Z',
    mergedAt: '2025-03-21T14:30:00Z',
    closedAt: '2025-03-21T14:30:00Z',
    additions: 340,
    deletions: 180,
    changedFiles: 12,
    labels: ['refactor', 'ui'],
    reviewers: ['wondojeong'],
    body: 'Merged the separate Posts and Forms pages into a single tabbed interface for better navigation and consistency.',
    headBranch: 'feat/unified-posts-forms',
    baseBranch: 'main',
    comments: 3,
    reviewComments: 5,
    files: [
      ...mockFiles,
      {
        filename: 'src/components/comms/entity-selector.tsx',
        status: 'modified',
        additions: 65,
        deletions: 20,
        changes: 85,
      },
    ],
  },
  {
    number: 80,
    title: 'fix: reduce tooltip border radius',
    author: 'designerB',
    authorAvatar: '',
    state: 'merged',
    isDraft: false,
    createdAt: '2025-03-19T08:00:00Z',
    mergedAt: '2025-03-19T11:00:00Z',
    closedAt: '2025-03-19T11:00:00Z',
    additions: 4,
    deletions: 4,
    changedFiles: 1,
    labels: ['fix', 'design-system'],
    reviewers: [],
    body: 'Tooltip corners were too rounded compared to the rest of the UI. Aligned with the design system border radius token.',
    headBranch: 'fix/tooltip-radius',
    baseBranch: 'main',
    comments: 0,
    reviewComments: 0,
    files: [
      {
        filename: 'src/components/ui/tooltip.tsx',
        status: 'modified',
        additions: 4,
        deletions: 4,
        changes: 8,
      },
    ],
  },
  {
    number: 79,
    title: 'refactor: homepage grid, responsive sidebar, Glow page polish',
    author: 'designerA',
    authorAvatar: '',
    state: 'merged',
    isDraft: false,
    createdAt: '2025-03-18T09:00:00Z',
    mergedAt: '2025-03-19T16:00:00Z',
    closedAt: '2025-03-19T16:00:00Z',
    additions: 520,
    deletions: 210,
    changedFiles: 18,
    labels: ['refactor', 'ui', 'responsive'],
    reviewers: ['wondojeong'],
    body: 'Major layout overhaul: responsive grid on homepage, collapsible sidebar on mobile, and visual polish pass on the Glow (daily progress) page.',
    headBranch: 'refactor/homepage-sidebar-glow',
    baseBranch: 'main',
    comments: 8,
    reviewComments: 12,
    files: [
      ...mockFiles,
      {
        filename: 'src/components/app-sidebar.tsx',
        status: 'modified',
        additions: 90,
        deletions: 40,
        changes: 130,
      },
      {
        filename: 'src/routes/index.tsx',
        status: 'modified',
        additions: 75,
        deletions: 35,
        changes: 110,
      },
    ],
  },
  {
    number: 78,
    title: 'feat: add student intervention banner with LTA guidance',
    author: 'designerC',
    authorAvatar: '',
    state: 'merged',
    isDraft: false,
    createdAt: '2025-03-17T12:00:00Z',
    mergedAt: '2025-03-18T10:00:00Z',
    closedAt: '2025-03-18T10:00:00Z',
    additions: 280,
    deletions: 15,
    changedFiles: 6,
    labels: ['feature', 'student-insights'],
    reviewers: ['wondojeong', 'designerA'],
    body: 'Adds a contextual intervention banner on the student profile that shows LTA risk status with actionable guidance for teachers.',
    headBranch: 'feat/intervention-banner',
    baseBranch: 'main',
    comments: 5,
    reviewComments: 8,
    files: [
      {
        filename: 'src/components/students/intervention-banner.tsx',
        status: 'added',
        additions: 180,
        deletions: 0,
        changes: 180,
      },
      {
        filename: 'src/components/students/student-profile.tsx',
        status: 'modified',
        additions: 45,
        deletions: 10,
        changes: 55,
      },
      {
        filename: 'src/data/intervention-config.ts',
        status: 'added',
        additions: 55,
        deletions: 5,
        changes: 60,
      },
    ],
  },
  {
    number: 77,
    title: 'feat: holistic development report preview and email flow',
    author: 'designerB',
    authorAvatar: '',
    state: 'open',
    isDraft: false,
    createdAt: '2025-03-22T14:00:00Z',
    mergedAt: null,
    closedAt: null,
    additions: 890,
    deletions: 45,
    changedFiles: 22,
    labels: ['feature', 'reports'],
    reviewers: [],
    body: 'Full implementation of the holistic development report preview, including PDF generation, email template, and parent portal view. This is a large PR that introduces the complete report workflow.',
    headBranch: 'feat/hdp-preview-email',
    baseBranch: 'main',
    comments: 2,
    reviewComments: 0,
    files: [
      {
        filename: 'src/components/reports/email-preview-dialog.tsx',
        status: 'added',
        additions: 200,
        deletions: 0,
        changes: 200,
      },
      {
        filename: 'src/components/reports/parent-preview-dialog.tsx',
        status: 'added',
        additions: 180,
        deletions: 0,
        changes: 180,
      },
      {
        filename: 'src/components/reports/generate-hdp-wizard.tsx',
        status: 'added',
        additions: 250,
        deletions: 0,
        changes: 250,
      },
      ...mockFiles,
    ],
  },
  {
    number: 76,
    title: 'feat: add release stage badges to feature flags page',
    author: 'wondojeong',
    authorAvatar: '',
    state: 'open',
    isDraft: true,
    createdAt: '2025-03-23T09:00:00Z',
    mergedAt: null,
    closedAt: null,
    additions: 65,
    deletions: 12,
    changedFiles: 4,
    labels: ['feature', 'dx'],
    reviewers: [],
    body: 'Syncs the release stage badges between the sidebar navigation and the feature flags settings page.',
    headBranch: 'feat/release-stage-badges',
    baseBranch: 'main',
    comments: 0,
    reviewComments: 0,
    files: [
      {
        filename: 'src/components/app-sidebar.tsx',
        status: 'modified',
        additions: 30,
        deletions: 5,
        changes: 35,
      },
      {
        filename: 'src/routes/flags.tsx',
        status: 'modified',
        additions: 35,
        deletions: 7,
        changes: 42,
      },
    ],
  },
]

export const MOCK_ANALYSES: Map<number, PRAnalysis> = new Map([
  [
    81,
    {
      summary:
        'Merged separate Posts and Forms pages into a single tabbed UI for streamlined parent communication management.',
      qualityScore: 82,
      designScore: 88,
      businessImpact: 'high',
      riskLevel: 'medium',
      categories: ['refactor', 'ui'],
      riskFlags: [],
      visualChangeDescription:
        'Navigation simplified from two sidebar items to one. Posts and Forms are now tabs within a unified page, reducing cognitive load.',
      keyHighlights: [
        'Unified tabbed interface reduces navigation complexity',
        'Shared components reused across both tabs',
        'Good use of existing design system patterns',
      ],
    },
  ],
  [
    80,
    {
      summary:
        'Fixed tooltip border radius to align with the design system token.',
      qualityScore: 90,
      designScore: 95,
      businessImpact: 'low',
      riskLevel: 'low',
      categories: ['fix', 'design-system'],
      riskFlags: [],
      visualChangeDescription:
        'Tooltip corners are now consistent with other popover-style elements in the design system.',
      keyHighlights: [
        'Small but precise design consistency fix',
        'Aligns tooltip radius with design tokens',
      ],
    },
  ],
  [
    79,
    {
      summary:
        'Major layout overhaul: responsive homepage grid, collapsible mobile sidebar, and Glow page visual polish.',
      qualityScore: 75,
      designScore: 85,
      businessImpact: 'high',
      riskLevel: 'medium',
      categories: ['refactor', 'ui', 'responsive'],
      riskFlags: ['large-diff'],
      visualChangeDescription:
        'Homepage now uses a responsive grid that adapts from 1 to 3 columns. Sidebar collapses properly on mobile. Glow page has refreshed typography and spacing.',
      keyHighlights: [
        'Responsive layout now works across all breakpoints',
        'Large diff (730 lines) — review carefully',
        'Glow page polish improves daily progress readability',
      ],
    },
  ],
  [
    78,
    {
      summary:
        'New contextual intervention banner on student profiles showing LTA risk with actionable teacher guidance.',
      qualityScore: 88,
      designScore: 82,
      businessImpact: 'high',
      riskLevel: 'low',
      categories: ['feature', 'student-insights'],
      riskFlags: [],
      visualChangeDescription:
        'A colored banner appears at the top of at-risk student profiles with clear guidance text and action buttons.',
      keyHighlights: [
        'Directly addresses teacher need for early intervention signals',
        'Well-structured new component with proper props',
        'Uses existing design system tokens for status colors',
      ],
    },
  ],
  [
    77,
    {
      summary:
        'Full holistic development report workflow: preview, PDF generation, email template, and parent portal view.',
      qualityScore: 62,
      designScore: 70,
      businessImpact: 'high',
      riskLevel: 'high',
      categories: ['feature', 'reports'],
      riskFlags: ['large-diff', 'missing-review', 'no-tests'],
      visualChangeDescription:
        'New multi-step wizard for generating reports, email preview dialog, and a parent-facing read-only view. Three major new dialogs introduced.',
      keyHighlights: [
        'Very large PR (890 additions) — should be split for review',
        'No reviewers assigned — needs review before merge',
        'Core feature for the reports module — high business value',
      ],
    },
  ],
  [
    76,
    {
      summary:
        'Syncs release stage badges between sidebar navigation and feature flags settings page.',
      qualityScore: 85,
      designScore: 90,
      businessImpact: 'low',
      riskLevel: 'low',
      categories: ['feature', 'dx'],
      riskFlags: [],
      visualChangeDescription:
        'Badge labels (Experiment, Release 2, etc.) now appear consistently in both the sidebar and the feature flags page.',
      keyHighlights: [
        'Small, focused DX improvement',
        'Consistent visual language across sidebar and settings',
      ],
    },
  ],
])

export function getMockDashboardData(): DashboardData {
  const merged = MOCK_PRS.filter((pr) => pr.state === 'merged')
  const open = MOCK_PRS.filter(
    (pr) => pr.state === 'open' || pr.isDraft,
  )
  const analyses = Array.from(MOCK_ANALYSES.values())
  const avgQuality =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.qualityScore, 0) /
            analyses.length,
        )
      : 0

  return {
    prs: MOCK_PRS,
    stats: {
      openPRs: open.length,
      mergedThisWeek: merged.length,
      avgQualityScore: avgQuality,
      totalLinesChanged: MOCK_PRS.reduce(
        (sum, pr) => sum + pr.additions + pr.deletions,
        0,
      ),
    },
  }
}
