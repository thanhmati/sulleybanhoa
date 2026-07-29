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
- **Routing:** `react-router-dom` `v7.8.2` supporting lazy loading (`React.lazy`/`Suspense`), route breadcrumbs, and metadata.
- **State Management:**
  - **Server Cache:** `@tanstack/react-query` `v5.85.9` for asynchronous queries, caching, retries, and data mutations.
  - **Global Client State:** `zustand` `v5.0.8` for session management (JWT tokens, user roles, session state) synchronized with Supabase Auth.
- **Forms & Validation:** `react-hook-form` `v7.65.0` with `@hookform/resolvers`, `zod` `v4.1.12` schema validation, and `dayjs` for date formatting.
- **Backend & Database SDK:** `@supabase/supabase-js` for serverless communication (Auth, database tables like `orders`, `order_transactions`, `finance_transactions`, `finance_categories`, and public storage buckets).
- **UI & Primitives:** Radix UI primitives wrapped in customized **Shadcn/UI** components, `@tanstack/react-table` for data tables, `recharts` for charts, `vaul` for bottom sheets, and `sonner` for toast notifications.
- **Metadata & SEO:** `react-helmet-async` `v2.0.5`
- **Linter & Code Quality:** TypeScript `~5.8.3`, ESLint `v9.33.0`, Prettier `v3.6.2`, and Husky with `lint-staged`.

---

## 3️⃣ Project Structure & Architecture

The codebase follows domain-driven design and architectural separations verified via Codegraph symbol mappings:

```yaml
src/
├── app/                       # Application configuration and routing
│   ├── layout/                # Root layouts (AdminLayout.tsx, MainLayout.tsx)
│   └── router/                # Route configuration (routes.tsx, RouterProvider.tsx)
├── assets/                    # Static assets (images, icons)
├── components/                # Shared reusable UI components
│   ├── layout/                # Header, footer, sidebar sub-components
│   ├── shared/                # SEO wrappers, Navigation components
│   ├── shop/                  # ProductFilters, ProductCards, etc.
│   └── ui/                    # Shadcn/UI primitives and custom widgets (DataTable, CurrencyInput, DatePicker, ConfirmDialog, FormLayout)
├── data/                      # Local static metadata or mock configurations
├── hooks/                     # Custom hooks wrapping React Query logic (useOrders, useUsers, useFinanceTransaction, useAuth)
├── lib/                       # Helpers, guards, and SDK setup
│   ├── constants/             # Enums, roles, and status mappings (order.constant.ts)
│   ├── guards/                # AuthGuard.tsx (RBAC route guard)
│   ├── utils/                 # formatters.ts (VND currency, date formats)
│   ├── supabase.ts            # Supabase client singleton setup
│   └── utils.ts               # cn() utility for merging Tailwind classes
├── pages/                     # Routed views organized by feature
│   ├── about/                 # About page view
│   ├── contact/               # Contact page view
│   ├── dashboard/             # Admin Dashboard metrics view
│   ├── error/                 # ErrorBoundary and NotFoundPage
│   ├── finance-transaction/   # Finance transaction ledger view & dialogs
│   ├── landing/               # Public Landing page view
│   ├── login/                 # Auth login view
│   ├── order/                 # Order list, detail, and transaction dialogs
│   ├── setting/               # Settings & ChangePassword view
│   ├── shop/                  # Storefront product catalog & detail views
│   └── user/                  # Admin User management views
├── providers/                 # React Context providers (QueryClientProvider, ThemeProvider)
├── services/                  # Client service layer executing Supabase queries (orderService, userService, authService, financeTransactionService)
├── stores/                    # Zustand stores (auth.store.ts with supabase.auth.onAuthStateChange)
└── types/                     # TypeScript interfaces (*.d.ts files mapping API schemas)
```

---

## 4️⃣ Key Architectural Flows

### A. Routing & Access Control

- **Public Storefront Routes:** `MainLayout` wrapping `/`, `/shop`, `/product/:id`, `/about`, `/contact`.
- **Authentication Route:** `/login` wrapped with `ThemeProvider` and `Toaster`.
- **Protected Admin Routes:** Base path `/admin` protected by `<AuthGuard />` and wrapped with `<ErrorBoundary>`. Lazy-loaded sub-routes include `dashboard`, `orders`, `orders/:id`, `users`, `finance-transaction`, and `setting`.

