# CLAUDE.md

SOLAPI SDK for Node.js — SMS, LMS, MMS, Kakao 메시지(알림톡/친구톡) 발송을 위한 서버사이드 SDK.

## Core Principles

1. **Zero Tolerance for Errors** — 모든 검증 통과 필수, 경고 무시 금지
2. **Clarity over Cleverness** — 명확하고 유지보수 가능한 코드 우선
3. **Conciseness** — 의도를 완전히 표현하는 최소한의 코드
4. **Reduce Comments** — 코드가 자체 설명적이어야 함. "why"만 주석으로 남김
5. **Read Before Writing** — 새 코드 작성 전 기존 패턴을 반드시 확인

## Commands

```bash
pnpm dev              # Watch mode (tsup)
pnpm build            # Lint + build (production)
pnpm lint             # Biome check with auto-fix
pnpm test             # Run all tests once
pnpm test:watch       # Watch mode
pnpm vitest run <path>  # Run specific test file
pnpm docs             # Generate TypeDoc documentation
```

## Mandatory Validation

코드 변경 후 반드시 순서대로 실행:

1. `pnpm lint` — Biome 자동 수정
2. `pnpm test` — 전체 테스트 통과
3. `pnpm build` — 타입 체크 + 빌드

실패 시 수정 후 재실행. 실패 상태로 커밋 금지.

## Architecture

### Entry Point & Service Facade
`SolapiMessageService` (src/index.ts)가 모든 도메인 서비스 메서드를 명시적 `.bind()`로 위임.

### Service Layer
모든 서비스는 `DefaultService` (src/services/defaultService.ts) 상속:
- Base URL: `https://api.solapi.com`
- `AuthenticationParameter` 기반 인증
- `defaultFetcher` HTTP 추상화

도메인 서비스: `MessageService`, `GroupService`, `KakaoChannelService`, `KakaoTemplateService`, `CashService`, `IamService`, `StorageService`

### Effect Library
- 에러: `Data.TaggedError` + environment-aware `toString()`
- 비동기: `Effect.gen` + `Effect.tryPromise`
- 검증: Effect Schema (`Schema.filter`, `Schema.transform`)
- Promise 변환: `runSafePromise()` / `runSafeSync()`

### Path Aliases
```
@models → src/models    @lib → src/lib    @services → src/services
@errors → src/errors    @internal-types → src/types    @ → src
```

## Code Style

### TypeScript
- **`any` 타입 절대 금지** — `unknown` + type guards 또는 Effect Schema 사용
- `noExplicitAny: error` (Biome), strict mode 활성화
- 함수형 프로그래밍 스타일 (Effect library)
- 코드 작성 후 `pnpm lint` 실행

### Error Handling
- 에러는 반드시 `Data.TaggedError` 사용 (raw `throw new Error()` 금지)
- Effect 주변에 try-catch 금지 — `Effect.catchTag`/`Effect.catchAll` 사용
- Promise 변환은 반드시 `runSafePromise()` 경유

## Testing

### 원칙
- 코드를 먼저 읽고 테스트 작성 — 코드가 진실의 원천
- 성공/실패 모두 테스트 — happy path만 테스트 금지
- 모든 조건 분기, 경계값(null, empty, zero, min, max) 테스트
- 버그 수정 시 반드시 회귀 테스트 추가
- 결정적(deterministic) 테스트만 작성 — sleep 기반 타이밍 의존 금지

### 검증 항목
- 상태 일관성, 부작용, 멱등성, 리소스 정리
- 의존성 실패 시뮬레이션 (네트워크 에러, 타임아웃)
- Effect 파이프라인을 통한 에러 전파

### 테스트 패턴
- **Unit**: `import {describe, expect, it} from 'vitest'`
  - Schema 검증: `Schema.decodeUnknownEither()` / `Schema.decodeUnknownSync()`
  - 테이블 기반: `it.each()` 활용
- **E2E**: `import {describe, expect, it} from '@effect/vitest'`
  - `it.effect()` + `Effect.gen(function* () { ... })`
  - Layer 제공: `.pipe(Effect.provide(XxxLive))`
  - 에러 테스트: `Effect.either()`
  - 테스트 레이어: `test/lib/test-layers.ts`

### 테스트 명명
- 동작 기반: "should return empty string for null"
- 엣지 케이스: "should reject BMS_IMAGE without imageId"
- 실패 모드: "should handle network timeout gracefully"

### 금지 사항
- happy path만 테스트
- 엣지 케이스/에러 경로 생략
- 비결정적(non-deterministic) 테스트
- 하나의 테스트에 여러 관심사 병합
- 라인 커버리지만 의존

상세한 코드 패턴과 안티패턴은 `AGENTS.md` 참조.
