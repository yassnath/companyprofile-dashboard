# Solvix Studio
## A Premium Agency Website + Authenticated Client Dashboard

Solvix Studio is a modern digital agency product built to do two things exceptionally well:
- convert visitors into qualified leads
- turn signed-in clients into active, informed project collaborators

This project combines a high-conviction marketing website with a secure, production-style customer portal where users can create, track, and manage service orders with confidence.

## Product Positioning

Solvix Studio is not a template landing page.  
It is designed as a full product experience for a digital agency:
- persuasive public-facing storytelling
- frictionless authentication and account lifecycle
- structured order operations in a clean SaaS dashboard
- role-based admin visibility for agency teams

## Why It Stands Out

- Conversion-first UX: clear copy hierarchy, strategic CTAs, social proof, pricing hooks, and direct WhatsApp entry points.
- Cohesive premium visual system: consistent color logic, rounded surfaces, soft gradients, rich cards, subtle motion, and dark mode.
- Strong product architecture: App Router boundaries, validated server actions, typed models, and route-level access control.
- Portfolio quality with production discipline: realistic flows, robust edge handling, and maintainable code organization.

## Feature Highlights

### Public Website Experience
- High-impact landing page with hero, social proof, services, process timeline, pricing teaser, FAQ, and final conversion CTA.
- Dedicated pages for services, pricing, work, about, and contact.
- Auth-gated order CTA behavior:
  - guests are redirected to sign-in with callback routing
  - authenticated users go directly to new order creation

### Authentication & Account Lifecycle
- Sign up, sign in, forgot password, reset password, and email verification token flow.
- Credentials auth with optional Google provider support.
- Demo-ready token-based email simulation in development (no real email provider required).
- Password visibility controls for better usability and fewer input errors.

### Customer Dashboard
- Responsive app shell:
  - desktop sidebar
  - compact top bar
  - mobile bottom navigation
- Dashboard overview with operational stats and recent activity.
- Orders workspace with filtering, sorting, pagination, status views, and contextual actions.
- Multi-step order wizard with autosave draft behavior and submit confirmation flow.
- Order detail timeline with project summary, status history, file placeholder, and invoice placeholder.
- Billing and profile management views.

### Admin Capability
- Role-based admin routes.
- Agency-wide order visibility and status control.
- Lead intake visibility from the contact pipeline.

## Core Business Flows

- Visitor discovers service value on marketing pages.
- User signs up/signs in to request work.
- Client creates a structured order through a guided wizard.
- Order progresses through lifecycle statuses with history tracking.
- Admin monitors demand and updates delivery progress.

## Design Language

- Premium SaaS aesthetic with bold heading rhythm and spacious layout.
- Unified multi-surface color system across landing, auth, and dashboard.
- Motion is intentional and subtle, never distracting.
- Mobile, tablet, and desktop behaviors are first-class, not afterthoughts.

## Trust, Security, and Quality

- Route-level auth protection for private app and admin areas.
- RBAC enforcement for USER and ADMIN contexts.
- Strict validation with Zod on auth, lead, and order payloads.
- Basic anti-abuse rate limiting on sensitive endpoints.
- Unit and e2e test coverage for critical validation and order lifecycle behavior.

## Technical Foundation

- Next.js App Router + TypeScript
- TailwindCSS + shadcn/ui + Radix + lucide-react
- Framer Motion
- React Hook Form + Zod
- TanStack Query + Zustand
- NextAuth + Prisma + PostgreSQL
- Route Handlers + Server Actions
- Vitest + Playwright
- Dockerized app/database runtime

## Brand Integration

The project uses `logo2.png` as both:
- main brand mark in the UI
- website icon/fav asset

This keeps visual identity consistent from first visit to authenticated workspace.
