import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  BoldIcon,
  ChevronDownIcon,
  CopyIcon,
  GridIcon,
  HeartIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  TableIcon,
  TrashIcon,
  UserIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const Route = createFileRoute('/design-system')({
  component: DesignSystemPage,
})

// --- Nav sections ---

const NAV_SECTIONS = [
  {
    title: 'Tokens',
    items: [
      { id: 'colors', label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'radius', label: 'Border Radius' },
      { id: 'shadows', label: 'Shadows' },
    ],
  },
  {
    title: 'Components',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'badge', label: 'Badge' },
      { id: 'card', label: 'Card' },
      { id: 'input', label: 'Input' },
      { id: 'select', label: 'Select' },
      { id: 'checkbox-switch', label: 'Checkbox & Switch' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'alert-dialog', label: 'Alert Dialog' },
      { id: 'dropdown-menu', label: 'Dropdown Menu' },
      { id: 'avatar', label: 'Avatar' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'alert', label: 'Alert' },
      { id: 'popover', label: 'Popover' },
      { id: 'table', label: 'Table' },
      { id: 'separator', label: 'Separator' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'sheet', label: 'Sheet' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
    ],
  },
]

// --- Helpers ---

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </section>
  )
}

function Swatch({
  name,
  cssVar,
  className,
}: {
  name: string
  cssVar?: string
  className?: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-12">
      <div
        className={cn(
          'size-12 rounded-lg border border-border shrink-0',
          className,
        )}
        style={cssVar ? { backgroundColor: `var(${cssVar})` } : undefined}
      />
      <span className="text-xs text-muted-foreground text-center leading-tight break-words w-full">
        {name}
      </span>
    </div>
  )
}

function ColorScale({
  name,
  prefix,
  steps,
}: {
  name: string
  prefix: string
  steps: number[]
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium capitalize">{name}</h4>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <Swatch
            key={step}
            name={`${step}`}
            cssVar={`--${prefix}-${step}`}
          />
        ))}
      </div>
    </div>
  )
}

function ShowcaseRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

// --- Page ---

function DesignSystemPage() {
  useSetBreadcrumbs([{ label: 'Design System', href: '/design-system' }])

  const [activeSection, setActiveSection] = useState('colors')

  return (
    <div className="flex h-full">
      {/* Left Nav */}
      <nav className="w-52 shrink-0 border-r border-border sticky top-0 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="p-4 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        'block px-2 py-1.5 text-sm rounded-md transition-colors',
                        activeSection === item.id
                          ? 'bg-muted text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-8 space-y-16">
          <div>
            <h1 className="text-2xl font-bold">Design System</h1>
            <p className="text-muted-foreground mt-1">
              Tokens and component reference for the MOE Teacher Workspace.
            </p>
          </div>

          {/* ===== TOKENS ===== */}

          <ColorsSection />
          <TypographySection />
          <SpacingSection />
          <RadiusSection />
          <ShadowsSection />

          {/* ===== COMPONENTS ===== */}

          <ButtonSection />
          <BadgeSection />
          <CardSection />
          <InputSection />
          <SelectSection />
          <CheckboxSwitchSection />
          <TabsSection />
          <DialogSection />
          <AlertDialogSection />
          <DropdownMenuSection />
          <AvatarSection />
          <TooltipSection />
          <AlertSection />
          <PopoverSection />
          <TableSection />
          <SeparatorSection />
          <SkeletonSection />
          <AccordionSection />
          <SheetSection />
          <BreadcrumbSection />
        </div>
      </ScrollArea>
    </div>
  )
}

// ============================================================
// TOKEN SECTIONS
// ============================================================

type ColorEntry = { name: string; cssVar: string }

const SEMANTIC_COLORS: ColorEntry[] = [
  { name: 'background', cssVar: '--background' },
  { name: 'foreground', cssVar: '--foreground' },
  { name: 'primary', cssVar: '--primary' },
  { name: 'primary-fg', cssVar: '--primary-foreground' },
  { name: 'secondary', cssVar: '--secondary' },
  { name: 'muted', cssVar: '--muted' },
  { name: 'muted-fg', cssVar: '--muted-foreground' },
  { name: 'accent', cssVar: '--accent' },
  { name: 'destructive', cssVar: '--destructive' },
  { name: 'border', cssVar: '--border' },
  { name: 'ring', cssVar: '--ring' },
  { name: 'card', cssVar: '--card' },
  { name: 'popover', cssVar: '--popover' },
]

