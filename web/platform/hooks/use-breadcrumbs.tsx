import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbContextValue {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const value = useMemo(() => ({ breadcrumbs, setBreadcrumbs }), [breadcrumbs]);

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context.breadcrumbs;
}

export function useSetBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useSetBreadcrumbs must be used within a BreadcrumbProvider');
  }

  const { setBreadcrumbs } = context;

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, JSON.stringify(breadcrumbs)]);
}
