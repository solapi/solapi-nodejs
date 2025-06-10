/**
 * qs.stringify와 동일한 기능을 제공하는 헬퍼 함수
 * @param obj 직렬화할 객체
 * @param options 옵션 객체
 * @returns 쿼리 스트링
 */
export default function stringifyQuery(
  obj: object | undefined | null,
  options: {indices?: boolean; addQueryPrefix?: boolean} = {},
): string {
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  // 빈 객체인 경우 빈 문자열 반환
  if (Object.keys(obj).length === 0) {
    return options.addQueryPrefix ? '?' : '';
  }

  // 배열 처리를 위한 함수
  const processValue = (key: string, value: unknown): string[] => {
    if (Array.isArray(value)) {
      if (options.indices === false) {
        // indices: false인 경우 배열 인덱스 없이 처리
        return value.map(
          item =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
        );
      } else {
        // 기본적으로 배열 인덱스 포함
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

  if (options.addQueryPrefix && queryString) {
    return `?${queryString}`;
  }

  return queryString;
}
