import {Data, Effect, Array as EffectArray, pipe, Schema} from 'effect';
import {runSafeSync} from '../../../lib/effectErrorHandler';
import {kakaoOptionRequest} from '../../requests/kakao/kakaoOptionRequest';
import {KakaoButton, kakaoButtonSchema} from './kakaoButton';

// Effect Data 타입을 활용한 에러 클래스
export class VariableValidationError extends Data.TaggedError(
  'VariableValidationError',
)<{
  readonly invalidVariables: ReadonlyArray<string>;
}> {
  toString(): string {
    const variableList = this.invalidVariables.map(v => `\`${v}\``).join(', ');
    return `변수명 ${variableList}에 점(.)을 포함할 수 없습니다. 언더스코어(_)나 다른 문자를 사용해주세요.`;
  }
}

const kakaoOptionBmsSchema = Schema.Struct({
  targeting: Schema.Literal('I', 'M', 'N'),
});

// Constants for variable validation
const VARIABLE_KEY_PATTERN = /^#\{.+}$/;
const DOT_PATTERN = /\./;

// Pure helper functions optimized with Effect
const extractVariableName = (key: string): string =>
  VARIABLE_KEY_PATTERN.test(key) ? key.slice(2, -1) : key;

const formatVariableKey = (key: string): string =>
  VARIABLE_KEY_PATTERN.test(key) ? key : `#{${key}}`;

// Effect-based validation that returns Either instead of throwing
export const validateVariableNames = (
  variables: Record<string, string>,
): Effect.Effect<Record<string, string>, VariableValidationError> =>
  pipe(
    Object.keys(variables),
    EffectArray.map(extractVariableName),
    EffectArray.filter(variableName => DOT_PATTERN.test(variableName)),
    invalidVariables =>
      invalidVariables.length > 0
        ? Effect.fail(new VariableValidationError({invalidVariables}))
        : Effect.succeed(variables),
  );

// Optimized transformation function using Effect pipeline
export const transformVariables = (
  variables: Record<string, string>,
): Effect.Effect<Record<string, string>, VariableValidationError> =>
  pipe(
    validateVariableNames(variables),
    Effect.map(validVariables =>
      pipe(
        Object.entries(validVariables),
        EffectArray.map(
          ([key, value]) => [formatVariableKey(key), value] as const,
        ),
        entries => Object.fromEntries(entries),
      ),
    ),
  );

export const baseKakaoOptionSchema = Schema.Struct({
  pfId: Schema.String,
  templateId: Schema.optional(Schema.String),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}).pipe(
      Schema.transform(
        Schema.Record({key: Schema.String, value: Schema.String}),
        {
          decode: fromU => {
            // runSafeSync를 사용하여 깔끔한 에러 메시지 제공
            return runSafeSync(transformVariables(fromU));
          },
          encode: toI => toI,
        },
      ),
    ),
  ),
  disableSms: Schema.optional(Schema.Boolean),
  adFlag: Schema.optional(Schema.Boolean),
  imageId: Schema.optional(Schema.String),
  buttons: Schema.optional(Schema.Array(kakaoButtonSchema)),
  bms: Schema.optional(kakaoOptionBmsSchema),
});

export class KakaoOption {
  pfId: string;
  templateId?: string;
  variables?: Record<string, string>;
  disableSms?: boolean;
  adFlag?: boolean;
  buttons?: ReadonlyArray<KakaoButton>;
  imageId?: string;

  constructor(parameter: kakaoOptionRequest) {
    this.pfId = parameter.pfId;
    this.templateId = parameter.templateId;
    this.variables = parameter.variables;
    this.disableSms = parameter.disableSms;
    this.adFlag = parameter.adFlag;
    this.buttons = parameter.buttons;
    this.imageId = parameter.imageId;
  }
}
