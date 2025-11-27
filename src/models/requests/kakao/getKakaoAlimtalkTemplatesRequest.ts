import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {KakaoAlimtalkTemplateStatus} from '../../base/kakao/kakaoAlimtalkTemplate';
import {DatePayloadType} from '../common/datePayload';

type GetKakaoAlimtalkTemplatesNameType =
  | {
      eq?: string;
      ne?: string;
      like?: never;
    }
  | {
      eq?: never;
      ne?: never;
      like: string;
    };

/**
 * @name GetKakaoAlimtalkTemplatesRequest
 * @description 카카오 알림톡 조회를 위한 요청 타입
 */
export interface GetKakaoAlimtalkTemplatesRequest {
  /**
   * @description 알림톡 템플릿 제목
   * 주의! like 프로퍼티가 들어가는 경우 eq와 ne는 무시됩니다.
   */
  name?: GetKakaoAlimtalkTemplatesNameType | string;

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
  name?: GetKakaoAlimtalkTemplatesNameType | string;
  startKey?: string;
  status?: KakaoAlimtalkTemplateStatus;
  templateId?: string;
  dateCreated?: DatePayloadType;

  constructor(parameter: GetKakaoAlimtalkTemplatesRequest) {
    this.channelId = parameter.channelId;
    this.isHidden = parameter.isHidden;
    this.templateId = parameter.templateId;
    if (parameter.name != undefined) {
      if (typeof parameter.name == 'string') {
        this.name = {
          like: parameter.name,
        };
      } else if (typeof parameter.name == 'object') {
        this.name = parameter.name;
      }
    }
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
