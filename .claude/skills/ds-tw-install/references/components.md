# Flow DS Component Catalog

All components are imported from `@flow/core`. They follow the same composition patterns as Shadcn UI.

## Layout

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@flow/core'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```
Shadcn equivalent: `Card`

### Grid
```tsx
import { Grid } from '@flow/core'

<Grid columns={3} gap="md">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</Grid>
```

### Separator
```tsx
import { Separator } from '@flow/core'

<Separator />
<Separator orientation="vertical" />
```
Shadcn equivalent: `Separator`

---

## Navigation

### Breadcrumb
```tsx
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator
} from '@flow/core'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```
Shadcn equivalent: `Breadcrumb`

### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@flow/core'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```
Shadcn equivalent: `Tabs`

### Pagination
```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis
} from '@flow/core'

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>
```
Shadcn equivalent: `Pagination`

---

## Data Display

### Table
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@flow/core'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
Shadcn equivalent: `Table`

### Badge
```tsx
import { Badge } from '@flow/core'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="critical">Critical</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="verified">Verified</Badge>
```
Shadcn equivalent: `Badge`

### Avatar
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@flow/core'

<Avatar>
  <AvatarImage src="/avatar.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```
Shadcn equivalent: `Avatar`

### Skeleton
```tsx
import { Skeleton } from '@flow/core'

<Skeleton className="h-4 w-[200px]" />
```
Shadcn equivalent: `Skeleton`

### Progress
```tsx
import { Progress } from '@flow/core'

<Progress value={60} />
```
Shadcn equivalent: `Progress`

---

## Inputs

### Button
```tsx
import { Button } from '@flow/core'

<Button>Default</Button>
<Button variant="accent">Accent</Button>
<Button variant="critical">Critical</Button>
<Button variant="outline">Outline</Button>
<Button variant="neutral">Neutral</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```
Shadcn equivalent: `Button`

### Input
```tsx
import { Input } from '@flow/core'

<Input placeholder="Type here..." />
<Input leading={<SearchIcon className="h-4 w-4" />} placeholder="Search..." />
```
Shadcn equivalent: `Input`

### Textarea
```tsx
import { Textarea } from '@flow/core'

<Textarea placeholder="Enter description..." />
```
Shadcn equivalent: `Textarea`

### Label
```tsx
import { Label } from '@flow/core'

<Label htmlFor="email">Email</Label>
```
Shadcn equivalent: `Label`

### Checkbox
```tsx
import { Checkbox } from '@flow/core'

<Checkbox id="terms" />
```
Shadcn equivalent: `Checkbox`

### RadioGroup
```tsx
import { RadioGroup, RadioGroupItem } from '@flow/core'

<RadioGroup defaultValue="option-1">
  <RadioGroupItem value="option-1" id="r1" />
  <RadioGroupItem value="option-2" id="r2" />
</RadioGroup>
```
Shadcn equivalent: `RadioGroup`

### Select
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@flow/core'

<Select>
  <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```
Shadcn equivalent: `Select`

### Slider
```tsx
import { Slider } from '@flow/core'

<Slider defaultValue={[50]} max={100} step={1} />
```
Shadcn equivalent: `Slider`

### Switch
```tsx
import { Switch } from '@flow/core'

<Switch id="airplane-mode" />
```
Shadcn equivalent: `Switch`

### Toggle / ToggleGroup
```tsx
import { Toggle, ToggleGroup, ToggleGroupItem } from '@flow/core'

<Toggle><BoldIcon className="h-4 w-4" /></Toggle>

<ToggleGroup type="multiple">
  <ToggleGroupItem value="bold"><BoldIcon className="h-4 w-4" /></ToggleGroupItem>
  <ToggleGroupItem value="italic"><ItalicIcon className="h-4 w-4" /></ToggleGroupItem>
</ToggleGroup>
```
Shadcn equivalent: `Toggle`

---

## Feedback & Overlays

### Alert
```tsx
import { Alert, AlertTitle, AlertDescription } from '@flow/core'

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Something happened.</AlertDescription>
</Alert>
```
Shadcn equivalent: `Alert`

### AlertDialog
```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from '@flow/core'

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="critical">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
Shadcn equivalent: `AlertDialog`

### Dialog
```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@flow/core'

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes here.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```
Shadcn equivalent: `Dialog`

### Sheet
```tsx
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription
} from '@flow/core'

<Sheet>
  <SheetTrigger asChild><Button>Open Sheet</Button></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Side Panel</SheetTitle>
      <SheetDescription>Details go here.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```
Shadcn equivalent: `Sheet`

### Popover
```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@flow/core'

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Info</Button></PopoverTrigger>
  <PopoverContent>Content here</PopoverContent>
</Popover>
```
Shadcn equivalent: `Popover`

### Tooltip
```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@flow/core'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="ghost">Hover me</Button></TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```
**Note**: Wrap your app root with `<TooltipProvider>` once.
Shadcn equivalent: `Tooltip`

### DropdownMenu
```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator
} from '@flow/core'

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Menu</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
Shadcn equivalent: `DropdownMenu`

---

## Disclosure

### Accordion
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@flow/core'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>
```
Shadcn equivalent: `Accordion`

### Collapsible
```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@flow/core'

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```
Shadcn equivalent: `Collapsible`
