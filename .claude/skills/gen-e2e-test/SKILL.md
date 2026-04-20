---
name: gen-e2e-test
description: Effect 기반 E2E 테스트를 프로젝트 패턴(it.effect, Layer, Effect.either)에 맞게 생성. Effect 공식문서 원칙 준수.
disable-model-invocation: true
---

# gen-e2e-test

`@effect/vitest`의 `it.effect()` 패턴으로 E2E 테스트를 생성합니다.
Effect 공식문서: https://effect.website/docs/

## Usage

```
/gen-e2e-test <ServiceName> [--methods method1,method2]
```

## Step 1: 대상 서비스 분석

Read 도구로 서비스 구현과 기존 E2E 테스트를 읽습니다.

**중요**: 일부 서비스(cashService, iamService 등)는 plain vitest + async/await 패턴을 사용합니다. 기존 테스트가 있다면 해당 패턴을 따르고, 새로 작성하는 경우 아래 Effect 패턴(권장)을 사용합니다.

## Step 2: Layer 확인

`test/lib/test-layers.ts`에서 대상 서비스의 Layer 정의 확인.

### Layer가 없는 경우 — `test/lib/test-layers.ts`에 추가

`createServiceLayer`는 해당 파일 내부의 비공개 헬퍼입니다. 기존 정의 옆에 추가:

```typescript
export const <ServiceName>Tag = Context.GenericTag<<ServiceName>>('<ServiceName>');

export const <ServiceName>Live = createServiceLayer(
  <ServiceName>Tag,
  <ServiceName>,
);
```

## Step 3: E2E 테스트 생성

### Happy Path

```typescript
import {describe, expect, it} from '@effect/vitest';
import {Effect} from 'effect';

describe('<ServiceName> E2E', () => {
  it.effect('should <동작 설명>', () =>
    Effect.gen(function* () {
      const service = yield* <ServiceName>Tag;

      const result = yield* Effect.tryPromise(() =>
        service.<methodName>(),
      );

      expect(result).toBeDefined();
    }).pipe(Effect.provide(<ServiceName>Live)),
  );
});
```

### Error Path — Effect.either

```typescript
it.effect('should handle <에러 상황> gracefully', () =>
  Effect.gen(function* () {
    const service = yield* <ServiceName>Tag;

    const result = yield* Effect.either(
      Effect.tryPromise(() =>
        service.<methodName>(/* invalid args */),
      ),
    );

    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      // Effect.tryPromise는 UnknownException으로 래핑 — .error로 원본 에러 접근
      expect(String(result.left.error)).toContain('예상되는 에러 메시지');
    }
  }).pipe(Effect.provide(<ServiceName>Live)),
);
```

### 병렬 호출

```typescript
// Effect.all은 기본 순차 실행. 병렬 실행 시 concurrency 옵션 필수
const [r1, r2] = yield* Effect.all([
  Effect.tryPromise(() => service.method1()),
  Effect.tryPromise(() => service.method2()),
], {concurrency: 'unbounded'});
```

### 환경변수

```typescript
// Effect.gen 내부에서 yield*로 사용
const sender = yield* Config.string('SOLAPI_SENDER').pipe(
  Config.withDefault('01000000000'),
);
```

## Step 4: 검증

CLAUDE.md "Mandatory Validation" 순서대로 `pnpm lint` → `pnpm test` → `pnpm build` 실행.

## Checklist

기존 plain vitest 테스트를 확장하는 경우, 해당 파일의 기존 패턴을 따릅니다.
새로 작성하는 Effect 패턴 테스트의 경우:

- [ ] `@effect/vitest`에서 import (`vitest` 아님)
- [ ] `it.effect()` + `Effect.gen(function* () { ... })`
- [ ] `.pipe(Effect.provide(Layer))` 필수
- [ ] Happy path + Error path 모두 테스트
- [ ] `Effect.tryPromise` 에러는 `UnknownException` — `.error`로 원본 접근
