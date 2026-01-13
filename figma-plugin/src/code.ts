/// <reference types="@figma/plugin-typings/index" />

// Figma plugin main code
// Handles messages from UI and creates nodes in Figma

interface FigmaColor {
  r: number
  g: number
  b: number
  a: number
}

interface FigmaFill {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'IMAGE'
  color?: FigmaColor
  opacity?: number
  imageUrl?: string
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE'
}

interface FigmaStroke {
  type: 'SOLID'
  color: FigmaColor
  opacity?: number
}

interface FigmaDropShadow {
  type: 'DROP_SHADOW'
  color: FigmaColor
  offset: { x: number; y: number }
  radius: number
  spread?: number
  visible: boolean
}

interface FigmaTextStyle {
  fontFamily: string
  fontWeight: number
  fontSize: number
  lineHeight?: number | 'AUTO'
  letterSpacing?: number
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM'
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'
}

interface FigmaNode {
  type: 'FRAME' | 'RECTANGLE' | 'TEXT' | 'VECTOR'
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  visible?: boolean
  opacity?: number
  fills?: Array<FigmaFill>
  strokes?: Array<FigmaStroke>
  strokeWeight?: number
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER'
  cornerRadius?: number
  topLeftRadius?: number
  topRightRadius?: number
  bottomRightRadius?: number
  bottomLeftRadius?: number
  effects?: Array<FigmaDropShadow>
  clipsContent?: boolean
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL'
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE'
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  itemSpacing?: number
  children?: Array<FigmaNode>
  characters?: string
  style?: FigmaTextStyle
  svgContent?: string
}

interface FigmaDocument {
  schemaVersion: '1.0.0'
  name: string
  exportedAt: string
  viewport: {
    width: number
    height: number
  }
  root: FigmaNode
}

// Show plugin UI
figma.showUI(__html__, { width: 400, height: 500 })

