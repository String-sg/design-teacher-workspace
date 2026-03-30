// Flow DS components (primary subjects of this page)
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Grid,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@flow/core';
import { createFileRoute } from '@tanstack/react-router';
import {
  BoldIcon,
  ChevronRightIcon,
  CopyIcon,
  HeartIcon,
  ItalicIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  TrashIcon,
  UnderlineIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useSetBreadcrumbs } from '~/platform/hooks/use-breadcrumbs';
// Shadcn components for page chrome (prefixed to avoid naming conflicts)
import { ScrollArea as ShadcnScrollArea } from '~/shared/components/ui/scroll-area';
import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from '~/shared/components/ui/select';
import { cn } from '~/shared/lib/utils';

export const Route = createFileRoute('/ds/flow-components')({
  component: FlowComponentsPage,
});

// --- Nav sections ---

const NAV_SECTIONS = [
  {
    title: 'Buttons & Toggles',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'toggle-group', label: 'Toggle Group' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { id: 'card', label: 'Card' },
      { id: 'separator', label: 'Separator' },
      { id: 'grid', label: 'Grid' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { id: 'input', label: 'Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'label', label: 'Label' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio-group', label: 'Radio Group' },
      { id: 'select', label: 'Select' },
      { id: 'switch', label: 'Switch' },
      { id: 'slider', label: 'Slider' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { id: 'tabs', label: 'Tabs' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'pagination', label: 'Pagination' },
    ],
  },
  {
    title: 'Overlays',
    items: [
      { id: 'dialog', label: 'Dialog' },
      { id: 'alert-dialog', label: 'Alert Dialog' },
      { id: 'dropdown-menu', label: 'Dropdown Menu' },
      { id: 'popover', label: 'Popover' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'sheet', label: 'Sheet' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'badge', label: 'Badge' },
      { id: 'progress', label: 'Progress' },
      { id: 'skeleton', label: 'Skeleton' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { id: 'table', label: 'Table' },
      { id: 'avatar', label: 'Avatar' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'collapsible', label: 'Collapsible' },
    ],
  },
];

// --- Helpers ---

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ShowcaseRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// --- Component Sections ---

function ButtonSection({ theme = 'tw' }: { theme?: string }) {
  return (
    <Section id="button" title="Button">
      <div className="space-y-6">
        <ShowcaseRow label="Variants">
          <Button variant="default">Default</Button>
          {theme === 'flow' ? (
            <Button variant="accent">Accent</Button>
          ) : (
            <Button variant="neutral">Secondary</Button>
          )}
          <Button variant="critical">Critical</Button>
          <Button variant="outline">Outline</Button>
          {theme === 'flow' && <Button variant="neutral">Neutral</Button>}
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </ShowcaseRow>
        <ShowcaseRow label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <PlusIcon className="size-4" />
          </Button>
        </ShowcaseRow>
        <ShowcaseRow label="States">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </ShowcaseRow>
      </div>
    </Section>
  );
}

function ToggleSection() {
  return (
    <Section id="toggle" title="Toggle">
      <ShowcaseRow label="Variants">
        <Toggle aria-label="Toggle bold">
          <BoldIcon className="size-4" />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle italic">
          <ItalicIcon className="size-4" />
        </Toggle>
        <Toggle pressed aria-label="Toggle underline">
          <UnderlineIcon className="size-4" />
        </Toggle>
      </ShowcaseRow>
    </Section>
  );
}

function ToggleGroupSection() {
  return (
    <Section id="toggle-group" title="Toggle Group">
      <ShowcaseRow label="Single selection">
        <ToggleGroup type="single" defaultValue="bold">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseRow>
    </Section>
  );
}

function CardSection() {
  return (
    <Section id="card" title="Card">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Card content area with sample text.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <MailIcon className="size-4 text-muted-foreground" />
              <span className="text-sm">New message from Alex</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function SeparatorSection() {
  return (
    <Section id="separator" title="Separator">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm">Above</p>
          <Separator />
          <p className="mt-2 text-sm">Below</p>
        </div>
        <div className="flex h-8 items-center gap-4">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Right</span>
        </div>
      </div>
    </Section>
  );
}

function GridSection() {
  return (
    <Section id="grid" title="Grid">
      <Grid container>
        <Grid columns={4}>
          <div className="rounded-md bg-muted p-4 text-center text-sm">1</div>
        </Grid>
        <Grid columns={4}>
          <div className="rounded-md bg-muted p-4 text-center text-sm">2</div>
        </Grid>
        <Grid columns={4}>
          <div className="rounded-md bg-muted p-4 text-center text-sm">3</div>
        </Grid>
      </Grid>
    </Section>
  );
}

function InputSection() {
  return (
    <Section id="input" title="Input">
      <div className="max-w-sm space-y-4">
        <Input placeholder="Default input" />
        <Input placeholder="Disabled" disabled />
        <Input type="search" placeholder="Search..." />
        <Input placeholder="With icon" leading={<SearchIcon className="size-4" />} />
      </div>
    </Section>
  );
}

function TextareaSection() {
  return (
    <Section id="textarea" title="Textarea">
      <div className="max-w-sm">
        <Textarea placeholder="Type your message here..." />
      </div>
    </Section>
  );
}

function LabelSection() {
  return (
    <Section id="label" title="Label">
      <div className="max-w-sm space-y-2">
        <Label htmlFor="label-demo">Email address</Label>
        <Input id="label-demo" type="email" placeholder="you@example.com" />
      </div>
    </Section>
  );
}

function CheckboxSection() {
  return (
    <Section id="checkbox" title="Checkbox">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="cb1" />
          <Label htmlFor="cb1">Accept terms and conditions</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb2" defaultChecked />
          <Label htmlFor="cb2">Checked by default</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb3" disabled />
          <Label htmlFor="cb3">Disabled</Label>
        </div>
      </div>
    </Section>
  );
}

function RadioGroupSection() {
  return (
    <Section id="radio-group" title="Radio Group">
      <RadioGroup defaultValue="option-1">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-1" id="r1" />
          <Label htmlFor="r1">Option One</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-2" id="r2" />
          <Label htmlFor="r2">Option Two</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-3" id="r3" />
          <Label htmlFor="r3">Option Three</Label>
        </div>
      </RadioGroup>
    </Section>
  );
}

function SelectSection() {
  return (
    <Section id="select" title="Select">
      <div className="max-w-sm">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
            <SelectItem value="grape">Grape</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Section>
  );
}

function SwitchSection() {
  return (
    <Section id="switch" title="Switch">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Switch id="sw1" />
          <Label htmlFor="sw1">Airplane mode</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sw2" defaultChecked />
          <Label htmlFor="sw2">Notifications</Label>
        </div>
      </div>
    </Section>
  );
}

function SliderSection() {
  return (
    <Section id="slider" title="Slider">
      <div className="max-w-sm space-y-4">
        <Slider defaultValue={[50]} max={100} step={1} />
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>
    </Section>
  );
}

function TabsSection() {
  return (
    <Section id="tabs" title="Tabs">
      <Tabs defaultValue="account" className="max-w-md">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-3">
          <p className="text-sm text-muted-foreground">Manage your account settings.</p>
        </TabsContent>
        <TabsContent value="password" className="mt-3">
          <p className="text-sm text-muted-foreground">Change your password here.</p>
        </TabsContent>
        <TabsContent value="settings" className="mt-3">
          <p className="text-sm text-muted-foreground">Configure your preferences.</p>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

function BreadcrumbSection() {
  return (
    <Section id="breadcrumb" title="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  );
}

function PaginationSection() {
  return (
    <Section id="pagination" title="Pagination">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Section>
  );
}

function DialogSection() {
  return (
    <Section id="dialog" title="Dialog">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="dialog-name">Name</Label>
              <Input id="dialog-name" defaultValue="Jane Doe" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

function AlertDialogSection() {
  return (
    <Section id="alert-dialog" title="Alert Dialog">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="critical">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  );
}

function DropdownMenuSection() {
  return (
    <Section id="dropdown-menu" title="Dropdown Menu">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <SettingsIcon className="mr-2 size-4" />
            Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CopyIcon className="mr-2 size-4" /> Copy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon className="mr-2 size-4" /> Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <TrashIcon className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Section>
  );
}

function PopoverSection() {
  return (
    <Section id="popover" title="Popover">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Width</Label>
                <Input className="col-span-2" defaultValue="100%" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Height</Label>
                <Input className="col-span-2" defaultValue="25px" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Section>
  );
}

function TooltipSection() {
  return (
    <Section id="tooltip" title="Tooltip">
      <TooltipProvider>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <HeartIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to favorites</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <SearchIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </Section>
  );
}

function SheetSection() {
  return (
    <Section id="sheet" title="Sheet">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>This is a sheet panel that slides in from the side.</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Sheet content goes here.</p>
          </div>
        </SheetContent>
      </Sheet>
    </Section>
  );
}

function AlertSection() {
  return (
    <Section id="alert" title="Alert">
      <div className="space-y-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
        <Alert variant="critical">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      </div>
    </Section>
  );
}

function BadgeSection() {
  return (
    <Section id="badge" title="Badge">
      <ShowcaseRow label="Variants">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="critical">Critical</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="verified">Verified</Badge>
      </ShowcaseRow>
    </Section>
  );
}

function ProgressSection() {
  return (
    <Section id="progress" title="Progress">
      <div className="max-w-sm space-y-4">
        <Progress value={33} />
        <Progress value={66} />
        <Progress value={100} />
      </div>
    </Section>
  );
}

function SkeletonSection() {
  return (
    <Section id="skeleton" title="Skeleton">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </Section>
  );
}

function TableSection() {
  return (
    <Section id="table" title="Table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice Johnson</TableCell>
            <TableCell>
              <Badge variant="secondary">Active</Badge>
            </TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Smith</TableCell>
            <TableCell>
              <Badge variant="outline">Pending</Badge>
            </TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Carol Davis</TableCell>
            <TableCell>
              <Badge variant="critical">Overdue</Badge>
            </TableCell>
            <TableCell className="text-right">$350.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Section>
  );
}

function AvatarSection() {
  return (
    <Section id="avatar" title="Avatar">
      <ShowcaseRow label="With image and fallback">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      </ShowcaseRow>
    </Section>
  );
}

function AccordionSection() {
  return (
    <Section id="accordion" title="Accordion">
      <Accordion type="single" collapsible className="max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>Yes. It comes with default styles from Flow DS.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>Yes. It has smooth open/close transitions.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}

function CollapsibleSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section id="collapsible" title="Collapsible">
      <Collapsible open={open} onOpenChange={setOpen} className="max-w-md space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">3 items</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronRightIcon
                className={cn('size-4 transition-transform', open && 'rotate-90')}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">Item 1</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 text-sm">Item 2</div>
          <div className="rounded-md border px-4 py-2 text-sm">Item 3</div>
        </CollapsibleContent>
      </Collapsible>
    </Section>
  );
}

// --- Page ---

function FlowComponentsPage() {
  useSetBreadcrumbs([
    { label: 'Design System', href: '/ds' },
    { label: 'Flow Components', href: '/ds/flow-components' },
  ]);

  const [activeSection, setActiveSection] = useState('button');
  const [theme, setTheme] = useState<'tw' | 'flow'>('tw');

  return (
    <div className="flex h-full">
      {/* Left Nav */}
      <nav className="sticky top-0 h-[calc(100vh-3.5rem)] w-52 shrink-0 border-r border-border">
        <ShadcnScrollArea className="h-full">
          <div className="space-y-6 p-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          'block rounded-md px-2 py-1.5 text-sm transition-colors',
                          activeSection === item.id
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
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
        </ShadcnScrollArea>
      </nav>

      {/* Main Content */}
      <ShadcnScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl space-y-16 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Flow Components</h1>
              <p className="mt-1 text-muted-foreground">
                Interactive showcase of @flow/core components.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Label className="text-sm text-muted-foreground">Theme</Label>
              <ShadcnSelect value={theme} onValueChange={(v) => setTheme(v as 'tw' | 'flow')}>
                <ShadcnSelectTrigger className="w-40">
                  <ShadcnSelectValue />
                </ShadcnSelectTrigger>
                <ShadcnSelectContent>
                  <ShadcnSelectItem value="tw">TW Theme (Blue)</ShadcnSelectItem>
                  <ShadcnSelectItem value="flow">Flow Default (Indigo)</ShadcnSelectItem>
                </ShadcnSelectContent>
              </ShadcnSelect>
            </div>
          </div>

          <div className={cn(theme === 'flow' && 'flow-theme')}>
            {/* Buttons & Toggles */}
            <div className="space-y-16">
              <ButtonSection theme={theme} />
              <ToggleSection />
              <ToggleGroupSection />

              {/* Layout */}
              <CardSection />
              <SeparatorSection />
              <GridSection />

              {/* Forms */}
              <InputSection />
              <TextareaSection />
              <LabelSection />
              <CheckboxSection />
              <RadioGroupSection />
              <SelectSection />
              <SwitchSection />
              <SliderSection />

              {/* Navigation */}
              <TabsSection />
              <BreadcrumbSection />
              <PaginationSection />

              {/* Overlays */}
              <DialogSection />
              <AlertDialogSection />
              <DropdownMenuSection />
              <PopoverSection />
              <TooltipSection />
              <SheetSection />

              {/* Feedback */}
              <AlertSection />
              <BadgeSection />
              <ProgressSection />
              <SkeletonSection />

              {/* Data Display */}
              <TableSection />
              <AvatarSection />
              <AccordionSection />
              <CollapsibleSection />
            </div>
          </div>
        </div>
      </ShadcnScrollArea>
    </div>
  );
}
