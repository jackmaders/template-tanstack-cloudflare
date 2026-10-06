# Agent Guidelines

## Coding standards

When implementing features, writing tests, or reviewing code, read `docs/CODING_STANDARDS.md`. It defines the repo's architectural rules, module boundaries, function design, error handling, and testing standards.

## Architecture

This project follows **Feature-Sliced Design (FSD)**:
- `src/app`: Routing, global providers, and styles.
- `src/pages`: Page compositions.
- `src/widgets`: Composite UI blocks.
- `src/features`: User actions and interactions (e.g. `post-create`, `session-manage`).
- `src/entities`: Domain models and entities (e.g. `post`).
- `src/shared`: Reusable infrastructure, UI components, database clients, authentication, and utilities.
