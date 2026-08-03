# AGENTS.md - Frontend Onboarding Guide (`sulleybanhoa`)

Welcome to the **Sulley Bán Hoa** Frontend repository. This guide provides the critical system-level information, architecture guidelines, and standards you need to follow to build and maintain the codebase correctly.

---

## 1️⃣ Overview

**Sulley Bán Hoa** ("Sulley Flower Shop") is a modern, high-performance e-commerce platform and administration system specialized in selling fresh flowers (bouquets, baskets, boxes, and plant stands) designed in a minimalist Korean style.

The frontend is divided into two primary consumer experiences:

1. **Public-facing Storefront:** An elegant, premium shopping catalog featuring product search, multi-faceted filter parameters (categories, occasions, flower types, price ranges), detail pages, interactive bouquet builder, and business information views.
2. **Admin Portal (`/admin`):** A comprehensive management system containing an operational dashboard, product catalog management, order tracking and status lifecycle workflow, user account role management, finance log ledgers (revenue/expenditure tracking), and dynamic store configuration management.

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
- **Backend & Database SDK:** `@supabase/supabase-js` `v2.108.1` for serverless communication (Auth, database tables like `products`, `orders`, `finance_transactions`, `finance_categories`, `store_settings`, and public storage buckets).
- **UI & Primitives:** Radix UI primitives wrapped in customized **Shadcn/UI** components, `@tanstack/react-table` for data tables, `recharts` for charts, `vaul` for bottom sheets, `@dnd-kit` for drag-and-drop, and `sonner` for toast notifications.
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
│   ├── layout/                # Header, footer, sidebar sub-components (AppSidebar, Header, Footer)
│   ├── shared/                # SEO wrappers, Navigation components
│   ├── shop/                  # ProductFilters, ProductCard, BouquetBuilderModal, etc.
│   └── ui/                    # Shadcn/UI primitives and custom widgets (DataTable, CurrencyInput, DatePicker, ConfirmDialog, FormLayout)
├── data/                      # Local static metadata or mock configurations
├── hooks/                     # Custom hooks wrapping React Query logic (useOrders, useProducts, useUsers, useFinanceTransaction, useStoreSettings, useAuth, useDashboardSummary)
├── lib/                       # Helpers, guards, and SDK setup
│   ├── constants/             # Enums, roles, and status mappings (order.constant.ts, finance-transaction.constant.ts, product.constant.ts, role.constant.ts)
│   ├── guards/                # AuthGuard.tsx (RBAC route guard)
│   ├── utils/                 # formatters.ts (VND currency, date formats)
│   ├── supabase.ts            # Supabase client singleton setup
│   └── utils.ts               # cn() utility for merging Tailwind classes
├── pages/                     # Routed views organized by feature
│   ├── about/                 # About page view (AboutPage.tsx)
│   ├── contact/               # Contact page view (ContactPage.tsx)
│   ├── dashboard/             # Admin Dashboard metrics view (DashboardPage.tsx)
│   ├── error/                 # ErrorBoundary and NotFoundPage
│   ├── finance-transaction/   # Finance transaction ledger view & dialogs (FinanceTransactionPage.tsx)
│   ├── landing/               # Public Landing page view (LandingPage.tsx)
│   ├── login/                 # Auth login view (LoginPage.tsx)
│   ├── order/                 # Order list, detail, and transaction dialogs (OrderListPage.tsx, OrderDetailPage.tsx)
│   ├── product/               # Product catalog management (ProductListPage.tsx, ProductFormDialog.tsx)
│   ├── setting/               # Settings & Store Config view (SettingPage.tsx, StoreConfigPage.tsx)
│   ├── shop/                  # Storefront product catalog & detail views (ShopPage.tsx, ProductDetailPage.tsx)
│   └── user/                  # Admin User management views (UserListPage.tsx)
├── providers/                 # React Context providers (QueryClientProvider, ThemeProvider)
├── services/                  # Client service layer executing Supabase queries (authService, dashboardService, finance-category.service, finance-transaction.service, mediaService, orderService, productService, storeSettingService, userService)
├── stores/                    # Zustand stores (auth.store.ts with supabase.auth.onAuthStateChange)
└── types/                     # TypeScript declaration interfaces (*.d.ts files mapping API schemas: auth, dashboard, finance-transaction, order, product, router, store-setting, user)
```

---

## 4️⃣ Key Architectural Flows

### A. Routing & Access Control

- **Public Storefront Routes:** `MainLayout` wrapping `/`, `/shop`, `/product/:id`, `/about`, `/contact`.
- **Authentication Route:** `/login` wrapped with `ThemeProvider` and `Toaster`.
- **Protected Admin Routes:** Base path `/admin` protected by `<AuthGuard />` and wrapped with `<ErrorBoundary>`. Lazy-loaded sub-routes under `<AdminLayout />`:
  - `/admin` / `/admin/dashboard`: Admin Dashboard view (`DashboardPage.tsx`)
  - `/admin/products`: Product Management view (`ProductListPage.tsx`)
  - `/admin/orders`: Order List view (`OrderListPage.tsx`)
  - `/admin/orders/:id`: Order Details view (`OrderDetailPage.tsx`)
  - `/admin/users`: User Management view (`UserListPage.tsx`)
  - `/admin/finance-transaction`: Finance Log Ledger (`FinanceTransactionPage.tsx`)
  - `/admin/setting`: User & Account Settings (`SettingPage.tsx`)
  - `/admin/store-config`: Store Banner & Dynamic Content Configuration (`StoreConfigPage.tsx`)

### B. Service & Data Layer Pattern

- **Services (`src/services/`):** Encapsulate direct Supabase table operations (`supabase.from(...)`). Handle database row mapping functions (e.g., `mapOrderFromDb`, `mapFinanceTransactionFromDb`, `mapProductFromDb`).
  - Key services: `authService`, `dashboardService`, `finance-category.service`, `finance-transaction.service`, `mediaService`, `orderService`, `productService`, `storeSettingService`, `userService`.
- **React Query Hooks (`src/hooks/`):** Manage asynchronous queries and cache invalidations using explicit query keys (e.g., `['orders']`, `['order_detail']`, `['products']`, `['users']`, `['current_user']`, `['finance_transactions']`, `['store_settings']`, `['dashboard_summary']`).
- **UI Components (`src/pages/` & `src/components/`):** Consume custom hooks (`useOrdersQuery`, `useProductsQuery`, `useUsersQuery`, `useStoreSettingsQuery`). UI components must remain stateless regarding raw network calls.

### C. Authentication & State Synchronization

- **Zustand Store (`src/stores/auth.store.ts`):** Holds `user`, `accessToken`, `refreshToken`, `isAuthenticated`, and `isVerifying`.
- **Session Sync:** Automatically listens to `supabase.auth.onAuthStateChange` and provides `restoreAuth()` to retrieve session data on application startup.

---

## 5️⃣ Conventions

Consistency is mandatory. Stick to the following naming conventions and architectural patterns:

### A. File and Folder Naming

- **Directories:** `kebab-case` for all folder names under `src/` (e.g., `finance-transaction`).
- **Page Components:** PascalCase ending with the `Page` suffix (e.g., `OrderListPage.tsx`, `LandingPage.tsx`, `StoreConfigPage.tsx`).
- **UI/Shared Components:** PascalCase (e.g., `DataTable.tsx`, `OrderFormDialog.tsx`, `ProductFormDialog.tsx`).
- **Custom Hooks:** camelCase prefixed with `use` (e.g., `useOrders.ts`, `useProducts.ts`, `useQueryParams.ts`).
- **Services & Stores:** camelCase or `kebab-case.service.ts` matching file naming in `src/services/` (e.g., `authService.ts`, `finance-transaction.service.ts`, `auth.store.ts`).
- **Constants:** UPPERCASE naming conventions (e.g., `ORDER_STATUS` in constant files).
- **Types:** Prefix interfaces with `I` (e.g., `IUser`, `IProduct`, `ILoginRequest`) inside `src/types/*.d.ts`.

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
