---
name: apply-flow-ds
description: >
  Install and configure the Flow Design System in a consumer app.
  Sets up @flow/core components, @flow/design-tokens, the 3-layer CSS token bridge
  (Radix -> Flow DS -> Shadcn/TW), dark mode, and the .flow-theme escape hatch.
  Works with Next.js, Vite, TanStack Start, or any Tailwind CSS v4 project.
  Use: /apply-flow-ds [full|tokens-only]
argument-hint: "[full|tokens-only]"
---

# Apply Flow Design System

This skill installs and configures the Flow Design System in any Tailwind CSS project.

## Mode

Parse `$ARGUMENTS`:
- **`full`** (default if no argument): Install `@flow/core` (components) + `@flow/design-tokens` + `@radix-ui/colors` + fonts
- **`tokens-only`**: Install `@flow/design-tokens` + `@radix-ui/colors` only (no component library)

---

## Step 1: Detect Project Setup

### Package Manager
Check which lockfile exists in the project root:
- `bun.lock` or `bun.lockb` → use `bun add`
- `pnpm-lock.yaml` → use `pnpm add`
- `yarn.lock` → use `yarn add`
- Otherwise → use `npm install`

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
- **Tailwind version?** If CSS contains `@import 'tailwindcss'` → v4. If `tailwind.config.*` exists → v3.

---

## Step 2: Configure Private Registry

The `@flow` packages are hosted on a private GitLab npm registry.

1. Check if `.npmrc` exists in the project root
2. Check if it already contains `@flow:registry=`
3. If not, append this line to `.npmrc` (create the file if needed):

```
@flow:registry=https://sgts.gitlab-dedicated.com/api/v4/projects/60257/packages/npm/
```

4. Verify `.npmrc` is listed in `.gitignore` (it may contain auth tokens). If not, warn the user.

---

## Step 3: Install Dependencies

### Full mode
```bash
# Replace with detected package manager
bun add @flow/core@^0.1.17 @flow/design-tokens@^0.1.7 @radix-ui/colors@^3.0.0 @fontsource/inter
```

### Tokens-only mode
```bash
bun add @flow/design-tokens@^0.1.7 @radix-ui/colors@^3.0.0
```

### Peer dependency: Shadcn CSS
If the project uses Shadcn UI, ensure `shadcn` is in devDependencies (needed for `shadcn/tailwind.css`):
```bash
bun add -d shadcn
```

---

## Step 4: Set Up CSS Token Layer

Read the CSS template from `${CLAUDE_SKILL_DIR}/css/flow-tokens-template.css`.

### Adapt the template

1. **Fonts**: If the user wants a different font than Inter, replace `@import '@fontsource/inter'` and update `--font-sans` in the `@theme inline` block.

2. **Brand colors**: The template uses TWBlue (a custom blue scale) as the default brand. Ask the user:
   > "The default brand color is TWBlue (#0064FF). Would you like to keep this, use Flow DS default (indigo #272962), or specify a different Radix color scale (e.g., violet, crimson, blue)?"
   - If they choose a built-in Radix scale, replace the TWBlue hex values with `var(--<scale>-N)` references
   - If they choose Flow default, remove the custom brand scale and the `:root` brand overrides entirely

3. **Shadcn tokens**: If Shadcn is NOT present, remove the Shadcn semantic token block (lines with `--background`, `--foreground`, `--primary`, etc.) and the `shadcn/tailwind.css` import.

4. **TW v3 projects**: Remove the `@theme inline` block. Instead, instruct the user to add tokens to `tailwind.config.js` under `theme.extend.colors`.

5. **Flow core CSS import**:
   - If the project already has a CSS reset (e.g., Tailwind's preflight), use `@flow/core/tailwind.no-reset.css`
   - Otherwise use `@flow/core/tailwind.css`
   - In tokens-only mode, omit this import entirely

### Inject into CSS entry point

**IMPORTANT: Import order matters.** The Flow DS imports MUST come before `@import 'tailwindcss'`.

Prepend the adapted template content BEFORE any existing content in the CSS entry file. If the file already has `@import 'tailwindcss'`, place the Flow DS imports above it and remove the duplicate.

---

## Step 5: Verify

Run through this checklist:

1. **Dev server starts**: Run the project's dev command — no CSS parse errors
2. **Tokens resolve**: In browser devtools, inspect any element — `--color-brand-9` should have a computed value
3. **Shadcn still works**: If Shadcn was present, existing components render unchanged
4. **Flow components render** (full mode only): Add a test `<Button>` from `@flow/core`:
   ```tsx
   import { Button } from '@flow/core'
   // Should render with Flow DS styling
   <Button>Test Flow Button</Button>
   ```
5. **Dark mode works**: Toggle dark class on `<html>` — colors should swap correctly

---

## Token Architecture Reference

For a detailed explanation of the 3-layer token bridge, see `${CLAUDE_SKILL_DIR}/references/token-bridge.md`.

For the full component catalog with import examples, see `${CLAUDE_SKILL_DIR}/references/components.md`.

---

## Troubleshooting

### "Cannot find module '@flow/core'"
The `.npmrc` is missing or doesn't have the `@flow:registry` line. Re-run Step 2.

### Flow components look unstyled
Missing `@flow/core/tailwind.no-reset.css` (or `tailwind.css`) import. Check that it's imported AFTER `@import 'tailwindcss'`.

### Brand colors don't match expected
CSS custom properties resolve at computed-value time. The `.flow-theme` class re-declares ALL derived tokens (button fills, borders, foregrounds) because overriding `--color-brand-*` alone won't cascade to children that inherited the already-resolved value from `:root`. Make sure `.flow-theme` includes the full transitive token block.

### Dark mode colors look wrong
Ensure the `.dark` block re-maps ALL Radix scales to their dark variants (`--slate-1: var(--slate-dark-1)`, etc.) AND re-declares the Flow DS semantic mappings. Both layers must be present.
