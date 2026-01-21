# SOLAPI SDK for Node.js

**Generated:** 2026-01-21
**Commit:** 9df35df
**Branch:** master

## OVERVIEW

Server-side SDK for SMS/LMS/MMS and Kakao messaging in Korea. Uses Effect library for type-safe functional programming with Data.TaggedError-based error handling.

## STRUCTURE

```
solapi-nodejs/
├── src/
│   ├── index.ts              # SolapiMessageService facade (entry point)
│   ├── errors/               # Data.TaggedError types
│   ├── lib/                  # Core utilities (fetcher, auth, error handler)
│   ├── models/               # Schemas, requests, responses (see models/AGENTS.md)
│   ├── services/             # Domain services (see services/AGENTS.md)
│   └── types/                # Shared type definitions
├── test/                     # Mirrors src/ structure
├── examples/                 # Usage examples (excluded from build)
└── debug/                    # Debug scripts
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new message type | `src/models/base/messages/` | Extend MessageType union |
| Add new service | `src/services/` | Extend DefaultService |
| Add new error type | `src/errors/defaultError.ts` | Extend Data.TaggedError |
| Add utility function | `src/lib/` | Follow Effect patterns |
| Add Kakao BMS type | `src/models/base/kakao/bms/` | Add to BMS_REQUIRED_FIELDS |
| Fix API request issue | `src/lib/defaultFetcher.ts` | HTTP client with retry |
| Understand error flow | `src/lib/effectErrorHandler.ts` | Effect → Promise conversion |

## CONVENTIONS

**Effect Library (MANDATORY)**:
- All errors: `Data.TaggedError` with environment-aware `toString()`
- Async operations: `Effect.gen` + `Effect.tryPromise`, never wrap with try-catch
- Validation: `Effect Schema` with `Schema.filter`, `Schema.transform`
- Error execution: `runSafePromise()` / `runSafeSync()` from effectErrorHandler

**TypeScript**:
- **NEVER use `any`** — use `unknown` + type guards or Effect Schema
- Strict mode enforced (`noUnusedLocals`, `noUnusedParameters`)
- Path aliases: `@models`, `@lib`, `@services`, `@errors`, `@internal-types`

**Testing**:
- Unit: `vitest` with `Schema.decodeUnknownEither()` for validation tests
- E2E: `@effect/vitest` with `it.effect()` and `Effect.gen`
- Run: `pnpm test` / `pnpm test:watch`

## ANTI-PATTERNS

| Pattern | Why Bad | Do Instead |
|---------|---------|------------|
| `any` type | Loses type safety | `unknown` + type guards |
| `as any`, `@ts-ignore` | Suppresses errors | Fix the type issue |
| try-catch around Effect | Loses Effect benefits | Use `Effect.catchTag` |
| Direct `throw new Error()` | Inconsistent error handling | Use `Data.TaggedError` |
| Empty catch blocks | Swallows errors | Handle or propagate |

## COMMANDS

```bash
pnpm dev          # Watch mode (tsup)
pnpm build        # Lint + build
pnpm lint         # Biome check with auto-fix
pnpm test         # Run tests once
pnpm test:watch   # Watch mode
pnpm docs         # Generate TypeDoc
```

## ARCHITECTURE NOTES

**Service Facade Pattern**: `SolapiMessageService` aggregates 7 domain services via `bindServices()` dynamic method binding. All services extend `DefaultService`.

**Error Flow**:
```
API Response
  → defaultFetcher (creates Effect errors)
  → runSafePromise (converts to Promise)
  → toCompatibleError (preserves properties on Error)
  → Consumer
```

**Production vs Development**: Error messages stripped of stack traces and detailed context in production (`process.env.NODE_ENV === 'production'`).

**Retry Logic**: `defaultFetcher.ts` implements 3x retry with exponential backoff for retryable errors (connection refused, reset, 503).
