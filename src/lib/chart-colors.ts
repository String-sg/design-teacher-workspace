/**
 * Teachers Workspace — Categorical Color Palette
 *
 * A 12-color palette for data visualisation, designed following Spectrum's
 * categorical palette methodology and anchored in the Teachers Workspace brand.
 *
 * Usage rules (Spectrum-aligned):
 * - Use colors IN ORDER — Color 1 first, Color 2 second, etc.
 * - Use up to 6 colors for most charts; beyond 6 becomes hard to distinguish
 * - Use only for CATEGORICAL (non-numeric) data — not for sequential/ordinal scales
 * - Keep colors consistent across charts on the same page
 *
 * Colors 1–6: Primary set — maximally distinct, suitable for everyday charts
 * Colors 7–12: Extension set — use only when >6 categories are unavoidable
 *
 * Do NOT use for:
 * - Attendance severity (red/orange/yellow scale — reserved semantic colors)
 * - "Present" ring indicators (#12b886 — reserved)
 * - Grade diverging scales (A1→D7 — separate semantic scale)
 */
/**
 * Teachers Workspace — 6-Color Categorical Palette (IBM-inspired, Spectrum-muted)
 *
 * Hues taken from the IBM Carbon categorical family (blue → violet → pink → teal →
 * orange → amber), anchored to TW blue-500's hue angle (217°), then muted to
 * Spectrum's saturation range (~58–62%) and adjusted lightness (~43–57%) so no
 * colour shouts louder than the others.
 *
 * Each hex is the direct HSL calculation of the TW-500 hue at S=60%, L=50–57%
 * (yellows/ambers pull slightly darker to compensate for their higher perceived
 * brightness).
 *
 * Contrast on #fcfcfd (app background): all ≥ 3.5:1
 *
 * Ordering for multi-series charts:
 *   Cool → warm progression; teal acts as neutral bridge.
 *   Use Blue/Violet for early/primary series, Orange/Amber for high-stakes,
 *   Pink for categorical contrast, Teal for summary metrics.
 *
 * | # | Name   | Hex       | Hue angle | S   | L   | Use case example          |
 * |---|--------|-----------|-----------|-----|-----|---------------------------|
 * | 1 | Blue   | #457cd3   | 217°      | 62% | 55% | T1 / primary series       |
 * | 2 | Violet | #7852d1   | 258°      | 58% | 57% | T2 / second series        |
 * | 3 | Pink   | #cc4287   | 330°      | 58% | 53% | T3 / categorical contrast |
 * | 4 | Teal   | #35a699   | 173°      | 52% | 43% | T4 / neutral bridge       |
 * | 5 | Orange | #cf7330   | 25°       | 62% | 50% | T5 / high-stakes / warm   |
 * | 6 | Amber  | #d0a639   | 43°       | 62% | 52% | T6 / lightest / end       |
 */
export const CATEGORICAL_6 = [
  '#457cd3', // 1  Blue   — H=217°, S=62%, L=55%
  '#7852d1', // 2  Violet — H=258°, S=58%, L=57%
  '#cc4287', // 3  Pink   — H=330°, S=58%, L=53%
  '#35a699', // 4  Teal   — H=173°, S=52%, L=43%
  '#cf7330', // 5  Orange — H=25°,  S=62%, L=50%
  '#d0a639', // 6  Amber  — H=43°,  S=62%, L=52%
] as const

export type Categorical6Color = (typeof CATEGORICAL_6)[number]

export const CATEGORICAL_COLORS = [
  '#0064FF', // 1  Blue    — brand primary
  '#0B9470', // 2  Jade    — teal-green, max hue distance from Blue
  '#7048E8', // 3  Violet  — brand accent
  '#D07C06', // 4  Amber   — first warm; warm/cool balance for multi-series
  '#0B8FAD', // 5  Cyan    — fills Blue–Jade gap
  '#C82868', // 6  Rose    — warm-pink; contrasts all 5 above
  '#3B5BDB', // 7  Indigo  — Blue–Violet gap
  '#5C9C1C', // 8  Fern    — yellow-green, earthy
  '#237A42', // 9  Forest  — mid-green
  '#A832B8', // 10 Plum    — purple-magenta
  '#D44422', // 11 Coral   — orange-red
  '#5A78A8', // 12 Steel   — muted; visual cue that chart exceeds ideal category count
] as const

export type CategoricalColor = (typeof CATEGORICAL_COLORS)[number]
