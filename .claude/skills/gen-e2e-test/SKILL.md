---
name: gen-e2e-test
description: Effect 기반 E2E 테스트를 프로젝트 패턴(it.effect, Layer, Effect.either)에 맞게 생성. Effect 공식문서 원칙 준수.
disable-model-invocation: true
---

# gen-e2e-test

Effect 공식문서(https://effect.website/docs/) 원칙에 따라 `@effect/vitest`의 `it.effect()` 패턴으로 E2E 테스트를 생성합니다.

## Usage

```
/gen-e2e-test <ServiceName> [--methods method1,method2]
```

## Effect 테스트 핵심 원칙

> Effect는 `Effect<Success, Error, Requirements>` 타입으로 성공, 실패, 의존성을 컴파일 타임에 추적한다.

- **의존성 주입**: `Context.Tag`으로 서비스 정의, `Layer`로 구현 제공, Requirements 파라미터가 충족 여부를 컴파일 타임에 보장
- **타입 안전 에러 처리**: `Effect.either`로 성공/실패를 `Either` 타입으로 변환, `_tag` discriminant로 에러 매칭
- **Short-Circuiting**: `Effect.gen` 내 첫 에러에서 즉시 중단, 불필요한 계산 방지

## Step 1: 대상 서비스 분석

```bash
# 서비스 구현 읽기
cat src/services/<domain>/<serviceName>.ts
# 기존 E2E 테스트 패턴 참조
ls test/services/<domain>/
```

## Step 2: Layer 확인

`test/lib/test-layers.ts`에서 대상 서비스의 Layer 정의 확인.

### Layer가 없는 경우 추가

```typescript
// Context.Tag: 서비스의 고유 식별자 + 타입 인터페이스 정의
export const <ServiceName>Tag = Context.GenericTag<<ServiceName>>('<ServiceName>');

// Layer.effect: Tag에 대한 구현을 Effect로 제공
export const <ServiceName>Live = createServiceLayer(
  <ServiceName>Tag,
  <ServiceName>,
);
```

> 공식문서: `Context.Tag`은 서비스의 "고유 표현"이며, `Layer`가 제공되면 Requirements 타입 파라미터가 자동으로 좁혀짐

## Step 3: E2E 테스트 생성

### Happy Path — 서비스 주입 + Effect.gen

```typescript
import {describe, expect, it} from '@effect/vitest';
import {Config, Console, Effect} from 'effect';

describe('<ServiceName> E2E', () => {
  it.effect('should <동작 설명>', () =>
    Effect.gen(function* () {
      // 서비스 주입: yield* Tag 패턴
      const service = yield* <ServiceName>Tag;

      // 비동기 래핑: Effect.tryPromise
      const result = yield* Effect.tryPromise(() =>
        service.<methodName>(),
      );

      expect(result).toBeDefined();
    }).pipe(Effect.provide(<ServiceName>Live)),
  );
});
```

### Error Path — Effect.either로 타입 안전한 에러 검증

```typescript
// Effect.either: 실패를 Either 타입으로 변환
// Left = 실패 (에러), Right = 성공 (값)
it.effect('should handle <에러 상황> gracefully', () =>
  Effect.gen(function* () {
    const service = yield* <ServiceName>Tag;

    const result = yield* Effect.either(
      Effect.tryPromise(() =>
        service.<methodName>(/* invalid args */),
      ),
    );

    // _tag discriminant로 타입 안전한 매칭
    expect(result._tag).toBe('Left');
  }).pipe(Effect.provide(<ServiceName>Live)),
);
```

### 병렬 호출 — Effect.all

```typescript
// Effect.all: 여러 Effect를 병렬로 실행
const [result1, result2] = yield* Effect.all([
  Effect.tryPromise(() => service.method1()),
  Effect.tryPromise(() => service.method2()),
]);
```

### Config — 환경변수 의존

```typescript
// Config: 환경변수를 Effect 타입 시스템으로 관리
const senderNumber = yield* Config.string('SOLAPI_SENDER').pipe(
  Config.withDefault('01000000000'),
);
```

### 조건부 스킵

```typescript
if (result.list.length === 0) {
  yield* Console.log('데이터가 없어 테스트를 건너뜁니다.');
  return;
}
```

## Step 4: 검증

```bash
pnpm vitest run test/services/<domain>/<serviceName>.e2e.test.ts
pnpm test
```

## Checklist

- [ ] `@effect/vitest`에서 `describe, expect, it` import (`vitest` 아님)
- [ ] `it.effect()` 사용 (표준 `it` 아님)
- [ ] `Effect.gen(function* () { ... })` — `function*` + `yield*`
- [ ] `.pipe(Effect.provide(Layer))` 필수 — Requirements 충족
- [ ] Happy path + Error path 모두 테스트
- [ ] `Effect.either`로 에러 검증 — `_tag` discriminant 매칭
- [ ] `Effect.tryPromise`로 비동기 래핑
- [ ] `any` 타입 미사용
