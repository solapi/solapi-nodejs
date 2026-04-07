import {Schema} from 'effect';
import * as Effect from 'effect/Effect';
import {BadRequestError} from '../errors/defaultError';

/**
 * Schema 디코딩 + BadRequestError 변환을 결합한 Effect 헬퍼.
 * 서비스 레이어에서 반복되는 검증 패턴을 통일합니다.
 */
export const decodeWithBadRequest = <A, I>(
  schema: Schema.Schema<A, I>,
  data: unknown,
): Effect.Effect<A, BadRequestError> =>
  Effect.try({
    try: () => Schema.decodeUnknownSync(schema)(data),
    catch: error =>
      new BadRequestError({
        message: error instanceof Error ? error.message : String(error),
      }),
  });
