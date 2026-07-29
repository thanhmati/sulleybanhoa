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
import LandingPage from '@/pages/landing/LandingPage';
import ShopPage from '@/pages/shop/ShopPage';
import ProductDetailPage from '@/pages/shop/ProductDetailPage';
import AboutPage from '@/pages/about/AboutPage';
import ContactPage from '@/pages/contact/ContactPage';
import MainLayout from '../layout/MainLayout';

const AdminLayout = lazy(() => import('../layout/AdminLayout'));
const SettingPage = lazy(() => import('../../pages/setting/SettingPage'));
const ProductListPage = lazy(() => import('../../pages/product/ProductListPage'));
const StoreConfigPage = lazy(() => import('../../pages/setting/components/StoreConfigPage'));

export const routes: RouteObject[] = [
  // 🌐 Public routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/shop',
        element: <ShopPage />,
      },
      {
        path: '/product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
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
            path: 'products',
            element: <ProductListPage />,
            handle: { breadcrumb: 'Quản lý sản phẩm' },
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
            path: 'store-config',
            element: <StoreConfigPage />,
            handle: { breadcrumb: 'Cửa hàng & Banner' },
          },
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
