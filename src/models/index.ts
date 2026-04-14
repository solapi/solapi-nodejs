// Base Models - Messages

// Base Models - Kakao BMS
export * from './base/kakao/bms';

// Base Models - Kakao
export {
  decodeKakaoAlimtalkTemplate,
  type KakaoAlimtalkTemplate,
  type KakaoAlimtalkTemplateAssignType,
  type KakaoAlimtalkTemplateCategory,
  type KakaoAlimtalkTemplateCommentType,
  type KakaoAlimtalkTemplateEmphasizeType,
  type KakaoAlimtalkTemplateHighlightType,
  type KakaoAlimtalkTemplateInterface,
  type KakaoAlimtalkTemplateItemType,
  type KakaoAlimtalkTemplateMessageType,
  type KakaoAlimtalkTemplateSchema,
  type KakaoAlimtalkTemplateStatus,
  kakaoAlimtalkTemplateAssignTypeSchema,
  kakaoAlimtalkTemplateCommentTypeSchema,
  kakaoAlimtalkTemplateEmphasizeTypeSchema,
  kakaoAlimtalkTemplateHighlightTypeSchema,
  kakaoAlimtalkTemplateItemTypeSchema,
  kakaoAlimtalkTemplateMessageTypeSchema,
  kakaoAlimtalkTemplateSchema,
  kakaoAlimtalkTemplateStatusSchema,
} from './base/kakao/kakaoAlimtalkTemplate';

export {
  type KakaoAlimtalkTemplateQuickReply,
  type KakaoAlimtalkTemplateQuickReplyAppLink,
  type KakaoAlimtalkTemplateQuickReplyDefault,
  type KakaoAlimtalkTemplateQuickReplySchema,
  type KakaoAlimtalkTemplateQuickReplyWebLink,
  kakaoAlimtalkTemplateQuickReplyAppLinkSchema,
  kakaoAlimtalkTemplateQuickReplyDefaultSchema,
  kakaoAlimtalkTemplateQuickReplySchema,
  kakaoAlimtalkTemplateQuickReplyWebLinkSchema,
} from './base/kakao/kakaoAlimtalkTemplateQuickReply';

export {
  type KakaoButton,
  type KakaoButtonSchema,
  type KakaoButtonType,
  kakaoButtonSchema,
} from './base/kakao/kakaoButton';

export {
  decodeKakaoChannel,
  type KakaoChannel,
  type KakaoChannelCategory,
  type KakaoChannelInterface,
  type KakaoChannelSchema,
  kakaoChannelCategorySchema,
  kakaoChannelSchema,
} from './base/kakao/kakaoChannel';

export {
  type BmsChatBubbleType,
  baseKakaoOptionSchema,
  bmsChatBubbleTypeSchema,
  type KakaoOptionBmsSchema,
  transformVariables,
  VariableValidationError,
  validateVariableNames,
} from './base/kakao/kakaoOption';
export {
  type MessageSchema,
  type MessageType,
  messageSchema,
  messageTypeSchema,
} from './base/messages/message';
// Base Models - Naver
export {
  type NaverOptionSchema,
  naverOptionSchema,
} from './base/naver/naverOption';
// Base Models - RCS
export {
  type RcsButton,
  type RcsButtonSchema,
  type RcsButtonType,
  rcsButtonSchema,
} from './base/rcs/rcsButton';
export {
  type AdditionalBody,
  additionalBodySchema,
  type RcsOptionRequest,
  type RcsOptionSchema,
  rcsOptionRequestSchema,
  rcsOptionSchema,
} from './base/rcs/rcsOption';

// Requests
export * from './requests/index';

// Responses
export * from './responses/index';
