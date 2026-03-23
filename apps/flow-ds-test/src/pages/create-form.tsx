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

const fieldTypeConfig: Record<FieldType, { label: string; icon: typeof Type }> = {
  text: { label: "Text", icon: Type },
  multiple_choice: { label: "Multiple Choice", icon: ListChecks },
  checkbox: { label: "Checkbox", icon: CheckSquare },
  date: { label: "Date", icon: CalendarDays },
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
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {/* Preview header */}
          <div className="mb-6 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
              <ArrowLeft />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">Preview</h1>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                This is how recipients will see your form.
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Edit
            </Button>
            <Button>
              <Send className="size-4" />
              Publish
            </Button>
          </div>

          <Separator className="mb-8" />

          {/* Preview card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {title || "Untitled Form"}
              </CardTitle>
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label || "Untitled Question"}
                    {field.required && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </Label>
                  {field.type === "text" && (
                    <Input placeholder="Type your answer..." disabled />
                  )}
                  {field.type === "date" && (
                    <Input type="date" disabled />
                  )}
                  {field.type === "multiple_choice" && (
                    <div className="space-y-2">
                      {field.options?.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <input
                            type="radio"
                            name={field.id}
                            disabled
                            className="size-4 accent-primary"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {field.type === "checkbox" && (
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" disabled className="size-4 accent-primary" />
                      {field.label || "Untitled"}
                    </label>
                  )}
                </div>
              ))}
              {fields.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No questions added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">Create Form</h1>
            <p className="text-sm text-muted-foreground">
              Build a new form for parents, students, or staff.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="size-4" />
            Preview
          </Button>
          <Button>
            <Send className="size-4" />
            Publish
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Form details */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Title & Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Title</Label>
                  <Input
                    id="form-title"
                    placeholder="e.g. Parent Consent — Year 6 Camp"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-desc">Description</Label>
                  <Textarea
                    id="form-desc"
                    placeholder="Brief description of what this form is for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Questions</CardTitle>
                  <CardDescription>
                    {fields.length} {fields.length === 1 ? "question" : "questions"} added
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => {
                  const Icon = fieldTypeConfig[field.type].icon
                  return (
                    <div
                      key={field.id}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <GripVertical className="size-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                        <Badge variant="outline" className="gap-1">
                          <Icon className="size-3" />
                          {fieldTypeConfig[field.type].label}
                        </Badge>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
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
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder="Question label..."
                          value={field.label}
                          onChange={(e) =>
                            updateField(field.id, { label: e.target.value })
                          }
                        />

                        {field.type === "multiple_choice" && (
                          <div className="space-y-2 pl-4">
                            {field.options?.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="size-4 rounded-full border-2 border-muted-foreground" />
                                <Input
                                  className="h-8 flex-1"
                                  value={opt}
                                  onChange={(e) =>
                                    updateOption(field.id, i, e.target.value)
                                  }
                                />
                                {(field.options?.length || 0) > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
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
                              className="ml-6"
                              onClick={() => addOption(field.id)}
                            >
                              <Plus className="size-3" />
                              Add option
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {fields.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No questions yet. Add one from the sidebar.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={recipients} onValueChange={setRecipients}>
                  <SelectTrigger>
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
                <p className="text-xs text-muted-foreground">
                  Choose who will receive this form.
                </p>
              </CardContent>
            </Card>

            {/* Add Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Question</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {(Object.entries(fieldTypeConfig) as [FieldType, typeof fieldTypeConfig.text][]).map(
                  ([type, config]) => {
                    const Icon = config.icon
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        className="h-auto flex-col gap-1 py-3"
                        onClick={() => addField(type)}
                      >
                        <Icon className="size-4" />
                        <span className="text-xs">{config.label}</span>
                      </Button>
                    )
                  }
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="anon" className="text-sm">
                    Anonymous responses
                  </Label>
                  <Switch id="anon" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="multi" className="text-sm">
                    Allow multiple submissions
                  </Label>
                  <Switch id="multi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-sm">
                    Deadline
                  </Label>
                  <Input id="deadline" type="date" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
