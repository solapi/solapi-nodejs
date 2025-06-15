import {z} from 'zod/v4';
import stringDateTransfer from '@lib/stringDateTrasnfer';
import {GetKakaoTemplateResponse} from '../../responses/kakao/getKakaoTemplateResponse';
import {
  KakaoAlimtalkTemplateQuickReply,
  kakaoAlimtalkTemplateQuickReplySchema,
} from './kakaoAlimtalkTemplateQuickReply';
import {KakaoButton, kakaoButtonSchema} from './kakaoButton';
import {KakaoChannelCategory} from './kakaoChannel';

/**
 * @description 카카오 채널 카테고리 타입
 * @property code 카테고리 코드번호
 * @property name 카테고리 설명(이름)
 */
export type KakaoAlimtalkTemplateCategory = KakaoChannelCategory;

/**
 * @description 카카오 알림톡 템플릿 메시지 유형<br>
 * BA:기본형, EX:부가정보형, AD:광고추가형, MI: 복합형
 */
export type KakaoAlimtalkTemplateMessageType = 'BA' | 'EX' | 'AD' | 'MI';

export const kakaoAlimtalkTemplateMessageTypeSchema = z.enum([
  'BA',
  'EX',
  'AD',
  'MI',
]);

/**
 * @description 카카오 알림톡 템플릿 강조 유형<br>
 * NONE: 선택안함, TEXT: 강조표기형, IMAGE: 이미지형, ITEM_LIST: 아이템리스트형
 */
export type KakaoAlimtalkTemplateEmphasizeType =
  | 'NONE'
  | 'TEXT'
  | 'IMAGE'
  | 'ITEM_LIST';

export const kakaoAlimtalkTemplateEmphasizeTypeSchema = z.enum([
  'NONE',
  'TEXT',
  'IMAGE',
  'ITEM_LIST',
]);

/**
 * @description 카카오 알림톡 템플릿 그룹 유형(기본값은 Channel)
 */
export type KakaoAlimtalkTemplateAssignType = 'CHANNEL' | 'GROUP';

export const kakaoAlimtalkTemplateAssignTypeSchema = z.enum([
  'CHANNEL',
  'GROUP',
]);

/**
 * @description 카카오 알림톡 템플릿 상태<br><br>
 * PENDING - 대기<br><br>
 * INSPECTING - 검수중<br><br>
 * APPROVED - 등록완료(검수완료)<br><br>
 * REJECTED - 반려됨<br><br>
 */
export type KakaoAlimtalkTemplateStatus =
  | 'PENDING'
  | 'INSPECTING'
  | 'APPROVED'
  | 'REJECTED';

export const kakaoAlimtalkTemplateStatusSchema = z.enum([
  'PENDING',
  'INSPECTING',
  'APPROVED',
  'REJECTED',
]);

/**
 * @description 알림톡 템플릿 댓글 타입
 */
export type KakaoAlimtalkTemplateCommentType = {
  isAdmin: boolean;
  memberId: string;
  content: string;
  dateCreated: string;
};

export const kakaoAlimtalkTemplateCommentTypeSchema = z.object({
  isAdmin: z.boolean(),
  memberId: z.string(),
  content: z.string(),
  dateCreated: z.string(),
});

export type KakaoAlimtalkTemplateHighlightType = {
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
};

export const kakaoAlimtalkTemplateHighlightTypeSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  imageId: z.string().nullable().optional(),
});

export type KakaoAlimtalkTemplateItemType = {
  list: Array<{
    title: string;
    description: string;
  }>;
  summary: {
    title?: string | null;
    description?: string | null;
  };
};

export const kakaoAlimtalkTemplateItemTypeSchema = z.object({
  list: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  summary: z.object({
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  }),
});

