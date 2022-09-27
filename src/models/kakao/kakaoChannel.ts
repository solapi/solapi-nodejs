/**
 * @description 카카오 채널 카테고리 타입
 * @property code 카테고리 코드번호
 * @property name 카테고리 설명(이름)
 */
export type KakaoChannelCategory = {
    code: string;
    name: string;
}

/**
 * @description 카카오 채널 카테고리 타입
 * @property code 카테고리 코드번호
 * @property name 카테고리 설명(이름)
 */
export type KakaoAlimtalkTemplateCategory = KakaoChannelCategory;

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
export type KakaoChannel = {
    channelId: string;
    searchId: string;
    accountId: string;
    phoneNumber: string;
    sharedAccountIds: Array<string>;
    dateCreated: string;
    dateUpdated: string;
}
