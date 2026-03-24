---
name: ds-tw:install
description: >
  Install and configure the Flow Design System in a consumer app.
  Sets up @flow/core components, @flow/design-tokens, the 3-layer CSS token bridge
  (Radix -> Flow DS -> Shadcn/TW), dark mode, and the .flow-theme escape hatch.
  In full mode, also migrates existing Shadcn UI component imports to @flow/core equivalents.
  Works with Next.js, Vite, TanStack Start, or any Tailwind CSS v4 project.
  Use: /ds-tw:install [full|tokens-only]
argument-hint: "[full|tokens-only]"
---

# Apply Flow Design System

This skill installs and configures the Flow Design System in any Tailwind CSS project.

## Mode

If `$ARGUMENTS` is provided (`full` or `tokens-only`), use that mode directly.

If no argument is provided, use the `AskUserQuestion` tool to ask:

Question: "Which mode would you like?"
Options:
- "Full — @flow/core components + @flow/design-tokens + @radix-ui/colors + fonts. Migrates Shadcn imports to @flow/core."
- "Tokens only — @flow/design-tokens + @radix-ui/colors only. Token bridge without component library."

Wait for the user's response before continuing.

Modes:
- **`full`**: Install `@flow/core` (components) + `@flow/design-tokens` + `@radix-ui/colors` + fonts, then migrate Shadcn component imports to `@flow/core`
- **`tokens-only`**: Install `@flow/design-tokens` + `@radix-ui/colors` only (no component library, no migration)

---

## Step 1: Detect Project Setup

### Package Manager
Check which lockfile exists in the project root (or workspace root for monorepos):
- `bun.lock` or `bun.lockb` → use `bun add`
- `pnpm-lock.yaml` → use `pnpm add`
- `yarn.lock` → use `yarn add`
- Otherwise → use `npm install`

**Monorepo awareness**: If `package.json` has a `"workspaces"` field, or the project is inside a directory like `apps/` or `packages/`, the lockfile may be at the workspace root. Run install commands from the **app directory** (not the workspace root) so dependencies land in the correct `package.json`.

### Framework
Read `package.json` dependencies to detect:
- `next` → Next.js (App Router or Pages)
- `@tanstack/react-start` → TanStack Start
- `vite` (without a framework) → Vite + React/Vue
- `@remix-run/react` → Remix
- `astro` → Astro

### CSS Entry Point
Find the project's main CSS file based on framework:

| Framework | Typical CSS entry |
|-----------|------------------|
| Next.js (App Router) | `app/globals.css` |
| Next.js (Pages) | `styles/globals.css` |
| Vite / TanStack Start | `src/styles.css` or `src/index.css` |
| Remix | `app/tailwind.css` or `app/root.css` |
| Astro | `src/styles/global.css` |

If none found, search for any CSS file that contains `@import 'tailwindcss'` or `@tailwind base`.

### Existing Setup
- **Shadcn present?** Check for `components.json` or `src/components/ui/` directory
- **Tailwind version?** If CSS contains `@import "tailwindcss"` → v4. If `tailwind.config.*` exists → v3.

---

## Step 2: Configure Private Registry

The `@flow` packages are hosted on a private GitLab npm registry.

1. Check if `.npmrc` exists in the project root
2. Check if it already contains `@flow:registry=`
3. If not, append this line to `.npmrc` (create the file if needed):

```
@flow:registry=https://sgts.gitlab-dedicated.com/api/v4/projects/60257/packages/npm/
```

4. Verify `.npmrc` is listed in `.gitignore` (it may contain auth tokens). If not, add it and warn the user.

---

## Step 3: Install Dependencies

### Full mode
```bash
# Replace with detected package manager
bun add @flow/core@^0.1.17 @flow/design-tokens@^0.1.7 @radix-ui/colors@^3.0.0 @fontsource/inter tw-animate-css
```

### Tokens-only mode
```bash
bun add @flow/design-tokens@^0.1.7 @radix-ui/colors@^3.0.0 tw-animate-css
```

