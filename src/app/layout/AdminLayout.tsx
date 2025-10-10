import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbHandle } from '@/types/router';
import { Link, Outlet, useMatches } from 'react-router-dom';

export default function AdminLayout() {
  const matches = useMatches();

  const crumbs = matches
    .filter((m) => (m.handle as BreadcrumbHandle)?.breadcrumb)
    .map((m) => {
      const handle = m.handle as BreadcrumbHandle;
      const { pathname, params } = m;
      const label =
        typeof handle.breadcrumb === 'function'
          ? handle.breadcrumb({ params, pathname })
          : handle.breadcrumb;
      return { label, pathname };
    });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background justify-between p-0">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((c, i) => (
                  <>
                    <BreadcrumbItem key={c.pathname} className="hidden md:block">
                      {i < crumbs.length - 1 ? (
                        <>
                          <BreadcrumbLink>
                            <Link to={c.pathname}>{c.label}</Link>
                          </BreadcrumbLink>
                        </>
                      ) : (
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {i < crumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <ModeToggle />
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