export const kakaoAlimtalkTemplateSchema = z.object({
  name: z.string().describe('템플릿 제목'),
  channelId: z
    .string()
    .nullable()
    .optional()
    .describe('카카오 비즈니스 채널 ID'),
  channelGroupId: z
    .string()
    .nullable()
    .optional()
    .describe('카카오 비즈니스 채널 그룹 ID'),
  content: z.string().optional().describe('알림톡 템플릿 내용'),
  isHidden: z.boolean().optional().describe('알림톡 템플릿 숨김 여부'),
  messageType:
    kakaoAlimtalkTemplateMessageTypeSchema.describe(
      '알림톡 템플릿 메시지 유형',
    ),
  emphasizeType: kakaoAlimtalkTemplateEmphasizeTypeSchema.describe('강조 유형'),
  extra: z.string().nullable().optional().describe('부가정보'),
  ad: z.string().nullable().optional().describe('간단 광고 문구'),
  emphasizeTitle: z
    .string()
    .nullable()
    .optional()
    .describe('강조표기 핵심문구'),
  emphasizeSubtitle: z
    .string()
    .nullable()
    .optional()
    .describe('강조표기 보조문구'),
  securityFlag: z.boolean().describe('PC 노출 여부'),
  imageId: z
    .string()
    .nullable()
    .optional()
    .describe('템플릿에 사용되는 이미지 ID'),
  assignType: kakaoAlimtalkTemplateAssignTypeSchema
    .optional()
    .describe('카카오 알림톡 템플릿 그룹 유형'),
  buttons: z
    .array(kakaoButtonSchema)
    .optional()
    .describe('카카오 알림톡 템플릿 버튼 목록'),
  comments: z
    .array(kakaoAlimtalkTemplateCommentTypeSchema)
    .optional()
    .describe('카카오 알림톡 템플릿 상태 현황목록'),
  commentable: z
    .boolean()
    .optional()
    .describe('의견을 남길 수 있는 템플릿 여부'),
  quickReplies: z
    .array(kakaoAlimtalkTemplateQuickReplySchema)
    .optional()
    .describe('바로가기 연결(링크) 목록'),
  header: z.string().nullable().optional().describe('아이템 리스트 용 헤더'),
  highlight: kakaoAlimtalkTemplateHighlightTypeSchema
    .optional()
    .describe('아이템 리스트용 하이라이트 정보 유형'),
  item: kakaoAlimtalkTemplateItemTypeSchema
    .optional()
    .describe('아이템 리스트 유형'),
  templateId: z.string().describe('카카오 알림톡 템플릿 ID'),
  code: z
    .string()
    .optional()
    .describe('긴급 검수를 위한 알림토 딜러사 측 템플릿 코드'),
  status:
    kakaoAlimtalkTemplateStatusSchema.describe('카카오 알림톡 템플릿 상태'),
  dateCreated: z.date().optional().describe('알림톡 템플릿 생성일자'),
  dateUpdated: z.date().optional().describe('알림톡 템플릿 수정일자'),
});

export type KakaoAlimtalkTemplateSchema = z.infer<
  typeof kakaoAlimtalkTemplateSchema
>;

export interface KakaoAlimtalkTemplateInterface {
  /**
   * @description 템플릿 제목
   */
  name: string;

  /**
   * @description 카카오 비즈니스 채널 ID
   */
  channelId?: string | null;

  /**
   * @description 카카오 비즈니스 채널 그룹 ID
   */
  channelGroupId?: string | null;

  /**
   * @description 알림톡 템플릿 내용
   */
  content?: string;

  /**
   * @description 알림톡 템플릿 숨김 여부
   */
  isHidden?: boolean;

  /**
   * @description 알림톡 템플릿 메시지 유형
   */
  messageType: KakaoAlimtalkTemplateMessageType;

  /**
   * @description 강조 유형
   */
  emphasizeType: KakaoAlimtalkTemplateEmphasizeType;

  /**
   * @description 부가정보. 메시지 유형이 "부가정보형"또는 "복합형"일 경우 필수
   */
  extra?: string | null;

  /**
   * @description 간단 광고 문구. 메시지 유형이 "광고추가형"또는 "복합형"일 경우 필수
   */
  ad?: string | null;

  /**
   * @description 강조표기 핵심문구(변수사용가능, emphasizeType이 TEXT일 경우 필수 값). 템플릿 내용에 강조표기할 핵심문구가 동일하게 포함되어 있어야합니다.
   */
  emphasizeTitle?: string | null;

  /**
   * @description 강조표기 보조문구(emphasizeType이 TEXT일 경우 필수 값). 템플릿 내용에 강조표기할 보조문구가 동일하게 포함되어 있어야합니다.
   */
  emphasizeSubtitle?: string | null;

  /**
   * @description PC 노출 여부. OTP, 보안 메시지의 경우 유저선택 무관 PC 미노출
   */
  securityFlag: boolean;

  /**
   * @description 템플릿에 사용되는 이미지 ID
   */
  imageId?: string | null;

  /**
   * @description 카카오 알림톡 템플릿 그룹 유형
   */
  assignType?: KakaoAlimtalkTemplateAssignType;

