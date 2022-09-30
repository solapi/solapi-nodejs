import {KakaoButton} from './kakaoButton';
import {KakaoAlimtalkTemplateStatus} from '../../types/commonTypes';

/**
 * @description 카카오 알림톡 템플릿 메시지 유형<br>
 * BA:기본형, EX:부가정보형, AD:광고추가형, MI: 복합형
 */
export type KakaoAlimtalkTemplateMessageType = 'BA' | 'EX' | 'AD' | 'MI'

/**
 * @description 카카오 알림톡 템플릿 강조 유형<br>
 * NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형
 */
export type KakaoAlimtalkTemplateEmphasizeType = 'NONE' | 'TEXT' | 'IMAGE'

/**
 * @description 카카오 알림톡 템플릿 그룹 유형(기본값은 Channel)
 */
type KakaoAlimtalkTemplateAssignType = 'CHANNEL' | 'GROUP'

type KakaoAlimtalkTemplateCommentType = {
    isAdmin: boolean
    memberId: string
    content: string
    dateCreated: string
}

type KakaoAlimtalkTemplateCodeType = {
    status: Omit<KakaoAlimtalkTemplateStatus, 'DELETED'>
    comments: Array<KakaoAlimtalkTemplateCommentType>
}

/**
 * @description 카카오 알림톡 템플릿 모델<br>
 * 알림톡 템플릿 자체의 정보는 아래 페이지를 참고해보세요!
 * @see https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide
 */
export class KakaoAlimtalkTemplate {
    /**
     * 카카오 비즈니스 채널 ID
     */
    channelId: string | null;

    /**
     * 카카오 비즈니스 채널 그룹 ID
     */
    channelGroupId: string | null;

    /**
     * 알림톡 템플릿 내용
     */
    content: string;

    /**
     * 알림톡 템플릿 숨김 여부
     */
    isHidden: boolean;

    /**
     * 알림톡 템플릿 메시지 유형
     */
    messageType: KakaoAlimtalkTemplateMessageType;

    /**
     * 강조 유형
     */
    emphasizeType: KakaoAlimtalkTemplateEmphasizeType;

    /**
     * 부가정보
     * 메시지 유형이 "부가정보형"또는 "복합형"일 경우 필수
     */
    extra: string | null;

    /**
     * 간단 광고 문구
     * 메시지 유형이 "광고추가형"또는 "복합형"일 경우 필수
     */
    ad: string | null;

    /**
     * 강조표기 핵심문구 (변수사용가능, emphasizeType이 TEXT일 경우 필수 값)
     * 템플릿 내용에 강조표기할 핵심문구가 동일하게 포함되어 있어야합니다.
     */
    emphasizeTitle: string | null;

    /**
     * 강조표기 보조문구(emphasizeType이 TEXT일 경우 필수 값)
     * 템플릿 내용에 강조표기할 보조문구가 동일하게 포함되어 있어야합니다.
     */
    emphasizeSubtitle: string | null;

    /**
     * PC 노출 여부
     * OTP, 보안 메시지의 경우 유저선택 무관 PC 미노출
     */
    securityFlag: boolean;

    /**
     * 템플릿에 사용되는 이미지 ID
     */
    imageId: string | null;

    /**
     * 카카오 알림톡 템플릿 그룹 유형
     */
    assignType: KakaoAlimtalkTemplateAssignType = 'CHANNEL';

    /**
     * 카카오 알림톡 템플릿 버튼 목록
     */
    buttons: Array<KakaoButton>;

    /**
     * 카카오 알림톡 템플릿 상태 현황목록
     */
    codes: Array<KakaoAlimtalkTemplateCodeType> | null;

    /**
     * 알림톡 템플릿 생성일자
     */
    dateCreated: string;

    /**
     * 알림톡 템플릿 수정일자
     */
    dateUpdated: string;
}
