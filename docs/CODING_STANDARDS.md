# Coding Standards

This document defines the repository's coding standards and design heuristics.

---

## 1. Architectural Alignment

- **Features-First Placement:** Reusable domain logic and user interactions live in feature directories (`src/features/{feature-name}/`), containing their components, api/functions, queries/mutations, and types. Shared UI primitives live in `src/components/`, and route compositions live in `src/app/routes/`.
- **Database Boundary:** Database schemas, clients, seeds, and database test support live in the top-level `src/db/` module. Feature modules import database capabilities from this boundary; the database module does not depend on features.
- **Deep Modules with Substantial Implementation:** Design modules that encapsulate meaningful complexity behind a clean, cohesive interface. Keep policy orchestration and step execution together unless they change for different reasons or serve distinct consumers.
- **Translate at the Border:** Third-party vendor payloads, external schemas, and untyped I/O must be parsed into validated domain types at the adapter boundary. Never leak external vendor schemas into core domain interfaces.
- **Insulate Volatile Dependencies Only:** Stable, type-safe ecosystem libraries (e.g. Drizzle, Zod, TanStack Router) should be used directly. Wrap only volatile, proprietary, or un-typed external SDKs.

---

## 2. Data Modeling & Boundaries

- **Prefer Inferred & Computed Types:** Derive types directly from the single source of truth rather than recreating manual type definitions. For example, database row and insert types must be inferred from the Drizzle schema (`typeof table.$inferSelect` / `$inferInsert`), and API types should be inferred from Zod schemas (`z.infer<typeof schema>`).
- **Parse at the Boundary, Keep Data Immutable:** Validate data strictly upon ingress. In core business logic, prefer plain, immutable, serializable data objects (POJOs / interfaces) and pure transformation functions over heavy stateful OOP class hierarchies.
- **Public Seam as a Change Contract:** A feature's or module's public entrypoint promises stability to callers; anything internal reserves the freedom to be refactored without breaking external dependents.
- **Specialized Entrypoints:** Specialized module entrypoints (`*.server.ts`, `*.client.ts`) are used for environment boundaries:
  - Worker-only functionality is marked with server-only boundaries (`.server.ts`).
  - Browser-only functionality is marked with client-only boundaries (`.client.ts`).

---

## 3. Functions & Composition

- **Command-Query Separation (CQS):** A function should either perform an action or answer a query. Queries must never produce observable side effects. Database mutations (such as inserts or updates) may return the created or updated record.
- **Split Functions by State Sharing, Not Line Count:** When decomposing long functions, do not cut by arbitrary line counts. Identify clusters of logic that share the same variables/state and extract those clusters into cohesive helper functions or modules.
- **Exhaustive Pattern Matching:** Prefer TypeScript discriminated unions and `switch` statements with an exhaustive `never` check over complex class-based Strategy patterns for closed variant sets.
- **Options Objects for Parameter Scalability:** Prefer 0–2 positional arguments. When a function requires 3+ parameters, group them into a single, typed options object to enable named arguments and explicit defaults.
- **File Structure & Readability:** Place public, high-level entry points at the top of the file and private implementation helpers lower down, using standard function hoisting where appropriate.

---

## 4. Error & Null Handling

- **Exceptions for Unexpected Breakages Only:** Throwing is reserved for unrecoverable errors and external library control-flow primitives that require it by design (e.g. router redirects). Business logic functions should return values.
- **Pass True Shapes:** Pass around the true, complete shape of an object through domain handlers, business pipelines, and orchestrator components rather than fragmenting it into piecemeal fields.
- **Narrow Nullability Early:** When a function accepts nullable input, validate or narrow it immediately at entry so downstream code receives the verified non-nullable value without redundant fallback checks.

---

## 5. Testing Standards

- **One Test, One Contract:** Each test verifies a single specification, scenario, or invariant. Name tests using clear specification-style descriptions stating the subject, condition, and expected outcome.
- **Triple-A Structure (Arrange, Act, Assert):** Build the world, execute the action, verify the result. Keep all three phases clean, visible, and free of extraneous fixture setup.
- **Hold Tests to Production Standards:** Treat test helpers and test data factories with first-class engineering discipline.
- **No Speculative Code:** Write only the minimal production code necessary to satisfy tests (Red → Green → Refactor).

---

## 6. Naming & Documentation

- **Name for Intent, One Level Above Implementation:** Name functions after _why_ the caller invokes them, not _what_ lines of code execute inside them.
- **The Neighbor Rule:** Variable name length grows with scope; function name length shrinks with scope.
- **Explain Non-Obvious Intent, Not Obvious Code:** Self-explanatory code needs no inline comments. Use comments strictly to document non-obvious rationale, subtle edge cases, or warnings about hidden traps.
- **No Structural Apologies:** Do not write comments to explain convoluted code—refactor the code.

---

## 7. Tech Conventions

- **Routing & Search Params:** Prefer TanStack Router search params for shareable, bookmarkable page state over local component state.
- **Server State over Effects:** Rely on TanStack Query for remote state. Never mirror query state into `useState` via `useEffect`.
- **Render-Phase Derivation:** Compute derived state inline during render; avoid effect-driven state cascades.
- **Direct Schema Usage & Server Function Boundaries:** Use Drizzle ORM directly without creating synthetic DAO wrappers. Database access and queries must live inside server modules or dedicated server functions.