### Peer dependency: Shadcn CSS
If the project uses Shadcn UI, ensure `shadcn` is in devDependencies (needed for `shadcn/tailwind.css`):
```bash
bun add -d shadcn
```

---

## Step 4: Set Up CSS Token Layer (Two-File Architecture)

The token layer uses **two files**:

| File | Purpose | Portable? |
|------|---------|-----------|
| `flow-ds-theme.css` | Flow DS override layer — maps Flow semantic tokens to your app's Radix/Shadcn palette | **Yes** — copy as-is to any project |
| Main CSS entry (e.g., `styles.css`) | App-specific — brand scales, Shadcn tokens, Tier 1 primitives, dark mode, `@theme`, `@layer base` | **No** — per-project |

Read both templates:
- `${CLAUDE_SKILL_DIR}/css/flow-ds-theme-template.css` (portable override layer)
- `${CLAUDE_SKILL_DIR}/css/styles-template.css` (app scaffold)

### Brand color selection

Use the `AskUserQuestion` tool to ask:

Question: "Which brand color would you like?"
Options:
- "TWBlue (#0064FF) — Custom blue scale, works well with most apps (Recommended)"
- "Flow DS default (indigo #272962) — The canonical Flow DS look"
- "Radix violet — Built-in Radix violet scale"
- "Radix crimson — Built-in Radix crimson scale"

Then adapt **both templates** based on the answer:
- **TWBlue** (default): Use both templates as-is — no changes needed.
- **Flow DS default**: In `styles-template.css`, remove the custom TWBlue scale hex values and dark values. In `flow-ds-theme-template.css`, remove the brand override mappings in Section A (Flow DS will use its built-in indigo). Keep all other sections.
- **Radix scale**: In both templates, replace `var(--twblue-N)` references with `var(--<scale>-N)`. In `styles-template.css`, remove TWBlue hex declarations and add the chosen scale's Radix CSS imports + dark imports.

### Other adaptations

1. **Fonts**: The template defaults to Inter. If the user wants a different font, replace `@import '@fontsource/inter'` and update `--font-sans` in the `@theme inline` block in `styles-template.css`.

2. **Shadcn tokens**: If Shadcn is NOT present, remove the Shadcn semantic token blocks in `styles-template.css` (lines with `--background`, `--foreground`, `--primary`, etc.) and the `shadcn/tailwind.css` import. In `flow-ds-theme-template.css`, remove Section B semantic surface overrides that reference Shadcn tokens.

3. **TW v3 projects**: In `styles-template.css`, remove the `@theme inline` block. Instead, instruct the user to add tokens to `tailwind.config.js` under `theme.extend.colors`.

