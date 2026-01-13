import {
  extractStyles,
  getElementName,
  isElementVisible,
  shouldSkipElement,
} from './style-extractor'
import { createFigmaNode, getNodeType } from './figma-node-mapper'
import type { FigmaDocument, FigmaNode } from '@/lib/figma-schema'
import type { DomToFigmaOptions, TraversalContext } from './types'

const DEFAULT_OPTIONS: DomToFigmaOptions = {
  includeHidden: false,
  maxDepth: 50,
  ignoreSelectors: [],
}

/**
 * Traverse DOM and create Figma document
 */
export function traverseDOM(
  rootElement: Element,
  options: DomToFigmaOptions = {},
): FigmaDocument {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  const rootBounds = rootElement.getBoundingClientRect()

  const context: TraversalContext = {
    rootBounds,
    nodeCounter: 0,
  }

  const rootNode = traverseElement(rootElement, context, mergedOptions, 0)

  return {
    schemaVersion: '1.0.0',
    name: getDocumentName(rootElement),
    exportedAt: new Date().toISOString(),
    viewport: {
      width: Math.round(rootBounds.width),
      height: Math.round(rootBounds.height),
    },
    root: rootNode,
  }
}

/**
 * Recursively traverse an element and its children
 */
function traverseElement(
  element: Element,
  context: TraversalContext,
  options: DomToFigmaOptions,
  depth: number,
): FigmaNode {
  // Generate unique ID
  const id = `node_${context.nodeCounter++}`
  const name = getElementName(element)

  // Extract styles
  const styles = extractStyles(element, context.rootBounds)

  // Create the node
  const node = createFigmaNode(element, styles, id, name)

  // Process children for FRAME nodes
  if (node.type === 'FRAME' && depth < (options.maxDepth ?? 50)) {
    const children = processChildren(element, context, options, depth)
    if (children.length > 0) {
      node.children = children
    }
  }

  return node
}

/**
 * Process child elements
 */
function processChildren(
  parent: Element,
  context: TraversalContext,
  options: DomToFigmaOptions,
  depth: number,
): Array<FigmaNode> {
  const children: Array<FigmaNode> = []
  const childNodes = parent.childNodes

  for (const childNode of childNodes) {
    // Handle text nodes
    if (childNode.nodeType === Node.TEXT_NODE) {
      const text = childNode.textContent?.trim()
      if (text) {
        // Create a text node if parent isn't already a text element
        const parentType = getNodeType(parent)
        if (parentType !== 'TEXT') {
          const textNode = createTextNodeFromText(text, parent, context)
          if (textNode) {
            children.push(textNode)
          }
        }
      }
      continue
    }

    // Handle element nodes
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const childElement = childNode as Element

      // Skip if should be ignored
      if (shouldSkipElement(childElement)) continue

      // Check ignore selectors
      if (
        options.ignoreSelectors?.some((selector) =>
          childElement.matches(selector),
        )
      ) {
        continue
      }

      // Check visibility
      if (!options.includeHidden && !isElementVisible(childElement)) continue

      // Traverse child
      const childFigmaNode = traverseElement(
        childElement,
        context,
        options,
        depth + 1,
      )
      children.push(childFigmaNode)
    }
  }

  return children
}

/**
 * Create a text node from raw text content
 */
function createTextNodeFromText(
  text: string,
  parent: Element,
  context: TraversalContext,
): FigmaNode | null {
  if (!text) return null

  const id = `node_${context.nodeCounter++}`
  const styles = extractStyles(parent, context.rootBounds)

  return {
    type: 'TEXT',
    id,
    name: text.substring(0, 20) + (text.length > 20 ? '...' : ''),
    x: Math.round(styles.x),
    y: Math.round(styles.y),
    width: Math.round(styles.width),
    height: Math.round(styles.height),
    characters: text,
    style: {
      fontFamily: styles.fontFamily,
      fontWeight: styles.fontWeight,
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight ?? 'AUTO',
      letterSpacing: styles.letterSpacing,
      textAlignHorizontal:
        styles.textAlign === 'center'
          ? 'CENTER'
          : styles.textAlign === 'right'
            ? 'RIGHT'
            : 'LEFT',
    },
    fills: styles.color
      ? [
          {
            type: 'SOLID',
            color: (() => {
              const { parseCssColor } = require('@/lib/color-utils')
              return parseCssColor(styles.color) || { r: 0, g: 0, b: 0, a: 1 }
            })(),
          },
        ]
      : undefined,
  }
}

/**
 * Get document name from root element
 */
function getDocumentName(element: Element): string {
  // Check for data-figma-name on root
  const figmaName = element.getAttribute('data-figma-name')
  if (figmaName) return figmaName

  // Use page title if available (only runs in browser context)
  const pageTitle = typeof window !== 'undefined' ? document.title : ''
  if (pageTitle) {
    return pageTitle
  }

  // Use element name
  return getElementName(element)
}

/**
 * Export selected element to Figma JSON
 */
export function exportToFigmaJSON(
  element: Element,
  options?: DomToFigmaOptions,
): string {
  const document = traverseDOM(element, options)
  return JSON.stringify(document, null, 2)
}

/**
 * Copy Figma JSON to clipboard
 */
export async function copyToClipboard(json: string): Promise<void> {
  await navigator.clipboard.writeText(json)
}
