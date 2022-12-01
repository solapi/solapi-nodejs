import {DatePayloadType} from '../messageRequest';
import {formatWithTransfer} from '../../lib/stringDateTrasnfer';

/**
 * @name GetKakaoChannelsRequest
 * @description 카카오 채널 목록 조회를 위한 요청 타입
 */
export interface GetKakaoChannelsRequest {
  /**
   * @description 카카오 채널 ID(구 pfId)
   */
  channelId?: string;

  /**
   * @description 카카오 채널 검색용 아이디
   */
  searchId?: string;

  /**
   * @description 카카오 채널 담당자 휴대전화 번호
   */
  phoneNumber?: string;

  /**
   * @description 카카오톡 채널 카테고리 코드
   */
  categoryCode?: string;

  /**
   * @description 페이지네이션 조회 키
   */
  startKey?: string;

  /**
   * @description 조회 시 제한할 건 수 (기본: 20, 최대: 500)
   */
  limit?: number;

  /**
   * @description 공유받은 채널 여부 조회(true일 경우 공유받지 않은 본인 채널만 조회)
   */
  isMine?: boolean;

  /**
   * @description 조회할 시작 날짜
   */
  startDate?: string | Date;

  /**
   * @description 조회할 종료 날짜
   */
  endDate?: string | Date;
}

export class GetKakaoChannelsFinalizeRequest {
  channelId?: string;
  searchId?: string;
  phoneNumber?: string;
  categoryCode?: string;
  startKey?: string;
  limit?: number;
  isMine?: boolean;
  dateCreated?: DatePayloadType;

  constructor(parameter: GetKakaoChannelsRequest) {
    this.channelId = parameter.channelId;
    this.searchId = parameter.searchId;
    this.phoneNumber = parameter.phoneNumber;
    this.categoryCode = parameter.categoryCode;
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;
    this.isMine = parameter.isMine;

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
