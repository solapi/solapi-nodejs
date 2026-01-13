import {ParseResult, Schema} from 'effect';

/**
 * BMS 커머스 정보 타입
 */
export type BmsCommerce = {
  title: string;
  regularPrice: number;
  discountPrice?: number;
  discountRate?: number;
  discountFixed?: number;
};

/**
 * 숫자 또는 숫자형 문자열을 number로 변환하는 스키마
 * - number 타입: 그대로 통과
 * - string 타입: parseFloat로 변환, 유효하지 않으면 검증 실패
 *
 * API 호환성: 기존 number 입력 및 string 입력 모두 허용
 * 출력 타입: number
 *
 * Note: 타입 어설션을 사용하여 Encoded 타입을 number로 강제합니다.
 * 이는 기존 API 타입 호환성을 유지하면서 런타임에서 문자열 입력도 허용하기 위함입니다.
 */
const NumberOrNumericString: Schema.Schema<number, number> =
  Schema.transformOrFail(
    Schema.Union(Schema.Number, Schema.String),
    Schema.Number,
    {
      strict: true,
      decode: (input, _, ast) => {
        if (typeof input === 'number') {
          return ParseResult.succeed(input);
        }
        const trimmed = input.trim();
        if (trimmed === '') {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, '유효한 숫자 형식이 아닙니다.'),
          );
        }
        const parsed = parseFloat(input);
        if (Number.isNaN(parsed)) {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, '유효한 숫자 형식이 아닙니다.'),
          );
        }
        return ParseResult.succeed(parsed);
      },
      encode: n => ParseResult.succeed(n),
    },
  ) as Schema.Schema<number, number>;

/**
 * BMS 커머스 정보 스키마
 * - title: 상품명 (필수)
 * - regularPrice: 정가 (필수, 숫자 또는 숫자형 문자열)
 * - discountPrice: 할인가 (선택, 숫자 또는 숫자형 문자열)
 * - discountRate: 할인율 (선택, 숫자 또는 숫자형 문자열)
 * - discountFixed: 고정 할인금액 (선택, 숫자 또는 숫자형 문자열)
 */
export const bmsCommerceSchema = Schema.Struct({
  title: Schema.String,
  regularPrice: NumberOrNumericString,
  discountPrice: Schema.optional(NumberOrNumericString),
  discountRate: Schema.optional(NumberOrNumericString),
  discountFixed: Schema.optional(NumberOrNumericString),
});

export type BmsCommerceSchema = Schema.Schema.Type<typeof bmsCommerceSchema>;
