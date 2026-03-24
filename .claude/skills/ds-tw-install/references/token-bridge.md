# Flow DS Token Bridge Architecture

The Flow Design System uses a 3-layer token bridge that maps raw color primitives through semantic meanings to app-level design tokens. This architecture lets Flow DS components and Shadcn/TW components share a single color system.

## File Architecture

The token bridge is split across two CSS files:

| File | Contents | Portable? |
|------|----------|-----------|
| `flow-ds-theme.css` | Sections A–F: color scale mappings, semantic overrides, spacing/typography wiring, dark mode formula changes, selector radius overrides, `.flow-theme` escape hatch | **Yes** — copy to any project |
| `styles.css` | Brand scale hex values, Shadcn tokens, Tier 1 `--_` primitives, dark mode Radix swaps + brand dark values, `@theme inline`, `@layer base` | **No** — per-project |

## Token Resolution Chain

```
Layer 1: Radix/Custom Primitives  Layer 2: Flow DS Semantic         Layer 3: App Tokens (Shadcn/TW)
(defined in styles.css)           (overridden in flow-ds-theme.css) (defined in styles.css)
──────────────────────────        ───────────────────────────        ──────────────────────────────
--slate-1..12          ──────>   --color-neutral-1..12
--crimson-1..12        ──────>   --color-critical-1..12
--lime-1..12           ──────>   --color-success-1..12
--orange-1..12         ──────>   --color-caution-1..12
--twblue-1..12 (custom)──────>   --color-info-1..12
--twblue-1..12 (custom)──────>   --color-brand-1..12
--slate-1..12          ──────>   --color-accent-1..12

                                 --color-background-page   <──>   --background
                                 --color-background-section <──>  --card
                                 --color-background-popover <──>  --popover
                                 --color-foreground-default <──>  --foreground
                                 --color-foreground-section <──>  --card-foreground
                                 --color-border-default     <──>  --border
                                 --color-border-focus       <──>  --ring
                                 --color-fill-critical      <──>  --destructive
                                 --color-fill-contrast      <──>  --primary
```

## Layer 1: Radix Primitive Scales

Source: `@radix-ui/colors` (imported as CSS files)

Radix provides 12-step color scales following a specific purpose pattern:
- **Steps 1–2**: Backgrounds (app bg, subtle bg)
- **Steps 3–5**: Interactive states (hover, active, selected)
- **Steps 6–8**: Borders (subtle, default, strong)
- **Step 9**: Solid fill (the "main" color)
- **Step 10**: Hovered solid fill
- **Steps 11–12**: Text (normal, high-contrast)

Each scale has both light and dark variants (e.g., `slate.css` + `slate-dark.css`). Dark mode works by swapping `--slate-1: var(--slate-dark-1)` in the `.dark` block.

