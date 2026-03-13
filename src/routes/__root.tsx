import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

import { DirectEdit } from 'made-refine'
import appCss from '../styles.css?url'
import { DraggableTanStackDevtools } from '@/components/draggable-tanstack-devtools'
import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { WelcomeModal } from '@/components/welcome-modal'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { FeatureFlagProvider } from '@/lib/feature-flags'
import { AuthProvider } from '@/lib/auth'
import { BreadcrumbProvider } from '@/hooks/use-breadcrumbs'
import { HeyTaliaPanel } from '@/components/heytalia/heytalia-panel'
import { HeyTaliaProvider } from '@/components/heytalia/heytalia-context'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'MOE Workspace Homepage',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <DraggableTanStackDevtools />
        )}
        {process.env.NODE_ENV === 'development' && <DirectEdit />}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const [queryClient] = React.useState(() => new QueryClient())
  const matches = useRouterState({ select: (s) => s.matches })
  const isGuestRoute = matches.some(
    (m) => m.routeId === '/_guest' || m.routeId === '/_allears',
  )
  const isGlowRoute = matches.some((m) =>
    (m as { pathname: string }).pathname?.startsWith('/glow/'),
  )

  if (isGuestRoute || isGlowRoute) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FeatureFlagProvider>
            <BreadcrumbProvider>
              <HeyTaliaProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset className="h-screen overflow-hidden">
                    <AppHeader />
                    <div
                      data-scroll-container
                      className="flex min-h-0 flex-1 flex-col overflow-auto bg-slate-1"
                    >
                      <ErrorBoundary>
                        <Outlet />
                      </ErrorBoundary>
                    </div>
                  </SidebarInset>
                  <HeyTaliaPanel />
                  <Toaster position="bottom-center" />
                  <WelcomeModal />
                </SidebarProvider>
              </HeyTaliaProvider>
            </BreadcrumbProvider>
          </FeatureFlagProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
