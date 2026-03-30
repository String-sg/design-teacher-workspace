import { createFileRoute, Link } from '@tanstack/react-router';
import { FlagIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useSetBreadcrumbs } from '~/platform/hooks/use-breadcrumbs';
import { useAuth } from '~/platform/lib/auth';
import { Button } from '~/shared/components/ui/button';
import { Input } from '~/shared/components/ui/input';
import { Label } from '~/shared/components/ui/label';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SettingsPage() {
  const { user, updateUser } = useAuth();

  useSetBreadcrumbs([{ label: 'Settings', href: '/settings' }]);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    updateUser(form);
    toast.success('Account updated');
  }

  return (
    <main className="mx-auto flex w-[640px] flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Account</h2>
        <div className="rounded-lg border bg-card p-6">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {(form.name || user.name).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{form.name || user.name}</p>
              <p className="text-sm text-muted-foreground">{form.role || user.role}</p>
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
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Developer</h2>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col items-start justify-start gap-4">
            <div>
              <p className="font-medium">Feature Flags</p>
              <p className="text-sm text-muted-foreground">
                Toggle experimental features and control app behavior
              </p>
            </div>
            <Button variant="outline" render={<Link to="/flags" />}>
              <FlagIcon className="mr-2 size-4" />
              Manage Flags
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
