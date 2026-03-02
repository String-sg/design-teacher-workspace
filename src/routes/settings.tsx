import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAuth } from '@/lib/auth'
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function SettingsPage() {
  const { user, updateUser } = useAuth()

  useSetBreadcrumbs([{ label: 'Settings', href: '/settings' }])

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  })

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    updateUser(form)
    toast.success('Account updated')
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account</p>
      </div>

      <div className="max-w-lg rounded-lg border bg-card p-6">
        <h2 className="mb-6 text-base font-semibold">Account</h2>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {getInitials(form.name || user.name)}
          </div>
          <div>
            <p className="font-medium">{form.name || user.name}</p>
            <p className="text-muted-foreground text-sm">{form.role || user.role}</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="e.g. Teacher"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}
