import stringDateTransfer from '../../lib/stringDateTrasnfer';

/**
 * @description 카카오 채널 카테고리 타입
 * @property code 카테고리 코드번호
 * @property name 카테고리 설명(이름)
 */
export type KakaoChannelCategory = {
  code: string;
  name: string;
};

export interface KakaoChannelInterface {
  channelId: string;
  searchId: string;
  accountId: string;
  phoneNumber: string;
  sharedAccountIds: Array<string>;
  dateCreated?: string | Date;
  dateUpdated?: string | Date;
}

/**
 * @description 카카오 채널
 * @property channelId 카카오 채널 고유 ID, SOLAPI 내부 식별용
 * @property searchId 카카오 채널 검색용 아이디, 채널명이 아님
 * @property accountId 계정 고유번호
 * @property phoneNumber 카카오 채널 담당자 휴대전화 번호
 * @property sharedAccountIds 카카오 채널을 공유한 SOLAPI 계정 고유번호 목록
 * @property dateCreated 카카오 채널 생성일자(연동일자)
 * @property dateUpdated 카카오 채널 정보 수정일자
 */
export class KakaoChannel implements KakaoChannelInterface {
  channelId: string;
  searchId: string;
  accountId: string;
  phoneNumber: string;
  sharedAccountIds: Array<string>;
  dateCreated?: Date;
  dateUpdated?: Date;

  constructor(parameter: KakaoChannelInterface) {
    this.channelId = parameter.channelId;
    this.searchId = parameter.searchId;
    this.accountId = parameter.accountId;
    this.phoneNumber = parameter.phoneNumber;
    this.sharedAccountIds = parameter.sharedAccountIds;
    if (parameter.dateCreated != undefined) {
      this.dateCreated = stringDateTransfer(parameter.dateCreated);
    }
    if (parameter.dateUpdated != undefined) {
      this.dateUpdated = stringDateTransfer(parameter.dateUpdated);
    }
  }
}
