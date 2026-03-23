import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Type,
  ListChecks,
  CheckSquare,
  CalendarDays,
  Eye,
  Send,
  FileText,
} from "lucide-react"
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Badge,
  Switch,
} from "@flow/core"

type FieldType = "text" | "multiple_choice" | "checkbox" | "date"

interface FormField {
  id: string
  type: FieldType
  label: string
  required: boolean
  options?: string[]
}

const fieldTypeConfig: Record<FieldType, { label: string; icon: typeof Type; description: string }> = {
  text: { label: "Text", icon: Type, description: "Short or long answer" },
  multiple_choice: { label: "Multiple Choice", icon: ListChecks, description: "Pick one option" },
  checkbox: { label: "Checkbox", icon: CheckSquare, description: "Yes or no" },
  date: { label: "Date", icon: CalendarDays, description: "Pick a date" },
}

let nextId = 1
function genId() {
  return `field-${nextId++}`
}

export default function CreateFormPage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [recipients, setRecipients] = useState("all_parents")
  const [fields, setFields] = useState<FormField[]>([
    { id: genId(), type: "text", label: "Full Name", required: true },
    {
      id: genId(),
      type: "multiple_choice",
      label: "Which day works best?",
      required: true,
      options: ["Monday", "Wednesday", "Friday"],
    },
  ])
  const [showPreview, setShowPreview] = useState(false)

  function addField(type: FieldType) {
    setFields([
      ...fields,
      {
        id: genId(),
        type,
        label: "",
        required: false,
        options: type === "multiple_choice" ? ["Option 1"] : undefined,
      },
    ])
  }

  function updateField(id: string, updates: Partial<FormField>) {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  function removeField(id: string) {
    setFields(fields.filter((f) => f.id !== id))
  }

  function addOption(fieldId: string) {
    setFields(
      fields.map((f) =>
        f.id === fieldId
          ? { ...f, options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`] }
          : f
      )
    )
  }

  function updateOption(fieldId: string, idx: number, value: string) {
    setFields(
      fields.map((f) =>
        f.id === fieldId
          ? { ...f, options: f.options?.map((o, i) => (i === idx ? value : o)) }
          : f
      )
    )
  }

  function removeOption(fieldId: string, idx: number) {
    setFields(
      fields.map((f) =>
        f.id === fieldId
          ? { ...f, options: f.options?.filter((_, i) => i !== idx) }
          : f
      )
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {/* Preview toolbar */}
          <div className="mb-8 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
              <ArrowLeft />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">Preview</h1>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                How recipients will see your form
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
              Back to Editor
            </Button>
            <Button size="sm">
              <Send className="size-3.5" />
              Publish
            </Button>
          </div>

          {/* Preview card — elevated to stand out from muted bg */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl leading-tight">
                {title || "Untitled Form"}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1.5">{description}</CardDescription>
              )}
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium">
                    <span className="mr-1 text-muted-foreground">{index + 1}.</span>
                    {field.label || "Untitled Question"}
                    {field.required && (
                      <span className="ml-0.5 text-destructive">*</span>
                    )}
                  </Label>
                  {field.type === "text" && (
                    <Input placeholder="Type your answer..." disabled className="bg-muted/30" />
                  )}
                  {field.type === "date" && (
                    <Input type="date" disabled className="bg-muted/30" />
                  )}
                  {field.type === "multiple_choice" && (
                    <div className="space-y-2.5 pt-1">
                      {field.options?.map((opt, i) => (
                        <label
                          key={i}
                          className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
                        >
                          <div className="size-4 shrink-0 rounded-full border-2 border-input" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {field.type === "checkbox" && (
                    <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-sm text-foreground">
                      <div className="size-4 shrink-0 rounded border-2 border-input" />
                      {field.label || "Untitled"}
                    </label>
                  )}
                </div>
              ))}
              {fields.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-12">
                  <FileText className="size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No questions added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header — compact toolbar style */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">Create Form</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="size-3.5" />
              Preview
            </Button>
            <Button size="sm">
              <Send className="size-3.5" />
              Publish
            </Button>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_280px] gap-8">
          {/* Main content */}
          <div className="space-y-6">
            {/* Title — inline, no card wrapper for lighter feel */}
            <div className="space-y-3">
              <Input
                placeholder="Form title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 border-0 border-b border-border bg-transparent px-0 text-xl font-semibold tracking-tight shadow-none placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0"
              />
              <Textarea
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="resize-none border-0 bg-transparent px-0 shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
              />
            </div>

            <Separator />

            {/* Questions */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {fields.length} {fields.length === 1 ? "question" : "questions"}
                </p>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const Icon = fieldTypeConfig[field.type].icon
                  return (
                    <div
                      key={field.id}
                      className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <GripVertical className="size-4 cursor-grab text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                        <span className="flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Icon className="size-3" />
                          {fieldTypeConfig[field.type].label}
                        </Badge>
                        <div className="flex-1" />
                        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <Label
                            htmlFor={`req-${field.id}`}
                            className="text-xs text-muted-foreground"
                          >
                            Required
                          </Label>
                          <Switch
                            id={`req-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(checked: boolean) =>
                              updateField(field.id, { required: checked })
                            }
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <Input
                        placeholder="Question label..."
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, { label: e.target.value })
                        }
                        className="font-medium"
                      />

                      {field.type === "multiple_choice" && (
                        <div className="mt-3 space-y-2 pl-1">
                          {field.options?.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="size-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                              <Input
                                className="h-8 flex-1 text-sm"
                                value={opt}
                                onChange={(e) =>
                                  updateOption(field.id, i, e.target.value)
                                }
                              />
                              {(field.options?.length || 0) > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                  onClick={() => removeOption(field.id, i)}
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-5 text-xs"
                            onClick={() => addOption(field.id)}
                          >
                            <Plus className="size-3" />
                            Add option
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}

                {fields.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <FileText className="size-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">No questions yet</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Add your first question from the panel on the right.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar — sticky */}
          <div className="space-y-4">
            <div className="sticky top-8 space-y-4">
              {/* Add Question */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Add Question
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.entries(fieldTypeConfig) as [FieldType, typeof fieldTypeConfig.text][]).map(
                    ([type, config]) => {
                      const Icon = config.icon
                      return (
                        <button
                          key={type}
                          className="flex flex-col items-center gap-1 rounded-md border border-border bg-card px-2 py-2.5 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
                          onClick={() => addField(type)}
                        >
                          <Icon className="size-4" />
                          <span className="text-[11px] font-medium leading-tight">{config.label}</span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              <Separator />

              {/* Recipients */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Recipients
                </p>
                <Select value={recipients} onValueChange={setRecipients}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_parents">All Parents</SelectItem>
                    <SelectItem value="year_6">Year 6 Parents</SelectItem>
                    <SelectItem value="year_5">Year 5 Parents</SelectItem>
                    <SelectItem value="staff">All Staff</SelectItem>
                    <SelectItem value="students">All Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Settings */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Settings
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anon" className="text-sm">
                      Anonymous
                    </Label>
                    <Switch id="anon" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi" className="text-sm">
                      Multiple submissions
                    </Label>
                    <Switch id="multi" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="deadline" className="text-sm">
                      Deadline
                    </Label>
                    <Input id="deadline" type="date" className="h-9 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