4. **Flow core CSS import**:
   - If the project already has a CSS reset (e.g., Tailwind's preflight), use `@flow/core/tailwind.no-reset.css`
   - Otherwise use `@flow/core/tailwind.css`
   - In tokens-only mode, omit this import entirely

### Write both files

1. **Write `flow-ds-theme.css`** next to the main CSS entry file (e.g., `src/flow-ds-theme.css`). Use the adapted `flow-ds-theme-template.css`.

2. **Replace the main CSS entry file** with the adapted `styles-template.css`. It already includes `@import './flow-ds-theme.css'`, `@import "tailwindcss"`, `@custom-variant dark`, `@theme inline`, and `@layer base` — so the old content is fully superseded.

If the existing CSS has custom styles beyond Shadcn/Tailwind boilerplate, preserve those by appending them after the template content.

---

## Step 5: Migrate Shadcn Imports to @flow/core (Full Mode Only)

**Skip this step in tokens-only mode.**

Find all files that import from `@/components/ui/*` (or the project's Shadcn component path) and migrate them to import from `@flow/core` instead.

### How to migrate

1. **Scan** for all imports matching `from "@/components/ui/..."` or `from "~/components/ui/..."`
2. **Replace** with a single consolidated import from `@flow/core`
3. **Map variant names** using the table below
4. **Build** to verify — fix any type errors

### Variant & Size Mapping

#### Button
| Shadcn variant | Flow DS variant |
|---|---|
| `default` | `default` |
| `destructive` | `critical` |
| `outline` | `outline` |
| `secondary` | `neutral` |
| `ghost` | `ghost` |
| `link` | `link` |

| Shadcn size | Flow DS size |
|---|---|
| `default` | `default` |
| `sm` | `sm` |
| `lg` | `lg` |
| `icon` | `icon` |
| `icon-xs` | `icon` (no xs equivalent) |
| `icon-sm` | `icon` |
| `icon-lg` | `icon` |
| `xs` | `sm` (closest match) |

#### Badge
| Shadcn variant | Flow DS variant |
|---|---|
| `default` | `default` |
| `secondary` | `secondary` |
| `destructive` | `critical` |
| `outline` | `outline` |

Flow DS also has `verified` (with checkmark icon) — no Shadcn equivalent.

#### Other Components
These have the same API and can be migrated by changing the import path only:
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Input`, `Textarea`, `Label`, `Separator`
- `Dialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu` (and sub-components)
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Accordion`, `Alert`, `AlertDialog`, `Avatar`, `Checkbox`, `RadioGroup`, `Switch`, `Toggle`
- `Skeleton`, `Progress`, `Slider`, `Breadcrumb`, `Pagination`

### Consolidate imports

Instead of separate imports per component file:
```tsx
// Before — multiple Shadcn imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
```

Use a single `@flow/core` import:
```tsx
// After — single Flow DS import
import { Button, Input, Card, CardHeader, CardTitle } from "@flow/core"
```

### After migration

The Shadcn component files in `src/components/ui/` that have Flow DS equivalents are no longer needed. Do NOT delete them automatically — inform the user which files are now unused so they can decide whether to remove them.

---

## Step 6: Verify

Run the project build command (e.g., `bun run build`) to verify:

1. **No build errors** — TypeScript compiles, no missing exports
2. **No CSS parse errors** — dev server starts cleanly
3. **Shadcn still works** — any components NOT migrated to @flow/core still render correctly via the token bridge
4. **Flow components render** (full mode only) — migrated components render with Flow DS styling
5. **Dark mode works** — toggle `.dark` class on `<html>` — colors should swap correctly

---

## Token Architecture Reference

For a detailed explanation of the 3-layer token bridge, see `${CLAUDE_SKILL_DIR}/references/token-bridge.md`.

For the full component catalog with import examples, see `${CLAUDE_SKILL_DIR}/references/components.md`.

---

## Troubleshooting

### "Cannot find module '@flow/core'"
The `.npmrc` is missing or doesn't have the `@flow:registry` line. Re-run Step 2.

### Flow components look unstyled
Missing `@flow/core/tailwind.no-reset.css` (or `tailwind.css`) import. Check that it's imported AFTER `@import 'tailwindcss'` in the CSS entry file.

### Brand colors don't match expected
CSS custom properties resolve at computed-value time. The `.flow-theme` class re-declares ALL derived tokens (button fills, borders, foregrounds) because overriding `--color-brand-*` alone won't cascade to children that inherited the already-resolved value from `:root`. Make sure `.flow-theme` includes the full transitive token block.

### Dark mode colors look wrong
Ensure the `.dark` block in `styles.css` re-maps ALL Radix scales to their dark variants (`--slate-1: var(--slate-dark-1)`, etc.) and includes dark hex values for custom brand scales (e.g., TWBlue). The Flow DS semantic mappings in `flow-ds-theme.css` do NOT need re-declaration in `.dark` — they auto-resolve because `.dark` is on `<html>` (same element as `:root`). Only tokens whose **formula** changes need dark overrides (e.g., `--card: white` → `var(--slate-2)`).

### Monorepo: packages not found after install
In workspaces, `node_modules/@flow/core` may be hoisted to the workspace root. This is fine — bundlers resolve it correctly. If not, try installing from the workspace root instead.
