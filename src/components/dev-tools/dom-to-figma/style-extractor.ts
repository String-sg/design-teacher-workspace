import type { ExtractedStyles } from './types'

/**
 * Extract computed styles from a DOM element
 */
export function extractStyles(
  element: Element,
  rootBounds: DOMRect,
): ExtractedStyles {
  const computed = getComputedStyle(element)
  const bounds = element.getBoundingClientRect()

  return {
    // Position relative to root
    x: bounds.left - rootBounds.left,
    y: bounds.top - rootBounds.top,
    width: bounds.width,
    height: bounds.height,

    // Background
    backgroundColor: normalizeColor(computed.backgroundColor),
    backgroundImage: extractBackgroundImage(computed.backgroundImage),

    // Border
    borderColor: normalizeColor(computed.borderTopColor),
    borderWidth: parseFloat(computed.borderTopWidth) || 0,
    borderRadius: parseFloat(computed.borderRadius) || 0,
    borderTopLeftRadius: parseFloat(computed.borderTopLeftRadius) || 0,
    borderTopRightRadius: parseFloat(computed.borderTopRightRadius) || 0,
    borderBottomRightRadius: parseFloat(computed.borderBottomRightRadius) || 0,
    borderBottomLeftRadius: parseFloat(computed.borderBottomLeftRadius) || 0,

    // Text
    color: normalizeColor(computed.color),
    fontFamily: extractFontFamily(computed.fontFamily),
    fontSize: parseFloat(computed.fontSize) || 16,
    fontWeight: parseFontWeight(computed.fontWeight),
    lineHeight: parseLineHeight(computed.lineHeight, computed.fontSize),
    letterSpacing: parseLetterSpacing(computed.letterSpacing),
    textAlign: computed.textAlign,
    textDecoration: computed.textDecorationLine,

    // Layout
    display: computed.display,
    flexDirection: computed.flexDirection,
    justifyContent: computed.justifyContent,
    alignItems: computed.alignItems,
    gap: parseFloat(computed.gap) || 0,
    paddingTop: parseFloat(computed.paddingTop) || 0,
    paddingRight: parseFloat(computed.paddingRight) || 0,
    paddingBottom: parseFloat(computed.paddingBottom) || 0,
    paddingLeft: parseFloat(computed.paddingLeft) || 0,

    // Effects
    boxShadow: computed.boxShadow !== 'none' ? computed.boxShadow : null,
    opacity: parseFloat(computed.opacity) || 1,
    overflow: computed.overflow,
  }
}

/**
 * Normalize color value - returns null for transparent
 */
function normalizeColor(color: string): string | null {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
    return null
  }
  return color
}

/**
 * Extract background image URL
 */
function extractBackgroundImage(bgImage: string): string | null {
  if (!bgImage || bgImage === 'none') return null

  const match = bgImage.match(/url\(['"]?([^'"()]+)['"]?\)/)
  return match ? match[1] : null
}

/**
 * Extract primary font family (first in the list)
 */
function extractFontFamily(fontFamily: string): string {
  // Remove quotes and get first font
  const fonts = fontFamily.split(',')
  return fonts[0]?.trim().replace(/^['"]|['"]$/g, '') || 'Inter'
}

/**
 * Parse font weight to numeric value
 */
function parseFontWeight(weight: string): number {
  const numWeight = parseInt(weight, 10)
  if (!isNaN(numWeight)) return numWeight

  const weights: Record<string, number> = {
    normal: 400,
    bold: 700,
    lighter: 300,
    bolder: 700,
  }
  return weights[weight] || 400
}

/**
 * Parse line height to absolute value
 */
function parseLineHeight(lineHeight: string, fontSize: string): number | null {
  if (lineHeight === 'normal') return null

  const lh = parseFloat(lineHeight)
  if (isNaN(lh)) return null

  // If unitless, multiply by font size
  if (!lineHeight.includes('px') && !lineHeight.includes('%')) {
    return lh * (parseFloat(fontSize) || 16)
  }

  return lh
}

/**
 * Parse letter spacing to pixels
 */
function parseLetterSpacing(letterSpacing: string): number {
  if (letterSpacing === 'normal') return 0
  return parseFloat(letterSpacing) || 0
}

/**
 * Check if element is visible
 */
export function isElementVisible(element: Element): boolean {
  const computed = getComputedStyle(element)

  // Check various visibility conditions
  if (computed.display === 'none') return false
  if (computed.visibility === 'hidden') return false
  if (computed.opacity === '0') return false

  // Check if element has dimensions
  const bounds = element.getBoundingClientRect()
  if (bounds.width === 0 && bounds.height === 0) return false

  return true
}

/**
 * Check if element should be skipped during traversal
 */
export function shouldSkipElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase()

  // Skip non-visual elements
  const skipTags = [
    'script',
    'style',
    'link',
    'meta',
    'head',
    'noscript',
    'template',
    'slot',
  ]
  if (skipTags.includes(tagName)) return true

  // Skip hidden inputs
  if (tagName === 'input' && (element as HTMLInputElement).type === 'hidden') {
    return true
  }

  // Skip elements with data-figma-ignore
  if (element.hasAttribute('data-figma-ignore')) return true

  return false
}

/**
 * Get the effective display name for an element
 */
export function getElementName(element: Element): string {
  // Check for data-figma-name attribute
  const figmaName = element.getAttribute('data-figma-name')
  if (figmaName) return figmaName

  // Check for id
  if (element.id) return `#${element.id}`

  // Check for meaningful classes
  const classes = Array.from(element.classList)
    .filter(
      (c) =>
        !c.startsWith('__') && !c.includes('css') && !c.match(/^[a-z]{6,}$/),
    )
    .slice(0, 2)

  if (classes.length > 0) {
    return `.${classes.join('.')}`
  }

  // Use tag name
  return element.tagName.toLowerCase()
}
