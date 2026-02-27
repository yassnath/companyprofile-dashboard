# Solvix Studio - Repo Plan

## Architecture Overview

- **App Router structure**:
  - `(marketing)` for public pages and conversion funnel
  - `auth/*` for sign-in/sign-up/reset flows
  - `app/*` for authenticated customer dashboard
  - `admin/*` for RBAC admin features
- **Data layer**:
  - Prisma + PostgreSQL
  - NextAuth with Prisma adapter and credentials provider
  - Route handlers for query endpoints (`/api/orders`, `/api/contact`, `/api/dev/tokens`)
  - Server actions for mutations (signup, forgot/reset password, order wizard)
- **State**:
  - TanStack Query for API-backed lists/details
  - Zustand for UI state (sidebar, order wizard draft)
- **UI system**:
  - Tailwind CSS v4 + shadcn/ui + lucide-react
  - Framer Motion for subtle transitions
  - Theming via CSS variables and `next-themes`
- **Quality**:
  - Vitest (unit)
  - Playwright (e2e)
  - Docker + docker-compose (app + postgres)

## Planned File Tree

```text
.
|- app/
|  |- (marketing)/
|  |  |- layout.tsx
|  |  |- page.tsx
|  |  |- services/page.tsx
|  |  |- pricing/page.tsx
|  |  |- work/page.tsx
|  |  |- about/page.tsx
|  |  |- contact/page.tsx
|  |- auth/
|  |  |- sign-in/page.tsx
|  |  |- sign-up/page.tsx
|  |  |- forgot-password/page.tsx
|  |  |- reset-password/page.tsx
|  |  |- verify-email/page.tsx
|  |  |- dev-tokens/page.tsx
|  |- app/
|  |  |- layout.tsx
|  |  |- page.tsx
|  |  |- orders/page.tsx
|  |  |- orders/new/page.tsx
|  |  |- orders/[id]/page.tsx
|  |  |- billing/page.tsx
|  |  |- profile/page.tsx
|  |- admin/
|  |  |- page.tsx
|  |  |- leads/page.tsx
|  |- api/
|  |  |- auth/[...nextauth]/route.ts
|  |  |- orders/route.ts
|  |  |- orders/[id]/route.ts
|  |  |- contact/route.ts
|  |  |- dev/tokens/route.ts
|  |- layout.tsx
|  |- globals.css
|  |- icon.png
|- components/
|  |- marketing/*
|  |- auth/*
|  |- dashboard/*
|  |- shared/*
|  |- providers.tsx
|  |- ui/*
|- lib/
|  |- auth.ts
|  |- prisma.ts
|  |- validations.ts
|  |- constants.ts
|  |- format.ts
|  |- rate-limit.ts
|  |- tokens.ts
|  |- actions/*
|- hooks/
|  |- use-mobile.ts
|  |- use-auth.ts
|- stores/
|  |- ui-store.ts
|  |- order-draft-store.ts
|- prisma/
|  |- schema.prisma
|  |- migrations/*
|  |- seed.ts
|- tests/
|  |- e2e/auth-order.spec.ts
|  |- unit/validators.test.ts
|- middleware.ts
|- auth.ts
|- Dockerfile
|- docker-compose.yml
|- .env.example
|- README.md
```

## Design System Tokens

- **Brand accent**: `--primary` blue-cyan hue for premium SaaS identity
- **Neutrals**: zinc/slate inspired grayscale for clean contrast
- **Radius**: base `18px`, large cards `24px`
- **Shadows**:
  - Soft card: `0 12px 40px -24px rgba(15, 23, 42, .35)`
  - Floating glass: `0 24px 80px -40px rgba(2, 132, 199, .35)`
- **Typography**:
  - Headings: `Space Grotesk`
  - Body/UI: `Manrope`
  - Mono: `Geist Mono`
- **Spacing scale**: 4px base (`4, 8, 12, 16, 24, 32, 48, 64, 96`)
- **Motion**:
  - Hero reveal: 350-500ms, `easeOut`
  - Card hover translate Y: `-4px`
  - Page fade/slide transition: 200-300ms
- **Accessibility**:
  - Focus ring uses `--ring`
  - Minimum contrast target WCAG AA
  - All form controls labeled and keyboard reachable

## Locale

- Date and currency formatting defaults to Indonesian locale (`id-ID`)
- Currency display in Rupiah (`IDR`)
