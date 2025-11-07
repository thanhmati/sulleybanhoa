import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import NotFoundPage from '../../pages/error/NotFoundPage';
import ErrorBoundary from '../../pages/error/ErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';
import OrderListPage from '@/pages/order/OrderListPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import LoginPage from '@/pages/login/LoginPage';
import { Toaster } from '@/components/ui/sonner';
import { AuthGuard } from '@/lib/guards/AuthGuard';

const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const MainLayout = lazy(() => import('../layout/MainLayout'));
const HomePage = lazy(() => import('../../pages/home/HomePage'));
const AboutPage = lazy(() => import('../../pages/about/AboutPage'));

export const routes: RouteObject[] = [
  // 🌐 Public routes
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },

  // 🔓 Login route (public)
  {
    path: '/login',
    element: (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <LoginPage />
      </ThemeProvider>
    ),
  },

  // 🔒 Protected admin routes
  {
    path: '/admin',
    element: (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster />
          <AuthGuard />
        </ThemeProvider>
      </ErrorBoundary>
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'orders', element: <OrderListPage /> },
        ],
      },
    ],
  },

  // 🚫 404
  { path: '*', element: <NotFoundPage /> },
];
