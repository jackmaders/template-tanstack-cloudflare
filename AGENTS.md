# Agent Guidelines

## Coding standards

When implementing features, writing tests, or reviewing code, read `docs/CODING_STANDARDS.md`. It defines the repo's architectural rules, module boundaries, function design, error handling, and testing standards.

## Architecture

This project follows **Bulletproof React**:
- `src/app`: Routing, route definitions, global providers, and styles.
- `src/features`: Feature modules containing domain logic, components, queries/mutations, and types (e.g. `src/features/posts`, `src/features/auth`).
- `src/db`: Database schema, clients, seeds, and database test support.
- `src/components`: Shared, reusable UI primitives (Button, Input, Card, Badge, Separator) and layouts.
- `src/shared`: Reusable infrastructure, errors, and utilities.
