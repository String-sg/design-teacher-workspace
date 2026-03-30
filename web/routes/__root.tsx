import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import '~/styles.css';
import '~/flow-ds-theme.css';
import { AppHeader } from '~/platform/components/app-header';
import { AppSidebar } from '~/platform/components/app-sidebar';
import { WelcomeModal } from '~/platform/components/welcome-modal';
import { ErrorBoundary } from '~/shared/components/ui/error-boundary';
import { SidebarInset, SidebarProvider } from '~/shared/components/ui/sidebar';
import { Toaster } from '~/shared/components/ui/sonner';
import { FeatureFlagProvider } from '~/platform/lib/feature-flags';
import { AuthProvider } from '~/platform/lib/auth';
import { BreadcrumbProvider } from '~/platform/hooks/use-breadcrumbs';
import { HeyTaliaPanel } from '~/apps/pg/components/heytalia/heytalia-panel';
import { HeyTaliaProvider } from '~/apps/pg/components/heytalia/heytalia-context';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [queryClient] = React.useState(() => new QueryClient());
  const matches = useRouterState({ select: (s) => s.matches });
  const isGuestRoute = matches.some((m) => m.routeId === '/_guest');
  const isGlowRoute = matches.some((m) =>
    (m as { pathname: string }).pathname?.startsWith('/glow/'),
  );

  if (isGuestRoute || isGlowRoute) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <FeatureFlagProvider>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </FeatureFlagProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
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
  );
}
