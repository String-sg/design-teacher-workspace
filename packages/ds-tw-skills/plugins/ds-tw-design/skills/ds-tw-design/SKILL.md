---
name: ds-tw:design
description: >
  Create a new page using Flow Design System components and the teacher workspace theme.
  Uses @flow/core components, Flow DS tokens, and Tailwind CSS utilities.
  Produces production-grade pages that match the existing app aesthetic.
  Part of the ds-tw skill group (see also /ds-tw:install).
  Use: /ds-tw:design <page description>
argument-hint: '<page description>'
---

# Create a Flow DS Page

Create a new page using the Flow Design System and teacher workspace theme. This skill produces production-grade React pages that use `@flow/core` components, Flow DS tokens, and Tailwind CSS utilities.

## Prerequisites

The project must already have Flow DS installed (via `/ds-tw:install`). If not, run that first.

## Input

`$ARGUMENTS` is the page description (e.g., "student attendance dashboard", "parent communication inbox", "staff directory").

If no argument is provided, use the `AskUserQuestion` tool to ask:

Question: "What page would you like to create?"

with a free-text input (no predefined options — just let the user type).

---

## Step 1: Understand the Context

### App context

This is a **teacher workspace** app for K-12 schools. The audience is teachers, school admins, and staff. Pages should feel:

- **Professional but warm** — not corporate-cold, not childish
- **Information-dense but scannable** — teachers are busy, surface key info fast
- **Consistent** — match the existing pages in the app

### Detect existing patterns

Before creating the page, scan the project for existing pages to match conventions:

1. Check `src/pages/` or `src/routes/` for existing page files
2. Read 1-2 existing pages to understand the layout pattern (max-width, padding, header style)
3. Note which components and patterns are already in use

---

## Step 2: Design Thinking

Before writing any code, think through the design intentionally. Each page should feel _designed_, not assembled from a template.

### 2a. Purpose & Structure

- **What problem does this page solve?** Who uses it, and when?
- **What data does it show?** Define TypeScript interfaces and mock data.
- **What actions can users take?** (create, filter, sort, edit, delete)
- **What's the information hierarchy?** What's the most important thing on the page? Design around that.
- **What states exist?** Empty state, loading, populated, filtered-no-results.

### 2b. Layout & Spatial Composition

Don't default to the same layout every time. Consider what fits the content:

- **List/table pages** (browsing many items): header + filter bar + data table
- **Builder/editor pages** (creating/editing one item): sidebar + main content area, or stepped flow
- **Dashboard pages** (overview): stats cards + charts + activity feed
- **Detail pages** (viewing one item): hero section + tabbed content

Use **intentional spatial composition**:

- Generous negative space where content needs breathing room
- Tighter spacing in dense data areas (tables, forms)
- Consider 2-column and 3-column layouts, not just single-column
- Break visual monotony — not every section needs to be a Card

### 2c. Typography & Visual Hierarchy

Use typography to create clear hierarchy, not just size differences:

- **Page titles**: `text-2xl font-semibold tracking-tight` — confident, not shouty
- **Section titles**: `text-base font-medium` or `text-lg font-semibold`
- **Body text**: `text-sm` is the default; `text-xs` for metadata and captions
- **Contrast**: Pair `text-foreground` (high emphasis) with `text-muted-foreground` (low emphasis) deliberately
- **Weight**: Use `font-medium` and `font-semibold` to create emphasis; avoid overusing bold

### 2d. Motion & Micro-interactions

Add subtle interactions where they add clarity, not decoration:

- Hover states on interactive rows and cards
- Focus rings on form inputs (Flow DS handles this via tokens)
- Transition on state changes (e.g., a field appearing when a type is selected)
- Use CSS transitions (`transition-colors`, `transition-opacity`) — keep them fast (150-200ms)
- Don't animate everything; one or two well-placed transitions per page is enough

### 2e. Empty States & Edge Cases

Design for the empty case first — it's often the first thing users see:

- Use a centered message with an icon and a call-to-action
- Make the empty state guide the user toward the primary action
- Consider filtered-no-results as a separate state from truly-empty

### Design Constraints

