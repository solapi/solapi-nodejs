import {ParseResult, Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {
  BadRequestError,
  InvalidDateError,
  ServerError,
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

/**
 * API 응답 body를 Effect Schema로 런타임 검증하고 실패 시 ServerError로 래핑.
 * 서버가 예고 없이 응답 구조를 바꾼 경우 소비자 측에서 조용히 undefined로 터지는 대신
 * 스키마 불일치 위치를 즉시 파악할 수 있도록 한다.
 */
export const decodeServerResponse = <A, I>(
  schema: Schema.Schema<A, I>,
  data: unknown,
  context?: {url?: string; httpStatus?: number},
): Effect.Effect<A, ServerError> =>
  Effect.mapError(
    Schema.decodeUnknown(schema)(data),
    err =>
      new ServerError({
        errorCode: 'ResponseSchemaMismatch',
        errorMessage: ParseResult.TreeFormatter.formatErrorSync(err),
        httpStatus: context?.httpStatus ?? 200,
        url: context?.url,
      }),
  );
