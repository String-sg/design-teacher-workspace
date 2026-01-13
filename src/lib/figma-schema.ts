/**
 * Figma-compatible JSON schema types for DOM export
 */

export type FigmaNodeType = 'FRAME' | 'RECTANGLE' | 'TEXT' | 'VECTOR'
export type FigmaLayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL'
export type FigmaAlignItems = 'MIN' | 'CENTER' | 'MAX' | 'BASELINE'
export type FigmaJustifyContent =
  | 'MIN'
  | 'CENTER'
  | 'MAX'
  | 'SPACE_BETWEEN'
  | 'SPACE_AROUND'
export type FigmaTextAlignHorizontal = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
export type FigmaTextAlignVertical = 'TOP' | 'CENTER' | 'BOTTOM'
export type FigmaFillType = 'SOLID' | 'GRADIENT_LINEAR' | 'IMAGE'
export type FigmaStrokeCap = 'NONE' | 'ROUND' | 'SQUARE'
export type FigmaStrokeJoin = 'MITER' | 'BEVEL' | 'ROUND'

export interface FigmaColor {
  r: number // 0-1
  g: number // 0-1
  b: number // 0-1
  a: number // 0-1
}

export interface FigmaFill {
  type: FigmaFillType
  color?: FigmaColor
  opacity?: number
  imageUrl?: string
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE'
}

export interface FigmaStroke {
  type: 'SOLID'
  color: FigmaColor
  opacity?: number
}

export interface FigmaDropShadow {
  type: 'DROP_SHADOW'
  color: FigmaColor
  offset: { x: number; y: number }
  radius: number
  spread?: number
  visible: boolean
}

export interface FigmaTextStyle {
  fontFamily: string
  fontWeight: number
  fontSize: number
  lineHeight?: number | 'AUTO'
  letterSpacing?: number
  textAlignHorizontal?: FigmaTextAlignHorizontal
  textAlignVertical?: FigmaTextAlignVertical
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'
}

export interface FigmaNode {
  type: FigmaNodeType
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
  // Layout properties
  layoutMode?: FigmaLayoutMode
  primaryAxisAlignItems?: FigmaJustifyContent
  counterAxisAlignItems?: FigmaAlignItems
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  itemSpacing?: number
  // Children
  children?: Array<FigmaNode>
  // TEXT specific
  characters?: string
  style?: FigmaTextStyle
  // VECTOR specific (SVG)
  svgContent?: string
}

export interface FigmaDocument {
  schemaVersion: '1.0.0'
  name: string
  exportedAt: string
  viewport: {
    width: number
    height: number
  }
  root: FigmaNode
}