// Handle messages from UI
figma.ui.onmessage = async (msg: { type: string; data?: string }) => {
  if (msg.type === 'import') {
    try {
      if (!msg.data) {
        figma.ui.postMessage({
          type: 'error',
          message: 'No JSON data provided',
        })
        return
      }

      const document: FigmaDocument = JSON.parse(msg.data)

      figma.ui.postMessage({ type: 'status', message: 'Creating design...' })

      // Create the root frame
      const rootFrame = await createNode(document.root)

      if (rootFrame) {
        // Center in viewport
        figma.viewport.scrollAndZoomIntoView([rootFrame])
        figma.currentPage.selection = [rootFrame]

        figma.ui.postMessage({
          type: 'success',
          message: `Created "${document.name}" with ${countNodes(document.root)} layers`,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      figma.ui.postMessage({
        type: 'error',
        message: `Failed to import: ${message}`,
      })
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}

async function createNode(nodeData: FigmaNode): Promise<SceneNode | null> {
  let node: SceneNode | null = null

  switch (nodeData.type) {
    case 'FRAME':
      node = await createFrame(nodeData)
      break
    case 'RECTANGLE':
      node = await createRectangle(nodeData)
      break
    case 'TEXT':
      node = await createText(nodeData)
      break
    case 'VECTOR':
      node = await createVector(nodeData)
      break
  }

  if (!node) return null

  // Apply common properties
  node.name = nodeData.name

  if (nodeData.opacity !== undefined && 'opacity' in node) {
    node.opacity = nodeData.opacity
  }

  return node
}

async function createFrame(nodeData: FigmaNode): Promise<FrameNode> {
  const frame = figma.createFrame()

  frame.x = nodeData.x
  frame.y = nodeData.y
  frame.resize(Math.max(1, nodeData.width), Math.max(1, nodeData.height))

  // Apply fills
  if (nodeData.fills && nodeData.fills.length > 0) {
    frame.fills = convertFills(nodeData.fills)
  } else {
    frame.fills = []
  }

  // Apply strokes
  if (nodeData.strokes && nodeData.strokes.length > 0) {
    frame.strokes = convertStrokes(nodeData.strokes)
    if (nodeData.strokeWeight) {
      frame.strokeWeight = nodeData.strokeWeight
    }
    if (nodeData.strokeAlign) {
      frame.strokeAlign = nodeData.strokeAlign
    }
  }

  // Apply corner radius
  if (nodeData.cornerRadius !== undefined) {
    frame.cornerRadius = nodeData.cornerRadius
  } else {
    if (nodeData.topLeftRadius !== undefined)
      frame.topLeftRadius = nodeData.topLeftRadius
    if (nodeData.topRightRadius !== undefined)
      frame.topRightRadius = nodeData.topRightRadius
    if (nodeData.bottomRightRadius !== undefined)
      frame.bottomRightRadius = nodeData.bottomRightRadius
    if (nodeData.bottomLeftRadius !== undefined)
      frame.bottomLeftRadius = nodeData.bottomLeftRadius
  }

  // Apply effects (shadows)
  if (nodeData.effects && nodeData.effects.length > 0) {
    frame.effects = convertEffects(nodeData.effects)
  }

  // Apply layout mode
  if (nodeData.layoutMode && nodeData.layoutMode !== 'NONE') {
    frame.layoutMode = nodeData.layoutMode

    if (nodeData.primaryAxisAlignItems) {
      frame.primaryAxisAlignItems = nodeData.primaryAxisAlignItems
    }
    if (nodeData.counterAxisAlignItems) {
      frame.counterAxisAlignItems = nodeData.counterAxisAlignItems
    }
    if (nodeData.itemSpacing !== undefined) {
      frame.itemSpacing = nodeData.itemSpacing
    }
  }

  // Apply padding
  if (nodeData.paddingTop !== undefined) frame.paddingTop = nodeData.paddingTop
  if (nodeData.paddingRight !== undefined)
    frame.paddingRight = nodeData.paddingRight
  if (nodeData.paddingBottom !== undefined)
    frame.paddingBottom = nodeData.paddingBottom
  if (nodeData.paddingLeft !== undefined)
    frame.paddingLeft = nodeData.paddingLeft

  // Clip content
  if (nodeData.clipsContent !== undefined) {
    frame.clipsContent = nodeData.clipsContent
  }

  // Create children
  if (nodeData.children && nodeData.children.length > 0) {
    for (const childData of nodeData.children) {
      const childNode = await createNode(childData)
      if (childNode) {
        frame.appendChild(childNode)
      }
    }
  }

  return frame
}

function createRectangle(nodeData: FigmaNode): RectangleNode {
  const rect = figma.createRectangle()

  rect.x = nodeData.x
  rect.y = nodeData.y
  rect.resize(Math.max(1, nodeData.width), Math.max(1, nodeData.height))

  // Apply fills
  if (nodeData.fills && nodeData.fills.length > 0) {
    rect.fills = convertFills(nodeData.fills)
  }

  // Apply strokes
  if (nodeData.strokes && nodeData.strokes.length > 0) {
    rect.strokes = convertStrokes(nodeData.strokes)
    if (nodeData.strokeWeight) {
      rect.strokeWeight = nodeData.strokeWeight
    }
  }

  // Apply corner radius
  if (nodeData.cornerRadius !== undefined) {
    rect.cornerRadius = nodeData.cornerRadius
  }

  // Apply effects
  if (nodeData.effects && nodeData.effects.length > 0) {
    rect.effects = convertEffects(nodeData.effects)
  }

  return rect
}

async function createText(nodeData: FigmaNode): Promise<TextNode> {
  const text = figma.createText()

  text.x = nodeData.x
  text.y = nodeData.y

  // Load font before setting characters
  const fontFamily = nodeData.style?.fontFamily || 'Inter'
  const fontWeight = nodeData.style?.fontWeight || 400
  const fontStyle = getFontStyle(fontWeight)

  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
  } catch {
    // Fallback to Inter if font not available
    await figma.loadFontAsync({ family: 'Inter', style: fontStyle })
  }

  // Set text content
  text.characters = nodeData.characters || ''

  // Apply text style
  if (nodeData.style) {
    text.fontSize = nodeData.style.fontSize || 16

    if (nodeData.style.lineHeight && nodeData.style.lineHeight !== 'AUTO') {
      text.lineHeight = { value: nodeData.style.lineHeight, unit: 'PIXELS' }
    }

    if (nodeData.style.letterSpacing) {
      text.letterSpacing = {
        value: nodeData.style.letterSpacing,
        unit: 'PIXELS',
      }
    }

    if (nodeData.style.textAlignHorizontal) {
      text.textAlignHorizontal = nodeData.style.textAlignHorizontal
    }

    if (
      nodeData.style.textDecoration &&
      nodeData.style.textDecoration !== 'NONE'
    ) {
      text.textDecoration = nodeData.style.textDecoration
    }
  }

  // Apply text color
  if (nodeData.fills && nodeData.fills.length > 0) {
    text.fills = convertFills(nodeData.fills)
  }

  // Resize after content is set
  text.resize(Math.max(1, nodeData.width), Math.max(1, nodeData.height))

  return text
}

function createVector(nodeData: FigmaNode): SceneNode {
  // For SVG content, we'll create a frame as a placeholder
  // Full SVG import would require more complex parsing
  const frame = figma.createFrame()

  frame.x = nodeData.x
  frame.y = nodeData.y
  frame.resize(Math.max(1, nodeData.width), Math.max(1, nodeData.height))
  frame.name = nodeData.name + ' (SVG)'

  // Apply fills if any
  if (nodeData.fills && nodeData.fills.length > 0) {
    frame.fills = convertFills(nodeData.fills)
  } else {
    frame.fills = []
  }

  return frame
}

function convertFills(fills: Array<FigmaFill>): Array<Paint> {
  return fills.map((fill) => {
    if (fill.type === 'SOLID' && fill.color) {
      return {
        type: 'SOLID',
        color: { r: fill.color.r, g: fill.color.g, b: fill.color.b },
        opacity: fill.opacity ?? fill.color.a,
      } as SolidPaint
    }

    if (fill.type === 'IMAGE' && fill.imageUrl) {
      // For images, we'll create a placeholder solid fill
      // Full image import would require fetching the image
      return {
        type: 'SOLID',
        color: { r: 0.9, g: 0.9, b: 0.9 },
        opacity: 1,
      } as SolidPaint
    }

    // Default
    return {
      type: 'SOLID',
      color: { r: 1, g: 1, b: 1 },
      opacity: 1,
    } as SolidPaint
  })
}

function convertStrokes(strokes: Array<FigmaStroke>): Array<Paint> {
  return strokes.map(
    (stroke) =>
      ({
        type: 'SOLID',
        color: { r: stroke.color.r, g: stroke.color.g, b: stroke.color.b },
        opacity: stroke.opacity ?? stroke.color.a,
      }) as SolidPaint,
  )
}

function convertEffects(effects: Array<FigmaDropShadow>): Array<Effect> {
  return effects.map(
    (effect) =>
      ({
        type: 'DROP_SHADOW',
        color: {
          r: effect.color.r,
          g: effect.color.g,
          b: effect.color.b,
          a: effect.color.a,
        },
        offset: effect.offset,
        radius: effect.radius,
        spread: effect.spread ?? 0,
        visible: effect.visible,
      }) as DropShadowEffect,
  )
}

function getFontStyle(weight: number): string {
  if (weight <= 100) return 'Thin'
  if (weight <= 200) return 'ExtraLight'
  if (weight <= 300) return 'Light'
  if (weight <= 400) return 'Regular'
  if (weight <= 500) return 'Medium'
  if (weight <= 600) return 'SemiBold'
  if (weight <= 700) return 'Bold'
  if (weight <= 800) return 'ExtraBold'
  return 'Black'
}

function countNodes(node: FigmaNode): number {
  let count = 1
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }
  return count
}
