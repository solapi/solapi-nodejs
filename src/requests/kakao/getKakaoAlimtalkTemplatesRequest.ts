import {KakaoAlimtalkTemplateStatus} from '../../models/kakao/kakaoAlimtalkTemplate';
import {DatePayloadType} from '../messageRequest';
import {formatWithTransfer} from '../../lib/stringDateTrasnfer';

/**
 * @name GetKakaoAlimtalkTemplatesRequest
 * @description 카카오 알림톡 조회를 위한 요청 타입
 */
export interface GetKakaoAlimtalkTemplatesRequest {
  /**
   * @description 알림톡 템플릿 제목
   */
  name?: string;

  /**
   * @description 카카오 비즈니스 채널 ID
   */
  channelId?: string;

  /**
   * @description 카카오 알림톡 템플릿 ID
   */
  templateId?: string;

  /**
   * @description 숨긴 템플릿 여부 확인
   */
  isHidden?: boolean;

  /**
   * @description 알림톡 템플릿 상태
   */
  status?: KakaoAlimtalkTemplateStatus;

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

export class GetKakaoAlimtalkTemplatesFinalizeRequest {
  channelId?: string;
  isHidden?: boolean;
  limit?: number;
  name?: string;
  startKey?: string;
  status?: KakaoAlimtalkTemplateStatus;
  templateId?: string;
  dateCreated?: DatePayloadType;

  constructor(parameter: GetKakaoAlimtalkTemplatesRequest) {
    this.channelId = parameter.channelId;
    this.isHidden = parameter.isHidden;
    this.name = parameter.name;
    this.startKey = parameter.startKey;
    this.status = parameter.status;
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
