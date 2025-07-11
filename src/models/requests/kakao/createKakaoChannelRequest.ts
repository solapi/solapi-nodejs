/**
 * 카카오 채널 인증 토큰 요청 타입
 */
export type CreateKakaoChannelTokenRequest = {
  /** 카카오 채널 검색용 아이디 */
  searchId: string;
  /** 카카오 채널 담당자 휴대전화 번호 */
  phoneNumber: string;
};

/**
 * 카카오 채널 생성 요청 타입
 */
export type CreateKakaoChannelRequest = {
  /** 카카오 채널 검색용 아이디 */
  searchId: string;
  /** 카카오 채널 담당자 휴대전화 번호 */
  phoneNumber: string;
  /** 카카오톡 채널 카테고리 코드 */
  categoryCode: string;
  /** CreateKakaoChannelTokenRequest 요청으로 받은 인증 토큰 */
  token: string;
};
