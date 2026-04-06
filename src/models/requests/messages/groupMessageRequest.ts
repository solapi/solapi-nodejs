import {Schema} from 'effect';
import {messageSchema} from '../../base/messages/message';
import {defaultAgentTypeSchema} from './requestConfig';

/**
 * 그룹 메시지 추가 요청
 */
export const groupMessageAddRequestSchema = Schema.Struct({
  messages: Schema.Array(messageSchema),
});
export type GroupMessageAddRequest = Schema.Schema.Type<
  typeof groupMessageAddRequestSchema
>;

/**
 * 그룹 예약 발송 설�� 요청
 */
export const scheduledDateSendingRequestSchema = Schema.Struct({
  scheduledDate: Schema.String,
});
export type ScheduledDateSendingRequest = Schema.Schema.Type<
  typeof scheduledDateSendingRequestSchema
>;

/**
 * 그룹에서 특정 메시�� 삭제 요청
 */
export const removeMessageIdsToGroupRequestSchema = Schema.Struct({
  messageIds: Schema.Array(Schema.String),
});
export type RemoveMessageIdsToGroupRequest = Schema.Schema.Type<
  typeof removeMessageIdsToGroupRequestSchema
>;

/**
 * 그룹 내 메시지 목록 조회 요청
 */
export const getGroupMessagesRequestSchema = Schema.Struct({
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
});
export type GetGroupMessagesRequest = Schema.Schema.Type<
  typeof getGroupMessagesRequestSchema
>;

/**
 * Storage API에서 사용하는 파일 ID 컬렉션 타입
 */
export const fileIdsSchema = Schema.Struct({
  fileIds: Schema.Array(Schema.String),
});
export type FileIds = Schema.Schema.Type<typeof fileIdsSchema>;

export const fileTypeSchema = Schema.Literal(
  'KAKAO',
  'MMS',
  'DOCUMENT',
  'RCS',
  'FAX',
  'BMS',
  'BMS_WIDE',
  'BMS_WIDE_MAIN_ITEM_LIST',
  'BMS_WIDE_SUB_ITEM_LIST',
  'BMS_CAROUSEL_FEED_LIST',
  'BMS_CAROUSEL_COMMERCE_LIST',
);
export type FileType = Schema.Schema.Type<typeof fileTypeSchema>;

export const fileUploadRequestSchema = Schema.Struct({
  file: Schema.String,
  type: fileTypeSchema,
  name: Schema.optional(Schema.String),
  link: Schema.optional(Schema.String),
});
export type FileUploadRequest = Schema.Schema.Type<
  typeof fileUploadRequestSchema
>;

/**
 * 그룹 생성 요청 타입
 */
export const createGroupRequestSchema = Schema.extend(
  defaultAgentTypeSchema,
  Schema.Struct({
    allowDuplicates: Schema.Boolean,
    appId: Schema.optional(Schema.String),
    customFields: Schema.optional(
      Schema.Record({key: Schema.String, value: Schema.String}),
    ),
  }),
);
export type CreateGroupRequest = Schema.Schema.Type<
  typeof createGroupRequestSchema
>;
