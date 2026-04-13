---
name: create-model
description: Effect Schema 기반 모델/요청 타입을 프로젝트 패턴에 맞게 스캐폴딩. barrel export, TaggedError, 테스트 파일 포함.
disable-model-invocation: true
---

# create-model

Effect Schema 공식문서(https://effect.website/docs/schema/introduction/) 원칙에 따라 모델을 생성합니다.

## Usage

```
/create-model <ModelName> [--type base|request|response] [--domain messages|kakao|iam|cash|storage]
```

## Effect Schema 핵심 원칙

> 공식문서: Schema 값은 **불변(immutable)**이며, 모든 함수는 새로운 Schema 값을 생성한다.
> `Schema<Type, Encoded, Requirements>` — Type은 디코딩된 출력, Encoded는 입력, Requirements는 컨텍스트 의존성.

- **Decoding**: 외부 데이터를 애플리케이션 타입으로 파싱 (검증 후 변환)
- **Encoding**: 애플리케이션 타입을 외부 포맷으로 변환
- **Round-trip 일관성**: encode + decode가 원본 값을 반환해야 함

## Step 1: 기존 패턴 확인

생성 전 반드시 기존 패턴을 읽어서 일관성을 유지합니다:

```bash
# 동일 도메인의 기존 모델 확인
ls src/models/<type>/<domain>/
# 기존 모델 패턴 읽기 (1~2개)
```

## Step 2: 모델 파일 생성

### Schema 정의 패턴

```typescript
import {Schema} from 'effect';

// Schema 정의 — 불변 값으로 데이터 구조를 기술
export const <modelName>Schema = Schema.Struct({
  fieldName: Schema.String,
  optionalField: Schema.optional(Schema.String),
  nullableField: Schema.optional(Schema.NullOr(Schema.String)),
  status: Schema.Literal('ACTIVE', 'INACTIVE'),
});

// 타입 추출 — Schema에서 Type 파라미터를 추출
export type <ModelName> = Schema.Schema.Type<typeof <modelName>Schema>;
```

### 네이밍 규칙

| 대상 | 패턴 | 예시 |
|------|------|------|
| Schema 변수 | camelCase + `Schema` 접미사 | `kakaoButtonSchema` |
| Type | PascalCase | `KakaoButton` |
| 파일명 | camelCase | `kakaoButton.ts` |

### Discriminated Union 패턴

```typescript
// _tag discriminant로 타입 안전한 매칭 가능 (Effect 에러 패턴과 동일)
export const buttonSchema = Schema.Union(
  webButtonSchema,   // buttonType: 'WL'
  appButtonSchema,   // buttonType: 'AL'
);
```

### Transform 패턴 (Decode/Encode)

```typescript
// Round-trip 일관성 보장: encode(decode(input)) === input
export const phoneSchema = Schema.String.pipe(
  Schema.transform(Schema.String, {
    decode: removeHyphens,
    encode: s => s,
  }),
  Schema.filter(s => /^[0-9]+$/.test(s), {
    message: () => '숫자만 포함해야 합니다.',
  }),
);
```

## Step 3: Barrel Export 업데이트

생성된 모델을 가장 가까운 `index.ts`에 re-export:

```typescript
export {
  type <ModelName>,
  <modelName>Schema,
} from './<path>/<modelName>';
```

체인이 `src/index.ts`까지 연결되는지 확인합니다.

## Step 4: 테스트 파일 생성

`test/models/` 하위에 대응하는 테스트 파일:

```typescript
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {<modelName>Schema} from '@models/<path>/<modelName>';

describe('<modelName>Schema', () => {
  it('should decode valid input', () => {
    const input = { /* valid data */ };
    const result = Schema.decodeUnknownEither(<modelName>Schema)(input);
    expect(result._tag).toBe('Right');
  });

  it('should reject invalid input', () => {
    const input = { /* invalid data */ };
    const result = Schema.decodeUnknownEither(<modelName>Schema)(input);
    expect(result._tag).toBe('Left');
  });

  it.each([
    ['null field', { field: null }],
    ['empty string', { field: '' }],
    ['missing required', {}],
  ])('should handle edge case: %s', (_label, input) => {
    const result = Schema.decodeUnknownEither(<modelName>Schema)(input);
    // assert based on schema definition
  });
});
```

## Step 5: 검증

```bash
pnpm lint    # Biome 검사
pnpm test    # 새 테스트 포함 전체 통과
pnpm build   # 타입 체크 + 빌드
```

## Checklist

- [ ] Schema 값은 불변으로 정의 (mutation 없음)
- [ ] `Schema<Type, Encoded, Requirements>` 3개 파라미터 인지
- [ ] Transform 사용 시 round-trip 일관성 보장
- [ ] Barrel export: 가장 가까운 `index.ts` → `src/index.ts` 체인 연결
- [ ] 테스트: decoding 성공/실패/경계값 커버
- [ ] `any` 타입 미사용
- [ ] `pnpm lint && pnpm test && pnpm build` 통과