### B. Service & Data Layer Pattern

- **Services (`src/services/`):** Encapsulate direct Supabase table operations (`supabase.from(...)`). Handle database row mapping functions (e.g., `mapOrderFromDb`, `mapFinanceTransactionFromDb`).
- **React Query Hooks (`src/hooks/`):** Manage asynchronous queries and cache invalidations using explicit query keys (e.g., `['orders']`, `['users']`, `['current_user']`, `['order_detail']`).
- **UI Components (`src/pages/` & `src/components/`):** Consume custom hooks (`useOrdersQuery`, `usePayOrder`, `useUsersQuery`). UI components must remain stateless regarding raw network calls.

### C. Authentication & State Synchronization

- **Zustand Store (`src/stores/auth.store.ts`):** Holds `user`, `accessToken`, `refreshToken`, `isAuthenticated`, and `isVerifying`.
- **Session Sync:** Automatically listens to `supabase.auth.onAuthStateChange` and provides `restoreAuth()` to retrieve session data on application startup.

---

## 5️⃣ Conventions

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

1. **Stateless UI Components:** Components must only manage rendering and styling. They should not directly call API services or raw Supabase queries.
2. **Business Logic in Custom Hooks:** Keep network requests and cache keys encapsulated inside custom hooks (in `src/hooks/*`) utilizing TanStack Query.
3. **Data Formatting:** Always format currencies, numbers, and dates using formatting functions defined in `src/lib/utils/formatters.ts`.
4. **Token Refresh Lifecycle:** Handled automatically by the Supabase client SDK. Session states and token renewals are synchronized through auth state change subscriptions in the Zustand store.

---

## 6️⃣ Do's & Don'ts

### Do's

- **DO** use the custom hook abstractions (`src/hooks/*`) to query and mutate data. Never call services or write inline `useQuery` configurations inside UI components.
- **DO** write strict TypeScript types and interfaces inside `src/types/*.d.ts`. Make sure to avoid utilizing `any` (prefer exact types or `unknown` where appropriate), despite the rule being off in ESLint settings.
- **DO** utilize formatting helpers from `src/lib/utils/formatters.ts` for currencies (`VND`) and date structures.
- **DO** utilize custom-wrapped UI helpers in `src/components/ui/` such as `DataTable`, `confirm-dialog`, `date-picker`, `currency-input`, and `field` (form fields helper) to keep layouts and user feedback uniform.
- **DO** follow the Tailwind CSS v4 configuration patterns. Add custom tokens under `@theme inline` inside `src/index.css` and use base theme values like `--radius: 0.625rem` or color variables.

### Don'ts

- **DON'T** write raw Supabase queries in pages or components. Always declare database queries and endpoints in the service layer (`src/services/`) and wire them up in hooks.
- **DON'T** mix business logic with UI view structures. Form validations should always be done via `zod` schemas coupled with `react-hook-form` controllers.
- **DON'T** use default/cliché tech styling colors (like Fintech blues, deep cyan, or neon purple gradients) unless explicitly requested. The branding style uses natural flower tones: peachy accents (`#eecbcb`), pastel orange background (`#faefe3`), soft light beige (`#FDFBF7`), clean green (`#dae5d0`), and dark charcoal (`#4A4A4A`) with serif typography headers (`font-serif`).
- **DON'T** use inline styles. Always write utility class names provided by Tailwind CSS.

---

## 7️⃣ Database Safety (Supabase)

The connected Supabase project should always be treated as **production** unless the user explicitly states otherwise.

### Rules

- **NEVER** execute destructive Supabase CLI commands without explicit user approval.
- **NEVER** run:
  - `supabase db reset`
  - `supabase db push`
  - `supabase db remote commit`
  - `supabase migration repair`
  - `supabase migration squash`
- **NEVER** generate or execute SQL containing:
  - `DROP`
  - `TRUNCATE`
  - `DELETE`
  - `ALTER ... DROP`
  - `CASCADE`
- **NEVER** modify database schema or production data unless the task explicitly requires it and the user has confirmed.
- Default to **read-only** operations (schema inspection, `SELECT`, type generation).
- If any task may modify schema or data, **stop, explain the impact, and ask for confirmation before proceeding**.
