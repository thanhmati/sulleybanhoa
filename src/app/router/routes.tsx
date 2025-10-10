import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import NotFoundPage from '../../pages/error/NotFoundPage';
import ErrorBoundary from '../../pages/error/ErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';

const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const MainLayout = lazy(() => import('../layout/MainLayout'));
const HomePage = lazy(() => import('../../pages/home/HomePage'));
const AboutPage = lazy(() => import('../../pages/about/AboutPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
  },
  {
    path: '/admin',
    handle: { breadcrumb: 'Admin' },
    children: [
      { index: true, element: <div>Dashboard page</div>, handle: { breadcrumb: 'Dashboard' } },
    ],
    element: (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AdminLayout />
        </ThemeProvider>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
