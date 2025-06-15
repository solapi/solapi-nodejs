import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {DatePayloadType} from '../common/datePayload';

export interface GetBlacksRequest {
  /**
   * @description 080 수신거부를 요청한 수신번호
   */
  senderNumber?: string;

  /**
   * @description 페이지네이션 조회 키
   */
  startKey?: string;

  /**
   * @description 조회 시 제한할 건 수 (기본: 20, 최대: 500)
   */
  limit?: number;

  /**
   * @description 조회할 시작 날짜
   */
  startDate?: string | Date;

  /**
   * @description 조회할 종료 날짜
   */
  endDate?: string | Date;
}

export class GetBlacksFinalizeRequest implements GetBlacksRequest {
  type = 'DENIAL' as const;
  senderNumber?: string;
  startKey?: string;
  limit?: number;
  dateCreated?: DatePayloadType;

  constructor(parameter: GetBlacksRequest) {
    this.type = 'DENIAL';
    this.senderNumber = parameter.senderNumber;
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;

    if (parameter.startDate != undefined) {
      this.dateCreated = Object.assign(this.dateCreated ?? {}, {
        gte: formatWithTransfer(parameter.startDate),
      });
    }
    if (parameter.endDate != undefined) {
      this.dateCreated = Object.assign(this.dateCreated ?? {}, {
        lte: formatWithTransfer(parameter.endDate),
      });
    }
  }
}