const CHART_COLORS: ColorEntry[] = [1, 2, 3, 4, 5].map((n) => ({
  name: `chart-${n}`,
  cssVar: `--chart-${n}`,
}))

const SIDEBAR_COLORS: ColorEntry[] = [
  { name: 'sidebar', cssVar: '--sidebar' },
  { name: 'sidebar-fg', cssVar: '--sidebar-foreground' },
  { name: 'sidebar-primary', cssVar: '--sidebar-primary' },
  { name: 'sidebar-accent', cssVar: '--sidebar-accent' },
  { name: 'sidebar-border', cssVar: '--sidebar-border' },
]

const SCALE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const COLOR_SCALES = [
  { name: 'TWBlue', prefix: 'twblue' },
  { name: 'Slate', prefix: 'slate' },
  { name: 'Crimson', prefix: 'crimson' },
  { name: 'Orange', prefix: 'orange' },
  { name: 'Lime', prefix: 'lime' },
  { name: 'Amber', prefix: 'amber' },
]

function ColorSwatchList({ colors }: { colors: ColorEntry[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <Swatch key={c.cssVar} name={c.name} cssVar={c.cssVar} />
      ))}
    </div>
  )
}

function ColorTableList({ colors }: { colors: ColorEntry[] }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12" />
            <TableHead>Name</TableHead>
            <TableHead>CSS Variable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((c) => (
            <TableRow key={c.cssVar}>
              <TableCell>
                <div
                  className="size-6 rounded border border-border"
                  style={{ backgroundColor: `var(${c.cssVar})` }}
                />
              </TableCell>
              <TableCell className="font-medium text-sm">{c.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                var({c.cssVar})
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ColorScaleTable({
  name,
  prefix,
  steps,
}: {
  name: string
  prefix: string
  steps: number[]
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{name}</h4>
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Step</TableHead>
              <TableHead>CSS Variable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step) => (
              <TableRow key={step}>
                <TableCell>
                  <div
                    className="size-6 rounded border border-border"
                    style={{ backgroundColor: `var(--${prefix}-${step})` }}
                  />
                </TableCell>
                <TableCell className="font-medium text-sm">{step}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  var(--{prefix}-{step})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ColorsSection() {
  const [view, setView] = useState<'swatch' | 'table'>('swatch')

  return (
    <Section id="colors" title="Colors">
      <div className="space-y-8">
        <div className="flex gap-1 p-0.5 bg-muted rounded-lg w-fit">
          <Button
            size="xs"
            variant={view === 'swatch' ? 'outline' : 'ghost'}
            onClick={() => setView('swatch')}
          >
            <GridIcon data-icon="inline-start" />
            Swatches
          </Button>
          <Button
            size="xs"
            variant={view === 'table' ? 'outline' : 'ghost'}
            onClick={() => setView('table')}
          >
            <TableIcon data-icon="inline-start" />
            Table
          </Button>
        </div>

        {/* Semantic */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Semantic</h4>
          {view === 'swatch' ? (
            <ColorSwatchList colors={SEMANTIC_COLORS} />
          ) : (
            <ColorTableList colors={SEMANTIC_COLORS} />
          )}
        </div>

        {/* Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Chart</h4>
          {view === 'swatch' ? (
            <ColorSwatchList colors={CHART_COLORS} />
          ) : (
            <ColorTableList colors={CHART_COLORS} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sidebar</h4>
          {view === 'swatch' ? (
            <ColorSwatchList colors={SIDEBAR_COLORS} />
          ) : (
            <ColorTableList colors={SIDEBAR_COLORS} />
          )}
        </div>

        {/* Scales */}
        {COLOR_SCALES.map((scale) =>
          view === 'swatch' ? (
            <ColorScale
              key={scale.prefix}
              name={scale.name}
              prefix={scale.prefix}
              steps={SCALE_STEPS}
            />
          ) : (
            <ColorScaleTable
              key={scale.prefix}
              name={scale.name}
              prefix={scale.prefix}
              steps={SCALE_STEPS}
            />
          ),
        )}
      </div>
    </Section>
  )
}

function TypographySection() {
  const sizes = [
    { name: 'xs', class: 'text-xs' },
    { name: 'sm', class: 'text-sm' },
    { name: 'base', class: 'text-base' },
    { name: 'lg', class: 'text-lg' },
    { name: 'xl', class: 'text-xl' },
    { name: '2xl', class: 'text-2xl' },
    { name: '3xl', class: 'text-3xl' },
    { name: '4xl', class: 'text-4xl' },
  ]

  const weights = [
    { name: 'normal (400)', class: 'font-normal' },
    { name: 'medium (500)', class: 'font-medium' },
    { name: 'semibold (600)', class: 'font-semibold' },
    { name: 'bold (700)', class: 'font-bold' },
  ]

  return (
    <Section id="typography" title="Typography">
      <div className="space-y-8">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Font Family</h4>
          <p className="font-sans text-lg">Inter Variable</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Size Scale</h4>
          <div className="space-y-3">
            {sizes.map((s) => (
              <div key={s.name} className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-12 shrink-0">
                  {s.name}
                </span>
                <span className={s.class}>
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Weights</h4>
          <div className="space-y-3">
            {weights.map((w) => (
              <div key={w.name} className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-28 shrink-0">
                  {w.name}
                </span>
                <span className={cn('text-lg', w.class)}>
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

function SpacingSection() {
  const spacings = [
    { name: '0.5', value: '0.125rem' },
    { name: '1', value: '0.25rem' },
    { name: '1.5', value: '0.375rem' },
    { name: '2', value: '0.5rem' },
    { name: '3', value: '0.75rem' },
    { name: '4', value: '1rem' },
    { name: '5', value: '1.25rem' },
    { name: '6', value: '1.5rem' },
    { name: '8', value: '2rem' },
    { name: '10', value: '2.5rem' },
    { name: '12', value: '3rem' },
    { name: '16', value: '4rem' },
    { name: '20', value: '5rem' },
    { name: '24', value: '6rem' },
  ]

  return (
    <Section id="spacing" title="Spacing">
      <div className="space-y-2">
        {spacings.map((s) => (
          <div key={s.name} className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-8 shrink-0 text-right">
              {s.name}
            </span>
            <div
              className="h-4 bg-primary/60 rounded-sm"
              style={{ width: s.value }}
            />
            <span className="text-xs text-muted-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function RadiusSection() {
  const radii = [
    { name: 'sm', class: 'rounded-sm' },
    { name: 'md', class: 'rounded-md' },
    { name: 'lg', class: 'rounded-lg' },
    { name: 'xl', class: 'rounded-xl' },
    { name: '2xl', class: 'rounded-2xl' },
    { name: '3xl', class: 'rounded-3xl' },
    { name: '4xl', class: 'rounded-4xl' },
    { name: 'full', class: 'rounded-full' },
  ]

  return (
    <Section id="radius" title="Border Radius">
      <div className="flex flex-wrap gap-4">
        {radii.map((r) => (
          <div key={r.name} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'size-16 border-2 border-primary bg-primary/10',
                r.class,
              )}
            />
            <span className="text-xs text-muted-foreground">{r.name}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function ShadowsSection() {
  const shadows = [
    { name: 'xs', class: 'shadow-xs' },
    { name: 'sm', class: 'shadow-sm' },
    { name: 'md', class: 'shadow-md' },
    { name: 'lg', class: 'shadow-lg' },
    { name: 'xl', class: 'shadow-xl' },
    { name: '2xl', class: 'shadow-2xl' },
  ]

  return (
    <Section id="shadows" title="Shadows">
      <div className="flex flex-wrap gap-6">
        {shadows.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'size-20 rounded-xl bg-card border border-border',
                s.class,
              )}
            />
            <span className="text-xs text-muted-foreground">{s.name}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ============================================================
// COMPONENT SECTIONS
// ============================================================

function ButtonSection() {
  const variants = [
    'default',
    'outline',
    'secondary',
    'ghost',
    'destructive',
    'link',
  ] as const
  const sizes = ['xs', 'sm', 'default', 'lg'] as const

  return (
    <Section id="button" title="Button">
      <div className="space-y-6">
        <ShowcaseRow label="Variants">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </ShowcaseRow>

        <ShowcaseRow label="Sizes">
          {sizes.map((s) => (
            <Button key={s} size={s} variant="outline">
              {s}
            </Button>
          ))}
        </ShowcaseRow>

        <ShowcaseRow label="Icon sizes">
          <Button size="icon-xs" variant="outline">
            <PlusIcon />
          </Button>
          <Button size="icon-sm" variant="outline">
            <PlusIcon />
          </Button>
          <Button size="icon" variant="outline">
            <PlusIcon />
          </Button>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </ShowcaseRow>

        <ShowcaseRow label="With icons">
          <Button variant="outline">
            <MailIcon data-icon="inline-start" />
            Email
          </Button>
          <Button>
            Save
            <ShareIcon data-icon="inline-end" />
          </Button>
        </ShowcaseRow>

        <ShowcaseRow label="Disabled">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </ShowcaseRow>
      </div>
    </Section>
  )
}

function BadgeSection() {
  const variants = [
    'default',
    'secondary',
    'destructive',
    'outline',
  ] as const

  return (
    <Section id="badge" title="Badge">
      <ShowcaseRow label="Variants">
        {variants.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </ShowcaseRow>
    </Section>
  )
}

function CardSection() {
  return (
    <Section id="card" title="Card">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Default Card</CardTitle>
            <CardDescription>
              Card with default size and padding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm" className="ml-auto">
              Save
            </Button>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Small Card</CardTitle>
            <CardDescription>
              Compact card with size=&quot;sm&quot;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Smaller padding and gaps.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </div>
    </Section>
  )
}

function InputSection() {
  return (
    <Section id="input" title="Input">
      <div className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <Label>Default Input</Label>
          <Input placeholder="Enter text..." />
        </div>

        <div className="space-y-2">
          <Label>With InputGroup</Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <SearchIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label>Disabled</Label>
          <Input placeholder="Disabled input" disabled />
        </div>
      </div>
    </Section>
  )
}

function SelectSection() {
  return (
    <Section id="select" title="Select">
      <div className="max-w-xs space-y-4">
        <div className="space-y-2">
          <Label>Default Select</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="opt1">Option 1</SelectItem>
              <SelectItem value="opt2">Option 2</SelectItem>
              <SelectItem value="opt3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Section>
  )
}

function CheckboxSwitchSection() {
  return (
    <Section id="checkbox-switch" title="Checkbox & Switch">
      <div className="space-y-6">
        <ShowcaseRow label="Checkbox">
          <div className="flex items-center gap-2">
            <Checkbox id="cb1" />
            <Label htmlFor="cb1">Unchecked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb2" defaultChecked />
            <Label htmlFor="cb2">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb3" indeterminate />
            <Label htmlFor="cb3">Indeterminate</Label>
          </div>
        </ShowcaseRow>

        <ShowcaseRow label="Switch">
          <div className="flex items-center gap-2">
            <Switch id="sw1" />
            <Label htmlFor="sw1">Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw2" defaultChecked />
            <Label htmlFor="sw2">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw3" size="sm" />
            <Label htmlFor="sw3">Small</Label>
          </div>
        </ShowcaseRow>
      </div>
    </Section>
  )
}

function TabsSection() {
  return (
    <Section id="tabs" title="Tabs">
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Default variant
          </p>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Account</TabsTrigger>
              <TabsTrigger value="tab2">Security</TabsTrigger>
              <TabsTrigger value="tab3">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4 text-sm">
              Account settings content.
            </TabsContent>
            <TabsContent value="tab2" className="p-4 text-sm">
              Security settings content.
            </TabsContent>
            <TabsContent value="tab3" className="p-4 text-sm">
              Notification preferences content.
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Line variant
          </p>
          <Tabs defaultValue="tab1">
            <TabsList variant="line">
              <TabsTrigger value="tab1">Overview</TabsTrigger>
              <TabsTrigger value="tab2">Analytics</TabsTrigger>
              <TabsTrigger value="tab3">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4 text-sm">
              Overview content.
            </TabsContent>
            <TabsContent value="tab2" className="p-4 text-sm">
              Analytics content.
            </TabsContent>
            <TabsContent value="tab3" className="p-4 text-sm">
              Reports content.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Section>
  )
}

function DialogSection() {
  return (
    <Section id="dialog" title="Dialog">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a dialog description. It provides context about the
              dialog&apos;s purpose.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm">Dialog body content goes here.</div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  )
}

function AlertDialogSection() {
  return (
    <Section id="alert-dialog" title="Alert Dialog">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          Delete Item
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  )
}

function DropdownMenuSection() {
  return (
    <Section id="dropdown-menu" title="Dropdown Menu">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open Menu
          <ChevronDownIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ShareIcon />
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <CopyIcon />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MailIcon />
                Email
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Section>
  )
}

function AvatarSection() {
  return (
    <Section id="avatar" title="Avatar">
      <div className="space-y-6">
        <ShowcaseRow label="Sizes">
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </ShowcaseRow>

        <ShowcaseRow label="With image">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=JD" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=AB" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </ShowcaseRow>

        <ShowcaseRow label="Avatar Group">
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </ShowcaseRow>
      </div>
    </Section>
  )
}

function TooltipSection() {
  return (
    <Section id="tooltip" title="Tooltip">
      <TooltipProvider>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover me (top)
            </TooltipTrigger>
            <TooltipContent side="top">Tooltip on top</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover me (bottom)
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Tooltip on bottom
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover me (right)
            </TooltipTrigger>
            <TooltipContent side="right">
              Tooltip on right
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </Section>
  )
}

function AlertSection() {
  return (
    <Section id="alert" title="Alert">
      <div className="space-y-4 max-w-lg">
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            This is an informational alert with the default styling.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    </Section>
  )
}

function PopoverSection() {
  return (
    <Section id="popover" title="Popover">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover Title</PopoverTitle>
            <PopoverDescription>
              This is some popover content with a title and description.
            </PopoverDescription>
          </PopoverHeader>
          <div className="pt-2">
            <Input placeholder="Enter something..." />
          </div>
        </PopoverContent>
      </Popover>
    </Section>
  )
}

function TableSection() {
  const data = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  ]

  return (
    <Section id="table" title="Table">
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.email}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.role}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  )
}

function SeparatorSection() {
  return (
    <Section id="separator" title="Separator">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Horizontal</p>
          <Separator />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Vertical</p>
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </div>
      </div>
    </Section>
  )
}

function SkeletonSection() {
  return (
    <Section id="skeleton" title="Skeleton">
      <div className="space-y-4 max-w-sm">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </Section>
  )
}

function AccordionSection() {
  return (
    <Section id="accordion" title="Accordion">
      <div className="max-w-lg">
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is this design system?</AccordionTrigger>
            <AccordionContent>
              A reference of all design tokens and UI components used in the MOE
              Teacher Workspace application.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What UI library is used?</AccordionTrigger>
            <AccordionContent>
              Components are built with Shadcn UI using Base UI (MUI)
              primitives, styled with Tailwind CSS v4.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I add new components?</AccordionTrigger>
            <AccordionContent>
              Run{' '}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                bunx shadcn@latest add &lt;component-name&gt;
              </code>{' '}
              to add new Shadcn components.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  )
}

function SheetSection() {
  return (
    <Section id="sheet" title="Sheet">
      <div className="flex gap-3">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open Right Sheet
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>
                This is a sheet panel that slides in from the right.
              </SheetDescription>
            </SheetHeader>
            <div className="p-4 text-sm">Sheet body content goes here.</div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open Left Sheet
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Left Sheet</SheetTitle>
              <SheetDescription>Slides in from the left.</SheetDescription>
            </SheetHeader>
            <div className="p-4 text-sm">Content here.</div>
          </SheetContent>
        </Sheet>
      </div>
    </Section>
  )
}

function BreadcrumbSection() {
  return (
    <Section id="breadcrumb" title="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/students">Students</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Student Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  )
}
