# Flow DS Token Bridge Architecture

The Flow Design System uses a 3-layer token bridge that maps raw color primitives through semantic meanings to app-level design tokens. This architecture lets Flow DS components and Shadcn/TW components share a single color system.

## Token Resolution Chain

```
Layer 1: Radix Primitives        Layer 2: Flow DS Semantic        Layer 3: App Tokens (Shadcn/TW)
─────────────────────────        ──────────────────────────        ──────────────────────────────
--slate-1..12          ──────>   --color-neutral-1..12
--crimson-1..12        ──────>   --color-critical-1..12
--lime-1..12           ──────>   --color-success-1..12
--orange-1..12         ──────>   --color-caution-1..12
--amber-1..12          ──────>   --color-info-1..12
--twblue-1..12 (custom)──────>   --color-brand-1..12

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
| Radix Scale | Role |
|-------------|------|
| `slate` | Neutral grays |
| `crimson` | Critical / destructive |
| `lime` | Success |
| `orange` | Caution / warning |
| `amber` | Info |
| `violet` | Secondary accent |

**Custom scales:** TWBlue is a hand-crafted 12-step scale (with alpha variants) that doesn't come from Radix. It's defined directly in `:root` with dark variants in `.dark`.

## Layer 2: Flow DS Semantic Tokens

Source: `@flow/design-tokens` (base tokens) + custom overrides in CSS

Flow DS maps Radix primitives to semantic meanings:

| Semantic Scale | Default Mapping | Purpose |
|---------------|----------------|---------|
| `--color-brand-*` | TWBlue (custom) | Primary brand, buttons, links |
| `--color-neutral-*` | Slate | Grays, borders, text |
| `--color-critical-*` | Crimson | Errors, destructive actions |
| `--color-success-*` | Lime | Success states |
| `--color-caution-*` | Orange | Warnings |
| `--color-info-*` | Amber | Informational |
| `--color-accent-*` | Slate | Secondary emphasis |

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

Dark mode uses a class-based strategy (`.dark` on `<html>` or a parent element). The `.dark` block:

1. Swaps ALL Radix scales to their dark variants: `--slate-1: var(--slate-dark-1)`
2. Redefines custom brand scales with dark-appropriate hex values
3. Re-declares Shadcn semantic tokens with dark values
4. Re-declares Flow DS semantic mappings (they reference the same Radix vars, which are now dark-swapped)

The Tailwind `@custom-variant dark (&:is(.dark *))` directive enables dark-mode utility classes like `dark:bg-slate-2`.
