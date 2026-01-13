import type { FigmaColor } from './figma-schema'

/**
 * Parse CSS color string to FigmaColor (RGBA with 0-1 range)
 */
export function parseCssColor(cssColor: string): FigmaColor | null {
  if (!cssColor || cssColor === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 }
  }

  // Handle rgba() and rgb()
  const rgbaMatch = cssColor.match(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/,
  )
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10) / 255,
      g: parseInt(rgbaMatch[2], 10) / 255,
      b: parseInt(rgbaMatch[3], 10) / 255,
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
    }
  }

  // Handle hex colors
  const hexMatch = cssColor.match(/^#([a-fA-F0-9]{3,8})$/)
  if (hexMatch) {
    return hexToFigmaColor(hexMatch[1])
  }

  // Handle named colors by creating a temporary element
  if (typeof document !== 'undefined') {
    const temp = document.createElement('div')
    temp.style.color = cssColor
    document.body.appendChild(temp)
    const computed = getComputedStyle(temp).color
    document.body.removeChild(temp)
    if (computed && computed !== cssColor) {
      return parseCssColor(computed)
    }
  }

  return null
}

/**
 * Convert hex string to FigmaColor
 */
function hexToFigmaColor(hex: string): FigmaColor {
  let r: number, g: number, b: number
  let a = 1

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255
    g = parseInt(hex[1] + hex[1], 16) / 255
    b = parseInt(hex[2] + hex[2], 16) / 255
  } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16) / 255
    g = parseInt(hex[1] + hex[1], 16) / 255
    b = parseInt(hex[2] + hex[2], 16) / 255
    a = parseInt(hex[3] + hex[3], 16) / 255
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
    a = parseInt(hex.slice(6, 8), 16) / 255
  } else {
    return { r: 0, g: 0, b: 0, a: 1 }
  }

  return { r, g, b, a }
}

/**
 * Convert FigmaColor to CSS rgba string
 */
export function figmaColorToCss(color: FigmaColor): string {
  const r = Math.round(color.r * 255)
  const g = Math.round(color.g * 255)
  const b = Math.round(color.b * 255)
  return `rgba(${r}, ${g}, ${b}, ${color.a})`
}

/**
 * Convert FigmaColor to hex string
 */
export function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255)
    .toString(16)
    .padStart(2, '0')
  const g = Math.round(color.g * 255)
    .toString(16)
    .padStart(2, '0')
  const b = Math.round(color.b * 255)
    .toString(16)
    .padStart(2, '0')
  return `#${r}${g}${b}`
}

/**
 * Check if a color is effectively transparent
 */
export function isTransparent(color: FigmaColor | null): boolean {
  if (!color) return true
  return color.a === 0
}

/**
 * Parse box shadow string to array of FigmaDropShadow
 */
export function parseBoxShadow(boxShadow: string): Array<{
  offset: { x: number; y: number }
  radius: number
  color: FigmaColor
}> {
  if (!boxShadow || boxShadow === 'none') return []

  const shadows: Array<{
    offset: { x: number; y: number }
    radius: number
    color: FigmaColor
  }> = []

  // Split by commas, but not inside rgba()
  const parts = boxShadow.split(/,(?![^(]*\))/g)

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    // Match: [inset?] offsetX offsetY [blurRadius] [spreadRadius] color
    const match = trimmed.match(
      /^(?:inset\s+)?(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(.*)$/,
    )

    if (match) {
      const offsetX = parseFloat(match[1]) || 0
      const offsetY = parseFloat(match[2]) || 0
      const blurRadius = parseFloat(match[3]) || 0
      const colorStr = match[5] ? match[5].trim() : 'rgba(0,0,0,0.25)'

      const color = parseCssColor(colorStr)
      if (color) {
        shadows.push({
          offset: { x: offsetX, y: offsetY },
          radius: blurRadius,
          color,
        })
      }
    }
  }

  return shadows
}
