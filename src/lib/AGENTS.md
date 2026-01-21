# Core Library Utilities

## OVERVIEW

Cross-cutting utilities used by all services. Effect-based async handling and error management.

## STRUCTURE

```
lib/
├── defaultFetcher.ts        # HTTP client with Effect.gen, retry, Match
├── effectErrorHandler.ts    # runSafePromise, toCompatibleError, formatError
├── authenticator.ts         # HMAC-SHA256 auth header generation
├── stringifyQuery.ts        # URL query string builder
├── fileToBase64.ts          # File/URL → Base64 converter
└── stringDateTrasnfer.ts    # Date parsing with InvalidDateError
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| HTTP request issues | `defaultFetcher.ts` | Retry logic, error handling |
| Error formatting | `effectErrorHandler.ts` | Production vs dev messages |
| Auth issues | `authenticator.ts` | HMAC signature generation |
| Query params | `stringifyQuery.ts` | Array handling, encoding |
| File handling | `fileToBase64.ts` | URL detection, Base64 encoding |
| Date parsing | `stringDateTrasnfer.ts` | ISO format conversion |

## CONVENTIONS

**Effect.tryPromise for Async**:
```typescript
Effect.tryPromise({
  try: () => fetch(url, options),
  catch: e => new NetworkError({ url, cause: e }),
});
```

**Effect.gen for Complex Flow**:
```typescript
Effect.gen(function* (_) {
  const auth = yield* _(buildAuth(params));
  const response = yield* _(fetchWithRetry(url, auth));
  return yield* _(parseResponse(response));
});
```

**Error to Promise Conversion**:
```typescript
// Always use runSafePromise for Effect → Promise
return runSafePromise(effect);

// Never wrap Effect with try-catch
// BAD: try { await Effect.runPromise(...) } catch { }
```

## ANTI-PATTERNS

- Don't bypass `runSafePromise` — loses error formatting
- Don't use try-catch around Effect — use Effect.catchTag
- Don't create new HTTP client — use defaultFetcher
- Don't hardcode API URL — use DefaultService.baseUrl
