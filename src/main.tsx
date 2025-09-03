import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryProvider } from './providers/query-client.tsx';
import { RouterProvider } from './app/router/RouterProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  </StrictMode>,
);
