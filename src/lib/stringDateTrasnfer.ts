import {formatISO, parseISO} from 'date-fns';
import {InvalidDateError} from '../errors/defaultError';

/**
 * @name formatWithTransfer stringDateTransfer와 formatISO를 한번에 실행하는 함수
 * @param value Date 타입의 날짜
 * @throws InvalidDateError
 */
export function formatWithTransfer(value: string | Date): string {
  return formatISO(stringDateTransfer(value));
}

/**
 * 일반 문자열 날짜가 있을 경우 Date 타입으로 변환해주는 함수
 * @param value 일반 문자열 날짜 또는 Date 타입의 날짜
 * @throws InvalidDateError
 */
export default function stringDateTransfer(value: string | Date): Date {
  if (typeof value === 'string') {
    const originalString = value;
    value = parseISO(originalString);
    const invalidDateText = 'Invalid Date';
    if (value.toString() === invalidDateText) {
      throw new InvalidDateError({
        message: invalidDateText,
        originalValue: originalString,
      });
    }
  }
  return value;
}
