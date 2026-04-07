import {formatWithTransfer} from '@lib/stringDateTrasnfer';
import {Schema} from 'effect';
import {messageTypeSchema} from '../../base/messages/message';

export const dateTypeSchema = Schema.Literal('CREATED', 'UPDATED');
export type DateType = Schema.Schema.Type<typeof dateTypeSchema>;

const baseGetMessagesRequestSchema = Schema.Struct({
  startKey: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
  messageId: Schema.optional(Schema.String),
  messageIds: Schema.optional(Schema.Array(Schema.String)),
  groupId: Schema.optional(Schema.String),
  to: Schema.optional(Schema.String),
  from: Schema.optional(Schema.String),
  type: Schema.optional(messageTypeSchema),
  statusCode: Schema.optional(Schema.String),
  dateType: Schema.optional(dateTypeSchema),
  startDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
  endDate: Schema.optional(Schema.Union(Schema.String, Schema.DateFromSelf)),
});

// dateType은 startDate 또는 endDate가 함께 제공될 때만 유효
export const getMessagesRequestSchema = baseGetMessagesRequestSchema.pipe(
  Schema.filter(data => {
    const hasDate = data.startDate != null || data.endDate != null;
    const hasDateType = data.dateType != null;
    if (hasDateType && !hasDate) {
      return 'dateType은 startDate 또는 endDate와 함께 사용해야 합니다.';
    }
    return true;
  }),
);
export type GetMessagesRequest = Schema.Schema.Type<
  typeof getMessagesRequestSchema
>;

export type GetMessagesFinalizedPayload = {
  startKey?: string;
  limit?: number;
  dateType?: DateType;
  messageId?: string;
  messageIds?: ReadonlyArray<string>;
  groupId?: string;
  to?: string;
  from?: string;
  type?: string;
  statusCode?: string;
  startDate?: string;
  endDate?: string;
};

export function finalizeGetMessagesRequest(
  data?: GetMessagesRequest,
): GetMessagesFinalizedPayload {
  if (!data) return {};

  const payload: GetMessagesFinalizedPayload = {
    startKey: data.startKey,
    limit: data.limit,
    dateType: data.dateType ?? 'CREATED',
    messageId: data.messageId,
    messageIds: data.messageIds,
    groupId: data.groupId,
    to: data.to,
    from: data.from,
    type: data.type,
    statusCode: data.statusCode,
  };

  if (data.startDate != null) {
    payload.startDate = formatWithTransfer(data.startDate);
  }
  if (data.endDate != null) {
    payload.endDate = formatWithTransfer(data.endDate);
  }

  return payload;
}
