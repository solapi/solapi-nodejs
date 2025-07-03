/**
 * qs.stringify와 동일한 기능을 제공하는 헬퍼 함수
 *
 * @param obj 직렬화할 객체
 * @param options 옵션 객체
 * @param options.indices 배열에 인덱스를 포함할지 여부 (기본값: true)
 * @param options.addQueryPrefix 쿼리 문자열 앞에 '?'를 붙일지 여부 (기본값: true)
 * @returns 쿼리 스트링 (기본적으로 '?' 접두사 포함)
 *
 * @example
 * ```typescript
 * // 기본 사용 (? 접두사 포함)
 * stringifyQuery({limit: 10, status: 'active'}) // "?limit=10&status=active"
 *
 * // ? 접두사 제외
 * stringifyQuery({limit: 10}, {addQueryPrefix: false}) // "limit=10"
 *
 * // 배열 처리 (인덱스 포함)
 * stringifyQuery({tags: ['a', 'b']}) // "?tags[0]=a&tags[1]=b"
 *
 * // 배열 처리 (인덱스 제외)
 * stringifyQuery({tags: ['a', 'b']}, {indices: false}) // "?tags=a&tags=b"
 * ```
 */
export default function stringifyQuery(
  obj: object | undefined | null,
  options: {
    /** 배열에 인덱스를 포함할지 여부 (기본값: true) */
    indices?: boolean;
    /** 쿼리 문자열 앞에 '?'를 붙일지 여부 (기본값: true) */
    addQueryPrefix?: boolean;
  } = {},
): string {
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  // 빈 객체인 경우 빈 문자열 반환
  if (Object.keys(obj).length === 0) {
    return options.addQueryPrefix ? '?' : '';
  }

  // 배열 처리를 위한 내부 함수
  const processValue = (key: string, value: unknown): string[] => {
    if (Array.isArray(value)) {
      if (options.indices === false) {
        // indices: false인 경우 배열 인덱스 없이 처리
        return value.map(
          item =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
        );
      } else {
        // 기본값: 배열 인덱스 포함
        return value.map(
          (item, index) =>
            `${encodeURIComponent(key)}[${index}]=${encodeURIComponent(String(item))}`,
        );
      }
    } else if (value !== null && value !== undefined) {
      return [
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      ];
    }
    return [];
  };

  const pairs: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    pairs.push(...processValue(key, value));
  }

  const queryString = pairs.join('&');

  // 쿼리 스트링이 있으면 기본적으로 '?' 접두사를 붙임
  // addQueryPrefix가 명시적으로 false로 설정된 경우에만 접두사 없이 반환
  if (queryString) {
    return options.addQueryPrefix === false ? queryString : `?${queryString}`;
  }

  return '';
}
