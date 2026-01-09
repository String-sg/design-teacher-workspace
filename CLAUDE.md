# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun run dev            # Start dev server on port 3000
bun run build          # Production build
bun run test           # Run tests with vitest
bun run check          # Format and lint (prettier + eslint)
```

> Note: `bunfig.toml` configures Bun to use its native runtime by default for all scripts.

## Architecture

**Framework**: TanStack Start (full-stack React framework with SSR)
**UI**: Shadcn UI with Base UI (MUI) primitives (`base-maia` style)
**Styling**: Tailwind CSS v4 with CSS variables
**Routing**: TanStack Router (file-based routing in `src/routes/`)

### Key Structure

- `src/routes/` - File-based routes. `__root.tsx` contains the shell layout with sidebar.
- `src/components/ui/` - Shadcn UI components (add new ones via `bunx shadcn@latest add <component>`)
- `src/components/` - App-specific components (e.g., `app-sidebar.tsx`, `empty-state.tsx`)
- `src/hooks/` - Custom React hooks
- `src/lib/utils.ts` - Utility functions including `cn()` for className merging
- `todos/project-todos.json` - Project task tracking

### Path Aliases

Use `@/*` to import from `src/*`:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Adding Shadcn Components

```bash
bunx shadcn@latest add <component-name>
```

Components use Base UI primitives (not Radix). Configuration in `components.json`.

## Task Management

Always update task status in `todos/project-todos.json` when:

- Picking up a task (set to `in_progress`)
- Completing a task (set to `completed` with timestamp)
- Starting new work (create new todo entries)
