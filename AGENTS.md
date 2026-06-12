# AGENTS.md - Frontend Onboarding Guide (`sulleybanhoa`)

Welcome to the **Sulley Bán Hoa** Frontend repository. This guide provides the critical system-level information, architecture guidelines, and standards you need to follow to build and maintain the codebase correctly.

---

## 1️⃣ Overview

**Sulley Bán Hoa** ("Sulley Flower Shop") is a modern, high-performance e-commerce platform and administration system specialized in selling fresh flowers (bouquets, baskets, boxes, and plant stands) designed in a minimalist Korean style.

The frontend is divided into two primary consumer experiences:

1. **Public-facing Storefront:** An elegant, premium shopping catalog featuring product search, multi-faceted filter parameters (categories, occasions, flower types, price ranges), detail pages, and business information views.
2. **Admin Portal (`/admin`):** A management system containing a dashboard (sales/operational statistics), order tracking and status lifecycle workflow, user account role management, and finance log ledgers (revenue/expenditure tracking).

---

## 2️⃣ Tech Stack

The frontend is built on a modern, high-performance TypeScript web stack:

- **Core Library:** React `v19.1.1` (Strict Mode)
- **Build Engine:** Vite `v7.1.2` with `@vitejs/plugin-react` `v5.0.0`
- **Package Manager:** `pnpm` (configured in `pnpm-lock.yaml`)
- **Styling Framework:** **Tailwind CSS v4** (`tailwindcss` `v4.1.12`) integrating `@tailwindcss/postcss` and `@tailwindcss/vite`. It relies on modern CSS-first theme configuration (`src/index.css`) utilizing OKLCH color spaces, Sass (`sass` `v1.92.0`), and animations via `tw-animate-css` `v1.4.0`.
- **Routing:** `react-router-dom` `v7.8.2` supporting lazy loading (`React.lazy`/`Suspense`) and route metadata.
- **State Management:**
  - **Server Cache:** `@tanstack/react-query` `v5.85.9` for asynchronous queries, caching, retries, and data mutations.
  - **Global Client State:** `zustand` `v5.0.8` for session management (JWT tokens, user roles, localStorage persistence).
- **Forms & Validation:** `react-hook-form` `v7.65.0` with `@hookform/resolvers` and `zod` `v4.1.12` schema validation.
- **Backend & Database SDK:** `@supabase/supabase-js` for serverless communication (Auth, database tables, and public storage buckets). Axios is deprecated.
- **UI & Primitives:** Radix UI primitives wrapped in customized **Shadcn/UI** components, `@tanstack/react-table` for data tables, `recharts` for charts, `vaul` for bottom sheets, and `sonner` for toast notifications.
- **Metadata & SEO:** `react-helmet-async` `v2.0.5`
- **Linter & Code Quality:** TypeScript `~5.8.3`, ESLint `v9.33.0`, Prettier `v3.6.2`, and Husky with `lint-staged`.

---

## 3️⃣ Project Structure

The folder structure under `src/` is cleanly organized according to domain-driven design and architectural separations:

```yaml
src/
├── app/                       # Application configuration and setup
│   ├── layout/                # Root layouts (e.g., AdminLayout.tsx, MainLayout.tsx)
│   └── router/                # Route configuration and Lazy-loaded paths (routes.tsx)
├── assets/                    # Static assets (images, icons)
├── components/                # Shared reusable components
│   ├── layout/                # Header, footer, sidebar sub-components
│   ├── shared/                # SEO wrappers, standard Navigation components
│   ├── shop/                  # ProductFilters, ProductCards, etc.
│   └── ui/                    # Shadcn/UI primitives and custom widgets (DataTable, Field wrappers, DatePicker)
├── data/                      # Local static metadata or mock configurations
├── hooks/                     # Custom hooks wrapping react-query logic (e.g., useOrders, useUsers)
├── lib/                       # Third-party setups and global helper functions
│   ├── constants/             # Enums, roles, and status mappings
│   ├── guards/                # AuthGuard.tsx (RBAC route guard)
│   ├── utils/                 # formatters.ts (VND currency, date formats)
│   ├── supabase.ts            # Supabase client singleton setup
│   └── utils.ts               # cn() utility for merging Tailwind classes
├── pages/                     # Routed page views organized by feature folders (dashboard, shop, order, finance-transaction, etc.)
├── providers/                 # React Context providers (QueryClientProvider, etc.)
├── services/                  # Client service layer making HTTP calls to the backend (orderService, authService, etc.)
├── stores/                    # Zustand stores (auth.store.ts)
└── types/                     # TypeScript type definitions (*.d.ts files mapping API interfaces)
```

