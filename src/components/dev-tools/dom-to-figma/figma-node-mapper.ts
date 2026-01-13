import type {
  FigmaAlignItems,
  FigmaDropShadow,
  FigmaFill,
  FigmaJustifyContent,
  FigmaLayoutMode,
  FigmaNode,
  FigmaNodeType,
  FigmaStroke,
  FigmaTextAlignHorizontal,
  FigmaTextStyle,
} from '@/lib/figma-schema'
import type { ExtractedStyles } from './types'
import { isTransparent, parseBoxShadow, parseCssColor } from '@/lib/color-utils'

/**
 * Determine Figma node type from HTML element
 */
export function getNodeType(element: Element): FigmaNodeType {
  const tagName = element.tagName.toLowerCase()

  // Text elements
  const textTags = [
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'span',
    'a',
    'label',
  ]
  if (textTags.includes(tagName)) {
    return 'TEXT'
  }

  // SVG
  if (tagName === 'svg') {
    return 'VECTOR'
  }

  // Images become rectangles with image fill
  if (tagName === 'img') {
    return 'RECTANGLE'
  }

  // Everything else is a frame
  return 'FRAME'
}

/**
 * Map CSS flexbox/grid to Figma layout mode
 */
export function getLayoutMode(styles: ExtractedStyles): FigmaLayoutMode {
  const { display, flexDirection } = styles

  if (display === 'flex' || display === 'inline-flex') {
    if (flexDirection === 'column' || flexDirection === 'column-reverse') {
      return 'VERTICAL'
    }
    return 'HORIZONTAL'
  }

  if (display === 'grid' || display === 'inline-grid') {
    // Approximate grid as vertical layout
    return 'VERTICAL'
  }

  return 'NONE'
}

/**
 * Map CSS justify-content to Figma primary axis alignment
 */
export function getPrimaryAxisAlign(
  justifyContent: string,
): FigmaJustifyContent {
  switch (justifyContent) {
    case 'flex-start':
    case 'start':
      return 'MIN'
    case 'flex-end':
    case 'end':
      return 'MAX'
    case 'center':
      return 'CENTER'
    case 'space-between':
      return 'SPACE_BETWEEN'
    case 'space-around':
    case 'space-evenly':
      return 'SPACE_AROUND'
    default:
      return 'MIN'
  }
}

/**
 * Map CSS align-items to Figma counter axis alignment
 */
export function getCounterAxisAlign(alignItems: string): FigmaAlignItems {
  switch (alignItems) {
    case 'flex-start':
    case 'start':
      return 'MIN'
    case 'flex-end':
    case 'end':
      return 'MAX'
    case 'center':
      return 'CENTER'
    case 'baseline':
      return 'BASELINE'
    default:
      return 'MIN'
  }
}

/**
 * Map CSS text-align to Figma text alignment
 */
export function getTextAlignHorizontal(
  textAlign: string,
): FigmaTextAlignHorizontal {
  switch (textAlign) {
    case 'center':
      return 'CENTER'
    case 'right':
    case 'end':
      return 'RIGHT'
    case 'justify':
      return 'JUSTIFIED'
    default:
      return 'LEFT'
  }
}

/**
 * Create Figma fills from extracted styles
 */
export function createFills(
  styles: ExtractedStyles,
): Array<FigmaFill> | undefined {
  const fills: Array<FigmaFill> = []

  // Background color
  if (styles.backgroundColor) {
    const color = parseCssColor(styles.backgroundColor)
    if (color && !isTransparent(color)) {
      fills.push({
        type: 'SOLID',
        color,
        opacity: color.a,
      })
    }
  }

  // Background image
  if (styles.backgroundImage) {
    fills.push({
      type: 'IMAGE',
      imageUrl: styles.backgroundImage,
      scaleMode: 'FILL',
    })
  }

  return fills.length > 0 ? fills : undefined
}

/**
 * Create Figma strokes from extracted styles
 */
export function createStrokes(
  styles: ExtractedStyles,
): Array<FigmaStroke> | undefined {
  if (styles.borderWidth > 0 && styles.borderColor) {
    const color = parseCssColor(styles.borderColor)
    if (color && !isTransparent(color)) {
      return [
        {
          type: 'SOLID',
          color,
          opacity: color.a,
        },
      ]
    }
  }
  return undefined
}

/**
 * Create Figma effects from box-shadow
 */
