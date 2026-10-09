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

Put the generated value in `BETTER_AUTH_SECRET` in `.config/.dev.vars`. This secret is required by Better Auth. `BETTER_AUTH_URL` is already set to `http://localhost:5173`; change it only if you run the app at a different URL.

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
├── app/         # Router configuration, route definitions, global styles
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

## 🔒 GitHub Repository Setup

Configure these settings after creating a repository from this template. Repository settings are not applied by cloning the code. You need repository admin access; branch rulesets for private repositories require GitHub Pro, Team, or Enterprise Cloud. See [GitHub ruleset setup](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).

### 1. Configure merges and branch cleanup

In **Settings → General → Pull Requests**:

- Enable **Allow squash merging** and disable **Allow merge commits** and **Allow rebase merging**.
- Set the default squash commit message to **Pull request title and description**. Use a Conventional Commit PR title, such as `feat: add post search`, so the resulting commit follows the project's commit convention.
- Enable **Automatically delete head branches** to remove the source branch after merging. Target protection rules at `main` so feature branches can be deleted.

See GitHub's [merge settings](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges) and [automatic branch deletion](https://docs.github.com/en/enterprise-cloud%40latest/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches).

### 2. Protect `main`

In **Settings → Rules → Rulesets → New ruleset → New branch ruleset** (the sidebar may label this **Rulesets**):

1. Name the ruleset `Protect main`, set enforcement to **Active**, and target the branch name `main`.
2. Leave the **Bypass list** empty so admins and automation follow the same merge requirements.
3. Enable **Restrict deletions**, **Block force pushes**, and **Require linear history**.
4. Enable **Require a pull request before merging**, with:
   - At least **1 required approval**; use 2 when the team can support it.
   - **Dismiss stale pull request approvals when new commits are pushed**.
   - **Require approval of the most recent reviewable push**.
   - **Require conversation resolution before merging**.
5. Enable **Require status checks to pass** and **Require branches to be up to date before merging**, then add every check in the next section and create the ruleset.

These settings require reviewed, current PRs before changes reach `main`. A solo maintainer needs another eligible reviewer to satisfy required approvals. See [available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

If using classic branch protection, go to **Settings → Branches → Add branch protection rule**, target `main`, apply the equivalent settings, and enable **Do not allow bypassing the above settings**.

### 3. Require the existing PR checks

Open an initial PR and let [PR Quality Checks](.github/workflows/pull-request-checks.yml) run. Select the exact check names shown by GitHub, including each browser matrix entry, and select **GitHub Actions** as the expected source where available:

| Required check | What it validates |
| --- | --- |
| `🧪 Run Unit Tests` | Unit and integration tests |
| `📦 Verify Build Health` | Build, generated route tree, chunk sizes, and Worker deployment dry run |
| `🛡️ Prevent Artifact Drift` | Cloudflare types, generated migrations, and at most one new SQL migration per PR |
| `🎭 Run Browser Tests (chromium)` | Chromium E2E tests |
| `🎭 Run Browser Tests (firefox)` | Firefox E2E tests |
| `🎭 Run Browser Tests (webkit)` | WebKit E2E tests |
| `🔦 Run Lighthouse Check` | Configured Lighthouse assertions |
| `✨ Check Code Quality` | Biome, FSD architecture, unused code/dependencies, and TypeScript |

There are **8 required checks**. Require all three browser results separately. The manual PR Agent Review and production deployment workflows do not run automatically on PRs; keep them out of this list.

Keep required job names unique across workflows and update the ruleset whenever you rename a job. Avoid workflow path filters that leave required checks pending. GitHub accepts successful, skipped, or neutral required checks, so keep mandatory jobs unconditional; browser and Lighthouse jobs currently depend only on a successful build. See [required check troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).

Before merging, update the branch with `main`, wait for all required checks on the latest revision, obtain approvals, and resolve review conversations. Choose **Squash and merge**, review the final commit message, and confirm that GitHub deletes the source branch afterward. Start subsequent work from the updated `main`.

### 4. Additional practices for a strict codebase

These are recommended additions; several require new repository files or workflow changes.

- **Require code owner reviews.** Add `.github/CODEOWNERS` for FSD slices and sensitive areas such as authentication, database migrations, `.github/`, and `.config/`. Include the CODEOWNERS file itself, then enable required code owner approval in the ruleset. Review against [the coding standards](docs/CODING_STANDARDS.md). See [code ownership for workflows](https://docs.github.com/en/actions/reference/security/secure-use#using-codeowners-to-monitor-changes).
- **Secure GitHub Actions.** Set default workflow permissions to read repository contents, grant extra permissions only to jobs that need them, and pin external actions to full commit SHAs. The template currently uses action tags and the PR Agent uses `@main`; pin those references before enforcing a SHA policy. See [secure use of Actions](https://docs.github.com/en/actions/reference/security/secure-use).
- **Automate dependency and security maintenance.** Configure Dependabot for dependencies and GitHub Actions, and enable Dependabot alerts, secret scanning, push protection, and code scanning where supported by your plan. Assign someone to resolve alerts. See [security settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository).
- **Enforce PR conventions in CI.** Add a PR template covering purpose, validation, migrations, and rollout, plus a required Conventional Commit PR-title check. Local commitlint hooks already exist, but GitHub edits and skipped hooks need CI enforcement. Keep PRs focused and add regression tests for changed behavior.
- **Keep builds reproducible.** Commit `bun.lock` and migrations, use the pinned Bun version, and install with `--frozen-lockfile` as CI already does. Review dependency updates through the same required checks.
- **Protect production deployments.** Create a `production` GitHub environment restricted to the `main` branch and configure required reviewers before using the deploy workflow. Add `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and a non-empty `PRODUCTION_DEPLOYMENT_GATE` secret to that environment, and set its `PRODUCTION_URL` variable to the deployed Worker URL. The deploy job checks that these values exist and that **PR Quality Checks** succeeded for the exact commit before applying migrations. Configure the branch restriction and reviewers in **Settings → Environments → production**; the workflow guard secret does not provide approval protection by itself. The deploy job accepts only a workflow dispatch from `main`. See [environment protection](https://docs.github.com/en/actions/reference/security/secure-use#consider-requiring-review-for-access-to-secrets).
- **Use a merge queue when PR volume grows.** Add a `merge_group` trigger to the quality workflow before requiring the queue, and configure its merge method as squash. The current workflow lacks that trigger. See [merge queue setup](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue).

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
