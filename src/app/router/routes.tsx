import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import NotFoundPage from '../../pages/error/NotFoundPage';
import ErrorBoundary from '../../pages/error/ErrorBoundary';
import BackOfficeLayout from '../layout/BackOfficeLayout';

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
    children: [{ index: true, element: <div>Dashboard page</div> }],
    element: (
      <ErrorBoundary>
        <BackOfficeLayout />
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