**Scales used:**
| Radix Scale | Role | Overrides Flow DS Internal |
|-------------|------|---------------------------|
| `slate` | Neutral grays, accent | `--color-slate-*` (Flow's own slate) |
| `crimson` | Critical / destructive | `--color-ruby-*` |
| `lime` | Success | `--color-green-*` |
| `orange` | Caution / warning | `--color-orange-*` (Flow's own orange) |
| `violet` | Secondary accent (twpurple alias) | — |

**Custom scales:** TWBlue is a hand-crafted 12-step scale (with alpha variants) that doesn't come from Radix. It's defined directly in `:root` with dark variants in `.dark`. It overrides Flow's built-in `--color-blue-*` (for info) and the hard-coded indigo brand hex values.

## Layer 2: Flow DS Semantic Tokens

Source: `@flow/design-tokens` (base tokens) + custom overrides in `flow-ds-theme.css`

Flow DS ships its own internal primitives. Our override layer remaps the semantic scales:

| Semantic Scale | Flow DS Default | Our Override (Radix/Custom) | Purpose |
|---------------|-----------------|---------------------------|---------|
| `--color-brand-*` | Indigo (hard-coded hex) | `var(--twblue-*)` | Primary brand, buttons, links |
| `--color-neutral-*` | `--color-slate-*` (Flow) | `var(--slate-*)` (Radix) | Grays, borders, text |
| `--color-critical-*` | `--color-ruby-*` (Flow) | `var(--crimson-*)` (Radix) | Errors, destructive actions |
| `--color-success-*` | `--color-green-*` (Flow) | `var(--lime-*)` (Radix) | Success states |
| `--color-caution-*` | `--color-orange-*` (Flow) | `var(--orange-*)` (Radix) | Warnings |
| `--color-info-*` | `--color-blue-*` (Flow) | `var(--twblue-*)` | Informational (same as brand) |
| `--color-accent-*` | `--color-mint-*` (Flow) | `var(--slate-*)` (Radix) | Secondary emphasis (neutral) |

Flow DS also defines **surface tokens** that control component backgrounds, text, and borders:
- `--color-background-page`, `--color-background-section`, `--color-background-popover`
- `--color-foreground-default`, `--color-foreground-section`, `--color-foreground-link`
- `--color-border-default`, `--color-border-focus`
- `--color-fill-critical`, `--color-fill-contrast`

## Layer 3: App Tokens (Shadcn/TW)

These are the tokens that Shadcn UI components and Tailwind utilities read:

| App Token | Resolves To | Flow DS Equivalent |
|-----------|-------------|-------------------|
| `--background` | `var(--slate-1)` | `--color-background-page` |
| `--foreground` | `var(--slate-12)` | `--color-foreground-default` |
| `--card` | `white` | `--color-background-section` |
| `--primary` | `var(--twblue-9)` | `--color-fill-contrast` |
| `--destructive` | `var(--crimson-9)` | `--color-fill-critical` |
| `--border` | `var(--slate-6)` | `--color-border-default` |
| `--ring` | `var(--twblue-8)` | `--color-border-focus` |
| `--muted` | `var(--slate-3)` | `--color-background-overlay` |
| `--accent` | `var(--slate-3)` | `--btn-color-fill-hover` |

The bidirectional arrows in the chain mean:
- Shadcn components read `--primary`, `--border`, etc.
- Flow components read `--color-fill-contrast`, `--color-border-default`, etc.
- Both resolve to the same underlying Radix values.

## The `.flow-theme` Escape Hatch

When your app overrides Flow's default brand (e.g., TWBlue instead of Flow's indigo), you can use the `.flow-theme` CSS class to revert specific sections back to Flow DS canonical appearance.

```html
<!-- App brand (TWBlue) -->
<Button>App-branded button</Button>

<!-- Flow DS canonical (indigo) -->
<div class="flow-theme">
  <Button>Flow-branded button</Button>
</div>
```

**Why `.flow-theme` re-declares so many tokens:**

CSS custom properties resolve `var()` at computed-value time on the **declaring element**. Children inherit the already-resolved value from `:root`, not the variable reference. So overriding `--color-brand-9` in `.flow-theme` alone won't affect tokens like `--btn-color-fill-brand-enabled` that were already resolved at `:root`.

The `.flow-theme` block must re-declare ALL tokens that transitively depend on `--color-brand-*`:
- Button fills/borders/foregrounds (`--btn-color-*`)
- Selection fills (`--color-fill-selected-*`)
- Section inverse backgrounds
- Link colors
- Tailwind utility mappings (`--background-color-*`, `--border-color-*`, etc.)

## Tier 1 Overridable Primitives

The `--_` prefixed tokens allow the app to tune radius, spacing, and typography without forking the design system:

| Primitive | TW Value | Flow Default | Purpose |
|-----------|----------|-------------|---------|
| `--_radius-sm` | 6px | 6px | Small corners |
| `--_radius-md` | 8px | 8px | Medium corners |
| `--_radius-lg` | 10px | 10px | Large corners |
| `--_radius-xl` | 14px | 14px | Extra large corners |
| `--_radius-2xl` | 24px | 16px | Cards (TW uses more rounding) |
| `--_spacing-xs` | 0.375rem | 0.5rem | Tight spacing |
| `--_spacing-md` | 0.75rem | 1rem | Standard spacing |
| `--_spacing-2xl` | 2.25rem | 2.5rem | Large spacing |
| `--_text-body-md` | 0.875rem | 1rem | Body text size |
| `--_text-label-sm` | 0.75rem | 0.875rem | Label text size |
| `--_weight-body-md-strong` | 500 | 600 | Bold body weight |

The underscore prefix distinguishes these from Flow's internal tokens. `.flow-theme` reverts all `--_*` primitives back to Flow DS defaults.

## Dark Mode

Dark mode uses a class-based strategy (`.dark` on `<html>`). The `.dark` block only needs to:

1. Swap Radix scales to their dark variants: `--slate-1: var(--slate-dark-1)`
2. Redefine custom brand scales with dark-appropriate hex values
3. Override tokens whose **formula** changes (e.g., `--card: white` → `var(--slate-2)`)

Shadcn semantic tokens and Flow DS scale mappings do **not** need re-declaration in `.dark`. Since `.dark` is applied to `<html>` (same element as `:root`), CSS custom properties resolve `var()` references at computed-value time against the overridden primitives on that same element. Only tokens whose formula changes (not just the underlying value) need explicit dark overrides.

The Tailwind `@custom-variant dark (&:is(.dark *))` directive enables dark-mode utility classes like `dark:bg-slate-2`.
