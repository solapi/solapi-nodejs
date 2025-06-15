import {DateOperatorType} from '@internal-types/commonTypes';

/**
 * @description GET API 중 일부 파라미터 조회 시 필요한 객체
 * @see https://docs.solapi.com/api-reference/overview#operator
 */
export type DatePayloadType = {
  [key in DateOperatorType]?: string | Date;
};
