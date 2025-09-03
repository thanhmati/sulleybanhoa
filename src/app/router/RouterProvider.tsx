import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export function RouterProvider() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ReactRouterProvider router={router} />
    </Suspense>
  );
}
