import {formatWithTransfer} from '@lib/stringDateTransfer';
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
type BaseGetMessagesFields = Omit<
  Schema.Schema.Type<typeof baseGetMessagesRequestSchema>,
  'dateType' | 'startDate' | 'endDate'
>;

type GetMessagesRequestWithoutDate = BaseGetMessagesFields & {
  dateType?: never;
  startDate?: never;
  endDate?: never;
};

type GetMessagesRequestWithStartDate = BaseGetMessagesFields & {
  dateType?: DateType;
  startDate: string | Date;
  endDate?: string | Date;
};

type GetMessagesRequestWithEndDate = BaseGetMessagesFields & {
  dateType?: DateType;
  startDate?: string | Date;
  endDate: string | Date;
};

export type GetMessagesRequest =
  | GetMessagesRequestWithoutDate
  | GetMessagesRequestWithStartDate
  | GetMessagesRequestWithEndDate;

type GetMessagesRequestDecoded = Schema.Schema.Type<
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
  data?: GetMessagesRequest | GetMessagesRequestDecoded,
): GetMessagesFinalizedPayload {
  if (!data) return {};

  const payload: GetMessagesFinalizedPayload = {
    startKey: data.startKey,
    limit: data.limit,
    dateType:
      data.startDate != null || data.endDate != null
        ? (data.dateType ?? 'CREATED')
        : data.dateType,
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
