import {Cause, Effect, Exit} from 'effect';
import * as EffectError from '../errors/defaultError';
import {VariableValidationError} from '../models/base/kakao/kakaoOption';

// 에러 포맷팅을 위한 Effect 기반 유틸리티
export const formatError = (error: unknown): string => {
  // Effect Error 타입들 처리
  if (error instanceof EffectError.InvalidDateError) {
    return error.toString();
  }
  if (error instanceof EffectError.ApiKeyError) {
    return error.toString();
  }
  if (error instanceof EffectError.DefaultError) {
    return error.toString();
  }
  if (error instanceof EffectError.MessageNotReceivedError) {
    return error.toString();
  }
  if (error instanceof EffectError.BadRequestError) {
    return error.toString();
  }
  if (error instanceof EffectError.NetworkError) {
    return error.toString();
  }
  if (error instanceof EffectError.ApiError) {
    return error.toString();
  }
  if (error instanceof VariableValidationError) {
    return error.toString();
  }

  // 일반 Error 처리
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
};

// Effect Cause를 프로덕션용으로 포맷팅
export const formatCauseForProduction = (
  cause: Cause.Cause<unknown>,
): string => {
  const failure = Cause.failureOption(cause);
  if (failure._tag === 'Some') {
    return formatError(failure.value);
  }
  return 'Unknown error occurred';
};

// 프로그램을 깔끔하게 종료하는 커스텀 에러 (Error를 상속하지 않음)
class ApplicationFailure {
  readonly _tag = 'ApplicationFailure';
  constructor(
    public readonly message: string,
    public readonly exitCode: number = 1,
  ) {}

  toString(): string {
    return this.message;
  }

  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return this.message;
  }
}

// 깔끔한 실패 객체 생성
const createApplicationFailure = (message: string): ApplicationFailure => {
  return new ApplicationFailure(message);
};

// uncaughtException 핸들러 설정 (한 번만 설정)
let handlerRegistered = false;
const setupCleanErrorHandler = () => {
  if (!handlerRegistered) {
    process.on('uncaughtException', error => {
      if (error instanceof ApplicationFailure) {
        // 깔끔한 에러 메시지만 출력하고 종료
        console.error(error.message);
        process.exit(error.exitCode);
      } else {
        // 다른 예상치 못한 에러는 기본 처리
        console.error(error);
        process.exit(1);
      }
    });
    handlerRegistered = true;
  }
};

// Effect 프로그램의 실행 결과를 안전하게 처리
export const runSafeSync = <E, A>(effect: Effect.Effect<A, E>): A => {
  setupCleanErrorHandler();

  const exit = Effect.runSyncExit(effect);

  return Exit.match(exit, {
    onFailure: cause => {
      const formattedError = formatCauseForProduction(cause);
      const failure = createApplicationFailure(formattedError);
      throw failure;
    },
    onSuccess: value => value,
  });
};

// Promise로 Effect 실행하면서 에러 포맷팅
export const runSafePromise = <E, A>(
  effect: Effect.Effect<A, E>,
): Promise<A> => {
  setupCleanErrorHandler();

  return Effect.runPromiseExit(effect).then(
    Exit.match({
      onFailure: cause => {
        const formattedError = formatCauseForProduction(cause);
        const failure = createApplicationFailure(formattedError);
        return Promise.reject(failure);
      },
      onSuccess: value => Promise.resolve(value),
    }),
  );
};

// MessageNotReceivedError의 프로퍼티를 포함한 확장 Error 타입
interface MessageNotReceivedErrorCompat extends Error {
  readonly failedMessageList: ReadonlyArray<
    import('../models/responses/sendManyDetailResponse').FailedMessage
  >;
  readonly totalCount: number;
}

// Effect 에러를 기존 Error로 변환 (하위 호환성)
export const toCompatibleError = (effectError: unknown): Error => {
  // MessageNotReceivedError의 경우 특별 처리하여 원본 프로퍼티 보존
  if (effectError instanceof EffectError.MessageNotReceivedError) {
    const error = new Error(
      effectError.message,
    ) as MessageNotReceivedErrorCompat;
    error.name = 'MessageNotReceivedError';
    // failedMessageList와 totalCount 프로퍼티 보존
    Object.defineProperty(error, 'failedMessageList', {
      value: effectError.failedMessageList,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    Object.defineProperty(error, 'totalCount', {
      value: effectError.totalCount,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    delete error.stack;
    return error;
  }

  const formatted = formatError(effectError);
  // 하위 호환성을 위해 여전히 Error 사용하지만 스택 제거
  const error = new Error(formatted);
  error.name = 'FromSolapiError';
  delete error.stack;
  return error;
};
