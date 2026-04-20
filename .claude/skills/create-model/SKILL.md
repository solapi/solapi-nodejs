---
name: create-model
description: Effect Schema 기반 모델/요청 타입을 프로젝트 패턴에 맞게 스캐폴딩. barrel export, 테스트 파일 포함.
disable-model-invocation: true
---

# create-model

Effect Schema(https://effect.website/docs/schema/introduction/) 원칙에 따라 모델을 생성합니다.
프로젝트 검증 규칙은 CLAUDE.md "Mandatory Validation" 참조.

## Usage

```
/create-model <ModelName> [--type base|request|response] [--domain <domain>]
```

### 타입별 유효 도메인

| type | 유효 도메인 |
|------|-----------|
| base | messages, kakao, kakao/bms*, naver, rcs |

\* **kakao/bms 주의**: BMS 모델은 스키마 파일 + barrel export 외에 `src/models/base/kakao/kakaoOption.ts`의 `bmsChatBubbleTypeSchema`, `baseBmsSchema`, `BMS_REQUIRED_FIELDS`에도 통합이 필요합니다.
| request | common, iam, kakao, messages, voice |
| response | iam, kakao (또는 responses/ 루트에 직접 배치) |

```
# 예시
/create-model VoiceOption --type request --domain voice
```

## Step 1: 기존 패턴 확인

생성 전 반드시 동일 도메인의 기존 모델을 Read 도구로 읽어서 일관성을 유지합니다.

## Step 2: 모델 파일 생성

### Schema 정의 패턴

```typescript
import {Schema} from 'effect';

export const <modelName>Schema = Schema.Struct({
  fieldName: Schema.String,
  optionalField: Schema.optional(Schema.String),
  // optional: 키 자체가 없을 수 있음 + NullOr: 값이 null일 수 있음
  nullableField: Schema.optional(Schema.NullOr(Schema.String)),
  status: Schema.Literal('ACTIVE', 'INACTIVE'),
});

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
export const buttonSchema = Schema.Union(
  webButtonSchema,
  appButtonSchema,
);
```

### Transform 패턴

```typescript
// 주의: normalize 목적의 transform은 round-trip을 보장하지 않음
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

barrel-checker 에이전트 규칙에 따라 가장 가까운 `index.ts`에 re-export 추가.
체인이 `src/index.ts`까지 연결되는지 확인.

```typescript
export {
  type <ModelName>,
  <modelName>Schema,
} from './<path>/<modelName>';
```

## Step 4: 테스트 파일 생성

`test/models/` 하위에 대응하는 테스트 파일:

```typescript
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';
import {<modelName>Schema} from '@models/<path>/<modelName>';

describe('<modelName>Schema', () => {
  it('should decode valid input', () => {
    const result = Schema.decodeUnknownEither(<modelName>Schema)({ /* valid */ });
    expect(result._tag).toBe('Right');
  });

  it('should reject invalid input', () => {
    const result = Schema.decodeUnknownEither(<modelName>Schema)({ /* invalid */ });
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

CLAUDE.md "Mandatory Validation" 순서대로 `pnpm lint` → `pnpm test` → `pnpm build` 실행.
