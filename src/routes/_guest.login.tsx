import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'

export const Route = createFileRoute('/_guest/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login()
    navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-medium text-slate-700">Sign in</span>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => navigate({ to: '/' })}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-16 px-8">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl border bg-white p-8 shadow-none">
            <h1 className="text-xl font-semibold text-slate-900">
              Sign in to Teacher Workspace
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your @schools.gov.sg email to receive a one-time password.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <Input
                type="email"
                placeholder="e.g. name@schools.gov.sg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </div>
        </div>

        <div className="hidden lg:block">
          <img
            src="/teacher-illustration.png"
            alt="Teacher illustration"
            className="h-auto w-80 object-contain"
          />
        </div>
      </div>
    </div>
  )
}
