import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import NotFoundPage from '../../pages/error/NotFoundPage';
import ErrorBoundary from '../../pages/error/ErrorBoundary';

const HomePage = lazy(() => import('../../pages/home/HomePage'));
const AboutPage = lazy(() => import('../../pages/about/AboutPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
  },
];
