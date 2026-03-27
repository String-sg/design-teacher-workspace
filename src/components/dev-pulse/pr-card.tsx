import { formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  ExternalLink,
  FileCode,
  GitPullRequestArrow,
  MessageSquare,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { PRAnalysis, PRData } from '@/lib/dev-pulse/types'

import { ImpactBadge, PRStatusBadge, QualityBadge } from './quality-badge'

interface PRCardProps {
  pr: PRData
  analysis: PRAnalysis | null
  className?: string
}

function buildPreviewUrl(pr: PRData): string {
  return `https://github.com/rezailmi/moe-teacher-workspace-v0/pull/${pr.number}`
}

export function PRCard({ pr, analysis, className }: PRCardProps) {
  const timeAgo = formatDistanceToNow(new Date(pr.createdAt), {
    addSuffix: true,
  })

  return (
    <Card size="sm" className={cn('transition-colors hover:bg-muted/30', className)}>
      <CardContent className="space-y-3">
        {/* Header row: author + status + time */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {pr.authorAvatar ? (
              <img
                src={pr.authorAvatar}
                alt={pr.author}
                className="size-6 rounded-full"
              />
            ) : (
              <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium uppercase text-muted-foreground">
                {pr.author.slice(0, 2)}
              </div>
            )}
            <span className="text-sm font-medium truncate">{pr.author}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PRStatusBadge state={pr.state} isDraft={pr.isDraft} />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* Title + PR number */}
        <div>
          <a
            href={buildPreviewUrl(pr)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-start gap-1.5"
          >
            <GitPullRequestArrow className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium leading-snug group-hover:underline">
              {pr.title}
              <span className="ml-1.5 text-muted-foreground font-normal">
                #{pr.number}
              </span>
            </span>
          </a>
        </div>

        {/* AI Summary */}
        {analysis && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.summary}
          </p>
        )}

        {/* Scores + metrics row */}
        <div className="flex flex-wrap items-center gap-2">
          {analysis && (
            <>
              <QualityBadge score={analysis.qualityScore} label="Code" />
              {analysis.designScore >= 0 && (
                <QualityBadge score={analysis.designScore} label="Design" />
              )}
              <ImpactBadge impact={analysis.businessImpact} />
            </>
          )}

          {/* File stats */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileCode className="size-3.5" />
            <span>{pr.changedFiles} files</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-green-600">+{pr.additions}</span>
            <span className="text-red-500">-{pr.deletions}</span>
          </div>

          {(pr.comments > 0 || pr.reviewComments > 0) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="size-3.5" />
              <span>{pr.comments + pr.reviewComments}</span>
            </div>
          )}
        </div>

        {/* Risk flags */}
        {analysis && analysis.riskFlags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-yellow-600" />
            {analysis.riskFlags.map((flag) => (
              <Badge
                key={flag}
                variant="outline"
                className="border-yellow-200 bg-yellow-50/50 text-yellow-700 text-[11px] dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400"
              >
                {flag}
              </Badge>
            ))}
          </div>
        )}

        {/* Visual change description */}
        {analysis &&
          analysis.visualChangeDescription !== 'No visual changes' && (
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Visual: </span>
                {analysis.visualChangeDescription}
              </p>
            </div>
          )}

        {/* Preview link */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={buildPreviewUrl(pr)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ExternalLink className="size-3" />
            View on GitHub
          </a>
          {pr.headBranch && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {pr.headBranch}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
