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
    : Effect.void;

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
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch {
    return undefined;
  }
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
    err =>
      new ResponseSchemaMismatchError({
        message: ParseResult.TreeFormatter.formatErrorSync(err),
        validationErrors: ParseResult.ArrayFormatter.formatErrorSync(err).map(
          issue =>
            `${issue.path.length > 0 ? issue.path.join('.') : '(root)'}: ${issue.message}`,
        ),
        url: context?.url,
        responseBody: stringifyResponseBody(data),
      }),
  );