  /**
   * @description 카카오 알림톡 템플릿 버튼 목록
   */
  buttons?: Array<KakaoButton>;

  /**
   * @description 카카오 알림톡 템플릿 상태 현황목록, commentable이 true일 때만 해당 값이 표시됩니다.
   */
  comments?: Array<KakaoAlimtalkTemplateCommentType>;

  /**
   * @description 의견을 남길 수 있는 템플릿 여부
   */
  commentable?: boolean;

  /**
   * 바로가기 연결(링크) 목록
   */
  quickReplies?: Array<KakaoAlimtalkTemplateQuickReply>;

  /**
   * @description 아이템 리스트 용 헤더
   */
  header?: string | null;

  /**
   * @description 아이템 리스트용 하이라이트 정보 유형
   */
  highlight?: KakaoAlimtalkTemplateHighlightType;

  /**
   * @description 아이템 리스트 유형
   */
  item?: KakaoAlimtalkTemplateItemType;

  /**
   * @description 카카오 알림톡 템플릿 ID
   */
  templateId: string;

  /**
   * @description 긴급 검수를 위한 알림토 딜러사 측 템플릿 코드, commentable이 false일 때만 해당 코드가 표시됩니다.
   */
  code?: string;

  /**
   * @description 카카오 알림톡 템플릿 상태<br><br>
   * PENDING - 대기<br><br>
   * INSPECTING - 검수중<br><br>
   * APPROVED - 등록완료(검수완료)<br><br>
   * REJECTED - 반려됨<br><br>
   */
  status: KakaoAlimtalkTemplateStatus;
}

/**
 * @description 카카오 알림톡 템플릿 모델<br>
 * 알림톡 템플릿 자체의 정보는 아래 페이지를 참고해보세요!
 * @see https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide
 */
export class KakaoAlimtalkTemplate implements KakaoAlimtalkTemplateInterface {
  name: string;
  channelId?: string | null;
  channelGroupId?: string | null;
  content?: string;
  isHidden?: boolean;
  messageType: KakaoAlimtalkTemplateMessageType;
  emphasizeType: KakaoAlimtalkTemplateEmphasizeType;
  extra?: string | null;
  ad?: string | null;
  emphasizeTitle?: string | null;
  emphasizeSubtitle?: string | null;
  securityFlag: boolean;
  imageId?: string | null;
  assignType?: KakaoAlimtalkTemplateAssignType;
  buttons?: KakaoButton[];
  quickReplies?: KakaoAlimtalkTemplateQuickReply[];
  header?: string | null;
  highlight?: KakaoAlimtalkTemplateHighlightType;
  item?: KakaoAlimtalkTemplateItemType;
  templateId: string;
  commentable?: boolean;
  comments?: Array<KakaoAlimtalkTemplateCommentType>;
  code?: string;
  status: KakaoAlimtalkTemplateStatus;

  /**
   * 알림톡 템플릿 생성일자
   */
  dateCreated: Date;

  /**
   * 알림톡 템플릿 수정일자
   */
  dateUpdated: Date;

  constructor(
    parameter: KakaoAlimtalkTemplateInterface | GetKakaoTemplateResponse,
  ) {
    this.channelId = parameter.channelId;
    this.channelGroupId = parameter.channelGroupId;
    this.name = parameter.name;
    this.content = parameter.content;
    this.ad = parameter.ad;
    this.assignType = parameter.assignType;
    this.buttons = parameter.buttons;
    this.templateId = parameter.templateId;
    this.header = parameter.header;
    this.item = parameter.item;
    this.highlight = parameter.highlight;
    this.securityFlag = parameter.securityFlag;
    this.isHidden = parameter.isHidden;
    this.messageType = parameter.messageType;
    this.emphasizeType = parameter.emphasizeType;
    this.extra = parameter.extra;
    this.emphasizeTitle = parameter.emphasizeTitle;
    this.emphasizeSubtitle = parameter.emphasizeSubtitle;
    this.imageId = parameter.imageId;
    this.quickReplies = parameter.quickReplies;
    this.comments = parameter.comments;
    this.commentable = parameter.commentable;
    this.code = parameter.code;
    this.status = parameter.status;

    if ('dateCreated' in parameter) {
      this.dateCreated = stringDateTransfer(parameter.dateCreated);
    }
    if ('dateUpdated' in parameter) {
      this.dateUpdated = stringDateTransfer(parameter.dateUpdated);
    }
  }
}
