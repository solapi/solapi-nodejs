# AGENTS.md

SOLAPI SDK for Node.js. Effect 라이브러리 기반 함수형 프로그래밍 + 타입 안전 에러 처리.

## Structure

```
solapi-nodejs/
├── src/
│   ├── index.ts              # SolapiMessageService facade (entry point)
│   ├── errors/               # Data.TaggedError types
│   ├── lib/                  # Core utilities (fetcher, auth, error handler)
│   ├── models/               # Schemas, requests, responses
│   ├── services/             # Domain services
│   └── types/                # Shared type definitions
├── test/                     # Mirrors src/ structure
├── examples/                 # Usage examples (excluded from build)
└── debug/                    # Debug scripts
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Add new message type | `src/models/base/messages/` | Extend MessageType union |
| Add new service | `src/services/` | Extend DefaultService |
| Add new error type | `src/errors/defaultError.ts` | Extend Data.TaggedError |
| Add utility function | `src/lib/` | Follow Effect patterns |
| Add Kakao BMS type | `src/models/base/kakao/bms/` | Add to BMS_REQUIRED_FIELDS |
| Fix API request issue | `src/lib/defaultFetcher.ts` | HTTP client with retry |
| Understand error flow | `src/lib/effectErrorHandler.ts` | Effect → Promise conversion |

## Conventions

### Effect Library (Mandatory)

**Async operations**: `Effect.tryPromise` 또는 `Effect.gen`
```typescript
Effect.tryPromise({
  try: () => fetch(url, options),
  catch: e => new NetworkError({ url, cause: e }),
});
```

**Complex flow**: `Effect.gen`
```typescript
Effect.gen(function* (_) {
  const auth = yield* _(buildAuth(params));
  const response = yield* _(fetchWithRetry(url, auth));
  return yield* _(parseResponse(response));
});
```

**Error to Promise**: 반드시 `runSafePromise` 경유
```typescript
return runSafePromise(effect);
// BAD: try { await Effect.runPromise(...) } catch { }
```

### Service Pattern

`DefaultService` 상속 → `this.request()` 사용:
```typescript
export default class MyService extends DefaultService {
  async myMethod(data: Request): Promise<Response> {
    return this.request<Request, Response>({
      httpMethod: 'POST',
      url: 'my/endpoint',
      body: data,
    });
  }
}
```

Effect.gen 활용 (복잡한 로직):
```typescript
async send(messages: Request): Promise<Response> {
  const effect = Effect.gen(function* (_) {
    const validated = yield* _(validateSchema(messages));
    return yield* _(Effect.promise(() => this.request(...)));
  });
  return runSafePromise(effect);
}
```

### Model Pattern

Three-layer architecture: `base/` (도메인) → `requests/` (입력 변환) → `responses/` (API 응답)

**Type + Schema**:
```typescript
export type MyType = Schema.Schema.Type<typeof mySchema>;
export const mySchema = Schema.Struct({
  field: Schema.String,
  optional: Schema.optional(Schema.Number),
});
```

**Discriminated Union**:
```typescript
export const buttonSchema = Schema.Union(
  webButtonSchema,   // { linkType: 'WL', ... }
  appButtonSchema,   // { linkType: 'AL', ... }
);
```

**Custom Validation**:
```typescript
Schema.String.pipe(
  Schema.filter(isValid, { message: () => 'Error message' }),
);
```

### Lib Utilities

| File | Purpose |
|------|---------|
| `defaultFetcher.ts` | HTTP client — Effect.gen, retry 3x exponential backoff, Match |
| `effectErrorHandler.ts` | `runSafePromise`, `unwrapCause` |
| `authenticator.ts` | HMAC-SHA256 auth header |
| `stringifyQuery.ts` | URL query string builder (array handling) |
| `fileToBase64.ts` | File/URL → Base64 |
| `stringDateTransfer.ts` | Date parsing with `InvalidDateError` |

## Anti-Patterns

| Pattern | Why Bad | Do Instead |
|---------|---------|------------|
| `any` type | Loses type safety | `unknown` + type guards |
| `as any`, `@ts-ignore` | Suppresses errors | Fix the type issue |
| try-catch around Effect | Loses Effect benefits | `Effect.catchTag` |
| Direct `throw new Error()` | Inconsistent error handling | `Data.TaggedError` |
| Empty catch blocks | Swallows errors | Handle or propagate |
| Bypass `runSafePromise` | Loses error formatting | Always use `runSafePromise` |
| Call `defaultFetcher` directly | Bypasses service layer | Use `this.request()` |
| Skip schema validation | Runtime errors | Always validate input |
| Interface when schema needed | No runtime validation | Use `Schema.Struct` |
| Duplicate validation logic | Inconsistency | Compose schemas |
| Hardcode API URL | Inflexible | Use `DefaultService.baseUrl` |
| Mix Effect and Promise styles | Confusing | Pick one per method |

## Architecture Notes

**Service Facade**: `SolapiMessageService`가 7개 도메인 서비스를 명시적 `.bind()`로 위임.

**Error Flow**:
```
API Response → defaultFetcher (Effect errors) → runSafePromise (Promise)
  → 원본 Data.TaggedError 그대로 reject → Consumer
```

**Production vs Development**: Production에서는 stack trace와 상세 컨텍스트가 제거됨.

**Retry Logic**: `defaultFetcher.ts` — 3회 재시도, exponential backoff (connection refused, reset, 503).

## Testing Guidelines (Detail)

### Failure Injection
- 의존성 실패 시뮬레이션 (첫 호출, N번째 호출, 지속적 실패)
- 타임아웃, 취소 케이스 포함
- 부분 성공 후 실패 시나리오

### Concurrency
- Race condition 없음 확인
- Deadlock 없음 확인
- 중복 실행 없음 확인

### Persistence
- Atomic behavior (전부 또는 전무)
- 중간 상태 오염 없음
- 안전한 재시도 및 복구

### Fuzz (권장)
- 입력 파싱/디코딩에 fuzz 테스트 적용
- panic이나 무한 리소스 사용 없음 확인

### Style
- 테이블 기반 테스트: `it.each()` 활용
- 외부 의존성: fake/stub 사용
- cleanup hooks (`afterEach`/`afterAll`)

## Sub-Agents

### tidy-first
Kent Beck의 "Tidy First?" 원칙 적용 리팩토링 전문가.
`.claude/agents/tidy-first.md` 참조.

**자동 호출**: 기능 추가, 동작 구현, 코드 리뷰, 리팩토링 작업 시.
**핵심 규칙**: 구조적 변경과 동작 변경을 항상 분리.
