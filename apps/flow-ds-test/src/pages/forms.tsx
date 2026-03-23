import { useState } from "react"
import { Plus, Search, MoreHorizontal, FileText, Users, TrendingUp, ArrowUpDown, ClipboardList } from "lucide-react"
import {
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@flow/core"

interface Form {
  id: string
  title: string
  status: "active" | "draft" | "closed"
  responses: number
  createdAt: string
  assignedTo: string
}

const forms: Form[] = [
  {
    id: "1",
    title: "Parent Consent — Year 6 Camp",
    status: "active",
    responses: 47,
    createdAt: "2026-03-15",
    assignedTo: "Ms. Johnson",
  },
  {
    id: "2",
    title: "Student Wellbeing Check-in",
    status: "active",
    responses: 132,
    createdAt: "2026-03-10",
    assignedTo: "Mr. Patel",
  },
  {
    id: "3",
    title: "End of Term Feedback",
    status: "draft",
    responses: 0,
    createdAt: "2026-03-20",
    assignedTo: "Ms. Chen",
  },
  {
    id: "4",
    title: "Uniform Order Form",
    status: "closed",
    responses: 215,
    createdAt: "2026-02-01",
    assignedTo: "Admin Office",
  },
  {
    id: "5",
    title: "Excursion Permission — Science Museum",
    status: "active",
    responses: 28,
    createdAt: "2026-03-18",
    assignedTo: "Dr. Williams",
  },
  {
    id: "6",
    title: "After School Activities Registration",
    status: "draft",
    responses: 0,
    createdAt: "2026-03-22",
    assignedTo: "Ms. Thompson",
  },
]

const statusVariant: Record<Form["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  closed: "outline",
}

export default function FormsPage({ onCreateForm }: { onCreateForm?: () => void }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || form.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: forms.length,
    active: forms.filter((f) => f.status === "active").length,
    totalResponses: forms.reduce((sum, f) => sum + f.responses, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage forms for parents, students, and staff.
            </p>
          </div>
          <Button onClick={onCreateForm}>
            <Plus />
            New Form
          </Button>
        </div>

        {/* Stats — using a lighter treatment, no heavy Cards */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total forms</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{stats.totalResponses}</p>
              <p className="text-xs text-muted-foreground">Total responses</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" className="-ml-3 h-8">
                    Form Title
                    <ArrowUpDown />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Responses</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((form) => (
                <TableRow
                  key={form.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[form.status]} className="capitalize">
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {form.responses}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {form.assignedTo}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(form.createdAt).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="size-8 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No forms found
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