---

## 4️⃣ Conventions

Consistency is mandatory. Stick to the following naming conventions and architectural patterns:

### A. File and Folder Naming

- **Directories:** `kebab-case` for all folder names under `src/` (e.g., `finance-transaction`).
- **Page Components:** PascalCase ending with the `Page` suffix (e.g., `OrderListPage.tsx`, `LandingPage.tsx`).
- **UI/Shared Components:** PascalCase (e.g., `DataTable.tsx`, `OrderFormDialog.tsx`).
- **Custom Hooks:** camelCase prefixed with `use` (e.g., `useOrders.ts`, `useQueryParams.ts`).
- **Services & Stores:** camelCase (e.g., `authService.ts`, `auth.store.ts`).
- **Constants:** UPPERCASE naming conventions (e.g., `ORDER_STATUS` in constant files).
- **Types:** Prefix interfaces with `I` (e.g., `IUser`, `ILoginRequest`) inside `src/types/*.d.ts`.

### B. Architectural Patterns

1. **Stateless UI Components:** Components must only manage rendering and styling. They should not directly call API services.
2. **Business Logic in Custom Hooks:** Keep network requests and cache keys encapsulated inside custom hooks (in `src/hooks/*`) utilizing TanStack Query.
3. **Data Formatting:** Always format currencies, numbers, and dates using formatting functions defined in `src/lib/utils/formatters.ts`.
4. **Token Refresh Lifecycle:** Handled automatically by the Supabase client SDK. Session states and token renewals are synchronized through auth state change subscriptions in the Zustand store.

---

## 5️⃣ Do's & Don'ts

### Do's

- **DO** use the custom hook abstractions (`src/hooks/*`) to query and mutate data. Never call services or write inline `useQuery` configurations inside UI components.
- **DO** write strict TypeScript types and interfaces inside `src/types/*.d.ts`. Make sure to avoid utilizing `any` (prefer exact types or `unknown` where appropriate), despite the rule being off in ESLint settings.
- **DO** utilize formatting helpers from `src/lib/utils/formatters.ts` for currencies (`VND`) and date structures.
- **DO** utilize custom-wrapped UI helpers in `src/components/ui/` such as `DataTable`, `confirm-dialog`, `date-picker`, and `field` (form fields helper) to keep layouts and user feedback uniform.
- **DO** follow the Tailwind CSS v4 configuration patterns. Add custom tokens under `@theme inline` inside `src/index.css` and use base theme values like `--radius: 0.625rem` or color variables.

### Don'ts

- **DON'T** write raw Supabase queries in pages or components. Always declare database queries and endpoints in the service layer (`src/services/`) and wire them up in hooks.
- **DON'T** mix business logic with UI view structures. Form validations should always be done via `zod` schemas coupled with `react-hook-form` controllers.
- **DON'T** use default/cliché tech styling colors (like Fintech blues, deep cyan, or neon purple gradients) unless explicitly requested. The branding style uses natural flower tones: peachy accents (`#eecbcb`), pastel orange background (`#faefe3`), soft light beige (`#FDFBF7`), clean green (`#dae5d0`), and dark charcoal (`#4A4A4A`) with serif typography headers (`font-serif`).
- **DON'T** use inline styles. Always write utility class names provided by Tailwind CSS.
