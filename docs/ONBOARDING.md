# Onboarding and deployment

## Prerequisites

- [Bun](https://bun.sh/) (use v1.4.2, the version pinned in CI)
- OpenSSL, or another secure random generator, for a local Better Auth secret
- A Cloudflare account for deployment only. Wrangler uses a local D1 database during development.

## Run locally

Install dependencies and create local environment variables:

```bash
bun install
cp .config/.dev.vars.example .config/.dev.vars
openssl rand -base64 32
```

Put the generated value in `BETTER_AUTH_SECRET` in `.config/.dev.vars`. `BETTER_AUTH_URL` is already `http://localhost:5173`; update it if the local app uses a different origin. Keep `.config/.dev.vars` private.

Create the local database and start the app:

```bash
bun run db:migrate
bun run db:seed
bun run dev
```

Wrangler applies checked-in migrations to its local D1 database. The seed inserts two sample posts and a local admin account. Sign in with `admin@example.com` and password `e2e-admin-password-123` to visit `/admin`. These credentials are for local development and tests only. `db:seed` targets the local database; it does not provision a production admin account. Do not expose a database seeded with this known password.

Run `bun run db:migrate` after adding migrations. The seed can be run repeatedly.

## Checks and scripts

The PR quality workflow runs unit/integration tests, a production build, route-tree and Worker dry-run checks, Cloudflare type and migration drift checks, browser tests in Chromium/Firefox/WebKit, Lighthouse, Biome, Knip, and TypeScript.

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local Vite development server |
| `bun run build` | Build client and server Worker bundles |
| `bun run preview` | Run the built Worker with local Wrangler |
| `bun run check` / `bun run check:ci` | Run Biome locally / in CI mode |
| `bun run check:types` | Run TypeScript type checking |
| `bun run check:knip` | Check for unused code, exports, and dependencies |
| `bun run test` | Run Vitest unit and integration tests |
| `bun run test:browser` | Run Playwright end-to-end tests |
| `bun run db:generate` | Generate Drizzle SQL migrations |
| `bun run db:migrate` | Apply migrations to local D1 |
| `bun run db:migrate:remote` | Apply migrations to configured remote D1 |
| `bun run db:seed` | Seed local D1 only |
| `bun run deploy:dry-run` | Validate a Worker deployment without publishing |
| `bun run deploy` | Deploy the built Worker to Cloudflare |

CI does not enforce a maximum bundle chunk size. Vite is configured to show a warning when an SSR chunk exceeds 1500 KB.

## Add a feature: posts example

Use the posts feature as a vertical slice. For a new `projects` feature, place each responsibility here:

| Responsibility | Example location | Purpose |
| --- | --- | --- |
| Route composition | `src/app/routes/projects.tsx` | Load route data and compose feature UI; keep domain behavior in the feature |
| Feature UI | `src/features/projects/components/project-list.tsx` | Render feature-specific content |
| Server function | `src/features/projects/api/project.functions.ts` | Define a typed TanStack server function and its boundary validation/auth middleware |
| Query | `src/features/projects/api/project-query-options.ts` | Define reusable TanStack Query options around the server function |
| Validation and types | `src/features/projects/types/project-validation.ts`, `project-types.ts` | Define Zod schemas and infer types from them |
| Database handler | `src/features/projects/api/project-handlers.ts` | Run Drizzle queries in server-only code |
| Tests | `src/features/projects/__tests__/` | Cover UI, handlers, server function validation, query options, and route composition as appropriate |

In the current posts slice, `src/app/routes/index.tsx` preloads `postListQueryOptions`; `post-query-options.ts` calls `postListServerFn`; `post.functions.ts` delegates to `postListHandler`; the handler accesses D1 through `getDb`; and the Zod schemas live in `types/post-validation.ts`. `PostFeed` and `PostCreateForm` keep feature UI under `components/`. This gives you a working example of route, UI, query, server function, validation, and database concerns without putting database access in the route.

For tests, keep one test focused on one behavior, with arrange, act, and assert phases. Test pure validation and transformation directly; test database handlers against the isolated D1 helpers in `src/test/d1-database.ts`; mock server functions when testing UI states; and test middleware behavior at its boundary. Add regression coverage for changed behavior. Run the narrow spec while iterating, then run `bun run check:types`, `bun run check:ci`, and `bun run test` before opening a PR. Run browser tests when changing route flows or end-to-end behavior.

## Deploy to Cloudflare

1. Create a D1 database:

   ```bash
   bunx wrangler d1 create starter-db
   ```

2. Put the returned database ID and name in `.config/wrangler.json` under `d1_databases`. The committed ID is a placeholder. Keep the migration directory and pattern aligned with the existing config.
3. Set production `BETTER_AUTH_URL` in `.config/wrangler.json` under `vars` to the deployed application's canonical origin (for example, `https://app.example.com`, with no path). This must match the public origin Better Auth serves. For environment-specific values, configure the production Worker variable in Cloudflare and keep the checked-in default suitable for local development.
4. Store a unique production secret in the Worker secret store:

   ```bash
   bunx wrangler secret put BETTER_AUTH_SECRET -c .config/wrangler.json
   ```

5. Build, migrate the configured remote D1 database, and deploy:

   ```bash
   bun run build
   bun run db:migrate:remote
   bun run deploy
   ```

The `deploy` script publishes the generated Worker config at `dist/server/wrangler.json`. The manual production GitHub workflow performs the build, remote migration, then deploy; it requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. The workflow does not set `BETTER_AUTH_URL` or create an admin user, so configure the public auth URL and provision production admin access separately before relying on the admin area. The checked-in seed is local-only.
