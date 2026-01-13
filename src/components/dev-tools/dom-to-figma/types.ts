import type { FigmaNode } from '@/lib/figma-schema'

export interface ExtractedStyles {
  // Position and size
  x: number
  y: number
  width: number
  height: number
  // Background
  backgroundColor: string | null
  backgroundImage: string | null
  // Border
  borderColor: string | null
  borderWidth: number
  borderRadius: number
  borderTopLeftRadius: number
  borderTopRightRadius: number
  borderBottomRightRadius: number
  borderBottomLeftRadius: number
  // Text
  color: string | null
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number | null
  letterSpacing: number
  textAlign: string
  textDecoration: string
  // Layout
  display: string
  flexDirection: string
  justifyContent: string
  alignItems: string
  gap: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  // Effects
  boxShadow: string | null
  opacity: number
  overflow: string
}

export interface TraversalContext {
  rootBounds: DOMRect
  nodeCounter: number
}

export interface DomToFigmaOptions {
  includeHidden?: boolean
  maxDepth?: number
  ignoreSelectors?: Array<string>
}

export type { FigmaNode }
