import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { QueryProvider } from './providers/query-client.tsx';
import { RouterProvider } from './app/router/RouterProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </HelmetProvider>
  </StrictMode>,
);
