import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { Button } from '~/shared/components/ui/button';

export const Route = createFileRoute('/forms')({
  component: FormsLayout,
});

function FormsLayout() {
  const location = useLocation();
  const isSubPage =
    location.pathname.startsWith('/forms/new') ||
    (location.pathname.startsWith('/forms/') &&
      location.pathname !== '/forms/' &&
      location.pathname !== '/forms');

  if (isSubPage) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col">
      <div className="border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Forms</h1>
          <Button size="sm" render={<Link to="/forms/new" />}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create
          </Button>
        </div>
        <p className="mt-1 hidden text-sm text-muted-foreground md:block">
          Create custom forms to collect data from parents.
        </p>
      </div>
      <Outlet />
    </div>
  );
}
