import {ParseResult, Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {
  BadRequestError,
  InvalidDateError,
  ResponseSchemaMismatchError,
} from '../errors/defaultError';
import stringDateTransfer, {formatWithTransfer} from './stringDateTransfer';

/**
 * Schema 디코딩 + BadRequestError 변환을 결합한 Effect 헬퍼.
 * 서비스 레이어에서 반복되는 검증 패턴을 통일합니다.
 * Effect 공식 ParseResult 포맷터(TreeFormatter/ArrayFormatter)로
 * 에러 경로를 구조화하여 디버깅 가능성을 높입니다.
 */
export const decodeWithBadRequest = <A, I>(
  schema: Schema.Schema<A, I>,
  data: unknown,
): Effect.Effect<A, BadRequestError> =>
  Effect.mapError(
    Schema.decodeUnknown(schema)(data),
    error =>
      new BadRequestError({
        message: ParseResult.TreeFormatter.formatErrorSync(error),
        validationErrors: ParseResult.ArrayFormatter.formatErrorSync(error).map(
          issue =>
            `${issue.path.length > 0 ? issue.path.join('.') : '(root)'}: ${issue.message}`,
        ),
      }),
  );

/**
 * stringDateTransfer를 Effect로 감싸 InvalidDateError가 Defect가 되지 않도록 합니다.
 */
export const safeDateTransfer = (
  value: string | Date | undefined,
): Effect.Effect<Date | undefined, InvalidDateError> =>
  value != null
    ? Effect.try({
        try: () => stringDateTransfer(value),
        catch: error =>
          error instanceof InvalidDateError
            ? error
            : new InvalidDateError({
                message: error instanceof Error ? error.message : String(error),
              }),
      })
    : Effect.succeed<Date | undefined>(undefined);

/**
 * formatWithTransfer를 Effect로 감싸 InvalidDateError가 Defect가 되지 않도록 합니다.
 */
export const safeFormatWithTransfer = (
  value: string | Date,
): Effect.Effect<string, InvalidDateError> =>
  Effect.try({
    try: () => formatWithTransfer(value),
    catch: error =>
      error instanceof InvalidDateError
        ? error
        : new InvalidDateError({
            message: error instanceof Error ? error.message : String(error),
          }),
  });

/**
 * finalize 함수 호출을 Effect로 감싸 InvalidDateError가 Defect가 되지 않도록 합니다.
 */
export const safeFinalize = <T>(
  fn: () => T,
): Effect.Effect<T, BadRequestError | InvalidDateError> =>
  Effect.try({
    try: fn,
    catch: error =>
      error instanceof InvalidDateError
        ? error
        : new BadRequestError({
            message: error instanceof Error ? error.message : String(error),
          }),
  });

const stringifyResponseBody = (data: unknown): string | undefined => {
  if (data === undefined) return undefined;
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch (err) {
    // circular / BigInt 등 직렬화 실패를 silent 하게 버리지 않고
    // 최소한 실패 사유와 타입 태그를 운영 로그에서 확인할 수 있도록 둔다.
    const reason = err instanceof Error ? err.message : String(err);
    return `[unserializable: ${reason}] ${Object.prototype.toString.call(data)}`;
  }
};

/**
 * URL에서 PII가 실릴 수 있는 모든 부분(query, fragment, userinfo)을 redact 한다.
 * SOLAPI 조회 API는 `to`, `from`, `startDate` 등을 query string에 싣고,
 * 소비자가 전달한 URL에 userinfo가 포함될 여지도 있으므로 모두 제거한다.
 */
export const redactUrlForProduction = (
  url: string | undefined,
): string | undefined => {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    const hadQuery = parsed.search.length > 0;
    parsed.search = hadQuery ? '?[redacted]' : '';
    parsed.hash = '';
    parsed.username = '';
    parsed.password = '';
    return parsed.toString();
  } catch {
    // 파싱 불가한 상대/비정상 URL은 보수적으로 첫 구분자 이후 전부 마스킹
    const cut = url.search(/[?#;]/);
    return cut === -1 ? url : `${url.slice(0, cut)}?[redacted]`;
  }
};

/**
 * PII 보호 gate는 safe-by-default: 명시적으로 개발자 환경(development/test)일 때만
 * 상세 정보를 노출한다. 운영/스테이징/NODE_ENV 미설정 환경은 모두 redact 경로를 탄다 —
 * 원본 값이 로그/Sentry 등으로 유출되지 않도록 하기 위함.
 *
 * NODE_ENV는 `.trim().toLowerCase()`로 정규화해 Windows PowerShell 등에서 흔한
 * `Development` 오타를 verbose 모드로 인식하도록 한다.
 */
export const shouldRedactSensitive = (): boolean => {
  const env = process.env.NODE_ENV?.trim().toLowerCase();
  return env !== 'development' && env !== 'test';
};

/**
 * API 응답 body를 Effect Schema로 런타임 검증하고 실패 시 ResponseSchemaMismatchError로 래핑.
 * 서버가 예고 없이 응답 구조를 바꾼 경우 소비자 측에서 조용히 undefined로 터지는 대신
 * 스키마 불일치 위치(ArrayFormatter issue path)와 원본 responseBody를 함께 보존하여
 * 운영 환경에서도 재현 가능하게 한다.
 *
 * Schema는 requirement 채널을 never로 제한 — 외부 서비스를 요구하는 transform을 금지하여
 * 응답 디코딩이 항상 순수하게 끝나도록 강제한다.
 */
export const decodeServerResponse = <A, I>(
  schema: Schema.Schema<A, I, never>,
  data: unknown,
  context?: {url?: string},
): Effect.Effect<A, ResponseSchemaMismatchError> =>
  // onExcessProperty: 'preserve' — 서버가 추가로 내려준 미선언 필드를 strip 하지 않는다.
  // 부분 스키마로 검증하는 조회 엔드포인트에서 필드 조용히 사라지는 silent data loss를 방지.
  Effect.mapError(
    Schema.decodeUnknown(schema, {onExcessProperty: 'preserve'})(data),
    err => {
      // PII 누출을 차단한다 (safe-by-default: development/test 외에는 모두 redact):
      // - responseBody: 원본 payload에 전화번호/계정 데이터가 실릴 수 있음
      // - validationErrors 메시지: ParseResult 포맷터는 기대치와 함께 *실제 값*을 문자열로 삽입함
      // - url: getMessages 등 조회 API는 to/from 등 전화번호를 query string에 실음
      // Sentry 등은 toString() 대신 enumerable 필드를 직렬화하므로 creation 단계에서 제거해야 안전.
      const redact = shouldRedactSensitive();
      const issues = ParseResult.ArrayFormatter.formatErrorSync(err);
      return new ResponseSchemaMismatchError({
        message: redact
          ? `Response schema mismatch on ${issues.length} field(s)`
          : ParseResult.TreeFormatter.formatErrorSync(err),
        validationErrors: issues.map(issue => {
          const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
          return redact
            ? `${path}: [${issue._tag}]`
            : `${path}: ${issue.message}`;
        }),
        url: redact ? redactUrlForProduction(context?.url) : context?.url,
        responseBody: redact ? undefined : stringifyResponseBody(data),
      });
    },
  );
