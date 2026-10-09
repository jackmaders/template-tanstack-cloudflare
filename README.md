# template-tanstack-start-cloudflare

A full-stack starter for teams building with TanStack Start on Cloudflare Workers and D1. It includes Better Auth, Drizzle ORM, and a posts feature that demonstrates the project structure.

## Tech stack

- [TanStack Start, Router, and Query](https://tanstack.com/start)
- [Cloudflare Workers and D1](https://developers.cloudflare.com/workers/)
- [Better Auth](https://better-auth.com/) and [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/), React, and TypeScript
- Bun, Biome, Knip, Vitest, and Playwright

## Project structure

```text
src/
├── app/         # Routes, router setup, global styles
├── features/    # Domain UI, server functions, queries, and types
├── components/  # Shared UI primitives and layouts
└── shared/      # Database, errors, and reusable infrastructure
```

## Documentation

- [Onboarding and deployment](docs/ONBOARDING.md): local setup, checks, adding a feature, and production configuration.
- [GitHub repository setup](docs/GITHUB_SETUP.md): branch rules, required checks, and repository security settings.
- [Coding standards](docs/CODING_STANDARDS.md): architecture, function design, errors, and testing.

## Common commands

```bash
bun install
bun run dev
bun run check:types
bun run test
bun run build
```

See [Onboarding and deployment](docs/ONBOARDING.md) for environment setup and the full command list.
