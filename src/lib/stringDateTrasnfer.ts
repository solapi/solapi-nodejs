import {parseISO} from 'date-fns';
import {InvalidDateError} from '../errors/DefaultError';

/**
 * 일반 문자열 날짜가 있을 경우 Date 타입으로 변환해주는 함수
 * @param value 일반 문자열 날짜 또는 Date 타입의 날짜
 */
export default function stringDateTransfer(value: string | Date): Date {
    if (typeof value === 'string') {
        value = parseISO(value);
        const invalidDateText = 'Invalid Date';
        if (value.toString() === invalidDateText) {
            throw new InvalidDateError(invalidDateText);
        }
    }
    return value;
}
