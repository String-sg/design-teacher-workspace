import { generateText, Output } from 'ai'
import { z } from 'zod'

import type { PRAnalysis, PRData } from './types'

const prAnalysisSchema = z.object({
  summary: z
    .string()
    .describe('One-line summary of what this PR does, written for a non-technical project lead'),
  qualityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Code quality score: 0-100 based on complexity, test coverage indicators, review status, and file organization'),
  designScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Design/UX quality score: 0-100 based on visual consistency, accessibility, hierarchy, and adherence to design system patterns'),
  businessImpact: z
    .enum(['high', 'medium', 'low'])
    .describe('Product/business impact: high = new user-facing feature or critical fix, medium = enhancement or refactor, low = chore or minor tweak'),
  riskLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('Risk level: high = large diff with no tests or touches auth/data, medium = moderate changes, low = small safe change'),
  categories: z
    .array(z.string())
    .describe('Categories like: feature, fix, refactor, ui, docs, chore, accessibility, performance'),
  riskFlags: z
    .array(z.string())
    .describe('Specific risk flags like: large-diff, no-tests, touches-auth, breaking-change, missing-review'),
  visualChangeDescription: z
    .string()
    .describe('Description of what changed visually in the UI, if anything. If no visual changes, say "No visual changes"'),
  keyHighlights: z
    .array(z.string())
    .max(3)
    .describe('Top 3 bullet points highlighting the most important aspects of this PR'),
})

function buildAnalysisPrompt(pr: PRData): string {
  const filesSummary = pr.files
    .slice(0, 30)
    .map((f) => `  ${f.status} ${f.filename} (+${f.additions}/-${f.deletions})`)
    .join('\n')

  return `You are analyzing a Pull Request for a Teacher Workspace application (an education SaaS product built with React, TanStack Start, Shadcn UI, and Tailwind CSS).

Analyze this PR from THREE perspectives:

1. **Code Quality** — Is the code well-structured? Are files organized logically? Is it a reasonable diff size? Any signs of missing tests or reviews?

2. **Design/UX Quality** (borrowing from a designer's eye review) — Based on the files changed, does this PR:
   - Touch UI components consistently with the design system?
   - Follow accessibility patterns (ARIA, semantic HTML)?
   - Maintain visual hierarchy and spacing consistency?
   - Avoid design anti-patterns (inconsistent radii, scattered colors, missing states)?

3. **Business/Product Impact** (borrowing from a CEO/founder lens) — Does this PR:
   - Add clear user value?
   - Move the product forward in a meaningful way?
   - Address a real user need vs. just technical housekeeping?

## PR Details

Title: ${pr.title}
Author: ${pr.author}
Status: ${pr.state}${pr.isDraft ? ' (draft)' : ''}
Branch: ${pr.headBranch} → ${pr.baseBranch}
Stats: +${pr.additions}/-${pr.deletions} across ${pr.changedFiles} files
Labels: ${pr.labels.join(', ') || 'none'}
Reviewers: ${pr.reviewers.join(', ') || 'none assigned'}

## Description
${pr.body?.slice(0, 2000) || 'No description provided'}

## Files Changed
${filesSummary}
${pr.files.length > 30 ? `  ... and ${pr.files.length - 30} more files` : ''}`
}

export async function analyzePR(pr: PRData): Promise<PRAnalysis> {
  try {
    const { object } = await generateText({
      model: 'anthropic/claude-sonnet-4.5',
      output: Output.object({ schema: prAnalysisSchema }),
      prompt: buildAnalysisPrompt(pr),
    })

    return object
  } catch (error) {
    console.error(`AI analysis failed for PR #${pr.number}:`, error)
    return createFallbackAnalysis(pr)
  }
}

export async function analyzeMultiplePRs(
  prs: PRData[],
): Promise<Map<number, PRAnalysis>> {
  const results = new Map<number, PRAnalysis>()
  // Analyze in batches of 3 to avoid rate limits
  for (let i = 0; i < prs.length; i += 3) {
    const batch = prs.slice(i, i + 3)
    const analyses = await Promise.all(batch.map(analyzePR))
    batch.forEach((pr, idx) => {
      results.set(pr.number, analyses[idx])
    })
  }
  return results
}

function createFallbackAnalysis(pr: PRData): PRAnalysis {
  const isLarge = pr.additions + pr.deletions > 500
  const hasUI = pr.files.some(
    (f) => f.filename.includes('components/') || f.filename.endsWith('.tsx'),
  )

  return {
    summary: pr.title,
    qualityScore: 50,
    designScore: hasUI ? 50 : -1,
    businessImpact: 'medium',
    riskLevel: isLarge ? 'medium' : 'low',
    categories: hasUI ? ['ui'] : ['chore'],
    riskFlags: [
      ...(isLarge ? ['large-diff'] : []),
      ...(pr.reviewers.length === 0 ? ['missing-review'] : []),
    ],
    visualChangeDescription: hasUI
      ? 'UI files were changed — analysis unavailable without AI'
      : 'No visual changes detected',
    keyHighlights: [pr.title],
  }
}
