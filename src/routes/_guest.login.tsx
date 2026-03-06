import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'

export const Route = createFileRoute('/_guest/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = React.useState('')
  const [singpassOpen, setSingpassOpen] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login()
    navigate({ to: '/' })
  }

  function handleSimulateScan() {
    setVerifying(true)
    setTimeout(() => {
      login()
      navigate({ to: '/' })
    }, 1500)
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

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* SingPass button */}
            <Button
              type="button"
              className="mt-4 w-full text-white"
              style={{ backgroundColor: '#F4333D' }}
              onClick={() => setSingpassOpen(true)}
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white" />
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white" />
                <rect x="14" y="14" width="3" height="3" fill="white" />
                <rect x="18" y="14" width="3" height="3" fill="white" />
                <rect x="14" y="18" width="3" height="3" fill="white" />
                <rect x="18" y="18" width="3" height="3" fill="white" />
              </svg>
              Login with SingPass
            </Button>
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

      {/* SingPass QR Dialog */}
      <Dialog open={singpassOpen} onOpenChange={setSingpassOpen}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">SingPass Login</DialogTitle>
          {/* Red SingPass header */}
          <div
            className="flex items-center justify-center gap-2 py-3"
            style={{ backgroundColor: '#F4333D' }}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
              <rect x="14" y="3" width="7" height="7" rx="1" fill="white" />
              <rect x="3" y="14" width="7" height="7" rx="1" fill="white" />
              <rect x="14" y="14" width="3" height="3" fill="white" />
              <rect x="18" y="14" width="3" height="3" fill="white" />
              <rect x="14" y="18" width="3" height="3" fill="white" />
              <rect x="18" y="18" width="3" height="3" fill="white" />
            </svg>
            <span className="text-sm font-bold tracking-wide text-white">
              Singpass
            </span>
          </div>

          <div className="flex flex-col items-center px-6 py-6">
            {verifying ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#F4333D]" />
                <p className="text-sm font-medium text-slate-700">
                  Verifying...
                </p>
              </div>
            ) : (
              <>
                {/* Static QR code pattern */}
                <div className="rounded-lg border-2 border-slate-200 p-2">
                  <svg
                    width="180"
                    height="180"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="crispEdges"
                  >
                    <rect width="21" height="21" fill="white" />
                    {/* Top-left finder */}
                    <rect x="0" y="0" width="7" height="1" fill="#1a1a1a" />
                    <rect x="0" y="6" width="7" height="1" fill="#1a1a1a" />
                    <rect x="0" y="0" width="1" height="7" fill="#1a1a1a" />
                    <rect x="6" y="0" width="1" height="7" fill="#1a1a1a" />
                    <rect x="2" y="2" width="3" height="3" fill="#1a1a1a" />
                    {/* Top-right finder */}
                    <rect x="14" y="0" width="7" height="1" fill="#1a1a1a" />
                    <rect x="14" y="6" width="7" height="1" fill="#1a1a1a" />
                    <rect x="14" y="0" width="1" height="7" fill="#1a1a1a" />
                    <rect x="20" y="0" width="1" height="7" fill="#1a1a1a" />
                    <rect x="16" y="2" width="3" height="3" fill="#1a1a1a" />
                    {/* Bottom-left finder */}
                    <rect x="0" y="14" width="7" height="1" fill="#1a1a1a" />
                    <rect x="0" y="20" width="7" height="1" fill="#1a1a1a" />
                    <rect x="0" y="14" width="1" height="7" fill="#1a1a1a" />
                    <rect x="6" y="14" width="1" height="7" fill="#1a1a1a" />
                    <rect x="2" y="16" width="3" height="3" fill="#1a1a1a" />
                    {/* Data modules */}
                    <rect x="8" y="0" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="0" width="1" height="1" fill="#1a1a1a" />
                    <rect x="12" y="0" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="2" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="3" width="1" height="1" fill="#1a1a1a" />
                    <rect x="11" y="2" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="4" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="4" width="1" height="1" fill="#1a1a1a" />
                    <rect x="12" y="4" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="6" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="6" width="1" height="1" fill="#1a1a1a" />
                    <rect x="0" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="2" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="4" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="12" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="14" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="16" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="18" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="20" y="8" width="1" height="1" fill="#1a1a1a" />
                    <rect x="1" y="9" width="1" height="1" fill="#1a1a1a" />
                    <rect x="3" y="9" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="9" width="1" height="1" fill="#1a1a1a" />
                    <rect x="11" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="15" y="9" width="1" height="1" fill="#1a1a1a" />
                    <rect x="17" y="9" width="1" height="1" fill="#1a1a1a" />
                    <rect x="19" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="0" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="2" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="4" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="14" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="16" y="10" width="1" height="1" fill="#1a1a1a" />
                    <rect x="1" y="11" width="1" height="1" fill="#1a1a1a" />
                    <rect x="5" y="11" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="11" width="1" height="1" fill="#1a1a1a" />
                    <rect x="13" y="11" width="1" height="1" fill="#1a1a1a" />
                    <rect x="0" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="2" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="4" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="6" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="12" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="15" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="17" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="19" y="12" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="14" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="14" width="1" height="1" fill="#1a1a1a" />
                    <rect x="12" y="14" width="1" height="1" fill="#1a1a1a" />
                    <rect x="14" y="14" width="1" height="1" fill="#1a1a1a" />
                    <rect x="16" y="15" width="1" height="1" fill="#1a1a1a" />
                    <rect x="18" y="15" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="16" width="1" height="1" fill="#1a1a1a" />
                    <rect x="11" y="16" width="1" height="1" fill="#1a1a1a" />
                    <rect x="15" y="16" width="1" height="1" fill="#1a1a1a" />
                    <rect x="19" y="16" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="18" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="18" width="1" height="1" fill="#1a1a1a" />
                    <rect x="14" y="18" width="1" height="1" fill="#1a1a1a" />
                    <rect x="16" y="18" width="1" height="1" fill="#1a1a1a" />
                    <rect x="20" y="18" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="19" width="1" height="1" fill="#1a1a1a" />
                    <rect x="15" y="19" width="1" height="1" fill="#1a1a1a" />
                    <rect x="17" y="19" width="1" height="1" fill="#1a1a1a" />
                    <rect x="8" y="20" width="1" height="1" fill="#1a1a1a" />
                    <rect x="10" y="20" width="1" height="1" fill="#1a1a1a" />
                    <rect x="12" y="20" width="1" height="1" fill="#1a1a1a" />
                    <rect x="14" y="20" width="1" height="1" fill="#1a1a1a" />
                    <rect x="18" y="20" width="1" height="1" fill="#1a1a1a" />
                    <rect x="20" y="20" width="1" height="1" fill="#1a1a1a" />
                  </svg>
                </div>

                <p className="mt-4 text-center text-sm text-slate-600">
                  Scan with Singpass app to log in
                </p>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="mt-2 text-sm font-medium text-[#F4333D] hover:underline"
                >
                  Click to simulate scan
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
