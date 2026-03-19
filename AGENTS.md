# AGENTS.md

Instructions for all AI agents (Claude Code, Copilot, Cursor, etc.) working in this repository.

## Component Reuse Policy

**Do NOT create new components.** This is the single most important rule.

### Before writing any new component:

1. **Search first.** Run a search across `src/components/` for existing components that do what you need.
2. **Compose, don't create.** Combine existing primitives (Button, Input, Badge, Table, Dialog, Sheet, Tabs) to build what you need inline within a route or page file.
3. **Extend, don't duplicate.** If an existing component is close but not quite right, add a prop or variant to it rather than creating a parallel component.
4. **Justify creation.** If you absolutely must create a new component, explain in the PR description why no existing component could be adapted.

### Existing component inventory

#### UI Primitives (`src/components/ui/`)

Shadcn UI components built on Base UI (MUI). These are the building blocks for everything.

- Layout: `Card`, `Separator`, `Sheet`, `Dialog`, `AlertDialog`, `Tabs`, `Accordion`, `ScrollArea`
- Data: `Table`, `Badge`, `Avatar`, `Skeleton`, `Pagination`
- Forms: `Button`, `Input`, `InputGroup`, `Label`, `Select`, `Switch`, `Checkbox`, `Textarea`, `Combobox`, `Field`
- Navigation: `Breadcrumb`, `Sidebar`, `DropdownMenu`
- Feedback: `Popover`, `Tooltip`, `Alert`, `Sonner` (toast notifications)
- Utility: `ErrorBoundary`

Add new Shadcn components with `bunx shadcn@latest add <name>` — do NOT hand-write UI primitives.

#### Communication Components (`src/components/comms/`)

Shared across Announcements and Forms. Reuse these instead of building new selectors, editors, or status indicators.

- `EntitySelector` — generic multi-select picker (groups + individuals, search, chips)
- `StudentRecipientSelector` — student/class picker (wraps EntitySelector)
- `StaffSelector` — staff picker (wraps EntitySelector)
- `EnquiryEmailSelector` — email picker with validation
- `RichTextEditor` / `RichTextArea` — Tiptap rich text editor with toolbar
- `ReadRate` — progress bar with fraction label (e.g., "6 / 10")
- `StatusBadge` — status badge (Posted/Scheduled/Draft)
- `AnnouncementFilterBar` — filter popover for announcements list
- `PGShortcutsSelector` — PG app shortcut toggles
- `SendConfirmationSheet` — send/schedule confirmation dialog
- `RecipientReadTable` — per-recipient read/response tracking table
- `QuestionBuilder` — inline question builder (free-text, MCQ types)

#### Form Components (`src/components/forms/`)

- `FormResponseTable` — per-student response tracking with export
- `FormsFilterBar` — filter popover for forms list

#### App Components (`src/components/`)

- `EmptyState` — empty state with title and description
- `AppSidebar` — main sidebar navigation
- `AppHeader` — top header with breadcrumbs and user menu
- `FeedbackDialog` — user feedback submission dialog
- `AppCard` / `FeaturedAppCard` — app cards for the home page grid
- `AppSection` — section wrapper for the home page
- `DataCard` — metric display card
- `Greeting` — time-based greeting header
- `WelcomeModal` — first-visit welcome dialog
- `InsightBuddy` — AI insight assistant component

### Anti-patterns to avoid

- Creating a `NewButton.tsx` when `Button` from `src/components/ui/button` already exists
- Creating a `StudentPicker.tsx` when `StudentRecipientSelector` already wraps `EntitySelector`
- Creating a `StatusBadge.tsx` when `StatusBadge` from `src/components/comms/status-badge` already exists
- Creating a `FilterPopover.tsx` when `AnnouncementFilterBar` or `FormsFilterBar` already implement the pattern
- Creating a `ConfirmDialog.tsx` when `AlertDialog` or `SendConfirmationSheet` already exist
- Hand-writing a rich text editor when `RichTextEditor` is already built with Tiptap
- Creating a `ProgressBar.tsx` when `ReadRate` already renders a progress bar with fraction

### When it IS appropriate to create a new component

- A genuinely new UI pattern that doesn't exist anywhere in the codebase
- A domain-specific component that encapsulates complex business logic (e.g., a new chart type)
- Extracting repeated inline JSX from multiple routes into a shared component (consolidation, not creation)
