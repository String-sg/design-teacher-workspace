import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as React from 'react'

import { DirectEdit } from 'made-refine'
import appCss from '../styles.css?url'
import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { FeatureFlagProvider } from '@/lib/feature-flags'
import { BreadcrumbProvider } from '@/hooks/use-breadcrumbs'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('react-grab').then(() =>
    import('@react-grab/claude-code/client').then(({ attachAgent }) =>
      attachAgent(),
    ),
  )
}

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
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        {process.env.NODE_ENV === 'development' && <DirectEdit />}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider>
          <BreadcrumbProvider>
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
              <Toaster position="bottom-center" />
            </SidebarProvider>
          </BreadcrumbProvider>
        </FeatureFlagProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
