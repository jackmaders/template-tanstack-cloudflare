# template-tanstack-start-cloudflare

A production-ready full-stack template powered by **TanStack Start**, **Cloudflare Workers & D1**, **Better Auth**, and **Drizzle ORM**, built with **Bulletproof React** and **Bun**.

---

## ⚡ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with [TanStack Router](https://tanstack.com/router) & [TanStack Query](https://tanstack.com/query)
- **Runtime & Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database & ORM**: [Cloudflare D1](https://developers.cloudflare.com/d1/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/) (Email & Password, sessions, admin roles)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Tooling**: [Bun](https://bun.sh/), [Biome](https://biomejs.dev/), [Knip](https://knip.dev/), [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites

- [Bun](https://bun.sh/) (v1.2+)
- OpenSSL to generate a local auth secret (or another secure random generator)

A Cloudflare account is only needed for deployment. Wrangler runs the local D1 database without creating a remote database.

### 2. Install dependencies

```bash
bun install
```

### 3. Configure local environment

```bash
cp .config/.dev.vars.example .config/.dev.vars
openssl rand -base64 32
```

Put the generated value in `BETTER_AUTH_SECRET` in `.config/.dev.vars`. This secret is required by Better Auth. `BETTER_AUTH_URL` is already set to `http://localhost:5173`; change it only if you run the app at a different URL. PostHog is optional: leave `VITE_POSTHOG_KEY` empty to disable telemetry.

### 4. Migrate and seed the local database

```bash
bun run db:migrate
bun run db:seed
```

These commands create Wrangler's local D1 database, apply the checked-in migrations, and insert the two sample posts. Run them again after adding migrations; seeding can be repeated safely.

### 5. Start the app

```bash
bun run dev
```

---

## 🏗️ Architecture (Bulletproof React)

The codebase follows the **Bulletproof React** architecture:

```text
src/
├── app/         # Router configuration, route definitions, telemetry (PostHog), global styles
├── features/    # Feature modules co-locating components, api/functions, queries, and types
│   ├── auth/    # Auth components (SessionPanel), server auth functions & bindings, client
│   └── posts/   # Post list, form, server functions, queries, and types
├── components/  # Shared UI primitives (Button, Input, Card, Badge, Separator) and layouts
└── shared/      # Infrastructure, D1/Drizzle database, error middleware, and utilities
```

---

## 📜 Available Scripts

- `bun run dev` - Start local Vite development server
- `bun run build` - Build client and SSR worker bundles
- `bun run preview` - Run preview with local Wrangler worker
- `bun run check` - Read-only Biome format and lint check
- `bun run check:fix` - Apply Biome safe and unsafe fixes
- `bun run check:ci` - Read-only Biome CI checks
- `bun run check:types` - TypeScript type checking
- `bun run check:knip` - Find unused code and exports
- `bun run format` - Format files with Biome
- `bun run lint` - Run Biome lint without changing files
- `bun run lint:fix` - Apply Biome lint fixes
- `bun run db:generate` - Generate Drizzle SQL migrations
- `bun run db:migrate` - Apply migrations locally
- `bun run db:migrate:remote` - Apply migrations to remote Cloudflare D1
- `bun run db:seed` - Seed local D1 through Wrangler
- `bun run test` - Run unit and integration tests with Vitest
- `bun run test:browser` - Run Playwright E2E tests

---

## ☁️ Cloudflare Deployment

1. Create a D1 database on Cloudflare:
   ```bash
   bunx wrangler d1 create <your-database-name>
   ```
2. Update `.config/wrangler.json` with your `database_id` and `database_name`.
3. Set your production secrets:
   ```bash
   bunx wrangler secret put BETTER_AUTH_SECRET -c .config/wrangler.json
   ```
4. Deploy:
   ```bash
   bun run db:migrate:remote
   bun run deploy
   ```