- **Use `@flow/core` components** — import everything from `@flow/core`, NOT from `@/components/ui/*`
- **Use Tailwind CSS utilities** for layout (flex, grid, spacing, typography)
- **Use Flow DS token colors** via Tailwind classes: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`
- **Use `lucide-react` for icons**
- **Typography**: Inter font (configured via Flow DS tokens)
- **Spacing**: Be generous but consistent — `px-6 py-8` for page padding, `gap-4` for card grids, `my-6` for section separators

### What NOT to do

- Do NOT import from `@/components/ui/*` — always use `@flow/core`
- Do NOT use custom colors or hex values — use Tailwind token classes
- Do NOT create new reusable components — compose `@flow/core` primitives directly
- Do NOT add external dependencies without asking
- Do NOT use generic AI aesthetics (gratuitous gradients, purple-on-white, excessive shadows, generic stock-photo layouts)
- Do NOT converge on the same layout for every page — let the content drive the structure

---

## Step 3: Implement

### File location

Create the page at `src/pages/<page-name>.tsx` (kebab-case filename).

### Import pattern

Use a single consolidated import from `@flow/core`:

```tsx
import {
  Button,
  Input,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Separator,
  // ... only what you need
} from '@flow/core'
```

### Component conventions

#### Page wrapper

```tsx
<div className="min-h-screen bg-background">
  <div className="mx-auto max-w-6xl px-6 py-8">{/* page content */}</div>
</div>
```

#### Page header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">Page Title</h1>
    <p className="text-sm text-muted-foreground">Brief description.</p>
  </div>
  <Button>
    <PlusIcon />
    Primary Action
  </Button>
</div>
<Separator className="my-6" />
```

#### Stats cards (optional)

```tsx
<div className="grid grid-cols-3 gap-4">
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>Metric Label</CardDescription>
      <CardTitle className="text-3xl">42</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">
        <Icon className="mr-1 inline size-3" />
        Context note
      </p>
    </CardContent>
  </Card>
</div>
```

#### Filter bar

```tsx
<div className="mt-6 flex items-center gap-3">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input placeholder="Search..." value={search} onChange={...} className="pl-9" />
  </div>
  <Select value={filter} onValueChange={setFilter}>
    <SelectTrigger className="w-[160px]">
      <SelectValue placeholder="Filter" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
    </SelectContent>
  </Select>
</div>
```

#### Data table

```tsx
<Card className="mt-4">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Column</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Card>
```

### Button variant mapping (Flow DS)

| Intent           | Variant                                |
| ---------------- | -------------------------------------- |
| Primary action   | `default` (or omit — it's the default) |
| Secondary action | `outline`                              |
| Subtle/tertiary  | `ghost`                                |
| Danger/delete    | `critical`                             |
| Neutral          | `neutral`                              |
| Text link style  | `link`                                 |

### Badge variant mapping (Flow DS)

| Intent           | Variant     |
| ---------------- | ----------- |
| Active/positive  | `default`   |
| Neutral/draft    | `secondary` |
| Error/critical   | `critical`  |
| Outline/inactive | `outline`   |

### Mock data

Create realistic mock data that fits the teacher workspace context:

- Use realistic names (Ms. Johnson, Mr. Patel, Dr. Williams)
- Use school-relevant labels (Year 6, Term 2, Homeroom 3B)
- Use Australian date format (`en-AU`) for date formatting
- Include 4-8 items — enough to show patterns, not so many it's noisy

---

## Step 4: Wire Up

After creating the page file:

1. **Update `App.tsx`** (or the router) to render the new page
2. **Build** to verify no errors: `bun run build`
3. **Inform the user** of the file path and how to access it

---

## Step 5: Iterate

After the initial implementation, the user may want refinements. Common requests:

- "Add a detail view / sheet / dialog"
- "Add dark mode toggle"
- "Make it responsive"
- "Add empty state"
- "Add sorting to the table"

Handle these by composing more `@flow/core` components. Refer to the component catalog at `${CLAUDE_SKILL_DIR}/../ds-tw:install/references/components.md` for available components and their APIs.

---

## Related Skills

- `/ds-tw:install` — Install Flow DS and set up the token bridge (run first if not set up)
- `/ds-tw:install full` — Install + migrate existing Shadcn components to @flow/core
