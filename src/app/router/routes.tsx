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
import UserListPage from '@/pages/user/UserListPage';
import { OrderDetailPage } from '@/pages/order/components/OrderDetailPage';
import FinanceTransactionListPage from '@/pages/finance-transaction/FinanceTransactionPage';

const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const SettingPage = lazy(() => import('../../pages/setting/SettingPage'));

export const routes: RouteObject[] = [
  // 🌐 Public routes

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
          <Toaster position="top-right" />
          <AuthGuard />
        </ThemeProvider>
      </ErrorBoundary>
    ),
    children: [
      {
        element: <AdminLayout />,
        handle: {
          breadcrumb: 'Quản trị',
        },
        children: [
          { index: true, element: <DashboardPage />, handle: { breadcrumb: 'Bảng điều khiển' } },
          {
            path: 'dashboard',
            element: <DashboardPage />,
            handle: { breadcrumb: 'Bảng điều khiển' },
          },
          {
            path: 'orders',
            element: <OrderListPage />,
            handle: { breadcrumb: 'Danh sách đơn hàng' },
          },
          {
            path: 'orders/:id',
            element: <OrderDetailPage />,
            handle: { breadcrumb: 'Chi tiết đơn hàng' },
          },
          { path: 'setting', element: <SettingPage />, handle: { breadcrumb: 'Cài đặt' } },
          {
            path: 'users',
            element: <UserListPage />,
            handle: { breadcrumb: 'Danh sách người dùng' },
          },
          {
            path: 'finance-transaction',
            element: <FinanceTransactionListPage />,
            handle: { breadcrumb: 'Danh sách thu chi' },
          },
        ],
      },
    ],
  },

  // 🚫 404
  { path: '*', element: <NotFoundPage /> },
];