export function createEffects(
  styles: ExtractedStyles,
): Array<FigmaDropShadow> | undefined {
  if (!styles.boxShadow) return undefined

  const shadows = parseBoxShadow(styles.boxShadow)
  if (shadows.length === 0) return undefined

  return shadows.map((shadow) => ({
    type: 'DROP_SHADOW' as const,
    color: shadow.color,
    offset: shadow.offset,
    radius: shadow.radius,
    visible: true,
  }))
}

/**
 * Create Figma text style from extracted styles
 */
export function createTextStyle(styles: ExtractedStyles): FigmaTextStyle {
  return {
    fontFamily: styles.fontFamily,
    fontWeight: styles.fontWeight,
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight ?? 'AUTO',
    letterSpacing: styles.letterSpacing,
    textAlignHorizontal: getTextAlignHorizontal(styles.textAlign),
    textDecoration:
      styles.textDecoration === 'underline'
        ? 'UNDERLINE'
        : styles.textDecoration === 'line-through'
          ? 'STRIKETHROUGH'
          : 'NONE',
  }
}

/**
 * Create a complete Figma node from DOM element and styles
 */
export function createFigmaNode(
  element: Element,
  styles: ExtractedStyles,
  id: string,
  name: string,
): FigmaNode {
  const nodeType = getNodeType(element)
  const tagName = element.tagName.toLowerCase()

  const node: FigmaNode = {
    type: nodeType,
    id,
    name,
    x: Math.round(styles.x),
    y: Math.round(styles.y),
    width: Math.round(styles.width),
    height: Math.round(styles.height),
    opacity: styles.opacity < 1 ? styles.opacity : undefined,
    fills: createFills(styles),
    strokes: createStrokes(styles),
    strokeWeight: styles.borderWidth > 0 ? styles.borderWidth : undefined,
    strokeAlign: styles.borderWidth > 0 ? 'INSIDE' : undefined,
    effects: createEffects(styles),
  }

  // Corner radius
  if (
    styles.borderTopLeftRadius > 0 ||
    styles.borderTopRightRadius > 0 ||
    styles.borderBottomRightRadius > 0 ||
    styles.borderBottomLeftRadius > 0
  ) {
    if (
      styles.borderTopLeftRadius === styles.borderTopRightRadius &&
      styles.borderTopRightRadius === styles.borderBottomRightRadius &&
      styles.borderBottomRightRadius === styles.borderBottomLeftRadius
    ) {
      node.cornerRadius = styles.borderTopLeftRadius
    } else {
      node.topLeftRadius = styles.borderTopLeftRadius
      node.topRightRadius = styles.borderTopRightRadius
      node.bottomRightRadius = styles.borderBottomRightRadius
      node.bottomLeftRadius = styles.borderBottomLeftRadius
    }
  }

  // Layout properties (FRAME only)
  if (nodeType === 'FRAME') {
    const layoutMode = getLayoutMode(styles)
    if (layoutMode !== 'NONE') {
      node.layoutMode = layoutMode
      node.primaryAxisAlignItems = getPrimaryAxisAlign(styles.justifyContent)
      node.counterAxisAlignItems = getCounterAxisAlign(styles.alignItems)
      node.itemSpacing = styles.gap > 0 ? styles.gap : undefined
    }

    // Padding
    if (
      styles.paddingTop > 0 ||
      styles.paddingRight > 0 ||
      styles.paddingBottom > 0 ||
      styles.paddingLeft > 0
    ) {
      node.paddingTop = styles.paddingTop
      node.paddingRight = styles.paddingRight
      node.paddingBottom = styles.paddingBottom
      node.paddingLeft = styles.paddingLeft
    }

    // Clip content
    if (styles.overflow === 'hidden' || styles.overflow === 'scroll') {
      node.clipsContent = true
    }
  }

  // TEXT specific
  if (nodeType === 'TEXT') {
    node.characters = element.textContent ? element.textContent.trim() : ''
    node.style = createTextStyle(styles)

    // Text color as fill
    if (styles.color) {
      const textColor = parseCssColor(styles.color)
      if (textColor && !isTransparent(textColor)) {
        node.fills = [
          {
            type: 'SOLID',
            color: textColor,
            opacity: textColor.a,
          },
        ]
      }
    }
  }

  // IMAGE specific (img tag)
  if (tagName === 'img') {
    const src = (element as HTMLImageElement).src
    if (src) {
      node.fills = [
        {
          type: 'IMAGE',
          imageUrl: src,
          scaleMode: 'FILL',
        },
      ]
    }
  }

  // SVG specific
  if (tagName === 'svg') {
    node.svgContent = element.outerHTML
  }

  return node
}
