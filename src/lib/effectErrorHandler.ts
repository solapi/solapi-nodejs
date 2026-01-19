import {Cause, Chunk, Effect, Exit} from 'effect';
import {VariableValidationError} from '@/models/base/kakao/kakaoOption';
import * as EffectError from '../errors/defaultError';

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
  if (error instanceof EffectError.ClientError) {
    return error.toString();
  }
  if (error instanceof EffectError.ServerError) {
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

/**
 * Defect(예측되지 않은 에러)에서 정보 추출
 */
const extractDefectInfo = (
  defect: unknown,
): {summary: string; details: string} => {
  // Effect Tagged Error인 경우
  if (defect && typeof defect === 'object' && '_tag' in defect) {
    const tag = (defect as {_tag: string})._tag;
    const message =
      'message' in defect ? String((defect as {message: unknown}).message) : '';
    return {
      summary: `${tag}${message ? `: ${message}` : ''}`,
      details: `Tagged Error [${tag}]: ${JSON.stringify(defect, null, 2)}`,
    };
  }

  // 일반 객체인 경우
  if (defect !== null && typeof defect === 'object') {
    const keys = Object.keys(defect);
    const summary =
      keys.length > 0
        ? `Object with keys: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`
        : 'Empty object';
    return {
      summary,
      details: JSON.stringify(defect, null, 2),
    };
  }

  return {
    summary: String(defect),
    details: `Value (${typeof defect}): ${String(defect)}`,
  };
};

// Effect Cause를 프로덕션용으로 포맷팅
export const formatCauseForProduction = (
  cause: Cause.Cause<unknown>,
): string => {
  const failure = Cause.failureOption(cause);
  if (failure._tag === 'Some') {
    return formatError(failure.value);
  }

  // Defect 정보도 포함
  const defects = Cause.defects(cause);
  if (defects.length > 0) {
    const firstDefect = Chunk.unsafeGet(defects, 0);
    const info = extractDefectInfo(firstDefect);
    return `Unexpected error: ${info.summary}`;
  }

  return 'Effect execution failed';
};

// Effect 프로그램의 실행 결과를 안전하게 처리
export const runSafeSync = <E, A>(effect: Effect.Effect<A, E>): A => {
  const exit = Effect.runSyncExit(effect);

  return Exit.match(exit, {
    onFailure: cause => {
      const failure = Cause.failureOption(cause);
      if (failure._tag === 'Some') {
        throw toCompatibleError(failure.value);
      }
      // 예측되지 않은 예외(Defect)인지 확인
      const defects = Cause.defects(cause);
      if (defects.length > 0) {
        const firstDefect = Chunk.unsafeGet(defects, 0);
        if (firstDefect instanceof Error) {
          throw firstDefect;
        }
        const isProduction = process.env.NODE_ENV === 'production';
        const defectInfo = extractDefectInfo(firstDefect);
        const message = isProduction
          ? `Unexpected error: ${defectInfo.summary}`
          : `Unexpected error: ${defectInfo.details}\nCause: ${Cause.pretty(cause)}`;
        const error = new Error(message);
        error.name = 'UnexpectedDefectError';
        throw error;
      }
      // 그 외 (예: 중단)의 경우
      const isProduction = process.env.NODE_ENV === 'production';
      const message = isProduction
        ? 'Effect execution failed unexpectedly'
        : `Unhandled Effect Exit:\n${Cause.pretty(cause)}`;
      const error = new Error(message);
      error.name = 'UnhandledExitError';
      throw error;
    },
    onSuccess: value => value,
  });
};

// Promise로 Effect 실행하면서 에러 포맷팅
export const runSafePromise = <E, A>(
  effect: Effect.Effect<A, E>,
): Promise<A> => {
  return Effect.runPromiseExit(effect).then(
    Exit.match({
      onFailure: cause => {
        // 1. 예측된 실패(Failure)인지 확인
        const failure = Cause.failureOption(cause);
        if (failure._tag === 'Some') {
          return Promise.reject(toCompatibleError(failure.value));
        }

        // 2. 예측되지 않은 예외(Defect)인지 확인
        const defects = Cause.defects(cause);
        if (defects.length > 0) {
          const firstDefect = Chunk.unsafeGet(defects, 0);
          if (firstDefect instanceof Error) {
            return Promise.reject(firstDefect);
          }
          const isProduction = process.env.NODE_ENV === 'production';
          const defectInfo = extractDefectInfo(firstDefect);
          const message = isProduction
            ? `Unexpected error: ${defectInfo.summary}`
            : `Unexpected error: ${defectInfo.details}\nCause: ${Cause.pretty(cause)}`;
          const error = new Error(message);
          error.name = 'UnexpectedDefectError';
          return Promise.reject(error);
        }

        // 3. 그 외 (예: 중단)의 경우
        const isProduction = process.env.NODE_ENV === 'production';
        const message = isProduction
          ? 'Effect execution failed unexpectedly'
          : `Unhandled Effect Exit:\n${Cause.pretty(cause)}`;
        const error = new Error(message);
        error.name = 'UnhandledExitError';
        return Promise.reject(error);
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
  const isProduction = process.env.NODE_ENV === 'production';

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
    if (isProduction) {
      delete error.stack;
    }
    return error;
  }

  // ClientError 보존 (하위 호환성을 위해 error.name은 'ApiError' 유지)
  if (effectError instanceof EffectError.ClientError) {
    const error = new Error(effectError.toString());
    error.name = 'ApiError'; // 하위 호환성
    Object.defineProperties(error, {
      errorCode: {
        value: effectError.errorCode,
        writable: false,
        enumerable: true,
      },
      errorMessage: {
        value: effectError.errorMessage,
        writable: false,
        enumerable: true,
      },
      httpStatus: {
        value: effectError.httpStatus,
        writable: false,
        enumerable: true,
      },
      url: {value: effectError.url, writable: false, enumerable: true},
    });
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // ServerError 보존
  if (effectError instanceof EffectError.ServerError) {
    const error = new Error(effectError.toString());
    error.name = 'ServerError';
    const props: PropertyDescriptorMap = {
      errorCode: {
        value: effectError.errorCode,
        writable: false,
        enumerable: true,
      },
      errorMessage: {
        value: effectError.errorMessage,
        writable: false,
        enumerable: true,
      },
      httpStatus: {
        value: effectError.httpStatus,
        writable: false,
        enumerable: true,
      },
      url: {value: effectError.url, writable: false, enumerable: true},
    };
    // 개발환경에서만 responseBody 포함
    if (!isProduction && effectError.responseBody) {
      props.responseBody = {
        value: effectError.responseBody,
        writable: false,
        enumerable: true,
      };
    }
    Object.defineProperties(error, props);
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // DefaultError 보존
  if (effectError instanceof EffectError.DefaultError) {
    const error = new Error(effectError.toString());
    error.name = 'DefaultError';
    Object.defineProperties(error, {
      errorCode: {
        value: effectError.errorCode,
        writable: false,
        enumerable: true,
      },
      errorMessage: {
        value: effectError.errorMessage,
        writable: false,
        enumerable: true,
      },
      context: {value: effectError.context, writable: false, enumerable: true},
    });
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // NetworkError 보존
  if (effectError instanceof EffectError.NetworkError) {
    const error = new Error(effectError.toString());
    error.name = 'NetworkError';
    Object.defineProperties(error, {
      url: {value: effectError.url, writable: false, enumerable: true},
      method: {value: effectError.method, writable: false, enumerable: true},
      cause: {value: effectError.cause, writable: false, enumerable: true},
      isRetryable: {
        value: effectError.isRetryable ?? false,
        writable: false,
        enumerable: true,
      },
    });
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // BadRequestError 보존
  if (effectError instanceof EffectError.BadRequestError) {
    const error = new Error(effectError.message);
    error.name = 'BadRequestError';
    Object.defineProperties(error, {
      validationErrors: {
        value: effectError.validationErrors,
        writable: false,
        enumerable: true,
      },
    });
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // VariableValidationError 보존
  if (effectError instanceof VariableValidationError) {
    const error = new Error(effectError.toString());
    error.name = 'VariableValidationError';
    Object.defineProperties(error, {
      invalidVariables: {
        value: effectError.invalidVariables,
        writable: false,
        enumerable: true,
      },
    });
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // InvalidDateError
  if (effectError instanceof EffectError.InvalidDateError) {
    const error = new Error(effectError.toString());
    error.name = 'InvalidDateError';
    Object.defineProperties(error, {
      originalValue: {
        value: effectError.originalValue,
        writable: false,
        enumerable: true,
      },
    });
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // ApiKeyError
  if (effectError instanceof EffectError.ApiKeyError) {
    const error = new Error(effectError.toString());
    error.name = 'ApiKeyError';
    if (isProduction) {
      delete (error as Error).stack;
    }
    return error;
  }

  // Unknown 에러 타입에 대한 개선된 처리
  // Tagged Error 확인 (_tag 속성 존재 여부)
  if (effectError && typeof effectError === 'object' && '_tag' in effectError) {
    const taggedError = effectError as {_tag: string};
    const formatted = formatError(effectError);
    const error = new Error(formatted);
    error.name = `UnknownTaggedError_${taggedError._tag}`;
    if (!isProduction) {
      Object.defineProperty(error, 'originalError', {
        value: effectError,
        writable: false,
        enumerable: true,
      });
    }
    if (isProduction) {
      delete error.stack;
    }
    return error;
  }

  const formatted = formatError(effectError);
  const error = new Error(formatted);
  error.name = 'UnknownSolapiError';
  if (!isProduction) {
    Object.defineProperty(error, 'originalError', {
      value: effectError,
      writable: false,
      enumerable: true,
    });
  }
  if (isProduction) {
    delete error.stack;
  }
  return error;
};
