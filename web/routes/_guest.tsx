import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import * as React from 'react';

import { ErrorBoundary } from '~/shared/components/ui/error-boundary';
import { Toaster } from '~/shared/components/ui/sonner';

export const Route = createFileRoute('/_guest')({
  component: GuestLayout,
});

function GuestLayout() {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-white">
          <Outlet />
        </div>
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
