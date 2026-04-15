import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {BadRequestError, InvalidDateError} from '../errors/defaultError';
import stringDateTransfer, {formatWithTransfer} from './stringDateTransfer';

/**
 * Schema 디코딩 + BadRequestError 변환을 결합한 Effect 헬퍼.
 * 서비스 레이어에서 반복되는 검증 패턴을 통일합니다.
 */
export const decodeWithBadRequest = <A, I>(
  schema: Schema.Schema<A, I>,
  data: unknown,
): Effect.Effect<A, BadRequestError> =>
  Effect.mapError(
    Schema.decodeUnknown(schema)(data),
    error =>
      new BadRequestError({
        message: error.message,
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
