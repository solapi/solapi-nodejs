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
 * BMS 커머스 가격 조합 검증
 *
 * 카카오 BMS 커머스 타입은 다음 가격 조합만 허용합니다:
 * 1. regularPrice만 사용 (정가만 표기)
 * 2. regularPrice + discountPrice + discountRate (할인율 표기)
 * 3. regularPrice + discountPrice + discountFixed (정액 할인 표기)
 *
 * discountRate와 discountFixed를 동시에 사용하거나,
 * discountPrice 없이 discountRate/discountFixed만 사용하는 것은 허용되지 않습니다.
 */
const validateCommercePricingCombination = (commerce: {
  regularPrice: number;
  discountPrice?: number;
  discountRate?: number;
  discountFixed?: number;
}): boolean | string => {
  const hasDiscountPrice = commerce.discountPrice !== undefined;
  const hasDiscountRate = commerce.discountRate !== undefined;
  const hasDiscountFixed = commerce.discountFixed !== undefined;

  // Case 1: regularPrice만 사용 (정가만 표기) - valid
  if (!hasDiscountPrice && !hasDiscountRate && !hasDiscountFixed) {
    return true;
  }

  // Case 2: regularPrice + discountPrice + discountRate (할인율 표기) - valid
  if (hasDiscountPrice && hasDiscountRate && !hasDiscountFixed) {
    return true;
  }

  // Case 3: regularPrice + discountPrice + discountFixed (정액 할인 표기) - valid
  if (hasDiscountPrice && hasDiscountFixed && !hasDiscountRate) {
    return true;
  }

  // Invalid combinations
  if (hasDiscountRate && hasDiscountFixed) {
    return 'discountRate와 discountFixed는 동시에 사용할 수 없습니다. 할인율(discountRate) 또는 정액할인(discountFixed) 중 하나만 선택하세요.';
  }

  if (!hasDiscountPrice && (hasDiscountRate || hasDiscountFixed)) {
    return 'discountRate 또는 discountFixed를 사용하려면 discountPrice(할인가)도 함께 지정해야 합니다.';
  }

  // discountPrice만 있는 경우 (discountRate/discountFixed 없음)
  if (hasDiscountPrice && !hasDiscountRate && !hasDiscountFixed) {
    return 'discountPrice를 사용하려면 discountRate(할인율) 또는 discountFixed(정액할인) 중 하나를 함께 지정해야 합니다.';
  }

  return '알 수 없는 가격 조합입니다. regularPrice만 사용하거나, regularPrice + discountPrice + discountRate/discountFixed 조합을 사용하세요.';
};

/**
 * BMS 커머스 정보 스키마
 * - title: 상품명 (필수)
 * - regularPrice: 정가 (필수, 숫자 또는 숫자형 문자열)
 * - discountPrice: 할인가 (선택, 숫자 또는 숫자형 문자열)
 * - discountRate: 할인율 (선택, 숫자 또는 숫자형 문자열)
 * - discountFixed: 고정 할인금액 (선택, 숫자 또는 숫자형 문자열)
 *
 * 가격 조합 규칙:
 * - regularPrice만 사용 (정가만 표기)
 * - regularPrice + discountPrice + discountRate (할인율 표기)
 * - regularPrice + discountPrice + discountFixed (정액 할인 표기)
 */
export const bmsCommerceSchema = Schema.Struct({
  title: Schema.String,
  regularPrice: NumberOrNumericString,
  discountPrice: Schema.optional(NumberOrNumericString),
  discountRate: Schema.optional(NumberOrNumericString),
  discountFixed: Schema.optional(NumberOrNumericString),
}).pipe(Schema.filter(validateCommercePricingCombination));

export type BmsCommerceSchema = Schema.Schema.Type<typeof bmsCommerceSchema>;
